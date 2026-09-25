import { withPageOpenGraph } from '../../src/lib/seo';
import { withEmptyPageNoindex } from '../../src/lib/publicContent';

const metadata = withPageOpenGraph({
  title: 'Our German Language Faculty',
  description: 'Meet the German Learning School teaching team supporting live online A1–B2 German classes and Goethe, telc and ÖSD exam preparation.',
  alternates: {
    canonical: '/teachers',
  },
});

// Same interval as the listing pages, so the robots tag follows Admin changes.
export const revalidate = 60;

// noindex,follow while the page has no genuine content (see src/lib/publicContent.js).
export async function generateMetadata() {
  return withEmptyPageNoindex('/teachers', metadata);
}

export default function Layout({ children }) {
  return <>{children}</>;
}
