'use client';

import React from 'react';
import { Calendar, Clock, User, ArrowLeft, Tag, ArrowRight, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function BlogPost({ post, relatedPosts }) {
  if (!post) return null;

  return (
    <article className="pb-20">
      {/* Hero Section */}
      <div className="relative w-full h-[50vh] min-h-[400px]">
        {post.image ? (
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
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
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-amber-400" /> {post.read_time}</span>
              <span className="flex items-center gap-1"><User className="w-3.5 h-3.5 text-amber-400" /> {post.author}</span>
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
          <div className="lg:col-span-8">
            <div 
              className="prose prose-invert prose-amber max-w-none prose-lg
                         prose-headings:font-extrabold prose-headings:text-white
                         prose-a:text-amber-400 hover:prose-a:text-amber-300
                         prose-img:rounded-2xl prose-img:border prose-img:border-slate-800
                         prose-p:text-slate-300 prose-p:leading-relaxed prose-li:text-slate-300"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-slate-800 flex flex-wrap items-center gap-2">
                <Tag className="w-4 h-4 text-slate-500 mr-2" />
                {post.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 text-xs font-bold hover:text-white hover:border-slate-700 transition cursor-pointer">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Right Sidebar - Related Posts */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sticky top-24">
              <h3 className="text-lg font-extrabold text-white mb-6 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-400" />
                Related Articles
              </h3>
              
              <div className="space-y-6">
                {relatedPosts && relatedPosts.length > 0 ? (
                  relatedPosts.map(rp => (
                    <Link href={`/blog/${rp.slug}`} key={rp.id} className="block group">
                      <div className="flex gap-4">
                        <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-slate-800">
                          {rp.image ? (
                            <img src={rp.image} alt={rp.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                          ) : (
                            <div className="w-full h-full bg-slate-950 flex items-center justify-center">
                              <BookOpen className="w-6 h-6 text-slate-800" />
                            </div>
                          )}
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors leading-snug line-clamp-2">
                            {rp.title}
                          </h4>
                          <div className="text-[10px] text-slate-400 font-medium">
                            {new Date(rp.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-sm text-slate-400">No related articles found.</p>
                )}
              </div>
              
              <div className="mt-8 pt-6 border-t border-slate-800">
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
