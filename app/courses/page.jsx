import { supabase } from '../../src/lib/supabaseClient';
import CoursesClientPage from './CoursesClientPage';

export const revalidate = 60;

export default async function CoursesPage() {
  const [coursesRes, bundlesRes] = await Promise.all([
    supabase.from('courses').select('*').order('created_at', { ascending: true }),
    supabase.from('course_bundles').select('*').order('created_at', { ascending: true })
  ]);

  let sortedData = [];
  if (coursesRes.data) {
    const levelOrder = { 'A1': 1, 'A2': 2, 'B1': 3, 'B2': 4 };
    sortedData = coursesRes.data.sort((a, b) => (levelOrder[a.level] || 99) - (levelOrder[b.level] || 99));
  }
  return <CoursesClientPage initialCourses={sortedData} initialBundles={bundlesRes.data || []} />;
}