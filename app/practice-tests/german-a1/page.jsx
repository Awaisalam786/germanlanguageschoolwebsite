import PracticeTestLevelPage from '../../../src/components/PracticeTestLevelPage';

export const metadata = {
  title: 'German A1 Practice Test Online | Free A1 German Test',
  description: 'Practice German A1 online with interactive exercises covering vocabulary, grammar, reading and basic German skills.',
  alternates: {
    canonical: '/practice-tests/german-a1',
  },
};

export default function GermanA1PracticePage() {
  return <PracticeTestLevelPage level="A1" />;
}
