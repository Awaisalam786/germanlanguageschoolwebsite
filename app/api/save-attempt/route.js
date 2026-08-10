import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      material_id, user_type,
      first_name, last_name, phone, email,
      access_code_used,
      score, total_marks, percentage,
      answers, country
    } = body;

    console.log('[save-attempt] Received:', { user_type, first_name, phone, access_code_used, score });

    // Validate based on user_type
    if (user_type === 'anonymous' && (!first_name || !phone)) {
      return NextResponse.json({ error: 'first_name and phone are required for anonymous users' }, { status: 400 });
    }
    if (user_type === 'student' && !access_code_used) {
      return NextResponse.json({ error: 'access_code_used is required for student users' }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    const payload = {
      material_id: material_id || null,
      user_type: user_type || 'anonymous',
      first_name: first_name || null,
      last_name: last_name || null,
      phone: phone || null,
      email: email || null,
      access_code_used: access_code_used || null,
      score: score ?? null,
      total_marks: total_marks ?? null,
      percentage: percentage ?? null,
      answers: answers || null,
      country: country || 'Pakistan',
    };

    let { data, error } = await supabase.from('practice_attempts').insert([payload]).select();

    // PGRST204 = column missing — retry with reduced payload
    if (error && (error.code === 'PGRST204' || (error.message && error.message.includes('column')))) {
      console.warn('[save-attempt] Column missing, retrying with core fields. Error:', error.message);
      const corePayload = {
        user_type: user_type || 'anonymous',
        score: score ?? null,
        ...(first_name && { first_name }),
        ...(phone && { phone }),
        ...(access_code_used && { access_code_used }),
        ...(material_id && { material_id }),
      };
      const retry = await supabase.from('practice_attempts').insert([corePayload]).select();
      data = retry.data;
      error = retry.error;
    }

    if (error) {
      console.error('[save-attempt] Insert error:', { message: error.message, code: error.code, details: error.details });
      return NextResponse.json({ error: error.message, code: error.code, details: error.details }, { status: 500 });
    }

    console.log('[save-attempt] Saved:', data);
    return NextResponse.json({ success: true, data });

  } catch (err) {
    console.error('[save-attempt] Unexpected error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
