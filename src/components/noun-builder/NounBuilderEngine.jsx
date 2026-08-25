"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { ChevronRight, ChevronLeft, Eye, CheckCircle, XCircle, Info, Lightbulb, Loader2 } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const NounBuilderEngine = () => {
  const [levelFilter, setLevelFilter] = useState('All');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [nouns, setNouns] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Results tracking (in-memory for demo, but eventually goes to db)
  const [results, setResults] = useState({});

  useEffect(() => {
    fetchNouns();
  }, []);

  const fetchNouns = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('noun_builder_nouns')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });
      
    if (!error && data) {
      // shuffle or just keep sorted
      setNouns(data);
    }
    setLoading(false);
  };

  const filteredNouns = useMemo(() => {
    if (levelFilter === 'All') return nouns;
    return nouns.filter(n => n.cefr_level === levelFilter);
  }, [levelFilter, nouns]);

  const handleFilterClick = (lvl) => {
    setLevelFilter(lvl);
    setCurrentIndex(0);
    setShowDetails(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  if (filteredNouns.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-slate-400">No nouns found for {levelFilter}. Ask your admin to add some!</p>
      </div>
    );
  }

  const currentNoun = filteredNouns[currentIndex];
  const progress = ((currentIndex + 1) / filteredNouns.length) * 100;
  
  const getArticleColor = (article) => {
    switch (article?.toLowerCase()) {
      case 'der': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'die': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'das': return 'text-green-500 bg-green-500/10 border-green-500/20';
      default: return 'text-slate-400 bg-slate-800 border-slate-700';
    }
  };

  const handleNext = () => {
    if (currentIndex < filteredNouns.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowDetails(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setShowDetails(false);
    }
  };

  const handleRecordResult = (status) => {
    setResults(prev => ({
      ...prev,
      [currentNoun.id]: status
    }));
    handleNext();
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 flex flex-col min-h-screen pt-24 font-sans text-slate-100">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-extrabold tracking-tight text-white">Noun Builder</h1>
        
        <div className="flex bg-slate-900 rounded-xl p-1 border border-slate-800">
          {['All', 'A1', 'A2', 'B1'].map(lvl => (
            <button
              key={lvl}
              onClick={() => handleFilterClick(lvl)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                levelFilter === lvl ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between text-xs font-semibold text-slate-400 mb-2">
          <span>Noun {currentIndex + 1} of {filteredNouns.length}</span>
          <span className="text-amber-500">{currentNoun.cefr_level}</span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
          <div 
            className="bg-amber-500 h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Main Flashcard */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Image Section */}
        <div className="relative h-48 sm:h-64 bg-slate-800 w-full overflow-hidden">
          {currentNoun.image_url ? (
            <img 
              src={currentNoun.image_url} 
              alt={currentNoun.english_meaning}
              className="w-full h-full object-cover opacity-80"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-500">
              No Image
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
        </div>

        {/* Noun Section */}
        <div className="px-6 sm:px-10 -mt-16 relative z-10 text-center pb-8">
          <div className="inline-flex flex-col items-center">
            <span className={`text-sm sm:text-base font-black uppercase tracking-widest px-4 py-1 rounded-full border mb-3 shadow-lg backdrop-blur-md ${getArticleColor(currentNoun.article)}`}>
              {currentNoun.article}
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight drop-shadow-md">
              {currentNoun.german_noun}
            </h2>
          </div>
        </div>

        {/* Details Section */}
        <div className="px-6 sm:px-10 pb-10 flex-1 flex flex-col justify-center">
          {!showDetails ? (
            <button 
              onClick={() => setShowDetails(true)}
              className="mx-auto flex items-center gap-2 py-3 px-8 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl transition-all shadow-md"
            >
              <Eye className="w-5 h-5" />
              Show Answer
            </button>
          ) : (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center">
                <p className="text-sm font-semibold tracking-wide text-slate-500 uppercase mb-1">Meaning</p>
                <p className="text-2xl font-bold text-emerald-400 capitalize">{currentNoun.english_meaning}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Plural</p>
                  <p className="text-lg font-bold text-slate-200">{currentNoun.plural || '-'}</p>
                </div>
                <div className="bg-blue-950/20 p-4 rounded-2xl border border-blue-900/30 flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-blue-400/70 uppercase mb-1">Memory Tip</p>
                    <p className="text-sm font-medium text-blue-200">{currentNoun.memory_tip || 'No memory tip provided.'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/30 p-5 rounded-2xl border border-slate-700/50">
                <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Example in Context</p>
                <p className="text-base sm:text-lg font-medium text-white mb-1 leading-snug">{currentNoun.example_sentence || '-'}</p>
                <p className="text-sm text-slate-400">{currentNoun.english_translation || '-'}</p>
              </div>

              {/* Assessment Buttons */}
              <div className="pt-4 flex items-center justify-center gap-4">
                <button 
                  onClick={() => handleRecordResult('needs_practice')}
                  className="flex-1 py-4 px-4 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-bold rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                  <XCircle className="w-5 h-5" /> Need Practice
                </button>
                <button 
                  onClick={() => handleRecordResult('known')}
                  className="flex-1 py-4 px-4 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                  <CheckCircle className="w-5 h-5" /> I Know It
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between mt-8">
        <button 
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="p-3 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="text-sm font-medium text-slate-500">
          Use the assessment buttons to advance
        </div>
        <button 
          onClick={handleNext}
          disabled={currentIndex === filteredNouns.length - 1}
          className="p-3 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

    </div>
  );
};

export default NounBuilderEngine;
