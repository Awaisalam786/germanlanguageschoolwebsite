import CourseLevelPage from '../../../src/components/CourseLevelPage';
import { withPageOpenGraph } from '../../../src/lib/seo';

export const metadata = withPageOpenGraph({
  title: 'German B2 Course in Pakistan | German Learning School',
  description: 'Advance your fluency with our German B2 course in Pakistan. Live online classes covering professional German, advanced grammar, and Goethe B2 exam preparation.',
  alternates: {
    canonical: '/courses/german-b2',
  },
  openGraph: {
    title: 'German B2 Course in Pakistan | German Learning School',
    description: 'Advance your fluency with our German B2 course in Pakistan. Live online classes covering professional German, advanced grammar, and Goethe B2 exam preparation.',
    url: 'https://germanlearningschool.com/courses/german-b2',
    siteName: 'German Learning School',
    locale: 'en_PK',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'German B2 Course in Pakistan | German Learning School',
    description: 'Advance your fluency with our German B2 course in Pakistan. Live online classes covering professional German, advanced grammar, and Goethe B2 exam preparation.',
  },
});

export default function GermanB2() {
  return <CourseLevelPage level="B2" />;
}
