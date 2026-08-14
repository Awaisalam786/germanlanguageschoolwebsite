import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import { BookOpen, Clock, Loader2, CheckCircle, XCircle, ChevronRight, Play, RefreshCw, X, ArrowLeft } from 'lucide-react';
import { translations } from '../i18n/translations';
import { useGlobalState } from '../context/GlobalStateContext';

export default function GrammarEngine({ level, onBack, userType, storedFreeUser, studentName, verifiedCode }) {
  const { currentLang } = useGlobalState();
  const t = translations[currentLang] || translations.en;

  // --- Setup State ---
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChapters, setSelectedChapters] = useState(new Set());
  const [sessionDuration, setSessionDuration] = useState(10); // 10, 20, 30
  
  // --- App State ---
  // SETUP, RUNNING, RESULTS
  const [appState, setAppState] = useState('SETUP');

  // --- Test State ---
  const [questionsPool, setQuestionsPool] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  
  const [score, setScore] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [resultsLog, setResultsLog] = useState([]); // { type, question, userAnswer, correctAnswer, isCorrect, explanation }

  const [feedback, setFeedback] = useState(null); // { isCorrect: bool, show: bool }
  const [saving, setSaving] = useState(false);

  // Focus ref for inputs
  const inputRef = useRef(null);

  useEffect(() => {
    fetchChapters();
  }, [level]);

  const fetchChapters = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('grammar_chapters')
      .select('*')
      .eq('level', level)
      .order('chapter_number', { ascending: true });
      
    if (!error && data) {
      // Group by chapter_number to consolidate different exercise types into one logical chapter
      const grouped = {};
      data.forEach(row => {
        if (!grouped[row.chapter_number]) {
          grouped[row.chapter_number] = {
            id: `chap_${row.chapter_number}`,
            chapter_number: row.chapter_number,
            topic_title: row.topic_title,
            level: row.level,
            word_count: 0,
            json_data: []
          };
        }
        grouped[row.chapter_number].word_count += (row.word_count || 0);
        if (row.json_data) {
          grouped[row.chapter_number].json_data = [...grouped[row.chapter_number].json_data, ...row.json_data];
        }
      });
      setChapters(Object.values(grouped).sort((a, b) => a.chapter_number - b.chapter_number));
    }
    setLoading(false);
  };

  const toggleChapter = (id) => {
    const newSet = new Set(selectedChapters);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedChapters(newSet);
  };

  const totalExercisesSelected = chapters
    .filter(c => selectedChapters.has(c.id))
    .reduce((sum, c) => sum + (c.word_count || 0), 0);
    
  const estimatedQuestions = Math.min(sessionDuration * 3, totalExercisesSelected);

  // --- Start Test ---
  const startTest = () => {
    if (selectedChapters.size === 0) {
      alert("Please select at least one chapter.");
      return;
    }
    
    // Gather all exercises
    let allExercises = [];
    chapters.forEach(c => {
      if (selectedChapters.has(c.id) && c.json_data) {
        allExercises = [...allExercises, ...c.json_data];
      }
    });

    // Shuffle and slice
    allExercises = allExercises.sort(() => Math.random() - 0.5).slice(0, estimatedQuestions);
    
    setQuestionsPool(allExercises);
    setCurrentIndex(0);
    setScore(0);
    setWrongCount(0);
    setResultsLog([]);
    setFeedback(null);
    setTimeLeft(sessionDuration * 60);
    setAppState('RUNNING');
  };

  // --- Timer ---
  useEffect(() => {
    let timer;
    if (appState === 'RUNNING' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (appState === 'RUNNING' && timeLeft <= 0) {
      finishTest();
    }
    return () => clearInterval(timer);
  }, [appState, timeLeft]);

  // --- Exercise Specific State ---
  const [typedAnswer, setTypedAnswer] = useState('');
  const [availableChips, setAvailableChips] = useState([]);
  const [selectedChips, setSelectedChips] = useState([]);

  const currentQ = questionsPool[currentIndex];

  useEffect(() => {
    if (appState === 'RUNNING' && currentQ) {
      setTypedAnswer('');
      if (currentQ.type === 'word_order') {
        setAvailableChips([...(currentQ.scrambled_words || [])]);
        setSelectedChips([]);
      }
      
      // Auto focus input if applicable
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 50);
    }
  }, [currentIndex, currentQ, appState]);

  // --- Answer Evaluation ---
  const handleAnswer = (userAns) => {
    if (feedback?.show) return; // Prevent multiple clicks

    let isCorrect = false;
    let actualUserAnswerString = typeof userAns === 'string' ? userAns : userAns.join(' ');
    
    // ALL EXERCISES NOW USE RELAXED CHECKING (ignore case and all punctuation)
    // The focus is on grammar rules/vocab/order rather than exact typing syntax.
    const normalize = (str) => (str || '').toLowerCase().replace(/[.,!?]/g, '').replace(/\s+/g, ' ').trim();
    const normalizedUser = normalize(actualUserAnswerString);

    if (currentQ.type === 'word_order') {
      isCorrect = normalizedUser === normalize(currentQ.correct_sentence);
    } else {
      const allCorrects = [currentQ.correct_answer, ...(currentQ.accepted_answers || [])].map(normalize);
      isCorrect = allCorrects.includes(normalizedUser);
    }

    if (isCorrect) setScore(s => s + 1);
    else setWrongCount(c => c + 1);

    const logEntry = {
      type: currentQ.type,
      question: currentQ.type === 'word_order' ? (currentQ.scrambled_words || []).join(' / ') : (currentQ.question || currentQ.prompt),
      userAnswer: actualUserAnswerString,
      correctAnswer: currentQ.type === 'word_order' ? currentQ.correct_sentence : currentQ.correct_answer,
      isCorrect,
      explanation: currentQ.explanation
    };

    setResultsLog(prev => [...prev, logEntry]);
    setFeedback({ isCorrect, show: true });
  };

  const nextQuestion = () => {
    if (currentIndex + 1 < questionsPool.length) {
      setFeedback(null);
      setCurrentIndex(c => c + 1);
    } else {
      finishTest();
    }
  };

  const finishTest = async () => {
    setAppState('RESULTS');
    setSaving(true);
    
    // Calculate final score using the ref to avoid state closure issues on the last question, 
    // or just calculate based on resultsLog + current attempt
    let finalScore = score;
    let log = [...resultsLog];
    
    if (feedback && feedback.show) {
      // It's already in resultsLog if nextQuestion hasn't been clicked, because handleAnswer sets it synchronously before.
    } else if (!feedback) {
       // if they didn't answer the last question (e.g. timeout)
       const logEntry = {
          type: currentQ?.type || 'unknown',
          question: currentQ?.type === 'word_order' ? (currentQ.scrambled_words || []).join(' / ') : (currentQ?.question || currentQ?.prompt),
          userAnswer: '',
          correctAnswer: currentQ?.type === 'word_order' ? currentQ?.correct_sentence : currentQ?.correct_answer,
          isCorrect: false,
          explanation: currentQ?.explanation
        };
        log.push(logEntry);
    }

    // Recalculate score from log to be 100% accurate
    finalScore = log.filter(l => l.isCorrect).length;
    const finalTotal = log.length;
    const percentage = finalTotal > 0 ? Math.round((finalScore / finalTotal) * 100) : 0;

    const payload = {
      user_type: userType,
      name: userType === 'student' ? studentName : storedFreeUser?.name,
      email: userType === 'student' ? null : storedFreeUser?.email,
      phone: userType === 'student' ? null : storedFreeUser?.phone,
      access_code_used: userType === 'student' ? verifiedCode : null,
      level: level,
      chapters_selected: Array.from(selectedChapters).map(id => chapters.find(c => c.id === id)?.chapter_number).join(', '),
      total_questions: finalTotal,
      correct_count: finalScore,
      wrong_count: finalTotal - finalScore,
      percentage: percentage,
      question_results: log
    };

    try {
      await fetch('/api/save-grammar-attempt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.error(err);
    }
    setSaving(false);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // --- UI Renderers ---
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
        <p className="text-slate-400 font-medium">Loading Grammar Chapters...</p>
      </div>
    );
  }

  if (appState === 'SETUP') {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        <button onClick={onBack} className="text-slate-400 hover:text-white flex items-center gap-2 mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Categories
        </button>
        
        <div className="text-center space-y-2 mb-8">
          <div className="w-16 h-16 mx-auto bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20 mb-4">
            <BookOpen className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-3xl font-extrabold text-white">Smart Grammar Engine</h2>
          <p className="text-slate-400">Level {level} • Select chapters to build your custom grammar practice session.</p>
        </div>

        {chapters.length === 0 ? (
          <div className="text-center py-12 bg-slate-900 border border-slate-800 rounded-2xl">
            <p className="text-slate-500">No grammar chapters available for {level} yet.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl h-fit">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                1. Select Topics
              </h3>
              <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                {chapters.map(chap => {
                  const isSelected = selectedChapters.has(chap.id);
                  return (
                    <button
                      key={chap.id}
                      onClick={() => toggleChapter(chap.id)}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left ${
                        isSelected 
                          ? 'bg-emerald-500/10 border-emerald-500 text-white' 
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      <div>
                        <span className="font-bold text-emerald-500 mr-2">Ch {chap.chapter_number}</span>
                        <span className="font-medium">{chap.topic_title}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded-md">{chap.word_count} Qs</span>
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${isSelected ? 'bg-emerald-500 border-emerald-500 text-slate-900' : 'border-slate-600'}`}>
                          {isSelected && <CheckCircle className="w-4 h-4" />}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-emerald-400" />
                  2. Session Length
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {[10, 20, 30].map(mins => (
                    <button
                      key={mins}
                      onClick={() => setSessionDuration(mins)}
                      className={`py-3 rounded-xl border font-bold transition-all ${
                        sessionDuration === mins 
                          ? 'bg-emerald-500 border-emerald-500 text-slate-900' 
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      {mins} Min
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <div className="flex justify-between items-center mb-6 text-slate-300">
                  <span>Selected Topics:</span>
                  <span className="font-bold text-white">{selectedChapters.size}</span>
                </div>
                <div className="flex justify-between items-center mb-6 text-slate-300">
                  <span>Estimated Questions:</span>
                  <span className="font-bold text-white">{estimatedQuestions}</span>
                </div>
                <button
                  onClick={startTest}
                  disabled={selectedChapters.size === 0}
                  className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-extrabold rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 text-lg"
                >
                  <Play className="w-6 h-6 fill-current" />
                  Start Practice
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (appState === 'RUNNING') {
    return (
      <div className="max-w-3xl mx-auto w-full flex flex-col flex-1 pb-12">
        {/* Header bar */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button onClick={() => { if(window.confirm("Quit practice session? Progress will be lost.")) setAppState('SETUP'); }} className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-400 transition-colors">
              <X className="w-5 h-5" />
            </button>
            <div>
              <div className="text-emerald-400 font-bold text-lg">Question {currentIndex + 1} of {questionsPool.length}</div>
              <div className="text-slate-400 text-xs">{currentQ?.topic}</div>
            </div>
          </div>
          <div className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl font-mono text-emerald-400 font-bold flex items-center gap-2 shadow-inner">
            <Clock className="w-4 h-4" />
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* Exercise Area */}
        <div className="flex-1 flex flex-col justify-center relative">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            {/* Type Badge */}
            <div className="absolute top-0 right-0 bg-emerald-500/10 border-b border-l border-emerald-500/20 px-4 py-1 rounded-bl-xl text-[10px] font-extrabold uppercase tracking-widest text-emerald-500">
              {currentQ.type.replace('_', ' ')}
            </div>

            {/* Stimulus */}
            <div className="mb-8 mt-4 text-center space-y-3">
              {(currentQ.type === 'word_order' || currentQ.type === 'hint_construction') && (
                <p className="text-sm text-emerald-400 font-bold uppercase tracking-widest">
                  {currentQ.type === 'word_order' ? "Unscramble the sentence:" : currentQ.prompt}
                </p>
              )}
              <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
                {currentQ.type === 'hint_construction' 
                  ? currentQ.sentence_template 
                  : currentQ.type === 'word_order' ? null : currentQ.question
                }
              </h2>
            </div>

            {/* Inputs based on type */}
            <div className="max-w-xl mx-auto">
              {!feedback?.show && (
                <>
                  {currentQ.type === 'mcq' && (
                    <div className="grid sm:grid-cols-2 gap-3">
                      {currentQ.options.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => handleAnswer(opt)}
                          className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold text-lg hover:border-emerald-500 hover:bg-emerald-500/10 transition-all shadow-md"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}

                  {(currentQ.type === 'fill_blank' || currentQ.type === 'hint_construction') && (
                    <form onSubmit={(e) => { e.preventDefault(); handleAnswer(typedAnswer); }} className="space-y-4">
                      <input
                        ref={inputRef}
                        type="text"
                        value={typedAnswer}
                        onChange={(e) => setTypedAnswer(e.target.value)}
                        placeholder={currentQ.type === 'hint_construction' ? "Translate using hint words..." : "Type your answer..."}
                        className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-2xl px-6 py-4 text-xl text-white text-center focus:outline-none focus:ring-4 focus:ring-emerald-500/20 transition-all shadow-inner"
                        autoComplete="off"
                        autoCorrect="off"
                        spellCheck="false"
                      />
                      <button 
                        type="submit" 
                        disabled={!typedAnswer.trim()}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold rounded-xl transition shadow-lg"
                      >
                        Check Answer
                      </button>
                    </form>
                  )}

                  {currentQ.type === 'word_order' && (
                    <div className="space-y-8">
                      {/* Answer Drop Zone */}
                      <div className="min-h-[60px] p-4 bg-slate-950 border-2 border-dashed border-slate-700 rounded-2xl flex flex-wrap gap-2 justify-center items-center">
                        {selectedChips.length === 0 && <span className="text-slate-500 italic text-sm">Tap words to build the sentence...</span>}
                        {selectedChips.map((chip, i) => (
                          <button 
                            key={`sel-${i}`}
                            onClick={() => {
                              setSelectedChips(prev => prev.filter((_, idx) => idx !== i));
                              setAvailableChips(prev => [...prev, chip]);
                            }}
                            className="px-4 py-2 bg-emerald-500 text-slate-950 font-bold rounded-lg shadow-md hover:scale-105 transition-transform"
                          >
                            {chip}
                          </button>
                        ))}
                      </div>

                      {/* Available Chips */}
                      <div className="flex flex-wrap gap-3 justify-center">
                        {availableChips.map((chip, i) => (
                          <button
                            key={`avail-${i}`}
                            onClick={() => {
                              setAvailableChips(prev => prev.filter((_, idx) => idx !== i));
                              setSelectedChips(prev => [...prev, chip]);
                            }}
                            className="px-4 py-2 bg-slate-800 border border-slate-700 text-white font-medium rounded-lg shadow-sm hover:bg-slate-700 hover:scale-105 transition-transform"
                          >
                            {chip}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => handleAnswer(selectedChips)}
                        disabled={selectedChips.length !== currentQ.scrambled_words.length}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold rounded-xl transition shadow-lg"
                      >
                        Check Sentence
                      </button>
                    </div>
                  )}
                </>
              )}

              {/* Feedback UI */}
              {feedback?.show && (
                <div className="animate-fade-in text-center space-y-6">
                  <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full border-4 ${feedback.isCorrect ? 'border-emerald-500 bg-emerald-500/20 text-emerald-500' : 'border-red-500 bg-red-500/20 text-red-500'}`}>
                    {feedback.isCorrect ? <CheckCircle className="w-10 h-10" /> : <XCircle className="w-10 h-10" />}
                  </div>
                  
                  <div>
                    <h3 className={`text-3xl font-extrabold mb-2 ${feedback.isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
                      {feedback.isCorrect ? 'Richtig!' : 'Falsch!'}
                    </h3>
                    
                    {!feedback.isCorrect && (
                      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 inline-block text-left max-w-md w-full">
                        <p className="text-xs text-slate-500 mb-1">Correct Answer:</p>
                        <p className="text-lg font-bold text-white">
                          {currentQ.type === 'word_order' ? currentQ.correct_sentence : currentQ.correct_answer}
                        </p>
                      </div>
                    )}
                  </div>

                  {currentQ.explanation && (
                    <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4 text-blue-200 text-sm max-w-md mx-auto text-left flex items-start gap-3">
                      <BookOpen className="w-5 h-5 shrink-0 text-blue-400 mt-0.5" />
                      <p>{currentQ.explanation}</p>
                    </div>
                  )}

                  <button
                    autoFocus
                    onClick={nextQuestion}
                    className="w-full py-4 bg-slate-100 hover:bg-white text-slate-900 font-extrabold rounded-xl transition shadow-lg flex items-center justify-center gap-2 text-lg"
                  >
                    {currentIndex + 1 < questionsPool.length ? 'Next Question' : 'Finish Test'}
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- RESULTS PAGE ---
  if (appState === 'RESULTS') {
    const percentage = questionsPool.length > 0 ? Math.round((score / questionsPool.length) * 100) : 0;
    const passed = percentage >= 70;

    return (
      <div className="max-w-2xl mx-auto text-center space-y-8 py-10 animate-fade-in">
        <div className="space-y-4">
          <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center border-4 ${passed ? 'border-emerald-500 bg-emerald-500/10' : 'border-amber-500 bg-amber-500/10'}`}>
            <span className={`text-4xl font-extrabold ${passed ? 'text-emerald-500' : 'text-amber-500'}`}>
              {percentage}%
            </span>
          </div>
          <h2 className="text-4xl font-extrabold text-white">
            {passed ? 'Toll gemacht!' : 'Übung macht den Meister!'}
          </h2>
          <p className="text-slate-400 text-lg">
            You scored {score} out of {questionsPool.length} correctly.
          </p>
          
          {userType !== 'student' && (
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4 inline-block mt-4 text-sm text-blue-200">
              <span className="font-bold">Note for Free Users:</span> Your score has been logged anonymously. To track your progress permanently, enroll in a premium course!
            </div>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-4 max-w-md mx-auto">
          <button
            onClick={() => setAppState('SETUP')}
            className="py-4 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-white font-bold rounded-xl transition flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" /> Play Again
          </button>
          <button
            onClick={onBack}
            className="py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
          >
            <BookOpen className="w-5 h-5" /> Other Tests
          </button>
        </div>
      </div>
    );
  }

  return null;
}
