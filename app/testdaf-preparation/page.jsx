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
  Monitor, 
  FileText, 
  HelpCircle, 
  GraduationCap,
  AlertCircle 
} from 'lucide-react';
import SchemaMarkup from '../../src/components/SchemaMarkup';
import { withPageOpenGraph } from '../../src/lib/seo';

export const metadata = withPageOpenGraph({
  title: {
    absolute: 'TestDaF Preparation in Pakistan | German Learning School',
  },
  description: 'Prepare for the TestDaF exam in Pakistan with specialized academic German coaching. Master TDN 4 modules for direct admission to German public universities.',
  alternates: {
    canonical: '/testdaf-preparation',
  },
  openGraph: {
    title: 'TestDaF Preparation in Pakistan | German Learning School',
    description: 'Prepare for the TestDaF exam in Pakistan with specialized academic German coaching. Master TDN 4 modules for direct admission to German public universities.',
    url: 'https://germanlearningschool.com/testdaf-preparation',
    siteName: 'German Learning School',
    locale: 'en_PK',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TestDaF Preparation in Pakistan | German Learning School',
    description: 'Prepare for the TestDaF exam in Pakistan with specialized academic German coaching. Master TDN 4 modules for direct admission to German public universities.',
  },
});

const testdafFaqs = [
  {
    q: 'What is the TestDaF exam?',
    a: 'TestDaF (Test Deutsch als Fremdsprache) is an advanced academic language proficiency examination developed by the TestDaF-Institut. It is used internationally by universities and higher education institutions in Germany for admissions to German-taught degree programs.'
  },
  {
    q: 'What score is required for German university admission?',
    a: 'Achieving TDN 4 (TestDaF-Niveaustufe 4) in all four test sections (Reading, Listening, Writing, and Speaking) is the standard entrance requirement for unrestricted direct admission to most German universities.'
  },
  {
    q: 'What is the difference between Digital and Paper-based TestDaF?',
    a: 'Digital TestDaF is taken on computers at certified test centers with typed writing responses and headset-recorded speaking tasks. Paper-based TestDaF uses printed booklets, handwritten essays, and classroom audio delivery.'
  },
  {
    q: 'What German level do I need before starting TestDaF preparation?',
    a: 'You should have completed at least a certified German B2 level (or strong B1+) before beginning specialized TestDaF preparation, as the test assesses competencies between CEFR B2 and C1.'
  },
  {
    q: 'Is German Learning School an authorized TestDaF test center?',
    a: 'No. German Learning School is an independent preparatory coaching institute. We are not affiliated with, endorsed by, or an authorized examination center of TestDaF-Institut or g.a.s.t. e.V. Students register for official examinations through authorized testing centers.'
  },
  {
    q: 'How can I practice for TestDaF using your website?',
    a: 'You can test your foundational and upper-intermediate skills using our free online German B1 and B2 Practice Tests, or enroll in our live online B2 course to master academic argumentation, graph descriptions, and complex sentence structures.'
  }
];

export default function TestDaFPreparation() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://germanlearningschool.com/" },
      { "@type": "ListItem", "position": 2, "name": "TestDaF Preparation", "item": "https://germanlearningschool.com/testdaf-preparation" }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": testdafFaqs.map((faq) => ({
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
          <span className="text-slate-200 font-medium">TestDaF Preparation</span>
        </nav>

        {/* Hero Section */}
        <div className="relative rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-8 sm:p-12 shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="max-w-3xl space-y-6 relative z-10">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-extrabold border border-emerald-500/30">
              Independent Academic German Preparation
            </span>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
              TestDaF Preparation in Pakistan
            </h1>
            
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              Targeted academic German language preparation for Pakistani students planning to pursue university education in Germany. Strengthen your reading, listening, writing, and oral expression skills for the TestDaF examination.
            </p>
            
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs sm:text-sm text-amber-200/90 leading-relaxed flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong>Important Notice &amp; Disclaimer:</strong> German Learning School is an independent language preparation institute. We are not affiliated with, endorsed by, or an authorized examination center of TestDaF-Institut or the Society for Academic Study Preparation and Test Development (g.a.s.t. e.V.). For official examination schedules, registered test center locations in Pakistan, and test fees, please consult licensed test centers or the official TestDaF website.
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Link
                href="/courses/german-b2"
                className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm sm:text-base rounded-xl shadow-lg shadow-amber-500/20 hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <span>Enroll in German B2 Course</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/practice-tests/german-b2"
                className="px-6 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm rounded-xl border border-slate-700 hover:border-amber-500/40 transition-all flex items-center justify-center gap-2"
              >
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>Take German B2 Practice Test</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            
            {/* H2: TestDaF Preparation in Pakistan (Overview & Distinction) */}
            <section className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-4 shadow-xl">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">TestDaF Preparation in Pakistan</h2>
              <p className="text-slate-200 leading-relaxed text-sm sm:text-base">
                <strong className="text-white">Short answer:</strong> TestDaF is an academic German exam for applicants to degree programmes taught in German. Results are reported for each of its four sections, and TDN 4 in all four is the usual requirement for direct admission to most German universities. Start preparing once you are around B2 level, and register through a licensed TestDaF test centre.
              </p>
              <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                TestDaF (Test Deutsch als Fremdsprache) is a standardized academic language proficiency examination developed by the TestDaF-Institut. It is primarily designed for international applicants who intend to pursue degree programs taught in German at German higher education institutions (Universitäten and Fachhochschulen).
              </p>
              <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                To help university applicants navigate their German language pathway, we distinguish between standard language courses, academic preparation, diagnostic practice tests, and the official TestDaF examination:
              </p>
              <div className="grid sm:grid-cols-2 gap-4 pt-2 text-xs sm:text-sm">
                <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800">
                  <span className="font-bold text-amber-400 block mb-1">1. German Language Courses</span>
                  <p className="text-slate-400">Building core competence through CEFR B1 and B2 courses, covering grammar, active vocabulary, and debate fluency.</p>
                </div>
                <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800">
                  <span className="font-bold text-emerald-400 block mb-1">2. TestDaF Academic Coaching</span>
                  <p className="text-slate-400">Targeted instruction focusing on scientific texts, graph analysis, academic essay structures, and timed speaking responses.</p>
                </div>
                <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800">
                  <span className="font-bold text-blue-400 block mb-1">3. Online Practice Tests</span>
                  <p className="text-slate-400">Free online diagnostic quizzes on our site to evaluate your intermediate and upper-intermediate German mastery.</p>
                </div>
                <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800">
                  <span className="font-bold text-purple-400 block mb-1">4. Official TestDaF Exam</span>
                  <p className="text-slate-400">The formal standardized test administered exclusively by licensed test centers worldwide to evaluate TDN scoring.</p>
                </div>
              </div>
            </section>

            {/* H2: TestDaF Exam Format & TDN Levels */}
            <section className="space-y-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">TestDaF Exam Format &amp; TDN Levels</h2>
              <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                TestDaF scores are evaluated according to three standardized performance levels known as TestDaF-Niveaustufen (TDN), which correspond to CEFR levels B2 to C1:
              </p>
              
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">CEFR B2.1</div>
                  <h3 className="text-lg font-bold text-white">TDN 3</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Demonstrates moderate academic proficiency. Accepted by some universities for select foundation courses or conditional admission.
                  </p>
                </div>
                <div className="p-5 bg-slate-900 border border-amber-500/40 rounded-2xl space-y-2 bg-amber-500/5">
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
                    Indicates very advanced academic proficiency exceeding typical entrance requirements, ideal for law and medical studies.
                  </p>
                </div>
              </div>

              {/* Digital vs Paper-based */}
              <div className="pt-2">
                <h3 className="text-lg font-bold text-white mb-3">Digital vs. Paper-Based TestDaF</h3>
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
                      Conducted using printed question booklets, handwritten essays, and room audio broadcasts for the listening section.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* H2: Reading, Listening, Writing & Speaking */}
            <section className="space-y-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Reading, Listening, Writing &amp; Speaking (The 4 Academic Modules)</h2>
              <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                The examination tests four distinct academic language skills, each evaluated independently on the certificate:
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
                  <BookOpen className="w-8 h-8 text-emerald-400 mb-3" />
                  <h3 className="text-xl font-bold text-white mb-2">Leseverstehen (Reading)</h3>
                  <p className="text-xs sm:text-sm text-slate-400">Extracting explicit and implicit arguments from journalistic articles, university notices, and academic journal texts under tight time limits.</p>
                </div>
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
                  <Headset className="w-8 h-8 text-blue-400 mb-3" />
                  <h3 className="text-xl font-bold text-white mb-2">Hörverstehen (Listening)</h3>
                  <p className="text-xs sm:text-sm text-slate-400">Comprehending campus dialogue, academic counseling conversations, lectures, and expert interviews in university environments.</p>
                </div>
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
                  <Edit3 className="w-8 h-8 text-amber-400 mb-3" />
                  <h3 className="text-xl font-bold text-white mb-2">Schriftlicher Ausdruck (Writing)</h3>
                  <p className="text-xs sm:text-sm text-slate-400">Describing and interpreting structured diagrammatic data followed by developing a coherent, reasoned argumentative essay.</p>
                </div>
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
                  <Mic className="w-8 h-8 text-purple-400 mb-3" />
                  <h3 className="text-xl font-bold text-white mb-2">Mündlicher Ausdruck (Speaking)</h3>
                  <p className="text-xs sm:text-sm text-slate-400">Responding to simulated academic situations: presenting factual summaries, participating in discussions, and stating hypotheses.</p>
                </div>
              </div>
            </section>

            {/* H2: TestDaF Practice & Preparation Pathway */}
            <section className="space-y-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">TestDaF Practice &amp; Preparation Pathway</h2>
              <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                Because TestDaF evaluates upper-intermediate to advanced proficiency (B2 to C1), candidates must first build a robust grammatical foundation and wide general vocabulary through systematic CEFR courses:
              </p>
              
              <div className="space-y-4">
                <Link href="/courses/german-b2" className="block p-5 bg-slate-900 border border-slate-800 hover:border-amber-500 rounded-2xl transition-colors group">
                  <h3 className="text-lg font-bold text-white group-hover:text-amber-400 flex items-center justify-between">
                    <span>German B2 Course (Upper Intermediate)</span>
                    <ArrowRight className="w-5 h-5 text-amber-400" />
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Acquire the analytical reading, argumentative writing, and academic vocabulary required for TestDaF.
                  </p>
                </Link>

                <Link href="/courses/german-b1" className="block p-5 bg-slate-900 border border-slate-800 hover:border-amber-500 rounded-2xl transition-colors group">
                  <h3 className="text-lg font-bold text-white group-hover:text-amber-400 flex items-center justify-between">
                    <span>German B1 Course (Intermediate)</span>
                    <ArrowRight className="w-5 h-5 text-amber-400" />
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Develop independent language fluency and essential complex grammar structures before advancing to B2.
                  </p>
                </Link>

                <div className="grid sm:grid-cols-2 gap-4 pt-2">
                  <Link href="/practice-tests/german-b2" className="p-4 bg-slate-900 border border-slate-800 hover:border-amber-500 rounded-xl transition-colors block">
                    <span className="text-sm font-semibold text-white flex items-center justify-between">
                      <span>German B2 Practice Test</span>
                      <ArrowRight className="w-4 h-4 text-amber-400" />
                    </span>
                    <p className="text-xs text-slate-400 mt-1">Free online test for upper-intermediate grammar and reading.</p>
                  </Link>
                  <Link href="/practice-tests/german-b1" className="p-4 bg-slate-900 border border-slate-800 hover:border-amber-500 rounded-xl transition-colors block">
                    <span className="text-sm font-semibold text-white flex items-center justify-between">
                      <span>German B1 Practice Test</span>
                      <ArrowRight className="w-4 h-4 text-amber-400" />
                    </span>
                    <p className="text-xs text-slate-400 mt-1">Review complex clause connectors and passive voice.</p>
                  </Link>
                </div>
              </div>
            </section>

            {/* H2: How to Prepare */}
            <section className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">How to Prepare for the TestDaF Exam</h2>
              <ul className="space-y-4 text-slate-300 text-sm">
                <li className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong>Academic Reading Drills:</strong> Train regularly with academic texts, scientific reports, and statistical descriptions to build reading speed.
                  </div>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong>Graph Description Mastery:</strong> Master the vocabulary required to analyze trends, percentages, and comparative datasets in the writing section.
                  </div>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong>Structured Argumentation:</strong> Practice organizing formal academic essays with clear introduction, thesis statement, counter-arguments, and conclusion.
                  </div>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong>Timed Oral Delivery:</strong> Practice oral responses under strict time limits to build confidence for computer-delivered speaking tasks.
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
                {testdafFaqs.map((faq, idx) => (
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
                For official registration periods, licensed test center directories, and test fee structures worldwide, please consult the official TestDaF portal.
              </p>
              <a 
                href="https://www.testdaf.de" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-amber-400 hover:text-amber-300 pt-1"
              >
                <span>Visit Official TestDaF Portal</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-lg font-bold text-white">Related Guides &amp; Articles</h3>
              <div className="flex flex-col gap-2.5 text-xs sm:text-sm">
                <Link href="/blog/goethe-vs-telc-vs-testdaf-vs-osd-which-german-exam" className="text-slate-300 hover:text-amber-400 flex items-center justify-between py-1 border-b border-slate-800">
                  <span>Goethe vs telc vs TestDaF vs ÖSD</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                </Link>
                <Link href="/blog/documents-required-for-a-germany-student-work-visa-from-pakistan-complete-checklist" className="text-slate-300 hover:text-amber-400 flex items-center justify-between py-1 border-b border-slate-800">
                  <span>Germany Student Visa Checklist</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                </Link>
                <Link href="/blog/how-long-does-it-take-to-learn-german-from-a1-to-b2-a-realistic-timeline" className="text-slate-300 hover:text-amber-400 flex items-center justify-between py-1 border-b border-slate-800">
                  <span>German A1 to B2 Learning Timeline</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                </Link>
                <Link href="/blog/how-to-choose-the-best-german-language-school-in-pakistan-a-checklist" className="text-slate-300 hover:text-amber-400 flex items-center justify-between py-1">
                  <span>How to Choose a German School</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                </Link>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-lg font-bold text-white">Explore Related Resources</h3>
              <div className="flex flex-col gap-2.5 text-xs sm:text-sm">
                <Link href="/courses/german-b2" className="text-slate-300 hover:text-amber-400 flex items-center justify-between py-1 border-b border-slate-800">
                  <span>German B2 Course</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link href="/courses/german-b1" className="text-slate-300 hover:text-amber-400 flex items-center justify-between py-1 border-b border-slate-800">
                  <span>German B1 Course</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link href="/courses" className="text-slate-300 hover:text-amber-400 flex items-center justify-between py-1 border-b border-slate-800">
                  <span>All German Courses &amp; Fees</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link href="/goethe-exam-preparation" className="text-slate-300 hover:text-amber-400 flex items-center justify-between py-1 border-b border-slate-800">
                  <span>Goethe Exam Preparation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link href="/telc-exam-preparation" className="text-slate-300 hover:text-amber-400 flex items-center justify-between py-1 border-b border-slate-800">
                  <span>telc Exam Preparation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link href="/practice-tests" className="text-slate-300 hover:text-amber-400 flex items-center justify-between py-1 border-b border-slate-800">
                  <span>Practice Tests Hub</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link href="/resources" className="text-slate-300 hover:text-amber-400 flex items-center justify-between py-1">
                  <span>Free Learning Resources</span>
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
