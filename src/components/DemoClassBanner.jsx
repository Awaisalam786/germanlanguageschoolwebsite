import React from 'react';
import { Play, Sparkles, Video } from 'lucide-react';

export default function DemoClassBanner({ onOpenTrialModal }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-red-950/80 border border-slate-800/90 rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 backdrop-blur-xl group">
        
        {/* Subtle Background Lighting Accent */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-red-600/15 rounded-full blur-[90px] pointer-events-none group-hover:scale-110 transition-transform duration-700"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-amber-500/10 rounded-full blur-[90px] pointer-events-none"></div>

        <div className="space-y-4 z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 text-amber-400 border border-amber-500/30 text-xs font-extrabold shadow-sm">
            <Video className="w-3.5 h-3.5 text-red-500" />
            <span>100% Free Live Zoom Demo Class</span>
          </div>

          <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-snug">
            Test Our Live Interactive Classes Before Enrolling
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
            Join a 30-minute live demonstration session to see how our native German and Pakistani faculty explain German grammar using interactive smartboards.
          </p>
        </div>

        {/* Action CTA Button */}
        <button
          onClick={onOpenTrialModal}
          className="group/btn shrink-0 px-8 py-4 rounded-full bg-gradient-to-r from-red-600 via-red-700 to-red-600 hover:from-red-500 hover:to-red-600 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-red-500/25 hover:shadow-2xl hover:shadow-red-500/40 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2.5 whitespace-nowrap z-10 border border-red-500/40"
        >
          <Play className="w-4 h-4 text-white fill-current group-hover/btn:rotate-12 transition-transform duration-300 shrink-0" />
          <span className="whitespace-nowrap">Reserve Free Live Demo Seat</span>
        </button>

      </div>
    </section>
  );
}
