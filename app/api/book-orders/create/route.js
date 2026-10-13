import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// In-memory instance-level rate limiting map (IP -> timestamps).
// NOTE: On Vercel serverless, this provides per-instance burst throttling.
// It is NOT a distributed rate limiter (which would require an external store like Redis/Upstash).
const rateLimitMap = new Map();

function isRateLimited(ip) {
  if (!ip) return false;
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute window
  const maxRequests = 5;      // Max 5 requests per minute per warm container instance

  const timestamps = rateLimitMap.get(ip) || [];
  const validTimestamps = timestamps.filter(t => now - t < windowMs);

  if (validTimestamps.length >= maxRequests) {
    return true;
  }

  validTimestamps.push(now);
  rateLimitMap.set(ip, validTimestamps);
  return false;
}

export async function POST(request) {
  try {
    // 1. Instance-level burst protection
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
               request.headers.get('x-real-ip') || 
               'unknown';

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many order requests. Please wait a minute before trying again.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const {
      book_id,
      customer_name,
      phone_number,
      delivery_address,
      city,
      quantity = 1
    } = body;

    // 2. Strict Input Validation & Boundaries
    if (!book_id || typeof book_id !== 'string') {
      return NextResponse.json({ error: 'Book selection is required.' }, { status: 400 });
    }
    if (!customer_name || typeof customer_name !== 'string' || customer_name.trim().length < 2 || customer_name.trim().length > 100) {
      return NextResponse.json({ error: 'Please provide a valid full name (2–100 characters).' }, { status: 400 });
    }
    if (!phone_number || typeof phone_number !== 'string' || phone_number.trim().length < 7 || phone_number.trim().length > 25) {
      return NextResponse.json({ error: 'Please provide a valid phone or WhatsApp number (7–25 digits).' }, { status: 400 });
    }
    if (!delivery_address || typeof delivery_address !== 'string' || delivery_address.trim().length < 5 || delivery_address.trim().length > 300) {
      return NextResponse.json({ error: 'Please provide a complete delivery address (5–300 characters).' }, { status: 400 });
    }
    if (!city || typeof city !== 'string' || city.trim().length < 2 || city.trim().length > 50) {
      return NextResponse.json({ error: 'Please specify your city (2–50 characters).' }, { status: 400 });
    }

    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty < 1 || qty > 20) {
      return NextResponse.json({ error: 'Quantity must be between 1 and 20.' }, { status: 400 });
    }

    // 3. Initialise secure server-only Supabase client (service role key never leaks to client)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceKey) {
      console.error('[book-orders] Server configuration error: Supabase credentials missing.');
      return NextResponse.json(
        { error: 'We could not submit your order right now. Please try again or contact us on WhatsApp.' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false }
    });

    // 4. Fetch genuine book from database to compute authoritative pricing
    const { data: book, error: bookError } = await supabase
      .from('books')
      .select('id, title, price_pkr, is_active')
      .eq('id', book_id)
      .single();

    if (bookError || !book) {
      return NextResponse.json({ error: 'The selected book could not be found.' }, { status: 404 });
    }

    if (book.is_active === false) {
      return NextResponse.json({ error: 'This book is currently out of stock.' }, { status: 400 });
    }

    // Authoritative server-calculated prices (ignoring any client price tampering)
    const unitPricePkr = Math.max(0, Number(book.price_pkr || 0));
    const totalPricePkr = unitPricePkr * qty;
    const finalPayablePkr = totalPricePkr;

    // 5. Cryptographically secure order reference generation with collision retry
    // Format: GLS-BK-[6-digit CSPRNG]-[4-char Hex CSPRNG] (e.g. GLS-BK-839214-A3F1)
    let orderRef;
    let insertSuccessful = false;
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts && !insertSuccessful) {
      attempts++;
      const randInt = crypto.randomInt(100000, 1000000); // CSPRNG integer
      const randHex = crypto.randomBytes(2).toString('hex').toUpperCase(); // CSPRNG 2-byte hex
      orderRef = `GLS-BK-${randInt}-${randHex}`;

      // 6. Record order in database (book_manual_orders)
      // Enforcing strict default statuses: customer CANNOT set payment status to Paid
      const orderPayload = {
        order_ref: orderRef,
        book_id: book.id,
        book_title: book.title,
        customer_name: customer_name.trim(),
        phone_number: phone_number.trim(),
        delivery_address: delivery_address.trim(),
        city: city.trim(),
        quantity: qty,
        unit_price_pkr: unitPricePkr,
        total_price_pkr: totalPricePkr,
        coupon_code: null,
        discount_amount: 0,
        final_payable_pkr: finalPayablePkr,
        payment_status: 'Pending Confirmation',
        dispatch_status: 'Processing',
        notes: null
      };

      const { error: insertError } = await supabase
        .from('book_manual_orders')
        .insert([orderPayload]);

      if (!insertError) {
        insertSuccessful = true;
        break;
      }

      // Retry ONLY when the UNIQUE violation is specifically caused by duplicate order_ref
      const isOrderRefCollision = insertError.code === '23505' && (
        insertError.message?.toLowerCase().includes('order_ref') || 
        insertError.details?.toLowerCase().includes('order_ref')
      );

      if (isOrderRefCollision && attempts < maxAttempts) {
        console.warn(`[book-orders] Unique order_ref collision detected, retrying with fresh reference (attempt ${attempts + 1})...`);
        continue;
      }

      // Safe diagnostic log: strictly avoids logging customer name, phone, address, or credentials
      console.error('[book-orders] Order creation failed:', {
        code: insertError.code,
        book_id: book.id,
        attempts
      });

      return NextResponse.json(
        { error: 'We could not submit your order right now. Please try again or contact us on WhatsApp.' },
        { status: 500 }
      );
    }

    if (!insertSuccessful) {
      console.error('[book-orders] Order reference generation exhausted attempts for book_id:', book.id);
      return NextResponse.json(
        { error: 'We could not submit your order right now. Please try again or contact us on WhatsApp.' },
        { status: 500 }
      );
    }

    // 7. Format WhatsApp order message
    const formattedAmount = `₨ ${finalPayablePkr.toLocaleString()} PKR`;
    const lines = [
      `📚 *German Learning School — Book Order Request*`,
      `*Order Ref:* ${orderRef}`,
      `*Book:* ${book.title}`,
      `*Quantity:* ${qty}`,
      `*Estimated Amount:* ${formattedAmount}`,
      ``,
      `*Customer Information:*`,
      `• *Name:* ${customer_name.trim()}`,
      `• *Phone:* ${phone_number.trim()}`,
      `• *City:* ${city.trim()}`,
      `• *Delivery Address:* ${delivery_address.trim()}`,
      ``,
      `Please confirm stock availability, delivery charges, and manual payment account details.`
    ];

    const waText = lines.join('\n');

    // Retrieve configured business phone from global_settings or fallback
    const { data: globalSettings } = await supabase
      .from('global_settings')
      .select('whatsapp_number')
      .limit(1)
      .single();

    const businessWa = (globalSettings?.whatsapp_number || '03421189593').replace(/^0/, '92').replace(/[^0-9]/g, '');
    const whatsappUrl = `https://wa.me/${businessWa}?text=${encodeURIComponent(waText)}`;

    return NextResponse.json({
      success: true,
      order_ref: orderRef,
      book_title: book.title,
      final_payable_pkr: finalPayablePkr,
      whatsapp_url: whatsappUrl,
      whatsapp_text: waText
    });

  } catch (err) {
    console.error('[book-orders] Unexpected server error occurred during order creation.');
    return NextResponse.json(
      { error: 'We could not submit your order right now. Please try again or contact us on WhatsApp.' },
      { status: 500 }
    );
  }
}
