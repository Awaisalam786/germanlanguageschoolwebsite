import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.slice(7).trim()
      : null;

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required. Please log in to view your progress.' },
        { status: 401 }
      );
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Cryptographically verify token and derive authenticated user
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid or expired session. Please log in again.' },
        { status: 401 }
      );
    }

    const verifiedUserId = user.id;

    // 1. Fetch practice_attempts strictly by verified user_id (excluding internal students)
    const { data: practiceData, error: practiceError } = await supabaseAdmin
      .from('practice_attempts')
      .select('id, material_id, score, total_marks, percentage, created_at, user_type, user_id, practice_materials(title, level)')
      .eq('user_id', verifiedUserId)
      .neq('user_type', 'student')
      .order('created_at', { ascending: false });

    if (practiceError) {
      console.error('[my-progress] Practice attempts error:', practiceError.message);
    }

    // 2. Fetch reading_attempts strictly by verified user_id (if schema column exists)
    let readingData = [];
    let readingSupported = true;
    try {
      const { data, error } = await supabaseAdmin
        .from('reading_attempts')
        .select('id, passage_id, level, score, total_marks, percentage, created_at, user_type, user_id, reading_passages(passage_title)')
        .eq('user_id', verifiedUserId)
        .neq('user_type', 'student')
        .order('created_at', { ascending: false });

      if (error) {
        if (error.message?.includes('user_id')) {
          readingSupported = false;
        } else {
          console.error('[my-progress] Reading attempts error:', error.message);
        }
      } else {
        readingData = data || [];
      }
    } catch {
      readingSupported = false;
    }

    // 3. Fetch grammar_attempts strictly by verified user_id (if schema column exists)
    let grammarData = [];
    let grammarSupported = true;
    try {
      const { data, error } = await supabaseAdmin
        .from('grammar_attempts')
        .select('id, level, chapters_selected, total_questions, correct_count, wrong_count, percentage, created_at, user_type, user_id')
        .eq('user_id', verifiedUserId)
        .neq('user_type', 'student')
        .order('created_at', { ascending: false });

      if (error) {
        if (error.message?.includes('user_id')) {
          grammarSupported = false;
        } else {
          console.error('[my-progress] Grammar attempts error:', error.message);
        }
      } else {
        grammarData = data || [];
      }
    } catch {
      grammarSupported = false;
    }

    // 4. Fetch vocab_engine_attempts strictly by verified user_id (if schema column exists)
    let vocabData = [];
    let vocabSupported = true;
    try {
      const { data, error } = await supabaseAdmin
        .from('vocab_engine_attempts')
        .select('id, level, chapters_selected, test_mode, total_questions, correct_count, wrong_count, percentage, created_at, user_type, user_id')
        .eq('user_id', verifiedUserId)
        .neq('user_type', 'student')
        .order('created_at', { ascending: false });

      if (error) {
        if (error.message?.includes('user_id')) {
          vocabSupported = false;
        } else {
          console.error('[my-progress] Vocab attempts error:', error.message);
        }
      } else {
        vocabData = data || [];
      }
    } catch {
      vocabSupported = false;
    }

    // Build unified attempts array across all 4 activity types
    const unifiedPractice = (practiceData || []).map(a => ({
      id: `practice-${a.id}`,
      originalId: a.id,
      category: 'Practice Test',
      title: a.practice_materials?.title || 'German Practice Drill',
      level: a.practice_materials?.level || '—',
      score: a.score,
      total_marks: a.total_marks,
      percentage: a.percentage,
      created_at: a.created_at,
    }));

    const unifiedReading = readingData.map(a => ({
      id: `reading-${a.id}`,
      originalId: a.id,
      category: 'Reading Test',
      title: a.reading_passages?.passage_title || `Reading Passage (${a.level || 'German'})`,
      level: a.level || '—',
      score: a.score,
      total_marks: a.total_marks,
      percentage: a.percentage,
      created_at: a.created_at,
    }));

    const unifiedGrammar = grammarData.map(a => ({
      id: `grammar-${a.id}`,
      originalId: a.id,
      category: 'Grammar Drill',
      title: `Grammar Drill (${a.chapters_selected ? `Ch. ${a.chapters_selected}` : 'Mixed Topics'})`,
      level: a.level || '—',
      score: a.correct_count,
      total_marks: a.total_questions,
      percentage: a.percentage,
      created_at: a.created_at,
    }));

    const unifiedVocab = vocabData.map(a => ({
      id: `vocab-${a.id}`,
      originalId: a.id,
      category: 'Vocabulary Drill',
      title: `Vocabulary Engine (${a.test_mode || 'Mixed'})`,
      level: a.level || '—',
      score: a.correct_count,
      total_marks: a.total_questions,
      percentage: a.percentage,
      created_at: a.created_at,
    }));

    const allAttempts = [
      ...unifiedPractice,
      ...unifiedReading,
      ...unifiedGrammar,
      ...unifiedVocab,
    ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return NextResponse.json({
      attempts: practiceData || [],
      readingAttempts: readingData,
      grammarAttempts: grammarData,
      vocabAttempts: vocabData,
      allAttempts,
      user: {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || user.email.split('@')[0],
        phone: user.user_metadata?.phone || ''
      },
      schemaStatus: {
        readingSupported,
        grammarSupported,
        vocabSupported
      }
    }, { status: 200 });

  } catch (error) {
    console.error('[my-progress] Server Error:', error.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
