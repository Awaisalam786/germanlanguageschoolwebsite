import '../src/index.css';
import { GlobalStateProvider } from '../src/context/GlobalStateContext';
import { GlobalContentProvider } from '../src/context/GlobalContentContext';
import AppLayoutWrapper from '../src/components/AppLayoutWrapper';

export const metadata = {
  metadataBase: new URL('https://germanlearningschool.com'),
  title: {
    default: 'German Learning School | #1 Online German Course in Pakistan',
    template: '%s | German Learning School',
  },
  description: "Pakistan's #1 online German language academy. Live Zoom classes for A1–B2, Goethe/telc/TestDaF exam prep, 98.4% pass rate. Enroll from anywhere in Pakistan.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Meta Pixel base code will be added here once Pixel ID is generated */}
      </head>
      <body className="min-h-screen overflow-x-hidden bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
        <GlobalStateProvider>
          <GlobalContentProvider>
            <AppLayoutWrapper>{children}</AppLayoutWrapper>
          </GlobalContentProvider>
        </GlobalStateProvider>
      </body>
    </html>
  );
}
