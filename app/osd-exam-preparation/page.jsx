import React from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, AlertCircle, HelpCircle, ExternalLink } from 'lucide-react';
import SchemaMarkup from '../../src/components/SchemaMarkup';
import { withPageOpenGraph } from '../../src/lib/seo';

// Facts on this page come from the official ÖSD website (osd.at), checked on
// the date in LAST_REVIEWED. Keep claims limited to what ÖSD publishes.
const LAST_REVIEWED = '28 September 2026';

export const metadata = withPageOpenGraph({
  title: {
    absolute: 'ÖSD Exam Preparation in Pakistan | German Learning School',
  },
  description: 'Prepare for ÖSD German exams (A1–B2) from Pakistan: exam levels, modules, how ÖSD compares with Goethe and telc, and live online German classes.',
  alternates: {
    canonical: '/osd-exam-preparation',
  },
});

const osdLevels = [
  { level: 'A1', name: 'ÖSD Zertifikat A1 (ZA1)', text: 'Two modules: a written exam (reading, listening, writing) and an oral exam (speaking). Aimed at learners aged 14 and over.', course: '/courses/german-a1' },
  { level: 'A2', name: 'ÖSD Zertifikat A2 (ZA2)', text: 'Elementary German for familiar, routine situations. Builds on A1 and prepares you for B1.', course: '/courses/german-a2' },
  { level: 'B1', name: 'ÖSD Zertifikat B1 (ZB1)', text: 'Four modules: reading, listening, writing and speaking. Developed jointly by ÖSD, the University of Fribourg and the Goethe-Institut, and also offered at Goethe exam centres as the Goethe-Zertifikat B1.', course: '/courses/german-b1' },
  { level: 'B2', name: 'ÖSD Zertifikat B2 (ZB2)', text: 'Upper-intermediate German. ÖSD also offers a B2 version for nursing and medical professions (ZB2/PMB).', course: '/courses/german-b2' },
];

const osdFaqs = [
  {
    q: 'What is the ÖSD exam?',
    a: 'ÖSD (Österreichisches Sprachdiplom Deutsch) is the Austrian system of German language exams. It offers certificates from A1 to C2 aligned with the Common European Framework of Reference for Languages (CEFR), through licensed exam centres in many countries.',
  },
  {
    q: 'Can I take the ÖSD exam in Pakistan?',
    a: 'ÖSD works through licensed exam centres. In March 2026 the ÖSD website reported a licensed ÖSD exam centre in Lahore offering the B1 and B2 exams (ZB1 and ZB2). Exam centres and dates change, so check the exam-centre search on osd.at before you plan your preparation.',
  },
  {
    q: 'Can ÖSD modules be taken separately?',
    a: 'Yes. According to ÖSD, the modules of exams such as the ZA1 and ZB1 can be taken and certified individually or together. If you pass all modules within one year at the same exam centre, you can receive a single certificate listing them.',
  },
  {
    q: 'Is ÖSD accepted in Germany?',
    a: 'ÖSD certificates are internationally recognised CEFR certificates, but acceptance is decided by the institution that asks for proof, such as a German mission, university or employer. Check which certificates they accept before you register for an exam.',
  },
  {
    q: 'ÖSD, Goethe or telc: which should I choose?',
    a: 'All three test the same CEFR levels. Choose the exam that the institution you are applying to accepts and that you can actually book in time. The ÖSD B1 exam (ZB1) was developed together with the Goethe-Institut and is also offered as the Goethe-Zertifikat B1.',
  },
  {
    q: 'Is German Learning School an ÖSD exam centre?',
    a: 'No. German Learning School is an independent preparation provider. We are not affiliated with ÖSD and do not run ÖSD exams. You register for the official exam directly with a licensed ÖSD exam centre.',
  },
];

const sources = [
  { label: 'ÖSD – overview of ÖSD exams', href: 'https://www.osd.at/en/exams/oesd-exams/' },
  { label: 'ÖSD – Zertifikat A1 (ZA1)', href: 'https://www.osd.at/en/exams/oesd-exams/oesd-zertifikat-a1/' },
  { label: 'ÖSD – Zertifikat B1 (ZB1)', href: 'https://www.osd.at/en/exams/oesd-exams/oesd-zertifikat-b1-zb1/' },
  { label: 'ÖSD – German courses and ÖSD exams in Lahore (March 2026)', href: 'https://www.osd.at/en/blog/2026/03/24/german-language-center-lahore-german-courses-and-oesd-exams-in-pakistan/' },
];

export default function OsdExamPreparation() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://germanlearningschool.com/' },
      { '@type': 'ListItem', position: 2, name: 'ÖSD Exam Preparation', item: 'https://germanlearningschool.com/osd-exam-preparation' },
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: osdFaqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  };

  return (
    <>
      <SchemaMarkup schema={breadcrumbSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm text-slate-400">
          <Link href="/" className="hover:text-amber-400 transition-colors">Home</Link>
          <span>&rsaquo;</span>
          <span className="text-slate-200 font-medium">ÖSD Exam Preparation</span>
        </nav>

        <header className="rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-8 sm:p-12 shadow-2xl space-y-6">
          <span className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-extrabold border border-emerald-500/30">
            Independent ÖSD Preparation
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            ÖSD Exam Preparation in Pakistan
          </h1>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Live online German classes from A1 to B2 for Pakistani learners preparing for the Austrian ÖSD German exams, with practice in reading, listening, writing and speaking.
          </p>
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs sm:text-sm text-amber-200/90 leading-relaxed flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong>Disclaimer:</strong> German Learning School is an independent language preparation provider. We are not affiliated with or endorsed by ÖSD and are not an ÖSD exam centre. Exam dates, fees and registration are handled by licensed ÖSD exam centres.
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/courses" className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm sm:text-base rounded-xl shadow-lg flex items-center justify-center gap-2">
              <span>View A1–B2 Courses</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/practice-tests" className="px-6 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm rounded-xl border border-slate-700 flex items-center justify-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>Free German Practice Tests</span>
            </Link>
          </div>
        </header>

        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-4 shadow-xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">What Is the ÖSD Exam?</h2>
          <p className="text-slate-200 leading-relaxed text-sm sm:text-base">
            <strong className="text-white">Short answer:</strong>{' '}ÖSD (Österreichisches Sprachdiplom Deutsch) is the Austrian German exam system, with certificates from A1 to C2 based on the CEFR. Exams are held at licensed ÖSD centres, and modules such as reading, listening, writing and speaking can often be taken separately. To prepare from Pakistan, reach the target level first, then practise each module under timed conditions.
          </p>
          <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
            ÖSD certificates test the same CEFR levels as the Goethe-Zertifikat and telc Deutsch. Which one you take usually depends on what the university, employer or German mission you are applying to accepts, and on which exam you can book in time. Our guide <Link href="/blog/goethe-vs-telc-vs-testdaf-vs-osd-which-german-exam" className="text-amber-400 hover:underline">Goethe vs telc vs TestDaF vs ÖSD</Link> compares the four exams.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">ÖSD Exam Levels from A1 to B2</h2>
          <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
            ÖSD offers exams at every CEFR level, plus versions for young learners and for specific purposes. These are the general exams most relevant to our A1–B2 courses:
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {osdLevels.map((item) => (
              <div key={item.level} className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">CEFR {item.level}</span>
                <h3 className="text-lg font-bold text-white">{item.name}</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{item.text}</p>
                <Link href={item.course} className="inline-block text-xs sm:text-sm font-semibold text-amber-400 hover:underline">German {item.level} course</Link>
              </div>
            ))}
          </div>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            ÖSD also offers C1 and C2 exams, &quot;Österreich&quot; versions used in Austria, and KID exams for young learners. See the ÖSD website for the full list.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">How to Prepare for the ÖSD Exam from Pakistan</h2>
          <ol className="space-y-3 text-sm sm:text-base text-slate-300 leading-relaxed list-decimal pl-5">
            <li><strong className="text-white">Confirm the level and exam you need.</strong> Check which certificate your university, employer or visa appointment accepts before choosing between ÖSD, Goethe and telc.</li>
            <li><strong className="text-white">Find an exam centre and date.</strong> Use the exam-centre search on osd.at. Availability in Pakistan is limited, so check dates early.</li>
            <li><strong className="text-white">Reach the level with a structured course.</strong> Our live online <Link href="/courses/german-a1" className="text-amber-400 hover:underline">A1</Link>, <Link href="/courses/german-a2" className="text-amber-400 hover:underline">A2</Link>, <Link href="/courses/german-b1" className="text-amber-400 hover:underline">B1</Link> and <Link href="/courses/german-b2" className="text-amber-400 hover:underline">B2</Link> courses cover all four skills.</li>
            <li><strong className="text-white">Practise every module.</strong> Work on reading, listening, writing and speaking separately and under time limits. Our <Link href="/practice-tests" className="text-amber-400 hover:underline">free practice tests</Link> help you check your level.</li>
            <li><strong className="text-white">Register with the exam centre.</strong> Book the official exam directly with the licensed ÖSD centre.</li>
          </ol>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {osdFaqs.map((faq) => (
              <div key={faq.q} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-2 shadow-md">
                <h3 className="text-base sm:text-lg font-bold text-white flex items-start gap-2">
                  <span className="text-amber-400 font-extrabold">Q:</span>
                  <span>{faq.q}</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-5">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-extrabold text-white">Related Exam Guides</h2>
          <ul className="grid sm:grid-cols-2 gap-2 text-sm">
            <li><Link href="/goethe-exam-preparation" className="text-slate-300 hover:text-amber-400">Goethe exam preparation</Link></li>
            <li><Link href="/telc-exam-preparation" className="text-slate-300 hover:text-amber-400">telc exam preparation</Link></li>
            <li><Link href="/testdaf-preparation" className="text-slate-300 hover:text-amber-400">TestDaF preparation</Link></li>
            <li><Link href="/german-language-requirements-germany" className="text-slate-300 hover:text-amber-400">German language requirements for Germany</Link></li>
          </ul>
        </section>

        <section className="border-t border-slate-800 pt-6 space-y-2 text-xs text-slate-400">
          <p>Last reviewed: {LAST_REVIEWED}. Sources:</p>
          <ul className="space-y-1">
            {sources.map((s) => (
              <li key={s.href}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-amber-400">
                  {s.label} <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
