import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Award, GraduationCap, Users, CheckCircle, Globe2, BookOpen, ArrowRight } from 'lucide-react';

export default function About({ currentLang, setActiveTab }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/30">
          Online German Language Academy
        </span>
        <h1 className="text-4xl font-extrabold text-white">About German Learning School</h1>
        <p className="text-sm text-slate-300 leading-relaxed">
          Dedicated communicative German language instruction designed to empower students across Pakistan to succeed in higher education, healthcare careers, and visa integration in Germany.
        </p>
      </div>

      {/* Mission & Vision Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/30">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">Our Mission</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            To provide structured, exam-aligned German language instruction with live Zoom classes, interactive coursework, and dedicated preparation for Goethe, telc, and ÖSD certifications.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center border border-red-500/30">
            <Globe2 className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">Empowering Students</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            German Learning School serves as a structured online learning pathway for Pakistani engineers, doctors, nurses, and university candidates preparing for German academic and visa requirements.
          </p>
        </div>
      </div>

      {/* Core Strengths */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-8 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
        <div>
          <div className="text-2xl font-extrabold text-white">Interactive</div>
          <div className="text-xs text-amber-400 font-semibold mt-1">Live Online Classes</div>
        </div>
        <div>
          <div className="text-2xl font-extrabold text-amber-400">Structured</div>
          <div className="text-xs text-slate-400 font-semibold mt-1">CEFR A1–B2 Levels</div>
        </div>
        <div>
          <div className="text-2xl font-extrabold text-white">Exam-Focused</div>
          <div className="text-xs text-amber-400 font-semibold mt-1">Targeted Preparation</div>
        </div>
        <div>
          <div className="text-2xl font-extrabold text-red-500">Dedicated</div>
          <div className="text-xs text-slate-400 font-semibold mt-1">Language Instructors</div>
        </div>
      </div>

      {/* Academic Leadership & Faculty */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Academic Leadership &amp; Faculty</h2>
          <p className="text-sm text-slate-400">
            Meet the experienced educators and leadership guiding students across Pakistan toward German fluency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link 
            href="/founder" 
            className="group block p-6 bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl transition-all duration-300 shadow-lg"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/30 shrink-0 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div className="space-y-2 flex-1">
                <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  Meet Our Founder &amp; Head Mentor
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-amber-400" />
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Discover our founder&apos;s vision, academic mentorship, and mission to help Pakistani students achieve language proficiency and career goals in Germany.
                </p>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 pt-1">
                  View Founder Profile &rarr;
                </span>
              </div>
            </div>
          </Link>

          <Link 
            href="/teachers" 
            className="group block p-6 bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl transition-all duration-300 shadow-lg"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center border border-red-500/30 shrink-0 group-hover:scale-105 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <div className="space-y-2 flex-1">
                <h3 className="text-lg font-bold text-white group-hover:text-red-400 transition-colors flex items-center gap-1.5">
                  Meet Our Teaching Faculty
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-red-400" />
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Learn about our qualified instructors specializing in live Zoom classes, Goethe and telc exam preparation, and interactive German coaching.
                </p>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-red-400 pt-1">
                  View Faculty Members &rarr;
                </span>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Curriculum & Examination Alignment */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-white text-center">Curriculum & Exam Standards</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'CEFR Aligned Curriculum',
              desc: 'Courses are structured strictly according to the Common European Framework of Reference for Languages (CEFR) from A1 to B2.'
            },
            {
              title: 'Goethe Exam Alignment',
              desc: 'Comprehensive syllabus coverage addressing all four key modules: Reading (Lesen), Listening (Hören), Writing (Schreiben), and Speaking (Sprechen).'
            },
            {
              title: 'telc & ÖSD Preparation',
              desc: 'Targeted preparation tracks focusing on common exam patterns for university entrance, Ausbildung, and professional visas.'
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-2">
              <CheckCircle className="w-5 h-5 text-amber-400" />
              <h4 className="text-base font-bold text-white">{item.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl text-xs text-slate-400 text-center">
          <strong>Disclaimer:</strong> German Learning School is an independent language preparation provider. We are not officially affiliated with or endorsed by the Goethe-Institut.
        </div>
      </div>

    </div>
  );
}
