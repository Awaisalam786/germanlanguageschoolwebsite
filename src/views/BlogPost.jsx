'use client';

import React from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  ArrowLeft, 
  Tag, 
  ArrowRight, 
  BookOpen, 
  GraduationCap, 
  CheckSquare, 
  Compass 
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function BlogPost({ post, relatedPosts }) {
  if (!post) return null;

  // Determine contextual pathway links based on post title/slug/category
  const slug = post.slug.toLowerCase();
  const text = `${post.title} ${post.summary || ''} ${post.category || ''}`.toLowerCase();

  const isA1 = text.includes('a1') || slug.includes('a1');
  const isA2 = text.includes('a2') || slug.includes('a2');
  const isB1 = text.includes('b1') || slug.includes('b1');
  const isB2 = text.includes('b2') || slug.includes('b2');
  const isGoethe = text.includes('goethe') || slug.includes('goethe');
  const isTelc = text.includes('telc') || slug.includes('telc');
  const isTestdaf = text.includes('testdaf') || slug.includes('testdaf');

  return (
    <article className="pb-20">
      {/* Hero Section */}
      <div className="relative w-full h-[50vh] min-h-[400px]">
        {post.image ? (
          <Image
            src={post.image}
            alt={post.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-slate-900 border-b border-slate-800 flex items-center justify-center">
            <BookOpen className="w-20 h-20 text-slate-800" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent"></div>
        
        {/* Back Button */}
        <div className="absolute top-8 left-4 sm:left-8 z-10">
          <Link href="/blog" className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900/50 backdrop-blur-md border border-slate-700 rounded-full text-slate-300 hover:text-white hover:border-slate-500 transition text-xs font-bold shadow-lg">
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </div>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8 max-w-4xl mx-auto space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-extrabold text-[10px] uppercase tracking-wider">
              {post.category}
            </span>
            <div className="flex items-center gap-3 text-xs text-slate-300 font-medium">
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-amber-400" /> {new Date(post.created_at).toLocaleDateString()}</span>
              {post.read_time && <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-amber-400" /> {post.read_time}</span>}
              <span className="flex items-center gap-1"><User className="w-3.5 h-3.5 text-amber-400" /> {post.author || 'German Learning School Team'}</span>
            </div>
          </div>
          
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
            {post.title}
          </h1>
        </div>
      </div>

      {/* Main Content & Sidebar Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Article */}
          <div className="lg:col-span-8 space-y-8">
            <div 
              className="blog-content prose prose-invert prose-amber max-w-none prose-lg
                         prose-headings:font-extrabold prose-headings:text-white
                         prose-a:text-amber-400 hover:prose-a:text-amber-300
                         prose-img:rounded-2xl prose-img:border prose-img:border-slate-800
                         prose-p:text-slate-300 prose-p:leading-relaxed prose-li:text-slate-300"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="pt-6 border-t border-slate-800 flex flex-wrap items-center gap-2">
                <Tag className="w-4 h-4 text-slate-500 mr-2" />
                {post.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 text-xs font-bold hover:text-white hover:border-slate-700 transition">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Contextual Course & Exam Next Steps Callout */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
              <div className="flex items-center gap-2.5 text-amber-400 font-bold text-sm">
                <GraduationCap className="w-5 h-5" />
                <span>Recommended Next Steps &amp; Pathways</span>
              </div>
              <h2 className="text-xl font-bold text-white">Continue Your German Journey</h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Take the next practical step toward your study or work goals in Germany with our structured courses and free testing tools:
              </p>
              
              <div className="grid sm:grid-cols-2 gap-3 pt-2">
                {isA1 && (
                  <Link href="/courses/german-a1" className="p-3.5 bg-slate-950 border border-slate-800 hover:border-amber-500/40 rounded-xl transition flex items-center justify-between group">
                    <span className="text-xs font-bold text-white group-hover:text-amber-400">German A1 Online Course</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                  </Link>
                )}
                {isA1 && (
                  <Link href="/practice-tests/german-a1" className="p-3.5 bg-slate-950 border border-slate-800 hover:border-amber-500/40 rounded-xl transition flex items-center justify-between group">
                    <span className="text-xs font-bold text-white group-hover:text-amber-400">German A1 Practice Test</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                  </Link>
                )}
                {isA2 && (
                  <Link href="/courses/german-a2" className="p-3.5 bg-slate-950 border border-slate-800 hover:border-amber-500/40 rounded-xl transition flex items-center justify-between group">
                    <span className="text-xs font-bold text-white group-hover:text-amber-400">German A2 Online Course</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                  </Link>
                )}
                {isB1 && (
                  <Link href="/courses/german-b1" className="p-3.5 bg-slate-950 border border-slate-800 hover:border-amber-500/40 rounded-xl transition flex items-center justify-between group">
                    <span className="text-xs font-bold text-white group-hover:text-amber-400">German B1 Classes &amp; Course</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                  </Link>
                )}
                {isB2 && (
                  <Link href="/courses/german-b2" className="p-3.5 bg-slate-950 border border-slate-800 hover:border-amber-500/40 rounded-xl transition flex items-center justify-between group">
                    <span className="text-xs font-bold text-white group-hover:text-amber-400">German B2 Online Course</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                  </Link>
                )}
                {isGoethe && (
                  <Link href="/goethe-exam-preparation" className="p-3.5 bg-slate-950 border border-slate-800 hover:border-amber-500/40 rounded-xl transition flex items-center justify-between group">
                    <span className="text-xs font-bold text-white group-hover:text-amber-400">Goethe Exam Preparation</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                  </Link>
                )}
                {isTelc && (
                  <Link href="/telc-exam-preparation" className="p-3.5 bg-slate-950 border border-slate-800 hover:border-amber-500/40 rounded-xl transition flex items-center justify-between group">
                    <span className="text-xs font-bold text-white group-hover:text-amber-400">telc Exam Preparation in Pakistan</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                  </Link>
                )}
                {isTestdaf && (
                  <Link href="/testdaf-preparation" className="p-3.5 bg-slate-950 border border-slate-800 hover:border-amber-500/40 rounded-xl transition flex items-center justify-between group">
                    <span className="text-xs font-bold text-white group-hover:text-amber-400">TestDaF Preparation</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                  </Link>
                )}
                <Link href="/resources" className="p-3.5 bg-slate-950 border border-slate-800 hover:border-amber-500/40 rounded-xl transition flex items-center justify-between group">
                  <span className="text-xs font-bold text-white group-hover:text-amber-400">German Learning Resources</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                </Link>
                <Link href="/practice-tests" className="p-3.5 bg-slate-950 border border-slate-800 hover:border-amber-500/40 rounded-xl transition flex items-center justify-between group">
                  <span className="text-xs font-bold text-white group-hover:text-amber-400">Free Practice Tests Portal</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                </Link>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Related Posts & Resources */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sticky top-24 space-y-6">
              <div>
                <h2 className="text-lg font-extrabold text-white mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-amber-400" />
                  Related Articles
                </h2>
                
                <div className="space-y-4">
                  {relatedPosts && relatedPosts.length > 0 ? (
                    relatedPosts.map(rp => (
                      <Link href={`/blog/${rp.slug}`} key={rp.id} className="block group">
                        <div className="flex gap-3">
                          <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-slate-800 relative bg-slate-950">
                            {rp.image ? (
                              <Image src={rp.image} alt={rp.title} fill sizes="64px" className="object-cover group-hover:scale-110 transition duration-500" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <BookOpen className="w-5 h-5 text-slate-700" />
                              </div>
                            )}
                          </div>
                          <div className="space-y-1">
                            <h3 className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors leading-snug line-clamp-2">
                              {rp.title}
                            </h3>
                            <div className="text-[10px] text-slate-400">
                              {new Date(rp.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400">No related articles found.</p>
                  )}
                </div>
              </div>

              {/* Sidebar Quick Links to Core Learning Hubs */}
              <div className="pt-4 border-t border-slate-800 space-y-2 text-xs">
                <span className="font-bold text-slate-400 uppercase tracking-wider block mb-2">Core Learning Links</span>
                <Link href="/courses" className="flex items-center justify-between text-slate-300 hover:text-amber-400 py-1">
                  <span>German Courses Overview</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link href="/practice-tests" className="flex items-center justify-between text-slate-300 hover:text-amber-400 py-1">
                  <span>Free Practice Tests (A1–B2)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link href="/goethe-exam-preparation" className="flex items-center justify-between text-slate-300 hover:text-amber-400 py-1">
                  <span>Goethe Exam Preparation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link href="/resources" className="flex items-center justify-between text-slate-300 hover:text-amber-400 py-1">
                  <span>Free German Resources &amp; Tables</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <Link href="/blog" className="flex items-center justify-between text-xs font-bold text-amber-400 group">
                  <span>View All Articles</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </article>
  );
}
