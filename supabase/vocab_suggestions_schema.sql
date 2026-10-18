-- VOCABULARY SUGGESTIONS & ADMIN APPROVAL SCHEMA
-- For German Learning School Website

-- 1. Create the vocabulary suggestions table
CREATE TABLE IF NOT EXISTS public.vocab_suggestions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    chapter_id UUID REFERENCES public.vocab_chapters(id) ON DELETE SET NULL,
    level TEXT NOT NULL,
    chapter_number INT NOT NULL,
    word_german TEXT NOT NULL,
    word_english TEXT NOT NULL,
    target_language TEXT NOT NULL CHECK (target_language IN ('german', 'english')),
    user_answer TEXT,
    suggested_synonym TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    rejection_reason TEXT,
    submitted_by_name TEXT,
    user_type TEXT DEFAULT 'anonymous',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by TEXT
);

-- 2. Indexes for fast query and queue filtering
CREATE INDEX IF NOT EXISTS idx_vocab_suggestions_status_created 
ON public.vocab_suggestions (status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_vocab_suggestions_chapter 
ON public.vocab_suggestions (level, chapter_number);

-- 3. Enable Row Level Security & Least-Privilege Table Grants
ALTER TABLE public.vocab_suggestions ENABLE ROW LEVEL SECURITY;

-- Explicitly revoke all default table privileges from public and client roles
REVOKE ALL ON public.vocab_suggestions FROM public, anon, authenticated;

-- Discretionary least privilege: anonymous and authenticated users can only INSERT
GRANT INSERT ON public.vocab_suggestions TO anon, authenticated;

-- Service role retains full access for backend Next.js API operations
GRANT ALL ON public.vocab_suggestions TO service_role;

-- 4. Policy: Public/Student can submit suggestions (INSERT only)
-- Validates: status must be 'pending', synonym 2-100 chars, words non-empty, and review metadata must be NULL.
DROP POLICY IF EXISTS "Allow public insert on vocab_suggestions" ON public.vocab_suggestions;
CREATE POLICY "Allow public insert on vocab_suggestions" 
ON public.vocab_suggestions FOR INSERT 
TO public 
WITH CHECK (
    char_length(trim(suggested_synonym)) >= 2 AND 
    char_length(suggested_synonym) <= 100 AND
    char_length(trim(word_german)) > 0 AND 
    char_length(trim(word_english)) > 0 AND
    status = 'pending' AND 
    reviewed_at IS NULL AND 
    reviewed_by IS NULL AND 
    rejection_reason IS NULL
);

-- 5. Admin & Service Role Access
-- All admin review, listing, approval, and rejection actions are mediated strictly
-- through server-side Next.js endpoints using SUPABASE_SERVICE_ROLE_KEY, which
-- bypasses RLS and verifies admin identity via serverAdminAuth.
--
-- Explicitly drop legacy and service_role policies if they exist before recreating:
DROP POLICY IF EXISTS "Allow authenticated admin full access on vocab_suggestions" ON public.vocab_suggestions;
DROP POLICY IF EXISTS "Allow service_role full access on vocab_suggestions" ON public.vocab_suggestions;

CREATE POLICY "Allow service_role full access on vocab_suggestions"
ON public.vocab_suggestions FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- No SELECT, UPDATE, or DELETE permissions or policies are granted to public or ordinary
-- authenticated users/students. Any client-side attempt to read, approve, update,
-- or delete suggestions via the browser Supabase SDK will be denied by both GRANTs and RLS.
