import CourseLevelPage from '../../../src/components/CourseLevelPage';

export const metadata = {
  title: 'German A2 Course in Pakistan | German Learning School',
  description: 'Join our German A2 course in Pakistan. Expand your vocabulary, past tense grammar, and conversational skills with live online classes and Goethe A2 exam prep.',
  alternates: {
    canonical: '/courses/german-a2',
  },
  openGraph: {
    title: 'German A2 Course in Pakistan | German Learning School',
    description: 'Join our German A2 course in Pakistan. Expand your vocabulary, past tense grammar, and conversational skills with live online classes and Goethe A2 exam prep.',
    url: 'https://germanlearningschool.com/courses/german-a2',
    siteName: 'German Learning School',
    locale: 'en_PK',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'German A2 Course in Pakistan | German Learning School',
    description: 'Join our German A2 course in Pakistan. Expand your vocabulary, past tense grammar, and conversational skills with live online classes and Goethe A2 exam prep.',
  },
};

export default function GermanA2() {
  return <CourseLevelPage level="A2" />;
}
