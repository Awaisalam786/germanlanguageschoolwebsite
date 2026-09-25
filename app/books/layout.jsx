import { withPageOpenGraph } from '../../src/lib/seo';
import { withEmptyPageNoindex } from '../../src/lib/publicContent';

const metadata = withPageOpenGraph({
  title: 'German Learning Books & Resources',
  description: 'Recommended German learning books and study resources for A1–B2 levels and Goethe, telc and ÖSD exam preparation.',
  alternates: {
    canonical: '/books',
  },
});

// Same interval as the listing pages, so the robots tag follows Admin changes.
export const revalidate = 60;

// noindex,follow while the page has no genuine content (see src/lib/publicContent.js).
export async function generateMetadata() {
  return withEmptyPageNoindex('/books', metadata);
}

export default function Layout({ children }) {
  return <>{children}</>;
}
