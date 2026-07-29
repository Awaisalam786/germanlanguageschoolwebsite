-- Align teachers table with frontend UI
ALTER TABLE teachers 
ADD COLUMN IF NOT EXISTS qualification TEXT,
ADD COLUMN IF NOT EXISTS experience TEXT,
ADD COLUMN IF NOT EXISTS specialty TEXT,
ADD COLUMN IF NOT EXISTS email TEXT;

-- Align students table with frontend UI
ALTER TABLE students 
ADD COLUMN IF NOT EXISTS course_level TEXT,
ADD COLUMN IF NOT EXISTS attendance TEXT,
ADD COLUMN IF NOT EXISTS grade TEXT,
ADD COLUMN IF NOT EXISTS mode TEXT;

-- Align certificates table with frontend UI
ALTER TABLE certificates 
ADD COLUMN IF NOT EXISTS congrats_title TEXT,
ADD COLUMN IF NOT EXISTS exam_body TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS score TEXT,
ADD COLUMN IF NOT EXISTS quote TEXT,
ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT true;

-- For backwards compatibility with the UI's camelCase expectations
-- We'll just store these as simple text for now since it's a quick migration

