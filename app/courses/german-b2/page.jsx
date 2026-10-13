import CourseLevelPage from '../../../src/components/CourseLevelPage';
import { withPageOpenGraph } from '../../../src/lib/seo';

export const metadata = withPageOpenGraph({
  title: {
    absolute: 'German B2 Course in Pakistan (Study & Work) | German Learning School',
  },
  description: 'Master upper-intermediate German with live online B2 classes in Pakistan. Comprehensive Goethe & telc B2 exam coaching for university admission and careers.',
  alternates: {
    canonical: '/courses/german-b2',
  },
  openGraph: {
    title: 'German B2 Course in Pakistan (Study & Work) | German Learning School',
    description: 'Master upper-intermediate German with live online B2 classes in Pakistan. Comprehensive Goethe & telc B2 exam coaching for university admission and careers.',
    url: 'https://germanlearningschool.com/courses/german-b2',
    siteName: 'German Learning School',
    locale: 'en_PK',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'German B2 Course in Pakistan (Study & Work) | German Learning School',
    description: 'Master upper-intermediate German with live online B2 classes in Pakistan. Comprehensive Goethe & telc B2 exam coaching for university admission and careers.',
  },
});

export default function GermanB2() {
  return <CourseLevelPage level="B2" />;
}
