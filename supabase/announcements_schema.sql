-- Create announcements table
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    message_text TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read announcements
CREATE POLICY "Anyone can read announcements" 
    ON public.announcements 
    FOR SELECT 
    USING (true);

-- Policy: Only authenticated users (admins) can insert
CREATE POLICY "Admins can insert announcements" 
    ON public.announcements 
    FOR INSERT 
    WITH CHECK (auth.role() = 'authenticated');

-- Policy: Only authenticated users (admins) can update
CREATE POLICY "Admins can update announcements" 
    ON public.announcements 
    FOR UPDATE 
    USING (auth.role() = 'authenticated');

-- Policy: Only authenticated users (admins) can delete
CREATE POLICY "Admins can delete announcements" 
    ON public.announcements 
    FOR DELETE 
    USING (auth.role() = 'authenticated');

