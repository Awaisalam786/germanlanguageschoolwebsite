import CourseLevelPage from '../../../src/components/CourseLevelPage';

export const metadata = {
  title: 'German B1 Course in Pakistan',
  description: 'Learn German B1 online in Pakistan with live Zoom classes, structured lessons, practice materials and exam preparation. View the latest batch details and fees.',
  alternates: {
    canonical: '/courses/german-b1',
  },
};

export default function GermanB1() {
  return <CourseLevelPage level="B1" />;
}
