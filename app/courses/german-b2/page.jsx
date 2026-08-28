import CourseLevelPage from '../../../src/components/CourseLevelPage';

export const metadata = {
  title: 'German B2 Course in Pakistan',
  description: 'Learn German B2 online in Pakistan with live Zoom classes, structured lessons, practice materials and exam preparation. View the latest batch details and fees.',
  alternates: {
    canonical: '/courses/german-b2',
  },
};

export default function GermanB2() {
  return <CourseLevelPage level="B2" />;
}
