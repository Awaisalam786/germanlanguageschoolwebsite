import React from 'react';
import Link from 'next/link';
import NounBuilderEngine from '../../../src/components/noun-builder/NounBuilderEngine';
import { withPageOpenGraph } from '../../../src/lib/seo';

export const metadata = withPageOpenGraph({
  title: 'German Noun & Article Practice (der/die/das)',
  description: 'Practise German articles der, die and das with a free interactive noun trainer, plus word-ending patterns that help you remember noun genders.',
  alternates: {
    canonical: '/practice-tests/noun-builder',
  },
});

export default function NounBuilderStudentPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <NounBuilderEngine />
      <ArticleGuide />
    </div>
  );
}

// Server-rendered guide below the interactive trainer, so the page has
// crawlable content even before the noun data loads on the client.
function ArticleGuide() {
  const rules = [
    { article: 'die', examples: 'most nouns ending in -ung, -heit, -keit, -schaft, -ion and -tät (die Zeitung, die Freiheit, die Nation)' },
    { article: 'das', examples: 'diminutives ending in -chen and -lein, and most nouns ending in -um and -ment (das Mädchen, das Museum, das Dokument)' },
    { article: 'der', examples: 'days, months and seasons, and most nouns ending in -ling and -ismus (der Montag, der Januar, der Sommer)' },
  ];
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-5">
      <h2 className="text-2xl sm:text-3xl font-extrabold text-white">How to Learn der, die and das</h2>
      <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
        <strong className="text-white">Short answer:</strong> Every German noun has a grammatical gender shown by its article: der (masculine), die (feminine) or das (neuter). There is no single rule that covers every word, so the most reliable method is to learn each noun together with its article and plural, and to use common word-ending patterns as a guide.
      </p>
      <h3 className="text-lg font-bold text-white">Helpful patterns (with exceptions)</h3>
      <ul className="space-y-2 text-sm text-slate-300 leading-relaxed">
        {rules.map((r) => (
          <li key={r.article}><strong className="text-amber-400">{r.article}:</strong> {r.examples}</li>
        ))}
      </ul>
      <p className="text-sm text-slate-300 leading-relaxed">
        Articles are part of the <Link href="/german-a1-syllabus" className="text-amber-400 hover:underline">German A1 syllabus</Link>. Check your level with the free <Link href="/practice-tests/german-a1" className="text-amber-400 hover:underline">A1 practice test</Link>, find case tables on our <Link href="/resources" className="text-amber-400 hover:underline">free resources page</Link>, or learn articles step by step in our live <Link href="/courses/german-a1" className="text-amber-400 hover:underline">German A1 course</Link>.
      </p>
    </section>
  );
}
