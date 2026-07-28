import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Search, MessageCircle } from 'lucide-react';
import { initialFaqs } from '../mockData/seedData';
import { translations } from '../i18n/translations';

export default function FAQ({ currentLang, setActiveTab }) {
  const t = translations[currentLang];
  const [openIdx, setOpenIdx] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFaqs = initialFaqs.filter(faq => 
    faq.q.toLowerCase().includes(searchTerm.toLowerCase()) || 
    faq.a.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      <div className="text-center space-y-3">
        <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/30">
          Got Questions?
        </span>
        <h1 className="text-4xl font-extrabold text-white">Frequently Asked Questions</h1>
        <p className="text-sm text-slate-300">
          Everything you need to know about Goethe certifications, course schedules, tuition, and visa guidance.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
        <input
          type="text"
          placeholder="Search questions about Goethe exams, fees, or visas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-xs text-white focus:outline-none focus:border-amber-500 shadow-xl"
        />
      </div>

      {/* Accordion List */}
      <div className="space-y-4">
        {filteredFaqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div 
              key={idx}
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition-all duration-200"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-white hover:text-amber-400"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-amber-400 shrink-0" />
                  <span>{faq.q}</span>
                </div>
                {isOpen ? <ChevronUp className="w-5 h-5 text-amber-400 shrink-0" /> : <ChevronDown className="w-5 h-5 text-slate-500 shrink-0" />}
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs text-slate-300 border-t border-slate-800/80 leading-relaxed space-y-2">
                  <span className="inline-block px-2 py-0.5 rounded bg-slate-950 text-amber-400 text-[10px] font-bold border border-slate-800">
                    Category: {faq.category}
                  </span>
                  <p>{faq.a}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Still Have Questions Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center space-y-3">
        <h3 className="text-base font-bold text-white">Still Have Unanswered Questions?</h3>
        <p className="text-xs text-slate-400">Our academic counselors are available on WhatsApp for instant assistance.</p>
        <button
          onClick={() => setActiveTab('contact')}
          className="px-6 py-2.5 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs shadow-gold-glow hover:bg-amber-400 transition"
        >
          Contact Support Team
        </button>
      </div>

    </div>
  );
}
