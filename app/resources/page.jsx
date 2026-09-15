import React from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, Languages, CheckSquare, Download } from 'lucide-react';
import SchemaMarkup from '../../src/components/SchemaMarkup';

export const metadata = {
  title: 'Free German Learning Resources: Vocabulary & Grammar Cheat Sheet',
  description: 'Free A1 German vocabulary list, an articles & cases cheat sheet, and links to our free practice tools — no signup required.',
  alternates: {
    canonical: '/resources',
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://germanlearningschool.com/" },
    { "@type": "ListItem", "position": 2, "name": "Free Resources", "item": "https://germanlearningschool.com/resources" }
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
    title: 'Family',
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
  { caseName: 'Nominative', use: 'The subject of the sentence', der: 'der', die: 'die', das: 'das', plural: 'die' },
  { caseName: 'Accusative', use: 'The direct object', der: 'den', die: 'die', das: 'das', plural: 'die' },
  { caseName: 'Dative', use: 'The indirect object', der: 'dem', die: 'der', das: 'dem', plural: 'den' },
  { caseName: 'Genitive', use: 'Possession ("of the...")', der: 'des', die: 'der', das: 'des', plural: 'der' },
];

export default function ResourcesPage() {
  return (
    <>
      <SchemaMarkup schema={breadcrumbSchema} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">

        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Link href="/" className="hover:text-amber-400">Home</Link>
          <span>&rsaquo;</span>
          <span className="text-slate-200">Free Resources</span>
        </div>

        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/30">
            100% Free, No Signup
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
            Free German Learning Resources
          </h1>
          <p className="text-lg text-slate-300 leading-relaxed">
            A starter vocabulary list, a German articles &amp; cases cheat sheet, and links to our free practice tools — useful whether or not you ever take a class with us.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-16">

            {/* Vocabulary Section */}
            <section className="space-y-6">
              <h2 className="text-3xl font-extrabold text-white">Essential A1 Vocabulary</h2>
              <p className="text-slate-300 leading-relaxed">
                40 of the most useful words to start with, grouped by topic. Bookmark this page — it's a handy quick reference while you're still building your vocabulary.
              </p>
              <div className="grid sm:grid-cols-2 gap-6">
                {vocabGroups.map((group) => (
                  <div key={group.title} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                    <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wide">{group.title}</h3>
                    <table className="w-full text-sm">
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

            {/* Grammar Cheat Sheet */}
            <section className="space-y-6">
              <h2 className="text-3xl font-extrabold text-white">German Articles &amp; Cases Cheat Sheet</h2>
              <p className="text-slate-300 leading-relaxed">
                One of the hardest parts of German for new learners: <em>der</em>, <em>die</em>, <em>das</em> change depending on the grammatical case. Here's the full picture in one table.
              </p>
              <div className="overflow-x-auto bg-slate-900 border border-slate-800 rounded-2xl">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="border-b border-slate-800 text-amber-400">
                      <th className="px-4 py-3 font-bold">Case</th>
                      <th className="px-4 py-3 font-bold hidden sm:table-cell">Used for</th>
                      <th className="px-4 py-3 font-bold">der (m.)</th>
                      <th className="px-4 py-3 font-bold">die (f.)</th>
                      <th className="px-4 py-3 font-bold">das (n.)</th>
                      <th className="px-4 py-3 font-bold">plural</th>
                    </tr>
                  </thead>
                  <tbody>
                    {caseTable.map((row) => (
                      <tr key={row.caseName} className="border-b border-slate-800/60 last:border-0">
                        <td className="px-4 py-3 font-semibold text-white">{row.caseName}</td>
                        <td className="px-4 py-3 text-slate-400 hidden sm:table-cell">{row.use}</td>
                        <td className="px-4 py-3 text-slate-300">{row.der}</td>
                        <td className="px-4 py-3 text-slate-300">{row.die}</td>
                        <td className="px-4 py-3 text-slate-300">{row.das}</td>
                        <td className="px-4 py-3 text-slate-300">{row.plural}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Rule of thumb for beginners: learn every noun together with its article from day one (say "die Tochter", not just "Tochter") — it's much harder to fix later than to learn correctly the first time.
              </p>
            </section>

          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Download className="w-5 h-5 text-amber-400" /> More Free Tools
              </h3>
              <div className="space-y-3">
                <Link href="/translator" className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/40 transition group">
                  <Languages className="w-5 h-5 text-amber-400 shrink-0" />
                  <div>
                    <div className="text-sm font-bold text-white group-hover:text-amber-400 transition">Free Translator</div>
                    <div className="text-xs text-slate-400">Translate German text instantly</div>
                  </div>
                </Link>
                <Link href="/practice-tests" className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/40 transition group">
                  <CheckSquare className="w-5 h-5 text-amber-400 shrink-0" />
                  <div>
                    <div className="text-sm font-bold text-white group-hover:text-amber-400 transition">Practice Tests</div>
                    <div className="text-xs text-slate-400">Interactive tests with auto-grading</div>
                  </div>
                </Link>
                <Link href="/books" className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/40 transition group">
                  <BookOpen className="w-5 h-5 text-amber-400 shrink-0" />
                  <div>
                    <div className="text-sm font-bold text-white group-hover:text-amber-400 transition">Books &amp; Study Materials</div>
                    <div className="text-xs text-slate-400">Recommended course books</div>
                  </div>
                </Link>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-6 space-y-4 text-center">
              <h3 className="text-xl font-bold text-white">Want structured lessons instead of self-study?</h3>
              <p className="text-sm text-slate-400">Our A1–B2 live Zoom classes build on exactly this foundation, with a teacher correcting your mistakes in real time.</p>
              <Link href="/courses" className="inline-flex items-center justify-center gap-2 py-3 px-6 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition-all">
                View Courses &amp; Fees <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
