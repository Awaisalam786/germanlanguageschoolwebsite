import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

// Get the current directory and read .env
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '../../.env');
const envFile = fs.readFileSync(envPath, 'utf-8');

const envVars = {};
envFile.split('\n').forEach(line => {
  const [key, ...value] = line.split('=');
  if (key && value) {
    envVars[key.trim()] = value.join('=').trim().replace(/['"]/g, '');
  }
});

const SUPABASE_URL = envVars.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = envVars.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Dynamically import seedData.js
import {
  initialCourses,
  initialTeachers,
  initialCertificates,
  initialTestimonials,
  initialBlogPosts
} from '../mockData/seedData.js';

async function migrate() {
  console.log('Starting migration...');

  try {
    // 1. Courses
    if (initialCourses && initialCourses.length > 0) {
      console.log('Migrating Courses...');
      const coursesToInsert = initialCourses.map(c => ({
        level: c.level,
        title: c.title,
        duration: c.duration,
        price: c.feesPKR, // Mapping feesPKR to price
        schedule: c.schedule
      }));
      const { error } = await supabase.from('courses').insert(coursesToInsert);
      if (error) console.error('Error inserting courses:', error);
      else console.log(`Inserted ${coursesToInsert.length} courses.`);
    }

    // 2. Teachers
    if (initialTeachers && initialTeachers.length > 0) {
      console.log('Migrating Teachers...');
      const teachersToInsert = initialTeachers.map(t => ({
        name: t.name,
        role: t.role,
        qualification: t.qualification,
        experience: t.experience,
        specialty: t.specialty,
        image: t.image
      }));
      const { error } = await supabase.from('teachers').insert(teachersToInsert);
      if (error) console.error('Error inserting teachers:', error);
      else console.log(`Inserted ${teachersToInsert.length} teachers.`);
    }

    // 3. Certificates
    if (initialCertificates && initialCertificates.length > 0) {
      console.log('Migrating Certificates...');
      const certsToInsert = initialCertificates.map(c => ({
        student_name: c.studentName,
        level: c.examBody,
        image_url: c.imageUrl
      }));
      const { error } = await supabase.from('certificates').insert(certsToInsert);
      if (error) console.error('Error inserting certificates:', error);
      else console.log(`Inserted ${certsToInsert.length} certificates.`);
    }

    // 5. Testimonials
    if (initialTestimonials && initialTestimonials.length > 0) {
      console.log('Migrating Testimonials...');
      const testToInsert = initialTestimonials.map(t => ({
        name: t.name,
        course: t.levelAchieved, // Using levelAchieved as course
        rating: t.rating,
        text: t.text,
        type: 'text'
      }));
      const { error } = await supabase.from('testimonials').insert(testToInsert);
      if (error) console.error('Error inserting testimonials:', error);
      else console.log(`Inserted ${testToInsert.length} testimonials.`);
    }

    // 6. Blog Posts
    if (initialBlogPosts && initialBlogPosts.length > 0) {
      console.log('Migrating Blog Posts...');
      const blogsToInsert = initialBlogPosts.map(b => ({
        title: b.title,
        category: b.category,
        author: b.author,
        read_time: b.readTime,
        summary: b.summary,
        content: b.content,
        image: b.image
      }));
      const { error } = await supabase.from('blog_posts').insert(blogsToInsert);
      if (error) console.error('Error inserting blog posts:', error);
      else console.log(`Inserted ${blogsToInsert.length} blog posts.`);
    }

    console.log('Migration complete!');
  } catch (err) {
    console.error('Migration failed:', err);
  }
}

migrate();
