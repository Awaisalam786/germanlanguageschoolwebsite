import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { examBodyLogos } from '../mockData/seedData';

export default function ExamLogosRow() {
  return (
    <div className="bg-slate-900 border-y border-slate-800 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-6">
          <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
            Prepares You 100% For Official European Examination Standards
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2 sm:gap-4">
          {examBodyLogos.map((logo, idx) => (
            <div 
              key={idx}
              className="bg-slate-950 border border-slate-800 rounded-xl sm:rounded-2xl p-2 sm:p-4 text-center space-y-1 hover:border-amber-500/40 transition duration-300 shadow-md"
            >
              <div className="text-amber-400 font-extrabold text-[10px] sm:text-base tracking-tight flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
                <span className="leading-tight">{logo.name}</span>
              </div>
              <span className="text-[8px] sm:text-[10px] text-slate-400 block font-medium leading-tight">{logo.badge}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
