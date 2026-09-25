import PracticeTestLevelPage from '../../../src/components/PracticeTestLevelPage';
import { withPageOpenGraph } from '../../../src/lib/seo';

export const metadata = withPageOpenGraph({
  title: {
    absolute: 'German A1 Practice Test Online | Free German Test',
  },
  description: 'Practice German A1 online with free interactive tests. Test your beginner German grammar, vocabulary, and reading skills to prepare for the Goethe A1 exam.',
  alternates: {
    canonical: '/practice-tests/german-a1',
  },
  openGraph: {
    title: 'German A1 Practice Test Online | Free German Test',
    description: 'Practice German A1 online with free interactive tests. Test your beginner German grammar, vocabulary, and reading skills to prepare for the Goethe A1 exam.',
    url: 'https://germanlearningschool.com/practice-tests/german-a1',
    siteName: 'German Learning School',
    locale: 'en_PK',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'German A1 Practice Test Online | Free German Test',
    description: 'Practice German A1 online with free interactive tests. Test your beginner German grammar, vocabulary, and reading skills to prepare for the Goethe A1 exam.',
  },
});

export default function GermanA1PracticePage() {
  return <PracticeTestLevelPage level="A1" />;
}
