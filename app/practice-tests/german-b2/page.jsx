import PracticeTestLevelPage from '../../../src/components/PracticeTestLevelPage';
import { withPageOpenGraph } from '../../../src/lib/seo';

export const metadata = withPageOpenGraph({
  title: {
    absolute: 'German B2 Practice Test Online | Free German Test',
  },
  description: 'Practice German B2 online with free mock exercises. Assess your upper-intermediate grammar, advanced vocabulary, and reading for Goethe B2 and TestDaF prep.',
  alternates: {
    canonical: '/practice-tests/german-b2',
  },
  openGraph: {
    title: 'German B2 Practice Test Online | Free German Test',
    description: 'Practice German B2 online with free mock exercises. Assess your upper-intermediate grammar, advanced vocabulary, and reading for Goethe B2 and TestDaF prep.',
    url: 'https://germanlearningschool.com/practice-tests/german-b2',
    siteName: 'German Learning School',
    locale: 'en_PK',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'German B2 Practice Test Online | Free German Test',
    description: 'Practice German B2 online with free mock exercises. Assess your upper-intermediate grammar, advanced vocabulary, and reading for Goethe B2 and TestDaF prep.',
  },
});

export default function GermanB2PracticePage() {
  return <PracticeTestLevelPage level="B2" />;
}
