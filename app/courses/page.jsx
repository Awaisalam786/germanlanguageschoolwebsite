import { supabase } from '../../src/lib/supabaseClient';
import CoursesClientPage from './CoursesClientPage';

export const revalidate = 60;

export default async function CoursesPage() {
  const { data } = await supabase.from('courses').select('*').order('created_at', { ascending: true });
  let sortedData = [];
  if (data) {
    const levelOrder = { 'A1': 1, 'A2': 2, 'B1': 3, 'B2': 4 };
    sortedData = data.sort((a, b) => (levelOrder[a.level] || 99) - (levelOrder[b.level] || 99));
  }
  return <CoursesClientPage initialCourses={sortedData} />;
}