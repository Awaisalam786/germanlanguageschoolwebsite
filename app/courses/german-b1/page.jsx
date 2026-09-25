import CourseLevelPage from '../../../src/components/CourseLevelPage';
import { withPageOpenGraph } from '../../../src/lib/seo';

export const metadata = withPageOpenGraph({
  title: 'German B1 Classes & Course in Pakistan | German Learning School',
  description: 'Join live German B1 classes online in Pakistan. Master intermediate grammar, speaking, and vocabulary with expert teachers and Goethe B1 exam preparation.',
  alternates: {
    canonical: '/courses/german-b1',
  },
  openGraph: {
    title: 'German B1 Classes & Course in Pakistan | German Learning School',
    description: 'Join live German B1 classes online in Pakistan. Master intermediate grammar, speaking, and vocabulary with expert teachers and Goethe B1 exam preparation.',
    url: 'https://germanlearningschool.com/courses/german-b1',
    siteName: 'German Learning School',
    locale: 'en_PK',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'German B1 Classes & Course in Pakistan | German Learning School',
    description: 'Join live German B1 classes online in Pakistan. Master intermediate grammar, speaking, and vocabulary with expert teachers and Goethe B1 exam preparation.',
  },
});

export default function GermanB1() {
  return <CourseLevelPage level="B1" />;
}
