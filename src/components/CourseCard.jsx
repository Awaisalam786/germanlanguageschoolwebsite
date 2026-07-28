import React from 'react';
import { Clock, Calendar, MessageCircle } from 'lucide-react';

export default function CourseCard({ course, onEnroll }) {
  return (
    <div
      onClick={() => onEnroll(course.title)}
      className="group relative bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between h-full shadow-xl hover:shadow-2xl hover:scale-[1.01] hover:-translate-y-1 cursor-pointer overflow-hidden"
    >
      <div className="space-y-4 flex flex-col flex-1">
        
        {/* Top Row: Clean Level Badge & Optional Subtle Feature Tag */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="px-3 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold">
            Level {course.level}
          </span>

          {course.featuredBadge && (
            <span className="px-2.5 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800 text-[11px] font-medium">
              {course.featuredBadge.replace(/[^a-zA-Z0-9\s&]/g, '').trim()}
            </span>
          )}
        </div>

        {/* Course Title */}
        <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors leading-snug">
          {course.title}
        </h3>

        {/* Short Description */}
        <p className="text-xs text-slate-300 leading-relaxed font-normal">
          {course.description}
        </p>

        {/* Duration & Flexible Live Batches Info */}
        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 flex flex-col justify-center gap-2 text-xs mt-auto min-h-[92px]">
          <div className="flex items-start justify-between gap-2 text-slate-300">
            <span className="flex items-center gap-1.5 text-slate-400 shrink-0">
              <Clock className="w-3.5 h-3.5 text-red-500 shrink-0" />
              <span>Duration:</span>
            </span>
            <span className="font-semibold text-white text-right">{course.duration}</span>
          </div>

          <div className="flex items-start justify-between gap-2 text-slate-300">
            <span className="flex items-center gap-1.5 text-slate-400 shrink-0">
              <Calendar className="w-3.5 h-3.5 text-red-500 shrink-0" />
              <span>Schedule:</span>
            </span>
            <span className="font-semibold text-amber-400 text-[11px] text-right">{course.schedule}</span>
          </div>
        </div>

      </div>

      {/* Card Footer: Stacked Tuition Fee & Single-Line Enroll Now Button */}
      <div className="pt-4 mt-5 border-t border-slate-800/80">
        
        <div className="flex items-center justify-between gap-3">
          
          {/* Vertical Stacked Fee Display (PKR top, EUR below) */}
          <div className="space-y-0.5 shrink-0">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Tuition Fee</span>
            <div className="text-lg font-extrabold text-amber-400 leading-none">
              {course.feesPKR}
            </div>
            <div className="text-xs font-medium text-slate-400">
              {course.feesEUR}
            </div>
          </div>

          {/* Single-Line "Enroll Now" Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEnroll(course.title);
            }}
            className="group/btn shrink-0 px-4 py-2.5 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-extrabold shadow-md shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/35 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-1.5 whitespace-nowrap"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-current shrink-0 animate-pulse group-hover/btn:scale-110 transition-transform duration-300" />
            <span className="whitespace-nowrap">Enroll Now</span>
          </button>

        </div>

      </div>

    </div>
  );
}
