import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  GraduationCap, 
  Users, 
  CheckCircle2, 
  ArrowRight, 
  Play, 
  Sparkles,
  Video,
  Laptop,
  MessageCircle,
  ShieldCheck
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { translations } from '../i18n/translations';
import { useGlobalContent } from '../context/GlobalContentContext';
import CertificateShowcase from '../components/CertificateShowcase';
import GoogleReviewsWidget from '../components/GoogleReviewsWidget';
import ExamLogosRow from '../components/ExamLogosRow';
import CourseCard from '../components/CourseCard';
import CourseBundles from '../components/CourseBundles';
import DemoClassBanner from '../components/DemoClassBanner';

export default function Home({ currentLang, setActiveTab, onOpenTrialModal, initialCourses = null, initialBundles = null }) {
  const t = translations[currentLang];
  const { settings } = useGlobalContent();
  const [courses, setCourses] = React.useState(initialCourses || []);
  const [loading, setLoading] = React.useState(initialCourses === null);

  React.useEffect(() => {
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

  const handleWhatsAppEnroll = (courseName = "German Language Course") => {
    const formattedPhone = settings?.whatsapp_number?.replace(/^0/, '92') || '923421189593';
    const msg = encodeURIComponent(`Hi, I want to enroll in ${courseName}. Please share payment details.`);
    window.open(`https://wa.me/${formattedPhone}?text=${msg}`, '_blank');
  };

  return (
    <div className="space-y-20 pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 bg-slate-950">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-amber-500/10 via-red-500/10 to-amber-500/5 blur-[120px] pointer-events-none rounded-full"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Text */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-amber-500/30 text-amber-400 text-xs font-bold shadow-lg">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t.hero.badge}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold text-white tracking-tight leading-tight">
                {currentLang === 'ur' ? (
                  <span className="font-urdu leading-loose">پاکستان کے کسی بھی شہر سے <span className="gold-gradient-text">100% آن لائن جرمن زبان</span> سیکھیں</span>
                ) : (
                  <>German Language Course in Pakistan — Learn German Online</>
                )}
              </h1>


              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <button
                  onClick={() => handleWhatsAppEnroll("German Learning School Courses")}
                  className="group relative w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-[15px] shadow-xl shadow-emerald-500/25 hover:shadow-2xl hover:shadow-emerald-500/40 transition-all duration-300 hover:scale-[1.03] active:scale-95 flex items-center justify-center gap-2.5 overflow-hidden whitespace-nowrap"
                >
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                  <MessageCircle className="w-5 h-5 fill-current shrink-0 relative z-10 animate-pulse group-hover:scale-110 transition-transform duration-300" />
                  <span className="relative z-10 tracking-wide">Enroll on WhatsApp</span>
                </button>

                <button
                  onClick={onOpenTrialModal}
                  className="group relative w-full sm:w-auto px-7 py-3.5 rounded-full text-slate-200 border-2 border-red-500/40 hover:border-red-500 hover:bg-gradient-to-r hover:from-red-600 hover:to-red-700 hover:text-white font-extrabold text-sm shadow-md shadow-red-500/10 hover:shadow-xl hover:shadow-red-500/30 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <Play className="w-4 h-4 text-red-500 group-hover:text-white fill-current group-hover:rotate-12 transition-transform duration-300 shrink-0" />
                  <span>{t.hero.ctaSecondary}</span>
                </button>
              </div>

              {/* Quick Key Highlights */}
              <div className="pt-6 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4 text-center sm:text-left">
                {t.hero.highlights.map((item, i) => (
                  <div key={item.label} className="bg-slate-900/50 sm:bg-transparent p-4 sm:p-0 rounded-2xl sm:rounded-none border border-slate-800/50 sm:border-none">
                    <div className={`text-3xl sm:text-2xl font-extrabold ${i === 1 ? 'text-amber-400' : 'text-white'}`}>{item.value}</div>
                    <div className="text-sm sm:text-xs text-slate-400 mt-1 sm:mt-0">{item.label}</div>
                  </div>
                ))}
              </div>

              <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl">
                {currentLang === 'ur' ? (
                  settings.hero_description || t.hero.desc
                ) : (
                  <>
                    Learn German online from anywhere in Pakistan. Whether you are preparing for studies or visas, our comprehensive <Link href="/courses" className="text-slate-200 font-semibold hover:text-amber-400 underline">German language course</Link> options deliver interactive <Link href="/howItWorks" className="text-slate-200 font-semibold hover:text-amber-400 underline">online German classes in Pakistan</Link> across <Link href="/courses" className="text-slate-200 font-semibold hover:text-amber-400 underline">A1, A2, B1, and B2 levels</Link>. Learn with certified teachers, targeted <Link href="/goethe-exam-preparation" className="text-slate-200 font-semibold hover:text-amber-400 underline">Goethe and telc exam preparation</Link>, free <Link href="/practice-tests" className="text-slate-200 font-semibold hover:text-amber-400 underline">German practice tests</Link>, and flexible batch timings.
                  </>
                )}
              </p>

            </div>

            {/* Right Hero Video / Image Mock Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl group">
                <Image
                  src="https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?auto=format&fit=crop&w=800&q=80"
                  alt="Students attending live online German language class in Pakistan"
                  width={800}
                  height={420}
                  priority
                  className="w-full h-[420px] object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <button 
                    onClick={onOpenTrialModal}
                    className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-lg shadow-red-500/40 hover:scale-110 transition duration-300 border border-red-400"
                  >
                    <Play className="w-7 h-7 fill-current ml-1" />
                  </button>
                </div>

                {/* Floating Accreditation Card */}
                <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-md p-3.5 rounded-xl border border-amber-500/30 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg">
                    💻
                  </div>
                  <div className="text-xs">
                    <div className="font-bold text-white">Live Zoom HD Classes + Recorded Vault</div>
                    <div className="text-slate-400">Flexibility for Pakistani Students & Professionals</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>



      {/* EXAM PREPARATION SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 text-center">
        <h2 className="text-3xl font-extrabold text-white mb-4">Goethe &amp; telc Exam Preparation in Pakistan</h2>
        <p className="text-slate-400 max-w-3xl mx-auto mb-6 leading-relaxed">
          Prepare for recognized German language certifications with structured practice for listening, reading, writing, and speaking. We provide targeted coaching for <Link href="/goethe-exam-preparation" className="text-amber-400 font-semibold hover:underline">Goethe Exam Preparation</Link>, <Link href="/telc-exam-preparation" className="text-emerald-400 font-semibold hover:underline">telc exam preparation</Link>, and <Link href="/testdaf-preparation" className="text-teal-400 font-semibold hover:underline">TestDaF Preparation</Link> to help our students from across Pakistan clear their exams on the first attempt.
        </p>
        <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 text-xs font-semibold">
          <Link href="/goethe-exam-preparation" className="text-amber-400 hover:underline">
            Goethe Exam Preparation (A1–B2) &rarr;
          </Link>
          <span className="text-slate-600 hidden sm:inline">&bull;</span>
          <Link href="/telc-exam-preparation" className="text-emerald-400 hover:underline">
            telc Exam Preparation &rarr;
          </Link>
          <span className="text-slate-600 hidden sm:inline">&bull;</span>
          <Link href="/testdaf-preparation" className="text-teal-400 hover:underline">
            TestDaF Preparation &rarr;
          </Link>
        </div>
      </section>
      <ExamLogosRow />

      {/* 2. COURSES LEVEL OVERVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 pt-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-2">Structured Online Curriculum</p>
            <h2 className="text-3xl font-extrabold text-white">German Language Courses &amp; Online Classes (A1–B2)</h2>
          </div>
          <div className="flex flex-col gap-3 md:items-end">
            <Link
              href="/courses"
              className="text-amber-400 text-xs font-bold flex items-center gap-1 hover:underline"
            >
              <span>View All Course Details &amp; Fees</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/goethe-exam-preparation"
              className="text-emerald-400 text-xs font-bold flex items-center gap-1 hover:underline"
            >
              <span>Goethe Exam Preparation</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <p className="text-sm sm:text-base text-slate-400 max-w-4xl leading-relaxed">
          Our online German language course program follows the structured CEFR roadmap from beginner to upper-intermediate levels (A1, A2, B1, and B2). All classes are conducted 100% live online via Zoom with recorded lecture access, <Link href="/goethe-exam-preparation" className="text-slate-200 font-semibold hover:text-amber-400 underline">Goethe and telc exam preparation</Link>, and flexible morning, evening, and weekend batches. Typical durations span 6–8 weeks for A1–A2 foundational levels and approximately 10–12 weeks for B1–B2 intermediate levels. Explore full <Link href="/courses" className="text-slate-200 font-semibold hover:text-amber-400 underline">course details and fees</Link> below.
        </p>

        {/* Quick Level Navigation Bar (Crawlable HTML Links) */}
        <div className="flex flex-wrap gap-2.5 sm:gap-3 items-center">
          <span className="text-xs text-slate-400 font-semibold mr-1">Browse by Level:</span>
          <Link
            href="/courses/german-a1"
            className="px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-slate-300 hover:text-amber-400 text-xs font-semibold transition"
          >
            German A1 Course
          </Link>
          <Link
            href="/courses/german-a2"
            className="px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-slate-300 hover:text-amber-400 text-xs font-semibold transition"
          >
            German A2 Course
          </Link>
          <Link
            href="/courses/german-b1"
            className="px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-slate-300 hover:text-amber-400 text-xs font-semibold transition"
          >
            German B1 Classes &amp; Course in Pakistan
          </Link>
          <Link
            href="/courses/german-b2"
            className="px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-slate-300 hover:text-amber-400 text-xs font-semibold transition"
          >
            German B2 Course
          </Link>
          <Link
            href="/german-a1-syllabus"
            className="px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-slate-300 hover:text-amber-400 text-xs font-semibold transition"
          >
            German A1 Syllabus
          </Link>
        </div>

        {/* Responsive Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            <div className="col-span-full text-center text-slate-400">Loading live batches...</div>
          ) : courses.map((course) => (
            <CourseCard
              key={course.id}
              course={{
                ...course,
                feesPKR: course.price,
                feesEUR: course.price,
                description: course.description || `Comprehensive German ${course.level} course.`,
                featuredBadge: course.badge || ''
              }}
              onEnroll={handleWhatsAppEnroll}
            />
          ))}
        </div>

        {/* DEDICATED COURSE BUNDLES SECTION */}
        <CourseBundles initialBundles={initialBundles} />
      </section>

      {/* WHY LEARN GERMAN ONLINE WITH US */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-white mb-4">Why Choose Our German Online Course in Pakistan</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Experience the most effective way to attend German classes from anywhere in Pakistan. Our <Link href="/about" className="text-amber-400 hover:underline font-semibold">online academy</Link> provides interactive live classes, native German curricula, and comprehensive exam coaching.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <Video className="w-8 h-8 text-emerald-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Live Zoom Classes</h3>
            <p className="text-slate-400 text-sm">Interactive, real-time sessions with our <Link href="/teachers" className="text-amber-400 hover:underline">expert faculty</Link>. Ask questions, practice speaking, and get instant feedback.</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <Laptop className="w-8 h-8 text-amber-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Recorded Lessons</h3>
            <p className="text-slate-400 text-sm">Missed a class? No problem. Get access to recorded lectures to revise at your own pace from anywhere in Pakistan.</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
            <GraduationCap className="w-8 h-8 text-red-500 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">A1–B2 Curriculum</h3>
            <p className="text-slate-400 text-sm">Follow a highly structured curriculum designed to take you from absolute beginner to advanced fluency efficiently.</p>
          </div>
        </div>
      </section>

      {/* FREE GERMAN LEARNING TOOLS & PRACTICE TESTS */}
      <section className="bg-slate-900/50 border-y border-slate-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-extrabold text-white mb-4">German Practice Tests &amp; Learning Resources</h2>
              <p className="text-slate-400 mb-6 leading-relaxed">
                Practice German vocabulary and grammar with our free online tools before or alongside your course. Test your skills with mock tests and enhance your preparation with interactive study resources.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/practice-tests" className="px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-white font-bold flex items-center gap-2 transition">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" /> German Practice Tests
                </Link>
                <Link href="/resources" className="px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-white font-bold flex items-center gap-2 transition">
                  <Sparkles className="w-5 h-5 text-amber-400" /> German Learning Resources
                </Link>
                <Link href="/translator" className="px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-white font-bold flex items-center gap-2 transition">
                  <MessageCircle className="w-5 h-5 text-teal-400" /> Free German Translator
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 text-center md:text-right space-y-3">
              <div>
                <Link href="/blog" className="inline-block text-amber-400 hover:text-amber-300 font-bold underline underline-offset-4">
                  Read our German Learning Blog &amp; Exam Tips &rarr;
                </Link>
              </div>
              <div>
                <Link href="/courses" className="inline-block text-slate-400 hover:text-white text-xs font-semibold">
                  Compare German Language Course Fees &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STUDENT SUCCESS / REVIEWS */}
      <section className="pt-16">
        <div className="text-center mb-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white mb-4">Student Reviews &amp; Success Stories</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Real exam certificates earned by our online students.
          </p>
        </div>
        
        {/* 3. REAL STUDENT CERTIFICATE SHOWCASE */}
        <CertificateShowcase />

        {/* 4. LIVE GOOGLE REVIEWS WIDGET */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <GoogleReviewsWidget />
        </div>

        {/* Short-form video reels removed: they were placeholder mock data
            (stock Unsplash photos, simulated playback), not real students.
            Re-add only with real, consented student videos. */}
      </section>

      {/* FREQUENTLY ASKED QUESTIONS (SEO) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-white mb-4">Frequently Asked Questions</h2>
          <Link href="/faq" className="text-amber-400 hover:underline text-sm font-bold">View all FAQs &rarr;</Link>
        </div>
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-2">How can I join a German language course online in Pakistan?</h3>
            <p className="text-slate-400 text-sm leading-relaxed">You can join our online German classes from Karachi, Lahore, Islamabad, or any city in Pakistan. We offer live interactive Zoom classes with certified instructors, class recordings, and personalized feedback.</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-2">Which levels are covered in your German classes?</h3>
            <p className="text-slate-400 text-sm leading-relaxed">We provide complete CEFR-aligned training: <Link href="/courses/german-a1" className="text-amber-400 hover:underline">German A1 Course</Link> (explore the complete <Link href="/german-a1-syllabus" className="text-amber-400 hover:underline">German A1 syllabus</Link>), <Link href="/courses/german-a2" className="text-amber-400 hover:underline">German A2 Course</Link>, <Link href="/courses/german-b1" className="text-amber-400 hover:underline">German B1 Course</Link>, and <Link href="/courses/german-b2" className="text-amber-400 hover:underline">German B2 Course</Link>.</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-2">Are the German classes live or recorded?</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Our primary focus is on live, interactive Zoom classes to ensure active speaking practice. We also provide recordings of these live classes so students can revise at any time.</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-2">Do you provide Goethe and telc exam preparation?</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Yes. Our curriculum includes dedicated practice sessions and mock tests for <Link href="/goethe-exam-preparation" className="text-amber-400 hover:underline">Goethe Exam Preparation</Link> and <Link href="/telc-exam-preparation" className="text-amber-400 hover:underline">telc exam preparation</Link>, backed by interactive <Link href="/practice-tests" className="text-amber-400 hover:underline">German practice tests</Link>.</p>
          </div>
        </div>
      </section>

      {/* 6. REUSABLE PREMIUM DARK DEMO CLASS BANNER */}
      <div className="pb-16">
        <h2 className="sr-only">Start Learning German Today</h2>
        <DemoClassBanner onOpenTrialModal={onOpenTrialModal} />
      </div>

    </div>
  );
}
