import React from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  BookOpen, 
  Languages, 
  CheckSquare, 
  FileText, 
  GraduationCap, 
  Compass, 
  HelpCircle,
  ExternalLink 
} from 'lucide-react';
import SchemaMarkup from '../../src/components/SchemaMarkup';
import { withPageOpenGraph } from '../../src/lib/seo';

export const metadata = withPageOpenGraph({
  title: {
    absolute: 'German Learning Resources: Free Materials & Practice Tools | German Learning School',
  },
  description: 'Explore free German learning resources, vocabulary cheat sheets, grammar tables, interactive practice tests, and study guides for Pakistani students.',
  alternates: {
    canonical: '/resources',
  },
  openGraph: {
    title: 'German Learning Resources: Free Materials & Practice Tools | German Learning School',
    description: 'Explore free German learning resources, vocabulary cheat sheets, grammar tables, interactive practice tests, and study guides for Pakistani students.',
    url: 'https://germanlearningschool.com/resources',
    siteName: 'German Learning School',
    locale: 'en_PK',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'German Learning Resources: Free Materials & Practice Tools | German Learning School',
    description: 'Explore free German learning resources, vocabulary cheat sheets, grammar tables, interactive practice tests, and study guides for Pakistani students.',
  },
});

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://germanlearningschool.com/" },
    { "@type": "ListItem", "position": 2, "name": "German Learning Resources", "item": "https://germanlearningschool.com/resources" }
  ]
};

const vocabGroups = [
  {
    title: 'Greetings & Basics',
    words: [
      ['Hallo', 'Hello'],
      ['Guten Morgen', 'Good morning'],
      ['Guten Tag', 'Good day'],
      ['Guten Abend', 'Good evening'],
      ['Auf Wiedersehen', 'Goodbye'],
      ['Bitte', 'Please / You\'re welcome'],
      ['Danke', 'Thank you'],
      ['Entschuldigung', 'Excuse me / Sorry'],
      ['Ja', 'Yes'],
      ['Nein', 'No'],
    ],
  },
  {
    title: 'Numbers 1-10',
    words: [
      ['eins', 'one'],
      ['zwei', 'two'],
      ['drei', 'three'],
      ['vier', 'four'],
      ['fünf', 'five'],
      ['sechs', 'six'],
      ['sieben', 'seven'],
      ['acht', 'eight'],
      ['neun', 'nine'],
      ['zehn', 'ten'],
    ],
  },
  {
    title: 'Common Verbs',
    words: [
      ['sein', 'to be'],
      ['haben', 'to have'],
      ['gehen', 'to go'],
      ['kommen', 'to come'],
      ['sprechen', 'to speak'],
      ['verstehen', 'to understand'],
      ['lernen', 'to learn'],
      ['arbeiten', 'to work'],
      ['wohnen', 'to live (reside)'],
      ['brauchen', 'to need'],
    ],
  },
  {
    title: 'Family Members',
    words: [
      ['die Familie', 'family'],
      ['die Mutter', 'mother'],
      ['der Vater', 'father'],
      ['die Schwester', 'sister'],
      ['der Bruder', 'brother'],
      ['die Kinder', 'children'],
      ['der Sohn', 'son'],
      ['die Tochter', 'daughter'],
    ],
  },
];

const caseTable = [
  { caseName: 'Nominative (Nominativ)', use: 'The subject performing the action', der: 'der', die: 'die', das: 'das', plural: 'die' },
  { caseName: 'Accusative (Akkusativ)', use: 'The direct object receiving the action', der: 'den', die: 'die', das: 'das', plural: 'die' },
  { caseName: 'Dative (Dativ)', use: 'The indirect object (recipient, location with 2-way prep)', der: 'dem', die: 'der', das: 'dem', plural: 'den (+n)' },
  { caseName: 'Genitive (Genitiv)', use: 'Possession and formal prepositions (während, wegen)', der: 'des (+s)', die: 'der', das: 'des (+s)', plural: 'der' },
];

export default function ResourcesPage() {
  return (
    <>
      <SchemaMarkup schema={breadcrumbSchema} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">

        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm text-slate-400">
          <Link href="/" className="hover:text-amber-400 transition-colors">Home</Link>
          <span>&rsaquo;</span>
          <span className="text-slate-200 font-medium">German Learning Resources</span>
        </nav>

        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="px-3.5 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/30">
            100% Free German Learning Materials
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
            German Learning Resources
          </h1>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Free vocabulary lists, an essential German articles &amp; grammatical cases cheat sheet, interactive mock tests, and curated study guides to support your German journey from A1 to B2.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-16">

            {/* H2: German Grammar Resources */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <Compass className="w-6 h-6 text-amber-400" />
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">German Grammar Resources</h2>
              </div>
              <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                Understanding German grammatical cases is one of the most critical steps for new learners. Noun articles (<em>der</em>, <em>die</em>, <em>das</em>) change depending on whether a noun is a subject, direct object, indirect object, or possessive element. Bookmark this cheat sheet for fast reference:
              </p>
              
              <div className="overflow-x-auto bg-slate-900 border border-slate-800 rounded-2xl shadow-lg">
                <table className="w-full text-xs sm:text-sm text-left">
                  <thead>
                    <tr className="border-b border-slate-800 text-amber-400 bg-slate-950/60">
                      <th className="px-4 py-3 font-bold">Case</th>
                      <th className="px-4 py-3 font-bold hidden sm:table-cell">Function</th>
                      <th className="px-4 py-3 font-bold">Masculine (der)</th>
                      <th className="px-4 py-3 font-bold">Feminine (die)</th>
                      <th className="px-4 py-3 font-bold">Neuter (das)</th>
                      <th className="px-4 py-3 font-bold">Plural</th>
                    </tr>
                  </thead>
                  <tbody>
                    {caseTable.map((row) => (
                      <tr key={row.caseName} className="border-b border-slate-800/60 last:border-0 hover:bg-slate-800/30">
                        <td className="px-4 py-3 font-semibold text-white">{row.caseName}</td>
                        <td className="px-4 py-3 text-slate-400 hidden sm:table-cell">{row.use}</td>
                        <td className="px-4 py-3 text-slate-300 font-mono">{row.der}</td>
                        <td className="px-4 py-3 text-slate-300 font-mono">{row.die}</td>
                        <td className="px-4 py-3 text-slate-300 font-mono">{row.das}</td>
                        <td className="px-4 py-3 text-slate-300 font-mono">{row.plural}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2 text-xs sm:text-sm text-slate-300">
                <span className="font-bold text-amber-400">Rule of Thumb:</span>
                <p>
                  Always memorize German nouns together with their article (e.g., <em>das Buch</em>, not just <em>Buch</em>) and plural form. Practice noun genders under timed conditions with our <Link href="/practice-tests/noun-builder" className="text-amber-400 hover:underline font-semibold">Der/Die/Das Noun Builder</Link>.
                </p>
              </div>
            </section>

            {/* H2: German Vocabulary Practice */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-amber-400" />
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">German Vocabulary Practice</h2>
              </div>
              <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                Foundational vocabulary covering the most common greetings, numbers, everyday verbs, and family relations. These core words form the basis of the official CEFR A1 syllabus.
              </p>
              <div className="grid sm:grid-cols-2 gap-6">
                {vocabGroups.map((group) => (
                  <div key={group.title} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-md">
                    <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wide">{group.title}</h3>
                    <table className="w-full text-xs sm:text-sm">
                      <tbody>
                        {group.words.map(([de, en]) => (
                          <tr key={de} className="border-b border-slate-800/60 last:border-0">
                            <td className="py-1.5 pr-3 font-semibold text-white">{de}</td>
                            <td className="py-1.5 text-slate-400">{en}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            </section>

            {/* H2: German Practice Tests */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <CheckSquare className="w-6 h-6 text-amber-400" />
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">German Practice Tests</h2>
              </div>
              <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                Assess your current German level with our free interactive quizzes featuring automatic scoring, answer explanations, and module drills:
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <Link href="/practice-tests/german-a1" className="p-5 bg-slate-900 border border-slate-800 hover:border-amber-500 rounded-2xl transition-colors group block">
                  <h3 className="text-base font-bold text-white group-hover:text-amber-400 flex items-center justify-between">
                    <span>German A1 Practice Test Online</span>
                    <ArrowRight className="w-4 h-4 text-amber-400" />
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Beginner vocabulary, noun articles, and present tense conjugation.</p>
                </Link>
                <Link href="/practice-tests/german-a2" className="p-5 bg-slate-900 border border-slate-800 hover:border-amber-500 rounded-2xl transition-colors group block">
                  <h3 className="text-base font-bold text-white group-hover:text-amber-400 flex items-center justify-between">
                    <span>German A2 Practice Test Online</span>
                    <ArrowRight className="w-4 h-4 text-amber-400" />
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Elementary past tenses (Perfekt) and Dative two-way prepositions.</p>
                </Link>
                <Link href="/practice-tests/german-b1" className="p-5 bg-slate-900 border border-slate-800 hover:border-amber-500 rounded-2xl transition-colors group block">
                  <h3 className="text-base font-bold text-white group-hover:text-amber-400 flex items-center justify-between">
                    <span>German B1 Practice Test Online</span>
                    <ArrowRight className="w-4 h-4 text-amber-400" />
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Intermediate grammar, passive voice, and relative clauses.</p>
                </Link>
                <Link href="/practice-tests/german-b2" className="p-5 bg-slate-900 border border-slate-800 hover:border-amber-500 rounded-2xl transition-colors group block">
                  <h3 className="text-base font-bold text-white group-hover:text-amber-400 flex items-center justify-between">
                    <span>German B2 Practice Test Online</span>
                    <ArrowRight className="w-4 h-4 text-amber-400" />
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Upper-intermediate vocabulary, Partizipialattribute, and academic texts.</p>
                </Link>
              </div>

              <div className="pt-2">
                <Link href="/practice-tests" className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-amber-400 hover:underline">
                  <CheckSquare className="w-4 h-4" /> Open Full Practice Tests Portal with Noun Builder
                </Link>
              </div>
            </section>

            {/* H2: German Course Resources */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <GraduationCap className="w-6 h-6 text-amber-400" />
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">German Course Resources</h2>
              </div>
              <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                While self-study materials build a strong start, certified fluency requires interactive speaking practice, teacher corrections, and structured curriculum progression. Explore our live Zoom courses:
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <Link href="/courses/german-a1" className="p-4 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl transition-colors block">
                  <span className="text-sm font-bold text-white flex items-center justify-between">
                    <span>German A1 Course</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                  </span>
                  <p className="text-xs text-slate-400 mt-0.5">Absolute beginner foundation for daily life and family reunion visas.</p>
                </Link>
                <Link href="/courses/german-a2" className="p-4 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl transition-colors block">
                  <span className="text-sm font-bold text-white flex items-center justify-between">
                    <span>German A2 Course</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                  </span>
                  <p className="text-xs text-slate-400 mt-0.5">Pre-intermediate communication and Opportunity Card points.</p>
                </Link>
                <Link href="/courses/german-b1" className="p-4 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl transition-colors block">
                  <span className="text-sm font-bold text-white flex items-center justify-between">
                    <span>German B1 Course</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                  </span>
                  <p className="text-xs text-slate-400 mt-0.5">Independent proficiency for German Ausbildung and work permits.</p>
                </Link>
                <Link href="/courses/german-b2" className="p-4 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl transition-colors block">
                  <span className="text-sm font-bold text-white flex items-center justify-between">
                    <span>German B2 Course</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                  </span>
                  <p className="text-xs text-slate-400 mt-0.5">Advanced fluency for university admission, engineers, and doctors.</p>
                </Link>
              </div>

              <div>
                <Link href="/courses" className="text-xs sm:text-sm font-bold text-amber-400 hover:underline inline-flex items-center gap-1.5">
                  <span>View All Course Schedules, Batches &amp; Fees</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </section>

            {/* H2: Exam Preparation Resources */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-amber-400" />
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Exam Preparation Resources</h2>
              </div>
              <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                Preparing for a recognized German examination? Consult our dedicated preparation guides for detailed syllabus breakdowns, scoring formats, and registration steps:
              </p>
              
              <div className="grid sm:grid-cols-3 gap-4">
                <Link href="/goethe-exam-preparation" className="p-5 bg-slate-900 border border-slate-800 hover:border-amber-500 rounded-2xl transition-colors block space-y-2">
                  <h3 className="text-base font-bold text-white">Goethe Exam Preparation</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">Preparation for Goethe-Zertifikat A1, A2, B1, and B2 diplomas.</p>
                </Link>
                <Link href="/telc-exam-preparation" className="p-5 bg-slate-900 border border-slate-800 hover:border-amber-500 rounded-2xl transition-colors block space-y-2">
                  <h3 className="text-base font-bold text-white">telc Exam Preparation</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">Coaching for telc Deutsch certificates and Sprachbausteine modules.</p>
                </Link>
                <Link href="/testdaf-preparation" className="p-5 bg-slate-900 border border-slate-800 hover:border-amber-500 rounded-2xl transition-colors block space-y-2">
                  <h3 className="text-base font-bold text-white">TestDaF Preparation</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">Academic German preparation targeting the TDN 4 university benchmark.</p>
                </Link>
              </div>
            </section>

            {/* H2: Recommended Study Guides & Articles */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-amber-400" />
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Recommended Study Guides &amp; Articles</h2>
              </div>
              <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                Read practical insights written by our language instructors on German grammar, exam comparisons, and study planning:
              </p>
              
              <div className="space-y-3">
                <Link href="/german-a1-syllabus" className="p-4 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl transition-colors flex items-center justify-between block group">
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">German A1 Syllabus: Complete Course Guide</h3>
                    <p className="text-xs text-slate-400 mt-0.5">A complete breakdown of topics tested on the Goethe A1 examination.</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-400 shrink-0 ml-4" />
                </Link>

                <Link href="/blog/how-long-does-it-take-to-learn-german-from-a1-to-b2-a-realistic-timeline" className="p-4 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl transition-colors flex items-center justify-between block group">
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">How Long Does It Take to Learn German from A1 to B2?</h3>
                    <p className="text-xs text-slate-400 mt-0.5">A realistic study timeline breaking down required classroom and self-study hours.</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-400 shrink-0 ml-4" />
                </Link>

                <Link href="/blog/goethe-vs-telc-vs-testdaf-vs-osd-which-german-exam" className="p-4 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl transition-colors flex items-center justify-between block group">
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">Goethe vs telc vs TestDaF vs ÖSD: Which German Exam to Choose</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Compare exam formats, recognition, and scoring systems to select the right test.</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-400 shrink-0 ml-4" />
                </Link>

                <Link href="/blog/learn-german-in-urdu" className="p-4 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl transition-colors flex items-center justify-between block group">
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">Learn German in Urdu: A Complete Beginner's Guide</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Foundational pronunciation, greetings, and grammar explained through Urdu concepts.</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-400 shrink-0 ml-4" />
                </Link>
              </div>

              <div>
                <Link href="/blog" className="text-xs sm:text-sm font-bold text-amber-400 hover:underline inline-flex items-center gap-1.5">
                  <span>Explore All German Learning &amp; Visa Blog Articles</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </section>

          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Languages className="w-5 h-5 text-amber-400" /> Free Interactive Tools
              </h3>
              <div className="space-y-3">
                <Link href="/translator" className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/40 transition group">
                  <Languages className="w-5 h-5 text-amber-400 shrink-0" />
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-400 transition">Free German Translator</div>
                    <div className="text-[11px] text-slate-400">German-to-English / Urdu text translation</div>
                  </div>
                </Link>
                <Link href="/practice-tests/noun-builder" className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/40 transition group">
                  <CheckSquare className="w-5 h-5 text-amber-400 shrink-0" />
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-400 transition">Der/Die/Das Noun Builder</div>
                    <div className="text-[11px] text-slate-400">Interactive gender practice quiz</div>
                  </div>
                </Link>
                <Link href="/books" className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/40 transition group">
                  <BookOpen className="w-5 h-5 text-amber-400 shrink-0" />
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-400 transition">Books &amp; Study Materials</div>
                    <div className="text-[11px] text-slate-400">Standard CEFR recommended textbooks</div>
                  </div>
                </Link>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-6 space-y-4 text-center">
              <h3 className="text-lg font-bold text-white">Need live instructor guidance?</h3>
              <p className="text-xs sm:text-sm text-slate-400">
                Join our live Zoom classes taught live by our instructors with real-time feedback and structured exam preparation.
              </p>
              <Link href="/courses" className="inline-flex items-center justify-center gap-2 py-3 px-6 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm transition-all">
                <span>View Courses &amp; Fees</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
