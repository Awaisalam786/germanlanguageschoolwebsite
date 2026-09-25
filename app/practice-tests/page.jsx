import PracticeTests from '../../src/views/PracticeTests';
import { withPageOpenGraph } from '../../src/lib/seo';

export const metadata = withPageOpenGraph({
  title: 'Free German Practice Tests',
  description: 'Test your German skills with our interactive online practice tests and exams.',
  alternates: {
    canonical: '/practice-tests',
  },
});

export default function PracticeTestsPage() {
  return <PracticeTests />;
}
