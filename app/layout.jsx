import '../src/index.css';
import { GlobalStateProvider } from '../src/context/GlobalStateContext';
import { GlobalContentProvider } from '../src/context/GlobalContentContext';
import AppLayoutWrapper from '../src/components/AppLayoutWrapper';
import SchemaMarkup from '../src/components/SchemaMarkup';

export const metadata = {
  metadataBase: new URL('https://germanlearningschool.com'),
  title: {
    default: 'Learn German Online in Pakistan | German Learning School',
    template: '%s | German Learning School',
  },
  description: 'Learn German online in Pakistan with live Zoom classes for A1–B2. Prepare for Goethe, telc and TestDaF exams with structured lessons, practice and expert support.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Learn German Online in Pakistan | German Learning School',
    description: 'Learn German online in Pakistan with live Zoom classes for A1–B2. Prepare for Goethe, telc and TestDaF exams with structured lessons, practice and expert support.',
    url: 'https://germanlearningschool.com',
    siteName: 'German Learning School',
    locale: 'en_PK',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Learn German Online in Pakistan | German Learning School',
    description: 'Learn German online in Pakistan with live Zoom classes for A1–B2. Prepare for Goethe, telc and TestDaF exams with structured lessons, practice and expert support.',
  }
};

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "German Learning School",
  "url": "https://germanlearningschool.com",
  "logo": "https://germanlearningschool.com/logo.png"
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "German Learning School",
  "url": "https://germanlearningschool.com"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <SchemaMarkup schema={orgSchema} />
        <SchemaMarkup schema={websiteSchema} />
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
