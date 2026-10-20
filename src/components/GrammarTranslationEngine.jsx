import React, { useState, useEffect, useMemo, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import {
  BookOpen,
  Play,
  RotateCcw,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  ArrowLeft,
  ChevronRight,
  Layers,
  Sparkles,
  HelpCircle,
  Send,
  X,
  Check
} from 'lucide-react';

const DIFFICULTIES = ['Easy', 'Medium', 'Hard', 'Max'];
const PRESET_COUNTS = [10, 20, 30, 40, 50];

// German Umlaut & Eszett on-screen keyboard
const UmlautKeyboard = ({ onInsert }) => {
  const characters = ['ä', 'ö', 'ü', 'ß', 'Ä', 'Ö', 'Ü'];
  return (
    <div className="flex gap-1.5 justify-center mt-2 flex-wrap" aria-label="German character keyboard">
      {characters.map((char) => (
        <button
          key={char}
          type="button"
          onClick={() => onInsert(char)}
          className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 text-white font-bold hover:bg-slate-700 hover:border-amber-400/50 transition-colors shadow-sm active:scale-95 text-sm"
        >
          {char}
        </button>
      ))}
    </div>
  );
};

// Robust schema getters to reliably retrieve English prompt and target German answer across all schema variations
export const getQuestionPrompt = (q) => {
  if (!q) return '';
  return String(
    q.english_sentence ||
    q.english_prompt ||
    q.prompt ||
    q.english ||
    q.sentence ||
    ''
  ).trim();
};

export const getQuestionTarget = (q) => {
  if (!q) return '';
  return String(
    q.target_german ||
    q.german_sentence ||
    q.german ||
    q.correct_german ||
    q.target ||
    ''
  ).trim();
};

export default function GrammarTranslationEngine({
  level = 'A1',
  onBack,
  userType = 'anonymous',
  storedFreeUser = null,
  studentName = '',
  verifiedCode = null
}) {
  // App Phases: 'SETUP' | 'TRANSLATION' | 'REVIEW'
  const [sessionPhase, setSessionPhase] = useState('SETUP');

  // Topics from DB
  const [topics, setTopics] = useState([]);
  const [loadingTopics, setLoadingTopics] = useState(true);
  const [dbError, setDbError] = useState(null);

  // Setup Form State
  const [selectedTopicId, setSelectedTopicId] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Easy');
  const [selectedCount, setSelectedCount] = useState(10);
  const [isCustomCount, setIsCustomCount] = useState(false);
  const [customCountInput, setCustomCountInput] = useState('');

  // Active Practice State
  const [sessionQuestions, setSessionQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userTypedInput, setUserTypedInput] = useState('');
  const [isAnswerRecorded, setIsAnswerRecorded] = useState(false);
  const [sessionAttempts, setSessionAttempts] = useState([]); // [{ question, userAnswer }]

  // Detailed Review & Suggestion State
  const [activeSuggestionIdx, setActiveSuggestionIdx] = useState(null);
  const [suggestionInput, setSuggestionInput] = useState('');
  const [suggestionNotes, setSuggestionNotes] = useState('');
  const [suggestionLoading, setSuggestionLoading] = useState(false);
  const [suggestionMsg, setSuggestionMsg] = useState(null);
  const [submittedSuggestions, setSubmittedSuggestions] = useState({});

  // Input ref
  const textareaRef = useRef(null);

  // Load topics for selected level
  useEffect(() => {
    fetchLevelTopics();
  }, [level]);

  const fetchLevelTopics = async () => {
    setLoadingTopics(true);
    setDbError(null);
    try {
      const { data, error } = await supabase
        .from('grammar_translation_topics')
        .select('id, level, topic_number, topic_title, description, questions, is_active')
        .eq('level', level)
        .eq('is_active', true)
        .order('topic_number', { ascending: true });

      if (error) {
        if (error.code === '42P01' || error.message?.includes('does not exist')) {
          setDbError('Database table "grammar_translation_topics" is not yet migrated in Supabase. Please execute supabase/grammar_translation_schema.sql.');
        } else {
          setDbError(error.message);
        }
        setTopics([]);
      } else {
        setTopics(data || []);
        if (data && data.length > 0) {
          setSelectedTopicId(data[0].id);
        }
      }
    } catch (err) {
      setDbError(err.message || 'Error fetching translation topics');
    } finally {
      setLoadingTopics(false);
    }
  };

  // --------------------------------------------------------------------------
  // Question Rotation & Rotation History
  // --------------------------------------------------------------------------
  const getRotationKey = (topicId, difficulty) => {
    const userId = storedFreeUser?.id || storedFreeUser?.email || 'guest';
    return `gls_gt_completed_${userId}_${level}_${topicId}_${difficulty}`;
  };

  const getCompletedIds = (topicId, difficulty) => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(getRotationKey(topicId, difficulty));
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  };

  const saveCompletedIds = (topicId, difficulty, newIds) => {
    if (typeof window === 'undefined' || !newIds.length) return;
    try {
      const existing = getCompletedIds(topicId, difficulty);
      const combined = Array.from(new Set([...existing, ...newIds]));
      localStorage.setItem(getRotationKey(topicId, difficulty), JSON.stringify(combined));
    } catch (e) {
      // LocalStorage full or private browsing
    }
  };

  // --------------------------------------------------------------------------
  // Start Session Logic
  // --------------------------------------------------------------------------
  const startSession = (isRepeatBatch = false, retryPool = null) => {
    if (retryPool && retryPool.length > 0) {
      // Retrying mistakes only
      setSessionQuestions(retryPool);
      setCurrentIdx(0);
      setUserTypedInput('');
      setIsAnswerRecorded(false);
      setSessionAttempts([]);
      setSessionPhase('TRANSLATION');
      return;
    }

    const topic = topics.find((t) => t.id === selectedTopicId);
    if (!topic || !Array.isArray(topic.questions) || topic.questions.length === 0) {
      alert('Selected topic has no questions configured yet.');
      return;
    }

    // Determine target quantity
    let targetQuantity = 10;
    if (isCustomCount) {
      const parsed = parseInt(customCountInput, 10);
      if (isNaN(parsed) || parsed < 1 || parsed > 100) {
        alert('Please enter a valid question quantity between 1 and 100.');
        return;
      }
      targetQuantity = parsed;
    } else {
      targetQuantity = selectedCount;
    }

    // Filter questions by difficulty (exact match)
    let eligibleQuestions = topic.questions.filter((q) => q.difficulty === selectedDifficulty);

    // If no questions in selected difficulty, fallback to all questions of topic gracefully
    if (eligibleQuestions.length === 0) {
      eligibleQuestions = topic.questions;
    }

    // Separate unseen vs seen for rotation
    const seenIds = new Set(getCompletedIds(topic.id, selectedDifficulty));
    const unseenQuestions = eligibleQuestions.filter((q) => !seenIds.has(q.id));

    let pool = [];
    if (unseenQuestions.length >= targetQuantity) {
      // Sufficent unseen questions
      pool = [...unseenQuestions].sort(() => Math.random() - 0.5).slice(0, targetQuantity);
    } else if (unseenQuestions.length > 0) {
      // Partial unseen, cycle seen questions without revealing counts
      const remainingNeeded = targetQuantity - unseenQuestions.length;
      const seenShuffled = eligibleQuestions
        .filter((q) => seenIds.has(q.id))
        .sort(() => Math.random() - 0.5)
        .slice(0, remainingNeeded);
      pool = [...unseenQuestions, ...seenShuffled].sort(() => Math.random() - 0.5);
    } else {
      // Unseen pool exhausted: reset rotation cycle gracefully
      pool = [...eligibleQuestions].sort(() => Math.random() - 0.5).slice(0, targetQuantity);
    }

    const enrichedPool = pool.map((q) => ({
      ...q,
      topic_id: topic.id,
      topic: topic.topic_title || 'Grammar Translation',
    }));

    setSessionQuestions(enrichedPool);
    setCurrentIdx(0);
    setUserTypedInput('');
    setIsAnswerRecorded(false);
    setSessionAttempts([]);
    setSessionPhase('TRANSLATION');
  };

  // --------------------------------------------------------------------------
  // Translation Screen Actions
  // --------------------------------------------------------------------------
  const currentQuestion = sessionQuestions[currentIdx];

  const handleRecordAnswer = (e) => {
    e.preventDefault();
    const prompt = getQuestionPrompt(currentQuestion);
    if (!prompt) {
      alert('Cannot submit answer: The English prompt for this question is missing or blank.');
      return;
    }
    if (!userTypedInput.trim() || isAnswerRecorded) return;

    // Record answer silently without revealing correctness
    const currentAttempt = {
      question: currentQuestion,
      userAnswer: userTypedInput.trim()
    };

    setSessionAttempts((prev) => [...prev, currentAttempt]);
    setIsAnswerRecorded(true);
  };

  const handleNextQuestion = () => {
    if (currentIdx + 1 < sessionQuestions.length) {
      setCurrentIdx((c) => c + 1);
      setUserTypedInput('');
      setIsAnswerRecorded(false);
      setTimeout(() => {
        if (textareaRef.current) textareaRef.current.focus();
      }, 50);
    } else {
      finishSession();
    }
  };

  const finishSession = () => {
    // Save rotation history for unseen questions in this standard session
    if (selectedTopicId && selectedDifficulty && sessionQuestions.length > 0) {
      const finishedIds = sessionQuestions.map((q) => q.id).filter(Boolean);
      saveCompletedIds(selectedTopicId, selectedDifficulty, finishedIds);
    }
    setSessionPhase('REVIEW');
  };

  const handleInsertChar = (char) => {
    setUserTypedInput((prev) => prev + char);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // --------------------------------------------------------------------------
  // Tolerant Answer Evaluation (Review Phase Only)
  // --------------------------------------------------------------------------
  const normalizeSentence = (str) => {
    return (str || '')
      .trim()
      .toLowerCase()
      .replace(/[.,;!?„"“”'’]+/g, '') // Strip quotes and punctuation
      .replace(/\s+/g, ' '); // Collapse multi-spaces
  };

  const evaluateAttempt = (attempt) => {
    const userNorm = normalizeSentence(attempt.userAnswer);
    const officialTarget = getQuestionTarget(attempt.question);
    const acceptedList = Array.isArray(attempt.question.accepted_answers)
      ? attempt.question.accepted_answers
      : [];

    const allValid = [officialTarget, ...acceptedList].filter(Boolean).map(normalizeSentence);
    const isCorrect = allValid.length > 0 && allValid.includes(userNorm);

    return {
      isCorrect,
      userAnswer: attempt.userAnswer,
      officialAnswer: officialTarget,
      explanation: attempt.question.explanation || '',
      question: attempt.question
    };
  };

  // Evaluated results for Detailed Review
  const evaluatedResults = useMemo(() => {
    return sessionAttempts.map(evaluateAttempt);
  }, [sessionAttempts]);

  const score = useMemo(() => {
    return evaluatedResults.filter((r) => r.isCorrect).length;
  }, [evaluatedResults]);

  const percentage = useMemo(() => {
    return sessionQuestions.length > 0 ? Math.round((score / sessionQuestions.length) * 100) : 0;
  }, [score, sessionQuestions]);

  // --------------------------------------------------------------------------
  // Student Suggestion Submission (Review Screen)
  // --------------------------------------------------------------------------
  const openSuggestionModal = (resultItem, idx) => {
    setActiveSuggestionIdx(idx);
    setSuggestionMsg(null);
    setSuggestionInput(resultItem.userAnswer || '');
    setSuggestionNotes('');
  };

  const handleSuggestionSubmit = async (resultItem, idx) => {
    const cleanSynonym = suggestionInput.trim();
    if (!cleanSynonym) return;

    setSuggestionLoading(true);
    setSuggestionMsg(null);

    try {
      // Suggestion payload for grammar_translation_suggestions
      const newSuggestion = {
        topic_id: resultItem.question.topic_id || selectedTopicId || null,
        level: level,
        topic_title: resultItem.question.topic || 'Grammar Translation',
        question_id: resultItem.question.id,
        english_sentence: getQuestionPrompt(resultItem.question),
        official_german: getQuestionTarget(resultItem.question),
        user_typed_answer: resultItem.userAnswer || null,
        suggested_alternative: cleanSynonym,
        notes: suggestionNotes.trim() || null,
        status: 'pending',
        submitted_by_name: studentName || (storedFreeUser?.email ? storedFreeUser.email.split('@')[0] : 'Learner'),
        user_type: userType || 'anonymous'
      };

      const { error: submitErr } = await supabase
        .from('grammar_translation_suggestions')
        .insert([newSuggestion]);

      if (submitErr) {
        if (submitErr.code === '42P01') {
          throw new Error('Suggestion queue table is pending SQL migration in Supabase.');
        }
        throw submitErr;
      }

      setSubmittedSuggestions((prev) => ({ ...prev, [idx]: true }));
      setSuggestionMsg({
        type: 'success',
        text: 'Thank you! Alternative translation submitted for admin review.'
      });

      setTimeout(() => {
        setActiveSuggestionIdx(null);
        setSuggestionMsg(null);
      }, 2500);
    } catch (err) {
      setSuggestionMsg({
        type: 'error',
        text: err.message || 'Error submitting suggestion'
      });
    } finally {
      setSuggestionLoading(false);
    }
  };

  // --------------------------------------------------------------------------
  // RENDER: Phase 1 — SETUP / SELECTION SCREEN
  // --------------------------------------------------------------------------
  if (sessionPhase === 'SETUP') {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-slate-400 hover:text-white flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Practice Categories
        </button>

        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-extrabold shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Grammar Translation Drills • Level {level}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            German <span className="text-emerald-400">Sentence Translation</span>
          </h1>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Translate practical English sentences into accurate German. Work out correct verb conjugations and noun cases with structured base-form hints.
          </p>
        </div>

        {dbError && (
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center gap-3 text-amber-300 text-xs">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{dbError}</span>
          </div>
        )}

        {loadingTopics ? (
          <div className="py-20 text-center text-slate-400 text-sm">
            <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mx-auto mb-3" />
            Loading grammar topics...
          </div>
        ) : topics.length === 0 ? (
          <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl max-w-lg mx-auto space-y-3">
            <Layers className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">No Topics Available Yet</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Grammar translation topics for Level {level} have not yet been published by the instructor. Please check back soon or try another level.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-12 gap-8 items-start">
            {/* Left: Topic Selection */}
            <div className="md:col-span-7 space-y-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  1. Choose Grammar Topic
                </h2>

                <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                  {topics.map((t) => {
                    const isSelected = selectedTopicId === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setSelectedTopicId(t.id)}
                        className={`w-full text-left p-4 rounded-xl border transition-all ${
                          isSelected
                            ? 'bg-emerald-500/15 border-emerald-500/60 text-white shadow-md'
                            : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-extrabold text-emerald-400">
                            #{t.topic_number}
                          </span>
                          <span className="text-sm font-bold">{t.topic_title}</span>
                        </div>
                        {t.description && (
                          <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                            {t.description}
                          </p>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right: Difficulty & Quantity Controls */}
            <div className="md:col-span-5 space-y-6">
              {/* Difficulty Selection */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  2. Select Difficulty
                </h2>

                <div className="grid grid-cols-2 gap-2.5">
                  {DIFFICULTIES.map((diff) => {
                    const isSelected = selectedDifficulty === diff;
                    return (
                      <button
                        key={diff}
                        type="button"
                        onClick={() => setSelectedDifficulty(diff)}
                        className={`py-2.5 px-3 rounded-xl border font-bold text-xs transition-all ${
                          isSelected
                            ? 'bg-emerald-500 border-emerald-500 text-slate-950 shadow-md'
                            : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        {diff}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                  <HelpCircle className="w-4 h-4 text-emerald-400" />
                  3. Session Questions
                </h2>

                <div className="flex flex-wrap gap-2">
                  {PRESET_COUNTS.map((count) => {
                    const isSelected = !isCustomCount && selectedCount === count;
                    return (
                      <button
                        key={count}
                        type="button"
                        onClick={() => {
                          setSelectedCount(count);
                          setIsCustomCount(false);
                        }}
                        className={`px-3.5 py-1.5 rounded-lg border font-mono font-bold text-xs transition-all ${
                          isSelected
                            ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        {count} Qs
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => setIsCustomCount(true)}
                    className={`px-3.5 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                      isCustomCount
                        ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    Custom
                  </button>
                </div>

                {isCustomCount && (
                  <div className="pt-2">
                    <label className="block text-slate-400 text-xs mb-1">Enter desired question count (1 - 100):</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      placeholder="e.g. 15"
                      value={customCountInput}
                      onChange={(e) => setCustomCountInput(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-mono text-sm focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => startSession(false)}
                  disabled={!selectedTopicId}
                  className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-extrabold rounded-xl transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 text-base mt-4"
                >
                  <Play className="w-5 h-5 fill-current" />
                  <span>Start Translation Session</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // RENDER: Phase 2 — TRANSLATION PRACTICE SCREEN
  // --------------------------------------------------------------------------
  if (sessionPhase === 'TRANSLATION' && currentQuestion) {
    // Session progress: calculated purely from attempted questions in this batch
    const attemptedCount = currentIdx + (isAnswerRecorded ? 1 : 0);
    const progressPercent = Math.round((attemptedCount / sessionQuestions.length) * 100);

    const promptText = getQuestionPrompt(currentQuestion);
    const isPromptMissing = !promptText;

    return (
      <div className="max-w-3xl mx-auto w-full flex flex-col flex-1 pb-12 animate-fade-in">
        {/* Header Bar */}
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Quit translation session? Current attempt will be exited.')) {
                setSessionPhase('SETUP');
              }
            }}
            className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-400 transition-colors"
            aria-label="Quit session"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center">
            <span className="text-emerald-400 font-extrabold text-sm sm:text-base">
              Question {currentIdx + 1} of {sessionQuestions.length}
            </span>
            <span className="block text-[11px] text-slate-400 font-medium">
              {currentQuestion.topic || 'Grammar Translation'} • {currentQuestion.difficulty || selectedDifficulty}
            </span>
          </div>

          <div className="w-9" aria-hidden="true" />
        </div>

        {/* Session-Only Progress Bar */}
        <div className="w-full bg-slate-900 border border-slate-800 rounded-full h-2.5 mb-8 overflow-hidden">
          <div
            className="bg-emerald-500 h-full transition-all duration-300 rounded-full shadow-sm"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Translation Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative space-y-6">
          {/* English Prompt */}
          <div className="text-center space-y-2 py-4 border-b border-slate-800/80">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-400">
              Translate into German:
            </span>
            {promptText ? (
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-relaxed">
                "{promptText}"
              </h2>
            ) : (
              <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 text-center space-y-1">
                <div className="flex items-center justify-center gap-2 text-red-400 font-bold text-sm">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>English sentence prompt is missing or blank for this question.</span>
                </div>
                <p className="text-xs text-slate-400">
                  Answer submission is disabled. Please skip to the next question or report question ID{' '}
                  <span className="font-mono text-slate-300">{currentQuestion.id || 'N/A'}</span>.
                </p>
              </div>
            )}
          </div>

          {/* German Typing Input */}
          <form onSubmit={handleRecordAnswer} className="space-y-4">
            <div>
              <label htmlFor="german-answer-input" className="block text-xs font-bold text-slate-400 mb-2">
                Your German Translation:
              </label>
              <textarea
                ref={textareaRef}
                id="german-answer-input"
                rows="3"
                value={userTypedInput}
                onChange={(e) => setUserTypedInput(e.target.value)}
                placeholder={isPromptMissing ? 'Answering disabled: English prompt is missing.' : 'Type the full German sentence...'}
                disabled={isAnswerRecorded || isPromptMissing}
                className="w-full bg-slate-950 border border-slate-700 rounded-2xl p-4 text-white text-base sm:text-lg placeholder-slate-600 focus:outline-none focus:border-emerald-400 transition resize-none disabled:opacity-50"
                autoFocus={!isPromptMissing}
              />
            </div>

            {/* German Character Buttons */}
            {!isAnswerRecorded && !isPromptMissing && <UmlautKeyboard onInsert={handleInsertChar} />}

            {/* Structured Hint Pills (Base forms only) */}
            <div className="pt-2">
              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Vocabulary & Grammar Hints (Base Forms):
                </span>
                <div className="flex flex-wrap gap-2">
                  {currentQuestion.hints?.verbs?.map((verbHint, vIdx) => (
                    <span
                      key={vIdx}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/25 text-blue-300 font-mono text-xs"
                    >
                      <span className="font-sans font-bold text-[10px] text-blue-400 uppercase">Verb:</span>
                      {verbHint}
                    </span>
                  ))}

                  {currentQuestion.hints?.nouns?.map((nounHint, nIdx) => (
                    <span
                      key={nIdx}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-300 font-mono text-xs"
                    >
                      <span className="font-sans font-bold text-[10px] text-amber-400 uppercase">Noun:</span>
                      {nounHint}
                    </span>
                  ))}

                  {currentQuestion.hints?.adjectives?.map((adjHint, aIdx) => (
                    <span
                      key={aIdx}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-500/10 border border-purple-500/25 text-purple-300 font-mono text-xs"
                    >
                      <span className="font-sans font-bold text-[10px] text-purple-400 uppercase">Adj:</span>
                      {adjHint}
                    </span>
                  ))}

                  {currentQuestion.hints?.notes && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs italic">
                      Tip: {currentQuestion.hints.notes}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons: Check Answer (Silent Record) & Next Question */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              {!isAnswerRecorded ? (
                isPromptMissing ? (
                  <div className="w-full space-y-3">
                    <button
                      type="button"
                      disabled
                      className="w-full py-4 bg-slate-800 text-slate-500 font-extrabold rounded-xl text-base cursor-not-allowed"
                    >
                      Answer Submission Disabled (Prompt Missing)
                    </button>
                    <button
                      type="button"
                      onClick={handleNextQuestion}
                      className="w-full py-4 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-extrabold rounded-xl transition border border-amber-500/30 flex items-center justify-center gap-2 text-base"
                    >
                      <span>{currentIdx + 1 < sessionQuestions.length ? 'Skip to Next Question' : 'Complete Session'}</span>
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="submit"
                    disabled={!userTypedInput.trim()}
                    className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-extrabold rounded-xl transition shadow-lg shadow-emerald-500/20 text-base"
                  >
                    Check & Record Answer
                  </button>
                )
              ) : (
                <div className="w-full space-y-3">
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center text-xs font-bold text-emerald-400 flex items-center justify-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>Answer recorded for detailed final review!</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    autoFocus
                    className="w-full py-4 bg-slate-100 hover:bg-white text-slate-900 font-extrabold rounded-xl transition shadow-lg flex items-center justify-center gap-2 text-base"
                  >
                    <span>{currentIdx + 1 < sessionQuestions.length ? 'Next Question' : 'Complete & View Review'}</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // RENDER: Phase 3 — DETAILED REVIEW & RESULT SCREEN
  // --------------------------------------------------------------------------
  if (sessionPhase === 'REVIEW') {
    const passed = percentage >= 70;
    const mistakesPool = evaluatedResults.filter((r) => !r.isCorrect).map((r) => r.question);

    return (
      <div className="max-w-3xl mx-auto space-y-8 animate-fade-in pb-16">
        {/* Score Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-4 shadow-2xl">
          <div
            className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center border-4 ${
              passed ? 'border-emerald-500 bg-emerald-500/10' : 'border-amber-500 bg-amber-500/10'
            }`}
          >
            <span className={`text-4xl font-extrabold ${passed ? 'text-emerald-500' : 'text-amber-500'}`}>
              {percentage}%
            </span>
          </div>

          <h2 className="text-3xl font-extrabold text-white">
            {passed ? 'Sehr Gut! Excellent Translation!' : 'Übung macht den Meister! Keep Practicing!'}
          </h2>

          <p className="text-slate-400 text-sm">
            You scored <strong className="text-white">{score}</strong> out of{' '}
            <strong className="text-white">{sessionQuestions.length}</strong> correct.
          </p>

          {/* Action Buttons: Retry Options */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-slate-800">
            {mistakesPool.length > 0 && (
              <button
                type="button"
                onClick={() => startSession(true, mistakesPool)}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition flex items-center gap-2 shadow-md"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry Mistakes Only ({mistakesPool.length})</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => startSession(true, sessionQuestions)}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition flex items-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Repeat Full Batch</span>
            </button>

            <button
              type="button"
              onClick={() => setSessionPhase('SETUP')}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition flex items-center gap-2"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Choose Another Topic</span>
            </button>
          </div>
        </div>

        {/* Detailed Review List */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">Detailed Translation Review</h3>
            <span className="text-xs text-slate-400 font-medium">
              Review correct answers & submit synonyms
            </span>
          </div>

          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {evaluatedResults.map((result, idx) => (
              <div
                key={idx}
                className={`p-5 rounded-2xl border flex flex-col gap-3 ${
                  result.isCorrect ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <span className="text-xs font-bold text-slate-400">English Prompt:</span>
                    <p className="text-base font-extrabold text-white">
                      {getQuestionPrompt(result.question) ? `"${getQuestionPrompt(result.question)}"` : <span className="text-red-400 italic">[Blank Prompt]</span>}
                    </p>

                    <div className="text-xs space-y-1 pt-1">
                      <p className={result.isCorrect ? 'text-emerald-300' : 'text-red-300'}>
                        <span className="font-bold text-slate-400">You translated: </span>
                        {result.userAnswer || '(No answer provided)'}
                      </p>

                      {!result.isCorrect && (
                        <p className="text-emerald-400 font-semibold">
                          <span className="font-bold text-slate-400">Accepted Answer: </span>
                          {result.officialAnswer || <span className="text-red-400 italic">[Missing Target Answer]</span>}
                        </p>
                      )}
                    </div>

                    {result.explanation && (
                      <p className="text-xs text-slate-400 italic pt-1 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/80">
                        <strong className="text-slate-300 not-italic">Grammar Note: </strong>
                        {result.explanation}
                      </p>
                    )}
                  </div>

                  {result.isCorrect ? (
                    <CheckCircle className="w-6 h-6 text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-400 shrink-0" />
                  )}
                </div>

                {/* Suggest alternative synonym modal on incorrect/mistakes */}
                {!result.isCorrect && (
                  <div className="pt-2 border-t border-red-500/20">
                    {submittedSuggestions[idx] ? (
                      <div className="inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                        <Check className="w-3.5 h-3.5" />
                        <span>Alternative suggested for admin review</span>
                      </div>
                    ) : activeSuggestionIdx === idx ? (
                      <div className="space-y-2 p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                        <div className="flex items-center justify-between text-xs text-slate-300 font-semibold">
                          <span>Suggest alternative German translation:</span>
                          <button
                            type="button"
                            onClick={() => {
                              setActiveSuggestionIdx(null);
                              setSuggestionMsg(null);
                            }}
                            className="text-slate-400 hover:text-white p-1"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={suggestionInput}
                            onChange={(e) => setSuggestionInput(e.target.value)}
                            placeholder="Enter valid alternative German sentence..."
                            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                            disabled={suggestionLoading}
                          />
                          <button
                            type="button"
                            disabled={suggestionLoading || !suggestionInput.trim()}
                            onClick={() => handleSuggestionSubmit(result, idx)}
                            className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5 transition shrink-0"
                          >
                            {suggestionLoading ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <>
                                <Send className="w-3.5 h-3.5" />
                                <span>Submit</span>
                              </>
                            )}
                          </button>
                        </div>

                        <input
                          type="text"
                          value={suggestionNotes}
                          onChange={(e) => setSuggestionNotes(e.target.value)}
                          placeholder="Optional note: why is this translation valid / source reference..."
                          className="w-full bg-slate-900/70 border border-slate-800 rounded-lg px-2.5 py-1 text-[11px] text-slate-300 placeholder-slate-600 focus:outline-none focus:border-emerald-500/50"
                          disabled={suggestionLoading}
                        />

                        {suggestionMsg && (
                          <p
                            className={`text-xs ${
                              suggestionMsg.type === 'error' ? 'text-red-400' : 'text-emerald-400'
                            }`}
                          >
                            {suggestionMsg.text}
                          </p>
                        )}
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => openSuggestionModal(result, idx)}
                        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 hover:bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-800 hover:border-emerald-500/40 transition"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Suggest valid alternative translation</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
