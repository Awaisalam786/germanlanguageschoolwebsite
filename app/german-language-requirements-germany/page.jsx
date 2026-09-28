import React from 'react';
import Link from 'next/link';
import { ArrowRight, AlertCircle, HelpCircle, ExternalLink } from 'lucide-react';
import SchemaMarkup from '../../src/components/SchemaMarkup';
import { withPageOpenGraph } from '../../src/lib/seo';

// Requirements on this page follow official German government sources
// (Make it in Germany overview "Required German language skills depending on
// the type of visa", as of January 2026, plus the pages listed in SOURCES).
// Rules change: re-check the sources and update LAST_REVIEWED when editing.
const LAST_REVIEWED = '28 September 2026';

export const metadata = withPageOpenGraph({
  title: {
    absolute: 'German Language Requirements for Germany | German Learning School',
  },
  description: 'The German level needed for the Opportunity Card, Ausbildung, work, study, family reunion and doctors, from official sources, explained for Pakistani applicants.',
  alternates: {
    canonical: '/german-language-requirements-germany',
  },
});

const requirementRows = [
  { route: 'Opportunity Card (Chancenkarte), points system', level: 'At least A1 German or B2 English', link: '/courses/german-a1', linkText: 'A1 course' },
  { route: 'Vocational training (Ausbildung) visa', level: 'Normally at least B1 German', link: '/courses/german-b1', linkText: 'B1 course' },
  { route: 'Visa to look for a vocational training place', level: 'At least B1 German', link: '/courses/german-b1', linkText: 'B1 course' },
  { route: 'Visa for recognition of foreign qualifications / recognition partnership', level: 'At least A2 German', link: '/courses/german-a2', linkText: 'A2 course' },
  { route: 'Work visa for qualified professionals and EU Blue Card', level: 'No legal German requirement (employers may expect German)', link: '/courses', linkText: 'All courses' },
  { route: 'Work visa for professionally experienced workers', level: 'No legal German requirement', link: '/courses', linkText: 'All courses' },
  { route: 'Student visa', level: 'The language requirement of your study programme; for some programmes B2 German', link: '/testdaf-preparation', linkText: 'TestDaF preparation' },
];

const faqs = [
  {
    q: 'What German level do I need to move to Germany?',
    a: 'It depends on your route. According to Make it in Germany (as of January 2026), the points-based Opportunity Card needs at least A1 German or B2 English, the vocational training (Ausbildung) visa normally needs B1, the recognition visa needs A2, and the work visa for qualified professionals and the EU Blue Card have no legal German requirement.',
  },
  {
    q: 'Is B1 German required for Ausbildung?',
    a: 'Yes, normally. Make it in Germany states that for the vocational training visa you will normally need German at level B1. The visa to look for a training place also requires at least B1. Your training company may expect more.',
  },
  {
    q: 'How many Opportunity Card points does German give?',
    a: 'Under the points system, German at A2 earns one point, B1 earns two points, and B2 or above earns three points. A1 German (or B2 English) is the minimum requirement and earns no points. Language certificates are generally accepted only if the exam was taken within the last year.',
  },
  {
    q: 'Does my spouse need German to join me in Germany?',
    a: 'In many family-reunion cases the spouse must show basic German (A1) before arrival. Make it in Germany states that no German proof is required for family members joining a skilled worker with a valid residence title. Check the rules for your case with the German mission.',
  },
  {
    q: 'What German level do doctors need for Approbation?',
    a: 'In most federal states, doctors need general German at B2 level plus a medical language exam (Fachsprachprüfung) oriented to C1. For example, the Berlin Medical Association describes a three-part exam: a simulated patient interview, written documentation and a conversation with a doctor. Accepted certificates and procedures differ by state.',
  },
  {
    q: 'Which German certificates are accepted?',
    a: 'Common certificates include the Goethe-Zertifikat, telc Deutsch, ÖSD, TestDaF and DSH. The institution that asks for proof (German mission, university, employer or recognition authority) decides which it accepts, so confirm before booking an exam.',
  },
];

const sources = [
  { label: 'Make it in Germany – Required German language skills depending on the type of visa (PDF, as of January 2026)', href: 'https://www.make-it-in-germany.com/fileadmin/1_Rebrush_2022/a_Fachkraefte/PDF-Dateien/3_Visum_u_Aufenthalt/Visagrafik_EN/Visum_erforderliche_Deutschkenntnisse_EN.pdf' },
  { label: 'Make it in Germany – Opportunity Card (job search)', href: 'https://www.make-it-in-germany.com/en/visa-residence/opportunity-card/job-search' },
  { label: 'Make it in Germany – Visa for vocational training', href: 'https://www.make-it-in-germany.com/en/visa-residence/types/training' },
  { label: 'Make it in Germany – Spouses joining non-EU citizens', href: 'https://www.make-it-in-germany.com/en/visa-residence/family-reunification/spouses-joining-citizens-non-eu' },
  { label: 'Federal Foreign Office – German language skills for spouses (FAQ)', href: 'https://www.auswaertiges-amt.de/en/visa-service/buergerservice/faq/01a-deutschkenntnisse/606682' },
  { label: 'Ärztekammer Berlin – Fachsprachprüfung', href: 'https://www.aekb.de/aerzt-innen/aus-dem-ausland-ins-ausland/fachsprachpruefung' },
  { label: 'Anerkennung in Deutschland – Recognition Finder', href: 'https://www.anerkennung-in-deutschland.de/en/interest/finder/' },
];

export default function GermanLanguageRequirementsGermany() {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://germanlearningschool.com/' },
      { '@type': 'ListItem', position: 2, name: 'German Language Requirements for Germany', item: 'https://germanlearningschool.com/german-language-requirements-germany' },
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
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
          <span className="text-slate-200 font-medium">German Language Requirements</span>
        </nav>

        <header className="rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-8 sm:p-12 shadow-2xl space-y-6">
          <span className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-extrabold border border-emerald-500/30">
            Last reviewed: {LAST_REVIEWED}
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            German Language Requirements for Germany
          </h1>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Which German level you need for the Opportunity Card, Ausbildung, work, study, family reunion and medical careers, based on official German government sources and explained for applicants from Pakistan.
          </p>
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs sm:text-sm text-amber-200/90 leading-relaxed flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong>Important:</strong> This is general guidance, not legal or immigration advice. Requirements change and individual cases differ. Always confirm with the German mission in Pakistan, your university, employer or recognition authority before applying.
            </div>
          </div>
        </header>

        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-4 shadow-xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">What German Level Do You Need for Germany?</h2>
          <p className="text-slate-200 leading-relaxed text-sm sm:text-base">
            <strong className="text-white">Short answer:</strong> It depends on why you are going. The points-based Opportunity Card needs at least A1 German (or B2 English), vocational training (Ausbildung) normally needs B1, and the recognition visa needs A2. The work visa for qualified professionals and the EU Blue Card have no legal German requirement, while doctors usually need B2 plus a C1-level medical language exam.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-950 text-amber-400">
                <tr>
                  <th className="p-3 font-bold">Visa or route</th>
                  <th className="p-3 font-bold">German requirement</th>
                  <th className="p-3 font-bold">Where to start</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {requirementRows.map((row) => (
                  <tr key={row.route}>
                    <td className="p-3 font-semibold text-white">{row.route}</td>
                    <td className="p-3">{row.level}</td>
                    <td className="p-3"><Link href={row.link} className="text-amber-400 hover:underline">{row.linkText}</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-400">Source: Make it in Germany, &quot;Required German language skills depending on the type of visa&quot;, as of January 2026. Extra language requirements can apply during recognition or at the German mission.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Opportunity Card (Chancenkarte) Language Points</h2>
          <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
            If you apply under the points system, you need at least A1 German or B2 English. German then earns extra points: one point at A2, two at B1 and three at B2 or above. English at C1 or above (or as a native language) earns one additional point. Language certificates are generally accepted only if the exam was taken within the last year. If your qualification is already fully recognised in Germany, you do not need to prove German for the Opportunity Card.
          </p>
          <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
            Start with our <Link href="/courses/german-a1" className="text-amber-400 hover:underline">German A1 course</Link>, then move to <Link href="/courses/german-a2" className="text-amber-400 hover:underline">A2</Link> and <Link href="/courses/german-b1" className="text-amber-400 hover:underline">B1</Link> to add points.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">German for Ausbildung (Vocational Training)</h2>
          <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
            For the vocational training visa you will normally need German at B1 level, and the visa to look for a training place also requires at least B1. Training companies and vocational schools teach in German, so many expect a solid B1 or higher. Our <Link href="/courses/german-b1" className="text-amber-400 hover:underline">German B1 course</Link> and <Link href="/practice-tests/german-b1" className="text-amber-400 hover:underline">B1 practice test</Link> are the usual next steps for Ausbildung applicants.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Work Visas and the EU Blue Card</h2>
          <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
            The work visa for qualified professionals, the EU Blue Card and the visa for professionally experienced workers have no legal German language requirement. In practice many employers still expect German, often B1 or B2, and German helps with daily life and permanent residence later. If your qualification must be recognised, the recognition visa requires at least A2. Read more in our guide <Link href="/blog/what-german-level-do-you-need-for-a-germany-work-visa-a1-to-c1-explained" className="text-amber-400 hover:underline">What German level do you need for a Germany work visa?</Link>
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">German for Studying in Germany</h2>
          <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
            For a student visa, the language requirement is set by your study programme. Make it in Germany notes that programmes which require German usually ask for about B2. Many degrees taught in German ask for proof such as TestDaF (TDN 4) or DSH-2, so check your programme&apos;s admission page. English-taught programmes may not require German at all. See our <Link href="/testdaf-preparation" className="text-amber-400 hover:underline">TestDaF preparation</Link> page and <Link href="/courses/german-b2" className="text-amber-400 hover:underline">German B2 course</Link>, and our <Link href="/blog/documents-required-for-a-germany-student-work-visa-from-pakistan-complete-checklist" className="text-amber-400 hover:underline">visa documents checklist</Link>.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Family Reunion (Spouse Visa)</h2>
          <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
            In many family-reunion cases, the spouse must show basic German (A1) before arriving in Germany, according to the Federal Foreign Office. Make it in Germany states that family members joining a skilled worker with a valid residence title do not need to prove German. Confirm your exact case with the German mission. If you need A1, our <Link href="/courses/german-a1" className="text-amber-400 hover:underline">A1 course</Link> and <Link href="/german-a1-syllabus" className="text-amber-400 hover:underline">A1 syllabus guide</Link> cover what the exam tests.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">German for Doctors and Nurses</h2>
          <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
            Doctors applying for Approbation usually need general German at B2 level plus a medical language exam (Fachsprachprüfung) oriented to C1. The Berlin Medical Association, for example, describes three 20-minute parts: a simulated patient interview, written documentation of that interview, and a conversation with a doctor. Nurses need the German level set by the federal state; for example, the Recognition Finder lists B2 plus a specialist language exam for general nurses in Brandenburg. Some states accept telc Deutsch B2·C1 Medizin, so check your state&apos;s authority. Read our <Link href="/blog/telc-b2-medizin-the-medical-german-exam-pakistani-doctors-and-nurses-need-for-germany" className="text-amber-400 hover:underline">telc B2 Medizin guide</Link> and see the <Link href="/courses/german-b2" className="text-amber-400 hover:underline">German B2 course</Link>.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">How to Plan Your German from Pakistan</h2>
          <ol className="space-y-3 text-sm sm:text-base text-slate-300 leading-relaxed list-decimal pl-5">
            <li><strong className="text-white">Choose your route</strong> and confirm its language requirement with the official source.</li>
            <li><strong className="text-white">Estimate your timeline.</strong> Our <Link href="/blog/how-long-does-it-take-to-learn-german-from-a1-to-b2-a-realistic-timeline" className="text-amber-400 hover:underline">A1 to B2 timeline guide</Link> explains how long each level usually takes.</li>
            <li><strong className="text-white">Learn level by level</strong> in our live online <Link href="/courses" className="text-amber-400 hover:underline">A1–B2 German courses</Link>, and check your progress with the <Link href="/practice-tests" className="text-amber-400 hover:underline">free practice tests</Link>.</li>
            <li><strong className="text-white">Pick an accepted exam</strong>: <Link href="/goethe-exam-preparation" className="text-amber-400 hover:underline">Goethe</Link>, <Link href="/telc-exam-preparation" className="text-amber-400 hover:underline">telc</Link>, <Link href="/osd-exam-preparation" className="text-amber-400 hover:underline">ÖSD</Link> or <Link href="/testdaf-preparation" className="text-amber-400 hover:underline">TestDaF</Link>, and book your exam date early.</li>
          </ol>
          <Link href="/courses" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-extrabold text-sm rounded-xl">
            <span>See German Courses &amp; Fees</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
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

        <section className="border-t border-slate-800 pt-6 space-y-2 text-xs text-slate-400">
          <p>Last reviewed: {LAST_REVIEWED}. Official sources:</p>
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
