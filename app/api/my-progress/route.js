import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Use service role key to bypass RLS, because anonymous users can't use RLS to fetch their own data by email securely
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    // Fetch attempts that match this email and where user_type is 'free' (or 'anonymous')
    const { data, error } = await supabase
      .from('practice_attempts')
      .select('*, practice_materials(title, level)')
      .eq('email', email)
      .in('user_type', ['free', 'anonymous', null]) // handle possible legacy types
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[my-progress] Supabase Error:', error.message);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    return NextResponse.json({ attempts: data }, { status: 200 });

  } catch (error) {
    console.error('[my-progress] Server Error:', error.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
