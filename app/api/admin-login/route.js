import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // 1. Verify against Vercel .env variables
    const validEmail = process.env.ADMIN_EMAIL;
    const validPassword = process.env.ADMIN_PASSWORD;

    if (!validEmail || !validPassword) {
      return NextResponse.json(
        { error: 'Server configuration error: ADMIN_EMAIL or ADMIN_PASSWORD not set in environment.' },
        { status: 500 }
      );
    }

    if (email !== validEmail || password !== validPassword) {
      return NextResponse.json(
        { error: 'Invalid admin credentials.' },
        { status: 401 }
      );
    }

    // 2. If valid, authenticate with the hidden system Supabase account to generate a valid RLS session
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const systemEmail = process.env.SYSTEM_SUPABASE_EMAIL || 'awaisalam506@gmail.com';
    const systemPassword = process.env.SYSTEM_SUPABASE_PASSWORD || 'ranaawaisalam12345';

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: systemEmail,
      password: systemPassword,
    });

    if (error) {
      console.error('System Supabase Auth Error:', error.message);
      return NextResponse.json(
        { error: 'Internal system authentication failed. Please check system credentials.' },
        { status: 500 }
      );
    }

    // 3. Return the session to the client so it can access the database securely
    return NextResponse.json({ session: data.session });

  } catch (err) {
    console.error('Admin Login API Error:', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
