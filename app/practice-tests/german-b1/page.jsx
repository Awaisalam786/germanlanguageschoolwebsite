import PracticeTestLevelPage from '../../../src/components/PracticeTestLevelPage';

export const metadata = {
  title: 'German B1 Practice Test Online | Free B1 German Test',
  description: 'Practice German B1 online with exercises covering grammar, vocabulary, reading and practical German communication.',
  alternates: {
    canonical: '/practice-tests/german-b1',
  },
};

export default function GermanB1PracticePage() {
  return <PracticeTestLevelPage level="B1" />;
}
