import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyAdminSession } from '../../../../src/lib/serverAdminAuth';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(req) {
  try {
    // 1. Strict Server-Side Admin Authorization Check
    const authResult = await verifyAdminSession(req);
    if (!authResult.isAdmin) {
      return NextResponse.json(
        { error: authResult.error || 'Unauthorized: Admin authentication token required.' },
        { status: 401 }
      );
    }

    const { action, suggestion_id, edited_synonym, rejection_reason } = await req.json().catch(() => ({}));

    if (!suggestion_id || !action) {
      return NextResponse.json({ error: 'Missing suggestion_id or action parameter.' }, { status: 400 });
    }

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Action must be either "approve" or "reject".' }, { status: 400 });
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: 'Server database configuration missing.' }, { status: 503 });
    }

    const adminSupabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // 2. Fetch the target suggestion
    const { data: suggestion, error: fetchErr } = await adminSupabase
      .from('vocab_suggestions')
      .select('*')
      .eq('id', suggestion_id)
      .single();

    if (fetchErr || !suggestion) {
      return NextResponse.json({ error: 'Suggestion not found.' }, { status: 404 });
    }

    const reviewerEmail = authResult.user?.email || 'admin@germanlearningschool.com';

    // ─── ACTION: REJECT ───
    if (action === 'reject') {
      const { error: rejectErr } = await adminSupabase
        .from('vocab_suggestions')
        .update({
          status: 'rejected',
          rejection_reason: rejection_reason ? String(rejection_reason).trim().slice(0, 200) : null,
          reviewed_at: new Date().toISOString(),
          reviewed_by: reviewerEmail,
        })
        .eq('id', suggestion_id);

      if (rejectErr) {
        return NextResponse.json({ error: rejectErr.message }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        message: 'Suggestion rejected successfully.',
      });
    }

    // ─── ACTION: APPROVE ───
    const approvedSynonym = String(edited_synonym || suggestion.suggested_synonym).trim().replace(/<[^>]*>?/gm, '');
    if (approvedSynonym.length < 2 || approvedSynonym.length > 100) {
      return NextResponse.json(
        { error: 'Approved synonym must be between 2 and 100 characters.' },
        { status: 400 }
      );
    }

    // Locate the official chapter in vocab_chapters
    let chapterQuery = adminSupabase.from('vocab_chapters').select('*');
    if (suggestion.chapter_id) {
      chapterQuery = chapterQuery.eq('id', suggestion.chapter_id);
    } else {
      chapterQuery = chapterQuery
        .eq('level', suggestion.level)
        .eq('chapter_number', suggestion.chapter_number);
    }

    const { data: chapters, error: chapterErr } = await chapterQuery;
    if (chapterErr) {
      return NextResponse.json({ error: `Error locating chapter: ${chapterErr.message}` }, { status: 500 });
    }

    const chapter = chapters && chapters.length > 0 ? chapters[0] : null;

    if (!chapter || !Array.isArray(chapter.json_data)) {
      return NextResponse.json(
        { error: `Matching vocabulary chapter (Level ${suggestion.level}, Chapter ${suggestion.chapter_number}) not found in database.` },
        { status: 404 }
      );
    }

    // Locate the word in the chapter's json_data using exact German word as primary identity
    const targetGerman = String(suggestion.word_german || '').trim().toLowerCase();
    if (!targetGerman) {
      return NextResponse.json(
        { error: 'Missing German word context in suggestion.' },
        { status: 400 }
      );
    }

    let words = [...chapter.json_data];
    let candidateIndices = [];

    for (let i = 0; i < words.length; i++) {
      const w = words[i];
      const gWord = typeof w.german === 'object' ? w.german?.word : w.german;
      if (gWord && String(gWord).trim().toLowerCase() === targetGerman) {
        candidateIndices.push(i);
      }
    }

    if (candidateIndices.length === 0) {
      return NextResponse.json(
        { error: `Word "${suggestion.word_german}" not found inside Chapter ${suggestion.chapter_number} vocabulary.` },
        { status: 404 }
      );
    }

    let matchedIndex = -1;
    if (candidateIndices.length === 1) {
      matchedIndex = candidateIndices[0];
    } else {
      // Disambiguate multiple entries of the same German word using English context
      const targetEnglish = String(suggestion.word_english || '').trim().toLowerCase();
      const disambiguated = candidateIndices.filter(idx => {
        const w = words[idx];
        const eWord = typeof w.english === 'object' ? w.english?.primary || w.english?.word : w.english;
        return eWord && String(eWord).trim().toLowerCase() === targetEnglish;
      });

      if (disambiguated.length === 1) {
        matchedIndex = disambiguated[0];
      } else {
        return NextResponse.json(
          { error: `Ambiguous match: Multiple entries found for "${suggestion.word_german}" in Chapter ${suggestion.chapter_number}. Cannot safely determine target entry.` },
          { status: 409 }
        );
      }
    }

    const wordItem = { ...words[matchedIndex] };
    const targetLang = suggestion.target_language === 'german' ? 'german' : 'english';
    const cleanApproved = approvedSynonym.trim();
    const cleanApprovedLower = cleanApproved.toLowerCase();

    // Duplicate prevention and appending into official accepted answers
    // Supports both flat ({ german: '...', english: '...' }) and nested ({ german: { ... }, english: { ... } }) schemas.
    if (targetLang === 'german') {
      const isNested = typeof wordItem.german === 'object' && wordItem.german !== null;
      const primaryGerman = isNested ? (wordItem.german.word || '') : String(wordItem.german || '');

      // Collect all existing answers across both flat and nested structures
      const topLevelAnswers = Array.isArray(wordItem.accepted_german_answers)
        ? [...wordItem.accepted_german_answers]
        : [];
      const nestedAccepted = (isNested && Array.isArray(wordItem.german.accepted))
        ? [...wordItem.german.accepted]
        : [];
      const nestedLegacy = (isNested && Array.isArray(wordItem.german.accepted_german_answers))
        ? [...wordItem.german.accepted_german_answers]
        : [];

      // Check if synonym already exists in any accepted array or matches primary word
      const allExisting = [primaryGerman, ...topLevelAnswers, ...nestedAccepted, ...nestedLegacy];
      const alreadyExists = allExisting.some(
        ans => typeof ans === 'string' && ans.trim().toLowerCase() === cleanApprovedLower
      );

      if (!alreadyExists) {
        topLevelAnswers.push(cleanApproved);
      }
      wordItem.accepted_german_answers = topLevelAnswers;

      // If the word uses the nested object schema, mirror into german.accepted so ChapterVocabEngine reads it
      if (isNested) {
        const updatedGermanObj = { ...wordItem.german };
        const objAccepted = Array.isArray(updatedGermanObj.accepted)
          ? [...updatedGermanObj.accepted]
          : [];
        if (!objAccepted.some(a => typeof a === 'string' && a.trim().toLowerCase() === cleanApprovedLower)) {
          objAccepted.push(cleanApproved);
        }
        updatedGermanObj.accepted = objAccepted;
        wordItem.german = updatedGermanObj;
      }

    } else {
      const isNested = typeof wordItem.english === 'object' && wordItem.english !== null;
      const primaryEnglish = isNested
        ? (wordItem.english.primary || wordItem.english.word || '')
        : String(wordItem.english || '');

      // Collect all existing answers across both flat and nested structures
      const topLevelAnswers = Array.isArray(wordItem.accepted_answers)
        ? [...wordItem.accepted_answers]
        : [];
      const nestedAccepted = (isNested && Array.isArray(wordItem.english.accepted))
        ? [...wordItem.english.accepted]
        : [];

      // Check if synonym already exists in any accepted array or matches primary word
      const allExisting = [primaryEnglish, ...topLevelAnswers, ...nestedAccepted];
      const alreadyExists = allExisting.some(
        ans => typeof ans === 'string' && ans.trim().toLowerCase() === cleanApprovedLower
      );

      if (!alreadyExists) {
        topLevelAnswers.push(cleanApproved);
      }
      wordItem.accepted_answers = topLevelAnswers;

      // If the word uses the nested object schema, mirror into english.accepted so ChapterVocabEngine reads it
      if (isNested) {
        const updatedEnglishObj = { ...wordItem.english };
        const objAccepted = Array.isArray(updatedEnglishObj.accepted)
          ? [...updatedEnglishObj.accepted]
          : [];
        if (!objAccepted.some(a => typeof a === 'string' && a.trim().toLowerCase() === cleanApprovedLower)) {
          objAccepted.push(cleanApproved);
        }
        updatedEnglishObj.accepted = objAccepted;
        wordItem.english = updatedEnglishObj;
      }
    }

    words[matchedIndex] = wordItem;

    // 3. Atomically update the official vocabulary chapter in vocab_chapters
    const { error: updateChapterErr } = await adminSupabase
      .from('vocab_chapters')
      .update({ json_data: words })
      .eq('id', chapter.id);

    if (updateChapterErr) {
      console.error('[vocab-suggestions/action] Error updating chapter JSON:', updateChapterErr);
      return NextResponse.json(
        { error: `Failed to update official chapter vocabulary: ${updateChapterErr.message}` },
        { status: 500 }
      );
    }

    // 4. Mark suggestion as approved in vocab_suggestions
    const { error: updateSuggErr } = await adminSupabase
      .from('vocab_suggestions')
      .update({
        status: 'approved',
        suggested_synonym: approvedSynonym,
        reviewed_at: new Date().toISOString(),
        reviewed_by: reviewerEmail,
      })
      .eq('id', suggestion_id);

    if (updateSuggErr) {
      console.error('[vocab-suggestions/action] Error updating suggestion status:', updateSuggErr);
    }

    return NextResponse.json({
      success: true,
      message: `Synonym "${approvedSynonym}" approved and integrated into Level ${suggestion.level} Chapter ${suggestion.chapter_number} vocabulary!`,
      approved_synonym: approvedSynonym,
    });

  } catch (err) {
    console.error('[vocab-suggestions/action] Server error:', err);
    return NextResponse.json({ error: 'Internal server error processing suggestion.' }, { status: 500 });
  }
}
