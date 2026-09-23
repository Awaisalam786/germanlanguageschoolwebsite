import { supabase } from '../src/lib/supabaseClient';
import HomeClientPage from './HomeClientPage';

export const revalidate = 60;

export const metadata = {
  title: {
    absolute: 'German Language Course in Pakistan | German Learning School',
  },
  description: 'Learn German online in Pakistan with live A1–B2 classes, expert teachers, exam preparation, practice sessions and flexible batches at German Learning School.',
  alternates: {
    canonical: 'https://germanlearningschool.com/',
  },
  openGraph: {
    title: 'German Language Course in Pakistan | German Learning School',
    description: 'Learn German online in Pakistan with live A1–B2 classes, expert teachers, exam preparation, practice sessions and flexible batches at German Learning School.',
    url: 'https://germanlearningschool.com/',
    siteName: 'German Learning School',
    locale: 'en_PK',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'German Language Course in Pakistan | German Learning School',
    description: 'Learn German online in Pakistan with live A1–B2 classes, expert teachers, exam preparation, practice sessions and flexible batches at German Learning School.',
  },
};

export default async function HomePage() {
  const [coursesRes, bundlesRes] = await Promise.all([
    supabase.from('courses').select('*').order('created_at', { ascending: true }),
    supabase.from('course_bundles').select('*').order('created_at', { ascending: true })
  ]);

  let sortedData = [];
  if (coursesRes.data) {
    const levelOrder = { 'A1': 1, 'A2': 2, 'B1': 3, 'B2': 4 };
    sortedData = coursesRes.data.sort((a, b) => (levelOrder[a.level] || 99) - (levelOrder[b.level] || 99));
  }
  return <HomeClientPage initialCourses={sortedData} initialBundles={bundlesRes.data || []} />;
}