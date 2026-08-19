'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Languages, CheckSquare, X, Zap, ChevronRight } from 'lucide-react';

export default function FreeGermanToolsWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const widgetRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (widgetRef.current && !widgetRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <div className="fixed z-[60] bottom-24 right-6 md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:right-0 flex flex-col items-end" ref={widgetRef}>
      
      {/* Collapsed Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Free German Tools"
        aria-expanded={isOpen}
        className={`
          flex items-center justify-center gap-2 font-bold shadow-2xl transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-amber-500
          ${isOpen ? 'translate-x-full opacity-0 pointer-events-none absolute' : 'translate-x-0 opacity-100 pointer-events-auto'}
          
          /* Mobile styling */
          bg-slate-900 border border-slate-700 hover:border-amber-500 text-white
          px-4 py-3 rounded-full md:rounded-none md:rounded-l-xl
          
          /* Desktop styling */
          md:py-6 md:px-3 md:flex-col
        `}
      >
        <Zap className="w-5 h-5 text-amber-500 fill-amber-500 group-hover:scale-110 transition-transform" />
        <span className="hidden md:block" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
          FREE GERMAN TOOLS
        </span>
        <span className="block md:hidden text-sm uppercase tracking-wider">
          Tools
        </span>
      </button>

      {/* Open Panel */}
      <div 
        className={`
          bg-slate-900 border border-slate-700 shadow-2xl rounded-2xl overflow-hidden transition-all duration-300 transform origin-bottom-right md:origin-right
          ${isOpen ? 'scale-100 opacity-100 pointer-events-auto translate-x-0' : 'scale-95 opacity-0 pointer-events-none translate-x-10 md:translate-x-20 absolute'}
          w-[calc(100vw-3rem)] max-w-[360px] md:mr-4
        `}
      >
        {/* Header */}
        <div className="bg-slate-950 p-5 border-b border-slate-800 relative">
          <button 
            onClick={() => setIsOpen(false)}
            aria-label="Close tools panel"
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
            <h3 className="font-extrabold text-white text-lg">Free German Tools</h3>
          </div>
          <p className="text-sm text-slate-400">Learn smarter with our free tools</p>
        </div>

        {/* Tools Content */}
        <div className="p-4 space-y-3 bg-slate-900">
          
          {/* Translator Card */}
          <Link 
            href="/translator"
            onClick={() => setIsOpen(false)}
            className="flex items-start gap-4 p-4 rounded-xl border border-slate-800 bg-slate-950/50 hover:bg-slate-800 hover:border-amber-500/50 transition-all group"
          >
            <div className="bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20 group-hover:bg-rose-500/20 transition-colors">
              <Languages className="w-6 h-6 text-rose-500" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-white text-base mb-1 group-hover:text-amber-400 transition-colors">German Translator</h4>
              <p className="text-xs text-slate-400 mb-2">Translate German instantly</p>
              <div className="flex items-center text-xs font-bold text-rose-400 group-hover:text-amber-500 transition-colors">
                Open Translator <ChevronRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Practice Tests Card */}
          <Link 
            href="/practice-tests"
            onClick={() => setIsOpen(false)}
            className="flex items-start gap-4 p-4 rounded-xl border border-slate-800 bg-slate-950/50 hover:bg-slate-800 hover:border-amber-500/50 transition-all group"
          >
            <div className="bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20 group-hover:bg-amber-500/20 transition-colors">
              <CheckSquare className="w-6 h-6 text-amber-500" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-white text-base mb-1 group-hover:text-amber-400 transition-colors">German Practice Tests</h4>
              <p className="text-xs text-slate-400 mb-2">Practice your German and test your skills</p>
              <div className="flex items-center text-xs font-bold text-amber-500 group-hover:text-amber-400 transition-colors">
                Start Practice <ChevronRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

        </div>
        
        {/* Footer */}
        <div className="bg-slate-950 p-3 text-center border-t border-slate-800">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">More learning tools coming soon...</p>
        </div>
      </div>

    </div>
  );
}
