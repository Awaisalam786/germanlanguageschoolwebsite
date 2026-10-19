import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyAdminSession } from '../../../../../../src/lib/serverAdminAuth';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * POST /api/admin/grammar-translation/suggestions/action
 * Approves or rejects a student Grammar Translation suggestion.
 * On approval:
 *   - Verifies admin session.
 *   - Locates the parent topic and question in JSONB.
 *   - Case-insensitively checks against official German answer and existing accepted answers.
 *   - Never overwrites the original official German answer.
 *   - Adds alternative translation to the question's accepted_answers array.
 *   - Updates the suggestion status to 'approved' with reviewer metadata.
 * On rejection:
 *   - Updates suggestion status to 'rejected' with optional reason.
 *   - Does NOT add anything to accepted_answers.
 */
export async function POST(req) {
  try {
    // 1. Strict Server-Side Admin Authorization Check
    const authResult = await verifyAdminSession(req);
    if (!authResult.isAdmin) {
      return NextResponse.json(
        { error: authResult.error || 'Unauthorized: Admin authentication required.' },
        { status: 401 }
      );
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Server database configuration missing.' },
        { status: 503 }
      );
    }

    const { action, suggestion_id, edited_alternative, rejection_reason } = await req.json().catch(() => ({}));

    if (!suggestion_id || !action) {
      return NextResponse.json(
        { error: 'Missing suggestion_id or action parameter.' },
        { status: 400 }
      );
    }

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Action must be either "approve" or "reject".' },
        { status: 400 }
      );
    }

    const adminSupabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // 2. Fetch Target Suggestion
    const { data: suggestion, error: fetchErr } = await adminSupabase
      .from('grammar_translation_suggestions')
      .select('*')
      .eq('id', suggestion_id)
      .single();

    if (fetchErr || !suggestion) {
      return NextResponse.json(
        { error: 'Suggestion not found in database.' },
        { status: 404 }
      );
    }

    const reviewerEmail = authResult.user?.email || 'admin@germanlearningschool.com';

    // ─── ACTION: REJECT ───
    if (action === 'reject') {
      const sanitizedReason = rejection_reason ? String(rejection_reason).trim().slice(0, 300) : null;

      const { error: rejectErr } = await adminSupabase
        .from('grammar_translation_suggestions')
        .update({
          status: 'rejected',
          rejection_reason: sanitizedReason,
          reviewed_at: new Date().toISOString(),
          reviewed_by: reviewerEmail,
        })
        .eq('id', suggestion_id);

      if (rejectErr) {
        return NextResponse.json({ error: rejectErr.message }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        message: 'Translation suggestion rejected.',
      });
    }

    // ─── ACTION: APPROVE ───
    // Clean and validate proposed translation
    const rawApproved = edited_alternative !== undefined ? edited_alternative : suggestion.suggested_alternative;
    const cleanApproved = String(rawApproved || '').trim().replace(/<[^>]*>?/gm, '');

    if (cleanApproved.length < 2 || cleanApproved.length > 250) {
      return NextResponse.json(
        { error: 'Approved translation must be between 2 and 250 characters.' },
        { status: 400 }
      );
    }

    // Locate Target Topic:
    let targetTopic = null;

    // Strategy 1: Find by suggestion.topic_id
    if (suggestion.topic_id) {
      const { data: topicById } = await adminSupabase
        .from('grammar_translation_topics')
        .select('*')
        .eq('id', suggestion.topic_id)
        .single();

      if (topicById) {
        targetTopic = topicById;
      }
    }

    // Strategy 2: Search by level for topic containing question_id
    if (!targetTopic && suggestion.level) {
      const { data: topicsByLevel } = await adminSupabase
        .from('grammar_translation_topics')
        .select('*')
        .eq('level', suggestion.level);

      if (Array.isArray(topicsByLevel)) {
        targetTopic = topicsByLevel.find((t) =>
          Array.isArray(t.questions) && t.questions.some((q) => q.id === suggestion.question_id)
        );
      }
    }

    // Strategy 3: Fallback match by topic_title and level
    if (!targetTopic && suggestion.topic_title && suggestion.level) {
      const { data: topicsByTitle } = await adminSupabase
        .from('grammar_translation_topics')
        .select('*')
        .eq('level', suggestion.level)
        .eq('topic_title', suggestion.topic_title);

      if (Array.isArray(topicsByTitle) && topicsByTitle.length > 0) {
        targetTopic = topicsByTitle[0];
      }
    }

    if (!targetTopic || !Array.isArray(targetTopic.questions)) {
      return NextResponse.json(
        { error: `Matching grammar translation topic could not be found for Level ${suggestion.level} (Topic: "${suggestion.topic_title}").` },
        { status: 404 }
      );
    }

    // Locate Question in Topic
    const topicQuestions = [...targetTopic.questions];
    let questionIndex = topicQuestions.findIndex((q) => q.id === suggestion.question_id);

    // Fallback: match by English sentence if question_id not found
    if (questionIndex === -1 && suggestion.english_sentence) {
      questionIndex = topicQuestions.findIndex(
        (q) => (q.english_sentence || '').trim().toLowerCase() === suggestion.english_sentence.trim().toLowerCase()
      );
    }

    if (questionIndex === -1) {
      return NextResponse.json(
        { error: `Question "${suggestion.english_sentence}" (ID: ${suggestion.question_id}) was not found in topic "${targetTopic.topic_title}".` },
        { status: 404 }
      );
    }

    const targetQuestion = topicQuestions[questionIndex];
    const existingAccepted = Array.isArray(targetQuestion.accepted_answers)
      ? [...targetQuestion.accepted_answers]
      : [];

    // Case-insensitive check:
    const normalizedApproved = cleanApproved.toLowerCase();
    const normalizedOfficial = (targetQuestion.target_german || '').trim().toLowerCase();

    // Check if duplicate of official German
    const isOfficialGerman = normalizedApproved === normalizedOfficial;

    // Check if duplicate of an existing accepted answer
    const isAlreadyAccepted = existingAccepted.some(
      (ans) => (ans || '').trim().toLowerCase() === normalizedApproved
    );

    let updatedAcceptedAnswers = existingAccepted;
    let questionsUpdated = false;

    if (!isOfficialGerman && !isAlreadyAccepted) {
      // Append approved alternative without overwriting official German or existing entries
      updatedAcceptedAnswers = [...existingAccepted, cleanApproved];
      topicQuestions[questionIndex] = {
        ...targetQuestion,
        accepted_answers: updatedAcceptedAnswers,
      };

      // Atomic update to topic in Supabase
      const { error: topicUpdateErr } = await adminSupabase
        .from('grammar_translation_topics')
        .update({
          questions: topicQuestions,
          updated_at: new Date().toISOString(),
        })
        .eq('id', targetTopic.id);

      if (topicUpdateErr) {
        console.error('[grammar-translation/action] Error updating topic:', topicUpdateErr);
        return NextResponse.json(
          { error: `Failed to update topic questions: ${topicUpdateErr.message}` },
          { status: 500 }
        );
      }

      questionsUpdated = true;
    }

    // Update Suggestion Record
    const { error: suggestionUpdateErr } = await adminSupabase
      .from('grammar_translation_suggestions')
      .update({
        status: 'approved',
        suggested_alternative: cleanApproved,
        reviewed_at: new Date().toISOString(),
        reviewed_by: reviewerEmail,
        rejection_reason: null,
      })
      .eq('id', suggestion_id);

    if (suggestionUpdateErr) {
      console.error('[grammar-translation/action] Error updating suggestion:', suggestionUpdateErr);
      return NextResponse.json(
        { error: `Failed to update suggestion record: ${suggestionUpdateErr.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: questionsUpdated
        ? `Suggestion approved and added to accepted answers for "${targetTopic.topic_title}".`
        : `Suggestion approved. Alternative was already covered by accepted answers.`,
      accepted_answers: updatedAcceptedAnswers,
      already_existed: isOfficialGerman || isAlreadyAccepted,
    });

  } catch (err) {
    console.error('[grammar-translation/suggestions/action/POST] Server Error:', err);
    return NextResponse.json(
      { error: 'Internal server error while processing suggestion action.' },
      { status: 500 }
    );
  }
}
