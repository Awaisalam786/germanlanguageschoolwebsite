import React from 'react';
import { Star, Quote, Award, CheckCircle } from 'lucide-react';
import { initialTestimonials } from '../mockData/seedData';

export default function Testimonials({ currentLang, setActiveTab }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/30">
          Student Success Stories
        </span>
        <h1 className="text-4xl font-extrabold text-white">What Our Graduates Say</h1>
        <p className="text-sm text-slate-300">
          Discover how German Language School helped over 12,500 students land jobs, pass university entrance exams, and settle in Germany.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {initialTestimonials.map((t) => (
          <div 
            key={t.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-amber-500/40 transition duration-300 flex flex-col justify-between relative shadow-lg"
          >
            <Quote className="w-10 h-10 text-amber-500/10 absolute top-4 right-4" />
            
            <div className="space-y-4">
              <div className="flex items-center gap-1">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              <p className="text-xs text-slate-300 leading-relaxed italic">
                "{t.text}"
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-800 flex items-center gap-3">
              <img
                src={t.avatar}
                alt={t.name}
                className="w-12 h-12 rounded-full object-cover border border-amber-500/40 shrink-0"
              />
              <div className="text-xs">
                <div className="font-bold text-white">{t.name}</div>
                <div className="text-amber-400 font-medium">{t.role}</div>
                <div className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
                  <CheckCircle className="w-3 h-3 text-emerald-400" />
                  <span>{t.levelAchieved}</span>
                </div>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* CTA Box */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-8 text-center max-w-3xl mx-auto space-y-4">
        <h3 className="text-2xl font-bold text-white">Ready to Write Your German Success Story?</h3>
        <p className="text-xs text-slate-400">
          Join our upcoming batch and get 1-on-1 exam prep guidance from certified evaluators.
        </p>
        <button
          onClick={() => setActiveTab('enroll')}
          className="px-8 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-gold-glow transition hover:scale-105"
        >
          Enroll in Next Batch
        </button>
      </div>

    </div>
  );
}
