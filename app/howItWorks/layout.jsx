import { withPageOpenGraph } from '../../src/lib/seo';

export const metadata = withPageOpenGraph({
  title: {
    absolute: 'How Online German Classes Work: Schedule & Batches | German Learning School',
  },
  description: 'How German Learning School classes work: live Zoom sessions, HD recorded lectures, structured practice materials, and exam-focused progress from A1 to B2.',
  alternates: {
    canonical: '/howItWorks',
  },
});

export default function Layout({ children }) {
  return <>{children}</>;
}
