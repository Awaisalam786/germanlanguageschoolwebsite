import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request) {
  try {
    const body = await request.json();
    const { material_id, first_name, last_name, phone, email, country, score, total_marks, answers, access_code_used } = body;

    console.log('[save-attempt] Received payload:', body);

    if (!first_name || !phone) {
      return NextResponse.json({ error: 'first_name and phone are required' }, { status: 400 });
    }

    // Use service role to bypass RLS — students are not authenticated
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    // Full payload with all columns
    const fullPayload = {
      material_id: material_id || null,
      first_name,
      last_name: last_name || null,
      phone,
      email: email || null,
      country: country || 'Pakistan',
      score: score ?? null,
      total_marks: total_marks ?? null,
      answers: answers || null,
      access_code_used: access_code_used || null
    };

    let { data, error } = await supabase.from('practice_attempts').insert([fullPayload]).select();

    // PGRST204 = column not found in schema cache — gracefully retry with minimal required columns only
    if (error && (error.code === 'PGRST204' || (error.message && error.message.includes('column')))) {
      console.warn('[save-attempt] Schema mismatch, retrying with core columns only. Error was:', error.message);

      const corePayload = {
        first_name,
        phone,
        score: score ?? null,
      };
      if (last_name) corePayload.last_name = last_name;
      if (email) corePayload.email = email;
      if (material_id) corePayload.material_id = material_id;
      if (total_marks) corePayload.total_marks = total_marks;

      const retryResult = await supabase.from('practice_attempts').insert([corePayload]).select();
      data = retryResult.data;
      error = retryResult.error;
    }

    if (error) {
      console.error('[save-attempt] Supabase insert error:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      return NextResponse.json({ error: error.message, code: error.code, details: error.details }, { status: 500 });
    }

    console.log('[save-attempt] Saved successfully:', data);
    return NextResponse.json({ success: true, data });

  } catch (err) {
    console.error('[save-attempt] Unexpected error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
