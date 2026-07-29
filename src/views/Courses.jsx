import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { translations } from '../i18n/translations';
import CourseCard from '../components/CourseCard';
import CourseBundles from '../components/CourseBundles';
import ScrollReveal from '../components/ScrollReveal';

export default function Courses({ currentLang, setActiveTab, onOpenTrialModal }) {
  const t = translations[currentLang];
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      const { data } = await supabase.from('courses').select('*').order('created_at', { ascending: true });
      if (data) {
        const levelOrder = { 'A1': 1, 'A2': 2, 'B1': 3, 'B2': 4 };
        const sortedData = data.sort((a, b) => (levelOrder[a.level] || 99) - (levelOrder[b.level] || 99));
        setCourses(sortedData);
      }
      setLoading(false);
    };
    fetchCourses();
  }, []);

  const filteredCourses = selectedLevel === 'All' 
    ? courses 
    : courses.filter(c => c.level === selectedLevel);

  const handleWhatsAppEnroll = (courseTitle, couponCode = null) => {
    let msg = `Hi, I want to enroll in ${courseTitle}.`;
    if (couponCode) {
      msg += ` I am applying the coupon code: ${couponCode}.`;
    }
    msg += ` Please share payment details.`;
    window.open(`https://wa.me/923421189593?text=${encodeURIComponent(msg)}`, '_blank');
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
        {loading ? (
          <div className="col-span-full text-center text-slate-400 py-12">Loading courses...</div>
        ) : filteredCourses.map((course) => (
          <ScrollReveal key={course.id} className="h-full">
            <CourseCard
              course={{
                ...course,
                feesPKR: course.price,
                feesEUR: course.price,
                description: course.description || `Comprehensive German ${course.level} course.`,
                featuredBadge: course.badge || ''
              }}
              onEnroll={handleWhatsAppEnroll}
            />
          </ScrollReveal>
        ))}
      </div>

      {/* DEDICATED COURSE BUNDLES & PACKAGE SAVINGS SECTION */}
      <CourseBundles />

    </div>
  );
}
