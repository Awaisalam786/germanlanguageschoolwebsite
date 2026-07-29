import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import {
  initialCourses,
  initialTeachers,
  initialCertificates,
  initialTestimonials,
  initialBlogPosts
} from '../mockData/seedData.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputPath = 'C:\\\\Users\\\\ABC\\\\.gemini\\\\antigravity\\\\brain\\\\df9be6a4-e5d1-4bac-95fd-76bfb42b7549\\\\seed_data.sql.md';

let sql = '```sql\n';
sql += '-- Seed Data Migration Script\n\n';

function escapeString(str) {
  if (typeof str !== 'string') return 'NULL';
  return "'" + str.replace(/'/g, "''") + "'";
}

// 1. Courses
if (initialCourses && initialCourses.length > 0) {
  sql += '-- Courses\n';
  sql += 'INSERT INTO courses (level, title, duration, price, schedule) VALUES\n';
  const rows = initialCourses.map(c => `(${escapeString(c.level)}, ${escapeString(c.title)}, ${escapeString(c.duration)}, ${escapeString(c.feesPKR)}, ${escapeString(c.schedule)})`);
  sql += rows.join(',\n') + ';\n\n';
}

// 2. Teachers
if (initialTeachers && initialTeachers.length > 0) {
  sql += '-- Teachers\n';
  sql += 'INSERT INTO teachers (name, role, qualification, experience, specialty, image) VALUES\n';
  const rows = initialTeachers.map(t => `(${escapeString(t.name)}, ${escapeString(t.role)}, ${escapeString(t.qualification)}, ${escapeString(t.experience)}, ${escapeString(t.specialty)}, ${escapeString(t.image)})`);
  sql += rows.join(',\n') + ';\n\n';
}

// 3. Certificates
if (initialCertificates && initialCertificates.length > 0) {
  sql += '-- Certificates\n';
  sql += 'INSERT INTO certificates (student_name, level, image_url) VALUES\n';
  const rows = initialCertificates.map(c => `(${escapeString(c.studentName)}, ${escapeString(c.examBody)}, ${escapeString(c.imageUrl)})`);
  sql += rows.join(',\n') + ';\n\n';
}

// 4. Testimonials
if (initialTestimonials && initialTestimonials.length > 0) {
  sql += '-- Testimonials\n';
  sql += 'INSERT INTO testimonials (name, course, rating, text, type) VALUES\n';
  const rows = initialTestimonials.map(t => `(${escapeString(t.name)}, ${escapeString(t.levelAchieved)}, ${t.rating || 5}, ${escapeString(t.text)}, 'text')`);
  sql += rows.join(',\n') + ';\n\n';
}

// 5. Blog Posts
if (initialBlogPosts && initialBlogPosts.length > 0) {
  sql += '-- Blog Posts\n';
  sql += 'INSERT INTO blog_posts (title, category, author, read_time, summary, content, image) VALUES\n';
  const rows = initialBlogPosts.map(b => `(${escapeString(b.title)}, ${escapeString(b.category)}, ${escapeString(b.author)}, ${escapeString(b.readTime)}, ${escapeString(b.summary)}, ${escapeString(b.content)}, ${escapeString(b.image)})`);
  sql += rows.join(',\n') + ';\n\n';
}

sql += '```\n';

fs.writeFileSync(outputPath, sql, 'utf-8');
console.log('Generated seed_data.sql.md artifact');
