import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyAdminSession } from '../../../src/lib/serverAdminAuth';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function GET(req) {
  try {
    // 1. Strict Server-Side Admin Authorization Check
    const authResult = await verifyAdminSession(req);
    if (!authResult.isAdmin) {
      return NextResponse.json({ error: authResult.error || 'Unauthorized access' }, { status: 401 });
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: 'Server database configuration missing' }, { status: 503 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { searchParams } = new URL(req.url);
    const countOnly = searchParams.get('count_only') === 'true';
    const status = searchParams.get('status') || 'pending';

    // 2. If badge count only requested
    if (countOnly) {
      const { count, error } = await supabase
        .from('vocab_suggestions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      if (error) {
        if (error.code === '42P01' || error.message?.includes('does not exist')) {
          return NextResponse.json({ pendingCount: 0, pending_migration: true });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ pendingCount: count || 0 });
    }

    // 3. Query suggestions list
    let query = supabase
      .from('vocab_suggestions')
      .select('*')
      .order('created_at', { ascending: false });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      if (error.code === '42P01' || error.message?.includes('does not exist')) {
        return NextResponse.json({
          suggestions: [],
          pending_migration: true,
          error: 'The vocab_suggestions table has not yet been applied in Supabase.'
        });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ suggestions: data || [] });

  } catch (err) {
    console.error('[vocab-suggestions/GET] Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
