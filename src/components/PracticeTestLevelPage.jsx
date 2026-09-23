import React from 'react';
import Link from 'next/link';
import { 
  CheckCircle2, 
  ArrowRight, 
  BookOpen, 
  Brain, 
  PlayCircle, 
  Sparkles, 
  CheckSquare, 
  HelpCircle,
  GraduationCap,
  FileText,
  Compass
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

  // Specific course and navigation link definitions per level
  const relatedNavLinks = {
    'A1': [
      { label: 'German A1 Course (Live Zoom)', href: '/courses/german-a1', primary: true },
      { label: 'German A2 Course', href: '/courses/german-a2' },
      { label: 'Goethe Exam Preparation', href: '/goethe-exam-preparation' },
      { label: 'German Learning Resources', href: '/resources' },
      { label: 'All Practice Tests Hub', href: '/practice-tests' },
    ],
    'A2': [
      { label: 'German A2 Course (Live Zoom)', href: '/courses/german-a2', primary: true },
      { label: 'German A1 Course', href: '/courses/german-a1' },
      { label: 'German B1 Course', href: '/courses/german-b1' },
      { label: 'Goethe Exam Preparation', href: '/goethe-exam-preparation' },
      { label: 'German Learning Resources', href: '/resources' },
      { label: 'All Practice Tests Hub', href: '/practice-tests' },
    ],
    'B1': [
      { label: 'German B1 Course (Live Zoom)', href: '/courses/german-b1', primary: true },
      { label: 'German A2 Course', href: '/courses/german-a2' },
      { label: 'German B2 Course', href: '/courses/german-b2' },
      { label: 'Goethe Exam Preparation', href: '/goethe-exam-preparation' },
      { label: 'German Learning Resources', href: '/resources' },
      { label: 'All Practice Tests Hub', href: '/practice-tests' },
    ],
    'B2': [
      { label: 'German B2 Course (Live Zoom)', href: '/courses/german-b2', primary: true },
      { label: 'German B1 Course', href: '/courses/german-b1' },
      { label: 'Goethe Exam Preparation', href: '/goethe-exam-preparation' },
      { label: 'TestDaF Preparation', href: '/testdaf-preparation' },
      { label: 'German Learning Resources', href: '/resources' },
      { label: 'All Practice Tests Hub', href: '/practice-tests' },
    ]
  };

  const navLinks = relatedNavLinks[level] || relatedNavLinks['A1'];

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
              <span>CEFR {level} Level • Free Interactive Online Exercises</span>
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
                <strong>Important Notice & Disclaimer:</strong> Our practice tests and interactive drills are developed independently by German Learning School for student skills evaluation and exam practice. They are not official Goethe-Institut, telc, or ÖSD examination papers.
              </p>
            </div>
          </div>
        </div>

        {/* Section 1: Course Overview & Contextual Course CTA */}
        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-10 space-y-6 shadow-xl">
          <div className="flex items-center gap-3">
            <Compass className="w-6 h-6 text-amber-400" />
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">German {level} Practice Test Overview</h2>
          </div>
          <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
            {content.overview}
          </p>
          
          {/* Contextual Course CTA */}
          <div className="bg-slate-950/80 border border-amber-500/30 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs uppercase font-bold tracking-wider text-amber-400">Instructor-Led Preparation</span>
              <p className="text-sm font-semibold text-white">
                {content.ctaText}
              </p>
            </div>
            <Link
              href={`/courses/german-${level.toLowerCase()}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs sm:text-sm font-extrabold transition-colors shrink-0"
            >
              <span>Explore German {level} Batch Details</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Section 2: What Does the Test Cover? */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">Curriculum &amp; Question Format</div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">What Does the {level} Test Cover?</h2>
            </div>
            <Link href="/practice-tests" className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-semibold">
              Launch Interactive Testing Portal <ArrowRight className="w-3.5 h-3.5" />
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

        {/* Section 3: German Grammar & Vocabulary Focus */}
        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-10 space-y-6 shadow-xl">
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-amber-400" />
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">German {level} Grammar &amp; Vocabulary</h2>
          </div>
          <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
            {content.grammarVocab}
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href="/practice-tests/noun-builder"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-amber-400 hover:underline"
            >
              <BookOpen className="w-4 h-4" /> Practice German Noun Genders (Der/Die/Das)
            </Link>
            <Link
              href="/resources"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-emerald-400 hover:underline"
            >
              <FileText className="w-4 h-4" /> Free German Vocabulary Worksheets &amp; Grammar Guides
            </Link>
          </div>
        </section>

        {/* Section 4: How to Use This Practice Test & Who Should Use */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* How to Use This Practice Test */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-xl">
            <div className="flex items-center gap-2.5">
              <Brain className="w-6 h-6 text-amber-400" />
              <h2 className="text-2xl font-extrabold text-white">How to Use This Practice Test</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 font-extrabold flex items-center justify-center text-xs shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Access the Online Interactive Engine</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Launch our free practice testing portal from your computer, tablet, or smartphone without software installation or mandatory login.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 font-extrabold flex items-center justify-center text-xs shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Select Your Focus Module</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Choose between Chapter Vocabulary, Reading Passages, Grammar Exercises, or the Der/Die/Das Noun Builder based on your revision goals.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 font-extrabold flex items-center justify-center text-xs shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Analyze Real-Time Feedback &amp; Explanations</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Review immediate score breakdowns, correct answer highlights, and grammar notes to understand why specific choices are correct.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 font-extrabold flex items-center justify-center text-xs shrink-0 mt-0.5">
                  4
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Target Weak Areas with Live Online Classes</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Pair your diagnostic practice test scores with our live Zoom classes to build comprehensive speaking, listening, and writing fluency.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/practice-tests"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <span>Launch Interactive Practice Test Portal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Who Should Use This Test */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-xl">
            <div className="flex items-center gap-2.5">
              <CheckSquare className="w-6 h-6 text-emerald-400" />
              <h3 className="text-2xl font-extrabold text-white">Who Should Take This Test</h3>
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
                Join our certified faculty in live online Zoom batches designed to prepare you for official CEFR examinations.
              </p>
              <Link
                href={`/courses/german-${level.toLowerCase()}`}
                className="inline-block text-xs font-extrabold text-white hover:text-amber-400 underline underline-offset-4 pt-1"
              >
                Explore German {level} Course Batches &amp; Fees &rarr;
              </Link>
            </div>
          </div>

        </div>

        {/* Section 5: German Exam Preparation & Internal Links */}
        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-10 space-y-6 shadow-xl">
          <div className="flex items-center gap-3">
            <GraduationCap className="w-6 h-6 text-amber-400" />
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">German {level} Exam Preparation</h2>
          </div>
          
          <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
            {content.examPrepText}
          </p>

          <div className="pt-4 border-t border-slate-800">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Related Courses &amp; Exam Preparation Resources
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {navLinks.map((link, idx) => (
                <Link
                  key={idx}
                  href={link.href}
                  className={`p-4 rounded-xl border text-xs sm:text-sm font-semibold flex items-center justify-between transition-all ${
                    link.primary
                      ? 'bg-amber-500/10 border-amber-500/40 text-amber-400 hover:bg-amber-500/20'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <span>{link.label}</span>
                  <ArrowRight className="w-4 h-4 shrink-0 text-amber-400" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Section: Prepare Before Taking the Test */}
        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-10 space-y-6 shadow-xl">
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-amber-400" />
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Prepare Before Taking the Test</h2>
          </div>
          <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
            Review these targeted study guides and explanations before starting your German {level} diagnostic test:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {level === 'A1' && (
              <>
                <Link href="/blog/german-a1-syllabus" className="p-4 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl transition flex items-center justify-between group block">
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-amber-400">German A1 Syllabus: What to Expect</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Essential grammar structures and vocabulary topics tested in A1.</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-400 shrink-0 ml-3" />
                </Link>
                <Link href="/blog/learn-german-in-urdu" className="p-4 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl transition flex items-center justify-between group block">
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-amber-400">German Seekhna: Beginner Guide in Urdu</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Understand German alphabet, greetings, and syntax with Urdu context.</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-400 shrink-0 ml-3" />
                </Link>
              </>
            )}
            {level === 'A2' && (
              <>
                <Link href="/blog/how-long-does-it-take-to-learn-german-from-a1-to-b2-a-realistic-timeline" className="p-4 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl transition flex items-center justify-between group block">
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-amber-400">A1 to B2 Study Timeline</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Benchmarking your progress through elementary German levels.</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-400 shrink-0 ml-3" />
                </Link>
                <Link href="/blog/goethe-vs-telc-which-german-exam-should-you-choose-in-pakistan" className="p-4 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl transition flex items-center justify-between group block">
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-amber-400">Goethe vs telc Exam Comparison</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Understand how different testing bodies evaluate elementary skills.</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-400 shrink-0 ml-3" />
                </Link>
              </>
            )}
            {level === 'B1' && (
              <>
                <Link href="/blog/what-german-level-do-you-need-for-a-germany-work-visa-a1-to-c1-explained" className="p-4 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl transition flex items-center justify-between group block">
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-amber-400">German Level for Work Visas &amp; Ausbildung</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Why B1 certification is mandatory for skilled immigration and training.</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-400 shrink-0 ml-3" />
                </Link>
                <Link href="/blog/goethe-vs-telc-which-german-exam-should-you-choose-in-pakistan" className="p-4 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl transition flex items-center justify-between group block">
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-amber-400">Goethe vs telc B1 Format Guide</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Modular structure, passing benchmarks, and letter writing rubrics.</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-400 shrink-0 ml-3" />
                </Link>
              </>
            )}
            {level === 'B2' && (
              <>
                <Link href="/blog/telc-b2-medizin-the-medical-german-exam-pakistani-doctors-and-nurses-need-for-germany" className="p-4 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl transition flex items-center justify-between group block">
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-amber-400">telc B2 Medizin Guide for Healthcare</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Medical licensing requirements and Approbation exam pathways.</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-400 shrink-0 ml-3" />
                </Link>
                <Link href="/blog/goethe-vs-telc-vs-testdaf-vs-osd-which-german-exam" className="p-4 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl transition flex items-center justify-between group block">
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-amber-400">Goethe vs telc vs TestDaF Guide</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Choosing the right upper-intermediate certification for German universities.</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-400 shrink-0 ml-3" />
                </Link>
              </>
            )}
          </div>
        </section>

        {/* Section 6: FAQs Section */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Got Questions?</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white">Frequently Asked Questions</h2>
            <p className="text-xs text-slate-400">Common questions about our online German {level} practice test.</p>
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

        {/* Level Navigation & Related Tests */}
        <section className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-xl font-bold text-white">Explore Other Practice Levels &amp; Tools</h3>
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
