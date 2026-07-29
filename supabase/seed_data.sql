-- Seed Data Migration Script

-- Courses
INSERT INTO courses (level, title, duration, price, schedule) VALUES
('A1', 'German A1 — Beginner Online Foundation', '8 Weeks (80 Hours)', '₨35,000 PKR', 'Flexible Live Batches Available'),
('A2', 'German A2 — Online Elementary Fluency', '8 Weeks (80 Hours)', '₨42,000 PKR', 'Flexible Live Batches Available'),
('B1', 'German B1 — Intermediate & Visa Gateway', '10 Weeks (100 Hours)', '₨48,000 PKR', 'Flexible Live Batches Available'),
('B2', 'German B2 — Upper Intermediate Professional', '12 Weeks (120 Hours)', '₨55,000 PKR', 'Flexible Live Batches Available');

-- Teachers
INSERT INTO teachers (name, role, qualification, experience, specialty, image) VALUES
('Prof. Dr. Michael Weber', 'Founder & Head of German Studies', 'Ph.D. in Germanic Linguistics (Heidelberg) • Former Goethe Examiner', '15+ Years Experience', 'Goethe & telc Exam Specialist', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80'),
('Miss Fatima Noor', 'Senior A1-A2 Instructor (Lahore)', 'M.A. German Studies (PU Lahore) & Goethe Certified', '7 Years Experience', 'A1 & A2 Speaking & ÖSD Prep', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=500&q=80'),
('Sir Ahmed Shah', 'Medical & Technical German Specialist (Karachi)', 'telc B2 Medizin Certified Instructor', '9 Years Experience', 'Medical German & Doctor Approbation', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80');

-- Certificates
INSERT INTO certificates (student_name, level, image_url) VALUES
('Usman Chaudhry', 'Goethe-Zertifikat B2', 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80'),
('Ayesha Siddiqui', 'Goethe-Zertifikat A1', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80'),
('Muhammad Tariq', 'Goethe-Zertifikat B1', 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80'),
('Dr. Hamza Bilal', 'telc B2 Medizin', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80');

-- Testimonials
INSERT INTO testimonials (name, course, rating, text, type) VALUES
('Muhammad Usman', 'Passed Goethe B2 (94 Marks)', 5, 'Attending live online classes from my home in Lahore saved me hours of commuting. Dr. Weber’s exam techniques helped me clear Goethe B2 on my first attempt!', 'text'),
('Ayesha Siddiqui', 'Passed B1 in 4 Months', 5, 'The evening 8:00 PM PKT batch fit perfectly with my job routine. Recorded class access was super helpful when I had internet glitches.', 'text'),
('Dr. Hamza Bilal', 'Telc B2 Medizin Certified', 5, 'As a busy medical doctor in Karachi, taking live Zoom classes at night was ideal. Passed my Fachsprachenprüfung medical German exam smoothly!', 'text');

-- Blog Posts
INSERT INTO blog_posts (title, category, author, read_time, summary, content, image) VALUES
('Why Learn German in 2026? 7 Reasons for Career Growth & University Admission', 'Career & Visas', 'Prof. Dr. Michael Weber', '7 min read', 'Discover how mastering German unlocks tuition-free university education, Chancenkarte job seeker visas, and high-paying careers in Germany.', 'Germany is Europe''s strongest economy and offers unprecedented opportunities for Pakistani students and skilled professionals in 2026.

### Top Reasons to Learn German:
1. **Tuition-Free Universities**: Over 300 public universities in Germany charge €0 tuition fee for bachelor and master degrees.
2. **The Opportunity Card (Chancenkarte)**: Gain 1-3 points for German A2-B2 language certificates to move to Germany and seek employment.
3. **High Demand for IT & Healthcare**: Software engineers, doctors, and nurses enjoy expedited visa processing with B1/B2 German.
4. **Permanent Residency**: Clear German B1/B2 to secure German PR in as little as 21-27 months after working.', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80'),
('How to Book Goethe Exam Slot in Islamabad & Karachi in 2026', 'Goethe Exam Pakistan', 'Miss Fatima Noor', '6 min read', 'Step-by-step guide to securing Goethe-Zertifikat A1, B1, and B2 exam dates at Goethe-Institut Karachi and Goethe-Zentrum Islamabad.', 'Securing a Goethe exam slot in Pakistan requires speed and preparation. Here is everything you need to know:
    
1. **Exam Centers in Pakistan**:
   - Goethe-Institut Karachi
   - Goethe-Zentrum Islamabad
   - Annemarie-Schimmel-Haus Lahore

2. **When Slots Open**: Exam seats open online on the 1st of every month at 10:00 AM PKT.
3. **Required Documents**: Original Passport and CNIC copy.', 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80');


