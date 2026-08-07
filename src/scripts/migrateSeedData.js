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

const SUPABASE_URL = envVars.NEXT_PUBLIC_SUPABASE_URL || envVars.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = envVars.SUPABASE_SERVICE_ROLE_KEY || envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

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
  initialBlogPosts,
  initialBundles
} from '../mockData/seedData.js';

async function migrate() {
  console.log('Starting migration...');

  try {
    // 1. Courses
    // Migrated already

    // 1.5 Course Bundles
    // Migrated already

    // 2. Teachers
    // Migrated already

    // 3. Certificates
    // Migrated already

    // 5. Testimonials
    // Migrated already

    // 6. Blog Posts
    if (initialBlogPosts && initialBlogPosts.length > 0) {
      console.log('Migrating Blog Posts...');
      const blogsToInsert = initialBlogPosts.map(b => ({
        title: b.title,
        slug: b.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
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
