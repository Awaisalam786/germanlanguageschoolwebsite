"use client";

import React, { useState, useEffect, useMemo } from 'react';
import {
  ChevronRight, ChevronLeft, Eye, CheckCircle, XCircle, Lightbulb, Loader2,
  Volume2, ImageOff, Trophy, RotateCcw, Sparkles, BookOpen, X
} from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

const CEFR_ORDER = ['A1', 'A2', 'B1', 'B2', 'C1'];

const ARTICLE_STYLES = {
  der: {
    pill: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
    imageFallback: 'from-blue-950/60 via-slate-900 to-slate-900',
  },
  die: {
    pill: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
    imageFallback: 'from-rose-950/60 via-slate-900 to-slate-900',
  },
  das: {
    pill: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    imageFallback: 'from-emerald-950/60 via-slate-900 to-slate-900',
  },
};

const NounBuilderEngine = () => {
  const [levelFilter, setLevelFilter] = useState('All');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [nouns, setNouns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // When set, only these noun IDs are shown (used by "Practice the tricky ones")
  const [practiceOnlyIds, setPracticeOnlyIds] = useState(null);

  // Results tracking (in-memory for the session, eventually goes to db)
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
      // Shuffle so the deck doesn't feel identical on every visit
      const shuffled = [...data];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      setNouns(shuffled);
    }
    setLoading(false);
  };

  const availableLevels = useMemo(() => {
    const present = new Set(nouns.map(n => n.cefr_level));
    return CEFR_ORDER.filter(lvl => present.has(lvl));
  }, [nouns]);

  const filteredNouns = useMemo(() => {
    let list = nouns;
    if (levelFilter !== 'All') list = list.filter(n => n.cefr_level === levelFilter);
    if (practiceOnlyIds) list = list.filter(n => practiceOnlyIds.includes(n.id));
    return list;
  }, [levelFilter, nouns, practiceOnlyIds]);

  const sessionStats = useMemo(() => {
    let known = 0, needsPractice = 0;
    filteredNouns.forEach(n => {
      if (results[n.id] === 'known') known += 1;
      else if (results[n.id] === 'needs_practice') needsPractice += 1;
    });
    return { known, needsPractice };
  }, [filteredNouns, results]);

  const currentNoun = filteredNouns[currentIndex];
  const isComplete = filteredNouns.length > 0 && currentIndex >= filteredNouns.length;
  const progress = filteredNouns.length > 0
    ? (Math.min(currentIndex + 1, filteredNouns.length) / filteredNouns.length) * 100
    : 0;

  const getArticleStyle = (article) => ARTICLE_STYLES[article?.toLowerCase()] || {
    pill: 'text-slate-400 bg-slate-800 border-slate-700',
    imageFallback: 'from-slate-800 via-slate-900 to-slate-900',
  };

  const handleFilterClick = (lvl) => {
    setLevelFilter(lvl);
    setCurrentIndex(0);
    setShowDetails(false);
    setPracticeOnlyIds(null);
  };

  const handleClearPracticeOnly = () => {
    setPracticeOnlyIds(null);
    setCurrentIndex(0);
    setShowDetails(false);
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
    setResults(prev => ({ ...prev, [currentNoun.id]: status }));
    setCurrentIndex(prev => prev + 1);
    setShowDetails(false);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setShowDetails(false);
    setResults(prev => {
      const next = { ...prev };
      filteredNouns.forEach(n => delete next[n.id]);
      return next;
    });
  };

  const handlePracticeWeak = () => {
    const weakIds = filteredNouns.filter(n => results[n.id] === 'needs_practice').map(n => n.id);
    if (weakIds.length === 0) return;
    setPracticeOnlyIds(weakIds);
    setCurrentIndex(0);
    setShowDetails(false);
  };

  const playPronunciation = () => {
    if (!currentNoun || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(`${currentNoun.article} ${currentNoun.german_noun}`);
    utterance.lang = 'de-DE';
    utterance.rate = 0.85;
    setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  // Reset the image loading state whenever the visible noun changes
  useEffect(() => {
    setImgLoaded(false);
  }, [currentNoun?.id]);

  // Keyboard shortcuts: Space reveals the answer, arrows browse cards
  useEffect(() => {
    const onKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName) || isComplete) return;
      if (e.code === 'Space') {
        e.preventDefault();
        setShowDetails(prev => !prev);
      } else if (e.key === 'ArrowRight') {
        setCurrentIndex(prev => (prev < filteredNouns.length - 1 ? prev + 1 : prev));
        setShowDetails(false);
      } else if (e.key === 'ArrowLeft') {
        setCurrentIndex(prev => (prev > 0 ? prev - 1 : prev));
        setShowDetails(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [filteredNouns.length, isComplete]);

  // The deck loads on the client, so the server-rendered HTML is the loading
  // state. Keep the page's single H1 present in every state (visually hidden
  // while loading / empty) so crawlers and screen readers always get it.
  const pageHeading = 'German Noun Builder';

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <h1 className="sr-only">{pageHeading}</h1>
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
        <p className="text-sm text-slate-500 font-medium">Loading nouns...</p>
      </div>
    );
  }

  if (nouns.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h1 className="sr-only">{pageHeading}</h1>
        <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-4">
          <BookOpen className="w-7 h-7 text-slate-600" />
        </div>
        <p className="text-slate-400 max-w-sm">No nouns have been added yet. Check back soon!</p>
      </div>
    );
  }

  const articleStyle = currentNoun ? getArticleStyle(currentNoun.article) : null;

  return (
    <div className="w-full max-w-2xl mx-auto p-4 flex flex-col min-h-screen pt-24 font-sans text-slate-100">

      {/* Header & Controls */}
      <div className="relative overflow-hidden bg-slate-900 border border-slate-800 rounded-3xl p-6 mb-6 shadow-xl">
        <div className="absolute top-0 right-0 w-56 h-56 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-blue-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white">{pageHeading}</h1>
            <p className="text-sm text-slate-400 mt-1">Master German nouns and their articles &mdash; der, die, das.</p>
          </div>

          <div className="flex flex-wrap bg-slate-950/60 rounded-xl p-1 border border-slate-800 gap-1">
            {['All', ...availableLevels].map(lvl => (
              <button
                key={lvl}
                onClick={() => handleFilterClick(lvl)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  levelFilter === lvl
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {practiceOnlyIds && (
        <div className="flex items-center justify-between gap-3 mb-4 px-4 py-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-sm">
          <span className="flex items-center gap-2 text-amber-300 font-medium">
            <Sparkles className="w-4 h-4" /> Practicing your tricky words only
          </span>
          <button onClick={handleClearPracticeOnly} className="text-amber-300/70 hover:text-amber-200 transition" title="Back to full deck">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {filteredNouns.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center px-4">
          <p className="text-slate-400">No nouns found for {levelFilter}. Ask your admin to add some!</p>
        </div>
      ) : isComplete ? (
        <div className="relative overflow-hidden bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-10 text-center shadow-2xl animate-scale-in">
          <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />

          <div className="relative z-10">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
              <Trophy className="w-8 h-8 text-amber-400" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">Deck Complete!</h2>
            <p className="text-slate-400 mb-8">
              You went through all {filteredNouns.length} noun{filteredNouns.length !== 1 ? 's' : ''}
              {levelFilter !== 'All' ? ` in ${levelFilter}` : ''}.
            </p>

            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-8">
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5">
                <p className="text-3xl font-black text-emerald-400">{sessionStats.known}</p>
                <p className="text-xs font-semibold text-emerald-400/70 uppercase mt-1 tracking-wide">I Know It</p>
              </div>
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5">
                <p className="text-3xl font-black text-red-400">{sessionStats.needsPractice}</p>
                <p className="text-xs font-semibold text-red-400/70 uppercase mt-1 tracking-wide">Needs Practice</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              {sessionStats.needsPractice > 0 && (
                <button
                  onClick={handlePracticeWeak}
                  className="flex items-center gap-2 py-3 px-6 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition shadow-lg hover:shadow-amber-500/20"
                >
                  <Sparkles className="w-4 h-4" /> Practice the {sessionStats.needsPractice} tricky one{sessionStats.needsPractice !== 1 ? 's' : ''}
                </button>
              )}
              <button
                onClick={handleRestart}
                className="flex items-center gap-2 py-3 px-6 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl transition"
              >
                <RotateCcw className="w-4 h-4" /> Restart Deck
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between text-xs font-semibold text-slate-400 mb-2">
              <span>Noun {currentIndex + 1} of {filteredNouns.length}</span>
              <span className="flex items-center gap-3">
                {sessionStats.known > 0 && <span className="text-emerald-400">{sessionStats.known} known</span>}
                {sessionStats.needsPractice > 0 && <span className="text-red-400">{sessionStats.needsPractice} tricky</span>}
                <span className="text-amber-500">{currentNoun.cefr_level}</span>
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-400 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Main Flashcard */}
          <div key={currentNoun.id} className="animate-fade-in bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
            {/* Image Section */}
            <div className="relative h-52 sm:h-72 bg-slate-800 w-full overflow-hidden">
              {currentNoun.image_url ? (
                <>
                  {!imgLoaded && <div className="absolute inset-0 animate-shimmer" />}
                  <img
                    src={currentNoun.image_url}
                    alt={currentNoun.english_meaning}
                    onLoad={() => setImgLoaded(true)}
                    className={`w-full h-full object-cover transition-all duration-700 ease-out ${imgLoaded ? 'opacity-85 scale-100' : 'opacity-0 scale-105'}`}
                  />
                </>
              ) : (
                <div className={`w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br ${articleStyle.imageFallback}`}>
                  <ImageOff className="w-8 h-8 text-slate-500" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Picture coming soon</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/10 to-transparent" />
            </div>

            {/* Noun Section */}
            <div className="px-6 sm:px-10 -mt-16 relative z-10 text-center pb-8">
              <div className="inline-flex flex-col items-center">
                <span className={`text-sm sm:text-base font-black uppercase tracking-widest px-4 py-1 rounded-full border mb-3 shadow-lg backdrop-blur-md ${articleStyle.pill}`}>
                  {currentNoun.article}
                </span>
                <div className="flex items-center gap-3">
                  <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight drop-shadow-md">
                    {currentNoun.german_noun}
                  </h2>
                  <button
                    onClick={playPronunciation}
                    className={`p-2.5 rounded-full border transition-all shrink-0 ${
                      isSpeaking
                        ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                        : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-amber-400 hover:border-amber-500/40'
                    }`}
                    title="Listen to pronunciation"
                  >
                    <Volume2 className={`w-4 h-4 ${isSpeaking ? 'animate-pulse' : ''}`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Details Section */}
            <div className="px-6 sm:px-10 pb-10 flex-1 flex flex-col justify-center">
              {!showDetails ? (
                <button
                  onClick={() => setShowDetails(true)}
                  className="mx-auto flex items-center gap-2 py-3 px-8 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl transition-all shadow-md animate-pulse-glow"
                >
                  <Eye className="w-5 h-5" />
                  Show Answer
                </button>
              ) : (
                <div className="space-y-6 animate-fade-in">
                  <div className="text-center">
                    <p className="text-sm font-semibold tracking-wide text-slate-500 uppercase mb-1">Meaning</p>
                    <p className="text-2xl font-bold gold-gradient-text capitalize">{currentNoun.english_meaning}</p>
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
                      className="flex-1 py-4 px-4 bg-red-500/10 hover:bg-red-500/20 active:scale-[0.98] text-red-400 border border-red-500/30 font-bold rounded-xl flex items-center justify-center gap-2 transition-all"
                    >
                      <XCircle className="w-5 h-5" /> Need Practice
                    </button>
                    <button
                      onClick={() => handleRecordResult('known')}
                      className="flex-1 py-4 px-4 bg-emerald-500/10 hover:bg-emerald-500/20 active:scale-[0.98] text-emerald-400 border border-emerald-500/30 font-bold rounded-xl flex items-center justify-center gap-2 transition-all"
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
            <div className="text-sm font-medium text-slate-500 hidden sm:block">
              Space to reveal &middot; use the buttons to advance
            </div>
            <div className="text-sm font-medium text-slate-500 sm:hidden">
              Tap "Show Answer" to continue
            </div>
            <button
              onClick={handleNext}
              disabled={currentIndex === filteredNouns.length - 1}
              className="p-3 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </>
      )}

    </div>
  );
};

export default NounBuilderEngine;
