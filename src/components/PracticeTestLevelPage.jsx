import React from 'react';
import Link from 'next/link';
import { 
  CheckCircle2, 
  ArrowRight, 
  BookOpen, 
  Brain, 
  PlayCircle, 
  Sparkles, 
  Layers, 
  CheckSquare, 
  HelpCircle,
  GraduationCap
} from 'lucide-react';
import { practiceTestData } from '../lib/seoPracticeTestData';
import SchemaMarkup from './SchemaMarkup';

export default function PracticeTestLevelPage({ level }) {
  const content = practiceTestData[level];
  if (!content) return null;

  const pageUrl = `https://germanlearningschool.com/practice-tests/${content.slug}`;

  // Schemas
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://germanlearningschool.com/" },
      { "@type": "ListItem", "position": 2, "name": "Practice Tests", "item": "https://germanlearningschool.com/practice-tests" },
      { "@type": "ListItem", "position": 3, "name": content.h1, "item": pageUrl }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": content.faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  // Adjacent level links
  const levelLinks = {
    'A1': [{ level: 'A2', label: 'German A2 Practice Test', href: '/practice-tests/german-a2' }],
    'A2': [
      { level: 'A1', label: 'German A1 Practice Test', href: '/practice-tests/german-a1' },
      { level: 'B1', label: 'German B1 Practice Test', href: '/practice-tests/german-b1' }
    ],
    'B1': [
      { level: 'A2', label: 'German A2 Practice Test', href: '/practice-tests/german-a2' },
      { level: 'B2', label: 'German B2 Practice Test', href: '/practice-tests/german-b2' }
    ],
    'B2': [{ level: 'B1', label: 'German B1 Practice Test', href: '/practice-tests/german-b1' }]
  };

  return (
    <>
      <SchemaMarkup schema={breadcrumbSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 flex-wrap">
          <Link href="/" className="hover:text-amber-400 transition-colors">Home</Link>
          <span>&rsaquo;</span>
          <Link href="/practice-tests" className="hover:text-amber-400 transition-colors">Practice Tests</Link>
          <span>&rsaquo;</span>
          <span className="text-slate-200 font-medium">{content.h1}</span>
        </nav>

        {/* Hero Section */}
        <div className="relative rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-8 sm:p-12 shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="max-w-3xl space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-extrabold shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>CEFR {level} Level • Interactive Online Exercises</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
              {content.h1}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              {content.intro}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <Link
                href="/practice-tests"
                className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm sm:text-base rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-xl hover:shadow-amber-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <PlayCircle className="w-5 h-5 fill-current" />
                <span>Start {level} Practice Test</span>
              </Link>
              <Link
                href={`/courses/german-${level.toLowerCase()}`}
                className="px-6 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm rounded-xl border border-slate-700 hover:border-amber-500/40 transition-all flex items-center justify-center gap-2"
              >
                <GraduationCap className="w-4 h-4 text-amber-400" />
                <span>View German {level} Course & Fees</span>
              </Link>
            </div>

            <div className="pt-2">
              <p className="text-xs text-slate-400 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                <strong>Disclaimer:</strong> Our practice tests and interactive drills are designed independently by German Learning School for skills development and preparation. They are not official Goethe-Institut, telc, or ÖSD examination papers.
              </p>
            </div>
          </div>
        </div>

        {/* Skills & Topics Grid */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">Curriculum Breakdown</div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">What You Can Practice in {level}</h2>
            </div>
            <Link href="/practice-tests" className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-semibold">
              Open Interactive Testing Portal <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {content.topics.map((topic, idx) => (
              <div 
                key={idx} 
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2 hover:border-amber-500/40 transition-colors shadow-lg"
              >
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-xs border border-amber-500/20">
                  {idx + 1}
                </div>
                <h3 className="text-base font-bold text-white pt-1">{topic.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{topic.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works & Who Should Use */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* How it works */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-xl">
            <div className="flex items-center gap-2.5">
              <Brain className="w-6 h-6 text-amber-400" />
              <h2 className="text-2xl font-extrabold text-white">How the Practice Test Works</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 font-extrabold flex items-center justify-center text-xs shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Access the Interactive Engine</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Launch our free practice testing portal from any device (phone, tablet, laptop) without software installations.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 font-extrabold flex items-center justify-center text-xs shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Select Your Focus Module</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Choose between Chapter Vocabulary, Reading Passages, Grammar Exercises, or the Der/Die/Das Noun Builder.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 font-extrabold flex items-center justify-center text-xs shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Instant Feedback & Answer Review</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Receive real-time scoring, correct answer highlights, and grammar explanations to reinforce your memory.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 font-extrabold flex items-center justify-center text-xs shrink-0 mt-0.5">
                  4
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Targeted Revision & Live Classes</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Pair your diagnostic test results with our live interactive Zoom courses for complete speaking, listening, and writing mastery.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/practice-tests"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <span>Launch Practice Test Portal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Who should use */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-xl">
            <div className="flex items-center gap-2.5">
              <CheckSquare className="w-6 h-6 text-emerald-400" />
              <h2 className="text-2xl font-extrabold text-white">Who Should Use This Test</h2>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {content.targetAudience}
            </p>

            <ul className="space-y-3 text-xs text-slate-300">
              {content.whoShouldUse.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <span className="text-amber-400 font-bold block">Need structured guidance?</span>
              <p className="text-slate-400">
                Join our certified faculty in live online Zoom batches designed to take you from {level} to exam certification.
              </p>
              <Link
                href={`/courses/german-${level.toLowerCase()}`}
                className="inline-block text-xs font-extrabold text-white hover:text-amber-400 underline underline-offset-4 pt-1"
              >
                Explore German {level} Course Batches & Fees &rarr;
              </Link>
            </div>
          </div>

        </div>

        {/* Level Navigation & Related Tests */}
        <section className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-xl font-bold text-white">Explore Other Practice Levels & Tools</h3>
              <p className="text-xs text-slate-400">Switch to adjacent CEFR test levels or practice specific skills.</p>
            </div>
            <Link 
              href="/practice-tests/noun-builder" 
              className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Try Der/Die/Das Noun Builder</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {['A1', 'A2', 'B1', 'B2'].map((lvl) => {
              const isCurrent = lvl === level;
              return (
                <Link
                  key={lvl}
                  href={isCurrent ? '#' : `/practice-tests/german-${lvl.toLowerCase()}`}
                  className={`p-4 rounded-2xl border transition-all text-left flex flex-col justify-between ${
                    isCurrent
                      ? 'bg-amber-500/10 border-amber-500/40 cursor-default'
                      : 'bg-slate-950 border-slate-800 hover:border-amber-500/40 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-extrabold text-white">German {lvl}</span>
                    {isCurrent ? (
                      <span className="text-[10px] font-bold text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded">Current</span>
                    ) : (
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 mt-2">
                    {lvl === 'A1' && 'Beginner Foundation'}
                    {lvl === 'A2' && 'Elementary Communication'}
                    {lvl === 'B1' && 'Intermediate Independent'}
                    {lvl === 'B2' && 'Upper Intermediate Fluency'}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* FAQs Section */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Got Questions?</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white">Frequently Asked Questions</h2>
            <p className="text-xs text-slate-400">Everything you need to know about the German {level} practice test.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
            {content.faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-2 shadow-md"
              >
                <h3 className="text-sm sm:text-base font-bold text-white flex items-start gap-2">
                  <span className="text-amber-400 font-extrabold">Q:</span>
                  <span>{faq.q}</span>
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed pl-5">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-amber-500/10 via-red-500/10 to-amber-500/10 border border-amber-500/30 p-8 sm:p-10 text-center space-y-4">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white">Ready to Test Your German {level} Skills?</h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto">
            Launch our interactive testing portal to evaluate your vocabulary and grammar readiness today.
          </p>
          <div className="flex justify-center gap-4 pt-2">
            <Link
              href="/practice-tests"
              className="px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-lg hover:scale-105"
            >
              Start {level} Practice Test Now
            </Link>
          </div>
        </div>

      </div>
    </>
  );
}
