import CourseLevelPage from '../../../src/components/CourseLevelPage';
import { withPageOpenGraph } from '../../../src/lib/seo';

export const metadata = withPageOpenGraph({
  title: 'German A1 Course in Pakistan | German Learning School',
  description: 'Enroll in our German A1 course in Pakistan. Master basic German grammar, speaking, and vocabulary with live online Zoom classes and Goethe A1 exam preparation.',
  alternates: {
    canonical: '/courses/german-a1',
  },
  openGraph: {
    title: 'German A1 Course in Pakistan | German Learning School',
    description: 'Enroll in our German A1 course in Pakistan. Master basic German grammar, speaking, and vocabulary with live online Zoom classes and Goethe A1 exam preparation.',
    url: 'https://germanlearningschool.com/courses/german-a1',
    siteName: 'German Learning School',
    locale: 'en_PK',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'German A1 Course in Pakistan | German Learning School',
    description: 'Enroll in our German A1 course in Pakistan. Master basic German grammar, speaking, and vocabulary with live online Zoom classes and Goethe A1 exam preparation.',
  },
});

export default function GermanA1() {
  return <CourseLevelPage level="A1" />;
}
