import CourseLevelPage from '../../../src/components/CourseLevelPage';
import { withPageOpenGraph } from '../../../src/lib/seo';

export const metadata = withPageOpenGraph({
  title: {
    absolute: 'German A2 Course in Pakistan (Live Online) | German Learning School',
  },
  description: 'Advance your German with live online A2 classes in Pakistan. Master conversational past tense, Dative case & Goethe and telc A2 exam preparation.',
  alternates: {
    canonical: '/courses/german-a2',
  },
  openGraph: {
    title: 'German A2 Course in Pakistan (Live Online) | German Learning School',
    description: 'Advance your German with live online A2 classes in Pakistan. Master conversational past tense, Dative case & Goethe and telc A2 exam preparation.',
    url: 'https://germanlearningschool.com/courses/german-a2',
    siteName: 'German Learning School',
    locale: 'en_PK',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'German A2 Course in Pakistan (Live Online) | German Learning School',
    description: 'Advance your German with live online A2 classes in Pakistan. Master conversational past tense, Dative case & Goethe and telc A2 exam preparation.',
  },
});

export default function GermanA2() {
  return <CourseLevelPage level="A2" />;
}
