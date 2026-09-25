import { withPageOpenGraph } from '../../src/lib/seo';

export const metadata = withPageOpenGraph({
  title: 'Free German Translator Tool',
  description: 'Translate German words and phrases with our free online translator, then explore courses and practice tools to build your German skills.',
  alternates: {
    canonical: '/translator',
  },
});

export default function Layout({ children }) {
  return <>{children}</>;
}
