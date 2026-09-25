import { withPageOpenGraph } from '../../src/lib/seo';
import { withEmptyPageNoindex } from '../../src/lib/publicContent';

const metadata = withPageOpenGraph({
  title: 'Student Success Stories',
  description: 'See German Learning School student stories, classroom moments, and milestones from learners preparing for German exams and courses online.',
  alternates: {
    canonical: '/gallery',
  },
});

// Same interval as the listing pages, so the robots tag follows Admin changes.
export const revalidate = 60;

// noindex,follow while the page has no genuine content (see src/lib/publicContent.js).
export async function generateMetadata() {
  return withEmptyPageNoindex('/gallery', metadata);
}

export default function Layout({ children }) {
  return <>{children}</>;
}
