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

    const { data, error } = await supabase.from('practice_attempts').insert([{
      material_id,
      first_name,
      last_name,
      phone,
      email: email || null,
      country: country || 'Pakistan',
      score: score ?? null,
      total_marks: total_marks ?? null,
      answers: answers || null,
      access_code_used: access_code_used || null
    }]).select();

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
