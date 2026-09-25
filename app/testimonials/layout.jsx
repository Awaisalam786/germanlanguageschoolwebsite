import { withPageOpenGraph } from '../../src/lib/seo';
import { withEmptyPageNoindex } from '../../src/lib/publicContent';

const metadata = withPageOpenGraph({
  title: 'Student Testimonials & Reviews',
  description: 'Student feedback about live online German classes and exam preparation at German Learning School, Pakistan.',
  alternates: {
    canonical: '/testimonials',
  },
});

// Same interval as the listing pages, so the robots tag follows Admin changes.
export const revalidate = 60;

// noindex,follow while the page has no genuine content (see src/lib/publicContent.js).
export async function generateMetadata() {
  return withEmptyPageNoindex('/testimonials', metadata);
}

export default function Layout({ children }) {
  return <>{children}</>;
}
