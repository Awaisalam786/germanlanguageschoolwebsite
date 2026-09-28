import Link from 'next/link';
import PracticeTests from '../../src/views/PracticeTests';
import { withPageOpenGraph } from '../../src/lib/seo';

export const metadata = withPageOpenGraph({
  title: 'Free German Practice Tests',
  description: 'Free German practice tests for A1, A2, B1 and B2 with instant scores. Check grammar, vocabulary and reading before your Goethe, telc or ÖSD exam.',
  alternates: {
    canonical: '/practice-tests',
  },
});

const LEVELS = [
  { level: 'A1', test: '/practice-tests/german-a1', course: '/courses/german-a1', note: 'Everyday vocabulary, articles, present tense and short reading texts.' },
  { level: 'A2', test: '/practice-tests/german-a2', course: '/courses/german-a2', note: 'Past tense, dative case, routines, work and health topics.' },
  { level: 'B1', test: '/practice-tests/german-b1', course: '/courses/german-b1', note: 'Opinions, connectors, subordinate clauses and longer texts.' },
  { level: 'B2', test: '/practice-tests/german-b2', course: '/courses/german-b2', note: 'Complex grammar, formal register and academic-style reading.' },
];

// Server-rendered guide below the interactive tool, so the page explains
// itself to readers and search engines without relying on client JS.
function PracticeTestsGuide() {
  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-6">
      <h2 className="text-2xl sm:text-3xl font-extrabold text-white">About These Free German Practice Tests</h2>
      <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
        <strong className="text-white">Short answer:</strong> These are free online German practice tests for CEFR levels A1, A2, B1 and B2. Each level test checks grammar, vocabulary and reading in the style of Goethe and telc exam tasks and shows your score straight away, so you can see which level to study next. They are independent practice tools, not official Goethe-Institut or telc exams.
      </p>
      <div className="grid sm:grid-cols-2 gap-4">
        {LEVELS.map(({ level, test, course, note }) => (
          <div key={level} className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
            <h3 className="text-lg font-bold text-white">German {level} Practice Test</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{note}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs sm:text-sm font-semibold">
              <Link href={test} className="text-amber-400 hover:underline">Take the {level} test</Link>
              <Link href={course} className="text-slate-300 hover:text-amber-400 hover:underline">German {level} course</Link>
            </div>
          </div>
        ))}
      </div>
      <p className="text-sm text-slate-300 leading-relaxed">
        Want to practise der, die and das? Try the <Link href="/practice-tests/noun-builder" className="text-amber-400 hover:underline">German noun and article trainer</Link>. Preparing for an official exam? See our guides to <Link href="/goethe-exam-preparation" className="text-amber-400 hover:underline">Goethe</Link>, <Link href="/telc-exam-preparation" className="text-amber-400 hover:underline">telc</Link>, <Link href="/osd-exam-preparation" className="text-amber-400 hover:underline">ÖSD</Link> and <Link href="/testdaf-preparation" className="text-amber-400 hover:underline">TestDaF</Link> preparation.
      </p>
    </section>
  );
}

export default function PracticeTestsPage() {
  return (
    <>
      <PracticeTests />
      <PracticeTestsGuide />
    </>
  );
}
