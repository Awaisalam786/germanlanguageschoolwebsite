import { withPageOpenGraph } from '../../src/lib/seo';

export const metadata = withPageOpenGraph({
  title: 'Our German Language Faculty',
  description: 'Meet the German Learning School teaching team supporting live online A1–B2 German classes and Goethe, telc and ÖSD exam preparation.',
  alternates: {
    canonical: '/teachers',
  },
});

export default function Layout({ children }) {
  return <>{children}</>;
}
