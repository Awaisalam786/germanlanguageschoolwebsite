import React from 'react';
import { ArrowLeft, Calendar, Clock, User, Share2, Tag } from 'lucide-react';

export default function BlogPostDetail({ post, onBack }) {
  if (!post) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 bg-slate-900 px-4 py-2 rounded-xl border border-slate-800 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Blog Articles</span>
      </button>

      <div className="space-y-4">
        <span className="px-3 py-1 rounded-md bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/30">
          {post.category}
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
          {post.title}
        </h1>

        <div className="flex items-center gap-4 text-xs text-slate-400 pb-4 border-b border-slate-800">
          <span className="flex items-center gap-1.5 text-white font-semibold">
            <User className="w-4 h-4 text-amber-400" />
            <span>{post.author}</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-amber-400" />
            <span>{post.date}</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>{post.readTime}</span>
          </span>
        </div>
      </div>

      <img
        src={post.image}
        alt={post.title}
        className="w-full h-80 object-cover rounded-2xl border border-slate-800 shadow-2xl"
      />

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6 text-slate-300 text-sm leading-relaxed">
        <div className="text-base font-semibold text-amber-400 bg-slate-950 p-4 rounded-xl border border-slate-800">
          {post.summary}
        </div>
        <div className="whitespace-pre-line space-y-4">
          {post.content}
        </div>
      </div>

    </div>
  );
}
