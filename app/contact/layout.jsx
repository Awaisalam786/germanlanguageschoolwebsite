import { withPageOpenGraph } from '../../src/lib/seo';

export const metadata = withPageOpenGraph({
  title: 'Contact Us',
  description: 'Contact German Learning School on WhatsApp or email for admissions, course fees, and batch schedules for German A1–B2 classes in Pakistan.',
  alternates: {
    canonical: '/contact',
  },
});

export default function Layout({ children }) {
  return <>{children}</>;
}
