import Dashboard from '../../src/views/Dashboard';

export const metadata = {
  title: 'Student Dashboard',
  description: 'View your practice test results and progress.',
  robots: { index: false, follow: false }
};

export default function DashboardPage() {
  return <Dashboard />;
}
