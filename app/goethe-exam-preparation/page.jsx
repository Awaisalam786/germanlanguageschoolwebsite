import React from 'react';
import Link from 'next/link';
import { 
  CheckCircle2, 
  ArrowRight, 
  ExternalLink, 
  BookOpen, 
  Mic, 
  Headset, 
  Edit3, 
  GraduationCap, 
  HelpCircle, 
  Layers, 
  FileText,
  AlertCircle
} from 'lucide-react';
import SchemaMarkup from '../../src/components/SchemaMarkup';
import { withPageOpenGraph } from '../../src/lib/seo';

export const metadata = withPageOpenGraph({
  title: {
    absolute: 'Goethe Exam Preparation in Pakistan | German Learning School',
  },
  description: 'Prepare for the Goethe-Zertifikat in Pakistan with live online classes, mock exams, and module training for A1, A2, B1, and B2. Learn more and enroll today.',
  alternates: {
    canonical: '/goethe-exam-preparation',
  },
  openGraph: {
    title: 'Goethe Exam Preparation in Pakistan | German Learning School',
    description: 'Prepare for the Goethe-Zertifikat in Pakistan with live online classes, mock exams, and module training for A1, A2, B1, and B2. Learn more and enroll today.',
    url: 'https://germanlearningschool.com/goethe-exam-preparation',
    siteName: 'German Learning School',
    locale: 'en_PK',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Goethe Exam Preparation in Pakistan | German Learning School',
    description: 'Prepare for the Goethe-Zertifikat in Pakistan with live online classes, mock exams, and module training for A1, A2, B1, and B2. Learn more and enroll today.',
  },
});

const goetheFaqs = [
  {
    q: 'What is the Goethe-Zertifikat?',
    a: 'The Goethe-Zertifikat is an internationally recognized German language credential administered by the Goethe-Institut. It certifies German proficiency according to the Common European Framework of Reference for Languages (CEFR) and is accepted by German universities, embassies, and employers worldwide.'
  },
  {
    q: 'Which Goethe exam levels can I prepare for with German Learning School?',
    a: 'We offer structured preparation for Goethe-Zertifikat A1 (Start Deutsch 1), A2, B1, and B2 levels, covering all four test modules: Reading (Lesen), Listening (Hören), Writing (Schreiben), and Speaking (Sprechen).'
  },
  {
    q: 'Is German Learning School an official Goethe examination center?',
    a: 'No. German Learning School is an independent language preparation institute. We are not officially affiliated with or an examination center for the Goethe-Institut. Students register for official exams directly with the Goethe-Institut or authorized testing partners in Pakistan.'
  },
  {
    q: 'Where can I take the official Goethe exam in Pakistan?',
    a: 'Official Goethe examinations in Pakistan are administered at the Goethe-Institut Pakistan in Karachi and partner centers such as the Annemarie-Schimmel-Haus in Lahore. Please consult the official Goethe-Institut website for examination dates and registration procedures.'
  },
  {
    q: 'How do I prepare for the Goethe B1 modular exam?',
    a: 'The Goethe B1 exam consists of four independent modules. In our live preparation courses, we train students on time management for reading comprehension, listening to authentic audio clips, writing structured formal letters, and delivering paired speaking presentations.'
  },
  {
    q: 'Do you offer free German practice tests?',
    a: 'Yes, we provide free interactive practice tests on our website for German A1, A2, B1, and B2 levels, allowing students to assess vocabulary and grammar readiness before taking official exams.'
  }
];

export default function GoetheExamPreparation() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://germanlearningschool.com/" },
      { "@type": "ListItem", "position": 2, "name": "Goethe Exam Preparation", "item": "https://germanlearningschool.com/goethe-exam-preparation" }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": goetheFaqs.map((faq) => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  return (
    <>
      <SchemaMarkup schema={breadcrumbSchema} />
      <SchemaMarkup schema={faqSchema} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm text-slate-400">
          <Link href="/" className="hover:text-amber-400 transition-colors">Home</Link>
          <span>&rsaquo;</span>
          <span className="text-slate-200 font-medium">Goethe Exam Preparation</span>
        </nav>

        {/* Hero Section */}
        <div className="relative rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-8 sm:p-12 shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="max-w-3xl space-y-6 relative z-10">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-extrabold border border-emerald-500/30">
              Independent Exam Preparation
            </span>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
              Goethe Exam Preparation in Pakistan
            </h1>
            
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              Achieve your target Goethe-Zertifikat score with structured exam preparation. We offer module coaching, diagnostic mock drills, letter-writing feedback, and interactive speaking sessions for students across Pakistan.
            </p>
            
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs sm:text-sm text-amber-200/90 leading-relaxed flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong>Important Notice &amp; Disclaimer:</strong> German Learning School is an independent language preparation institute. We are not officially affiliated with, endorsed by, or an examination center for the Goethe-Institut. For official examination registration, exam schedules, and test center venues in Pakistan, please visit the official Goethe-Institut portal.
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Link
                href="/courses"
                className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm sm:text-base rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <span>Explore German Course Batches</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/practice-tests"
                className="px-6 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm rounded-xl border border-slate-700 hover:border-amber-500/40 transition-all flex items-center justify-center gap-2"
              >
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>Take a Free Practice Test</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            
            {/* H2: Goethe Exam Preparation in Pakistan (Overview & Distinction) */}
            <section className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-4 shadow-xl">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Goethe Exam Preparation in Pakistan</h2>
              <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                The Goethe-Zertifikat is the gold standard for certifying German language proficiency worldwide. Recognized by the German Federal Foreign Office (Auswärtiges Amt), universities, and medical licensing boards, it serves as formal verification of your linguistic ability.
              </p>
              <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                At German Learning School, we distinguish between standard language learning courses, targeted exam preparation, diagnostic practice tests, and the official examination itself:
              </p>
              <div className="grid sm:grid-cols-2 gap-4 pt-2 text-xs sm:text-sm">
                <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800">
                  <span className="font-bold text-amber-400 block mb-1">1. German Language Courses</span>
                  <p className="text-slate-400">Comprehensive CEFR courses (A1 to B2) building foundational grammar, vocabulary, and daily communicative fluency.</p>
                </div>
                <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800">
                  <span className="font-bold text-emerald-400 block mb-1">2. Exam Preparation Coaching</span>
                  <p className="text-slate-400">Targeted training focused on exam formats, time management, module scoring rubrics, and formal letter structures.</p>
                </div>
                <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800">
                  <span className="font-bold text-blue-400 block mb-1">3. Online Practice Tests</span>
                  <p className="text-slate-400">Free diagnostic quizzes and mock tests on our website to self-evaluate knowledge before exam day.</p>
                </div>
                <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800">
                  <span className="font-bold text-purple-400 block mb-1">4. Official Goethe Examination</span>
                  <p className="text-slate-400">The formal standardized test administered directly by the Goethe-Institut to issue certified diplomas.</p>
                </div>
              </div>
            </section>

            {/* H2: Goethe Exam Levels */}
            <section className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Goethe Exam Levels</h2>
              <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                Each Goethe-Zertifikat corresponds to a standardized level under the Common European Framework of Reference for Languages (CEFR):
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">CEFR A1 • Beginner</span>
                  <h3 className="text-lg font-bold text-white">Goethe-Zertifikat A1 (Start Deutsch 1)</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Required for the German Spouse / Family Reunion Visa (Ehegattennachzug) and Au Pair applications. Demonstrates basic everyday communication aligned with the <Link href="/german-a1-syllabus" className="text-amber-400 hover:underline">German A1 syllabus</Link>.
                  </p>
                </div>
                <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">CEFR A2 • Elementary</span>
                  <h3 className="text-lg font-bold text-white">Goethe-Zertifikat A2</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Awards +1 point under the German Opportunity Card (Chancenkarte) system and verifies ability to handle routine social and workplace interactions.
                  </p>
                </div>
                <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">CEFR B1 • Intermediate</span>
                  <h3 className="text-lg font-bold text-white">Goethe-Zertifikat B1</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    The essential milestone for German vocational training (Ausbildung), Studienkolleg entrance, job seeker visas, and permanent residency.
                  </p>
                </div>
                <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">CEFR B2 • Upper Intermediate</span>
                  <h3 className="text-lg font-bold text-white">Goethe-Zertifikat B2</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Required for university degree admission in Germany and mandatory for foreign healthcare professionals (doctors and nurses) pursuing licensing.
                  </p>
                </div>
              </div>
            </section>

            {/* H2: Goethe Exam Preparation A1–B2 */}
            <section className="space-y-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Goethe Exam Preparation A1–B2</h2>
              <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                Whether you are starting from zero or need advanced preparation for academic and visa goals, explore our live instructor-led courses:
              </p>
              <div className="space-y-4">
                <Link href="/courses/german-a1" className="block p-5 bg-slate-900 border border-slate-800 hover:border-amber-500 rounded-2xl transition-colors group">
                  <h3 className="text-lg font-bold text-white group-hover:text-amber-400 flex items-center justify-between">
                    <span>German A1 Course Preparation</span>
                    <ArrowRight className="w-5 h-5 text-amber-400" />
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">Live Zoom classes, alphabet, basic grammar, and Goethe A1 exam orientation for family reunion visas.</p>
                </Link>
                <Link href="/courses/german-a2" className="block p-5 bg-slate-900 border border-slate-800 hover:border-amber-500 rounded-2xl transition-colors group">
                  <h3 className="text-lg font-bold text-white group-hover:text-amber-400 flex items-center justify-between">
                    <span>German A2 Course Preparation</span>
                    <ArrowRight className="w-5 h-5 text-amber-400" />
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">Build conversational past tenses (Perfekt) and Dative case mastery for daily German interactions.</p>
                </Link>
                <Link href="/courses/german-b1" className="block p-5 bg-slate-900 border border-slate-800 hover:border-amber-500 rounded-2xl transition-colors group">
                  <h3 className="text-lg font-bold text-white group-hover:text-amber-400 flex items-center justify-between">
                    <span>German B1 Course Preparation</span>
                    <ArrowRight className="w-5 h-5 text-amber-400" />
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">Intensive module-by-module preparation covering all 4 exam components for Ausbildung and Studienkolleg.</p>
                </Link>
                <Link href="/courses/german-b2" className="block p-5 bg-slate-900 border border-slate-800 hover:border-amber-500 rounded-2xl transition-colors group">
                  <h3 className="text-lg font-bold text-white group-hover:text-amber-400 flex items-center justify-between">
                    <span>German B2 Course Preparation</span>
                    <ArrowRight className="w-5 h-5 text-amber-400" />
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">Advanced professional and academic German for university applicants, engineers, and doctors.</p>
                </Link>
              </div>
            </section>

            {/* H2: German Exam Skills (The 4 Modules) */}
            <section className="space-y-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">German Exam Skills (The 4 Modules)</h2>
              <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                The Goethe-Zertifikat evaluates four distinct competencies. To pass, you must demonstrate proficiency across each section:
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
                  <BookOpen className="w-8 h-8 text-emerald-400 mb-3" />
                  <h3 className="text-xl font-bold text-white mb-2">Lesen (Reading)</h3>
                  <p className="text-xs sm:text-sm text-slate-400">Understanding emails, advertisements, classified notices, and journalistic articles. We train you to extract key data quickly under time limits.</p>
                </div>
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
                  <Headset className="w-8 h-8 text-blue-400 mb-3" />
                  <h3 className="text-xl font-bold text-white mb-2">Hören (Listening)</h3>
                  <p className="text-xs sm:text-sm text-slate-400">Comprehending airport announcements, telephone messages, and radio discussions with authentic native pacing and accents.</p>
                </div>
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
                  <Edit3 className="w-8 h-8 text-amber-400 mb-3" />
                  <h3 className="text-xl font-bold text-white mb-2">Schreiben (Writing)</h3>
                  <p className="text-xs sm:text-sm text-slate-400">Composing formal and semi-formal letters, response emails, and short opinion essays following standard Goethe grading criteria.</p>
                </div>
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
                  <Mic className="w-8 h-8 text-purple-400 mb-3" />
                  <h3 className="text-xl font-bold text-white mb-2">Sprechen (Speaking)</h3>
                  <p className="text-xs sm:text-sm text-slate-400">Self-introductions, partner conversations, negotiating solutions, and delivering structured short presentations.</p>
                </div>
              </div>
            </section>

            {/* H2: Practice Tests & Mock Exams */}
            <section className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Practice Tests &amp; Mock Exams</h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">Assess your current CEFR level with our free interactive quizzes:</p>
                </div>
                <Link href="/practice-tests" className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1">
                  All Practice Tests <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <Link href="/practice-tests/german-a1" className="p-5 bg-slate-900 border border-slate-800 hover:border-amber-500 rounded-2xl transition-colors group block">
                  <h3 className="text-base font-bold text-white group-hover:text-amber-400 flex items-center justify-between">
                    <span>German A1 Practice Test Online</span>
                    <ArrowRight className="w-4 h-4 text-amber-400" />
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Evaluate beginner vocabulary, articles, and basic sentence construction.</p>
                </Link>
                <Link href="/practice-tests/german-a2" className="p-5 bg-slate-900 border border-slate-800 hover:border-amber-500 rounded-2xl transition-colors group block">
                  <h3 className="text-base font-bold text-white group-hover:text-amber-400 flex items-center justify-between">
                    <span>German A2 Practice Test Online</span>
                    <ArrowRight className="w-4 h-4 text-amber-400" />
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Test elementary past tenses (Perfekt) and Dative prepositions.</p>
                </Link>
                <Link href="/practice-tests/german-b1" className="p-5 bg-slate-900 border border-slate-800 hover:border-amber-500 rounded-2xl transition-colors group block">
                  <h3 className="text-base font-bold text-white group-hover:text-amber-400 flex items-center justify-between">
                    <span>German B1 Practice Test Online</span>
                    <ArrowRight className="w-4 h-4 text-amber-400" />
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Challenge intermediate grammar: passive voice, Konjunktiv II, and relative clauses.</p>
                </Link>
                <Link href="/practice-tests/german-b2" className="p-5 bg-slate-900 border border-slate-800 hover:border-amber-500 rounded-2xl transition-colors group block">
                  <h3 className="text-base font-bold text-white group-hover:text-amber-400 flex items-center justify-between">
                    <span>German B2 Practice Test Online</span>
                    <ArrowRight className="w-4 h-4 text-amber-400" />
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Test upper-intermediate grammar, collocations, and academic reading comprehension.</p>
                </Link>
              </div>

              <div className="pt-2">
                <Link
                  href="/practice-tests/noun-builder"
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-amber-400 hover:underline"
                >
                  <BookOpen className="w-4 h-4" /> Try our interactive Der/Die/Das Noun Gender Builder
                </Link>
              </div>
            </section>

            {/* H2: How to Prepare for the Goethe Exam */}
            <section className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">How to Prepare for the Goethe Exam</h2>
              <ul className="space-y-4 text-slate-300 text-sm">
                <li className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong>Timed Mock Examinations:</strong> Taking timed practice exams is crucial to get used to strict time limits for the reading and writing sections.
                  </div>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong>Live Speaking Practice:</strong> You cannot pass Sprechen without consistent speaking dialogue. Our live Zoom sessions simulate official paired discussions.
                  </div>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong>Teacher Writing Corrections:</strong> Submit your emails and essays to our experienced faculty to receive detailed feedback on grammar, register, and format.
                  </div>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong>Listening Immersion:</strong> Practice with authentic German podcasts and audio dialogues to build comprehension of native conversational speed.
                  </div>
                </li>
              </ul>
            </section>

            {/* H2: Frequently Asked Questions */}
            <section className="space-y-6">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <HelpCircle className="w-4 h-4" />
                <span>Got Questions?</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Frequently Asked Questions</h2>
              
              <div className="space-y-4">
                {goetheFaqs.map((faq, idx) => (
                  <div key={idx} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-2 shadow-md">
                    <h3 className="text-base sm:text-lg font-bold text-white flex items-start gap-2">
                      <span className="text-amber-400 font-extrabold">Q:</span>
                      <span>{faq.q}</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-5">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-lg font-bold text-white">Official Information</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                For official registration dates, exact examination fees in Pakistan, and test center venues (Karachi, Islamabad), please consult the official Goethe-Institut portal.
              </p>
              <a 
                href="https://www.goethe.de/ins/pk/en/index.html" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-amber-400 hover:text-amber-300 pt-1"
              >
                <span>Visit Official Goethe Portal</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-lg font-bold text-white">Related Exam Guides &amp; Articles</h3>
              <div className="flex flex-col gap-2.5 text-xs sm:text-sm">
                <Link href="/blog/goethe-vs-telc-which-german-exam-should-you-choose-in-pakistan" className="text-slate-300 hover:text-amber-400 flex items-center justify-between py-1 border-b border-slate-800">
                  <span>Goethe vs telc: Which Exam to Choose?</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                </Link>
                <Link href="/blog/goethe-vs-telc-vs-testdaf-vs-osd-which-german-exam" className="text-slate-300 hover:text-amber-400 flex items-center justify-between py-1 border-b border-slate-800">
                  <span>Goethe vs telc vs TestDaF Comparison</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                </Link>
                <Link href="/german-a1-syllabus" className="text-slate-300 hover:text-amber-400 flex items-center justify-between py-1 border-b border-slate-800">
                  <span>German A1 Exam Syllabus &amp; Topics</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                </Link>
                <Link href="/blog/how-long-does-it-take-to-learn-german-from-a1-to-b2-a-realistic-timeline" className="text-slate-300 hover:text-amber-400 flex items-center justify-between py-1">
                  <span>German A1 to B2 Learning Timeline</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                </Link>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-lg font-bold text-white">Explore Related Resources</h3>
              <div className="flex flex-col gap-2.5 text-xs sm:text-sm">
                <Link href="/courses" className="text-slate-300 hover:text-amber-400 flex items-center justify-between py-1 border-b border-slate-800">
                  <span>All German Courses &amp; Fees</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link href="/telc-exam-preparation" className="text-slate-300 hover:text-amber-400 flex items-center justify-between py-1 border-b border-slate-800">
                  <span>telc Exam Preparation in Pakistan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link href="/testdaf-preparation" className="text-slate-300 hover:text-amber-400 flex items-center justify-between py-1 border-b border-slate-800">
                  <span>TestDaF Preparation in Pakistan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link href="/practice-tests" className="text-slate-300 hover:text-amber-400 flex items-center justify-between py-1 border-b border-slate-800">
                  <span>Free German Practice Tests</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link href="/resources" className="text-slate-300 hover:text-amber-400 flex items-center justify-between py-1 border-b border-slate-800">
                  <span>Free German Learning Resources</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link href="/contact" className="text-slate-300 hover:text-amber-400 flex items-center justify-between py-1">
                  <span>Contact Admissions Team</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
