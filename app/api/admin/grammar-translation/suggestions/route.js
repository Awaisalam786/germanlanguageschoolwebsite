import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyAdminSession } from '../../../../../src/lib/serverAdminAuth';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * GET /api/admin/grammar-translation/suggestions
 * Secure server-side endpoint for listing and counting Grammar Translation Suggestions.
 * Requires admin authentication token.
 */
export async function GET(req) {
  try {
    // 1. Strict Server-Side Admin Authorization Check
    const authResult = await verifyAdminSession(req);
    if (!authResult.isAdmin) {
      return NextResponse.json(
        { error: authResult.error || 'Unauthorized: Admin privileges required.' },
        { status: 401 }
      );
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Server database configuration is missing.' },
        { status: 503 }
      );
    }

    const adminSupabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { searchParams } = new URL(req.url);
    const countOnly = searchParams.get('count_only') === 'true';
    const status = searchParams.get('status') || 'pending';
    const level = searchParams.get('level');

    // 2. Count Only (used for navigation badge updates)
    if (countOnly) {
      let countQuery = adminSupabase
        .from('grammar_translation_suggestions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      if (level && ['A1', 'A2', 'B1', 'B2'].includes(level)) {
        countQuery = countQuery.eq('level', level);
      }

      const { count, error } = await countQuery;

      if (error) {
        if (error.code === '42P01' || error.message?.includes('does not exist')) {
          return NextResponse.json({ pendingCount: 0, pending_migration: true });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ pendingCount: count || 0 });
    }

    // 3. Query Suggestions List
    let query = adminSupabase
      .from('grammar_translation_suggestions')
      .select('*')
      .order('created_at', { ascending: false });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    if (level && ['A1', 'A2', 'B1', 'B2'].includes(level)) {
      query = query.eq('level', level);
    }

    const { data, error } = await query;

    if (error) {
      if (error.code === '42P01' || error.message?.includes('does not exist')) {
        return NextResponse.json({
          suggestions: [],
          pending_migration: true,
          error: 'The grammar_translation_suggestions table is not yet migrated in Supabase.'
        });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ suggestions: data || [] });

  } catch (err) {
    console.error('[grammar-translation/suggestions/GET] Server Error:', err);
    return NextResponse.json(
      { error: 'Internal server error while fetching translation suggestions.' },
      { status: 500 }
    );
  }
}
