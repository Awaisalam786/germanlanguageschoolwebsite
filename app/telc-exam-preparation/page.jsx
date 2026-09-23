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

export const metadata = {
  title: {
    absolute: 'telc Exam Preparation in Pakistan | German Learning School',
  },
  description: 'Prepare for telc German exams in Pakistan with structured online coaching. Master reading, listening, writing, and speaking for telc A1, A2, B1, and B2 levels.',
  alternates: {
    canonical: '/telc-exam-preparation',
  },
  openGraph: {
    title: 'telc Exam Preparation in Pakistan | German Learning School',
    description: 'Prepare for telc German exams in Pakistan with structured online coaching. Master reading, listening, writing, and speaking for telc A1, A2, B1, and B2 levels.',
    url: 'https://germanlearningschool.com/telc-exam-preparation',
    siteName: 'German Learning School',
    locale: 'en_PK',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'telc Exam Preparation in Pakistan | German Learning School',
    description: 'Prepare for telc German exams in Pakistan with structured online coaching. Master reading, listening, writing, and speaking for telc A1, A2, B1, and B2 levels.',
  },
};

const telcFaqs = [
  {
    q: 'What is a telc German examination?',
    a: 'telc (The European Language Certificates) is a standardized language testing system aligned with the CEFR framework. telc German certificates are recognized by German embassies, employers, vocational training centers (Ausbildung), and universities for visas, work permits, and study admission.'
  },
  {
    q: 'Is telc accepted for German visas and university admission?',
    a: 'Yes. telc Deutsch certificates from A1 to B2/C1 are officially accepted by the German Embassy for spouse visas (A1), skilled worker visas (B1/B2), and by many German universities for academic entrance (e.g., telc Deutsch C1 Hochschule or B2).'
  },
  {
    q: 'Is German Learning School an official telc examination center?',
    a: 'No. German Learning School is an independent preparatory training provider. We are not officially affiliated with, endorsed by, or an authorized examination center of telc gGmbH. Candidates register for official exams with authorized telc test centers.'
  },
  {
    q: 'What is unique about the telc exam format?',
    a: 'telc examinations feature a unique "Sprachbausteine" section within the reading module that specifically tests grammar and vocabulary in context (prepositions, connectors, idioms). Our classes provide dedicated drills for these exercises.'
  },
  {
    q: 'How does telc compare to the Goethe-Zertifikat?',
    a: 'Both telc and Goethe-Zertifikat adhere to the identical CEFR standards (A1 to C2) and enjoy equivalent legal acceptance for German visas and employment. The primary difference lies in specific task formats and question structuring.'
  },
  {
    q: 'Do you provide mock tests for telc preparation?',
    a: 'Yes, we provide free online practice tests across A1, A2, B1, and B2 levels on our website, in addition to full-length timed mock exams in our live preparation batches.'
  }
];

export default function TelcExamPreparation() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://germanlearningschool.com/" },
      { "@type": "ListItem", "position": 2, "name": "telc Exam Preparation", "item": "https://germanlearningschool.com/telc-exam-preparation" }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": telcFaqs.map((faq) => ({
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
          <span className="text-slate-200 font-medium">telc Exam Preparation</span>
        </nav>

        {/* Hero Section */}
        <div className="relative rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-8 sm:p-12 shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="max-w-3xl space-y-6 relative z-10">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-extrabold border border-emerald-500/30">
              Independent Exam Preparation
            </span>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
              telc Exam Preparation in Pakistan
            </h1>
            
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              Prepare effectively for telc Deutsch examinations with structured online coaching. We offer comprehensive module training, Sprachbausteine practice drills, and exam-focused guidance for students and professionals across Pakistan.
            </p>
            
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs sm:text-sm text-amber-200/90 leading-relaxed flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong>Important Notice &amp; Disclaimer:</strong> German Learning School is an independent language preparation institute. We are not officially affiliated with, endorsed by, or an authorized examination center of telc gGmbH. For official exam schedules, test center locations, and registration fees worldwide, please visit the official telc website.
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Link
                href="/courses"
                className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm sm:text-base rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <span>Explore German Courses &amp; Fees</span>
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
            
            {/* H2: telc Exam Preparation in Pakistan (Overview & Distinction) */}
            <section className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-4 shadow-xl">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">telc Exam Preparation in Pakistan</h2>
              <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                telc (The European Language Certificates) examinations are internationally recognized standardized tests aligned with the Common European Framework of Reference for Languages (CEFR). telc certificates are widely accepted by German universities, employers, and immigration authorities for visa applications, vocational training (Ausbildung), job search, and professional licensing.
              </p>
              <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                To help learners plan effectively, we clearly distinguish between standard German courses, specialized telc preparation, online practice quizzes, and the official telc examination:
              </p>
              <div className="grid sm:grid-cols-2 gap-4 pt-2 text-xs sm:text-sm">
                <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800">
                  <span className="font-bold text-amber-400 block mb-1">1. German Language Courses</span>
                  <p className="text-slate-400">Live online courses teaching core grammar, active vocabulary, and foundational communication skills from A1 to B2.</p>
                </div>
                <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800">
                  <span className="font-bold text-emerald-400 block mb-1">2. telc Exam Preparation</span>
                  <p className="text-slate-400">Targeted coaching on telc question formats, Sprachbausteine syntax tests, formal letter structures, and oral presentations.</p>
                </div>
                <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800">
                  <span className="font-bold text-blue-400 block mb-1">3. Online Practice Tests</span>
                  <p className="text-slate-400">Free interactive exercises available on our website to gauge your vocabulary, grammar, and reading readiness.</p>
                </div>
                <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800">
                  <span className="font-bold text-purple-400 block mb-1">4. Official telc Examination</span>
                  <p className="text-slate-400">The formal standardized test administered exclusively by licensed telc examination centers worldwide.</p>
                </div>
              </div>
            </section>

            {/* H2: telc German Levels */}
            <section className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">telc German Levels</h2>
              <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                telc offers standardized examinations at each CEFR stage, addressing specific educational, immigration, and professional requirements:
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">CEFR A1</span>
                  <h3 className="text-lg font-bold text-white">telc Deutsch A1</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Certifies beginner German skills for basic everyday interactions and satisfies language requirements for the German spousal visa.
                  </p>
                </div>
                <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">CEFR A2</span>
                  <h3 className="text-lg font-bold text-white">telc Deutsch A2</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Validates elementary German proficiency, contributing points toward the Opportunity Card (Chancenkarte) and Au Pair programs.
                  </p>
                </div>
                <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">CEFR B1</span>
                  <h3 className="text-lg font-bold text-white">telc Deutsch B1 / Zertifikat Deutsch</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Independent communication proficiency, widely recognized for vocational training (Ausbildung), job search, and naturalization.
                  </p>
                </div>
                <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">CEFR B2</span>
                  <h3 className="text-lg font-bold text-white">telc Deutsch B2 &amp; B2/C1 Medizin</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Advanced language competence essential for university admissions, engineers, and foreign medical personnel seeking license recognition.
                  </p>
                </div>
              </div>
            </section>

            {/* Preparation Pathways: Courses */}
            <section className="space-y-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Preparation Course Pathways</h2>
              <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                Build the core linguistic competence needed for telc exams through our structured online course batches:
              </p>
              <div className="space-y-4">
                <Link href="/courses/german-a1" className="block p-5 bg-slate-900 border border-slate-800 hover:border-amber-500 rounded-2xl transition-colors group">
                  <h3 className="text-lg font-bold text-white group-hover:text-amber-400 flex items-center justify-between">
                    <span>German A1 Course Preparation</span>
                    <ArrowRight className="w-5 h-5 text-amber-400" />
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">Foundational German communication for beginners and basic visa compliance.</p>
                </Link>
                <Link href="/courses/german-a2" className="block p-5 bg-slate-900 border border-slate-800 hover:border-amber-500 rounded-2xl transition-colors group">
                  <h3 className="text-lg font-bold text-white group-hover:text-amber-400 flex items-center justify-between">
                    <span>German A2 Course Preparation</span>
                    <ArrowRight className="w-5 h-5 text-amber-400" />
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">Elementary language development for daily interactions and immigration points.</p>
                </Link>
                <Link href="/courses/german-b1" className="block p-5 bg-slate-900 border border-slate-800 hover:border-amber-500 rounded-2xl transition-colors group">
                  <h3 className="text-lg font-bold text-white group-hover:text-amber-400 flex items-center justify-between">
                    <span>German B1 Course Preparation</span>
                    <ArrowRight className="w-5 h-5 text-amber-400" />
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">Intermediate proficiency essential for vocational training (Ausbildung) and work visas.</p>
                </Link>
                <Link href="/courses/german-b2" className="block p-5 bg-slate-900 border border-slate-800 hover:border-amber-500 rounded-2xl transition-colors group">
                  <h3 className="text-lg font-bold text-white group-hover:text-amber-400 flex items-center justify-between">
                    <span>German B2 Course Preparation</span>
                    <ArrowRight className="w-5 h-5 text-amber-400" />
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">Upper-intermediate German for university applicants, professionals, and medical career pathways.</p>
                </Link>
              </div>
            </section>

            {/* H2: Exam Skills (The 4 Modules & Sprachbausteine) */}
            <section className="space-y-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Exam Skills (The 4 Modules &amp; Sprachbausteine)</h2>
              <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                telc examinations evaluate your competency across four core skills divided into written (Schriftliche Prüfung) and oral (Mündliche Prüfung) sections:
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
                  <BookOpen className="w-8 h-8 text-emerald-400 mb-3" />
                  <h3 className="text-xl font-bold text-white mb-2">Lesen &amp; Sprachbausteine</h3>
                  <p className="text-xs sm:text-sm text-slate-400">Comprehending articles, notices, and correspondence. Includes intensive drills for Sprachbausteine (grammar and vocabulary fill-in tasks in context).</p>
                </div>
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
                  <Headset className="w-8 h-8 text-blue-400 mb-3" />
                  <h3 className="text-xl font-bold text-white mb-2">Hören (Listening)</h3>
                  <p className="text-xs sm:text-sm text-slate-400">Understanding everyday announcements, interviews, and discussions. We train you with authentic accents and natural dialogue pacing.</p>
                </div>
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
                  <Edit3 className="w-8 h-8 text-amber-400 mb-3" />
                  <h3 className="text-xl font-bold text-white mb-2">Schreiben (Writing)</h3>
                  <p className="text-xs sm:text-sm text-slate-400">Composing formal letters, emails, and response texts following correct German conventions, register, salutations, and format.</p>
                </div>
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
                  <Mic className="w-8 h-8 text-purple-400 mb-3" />
                  <h3 className="text-xl font-bold text-white mb-2">Sprechen (Speaking)</h3>
                  <p className="text-xs sm:text-sm text-slate-400">Conversational dialogue, role-plays, and topic presentations. Live Zoom sessions allow direct conversational practice with faculty and peers.</p>
                </div>
              </div>
            </section>

            {/* H2: Practice & Mock Tests */}
            <section className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Practice &amp; Mock Tests</h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">Self-assess your German grammar and vocabulary with our free online practice tests:</p>
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
                  <p className="text-xs text-slate-400 mt-1">Review elementary sentence building and comprehension.</p>
                </Link>
                <Link href="/practice-tests/german-b1" className="p-5 bg-slate-900 border border-slate-800 hover:border-amber-500 rounded-2xl transition-colors group block">
                  <h3 className="text-base font-bold text-white group-hover:text-amber-400 flex items-center justify-between">
                    <span>German B1 Practice Test Online</span>
                    <ArrowRight className="w-4 h-4 text-amber-400" />
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Test intermediate reading and complex grammar structures.</p>
                </Link>
                <Link href="/practice-tests/german-b2" className="p-5 bg-slate-900 border border-slate-800 hover:border-amber-500 rounded-2xl transition-colors group block">
                  <h3 className="text-base font-bold text-white group-hover:text-amber-400 flex items-center justify-between">
                    <span>German B2 Practice Test Online</span>
                    <ArrowRight className="w-4 h-4 text-amber-400" />
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Challenge yourself with advanced German comprehension exercises.</p>
                </Link>
              </div>

              <div className="pt-2">
                <Link
                  href="/practice-tests/noun-builder"
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-amber-400 hover:underline"
                >
                  <BookOpen className="w-4 h-4" /> Practice German Noun Genders with Der/Die/Das Noun Builder
                </Link>
              </div>
            </section>

            {/* H2: How to Prepare */}
            <section className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">How to Prepare for the telc Exam</h2>
              <ul className="space-y-4 text-slate-300 text-sm">
                <li className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong>Sprachbausteine Practice:</strong> Pay close attention to prepositions, fixed verb-preposition combinations, and connector logic tested specifically in telc reading modules.
                  </div>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong>Timed Mock Drills:</strong> Practice under realistic time constraints to master the pacing of the written sections without running out of time.
                  </div>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong>Interactive Speaking:</strong> Engage in structured speaking sessions focused on paired dialogues, consensus-building, and presentations.
                  </div>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong>Writing Reviews:</strong> Submit letter and email assignments to receive detailed instructor corrections, formatting advice, and vocabulary enrichments.
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
                {telcFaqs.map((faq, idx) => (
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
                For official examination schedules, registered test center directories, and examination regulations worldwide, please visit the official telc portal.
              </p>
              <a 
                href="https://www.telc.net/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-amber-400 hover:text-amber-300 pt-1"
              >
                <span>Visit Official telc Portal</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-lg font-bold text-white">Related Exam Guides &amp; Articles</h3>
              <div className="flex flex-col gap-2.5 text-xs sm:text-sm">
                <Link href="/blog/telc-b2-medizin-the-medical-german-exam-pakistani-doctors-and-nurses-need-for-germany" className="text-slate-300 hover:text-amber-400 flex items-center justify-between py-1 border-b border-slate-800">
                  <span>telc B2 Medizin Exam Guide</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                </Link>
                <Link href="/blog/goethe-vs-telc-which-german-exam-should-you-choose-in-pakistan" className="text-slate-300 hover:text-amber-400 flex items-center justify-between py-1 border-b border-slate-800">
                  <span>Goethe vs telc: Which Exam to Choose?</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                </Link>
                <Link href="/blog/goethe-vs-telc-vs-testdaf-vs-osd-which-german-exam" className="text-slate-300 hover:text-amber-400 flex items-center justify-between py-1 border-b border-slate-800">
                  <span>Goethe vs telc vs TestDaF Comparison</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                </Link>
                <Link href="/blog/what-german-level-do-you-need-for-a-germany-work-visa-a1-to-c1-explained" className="text-slate-300 hover:text-amber-400 flex items-center justify-between py-1">
                  <span>German Levels for Work Visas Explained</span>
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
                <Link href="/goethe-exam-preparation" className="text-slate-300 hover:text-amber-400 flex items-center justify-between py-1 border-b border-slate-800">
                  <span>Goethe Exam Preparation in Pakistan</span>
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
