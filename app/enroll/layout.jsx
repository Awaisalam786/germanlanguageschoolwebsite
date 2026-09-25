import { withPageOpenGraph } from '../../src/lib/seo';

export const metadata = withPageOpenGraph({
  title: 'Enroll Now',
  description: 'Ask about enrollment for live online German A1–B2 courses, current fees, batch schedules, and Goethe or telc exam preparation in Pakistan.',
  alternates: {
    canonical: '/enroll',
  },
});

export default function Layout({ children }) {
  return <>{children}</>;
}
