import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));

    const {
      chapter_id,
      level,
      chapter_number,
      word_german,
      word_english,
      target_language = 'english',
      user_answer,
      suggested_synonym,
      submitted_by_name,
      user_type = 'anonymous',
    } = body;

    // 1. Validation
    if (!word_german || !word_english || !suggested_synonym) {
      return NextResponse.json(
        { error: 'Missing required fields: word, translation, and suggested synonym are required.' },
        { status: 400 }
      );
    }

    const cleanSynonym = String(suggested_synonym).trim().replace(/<[^>]*>?/gm, ''); // Strip HTML tags
    if (cleanSynonym.length < 2 || cleanSynonym.length > 100) {
      return NextResponse.json(
        { error: 'Suggested synonym must be between 2 and 100 characters.' },
        { status: 400 }
      );
    }

    const validTargetLang = target_language === 'german' ? 'german' : 'english';

    // Disallow proposing identical string to the official primary word
    const primaryWord = validTargetLang === 'german' ? word_german : word_english;
    if (cleanSynonym.toLowerCase() === String(primaryWord).toLowerCase().trim()) {
      return NextResponse.json(
        { error: 'Your suggested synonym is already the primary official answer.' },
        { status: 400 }
      );
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Database environment configuration not available.' },
        { status: 503 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // 2. Duplicate Check: Check if this synonym is already pending review
    const { data: existingPending, error: dupCheckError } = await supabase
      .from('vocab_suggestions')
      .select('id')
      .eq('word_german', String(word_german).trim())
      .eq('target_language', validTargetLang)
      .eq('status', 'pending')
      .ilike('suggested_synonym', cleanSynonym)
      .limit(1);

    if (dupCheckError) {
      if (dupCheckError.code === '42P01' || dupCheckError.message?.includes('does not exist')) {
        return NextResponse.json({
          error: 'The vocab_suggestions database table has not yet been applied. Please run the SQL migration in Supabase.',
          pending_migration: true
        }, { status: 503 });
      }
      console.error('[vocab-suggestions/submit] Duplicate check error:', dupCheckError);
    }

    if (existingPending && existingPending.length > 0) {
      return NextResponse.json({
        success: true,
        already_submitted: true,
        message: 'This synonym has already been suggested and is currently awaiting admin review. Thank you!'
      });
    }

    // 3. Insert new pending suggestion
    const newSuggestion = {
      chapter_id: chapter_id || null,
      level: String(level || 'A1').trim().toUpperCase(),
      chapter_number: parseInt(chapter_number, 10) || 1,
      word_german: String(word_german).trim(),
      word_english: String(word_english).trim(),
      target_language: validTargetLang,
      user_answer: user_answer ? String(user_answer).trim().slice(0, 100) : null,
      suggested_synonym: cleanSynonym,
      status: 'pending',
      submitted_by_name: submitted_by_name ? String(submitted_by_name).trim().slice(0, 100) : null,
      user_type: String(user_type || 'anonymous').slice(0, 50),
    };

    const { data: inserted, error: insertError } = await supabase
      .from('vocab_suggestions')
      .insert([newSuggestion])
      .select()
      .single();

    if (insertError) {
      if (insertError.code === '42P01' || insertError.message?.includes('does not exist')) {
        return NextResponse.json({
          error: 'The vocab_suggestions table has not yet been applied in the database.',
          pending_migration: true
        }, { status: 503 });
      }
      console.error('[vocab-suggestions/submit] Insert error:', insertError);
      return NextResponse.json({ error: insertError.message || 'Failed to submit suggestion.' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you! Your suggested synonym has been submitted and is awaiting admin approval.',
      data: inserted
    });

  } catch (err) {
    console.error('[vocab-suggestions/submit] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error processing suggestion.' }, { status: 500 });
  }
}
