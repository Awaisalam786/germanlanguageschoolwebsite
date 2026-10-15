import CourseLevelPage from '../../../src/components/CourseLevelPage';
import { withPageOpenGraph } from '../../../src/lib/seo';

export const metadata = withPageOpenGraph({
  title: {
    absolute: 'German B2 Course Online in Pakistan | German Learning School',
  },
  description: 'Enroll in our live online German B2 course in Pakistan on Zoom. Master upper-intermediate grammar, professional fluency, and targeted Goethe & telc B2 exam preparation.',
  alternates: {
    canonical: '/courses/german-b2',
  },
  openGraph: {
    title: 'German B2 Course Online in Pakistan | German Learning School',
    description: 'Enroll in our live online German B2 course in Pakistan on Zoom. Master upper-intermediate grammar, professional fluency, and targeted Goethe & telc B2 exam preparation.',
    url: 'https://germanlearningschool.com/courses/german-b2',
    siteName: 'German Learning School',
    locale: 'en_PK',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'German B2 Course Online in Pakistan | German Learning School',
    description: 'Enroll in our live online German B2 course in Pakistan on Zoom. Master upper-intermediate grammar, professional fluency, and targeted Goethe & telc B2 exam preparation.',
  },
});

export default function GermanB2() {
  return <CourseLevelPage level="B2" />;
}
