import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request) {
  try {
    const data = await request.json();
    const { 
      user_type, name, email, phone, access_code_used, 
      level, passage_id, score, total_marks, percentage 
    } = data;

    const payload = {
      user_type,
      name,
      email,
      phone,
      access_code_used,
      level,
      passage_id,
      score,
      total_marks,
      percentage,
    };

    const { error } = await supabase
      .from('reading_attempts')
      .insert([payload]);

    if (error) {
      console.error('Error inserting reading attempt:', error);
      return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });

  } catch (err) {
    console.error('Server error saving reading attempt:', err);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
