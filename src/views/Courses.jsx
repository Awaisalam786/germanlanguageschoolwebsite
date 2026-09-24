import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';
import { translations } from '../i18n/translations';
import { useGlobalContent } from '../context/GlobalContentContext';
import CourseCard from '../components/CourseCard';
import CourseBundles from '../components/CourseBundles';
import ScrollReveal from '../components/ScrollReveal';

export default function Courses({ currentLang, setActiveTab, onOpenTrialModal, initialCourses = null, initialBundles = null }) {
  const t = translations[currentLang];
  const { settings } = useGlobalContent();
  const formattedPhone = settings?.whatsapp_number?.replace(/^0/, '92') || '923421189593';
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [courses, setCourses] = useState(initialCourses || []);
  const [loading, setLoading] = useState(initialCourses === null);

  useEffect(() => {
    if (initialCourses !== null) return;
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
  }, [initialCourses]);

  const filteredCourses = selectedLevel === 'All' 
    ? courses 
    : courses.filter(c => c.level === selectedLevel);

  const handleWhatsAppEnroll = (courseTitle, couponCode = null) => {
    let msg = `Hi, I want to enroll in ${courseTitle}.`;
    if (couponCode) {
      msg += ` I am applying the coupon code: ${couponCode}.`;
    }
    msg += ` Please share payment details.`;
    window.open(`https://wa.me/${formattedPhone}?text=${encodeURIComponent(msg)}`, '_blank');
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

      {/* CEFR COURSE ROADMAP & PROGRESSION TABLE */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <h2 className="text-2xl font-bold text-white">
            German Language Course Levels &amp; Progression Roadmap
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Our live online German courses follow the structured Common European Framework of Reference for Languages (CEFR). Each level builds foundational to advanced language competencies through live interactive Zoom sessions, recorded lecture archives, and targeted preparation for official Goethe-Zertifikat and telc exams.
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950 p-1">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-amber-400">
                <th className="p-3 font-bold">Level</th>
                <th className="p-3 font-bold">Duration</th>
                <th className="p-3 font-bold">Guided Hours</th>
                <th className="p-3 font-bold">Learning Goal</th>
                <th className="p-3 font-bold">Exam Alignment</th>
                <th className="p-3 font-bold">Course Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr>
                <td className="p-3 font-semibold text-white">German A1</td>
                <td className="p-3">6–8 Weeks</td>
                <td className="p-3">~80 Hours</td>
                <td className="p-3">Everyday greetings, basic self-introductions, asking simple questions, and essential daily vocabulary</td>
                <td className="p-3">Goethe-Zertifikat A1, telc Deutsch A1</td>
                <td className="p-3 whitespace-nowrap">
                  <Link href="/courses/german-a1" className="text-amber-400 hover:underline font-semibold">A1 Course</Link>
                  {' · '}
                  <Link href="/german-a1-syllabus" className="text-amber-400 hover:underline font-semibold">A1 Syllabus</Link>
                </td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-white">German A2</td>
                <td className="p-3">6–8 Weeks</td>
                <td className="p-3">~80 Hours</td>
                <td className="p-3">Routine conversational exchanges, describing personal background, shopping, employment, and immediate surroundings</td>
                <td className="p-3">Goethe-Zertifikat A2, telc Deutsch A2</td>
                <td className="p-3 whitespace-nowrap">
                  <Link href="/courses/german-a2" className="text-amber-400 hover:underline font-semibold">A2 Course</Link>
                </td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-white">German B1</td>
                <td className="p-3">8–10 Weeks</td>
                <td className="p-3">~100 Hours</td>
                <td className="p-3">Independent communication on familiar topics, expressing opinions, describing experiences, and handling travel situations</td>
                <td className="p-3">Goethe-Zertifikat B1, telc Deutsch B1</td>
                <td className="p-3 whitespace-nowrap">
                  <Link href="/courses/german-b1" className="text-amber-400 hover:underline font-semibold">B1 Course</Link>
                </td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-white">German B2</td>
                <td className="p-3">10–12 Weeks</td>
                <td className="p-3">~120 Hours</td>
                <td className="p-3">Spontaneous discussion on complex topics, detailed professional communication, and clear technical argumentation</td>
                <td className="p-3">Goethe-Zertifikat B2, telc Deutsch B2</td>
                <td className="p-3 whitespace-nowrap">
                  <Link href="/courses/german-b2" className="text-amber-400 hover:underline font-semibold">B2 Course</Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* DEDICATED COURSE BUNDLES & PACKAGE SAVINGS SECTION */}
      <CourseBundles initialBundles={initialBundles} />

      {/* SEO INTERNAL LINKS FOR DEDICATED LEVEL PAGES */}
      <div className="pt-12 border-t border-slate-800 text-center">
        <h2 className="text-xl font-bold text-white mb-6">Explore Detailed Course Information</h2>
        <div className="flex flex-wrap justify-center items-center gap-4">
          <Link href="/courses/german-a1" className="text-amber-400 hover:underline hover:text-amber-300 transition-colors">German A1 Course</Link>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <Link href="/german-a1-syllabus" className="text-amber-400 hover:underline hover:text-amber-300 transition-colors">German A1 Syllabus</Link>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <Link href="/courses/german-a2" className="text-amber-400 hover:underline hover:text-amber-300 transition-colors">German A2 Course</Link>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <Link href="/courses/german-b1" className="text-amber-400 hover:underline hover:text-amber-300 transition-colors">German B1 Classes &amp; Course</Link>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <Link href="/courses/german-b2" className="text-amber-400 hover:underline hover:text-amber-300 transition-colors">German B2 Course</Link>
        </div>
        <div className="mt-6 flex flex-wrap justify-center items-center gap-4">
          <Link href="/goethe-exam-preparation" className="inline-block px-6 py-2 bg-slate-900 border border-slate-800 hover:border-emerald-500/50 text-emerald-400 rounded-full text-sm font-bold transition-all">
            Goethe Exam Preparation Hub
          </Link>
          <Link href="/telc-exam-preparation" className="inline-block px-6 py-2 bg-slate-900 border border-slate-800 hover:border-emerald-500/50 text-emerald-400 rounded-full text-sm font-bold transition-all">
            telc Exam Preparation Hub
          </Link>
        </div>
      </div>

    </div>
  );
}
