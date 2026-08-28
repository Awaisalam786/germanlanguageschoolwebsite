import React from 'react';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, ExternalLink, BookOpen, Mic, Headset, Edit3 } from 'lucide-react';
import SchemaMarkup from '../../src/components/SchemaMarkup';

export const metadata = {
  title: 'Goethe Exam Preparation Pakistan (A1–B2) | German Learning School',
  description: 'Prepare for Goethe-Zertifikat exams with German Learning School. Explore A1–B2 preparation, exam modules, mock tests, speaking practice and study guidance in Pakistan.',
  alternates: {
    canonical: '/goethe-exam-preparation',
  },
};

export default function GoetheExamPreparation() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://germanlearningschool.com/" },
      { "@type": "ListItem", "position": 2, "name": "Goethe Exam Preparation", "item": "https://germanlearningschool.com/goethe-exam-preparation" }
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
          <span className="text-slate-200">Goethe Exam Preparation</span>
        </div>

        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="lg:w-2/3 space-y-6">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/30">
              Exam Preparation Services
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
              Goethe Exam Preparation in Pakistan
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed">
              Achieve your desired Goethe-Zertifikat score with targeted exam preparation. We provide mock tests, specialized module training, and expert guidance for students across Pakistan.
            </p>
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-sm text-amber-200/80">
              <strong>Disclaimer:</strong> German Learning School is an independent language preparation provider. We are not officially affiliated with the Goethe-Institut. For official exam dates, fees, and registration in Pakistan, please visit the official Goethe-Institut website.
            </div>
          </div>
          
          <div className="lg:w-1/3 w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 text-center shadow-xl">
            <h3 className="text-2xl font-bold text-white">Start Preparing Today</h3>
            <p className="text-slate-400 text-sm">Join our specialized classes and master all four exam modules (Reading, Listening, Writing, Speaking).</p>
            <div className="flex flex-col gap-3">
              <Link href="/courses" className="py-3 px-6 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition-all flex items-center justify-center gap-2">
                Explore German Courses <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/practice-tests" className="py-3 px-6 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all">
                Take a Free Mock Test
              </Link>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            
            <section className="space-y-4">
              <h2 className="text-3xl font-extrabold text-white">What is the Goethe-Zertifikat?</h2>
              <p className="text-slate-300 leading-relaxed">
                The Goethe-Zertifikat is an internationally recognized German language exam administered by the Goethe-Institut. It is widely accepted by German universities, employers, and embassies for study visas, family reunion visas, and professional licensing (like nursing or medical recognition).
              </p>
            </section>

            <section className="space-y-6">
              <h2 className="text-3xl font-extrabold text-white">Goethe Exam Modules</h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                The exam is strictly divided into four core modules. You must demonstrate proficiency in each to obtain the certificate.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
                  <BookOpen className="w-8 h-8 text-emerald-400 mb-3" />
                  <h3 className="text-xl font-bold text-white mb-2">Lesen (Reading)</h3>
                  <p className="text-sm text-slate-400">Understanding emails, advertisements, and articles. We train you to extract key information quickly.</p>
                </div>
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
                  <Headset className="w-8 h-8 text-blue-400 mb-3" />
                  <h3 className="text-xl font-bold text-white mb-2">Hören (Listening)</h3>
                  <p className="text-sm text-slate-400">Comprehending announcements and everyday conversations. We practice with authentic audio formats.</p>
                </div>
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
                  <Edit3 className="w-8 h-8 text-amber-400 mb-3" />
                  <h3 className="text-xl font-bold text-white mb-2">Schreiben (Writing)</h3>
                  <p className="text-sm text-slate-400">Drafting short messages and formal letters. Learn the exact structure and vocabulary examiners look for.</p>
                </div>
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
                  <Mic className="w-8 h-8 text-purple-400 mb-3" />
                  <h3 className="text-xl font-bold text-white mb-2">Sprechen (Speaking)</h3>
                  <p className="text-sm text-slate-400">Introducing yourself and answering questions. Benefit from live Zoom sessions to practice speaking directly with our faculty.</p>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-3xl font-extrabold text-white">Preparation by Level</h2>
              <p className="text-slate-300 leading-relaxed">
                Whether you are starting from scratch or preparing for university admission, we have targeted courses for every CEFR level.
              </p>
              <div className="space-y-4">
                <Link href="/courses/german-a1" className="block p-5 bg-slate-900 border border-slate-800 hover:border-amber-500 rounded-2xl transition-colors group">
                  <h3 className="text-lg font-bold text-white group-hover:text-amber-400 flex items-center gap-2">Start A1 Exam Preparation <ArrowRight className="w-4 h-4" /></h3>
                  <p className="text-sm text-slate-400 mt-1">For beginners seeking family reunion visas or au pair programs.</p>
                </Link>
                <Link href="/courses/german-a2" className="block p-5 bg-slate-900 border border-slate-800 hover:border-amber-500 rounded-2xl transition-colors group">
                  <h3 className="text-lg font-bold text-white group-hover:text-amber-400 flex items-center gap-2">Start A2 Exam Preparation <ArrowRight className="w-4 h-4" /></h3>
                  <p className="text-sm text-slate-400 mt-1">Expanding vocabulary for everyday communication and intermediate fluency.</p>
                </Link>
                <Link href="/courses/german-b1" className="block p-5 bg-slate-900 border border-slate-800 hover:border-amber-500 rounded-2xl transition-colors group">
                  <h3 className="text-lg font-bold text-white group-hover:text-amber-400 flex items-center gap-2">Start B1 Exam Preparation <ArrowRight className="w-4 h-4" /></h3>
                  <p className="text-sm text-slate-400 mt-1">The primary requirement for Studienkolleg and many professional visas.</p>
                </Link>
                <Link href="/courses/german-b2" className="block p-5 bg-slate-900 border border-slate-800 hover:border-amber-500 rounded-2xl transition-colors group">
                  <h3 className="text-lg font-bold text-white group-hover:text-amber-400 flex items-center gap-2">Start B2 Exam Preparation <ArrowRight className="w-4 h-4" /></h3>
                  <p className="text-sm text-slate-400 mt-1">Advanced fluency often required for university direct admission and medical professionals.</p>
                </Link>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-3xl font-extrabold text-white">Preparation Strategy</h2>
              <ul className="space-y-4 text-slate-300">
                <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> <strong>Mock Tests:</strong> Taking timed practice exams is crucial. We simulate the exact test environment.</li>
                <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> <strong>Speaking Partners:</strong> You cannot pass Sprechen without practice. Our live classes focus heavily on interaction.</li>
                <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> <strong>Writing Feedback:</strong> Submit your letters/emails to our teachers and receive personalized corrections.</li>
              </ul>
            </section>

          </div>

          <div className="lg:col-span-1 space-y-8">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
              <h3 className="text-xl font-bold text-white">Official Information</h3>
              <p className="text-sm text-slate-300">
                For official registration dates, exact examination fees in Pakistan, and test center locations (Karachi, Lahore), please consult the official Goethe-Institut website.
              </p>
              <a href="https://www.goethe.de/ins/pk/en/index.html" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-bold text-amber-400 hover:text-amber-300">
                Visit Official Website <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
              <h3 className="text-xl font-bold text-white">Quick Links</h3>
              <div className="flex flex-col gap-3">
                <Link href="/practice-tests" className="text-sm text-slate-300 hover:text-amber-400 flex items-center gap-2">
                  <ArrowRight className="w-4 h-4" /> Take a Free Mock Test
                </Link>
                <Link href="/courses/german-a1" className="text-sm text-slate-300 hover:text-amber-400 flex items-center gap-2">
                  <ArrowRight className="w-4 h-4" /> German A1 Course
                </Link>
                <Link href="/courses/german-b1" className="text-sm text-slate-300 hover:text-amber-400 flex items-center gap-2">
                  <ArrowRight className="w-4 h-4" /> German B1 Course
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
