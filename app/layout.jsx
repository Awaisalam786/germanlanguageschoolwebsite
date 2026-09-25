import '../src/index.css';
import { GlobalStateProvider } from '../src/context/GlobalStateContext';
import { GlobalContentProvider } from '../src/context/GlobalContentContext';
import AppLayoutWrapper from '../src/components/AppLayoutWrapper';
import SchemaMarkup from '../src/components/SchemaMarkup';
import { ORGANIZATION_ID } from '../src/lib/seo';

export const metadata = {
  metadataBase: new URL('https://germanlearningschool.com'),
  title: {
    default: 'German Language Course in Pakistan | German Learning School',
    template: '%s | German Learning School',
  },
  description: 'Learn German online in Pakistan with live A1–B2 classes, expert teachers, exam preparation, practice sessions and flexible batches at German Learning School.',
  alternates: {
    canonical: 'https://germanlearningschool.com/',
  },
  openGraph: {
    title: 'German Language Course in Pakistan | German Learning School',
    description: 'Learn German online in Pakistan with live A1–B2 classes, expert teachers, exam preparation, practice sessions and flexible batches at German Learning School.',
    // No `url` here on purpose: a global og:url would be inherited by every
    // route without its own openGraph block and point them all at the
    // homepage. Each route sets og:url from its canonical (see src/lib/seo.js).
    siteName: 'German Learning School',
    locale: 'en_PK',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'German Language Course Online in Pakistan | German Learning School',
    description: 'Join live online German language courses in Pakistan for A1, A2, B1, and B2. Goethe exam preparation, live teacher support, mock tests, and affordable fees.',
  },
  verification: {
    google: 'GjivIzYmQiuTYSBSu5qg7KAt9ZiZe4_KbJvUHxbwDLc',
  }
};

// Only facts that are published on the site: name, URL, logo, market,
// and the public WhatsApp/phone number and email shown in the footer and
// on /contact. No founder, ratings, awards or social profiles (none exist).
const orgSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "@id": ORGANIZATION_ID,
  "name": "German Learning School",
  "url": "https://germanlearningschool.com",
  "logo": "https://germanlearningschool.com/logo.png",
  "description": "Online German language school for students in Pakistan, offering live A1–B2 German classes and preparation for Goethe, telc, ÖSD and TestDaF exams.",
  "email": "germanlanguageschool1@gmail.com",
  "areaServed": { "@type": "Country", "name": "Pakistan" },
  "knowsAbout": [
    "German language",
    "CEFR levels A1–B2",
    "Goethe-Zertifikat exam preparation",
    "telc Deutsch exam preparation",
    "ÖSD exam preparation",
    "TestDaF preparation"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "admissions",
    "telephone": "+92-342-1189593",
    "email": "germanlanguageschool1@gmail.com",
    "areaServed": "PK"
  }
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://germanlearningschool.com/#website",
  "name": "German Learning School",
  "url": "https://germanlearningschool.com",
  "inLanguage": "en",
  "publisher": { "@id": ORGANIZATION_ID }
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
