import React, { useState } from 'react';
import { initialCourses } from '../mockData/seedData';
import { translations } from '../i18n/translations';
import CourseCard from '../components/CourseCard';
import CourseBundles from '../components/CourseBundles';

export default function Courses({ currentLang, setActiveTab, onOpenTrialModal }) {
  const t = translations[currentLang];
  const [selectedLevel, setSelectedLevel] = useState('All');

  const filteredCourses = selectedLevel === 'All' 
    ? initialCourses 
    : initialCourses.filter(c => c.level === selectedLevel);

  const handleWhatsAppEnroll = (courseTitle) => {
    const msg = encodeURIComponent(`Hi, I want to enroll in ${courseTitle}. Please share payment details.`);
    window.open(`https://wa.me/923421189593?text=${msg}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/30">
          100% Live Online Batches • German Levels (A1 to B2)
        </span>
        <h1 className="text-4xl font-extrabold text-white">{t.courses.title}</h1>
        <p className="text-sm text-slate-300">
          Structured live online German courses aligned with Goethe-Institut, telc, and ÖSD examination standards.
        </p>
      </div>

      {/* Filter Buttons (4 Levels A1, A2, B1, B2 Only) */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {['All', 'A1', 'A2', 'B1', 'B2'].map((lvl) => (
          <button
            key={lvl}
            onClick={() => setSelectedLevel(lvl)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
              selectedLevel === lvl
                ? 'bg-amber-500 text-slate-950 shadow-gold-glow scale-105'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            {lvl === 'All' ? 'All 4 Levels' : `${lvl} Level`}
          </button>
        ))}
      </div>

      {/* Responsive Grid: SINGLE ROW of 4 Columns on Desktop (lg:grid-cols-4), 2 Cols Tablet, 1 Col Mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredCourses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            onEnroll={handleWhatsAppEnroll}
          />
        ))}
      </div>

      {/* DEDICATED COURSE BUNDLES & PACKAGE SAVINGS SECTION */}
      <CourseBundles />

    </div>
  );
}
