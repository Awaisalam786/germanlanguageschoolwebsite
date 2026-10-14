-- ====================================================================
-- Migration: Create book_bundles and book_bundle_items
-- Architecture: Bundle Offers for German Learning School
-- Target Project: owczimivgmivvmsqxpko (https://owczimivgmivvmsqxpko.supabase.co)
-- DO NOT EXECUTE AUTOMATICALLY. Prepared for review and approval.
-- ====================================================================

-- 1. Create book_bundles table with constraints
CREATE TABLE IF NOT EXISTS public.book_bundles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  bundle_price_pkr NUMERIC NOT NULL CHECK (bundle_price_pkr >= 0),
  badge TEXT, -- Optional custom ribbon badge, e.g. "Most Popular", "Best Value"
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 2. Create book_bundle_items junction table (order and book linking)
CREATE TABLE IF NOT EXISTS public.book_bundle_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bundle_id UUID NOT NULL REFERENCES public.book_bundles(id) ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  item_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  CONSTRAINT unique_bundle_book UNIQUE (bundle_id, book_id)
);

-- 3. Revoke all privileges from PUBLIC and anon by default
REVOKE ALL ON TABLE public.book_bundles FROM PUBLIC;
REVOKE ALL ON TABLE public.book_bundle_items FROM PUBLIC;
REVOKE ALL ON TABLE public.book_bundles FROM anon;
REVOKE ALL ON TABLE public.book_bundle_items FROM anon;

-- 4. Grant read-only access to anon & authenticated, and full permissions to service_role and authenticated
GRANT SELECT ON TABLE public.book_bundles TO anon, authenticated;
GRANT SELECT ON TABLE public.book_bundle_items TO anon, authenticated;

GRANT ALL ON TABLE public.book_bundles TO service_role;
GRANT ALL ON TABLE public.book_bundle_items TO service_role;

GRANT INSERT, UPDATE, DELETE ON TABLE public.book_bundles TO authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.book_bundle_items TO authenticated;

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.book_bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_bundle_items ENABLE ROW LEVEL SECURITY;

-- 6. Safe cleanup of existing policies for idempotent execution
DROP POLICY IF EXISTS "Public can view active book_bundles" ON public.book_bundles;
DROP POLICY IF EXISTS "Public can view book_bundle_items" ON public.book_bundle_items;
DROP POLICY IF EXISTS "Public can view active book_bundle_items" ON public.book_bundle_items;
DROP POLICY IF EXISTS "Admin full access to book_bundles" ON public.book_bundles;
DROP POLICY IF EXISTS "Admin full access to book_bundle_items" ON public.book_bundle_items;

-- 7. Public Read Policies
-- Anonymous visitors & ordinary authenticated learners can read only active bundles
CREATE POLICY "Public can view active book_bundles"
  ON public.book_bundles
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Anonymous visitors & ordinary authenticated learners can read items ONLY when parent bundle is active
CREATE POLICY "Public can view active book_bundle_items"
  ON public.book_bundle_items
  FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.book_bundles b
      WHERE b.id = book_bundle_items.bundle_id
        AND b.is_active = true
    )
  );

-- 8. Hardened Admin Management Policies (Restricted to verified admin Awais Alam)
-- Admin can view, create, update, delete, reorder, or toggle all bundles (active or disabled)
CREATE POLICY "Admin full access to book_bundles"
  ON public.book_bundles
  FOR ALL
  TO authenticated
  USING (
    auth.uid() = '4b1abf09-204d-44f1-b0c0-fa1e6cea6228'::uuid
    AND (auth.jwt() ->> 'email') = 'awaisalam506@gmail.com'
    AND COALESCE(auth.jwt() -> 'user_metadata' ->> 'role', '') != 'learner'
  )
  WITH CHECK (
    auth.uid() = '4b1abf09-204d-44f1-b0c0-fa1e6cea6228'::uuid
    AND (auth.jwt() ->> 'email') = 'awaisalam506@gmail.com'
    AND COALESCE(auth.jwt() -> 'user_metadata' ->> 'role', '') != 'learner'
  );

-- Admin can view, link, reorder, and delete all bundle items
CREATE POLICY "Admin full access to book_bundle_items"
  ON public.book_bundle_items
  FOR ALL
  TO authenticated
  USING (
    auth.uid() = '4b1abf09-204d-44f1-b0c0-fa1e6cea6228'::uuid
    AND (auth.jwt() ->> 'email') = 'awaisalam506@gmail.com'
    AND COALESCE(auth.jwt() -> 'user_metadata' ->> 'role', '') != 'learner'
  )
  WITH CHECK (
    auth.uid() = '4b1abf09-204d-44f1-b0c0-fa1e6cea6228'::uuid
    AND (auth.jwt() ->> 'email') = 'awaisalam506@gmail.com'
    AND COALESCE(auth.jwt() -> 'user_metadata' ->> 'role', '') != 'learner'
  );

-- 9. Automatic updated_at trigger function & trigger for book_bundles
CREATE OR REPLACE FUNCTION public.set_book_bundles_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  new.updated_at := NOW();
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS book_bundles_set_updated_at ON public.book_bundles;
CREATE TRIGGER book_bundles_set_updated_at
  BEFORE UPDATE ON public.book_bundles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_book_bundles_updated_at();
