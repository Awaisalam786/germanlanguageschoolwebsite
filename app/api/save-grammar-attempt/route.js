import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req) {
  try {
    const payload = await req.json();

    const {
      user_type,
      name,
      email,
      phone,
      access_code_used,
      level,
      chapters_selected,
      total_questions,
      correct_count,
      wrong_count,
      percentage,
      question_results,
    } = payload;

    // Optional basic validation
    if (!user_type || !level || total_questions === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('grammar_attempts')
      .insert([
        {
          user_type,
          name: name || null,
          email: email || null,
          phone: phone || null,
          access_code_used: access_code_used || null,
          level,
          chapters_selected: chapters_selected || '',
          total_questions,
          correct_count,
          wrong_count,
          percentage,
          question_results: question_results || [],
        },
      ]);

    if (error) {
      console.error('Supabase insert error (grammar_attempts):', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (err) {
    console.error('Server error (save-grammar-attempt):', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
