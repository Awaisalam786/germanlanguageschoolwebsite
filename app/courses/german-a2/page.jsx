import CourseLevelPage from '../../../src/components/CourseLevelPage';
import { withPageOpenGraph } from '../../../src/lib/seo';

export const metadata = withPageOpenGraph({
  title: {
    absolute: 'German A2 Course Online in Pakistan | German Learning School',
  },
  description: 'Advance with our live online German A2 course in Pakistan on Zoom. Master conversational past tense (Perfekt), Dative case, and targeted Goethe A2 exam prep.',
  alternates: {
    canonical: '/courses/german-a2',
  },
  openGraph: {
    title: 'German A2 Course Online in Pakistan | German Learning School',
    description: 'Advance with our live online German A2 course in Pakistan on Zoom. Master conversational past tense (Perfekt), Dative case, and targeted Goethe A2 exam prep.',
    url: 'https://germanlearningschool.com/courses/german-a2',
    siteName: 'German Learning School',
    locale: 'en_PK',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'German A2 Course Online in Pakistan | German Learning School',
    description: 'Advance with our live online German A2 course in Pakistan on Zoom. Master conversational past tense (Perfekt), Dative case, and targeted Goethe A2 exam prep.',
  },
});

export default function GermanA2() {
  return <CourseLevelPage level="A2" />;
}
