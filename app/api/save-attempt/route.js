import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      material_id, user_type,
      first_name, last_name, phone, email,
      access_code_used, user_id,
      score, total_marks, percentage,
      answers, country
    } = body;

    console.log('[save-attempt] Received:', { user_type, user_id, first_name, phone, access_code_used, score });

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    // First, discover what columns actually exist in the table
    const { data: columnInfo } = await supabase
      .from('practice_attempts')
      .select('*')
      .limit(0);

    // Build payload dynamically based on what columns exist
    // We'll try a progressive approach: start with known-safe columns and add more
    
    // Determine student display name (handles both 'student_name' and 'first_name' columns)
    const displayName = first_name
      ? (last_name ? `${first_name} ${last_name}` : first_name)
      : (access_code_used || 'Student');

    // Try full insert first
    const fullPayload = {
      material_id: material_id || null,
      score: score ?? null,
      country: country || 'Pakistan',
    };

    // Add fields that may or may not exist — we'll try and catch
    if (user_type !== undefined) fullPayload.user_type = user_type || 'anonymous';
    if (first_name) fullPayload.first_name = first_name;
    if (last_name) fullPayload.last_name = last_name;
    if (phone) fullPayload.phone = phone;
    if (email) fullPayload.email = email;
    if (access_code_used) fullPayload.access_code_used = access_code_used;
    if (total_marks != null) fullPayload.total_marks = total_marks;
    if (percentage != null) fullPayload.percentage = percentage;
    if (answers) fullPayload.answers = answers;
    if (user_id) fullPayload.user_id = user_id;

    // Also try legacy column names the table might have
    if (first_name || access_code_used) {
      fullPayload.student_name = displayName; // legacy column
    }

    let { data, error } = await supabase.from('practice_attempts').insert([fullPayload]).select();

    // If error, progressively strip unknown columns and retry
    if (error) {
      console.warn('[save-attempt] Full insert failed:', error.message, '— stripping unknown columns...');

      // Extract the unknown column name from the error message
      const unknownColMatch = error.message.match(/column[s]? "([^"]+)"/);
      const badCol = unknownColMatch ? unknownColMatch[1] : null;

      if (badCol && fullPayload[badCol] !== undefined) {
        delete fullPayload[badCol];
        console.log('[save-attempt] Removed column:', badCol, '— retrying...');
        const retry1 = await supabase.from('practice_attempts').insert([fullPayload]).select();
        data = retry1.data;
        error = retry1.error;
      }

      // If still failing, try another round of stripping
      if (error) {
        const unknownColMatch2 = error.message.match(/column[s]? "([^"]+)"/);
        const badCol2 = unknownColMatch2 ? unknownColMatch2[1] : null;
        if (badCol2 && fullPayload[badCol2] !== undefined) {
          delete fullPayload[badCol2];
          console.log('[save-attempt] Removed column:', badCol2, '— retrying...');
          const retry2 = await supabase.from('practice_attempts').insert([fullPayload]).select();
          data = retry2.data;
          error = retry2.error;
        }
      }

      // If STILL failing, check for NOT NULL violations and handle required cols
      if (error && error.code === '23502') {
        // NOT NULL constraint — figure out what column needs a value
        const notNullMatch = error.message.match(/column "([^"]+)"/);
        const requiredCol = notNullMatch ? notNullMatch[1] : null;
        if (requiredCol) {
          // Provide a fallback value for the required column
          fullPayload[requiredCol] = displayName || 'Unknown';
          console.log('[save-attempt] Filling required NOT NULL col:', requiredCol, '=', fullPayload[requiredCol]);
          const retry3 = await supabase.from('practice_attempts').insert([fullPayload]).select();
          data = retry3.data;
          error = retry3.error;
        }
      }
    }

    if (error) {
      console.error('[save-attempt] Final error:', { message: error.message, code: error.code, details: error.details });
      return NextResponse.json({ error: error.message, code: error.code, details: error.details }, { status: 500 });
    }

    console.log('[save-attempt] Saved successfully');
    return NextResponse.json({ success: true, data });

  } catch (err) {
    console.error('[save-attempt] Unexpected error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
