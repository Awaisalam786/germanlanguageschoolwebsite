'use client';

import React, { useEffect } from 'react';
import Script from 'next/script';
import { Star } from 'lucide-react';

export default function GoogleReviewsWidget() {
  // Ensure Elfsight widget re-initializes on client-side route transitions
  useEffect(() => {
    if (typeof window !== 'undefined' && window.elfsight) {
      try {
        if (typeof window.elfsight.initialize === 'function') {
          window.elfsight.initialize();
        }
      } catch {
        // Ignore initialization errors if script is still parsing
      }
    }
  }, []);

  return (
    <div className="w-full min-w-0">
      {/* Lazy-load Elfsight platform script only on the homepage */}
      <Script
        src="https://elfsightcdn.com/platform.js"
        strategy="lazyOnload"
      />

      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 sm:p-8 md:p-10 shadow-2xl relative min-w-0 overflow-hidden backdrop-blur-sm">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-1/4 w-80 h-40 bg-amber-500/5 blur-[80px] pointer-events-none rounded-full" />

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8 space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>Verified Student Feedback</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
            Google Reviews from Our Students
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Live reviews from students across Pakistan learning German online for study, work, and visa goals.
          </p>
        </div>

        {/* Elfsight Google Reviews Embed Container */}
        <div className="min-w-0 w-full overflow-hidden relative z-10">
          <div
            className="elfsight-app-163b6584-4ab0-4b8f-9ed3-52ea3d79c7a4"
            data-elfsight-app-lazy
          />
        </div>
      </div>
    </div>
  );
}
