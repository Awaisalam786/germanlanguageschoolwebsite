-- 1. Create `books` table
CREATE TABLE books (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price TEXT NOT NULL,
  image_url TEXT,
  in_stock BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create `book_orders` table
CREATE TABLE book_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  book_title TEXT NOT NULL,
  status TEXT DEFAULT 'Pending',
  order_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Set up Row Level Security (RLS)
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_orders ENABLE ROW LEVEL SECURITY;

-- 4. Create Policies

-- Books: Anyone can read, only authenticated (admins) can modify
CREATE POLICY "Allow public read on books" ON books FOR SELECT USING (true);
CREATE POLICY "Allow admin full access to books" ON books FOR ALL TO authenticated USING (true);

-- Book Orders: Only authenticated (admins) can read and modify
CREATE POLICY "Allow admin full access to book_orders" ON book_orders FOR ALL TO authenticated USING (true);

