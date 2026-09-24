import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(request) {
  try {
    const data = await request.json();
    const { 
      user_type: requestedUserType, name, email, phone, access_code_used, 
      level, passage_id, score, total_marks, percentage 
    } = data;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Cryptographically verify access token on server
    let verifiedUserId = null;
    let effectiveName = name || null;
    let effectiveEmail = email || null;
    let effectiveUserType = requestedUserType === 'student' ? 'student' : (requestedUserType || 'anonymous');

    // ONLY verify and attach user_id if this is a public learner, NEVER for internal enrolled students
    if (effectiveUserType !== 'student') {
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.slice(7).trim();
        if (token) {
          const { data: { user }, error: authErr } = await supabase.auth.getUser(token);
          if (!authErr && user?.id) {
            verifiedUserId = user.id; // Derive user_id ONLY from verified session
            effectiveUserType = 'free';
            effectiveEmail = user.email;
            effectiveName = user.user_metadata?.name || name || user.email.split('@')[0];
          }
        }
      }
    }

    const payload = {
      user_type: effectiveUserType,
      name: effectiveName,
      email: effectiveEmail,
      phone: phone || null,
      level,
      passage_id,
      score,
      total_marks,
      percentage,
    };

    if (effectiveUserType === 'student') {
      payload.access_code_used = access_code_used || null;
    }

    // Attach verified user_id (ignoring any browser-supplied user_id)
    if (verifiedUserId && effectiveUserType !== 'student') {
      payload.user_id = verifiedUserId;
    }

    let { error } = await supabase
      .from('reading_attempts')
      .insert([payload]);

    // If reading_attempts lacks user_id column in database before migration is applied,
    // gracefully catch and retry without user_id so test submission succeeds
    if (error && error.message && error.message.includes('user_id')) {
      delete payload.user_id;
      const retry = await supabase.from('reading_attempts').insert([payload]);
      error = retry.error;
    }

    if (error) {
      console.error('[save-reading-attempt] Insert error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (err) {
    console.error('[save-reading-attempt] Server error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
