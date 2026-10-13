-- ====================================================================
-- Migration: Create book_manual_orders with Hardened RLS & Trigger
-- Approved for production execution in Supabase SQL Editor
-- Target Project: owczimivgmivvmsqxpko (https://owczimivgmivvmsqxpko.supabase.co)
-- ====================================================================

-- 1. Create table with strict constraints and foreign key to books
CREATE TABLE IF NOT EXISTS public.book_manual_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_ref TEXT UNIQUE NOT NULL,
  book_id UUID REFERENCES public.books(id) ON DELETE SET NULL,
  book_title TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  city TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1 
    CHECK (quantity >= 1 AND quantity <= 20),
  unit_price_pkr NUMERIC NOT NULL 
    CHECK (unit_price_pkr >= 0),
  total_price_pkr NUMERIC NOT NULL 
    CHECK (total_price_pkr >= 0),
  coupon_code TEXT,
  discount_amount NUMERIC NOT NULL DEFAULT 0 
    CHECK (discount_amount >= 0),
  final_payable_pkr NUMERIC NOT NULL 
    CHECK (final_payable_pkr >= 0),
  payment_status TEXT NOT NULL DEFAULT 'Pending Confirmation' 
    CHECK (payment_status IN ('Pending Confirmation', 'Awaiting Payment', 'Paid', 'Cancelled')),
  dispatch_status TEXT NOT NULL DEFAULT 'Processing' 
    CHECK (dispatch_status IN ('Processing', 'Shipped', 'Delivered', 'Cancelled')),
  courier_name TEXT,
  tracking_number TEXT,
  tracking_url TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 2. Revoke all privileges from PUBLIC and anon
REVOKE ALL ON TABLE public.book_manual_orders FROM PUBLIC;
REVOKE ALL ON TABLE public.book_manual_orders FROM anon;

-- 3. Grant explicit privileges to authenticated and service_role
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.book_manual_orders TO authenticated;
GRANT ALL ON TABLE public.book_manual_orders TO service_role;

-- 4. Enable Row Level Security
ALTER TABLE public.book_manual_orders ENABLE ROW LEVEL SECURITY;

-- 5. Drop any conflicting or legacy policies
DROP POLICY IF EXISTS "Admin full access to book_manual_orders" ON public.book_manual_orders;
DROP POLICY IF EXISTS "Allow admin full access to book_manual_orders" ON public.book_manual_orders;
DROP POLICY IF EXISTS "Allow public order creation" ON public.book_manual_orders;
DROP POLICY IF EXISTS "Allow public read on book_manual_orders" ON public.book_manual_orders;

-- 6. Hardened Admin RLS Policy
-- Restricts management strictly to the verified system administrator account
CREATE POLICY "Admin full access to book_manual_orders"
  ON public.book_manual_orders
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

-- 7. Automatic updated_at trigger function & trigger
CREATE OR REPLACE FUNCTION public.set_book_manual_orders_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  new.updated_at := NOW();
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS book_manual_orders_set_updated_at ON public.book_manual_orders;
CREATE TRIGGER book_manual_orders_set_updated_at
  BEFORE UPDATE ON public.book_manual_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.set_book_manual_orders_updated_at();
