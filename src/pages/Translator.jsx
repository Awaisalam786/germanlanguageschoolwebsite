import React from 'react';
import { Languages, Info, ArrowLeft, ExternalLink } from 'lucide-react';

export default function Translator({ setActiveTab }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-12 min-h-[85vh] flex flex-col justify-center items-center relative">
      
      {/* Back Button */}
      <div className="absolute top-8 left-4 sm:left-6 lg:left-8">
        <button
          onClick={() => setActiveTab('home')}
          className="group flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-red-600/90 text-slate-300 hover:text-white rounded-xl text-sm font-bold transition-all duration-300 border border-slate-700 hover:border-red-500 shadow-md"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Website
        </button>
      </div>

      <div className="text-center max-w-3xl mx-auto space-y-6">
        <div className="flex justify-center animate-fade-in-up">
          <span className="px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-sm font-bold border border-amber-500/30 inline-flex items-center gap-2">
            <Languages className="w-4 h-4" />
            Powered by Lese Lampe Translator
          </span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          Free German <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-500">Translator Tool</span>
        </h1>
        
        <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          Translate text quickly and seamlessly using our dedicated external tool. Perfect for quick lookups, reading German literature, and accelerating your learning journey.
        </p>
      </div>

      <div className="flex justify-center animate-fade-in-up" style={{ animationDelay: '300ms' }}>
        <a 
          href="https://lese-lampe-translator.vercel.app/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="group relative inline-flex items-center justify-center gap-3 px-8 py-5 text-lg font-bold text-white transition-all duration-300 bg-gradient-to-r from-red-600 to-amber-600 rounded-2xl hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(239,68,68,0.7)] focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-900"
        >
          <span>Open Translator Tool</span>
          <ExternalLink className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/20"></div>
        </a>
      </div>
      
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 flex items-start gap-4 max-w-2xl mx-auto mt-12 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
        <Info className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
        <p className="text-sm text-slate-400 leading-relaxed">
          Note: This external translator opens in a secure new tab to guarantee full functionality. It is provided as a free tool for our students. For professional translation services or certified document translation (e.g., for visa applications), please contact our administrative office.
        </p>
      </div>
    </div>
  );
}
