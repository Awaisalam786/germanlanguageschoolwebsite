import React from 'react';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, ExternalLink, BookOpen, Mic, Headset, Edit3 } from 'lucide-react';
import SchemaMarkup from '../../src/components/SchemaMarkup';

export const metadata = {
  title: 'telc Exam Preparation Pakistan (A1-B2)',
  description: 'Independent telc German exam preparation classes in Pakistan. Module training, practice tests, and structured coaching for telc A1, A2, B1, and B2 certifications.',
  alternates: {
    canonical: '/telc-exam-preparation',
  },
};

export default function TelcExamPreparation() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://germanlearningschool.com/" },
      { "@type": "ListItem", "position": 2, "name": "telc Exam Preparation", "item": "https://germanlearningschool.com/telc-exam-preparation" }
    ]
  };

  return (
    <>
      <SchemaMarkup schema={breadcrumbSchema} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Link href="/" className="hover:text-amber-400">Home</Link>
          <span>&rsaquo;</span>
          <span className="text-slate-200">telc Exam Preparation</span>
        </div>

        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="lg:w-2/3 space-y-6">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/30">
              Exam Preparation Services
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
              telc Exam Preparation in Pakistan
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed">
              Prepare effectively for telc Deutsch examinations with structured online coaching. We offer comprehensive module training, practice drills, and exam-focused guidance for students and professionals across Pakistan.
            </p>
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-sm text-amber-200/80">
              <strong>Disclaimer:</strong> German Learning School is an independent language preparation provider. We are not officially affiliated with, endorsed by, or an authorized examination center of telc gGmbH. For official exam schedules, test center locations, and registration fees, please visit the official telc website or authorized examination centers.
            </div>
          </div>
          
          <div className="lg:w-1/3 w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 text-center shadow-xl">
            <h3 className="text-2xl font-bold text-white">Start Preparing Today</h3>
            <p className="text-slate-400 text-sm">Join our structured live batches and strengthen your performance across reading, listening, writing, and speaking.</p>
            <div className="flex flex-col gap-3">
              <Link href="/courses" className="py-3 px-6 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition-all flex items-center justify-center gap-2">
                Explore German Courses <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/practice-tests" className="py-3 px-6 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all">
                Take a Free Practice Test
              </Link>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            
            <section className="space-y-4">
              <h2 className="text-3xl font-extrabold text-white">What is the telc Deutsch Certificate?</h2>
              <p className="text-slate-300 leading-relaxed">
                telc (The European Language Certificates) examinations are internationally recognized standardized tests aligned with the Common European Framework of Reference for Languages (CEFR). telc certificates are widely accepted by German universities, employers, and immigration authorities for visa applications, vocational training (Ausbildung), job search, and professional licensing.
              </p>
            </section>

            <section className="space-y-6">
              <h2 className="text-3xl font-extrabold text-white">telc Exam Modules &amp; Structure</h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                telc examinations evaluate your competency across four core skills divided into written (Schriftliche Prüfung) and oral (Mündliche Prüfung) sections:
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
                  <BookOpen className="w-8 h-8 text-emerald-400 mb-3" />
                  <h3 className="text-xl font-bold text-white mb-2">Lesen (Reading &amp; Language Elements)</h3>
                  <p className="text-sm text-slate-400">Comprehending articles, notices, and correspondence. Includes targeted practice for Sprachbausteine (grammar and vocabulary in context).</p>
                </div>
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
                  <Headset className="w-8 h-8 text-blue-400 mb-3" />
                  <h3 className="text-xl font-bold text-white mb-2">Hören (Listening)</h3>
                  <p className="text-sm text-slate-400">Understanding everyday announcements, interviews, and discussions. We train you with authentic accents and pacing.</p>
                </div>
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
                  <Edit3 className="w-8 h-8 text-amber-400 mb-3" />
                  <h3 className="text-xl font-bold text-white mb-2">Schreiben (Writing)</h3>
                  <p className="text-sm text-slate-400">Composing formal letters, emails, and response texts following correct German conventions, register, and format.</p>
                </div>
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
                  <Mic className="w-8 h-8 text-purple-400 mb-3" />
                  <h3 className="text-xl font-bold text-white mb-2">Sprechen (Speaking)</h3>
                  <p className="text-sm text-slate-400">Conversational dialogue, role-plays, and topic presentations. Live Zoom sessions allow direct conversational practice with faculty and peers.</p>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-3xl font-extrabold text-white">Preparation by Level</h2>
              <p className="text-slate-300 leading-relaxed">
                Whether you are beginning with foundational German or aiming for intermediate and professional certifications, our courses provide systematic preparation:
              </p>
              <div className="space-y-4">
                <Link href="/courses/german-a1" className="block p-5 bg-slate-900 border border-slate-800 hover:border-amber-500 rounded-2xl transition-colors group">
                  <h3 className="text-lg font-bold text-white group-hover:text-amber-400 flex items-center gap-2">Start A1 Course Preparation <ArrowRight className="w-4 h-4" /></h3>
                  <p className="text-sm text-slate-400 mt-1">Foundational German communication for beginners and basic visa compliance.</p>
                </Link>
                <Link href="/courses/german-a2" className="block p-5 bg-slate-900 border border-slate-800 hover:border-amber-500 rounded-2xl transition-colors group">
                  <h3 className="text-lg font-bold text-white group-hover:text-amber-400 flex items-center gap-2">Start A2 Course Preparation <ArrowRight className="w-4 h-4" /></h3>
                  <p className="text-sm text-slate-400 mt-1">Elementary language development for daily interactions and immigration points.</p>
                </Link>
                <Link href="/courses/german-b1" className="block p-5 bg-slate-900 border border-slate-800 hover:border-amber-500 rounded-2xl transition-colors group">
                  <h3 className="text-lg font-bold text-white group-hover:text-amber-400 flex items-center gap-2">Start B1 Course Preparation <ArrowRight className="w-4 h-4" /></h3>
                  <p className="text-sm text-slate-400 mt-1">Intermediate proficiency essential for vocational training (Ausbildung) and work visas.</p>
                </Link>
                <Link href="/courses/german-b2" className="block p-5 bg-slate-900 border border-slate-800 hover:border-amber-500 rounded-2xl transition-colors group">
                  <h3 className="text-lg font-bold text-white group-hover:text-amber-400 flex items-center gap-2">Start B2 Course Preparation <ArrowRight className="w-4 h-4" /></h3>
                  <p className="text-sm text-slate-400 mt-1">Upper-intermediate German for university applicants, professionals, and medical career pathways.</p>
                </Link>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-3xl font-extrabold text-white">Free Level Practice Tests</h2>
              <p className="text-slate-300 leading-relaxed">
                Test your current German skills with our free interactive exercises designed to evaluate vocabulary, grammar, and reading comprehension:
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <Link href="/practice-tests/german-a1" className="p-5 bg-slate-900 border border-slate-800 hover:border-amber-500 rounded-2xl transition-colors group block">
                  <h3 className="text-base font-bold text-white group-hover:text-amber-400 flex items-center justify-between">
                    German A1 Practice Test <ArrowRight className="w-4 h-4" />
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Evaluate beginner vocabulary and grammar fundamentals.</p>
                </Link>
                <Link href="/practice-tests/german-a2" className="p-5 bg-slate-900 border border-slate-800 hover:border-amber-500 rounded-2xl transition-colors group block">
                  <h3 className="text-base font-bold text-white group-hover:text-amber-400 flex items-center justify-between">
                    German A2 Practice Test <ArrowRight className="w-4 h-4" />
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Review elementary sentence building and comprehension.</p>
                </Link>
                <Link href="/practice-tests/german-b1" className="p-5 bg-slate-900 border border-slate-800 hover:border-amber-500 rounded-2xl transition-colors group block">
                  <h3 className="text-base font-bold text-white group-hover:text-amber-400 flex items-center justify-between">
                    German B1 Practice Test <ArrowRight className="w-4 h-4" />
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Test intermediate reading and complex grammar structures.</p>
                </Link>
                <Link href="/practice-tests/german-b2" className="p-5 bg-slate-900 border border-slate-800 hover:border-amber-500 rounded-2xl transition-colors group block">
                  <h3 className="text-base font-bold text-white group-hover:text-amber-400 flex items-center justify-between">
                    German B2 Practice Test <ArrowRight className="w-4 h-4" />
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Challenge yourself with advanced German comprehension exercises.</p>
                </Link>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-3xl font-extrabold text-white">Preparation Strategy for telc Exams</h2>
              <ul className="space-y-4 text-slate-300">
                <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> <strong>Mock Drills:</strong> Practice under realistic time constraints to master the pacing of the written sections.</li>
                <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> <strong>Sprachbausteine Practice:</strong> Focus on prepositions, adjective endings, and grammar patterns tested in telc reading modules.</li>
                <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> <strong>Interactive Speaking:</strong> Engage in structured speaking sessions focused on paired dialogues and presentations.</li>
                <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> <strong>Writing Reviews:</strong> Submit letter and email assignments to receive detailed instructor corrections and advice.</li>
              </ul>
            </section>

          </div>

          <div className="lg:col-span-1 space-y-8">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
              <h3 className="text-xl font-bold text-white">Official Information</h3>
              <p className="text-sm text-slate-300">
                For official examination schedules, registered test centers, and examination regulations worldwide, please visit the official telc website.
              </p>
              <a href="https://www.telc.net/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-bold text-amber-400 hover:text-amber-300">
                Visit Official telc Website <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
              <h3 className="text-xl font-bold text-white">Quick Links</h3>
              <div className="flex flex-col gap-3">
                <Link href="/practice-tests" className="text-sm text-slate-300 hover:text-amber-400 flex items-center gap-2">
                  <ArrowRight className="w-4 h-4" /> Practice Tests Hub
                </Link>
                <Link href="/courses" className="text-sm text-slate-300 hover:text-amber-400 flex items-center gap-2">
                  <ArrowRight className="w-4 h-4" /> All German Courses
                </Link>
                <Link href="/contact" className="text-sm text-slate-300 hover:text-amber-400 flex items-center gap-2">
                  <ArrowRight className="w-4 h-4" /> Contact Admissions
                </Link>
                <Link href="/blog" className="text-sm text-slate-300 hover:text-amber-400 flex items-center gap-2">
                  <ArrowRight className="w-4 h-4" /> Study Guidance Blog
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
