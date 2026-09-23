import PracticeTestLevelPage from '../../../src/components/PracticeTestLevelPage';

export const metadata = {
  title: {
    absolute: 'German B1 Practice Test Online | Free German Test',
  },
  description: 'Take our free German B1 practice test online. Test intermediate German grammar, complex sentences, and vocabulary to prepare for the Goethe B1 certificate.',
  alternates: {
    canonical: '/practice-tests/german-b1',
  },
  openGraph: {
    title: 'German B1 Practice Test Online | Free German Test',
    description: 'Take our free German B1 practice test online. Test intermediate German grammar, complex sentences, and vocabulary to prepare for the Goethe B1 certificate.',
    url: 'https://germanlearningschool.com/practice-tests/german-b1',
    siteName: 'German Learning School',
    locale: 'en_PK',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'German B1 Practice Test Online | Free German Test',
    description: 'Take our free German B1 practice test online. Test intermediate German grammar, complex sentences, and vocabulary to prepare for the Goethe B1 certificate.',
  },
};

export default function GermanB1PracticePage() {
  return <PracticeTestLevelPage level="B1" />;
}
