-- 1. Create recordings table
CREATE TABLE recordings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  batch TEXT NOT NULL,
  date TEXT NOT NULL,
  duration TEXT NOT NULL,
  video_url TEXT NOT NULL,
  instructor TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create blog_posts table
CREATE TABLE blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  author TEXT NOT NULL,
  read_time TEXT NOT NULL,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create inquiries table
CREATE TABLE inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  course_interest TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'New Lead',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create coupons table
CREATE TABLE coupons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  coupon_code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL, -- 'percentage' or 'fixed'
  discount_value NUMERIC NOT NULL,
  applicable_to TEXT NOT NULL, -- 'All Courses', 'Specific Course', 'All Books', 'Specific Book'
  target_item_id UUID, -- References course or book id if applicable
  expiry_date TIMESTAMP WITH TIME ZONE,
  usage_limit INTEGER, -- Null means unlimited
  times_used INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Note: payment_status already exists in the students table from previous migrations (status, payment_status).

-- ENABLE RLS
ALTER TABLE recordings ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

-- PUBLIC POLICIES (Read-only)
CREATE POLICY "Allow public read on recordings" ON recordings FOR SELECT USING (true);
CREATE POLICY "Allow public read on blog_posts" ON blog_posts FOR SELECT USING (true);
CREATE POLICY "Allow public read on coupons" ON coupons FOR SELECT USING (true);
-- Inquiries should ideally only be readable by admin, but we might allow inserts from public (for the contact form)
CREATE POLICY "Allow public insert on inquiries" ON inquiries FOR INSERT WITH CHECK (true);

-- ADMIN POLICIES (Full CRUD for authenticated users)
CREATE POLICY "Allow admin full access to recordings" ON recordings FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow admin full access to blog_posts" ON blog_posts FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow admin full access to inquiries" ON inquiries FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow admin full access to coupons" ON coupons FOR ALL TO authenticated USING (true);

