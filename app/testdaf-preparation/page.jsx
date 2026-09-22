import React from 'react';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, ExternalLink, BookOpen, Mic, Headset, Edit3, Monitor, FileText } from 'lucide-react';
import SchemaMarkup from '../../src/components/SchemaMarkup';

export const metadata = {
  title: 'TestDaF Exam Preparation Pakistan | University German Prep',
  description: 'Independent TestDaF exam preparation in Pakistan. Academic German coaching, module training, and TDN 4 preparation for study in Germany.',
  alternates: {
    canonical: '/testdaf-preparation',
  },
};

export default function TestDaFPreparation() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://germanlearningschool.com/" },
      { "@type": "ListItem", "position": 2, "name": "TestDaF Preparation", "item": "https://germanlearningschool.com/testdaf-preparation" }
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
          <span className="text-slate-200">TestDaF Preparation</span>
        </div>

        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="lg:w-2/3 space-y-6">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/30">
              Academic German Services
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
              TestDaF Exam Preparation in Pakistan
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed">
              Targeted academic German language preparation for Pakistani students planning to pursue university education in Germany. Strengthen your reading, listening, writing, and oral expression skills for the TestDaF examination.
            </p>
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-sm text-amber-200/80">
              <strong>Disclaimer:</strong> German Learning School is an independent language preparation provider. We are not affiliated with, endorsed by, or an authorized examination center of TestDaF-Institut or the Society for Academic Study Preparation and Test Development (g.a.s.t. e.V.). For official examination schedules, registered test center locations in Pakistan, and test fees, please consult licensed test centers or the official TestDaF website.
            </div>
          </div>
          
          <div className="lg:w-1/3 w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 text-center shadow-xl">
            <h3 className="text-2xl font-bold text-white">Prepare for University</h3>
            <p className="text-slate-400 text-sm">Build the solid B1 and B2 foundation required before undertaking academic TestDaF examination modules.</p>
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
              <h2 className="text-3xl font-extrabold text-white">What is the TestDaF?</h2>
              <p className="text-slate-300 leading-relaxed">
                TestDaF (Test Deutsch als Fremdsprache) is a standardized academic language proficiency examination developed by the TestDaF-Institut. It is primarily designed for international applicants who intend to pursue degree programs taught in German at German higher education institutions (Universitäten and Fachhochschulen).
              </p>
              <p className="text-slate-300 leading-relaxed">
                The test assesses higher-level language competence across academic contexts, including participating in university lectures, analyzing scientific articles, describing statistical data, and engaging in seminar discussions.
              </p>
            </section>

            <section className="space-y-6">
              <h2 className="text-3xl font-extrabold text-white">Understanding TestDaF Levels (TDN)</h2>
              <p className="text-slate-300 leading-relaxed">
                TestDaF results are graded according to three standardized performance levels known as TestDaF-Niveaustufen (TDN), which correspond to CEFR levels B2 to C1:
              </p>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">CEFR B2.1</div>
                  <h3 className="text-lg font-bold text-white">TDN 3</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Demonstrates moderate academic proficiency. Some universities may accept TDN 3 for specific courses or preparatory programs.
                  </p>
                </div>
                <div className="p-5 bg-slate-900 border border-amber-500/40 rounded-2xl space-y-2">
                  <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">CEFR B2.2 – C1.1</div>
                  <h3 className="text-lg font-bold text-white">TDN 4 (Standard Benchmark)</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Achieving TDN 4 in all four sub-tests is the standard qualification required by most German universities for unrestricted direct admission.
                  </p>
                </div>
                <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
                  <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">CEFR C1.2</div>
                  <h3 className="text-lg font-bold text-white">TDN 5</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Indicates advanced proficiency exceeding typical university entrance standards, suitable for highly demanding disciplines.
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-3xl font-extrabold text-white">The Four TestDaF Modules</h2>
              <p className="text-slate-300 leading-relaxed mb-4">
                The examination tests four distinct academic language skills, each evaluated independently on the certificate:
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
                  <BookOpen className="w-8 h-8 text-emerald-400 mb-3" />
                  <h3 className="text-xl font-bold text-white mb-2">Leseverstehen (Reading)</h3>
                  <p className="text-sm text-slate-400">Extracting explicit and implicit arguments from journalistic articles, university notices, and academic journal texts.</p>
                </div>
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
                  <Headset className="w-8 h-8 text-blue-400 mb-3" />
                  <h3 className="text-xl font-bold text-white mb-2">Hörverstehen (Listening)</h3>
                  <p className="text-sm text-slate-400">Comprehending campus dialogue, academic counseling conversations, lectures, and expert interviews in university environments.</p>
                </div>
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
                  <Edit3 className="w-8 h-8 text-amber-400 mb-3" />
                  <h3 className="text-xl font-bold text-white mb-2">Schriftlicher Ausdruck (Writing)</h3>
                  <p className="text-sm text-slate-400">Describing and interpreting structured diagrammatic data followed by developing a coherent, reasoned argumentative essay.</p>
                </div>
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
                  <Mic className="w-8 h-8 text-purple-400 mb-3" />
                  <h3 className="text-xl font-bold text-white mb-2">Mündlicher Ausdruck (Speaking)</h3>
                  <p className="text-sm text-slate-400">Responding to simulated academic situations: presenting factual summaries, participating in discussions, and stating hypotheses.</p>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-3xl font-extrabold text-white">Digital vs. Paper-Based TestDaF</h2>
              <p className="text-slate-300 leading-relaxed">
                TestDaF is offered in two official examination formats depending on test center availability:
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-white font-bold text-base">
                    <Monitor className="w-5 h-5 text-blue-400" /> Digital TestDaF
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Administered on computers at licensed test centers. Includes on-screen tasks, digital typing for the writing section, and headset-recorded speaking responses.
                  </p>
                </div>
                <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-white font-bold text-base">
                    <FileText className="w-5 h-5 text-amber-400" /> Paper-Based TestDaF
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Conducted using printed question booklets and answer sheets, handwritten essays, and audio recordings delivered in an examination room setting.
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-3xl font-extrabold text-white">Building Your Language Pathway</h2>
              <p className="text-slate-300 leading-relaxed">
                Because TestDaF evaluates upper-intermediate to advanced proficiency (B2 to C1), candidates must first build a robust grammatical foundation and wide general vocabulary through systematic CEFR courses:
              </p>
              <div className="space-y-4">
                <Link href="/courses/german-b1" className="block p-5 bg-slate-900 border border-slate-800 hover:border-amber-500 rounded-2xl transition-colors group">
                  <h3 className="text-lg font-bold text-white group-hover:text-amber-400 flex items-center gap-2">German B1 Intermediate Course <ArrowRight className="w-4 h-4" /></h3>
                  <p className="text-sm text-slate-400 mt-1">Develop independent language fluency and essential complex grammar structures.</p>
                </Link>
                <Link href="/courses/german-b2" className="block p-5 bg-slate-900 border border-slate-800 hover:border-amber-500 rounded-2xl transition-colors group">
                  <h3 className="text-lg font-bold text-white group-hover:text-amber-400 flex items-center gap-2">German B2 Upper-Intermediate Course <ArrowRight className="w-4 h-4" /></h3>
                  <p className="text-sm text-slate-400 mt-1">Acquire the analytical reading, argumentative writing, and academic vocabulary required for TestDaF.</p>
                </Link>
                <div className="grid sm:grid-cols-2 gap-4 pt-2">
                  <Link href="/courses/german-a1" className="block p-4 bg-slate-900/60 border border-slate-800 hover:border-slate-700 rounded-xl transition-colors">
                    <span className="text-sm font-semibold text-white">German A1 (Beginner)</span>
                    <p className="text-xs text-slate-400 mt-0.5">Start from the fundamentals.</p>
                  </Link>
                  <Link href="/courses/german-a2" className="block p-4 bg-slate-900/60 border border-slate-800 hover:border-slate-700 rounded-xl transition-colors">
                    <span className="text-sm font-semibold text-white">German A2 (Elementary)</span>
                    <p className="text-xs text-slate-400 mt-0.5">Strengthen everyday communication.</p>
                  </Link>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-3xl font-extrabold text-white">Free Interactive Practice Tests</h2>
              <p className="text-slate-300 leading-relaxed">
                Assess your German proficiency step-by-step with our free interactive tests:
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <Link href="/practice-tests/german-a1" className="p-5 bg-slate-900 border border-slate-800 hover:border-amber-500 rounded-2xl transition-colors group block">
                  <h3 className="text-base font-bold text-white group-hover:text-amber-400 flex items-center justify-between">
                    German A1 Practice Test <ArrowRight className="w-4 h-4" />
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Beginner grammar and core vocabulary drills.</p>
                </Link>
                <Link href="/practice-tests/german-a2" className="p-5 bg-slate-900 border border-slate-800 hover:border-amber-500 rounded-2xl transition-colors group block">
                  <h3 className="text-base font-bold text-white group-hover:text-amber-400 flex items-center justify-between">
                    German A2 Practice Test <ArrowRight className="w-4 h-4" />
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Elementary sentence building and reading drills.</p>
                </Link>
                <Link href="/practice-tests/german-b1" className="p-5 bg-slate-900 border border-slate-800 hover:border-amber-500 rounded-2xl transition-colors group block">
                  <h3 className="text-base font-bold text-white group-hover:text-amber-400 flex items-center justify-between">
                    German B1 Practice Test <ArrowRight className="w-4 h-4" />
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Intermediate grammar and text comprehension.</p>
                </Link>
                <Link href="/practice-tests/german-b2" className="p-5 bg-slate-900 border border-slate-800 hover:border-amber-500 rounded-2xl transition-colors group block">
                  <h3 className="text-base font-bold text-white group-hover:text-amber-400 flex items-center justify-between">
                    German B2 Practice Test <ArrowRight className="w-4 h-4" />
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Upper-intermediate academic comprehension exercises.</p>
                </Link>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-3xl font-extrabold text-white">Recommended Preparation Strategy</h2>
              <ul className="space-y-4 text-slate-300">
                <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> <strong>Academic Reading:</strong> Train regularly with academic texts, scientific reports, and statistical descriptions.</li>
                <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> <strong>Graph Description Skills:</strong> Master the vocabulary required to analyze trends, percentages, and comparative datasets in the writing section.</li>
                <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> <strong>Structured Argumentation:</strong> Practice organizing formal academic essays with clear introduction, thesis, counter-arguments, and conclusion.</li>
                <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" /> <strong>Timed Delivery:</strong> Practice oral responses under strict time limits to build confidence for computer-delivered speaking tasks.</li>
              </ul>
            </section>

          </div>

          <div className="lg:col-span-1 space-y-8">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
              <h3 className="text-xl font-bold text-white">Official Information</h3>
              <p className="text-sm text-slate-300">
                For official registration periods, licensed test center directories, and test fee structures worldwide, please consult the official TestDaF portal.
              </p>
              <a href="https://www.testdaf.de" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-bold text-amber-400 hover:text-amber-300">
                Visit Official TestDaF Website <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
              <h3 className="text-xl font-bold text-white">Quick Links</h3>
              <div className="flex flex-col gap-3">
                <Link href="/courses/german-b2" className="text-sm text-slate-300 hover:text-amber-400 flex items-center gap-2">
                  <ArrowRight className="w-4 h-4" /> German B2 Course
                </Link>
                <Link href="/courses/german-b1" className="text-sm text-slate-300 hover:text-amber-400 flex items-center gap-2">
                  <ArrowRight className="w-4 h-4" /> German B1 Course
                </Link>
                <Link href="/practice-tests" className="text-sm text-slate-300 hover:text-amber-400 flex items-center gap-2">
                  <ArrowRight className="w-4 h-4" /> Practice Tests Hub
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
