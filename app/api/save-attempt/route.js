import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      material_id, user_type: requestedUserType,
      first_name, last_name, phone, email,
      access_code_used,
      score, total_marks, percentage,
      answers, country,
      student_name, batch_name
    } = body;

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    // Cryptographically verify access token from Authorization header on the server
    let verifiedUserId = null;
    let effectiveEmail = email || null;
    let effectiveFirstName = first_name || null;
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
            effectiveFirstName = user.user_metadata?.name || first_name || user.email.split('@')[0];
          }
        }
      }
    }

    // Determine student display name
    const displayName = effectiveFirstName
      ? (last_name ? `${effectiveFirstName} ${last_name}` : effectiveFirstName)
      : (access_code_used || 'Student');

    // Build payload
    const fullPayload = {
      material_id: material_id || null,
      score: score ?? null,
      country: country || 'Pakistan',
      user_type: effectiveUserType,
    };

    if (effectiveFirstName) fullPayload.first_name = effectiveFirstName;
    if (last_name) fullPayload.last_name = last_name;
    if (phone) {
      fullPayload.phone = phone;
      fullPayload.student_phone = phone;
    } else {
      fullPayload.student_phone = 'N/A';
    }
    if (effectiveEmail) fullPayload.email = effectiveEmail;
    if (total_marks != null) fullPayload.total_marks = total_marks;
    if (percentage != null) fullPayload.percentage = percentage;
    if (answers) fullPayload.answers = answers;

    // Assign ONLY the cryptographically verified user_id; ignore any browser-supplied user_id
    if (verifiedUserId && effectiveUserType !== 'student') {
      fullPayload.user_id = verifiedUserId;
    }

    // Preserve internal student access code details if student
    if (effectiveUserType === 'student') {
      if (access_code_used) fullPayload.access_code_used = access_code_used;
      if (student_name) fullPayload.student_name = student_name;
      if (batch_name) fullPayload.batch_name = batch_name;
    }

    if (!student_name && (effectiveFirstName || access_code_used)) {
      fullPayload.student_name = displayName;
    }

    let { data, error } = await supabase.from('practice_attempts').insert([fullPayload]).select();

    // If error, progressively strip unknown columns and retry
    if (error) {
      console.warn('[save-attempt] Full insert failed:', error.message, '— stripping unknown columns...');

      const unknownColMatch = error.message.match(/column[s]? "([^"]+)"/);
      const badCol = unknownColMatch ? unknownColMatch[1] : null;

      if (badCol && fullPayload[badCol] !== undefined) {
        delete fullPayload[badCol];
        const retry1 = await supabase.from('practice_attempts').insert([fullPayload]).select();
        data = retry1.data;
        error = retry1.error;
      }

      if (error) {
        const unknownColMatch2 = error.message.match(/column[s]? "([^"]+)"/);
        const badCol2 = unknownColMatch2 ? unknownColMatch2[1] : null;
        if (badCol2 && fullPayload[badCol2] !== undefined) {
          delete fullPayload[badCol2];
          const retry2 = await supabase.from('practice_attempts').insert([fullPayload]).select();
          data = retry2.data;
          error = retry2.error;
        }
      }

      if (error && error.code === '23502') {
        const notNullMatch = error.message.match(/column "([^"]+)"/);
        const requiredCol = notNullMatch ? notNullMatch[1] : null;
        if (requiredCol) {
          fullPayload[requiredCol] = displayName || 'Unknown';
          const retry3 = await supabase.from('practice_attempts').insert([fullPayload]).select();
          data = retry3.data;
          error = retry3.error;
        }
      }
    }

    if (error) {
      console.error('[save-attempt] Final error:', { message: error.message, code: error.code });
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });

  } catch (err) {
    console.error('[save-attempt] Unexpected error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
