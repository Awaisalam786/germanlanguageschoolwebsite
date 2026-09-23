import '../src/index.css';
import { GlobalStateProvider } from '../src/context/GlobalStateContext';
import { GlobalContentProvider } from '../src/context/GlobalContentContext';
import AppLayoutWrapper from '../src/components/AppLayoutWrapper';
import SchemaMarkup from '../src/components/SchemaMarkup';

export const metadata = {
  metadataBase: new URL('https://germanlearningschool.com'),
  title: {
    default: 'German Language Course Online in Pakistan | German Learning School',
    template: '%s | German Learning School',
  },
  description: 'Join live online German language courses in Pakistan for A1, A2, B1, and B2. Goethe exam preparation, native teacher support, mock tests, and affordable fees.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'German Language Course Online in Pakistan | German Learning School',
    description: 'Join live online German language courses in Pakistan for A1, A2, B1, and B2. Goethe exam preparation, native teacher support, mock tests, and affordable fees.',
    url: 'https://germanlearningschool.com',
    siteName: 'German Learning School',
    locale: 'en_PK',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'German Language Course Online in Pakistan | German Learning School',
    description: 'Join live online German language courses in Pakistan for A1, A2, B1, and B2. Goethe exam preparation, native teacher support, mock tests, and affordable fees.',
  },
  verification: {
    google: 'GjivIzYmQiuTYSBSu5qg7KAt9ZiZe4_KbJvUHxbwDLc',
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
        {/* Warm up the connection to Supabase Storage as early as possible —
            the header logo lives there, and without this hint the browser
            only starts DNS/TLS for that origin after React hydrates and the
            settings fetch resolves, which is what made the logo visibly pop
            in late on every page load. */}
        <link rel="preconnect" href="https://owczimivgmivvmsqxpko.supabase.co" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://owczimivgmivvmsqxpko.supabase.co" />
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
