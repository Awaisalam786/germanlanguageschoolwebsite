import PracticeTestLevelPage from '../../../src/components/PracticeTestLevelPage';

export const metadata = {
  title: 'German B2 Practice Test Online | Free B2 German Test',
  description: 'Practice German B2 online with exercises covering advanced grammar, vocabulary, reading and German communication.',
  alternates: {
    canonical: '/practice-tests/german-b2',
  },
};

export default function GermanB2PracticePage() {
  return <PracticeTestLevelPage level="B2" />;
}
