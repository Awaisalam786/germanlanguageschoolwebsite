import React from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';
import { Clock, Calendar, CheckCircle2, ArrowRight, BookOpen, GraduationCap, ShieldCheck } from 'lucide-react';
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
  const content = levelData[level] || levelData['A1'];
  const pageUrl = `https://germanlearningschool.com/courses/german-${level.toLowerCase()}`;

  // Build BreadcrumbList Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://germanlearningschool.com/" },
      { "@type": "ListItem", "position": 2, "name": "Courses", "item": "https://germanlearningschool.com/courses" },
      { "@type": "ListItem", "position": 3, "name": `German ${level} Course`, "item": pageUrl }
    ]
  };

  // Build FAQPage Schema
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

  // Build Course Schema
  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": content.h1,
    "description": content.overview,
    "provider": {
      "@type": "Organization",
      "name": "German Learning School",
      "sameAs": "https://germanlearningschool.com"
    },
    ...(course?.price ? {
      "offers": {
        "@type": "Offer",
        "price": String(course.price).replace(/[^\d.]/g, ''),
        "priceCurrency": "PKR",
        "category": "Paid"
      }
    } : {})
  };

  return (
    <>
      <SchemaMarkup schema={breadcrumbSchema} />
      <SchemaMarkup schema={faqSchema} />
      <SchemaMarkup schema={courseSchema} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-slate-400">
          <Link href="/" className="hover:text-amber-400">Home</Link>
          <span>&rsaquo;</span>
          <Link href="/courses" className="hover:text-amber-400">Courses</Link>
          <span>&rsaquo;</span>
          <span className="text-slate-200">German {level} Course</span>
        </nav>

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
              <Link href="/goethe-exam-preparation" className="text-sm font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-2 underline underline-offset-4">
                <ArrowRight className="w-4 h-4 text-emerald-400" /> Goethe Exam Preparation Details
              </Link>
              <Link href={`/practice-tests/german-${level.toLowerCase()}`} className="text-sm font-bold text-amber-400 hover:text-amber-300 flex items-center gap-2 underline underline-offset-4">
                <ArrowRight className="w-4 h-4 text-amber-400" /> Free German {level} Practice Test
              </Link>
              {level === 'A1' && (
                <Link href="/german-a1-syllabus" className="text-sm font-bold text-amber-400 hover:text-amber-300 flex items-center gap-2 underline underline-offset-4">
                  <ArrowRight className="w-4 h-4 text-amber-400" /> German A1 Syllabus
                </Link>
              )}
            </div>
          </div>

          <div className="lg:w-1/3 w-full">
            {course ? (
              <CourseLevelClientWrapper course={course} />
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center text-slate-400 space-y-3">
                <p>New batches for German {level} are enrolling now.</p>
                <p>Check the latest available batch schedule and fee details on our <Link href="/courses" className="text-amber-400 hover:underline">Courses page</Link>.</p>
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
              <h2 className="text-3xl font-extrabold text-white">What You Will Learn (Syllabus & Topics)</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {content.learningPoints.map((point, idx) => (
                  <div key={idx} className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span className="text-slate-300 text-sm">{point}</span>
                  </div>
                ))}
              </div>
              {level === 'A1' && (
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <p className="text-xs sm:text-sm text-slate-300">
                    Review the full CEFR beginner curriculum including all 17 grammar topics, vocabulary lists, and exam requirements in our comprehensive guide.
                  </p>
                  <Link href="/german-a1-syllabus" className="shrink-0 text-xs sm:text-sm font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 underline underline-offset-4">
                    <span>German A1 syllabus</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </section>

            <section className="space-y-4">
              <h2 className="text-3xl font-extrabold text-white">Course Format, Schedule & Fees</h2>
              <div className="space-y-4 text-slate-300 leading-relaxed bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
                <p><strong>Format:</strong> 100% Live Online Zoom Classes with real-time teacher interaction.</p>
                {course && <p><strong>Duration:</strong> {course.duration || '6 to 8 weeks depending on batch'}</p>}
                {course && <p><strong>Schedule:</strong> {course.schedule || 'Evening and weekend batches available'}</p>}
                <p><strong>Class Recordings:</strong> Full recording access provided after each session for convenient revision anywhere in Pakistan.</p>
                <p><strong>Course Fee:</strong> {course ? (String(course.price).includes('PKR') || String(course.price).includes('₨') ? course.price : `PKR ${course.price}`) : 'Affordable pricing in PKR with installment options available. Check our Courses page for current batch fee.'}</p>
                <div className="pt-2">
                  <Link href="/courses" className="text-amber-400 hover:underline text-sm font-semibold inline-flex items-center gap-1">
                    Explore all course batch schedules and fees <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </section>
            
            <section className="space-y-4">
              <h2 className="text-3xl font-extrabold text-white">German Grammar & Skills Covered</h2>
              <p className="text-slate-300 leading-relaxed">{content.skills}</p>
            </section>
            
            <section className="space-y-4">
              <h2 className="text-3xl font-extrabold text-white">Goethe & telc Exam Preparation</h2>
              <p className="text-slate-300 leading-relaxed">{content.examPrep}</p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link href="/goethe-exam-preparation" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-400 hover:underline">
                  <GraduationCap className="w-4 h-4" /> Goethe Exam Preparation Details
                </Link>
                <Link href={`/practice-tests/german-${level.toLowerCase()}`} className="inline-flex items-center gap-2 text-sm font-semibold text-amber-400 hover:underline">
                  <BookOpen className="w-4 h-4" /> Take Free German {level} Practice Test
                </Link>
              </div>
            </section>

            {/* Helpful Level Resources & Study Guides */}
            <section className="space-y-4">
              <h2 className="text-3xl font-extrabold text-white">Helpful German {level} Study Guides &amp; Resources</h2>
              <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                Deepen your understanding of German {level} with our instructors' practical guides on syllabus benchmarks, timelines, and exam strategies:
              </p>
              <div className="space-y-3">
                {level === 'A1' && (
                  <>
                    <Link href="/german-a1-syllabus" className="p-4 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl transition flex items-center justify-between group block">
                      <div>
                        <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">German A1 Syllabus: Complete Course Guide</h3>
                        <p className="text-xs text-slate-400 mt-0.5">Complete breakdown of grammar rules and vocabulary domains tested in Goethe A1.</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-400 shrink-0 ml-4" />
                    </Link>
                    <Link href="/blog/learn-german-in-urdu" className="p-4 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl transition flex items-center justify-between group block">
                      <div>
                        <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">Learn German in Urdu: Beginner's Guide</h3>
                        <p className="text-xs text-slate-400 mt-0.5">Foundational German pronunciation, greetings, and basic grammar concepts.</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-400 shrink-0 ml-4" />
                    </Link>
                    <Link href="/blog/how-long-does-it-take-to-learn-german-from-a1-to-b2-a-realistic-timeline" className="p-4 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl transition flex items-center justify-between group block">
                      <div>
                        <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">How Long Does It Take to Learn German from A1 to B2?</h3>
                        <p className="text-xs text-slate-400 mt-0.5">Realistic hours, study expectations, and level-by-level benchmarks.</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-400 shrink-0 ml-4" />
                    </Link>
                  </>
                )}
                {level === 'A2' && (
                  <>
                    <Link href="/blog/how-long-does-it-take-to-learn-german-from-a1-to-b2-a-realistic-timeline" className="p-4 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl transition flex items-center justify-between group block">
                      <div>
                        <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">How Long Does It Take to Learn German from A1 to B2?</h3>
                        <p className="text-xs text-slate-400 mt-0.5">Hours and progression timeline for moving from A1 to intermediate levels.</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-400 shrink-0 ml-4" />
                    </Link>
                    <Link href="/blog/what-german-level-do-you-need-for-a-germany-work-visa-a1-to-c1-explained" className="p-4 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl transition flex items-center justify-between group block">
                      <div>
                        <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">What German Level Do You Need for a Germany Work Visa?</h3>
                        <p className="text-xs text-slate-400 mt-0.5">How A2 awards points toward Germany's Opportunity Card (Chancenkarte).</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-400 shrink-0 ml-4" />
                    </Link>
                    <Link href="/blog/goethe-vs-telc-which-german-exam-should-you-choose-in-pakistan" className="p-4 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl transition flex items-center justify-between group block">
                      <div>
                        <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">Goethe vs telc: Which German Exam Should You Choose in Pakistan?</h3>
                        <p className="text-xs text-slate-400 mt-0.5">Compare certificate recognition for visas and jobs.</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-400 shrink-0 ml-4" />
                    </Link>
                  </>
                )}
                {level === 'B1' && (
                  <>
                    <Link href="/blog/what-german-level-do-you-need-for-a-germany-work-visa-a1-to-c1-explained" className="p-4 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl transition flex items-center justify-between group block">
                      <div>
                        <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">What German Level Do You Need for a Germany Work Visa?</h3>
                        <p className="text-xs text-slate-400 mt-0.5">Why B1 is the key milestone for German vocational training (Ausbildung) and job seeker visas.</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-400 shrink-0 ml-4" />
                    </Link>
                    <Link href="/blog/documents-required-for-a-germany-student-work-visa-from-pakistan-complete-checklist" className="p-4 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl transition flex items-center justify-between group block">
                      <div>
                        <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">Germany Visa Documents Checklist for Pakistani Applicants</h3>
                        <p className="text-xs text-slate-400 mt-0.5">Language proof, block accounts, and consular appointment requirements.</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-400 shrink-0 ml-4" />
                    </Link>
                    <Link href="/blog/goethe-vs-telc-which-german-exam-should-you-choose-in-pakistan" className="p-4 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl transition flex items-center justify-between group block">
                      <div>
                        <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">Goethe vs telc: Which German Exam Should You Choose in Pakistan?</h3>
                        <p className="text-xs text-slate-400 mt-0.5">Exam formats and modular re-take policies for intermediate learners.</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-400 shrink-0 ml-4" />
                    </Link>
                  </>
                )}
                {level === 'B2' && (
                  <>
                    <Link href="/blog/telc-b2-medizin-the-medical-german-exam-pakistani-doctors-and-nurses-need-for-germany" className="p-4 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl transition flex items-center justify-between group block">
                      <div>
                        <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">telc B2 Medizin: The Medical German Exam for Doctors &amp; Nurses</h3>
                        <p className="text-xs text-slate-400 mt-0.5">How B2 German fits into medical Approbation and licensing in Germany.</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-400 shrink-0 ml-4" />
                    </Link>
                    <Link href="/blog/goethe-vs-telc-vs-testdaf-vs-osd-which-german-exam" className="p-4 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl transition flex items-center justify-between group block">
                      <div>
                        <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">Goethe vs telc vs TestDaF vs ÖSD: Which German Exam to Choose</h3>
                        <p className="text-xs text-slate-400 mt-0.5">Selecting the right upper-intermediate credential for direct university admission.</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-400 shrink-0 ml-4" />
                    </Link>
                  </>
                )}
              </div>
              <div className="pt-1">
                <Link href="/resources" className="text-xs sm:text-sm font-bold text-amber-400 hover:underline inline-flex items-center gap-1.5">
                  <span>Explore More Free German Grammar Cheat Sheets &amp; Vocabulary</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-3xl font-extrabold text-white">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {content.faqs.map((faq, idx) => (
                  <div key={idx} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                    <h3 className="text-lg font-bold text-white mb-2">{faq.q}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="lg:col-span-1 space-y-8">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
              <h3 className="text-xl font-bold text-white">Why Learn With German Learning School</h3>
              <ul className="space-y-4 text-sm text-slate-300">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
                  <span>Experienced German language instructors with proven track records</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
                  <span>Live online classes connecting students across Pakistan & abroad</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
                  <span>Curriculum fully aligned with Goethe-Institut and telc CEFR standards</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
                  <span>Exam-focused mock tests, speaking simulations, and personal feedback</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
                  <span>Recorded sessions and comprehensive digital study materials included</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-6 space-y-4">
              <h3 className="text-xl font-bold text-white text-center">Continue Your Journey</h3>
              <p className="text-sm text-slate-400 text-center">Explore other course levels or test your proficiency.</p>
              
              <div className="flex flex-col gap-2 pt-2">
                <Link href="/courses" className="text-sm text-amber-400 hover:underline font-semibold">
                  &bull; All German Courses Overview
                </Link>
                {level !== 'A1' && (
                  <Link href="/courses/german-a1" className="text-sm text-amber-400 hover:underline">
                    &bull; German A1 Course (Beginner)
                  </Link>
                )}
                {level !== 'A2' && (
                  <Link href="/courses/german-a2" className="text-sm text-amber-400 hover:underline">
                    &bull; German A2 Course (Elementary)
                  </Link>
                )}
                {level !== 'B1' && (
                  <Link href="/courses/german-b1" className="text-sm text-amber-400 hover:underline">
                    &bull; German B1 Course (Intermediate)
                  </Link>
                )}
                {level !== 'B2' && (
                  <Link href="/courses/german-b2" className="text-sm text-amber-400 hover:underline">
                    &bull; German B2 Course (Upper Intermediate)
                  </Link>
                )}
              </div>
              
              <div className="pt-4 mt-4 border-t border-slate-700/50 flex flex-col gap-2">
                <span className="text-xs uppercase font-bold tracking-wider text-slate-400">Exam & Practice Resources</span>
                <Link href={`/practice-tests/german-${level.toLowerCase()}`} className="text-sm text-emerald-400 hover:underline">
                  &bull; German {level} Practice Test
                </Link>
                <Link href="/goethe-exam-preparation" className="text-sm text-slate-300 hover:text-white hover:underline">
                  &bull; Goethe Exam Preparation
                </Link>
                <Link href="/telc-exam-preparation" className="text-sm text-slate-300 hover:text-white hover:underline">
                  &bull; telc Exam Preparation
                </Link>
                <Link href="/testdaf-preparation" className="text-sm text-slate-300 hover:text-white hover:underline">
                  &bull; TestDaF Preparation
                </Link>
                <Link href="/practice-tests" className="text-sm text-slate-300 hover:text-white hover:underline">
                  &bull; All German Practice Tests
                </Link>
                <Link href="/resources" className="text-sm text-slate-300 hover:text-white hover:underline">
                  &bull; Free Learning Resources &amp; Tables
                </Link>
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
