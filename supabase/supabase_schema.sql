-- 1. Create Tables

CREATE TABLE courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  level TEXT NOT NULL,
  title TEXT NOT NULL,
  duration TEXT NOT NULL,
  price TEXT NOT NULL,
  schedule TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE students (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'Pending',
  payment_status TEXT DEFAULT 'Unpaid',
  join_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE teachers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  qualification TEXT,
  experience TEXT,
  specialty TEXT,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  course TEXT,
  rating INTEGER DEFAULT 5,
  text TEXT,
  type TEXT DEFAULT 'text',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  url TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE certificates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_name TEXT NOT NULL,
  level TEXT,
  image_url TEXT NOT NULL,
  issue_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Setup Row Level Security (RLS)
-- We will allow Public (anon) READ access for website visitors
-- We will allow Admin (authenticated) full CRUD access

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- Public READ policies (anyone can view these on the website)
CREATE POLICY "Allow public read on courses" ON courses FOR SELECT USING (true);
CREATE POLICY "Allow public read on teachers" ON teachers FOR SELECT USING (true);
CREATE POLICY "Allow public read on testimonials" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Allow public read on gallery" ON gallery FOR SELECT USING (true);
CREATE POLICY "Allow public read on certificates" ON certificates FOR SELECT USING (true);

-- Authenticated Admin CRUD policies (only logged-in admins can insert/update/delete)
-- Note: students are only visible to admins
CREATE POLICY "Allow admin full access to courses" ON courses FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow admin full access to students" ON students FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow admin full access to teachers" ON teachers FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow admin full access to testimonials" ON testimonials FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow admin full access to gallery" ON gallery FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow admin full access to certificates" ON certificates FOR ALL TO authenticated USING (true);

