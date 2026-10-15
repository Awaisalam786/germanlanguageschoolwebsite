import CourseLevelPage from '../../../src/components/CourseLevelPage';
import { withPageOpenGraph } from '../../../src/lib/seo';

export const metadata = withPageOpenGraph({
  title: {
    absolute: 'German B1 Course Online in Pakistan | German Learning School',
  },
  description: 'Join our live online German B1 course in Pakistan on Zoom. Master intermediate grammar, independent speaking, and comprehensive Goethe & telc B1 exam preparation.',
  alternates: {
    canonical: '/courses/german-b1',
  },
  openGraph: {
    title: 'German B1 Course Online in Pakistan | German Learning School',
    description: 'Join our live online German B1 course in Pakistan on Zoom. Master intermediate grammar, independent speaking, and comprehensive Goethe & telc B1 exam preparation.',
    url: 'https://germanlearningschool.com/courses/german-b1',
    siteName: 'German Learning School',
    locale: 'en_PK',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'German B1 Course Online in Pakistan | German Learning School',
    description: 'Join our live online German B1 course in Pakistan on Zoom. Master intermediate grammar, independent speaking, and comprehensive Goethe & telc B1 exam preparation.',
  },
});

export default function GermanB1() {
  return <CourseLevelPage level="B1" />;
}
