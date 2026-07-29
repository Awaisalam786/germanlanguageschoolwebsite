import '../src/index.css';
import { GlobalStateProvider } from '../src/context/GlobalStateContext';
import AppLayoutWrapper from '../src/components/AppLayoutWrapper';

export const metadata = {
  title: 'Deutsch Akademie',
  description: 'Learn German Online with Deutsch Akademie',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
        <GlobalStateProvider>
          <AppLayoutWrapper>{children}</AppLayoutWrapper>
        </GlobalStateProvider>
      </body>
    </html>
  );
}
