import React from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';
import { Clock, Calendar, CheckCircle2, ArrowRight } from 'lucide-react';
import CourseLevelClientWrapper from './CourseLevelClientWrapper';
import { levelData } from '../lib/seoLevelData';
import SchemaMarkup from './SchemaMarkup';

export default async function CourseLevelPage({ level }) {
  // Fetch actual course data for this level
  const { data: courses } = await supabase
    .from('courses')
    .select('*')
    .eq('level', level);
    
  const course = courses?.[0] || null;
  const content = levelData[level];
  const pageUrl = `https://germanlearningschool.com/courses/german-${level.toLowerCase()}`;

  // Build Schemas
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://germanlearningschool.com/" },
      { "@type": "ListItem", "position": 2, "name": "Courses", "item": "https://germanlearningschool.com/courses" },
      { "@type": "ListItem", "position": 3, "name": `German ${level} Course`, "item": pageUrl }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": content.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  let courseSchema = null;
  if (course) {
    courseSchema = {
      "@context": "https://schema.org",
      "@type": "Course",
      "name": content.h1,
      "description": content.overview,
      "provider": {
        "@type": "Organization",
        "name": "German Learning School",
        "sameAs": "https://germanlearningschool.com"
      }
    };
    if (course.price) {
      courseSchema.offers = {
        "@type": "Offer",
        "price": course.price,
        "priceCurrency": "PKR",
        "category": "Paid"
      };
    }
  }

  return (
    <>
      <SchemaMarkup schema={breadcrumbSchema} />
      <SchemaMarkup schema={faqSchema} />
      {courseSchema && <SchemaMarkup schema={courseSchema} />}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Link href="/" className="hover:text-amber-400">Home</Link>
          <span>&rsaquo;</span>
          <Link href="/courses" className="hover:text-amber-400">Courses</Link>
          <span>&rsaquo;</span>
          <span className="text-slate-200">German {level} Course</span>
        </div>

        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="lg:w-2/3 space-y-6">
            <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/30">
              {level} Level - Official CEFR Standard
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
              {content.h1}
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed">
              {content.intro}
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/courses" className="text-sm font-bold text-slate-300 hover:text-white flex items-center gap-2 underline underline-offset-4">
                <ArrowRight className="w-4 h-4 text-amber-400" /> View All German Courses & Fees
              </Link>
              <Link href="/goethe-exam-preparation" className="text-sm font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-2 underline underline-offset-4 ml-4">
                <ArrowRight className="w-4 h-4 text-emerald-400" /> Goethe Exam Preparation Details
              </Link>
            </div>
          </div>

          <div className="lg:w-1/3 w-full">
            {course ? (
              <CourseLevelClientWrapper course={course} />
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center text-slate-400">
                Check the latest available batch schedule and fee details on our <Link href="/courses" className="text-amber-400 hover:underline">Courses page</Link>.
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            
            <section className="space-y-4">
              <h2 className="text-3xl font-extrabold text-white">Course Overview</h2>
              <p className="text-slate-300 leading-relaxed">{content.overview}</p>
            </section>

            <section className="space-y-6">
              <h2 className="text-3xl font-extrabold text-white">What You Will Learn</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {content.learningPoints.map((point, idx) => (
                  <div key={idx} className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span className="text-slate-300 text-sm">{point}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-3xl font-extrabold text-white">Course Format & Details</h2>
              <div className="space-y-4 text-slate-300 leading-relaxed">
                <p><strong>Format:</strong> 100% Live Online Zoom Classes</p>
                {course && <p><strong>Duration:</strong> {course.duration || 'Check current batch details'}</p>}
                {course && <p><strong>Schedule:</strong> {course.schedule || 'Check current batch details'}</p>}
                <p><strong>Recordings:</strong> Full access to class recordings for revision from anywhere in Pakistan.</p>
                <p><strong>Fees:</strong> {course ? `PKR ${course.price}` : 'Check the latest fee details on our Courses page.'}</p>
              </div>
            </section>
            
            <section className="space-y-4">
              <h2 className="text-3xl font-extrabold text-white">German Skills Covered</h2>
              <p className="text-slate-300 leading-relaxed">{content.skills}</p>
            </section>
            
            <section className="space-y-4">
              <h2 className="text-3xl font-extrabold text-white">Exam Preparation</h2>
              <p className="text-slate-300 leading-relaxed">{content.examPrep}</p>
            </section>

            <section className="space-y-6">
              <h2 className="text-3xl font-extrabold text-white">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {content.faqs.map((faq, idx) => (
                  <div key={idx} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                    <h3 className="text-lg font-bold text-white mb-2">{faq.q}</h3>
                    <p className="text-slate-400 text-sm">{faq.a}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="lg:col-span-1 space-y-8">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
              <h3 className="text-xl font-bold text-white">Why Learn With German Learning School</h3>
              <ul className="space-y-4 text-sm text-slate-300">
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" /> Experienced German Language Instructors</li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" /> Students learning German online across Pakistan</li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" /> Exam-focused preparation and structured practice</li>
                <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" /> Interactive Zoom Classes</li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-6 space-y-4 text-center">
              <h3 className="text-xl font-bold text-white">Continue Your Journey</h3>
              <p className="text-sm text-slate-400">Explore the next level or see all courses.</p>
              <div className="flex flex-col gap-3">
                <Link href="/courses" className="text-sm text-amber-400 hover:underline">All German Courses</Link>
                {level !== 'A1' && <Link href="/courses/german-a1" className="text-sm text-amber-400 hover:underline">German A1 Course</Link>}
                {level !== 'A2' && <Link href="/courses/german-a2" className="text-sm text-amber-400 hover:underline">German A2 Course</Link>}
                {level !== 'B1' && <Link href="/courses/german-b1" className="text-sm text-amber-400 hover:underline">German B1 Course</Link>}
                {level !== 'B2' && <Link href="/courses/german-b2" className="text-sm text-amber-400 hover:underline">German B2 Course</Link>}
              </div>
              
              <div className="pt-4 mt-4 border-t border-slate-700/50 flex flex-col gap-3">
                <Link href="/goethe-exam-preparation" className="text-sm text-slate-300 hover:text-white hover:underline">Goethe Exam Preparation</Link>
                <Link href="/practice-tests" className="text-sm text-slate-300 hover:text-white hover:underline">Take a Free Mock Test</Link>
                <Link href="/blog" className="text-sm text-slate-300 hover:text-white hover:underline">German Learning Blog</Link>
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
