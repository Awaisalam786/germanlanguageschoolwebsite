import CourseLevelPage from '../../../src/components/CourseLevelPage';
import { withPageOpenGraph } from '../../../src/lib/seo';

export const metadata = withPageOpenGraph({
  title: {
    absolute: 'German B1 Course in Pakistan (Ausbildung & Work) | German Learning School',
  },
  description: 'Join live online German B1 classes in Pakistan. Prepare for the German vocational training (Ausbildung) visa and work permits with Goethe & telc B1 coaching.',
  alternates: {
    canonical: '/courses/german-b1',
  },
  openGraph: {
    title: 'German B1 Course in Pakistan (Ausbildung & Work) | German Learning School',
    description: 'Join live online German B1 classes in Pakistan. Prepare for the German vocational training (Ausbildung) visa and work permits with Goethe & telc B1 coaching.',
    url: 'https://germanlearningschool.com/courses/german-b1',
    siteName: 'German Learning School',
    locale: 'en_PK',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'German B1 Course in Pakistan (Ausbildung & Work) | German Learning School',
    description: 'Join live online German B1 classes in Pakistan. Prepare for the German vocational training (Ausbildung) visa and work permits with Goethe & telc B1 coaching.',
  },
});

export default function GermanB1() {
  return <CourseLevelPage level="B1" />;
}
