import CourseLevelPage from '../../../src/components/CourseLevelPage';
import { withPageOpenGraph } from '../../../src/lib/seo';

export const metadata = withPageOpenGraph({
  title: {
    absolute: 'German A1 Course in Pakistan (Live Online) | German Learning School',
  },
  description: 'Enroll in our live online German A1 course in Pakistan. Master beginner grammar, vocabulary & speaking with Goethe & telc A1 exam preparation on Zoom.',
  alternates: {
    canonical: '/courses/german-a1',
  },
  openGraph: {
    title: 'German A1 Course in Pakistan (Live Online) | German Learning School',
    description: 'Enroll in our live online German A1 course in Pakistan. Master beginner grammar, vocabulary & speaking with Goethe & telc A1 exam preparation on Zoom.',
    url: 'https://germanlearningschool.com/courses/german-a1',
    siteName: 'German Learning School',
    locale: 'en_PK',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'German A1 Course in Pakistan (Live Online) | German Learning School',
    description: 'Enroll in our live online German A1 course in Pakistan. Master beginner grammar, vocabulary & speaking with Goethe & telc A1 exam preparation on Zoom.',
  },
});

export default function GermanA1() {
  return <CourseLevelPage level="A1" />;
}
