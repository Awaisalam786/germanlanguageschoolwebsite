import { supabase } from '../src/lib/supabaseClient';
import HomeClientPage from './HomeClientPage';

export const revalidate = 60;

export default async function HomePage() {
  const { data } = await supabase.from('courses').select('*').order('created_at', { ascending: true });
  let sortedData = [];
  if (data) {
    const levelOrder = { 'A1': 1, 'A2': 2, 'B1': 3, 'B2': 4 };
    sortedData = data.sort((a, b) => (levelOrder[a.level] || 99) - (levelOrder[b.level] || 99));
  }
  return <HomeClientPage initialCourses={sortedData} />;
}