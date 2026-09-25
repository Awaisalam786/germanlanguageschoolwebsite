import React from 'react';
import NounBuilderEngine from '../../../src/components/noun-builder/NounBuilderEngine';
import { withPageOpenGraph } from '../../../src/lib/seo';

export const metadata = withPageOpenGraph({
  title: 'German Noun & Article Practice (der/die/das)',
  description: 'Master German nouns and their articles with our interactive Noun Builder practice module.',
  alternates: {
    canonical: '/practice-tests/noun-builder',
  },
});

export default function NounBuilderStudentPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <NounBuilderEngine />
    </div>
  );
}
