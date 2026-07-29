-- Create the site_settings table to store global text and configuration
CREATE TABLE site_settings (
  id TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Allow anyone (public) to read the settings
CREATE POLICY "Allow public read on site_settings" 
ON site_settings FOR SELECT USING (true);

-- Allow only logged-in Admins to update settings
CREATE POLICY "Allow admin full access to site_settings" 
ON site_settings FOR ALL TO authenticated USING (true);

-- Insert default values (so the website doesn't break)
INSERT INTO site_settings (id, value, description) VALUES 
('whatsapp_number', '03421189593', 'The main WhatsApp contact number'),
('support_email', 'germanlanguageschool1@gmail.com', 'The main support email address'),
('watermark_text', '03421189593', 'The text used for watermarking certificates and gallery images'),
('address', 'Online Classes via Zoom / Google Meet', 'The physical or virtual address displayed in footer');

