import { withPageOpenGraph } from '../../src/lib/seo';

export const metadata = withPageOpenGraph({
  title: 'About the Founder',
  description: 'Meet the founder and head mentor of German Learning School, and learn the story behind Pakistan\'s online German language academy.',
  alternates: {
    canonical: '/founder',
  },
});

export default function Layout({ children }) {
  return <>{children}</>;
}
