import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Server-side verification for admin endpoints.
 * Never trusts a client-side admin flag alone.
 * Validates cryptographically signed Supabase tokens against the configured system admin credentials.
 */
export async function verifyAdminSession(req) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const systemEmail = process.env.SYSTEM_SUPABASE_EMAIL;
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!supabaseUrl || !supabaseAnonKey) {
    return { isAdmin: false, error: 'Server database environment not configured' };
  }

  // 1. Check Bearer token from Authorization header
  const authHeader = req.headers.get('authorization');
  let token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  if (token) {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (!error && user) {
      const isSystemAdmin = (systemEmail && user.email?.toLowerCase() === systemEmail.toLowerCase()) || 
                            (adminEmail && user.email?.toLowerCase() === adminEmail.toLowerCase()) || 
                            user.app_metadata?.role === 'admin';
      if (isSystemAdmin) {
        return { isAdmin: true, user, error: null };
      }
      return { isAdmin: false, user, error: 'User is not an authorized administrator' };
    }
  }

  // 2. Fallback to cookies
  try {
    const cookieStore = await cookies();
    const authClient = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: { get(name) { return cookieStore.get(name)?.value; } }
    });
    const { data: { session }, error: sessionError } = await authClient.auth.getSession();
    if (!sessionError && session?.user) {
      const isSystemAdmin = (systemEmail && session.user.email?.toLowerCase() === systemEmail.toLowerCase()) || 
                            (adminEmail && session.user.email?.toLowerCase() === adminEmail.toLowerCase()) || 
                            session.user.app_metadata?.role === 'admin';
      if (isSystemAdmin) {
        return { isAdmin: true, user: session.user, error: null };
      }
      return { isAdmin: false, user: session.user, error: 'User is not an authorized administrator' };
    }
  } catch (cookieErr) {
    // Cookie store read error
  }

  return { isAdmin: false, error: 'Unauthorized: Admin authentication token required' };
}
