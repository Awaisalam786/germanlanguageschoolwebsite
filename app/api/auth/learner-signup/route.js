import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password, phone } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters.' },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();
    const displayName = (name || '').trim() || trimmedEmail.split('@')[0];
    const userPhone = (phone || '').trim();

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Create user via admin API with email auto-confirmed so learners can start immediately
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: trimmedEmail,
      password: password,
      email_confirm: true,
      user_metadata: {
        name: displayName,
        phone: userPhone,
        role: 'learner'
      }
    });

    if (error) {
      console.error('[learner-signup] Supabase error:', error.message);
      let userFriendlyMessage = error.message;
      if (error.message.includes('already registered') || error.message.includes('unique constraint')) {
        userFriendlyMessage = 'An account with this email already exists. Please log in instead.';
      }
      return NextResponse.json({ error: userFriendlyMessage }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
        name: displayName,
        phone: userPhone
      }
    }, { status: 201 });

  } catch (err) {
    console.error('[learner-signup] Server error:', err);
    return NextResponse.json(
      { error: 'Server error creating learner account. Please try again.' },
      { status: 500 }
    );
  }
}
