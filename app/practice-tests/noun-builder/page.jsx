import React from 'react';
import NounBuilderEngine from '../../../src/components/noun-builder/NounBuilderEngine';

export const metadata = {
  title: 'German Noun & Article Practice (der/die/das)',
  description: 'Master German nouns and their articles with our interactive Noun Builder practice module.',
};

export default function NounBuilderStudentPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <NounBuilderEngine />
    </div>
  );
}
