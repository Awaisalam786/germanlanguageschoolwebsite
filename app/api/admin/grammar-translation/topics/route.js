import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyAdminSession } from '../../../../../src/lib/serverAdminAuth';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Server-Side API for Grammar Translation Topics (Admin Only)
 * Protected cryptographically by verifyAdminSession.
 * Performs database mutations using server-side SUPABASE_SERVICE_ROLE_KEY.
 * Public/students are restricted by RLS to SELECT only.
 */

// GET: Fetch topics by level
export async function GET(req) {
  try {
    const authResult = await verifyAdminSession(req);
    if (!authResult.isAdmin) {
      return NextResponse.json(
        { error: authResult.error || 'Unauthorized: Admin authentication token required.' },
        { status: 401 }
      );
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: 'Server database configuration missing.' }, { status: 503 });
    }

    const { searchParams } = new URL(req.url);
    const level = searchParams.get('level') || 'A1';

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data, error } = await supabase
      .from('grammar_translation_topics')
      .select('*')
      .eq('level', level)
      .order('topic_number', { ascending: true });

    if (error) {
      if (error.code === '42P01' || error.message?.includes('does not exist')) {
        return NextResponse.json({
          topics: [],
          pending_migration: true,
          error: 'Table grammar_translation_topics has not yet been applied in Supabase.',
        });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ topics: data || [] }, { status: 200 });
  } catch (err) {
    console.error('[api/admin/grammar-translation/topics GET] Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST: Create a new topic
export async function POST(req) {
  try {
    const authResult = await verifyAdminSession(req);
    if (!authResult.isAdmin) {
      return NextResponse.json(
        { error: authResult.error || 'Unauthorized: Admin authentication token required.' },
        { status: 401 }
      );
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: 'Server database configuration missing.' }, { status: 503 });
    }

    const body = await req.json().catch(() => ({}));
    const { level, topic_number, topic_title, description } = body;

    if (!level || !topic_title || topic_number === undefined) {
      return NextResponse.json({ error: 'Missing required topic fields.' }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const newTopic = {
      level: String(level).trim().toUpperCase(),
      topic_number: parseInt(topic_number, 10) || 1,
      topic_title: String(topic_title).trim(),
      description: description ? String(description).trim() : null,
      questions: [],
      question_count: 0,
      is_active: true,
    };

    const { data, error } = await supabase
      .from('grammar_translation_topics')
      .insert([newTopic])
      .select()
      .single();

    if (error) {
      if (error.code === '42P01' || error.message?.includes('does not exist')) {
        return NextResponse.json(
          { error: 'Table grammar_translation_topics is not yet migrated in Supabase.', pending_migration: true },
          { status: 503 }
        );
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, topic: data }, { status: 201 });
  } catch (err) {
    console.error('[api/admin/grammar-translation/topics POST] Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT: Update an existing topic (metadata or question bank)
export async function PUT(req) {
  try {
    const authResult = await verifyAdminSession(req);
    if (!authResult.isAdmin) {
      return NextResponse.json(
        { error: authResult.error || 'Unauthorized: Admin authentication token required.' },
        { status: 401 }
      );
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: 'Server database configuration missing.' }, { status: 503 });
    }

    const body = await req.json().catch(() => ({}));
    const { id, questions, topic_title, description, is_active } = body;

    if (!id) {
      return NextResponse.json({ error: 'Topic ID is required.' }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const updatePayload = {
      updated_at: new Date().toISOString(),
    };

    if (topic_title !== undefined) updatePayload.topic_title = String(topic_title).trim();
    if (description !== undefined) updatePayload.description = description ? String(description).trim() : null;
    if (is_active !== undefined) updatePayload.is_active = Boolean(is_active);

    if (Array.isArray(questions)) {
      updatePayload.questions = questions;
      updatePayload.question_count = questions.length;
    }

    const { data, error } = await supabase
      .from('grammar_translation_topics')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, topic: data }, { status: 200 });
  } catch (err) {
    console.error('[api/admin/grammar-translation/topics PUT] Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE: Delete a topic
export async function DELETE(req) {
  try {
    const authResult = await verifyAdminSession(req);
    if (!authResult.isAdmin) {
      return NextResponse.json(
        { error: authResult.error || 'Unauthorized: Admin authentication token required.' },
        { status: 401 }
      );
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: 'Server database configuration missing.' }, { status: 503 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Topic ID is required.' }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { error } = await supabase
      .from('grammar_translation_topics')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Topic deleted successfully.' }, { status: 200 });
  } catch (err) {
    console.error('[api/admin/grammar-translation/topics DELETE] Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
