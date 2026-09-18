import { supabase } from '../../src/lib/supabaseClient';
import TeachersClientPage from './TeachersClientPage';

export const revalidate = 60;

export default async function TeachersPage() {
  const { data } = await supabase.from('teachers').select('*').order('created_at', { ascending: false });
  return <TeachersClientPage initialTeachers={data || []} />;
}