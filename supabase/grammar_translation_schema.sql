-- ==============================================================================
-- GRAMMAR TRANSLATION SESSION SCHEMA MIGRATION
-- Project: German Learning School
-- Description:
--   Creates dedicated tables and RLS policies for Grammar Translation sessions:
--     1. public.grammar_translation_topics (Topic metadata and question banks)
--     2. public.grammar_translation_attempts (Detailed practice attempt records)
--     3. public.grammar_translation_suggestions (Student suggestion review queue)
--
-- NOTE: Do NOT run directly from automated environments. Apply via Supabase SQL Editor.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. Table: grammar_translation_topics
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.grammar_translation_topics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    level TEXT NOT NULL CHECK (level IN ('A1', 'A2', 'B1', 'B2')),
    topic_number INT NOT NULL DEFAULT 1,
    topic_title TEXT NOT NULL,
    description TEXT,
    question_count INT NOT NULL DEFAULT 0,
    questions JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT uq_grammar_translation_topic UNIQUE (level, topic_number)
);

CREATE INDEX IF NOT EXISTS idx_gt_topics_level_number
ON public.grammar_translation_topics (level, topic_number);

-- ------------------------------------------------------------------------------
-- 2. Table: grammar_translation_attempts
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.grammar_translation_attempts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_type TEXT NOT NULL DEFAULT 'anonymous', -- 'free' | 'student' | 'anonymous'
    name TEXT,
    email TEXT,
    phone TEXT,
    access_code_used TEXT,
    level TEXT NOT NULL CHECK (level IN ('A1', 'A2', 'B1', 'B2')),
    topic_title TEXT NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard', 'Max', 'All')),
    session_mode TEXT NOT NULL DEFAULT 'standard', -- 'standard' | 'retry_mistakes' | 'repeat_batch'
    total_questions INT NOT NULL,
    correct_count INT NOT NULL DEFAULT 0,
    wrong_count INT NOT NULL DEFAULT 0,
    percentage INT NOT NULL DEFAULT 0,
    question_results JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_gt_attempts_user_id
ON public.grammar_translation_attempts (user_id);

CREATE INDEX IF NOT EXISTS idx_gt_attempts_created
ON public.grammar_translation_attempts (created_at DESC);

-- ------------------------------------------------------------------------------
-- 3. Table: grammar_translation_suggestions
-- Dedicated queue for alternative German translation suggestions
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.grammar_translation_suggestions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    topic_id UUID REFERENCES public.grammar_translation_topics(id) ON DELETE SET NULL,
    level TEXT NOT NULL CHECK (level IN ('A1', 'A2', 'B1', 'B2')),
    topic_title TEXT NOT NULL,
    question_id TEXT NOT NULL,
    english_sentence TEXT NOT NULL,
    official_german TEXT NOT NULL,
    user_typed_answer TEXT,
    suggested_alternative TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    rejection_reason TEXT,
    notes TEXT,
    submitted_by_name TEXT,
    user_type TEXT DEFAULT 'anonymous',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_gt_suggestions_status_created
ON public.grammar_translation_suggestions (status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_gt_suggestions_topic_q
ON public.grammar_translation_suggestions (topic_title, question_id);

-- ------------------------------------------------------------------------------
-- 4. Enable Row Level Security (RLS) & Least-Privilege Grants
-- ------------------------------------------------------------------------------
ALTER TABLE public.grammar_translation_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grammar_translation_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grammar_translation_suggestions ENABLE ROW LEVEL SECURITY;

-- Revoke default open grants
REVOKE ALL ON public.grammar_translation_topics FROM public, anon, authenticated;
REVOKE ALL ON public.grammar_translation_attempts FROM public, anon, authenticated;
REVOKE ALL ON public.grammar_translation_suggestions FROM public, anon, authenticated;

-- Grants:
-- 1. Topics: Read-only for students, full access for service_role
GRANT SELECT ON public.grammar_translation_topics TO anon, authenticated;
GRANT ALL ON public.grammar_translation_topics TO service_role;

-- 2. Attempts: Insert for users, full access for service_role
GRANT INSERT ON public.grammar_translation_attempts TO anon, authenticated;
GRANT SELECT ON public.grammar_translation_attempts TO authenticated;
GRANT ALL ON public.grammar_translation_attempts TO service_role;

-- 3. Suggestions: Insert only for users, full access for service_role
GRANT INSERT ON public.grammar_translation_suggestions TO anon, authenticated;
GRANT ALL ON public.grammar_translation_suggestions TO service_role;

-- ------------------------------------------------------------------------------
-- 5. RLS Policies
-- ------------------------------------------------------------------------------

-- Topics policies
DROP POLICY IF EXISTS "Allow public read active grammar translation topics" ON public.grammar_translation_topics;
CREATE POLICY "Allow public read active grammar translation topics"
ON public.grammar_translation_topics FOR SELECT
TO public
USING (is_active = true);

DROP POLICY IF EXISTS "Allow service_role full access on grammar_translation_topics" ON public.grammar_translation_topics;
CREATE POLICY "Allow service_role full access on grammar_translation_topics"
ON public.grammar_translation_topics FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Attempts policies
DROP POLICY IF EXISTS "Allow users to read own grammar translation attempts" ON public.grammar_translation_attempts;
CREATE POLICY "Allow users to read own grammar translation attempts"
ON public.grammar_translation_attempts FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow public insert on grammar_translation_attempts" ON public.grammar_translation_attempts;
CREATE POLICY "Allow public insert on grammar_translation_attempts"
ON public.grammar_translation_attempts FOR INSERT
TO public
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow service_role full access on grammar_translation_attempts" ON public.grammar_translation_attempts;
CREATE POLICY "Allow service_role full access on grammar_translation_attempts"
ON public.grammar_translation_attempts FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Suggestions policies
DROP POLICY IF EXISTS "Allow public insert pending grammar translation suggestions" ON public.grammar_translation_suggestions;
CREATE POLICY "Allow public insert pending grammar translation suggestions"
ON public.grammar_translation_suggestions FOR INSERT
TO public
WITH CHECK (
    char_length(trim(suggested_alternative)) >= 2 AND
    char_length(suggested_alternative) <= 250 AND
    char_length(trim(english_sentence)) > 0 AND
    char_length(trim(official_german)) > 0 AND
    status = 'pending' AND
    reviewed_at IS NULL AND
    reviewed_by IS NULL AND
    rejection_reason IS NULL
);

DROP POLICY IF EXISTS "Allow service_role full access on grammar_translation_suggestions" ON public.grammar_translation_suggestions;
CREATE POLICY "Allow service_role full access on grammar_translation_suggestions"
ON public.grammar_translation_suggestions FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- ==============================================================================
-- Initial Seed: Planned First Topic (A1 — Nominativ Sentences)
-- ==============================================================================
INSERT INTO public.grammar_translation_topics (
    level,
    topic_number,
    topic_title,
    description,
    question_count,
    questions
) VALUES (
    'A1',
    1,
    'Nominativ Sentences',
    'Practice translating essential German nominative sentences, focusing on subject pronouns, sein/haben, and basic noun articles.',
    0,
    '[]'::jsonb
) ON CONFLICT (level, topic_number) DO NOTHING;
