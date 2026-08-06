import React from 'react';
import { 
  GraduationCap, 
  Users, 
  CheckCircle2, 
  ArrowRight, 
  Star, 
  Play, 
  Sparkles,
  Video,
  Laptop,
  MessageCircle,
  ShieldCheck
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { translations } from '../i18n/translations';
import CertificateShowcase from '../components/CertificateShowcase';
import GoogleReviewsWidget from '../components/GoogleReviewsWidget';
import VideoTestimonialsReels from '../components/VideoTestimonialsReels';
import ExamLogosRow from '../components/ExamLogosRow';
import CourseCard from '../components/CourseCard';
import CourseBundles from '../components/CourseBundles';
import DemoClassBanner from '../components/DemoClassBanner';

export default function Home({ currentLang, setActiveTab, onOpenTrialModal }) {
  const t = translations[currentLang];
  const [courses, setCourses] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
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
  }, []);

  const handleWhatsAppEnroll = (courseName = "German Language Course") => {
    const msg = encodeURIComponent(`Hi, I want to enroll in ${courseName}. Please share payment details.`);
    window.open(`https://wa.me/923421189593?text=${msg}`, '_blank');
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
                  <>Learn German <span className="gold-gradient-text">100% Online</span> from Anywhere in Pakistan</>
                )}
              </h1>


              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <button
                  onClick={() => handleWhatsAppEnroll("German Language Course")}
                  className="group relative w-full sm:w-auto px-7 py-3.5 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-emerald-500/25 hover:shadow-2xl hover:shadow-emerald-500/40 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2.5 whitespace-nowrap"
                >
                  <MessageCircle className="w-5 h-5 fill-current shrink-0 animate-pulse group-hover:scale-110 transition-transform duration-300" />
                  <span>Enroll on WhatsApp (03421189593)</span>
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
                <div className="bg-slate-900/50 sm:bg-transparent p-4 sm:p-0 rounded-2xl sm:rounded-none border border-slate-800/50 sm:border-none">
                  <div className="text-3xl sm:text-2xl font-extrabold text-white">{t.hero.statStudents}</div>
                  <div className="text-sm sm:text-xs text-slate-400 mt-1 sm:mt-0">{t.hero.statStudentsLabel}</div>
                </div>
                <div className="bg-slate-900/50 sm:bg-transparent p-4 sm:p-0 rounded-2xl sm:rounded-none border border-slate-800/50 sm:border-none">
                  <div className="text-3xl sm:text-2xl font-extrabold text-amber-400">{t.hero.statPassRate}</div>
                  <div className="text-sm sm:text-xs text-slate-400 mt-1 sm:mt-0">{t.hero.statPassRateLabel}</div>
                </div>
                <div className="bg-slate-900/50 sm:bg-transparent p-4 sm:p-0 rounded-2xl sm:rounded-none border border-slate-800/50 sm:border-none">
                  <div className="text-3xl sm:text-2xl font-extrabold text-white flex items-center justify-center sm:justify-start gap-1">
                    <span>{t.hero.statRating}</span>
                    <Star className="w-5 h-5 sm:w-4 sm:h-4 fill-amber-400 text-amber-400 inline" />
                  </div>
                  <div className="text-sm sm:text-xs text-slate-400 mt-1 sm:mt-0">{t.hero.statRatingLabel}</div>
                </div>
              </div>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl pt-4">
                {t.hero.desc}
              </p>

            </div>

            {/* Right Hero Video / Image Mock Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl group">
                <img
                  src="https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?auto=format&fit=crop&w=800&q=80"
                  alt="Pakistani Students in Live Zoom German Class"
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



      {/* EXAM BODY CREDIBILITY LOGOS ROW */}
      <ExamLogosRow />

      {/* 2. COURSES LEVEL OVERVIEW (ALL 4 CEFR LEVELS: A1 TO B2 IN A SINGLE ROW OF 4 COLS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-2">Structured Online Curriculum</h2>
            <h3 className="text-3xl font-extrabold text-white">German Language Levels (A1 to B2)</h3>
          </div>
          <button
            onClick={() => setActiveTab('courses')}
            className="text-amber-400 text-xs font-bold flex items-center gap-1 hover:underline"
          >
            <span>View All Course Details</span>
            <ArrowRight className="w-4 h-4" />
          </button>
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
        <CourseBundles />

      </section>

      {/* 3. REAL STUDENT CERTIFICATE SHOWCASE */}
      <CertificateShowcase />

      {/* 4. LIVE GOOGLE REVIEWS WIDGET */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <GoogleReviewsWidget />
      </section>

      {/* 5. SHORT-FORM VIDEO REELS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <VideoTestimonialsReels />
      </section>

      {/* 6. REUSABLE PREMIUM DARK DEMO CLASS BANNER */}
      <DemoClassBanner onOpenTrialModal={onOpenTrialModal} />

    </div>
  );
}
