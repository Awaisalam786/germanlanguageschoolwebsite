-- NOUN BUILDER SCHEMA

CREATE TABLE IF NOT EXISTS public.noun_builder_nouns (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    german_noun TEXT NOT NULL,
    article TEXT NOT NULL CHECK (article IN ('der', 'die', 'das')),
    english_meaning TEXT NOT NULL,
    plural TEXT,
    example_sentence TEXT,
    english_translation TEXT,
    cefr_level TEXT NOT NULL,
    memory_tip TEXT,
    image_url TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Future student results table
CREATE TABLE IF NOT EXISTS public.noun_builder_results (
    id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    student_id UUID, -- Foreign key could be added when auth is fully integrated
    noun_id UUID REFERENCES public.noun_builder_nouns(id) ON DELETE CASCADE,
    status TEXT CHECK (status IN ('known', 'needs_practice')),
    last_practiced TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.noun_builder_nouns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.noun_builder_results ENABLE ROW LEVEL SECURITY;

-- Public READ policies (anyone can view these on the website to practice)
CREATE POLICY "Allow public read on noun_builder_nouns" ON public.noun_builder_nouns FOR SELECT USING (status = 'active');

-- Admin CRUD policies (only logged-in admins can insert/update/delete)
CREATE POLICY "Allow admin full access to noun_builder_nouns" ON public.noun_builder_nouns FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow admin full access to noun_builder_results" ON public.noun_builder_results FOR ALL TO authenticated USING (true);
