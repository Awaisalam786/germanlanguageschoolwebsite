import PracticeTestLevelPage from '../../../src/components/PracticeTestLevelPage';

export const metadata = {
  title: {
    absolute: 'German A2 Practice Test Online | Free German Test',
  },
  description: 'Practice German A2 online with free interactive tests. Evaluate your elementary grammar, past tense, and everyday vocabulary for Goethe A2 exam preparation.',
  alternates: {
    canonical: '/practice-tests/german-a2',
  },
  openGraph: {
    title: 'German A2 Practice Test Online | Free German Test',
    description: 'Practice German A2 online with free interactive tests. Evaluate your elementary grammar, past tense, and everyday vocabulary for Goethe A2 exam preparation.',
    url: 'https://germanlearningschool.com/practice-tests/german-a2',
    siteName: 'German Learning School',
    locale: 'en_PK',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'German A2 Practice Test Online | Free German Test',
    description: 'Practice German A2 online with free interactive tests. Evaluate your elementary grammar, past tense, and everyday vocabulary for Goethe A2 exam preparation.',
  },
};

export default function GermanA2PracticePage() {
  return <PracticeTestLevelPage level="A2" />;
}
