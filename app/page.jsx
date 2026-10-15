import { supabase } from '../src/lib/supabaseClient';
import HomeClientPage from './HomeClientPage';
import { DEFAULT_OG_IMAGE } from '../src/lib/seo';

export const revalidate = 60;

export const metadata = {
  title: {
    absolute: 'German Language Course in Pakistan | German Learning School',
  },
  description: 'German language course in Karachi—online A1–B2 Zoom classes, Goethe/telc exam prep and free practice tests, available across Pakistan.',
  alternates: {
    canonical: 'https://germanlearningschool.com/',
    languages: {
      en: 'https://germanlearningschool.com/',
      ur: 'https://germanlearningschool.com/ur',
      'x-default': 'https://germanlearningschool.com/',
    },
  },
  openGraph: {
    title: 'German Language Course in Pakistan | German Learning School',
    description: 'German language course in Karachi—online A1–B2 Zoom classes, Goethe/telc exam prep and free practice tests, available across Pakistan.',
    url: 'https://germanlearningschool.com/',
    siteName: 'German Learning School',
    locale: 'en_PK',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'German Language Course in Pakistan | German Learning School',
    description: 'German language course in Karachi—online A1–B2 Zoom classes, Goethe/telc exam prep and free practice tests, available across Pakistan.',
    images: [DEFAULT_OG_IMAGE.url],
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