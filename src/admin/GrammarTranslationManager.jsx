import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabaseClient';
import GrammarTranslationSuggestionsManager from './GrammarTranslationSuggestionsManager';
import {
  BookOpen,
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  Search,
  Filter,
  Layers,
  Sparkles,
  HelpCircle,
  CheckCircle,
  AlertCircle,
  Loader2,
  Upload,
  RefreshCw,
  Eye,
  ChevronDown,
  ChevronUp,
  MessageSquarePlus
} from 'lucide-react';

const DIFFICULTIES = ['Easy', 'Medium', 'Hard', 'Max'];
const LEVELS = ['A1', 'A2', 'B1', 'B2'];

export default function GrammarTranslationManager({ initialTab = 'topics' }) {
  const [mainTab, setMainTab] = useState(initialTab); // 'topics' | 'suggestions'
  const [pendingSuggestionsCount, setPendingSuggestionsCount] = useState(0);
  const [levelFilter, setLevelFilter] = useState('A1');
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Selected topic for question management
  const [selectedTopic, setSelectedTopic] = useState(null);

  // New topic modal / form state
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [topicForm, setTopicForm] = useState({
    level: 'A1',
    topic_number: 1,
    topic_title: '',
    description: '',
  });

  // Question editing / creation modal state
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [isNewQuestion, setIsNewQuestion] = useState(false);
  const [questionModalOpen, setQuestionModalOpen] = useState(false);

  // Filter & Search inside selected topic
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');

  // JSON batch import / export modal
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [jsonInput, setJsonInput] = useState('');

  const getAdminAuthHeaders = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const headers = { 'Content-Type': 'application/json' };
    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`;
    }
    return headers;
  };

  useEffect(() => {
    fetchPendingSuggestionsCount();
  }, [mainTab]);

  const fetchPendingSuggestionsCount = async () => {
    try {
      const headers = await getAdminAuthHeaders();
      const res = await fetch('/api/admin/grammar-translation/suggestions?count_only=true', { headers });
      const data = await res.json().catch(() => ({}));
      if (data?.pendingCount !== undefined) {
        setPendingSuggestionsCount(data.pendingCount);
      }
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    fetchTopics();
  }, [levelFilter]);

  const fetchTopics = async () => {
    setLoading(true);
    setError('');
    try {
      const headers = await getAdminAuthHeaders();
      const res = await fetch(`/api/admin/grammar-translation/topics?level=${levelFilter}`, {
        headers,
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (data.pending_migration) {
          setError('Database table "grammar_translation_topics" is not yet migrated in Supabase. Please execute supabase/grammar_translation_schema.sql.');
        } else {
          setError(data.error || 'Failed to load grammar topics');
        }
        setTopics([]);
      } else {
        const fetchedTopics = data.topics || [];
        setTopics(fetchedTopics);
        if (selectedTopic) {
          const updated = fetchedTopics.find((t) => t.id === selectedTopic.id);
          setSelectedTopic(updated || null);
        }
      }
    } catch (err) {
      setError(err.message || 'Error loading topics');
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------------------------------
  // Topic Management
  // --------------------------------------------------------------------------
  const handleCreateTopic = async (e) => {
    e.preventDefault();
    if (!topicForm.topic_title.trim()) {
      setError('Topic title is required.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const headers = await getAdminAuthHeaders();
      const res = await fetch('/api/admin/grammar-translation/topics', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          level: topicForm.level,
          topic_number: parseInt(topicForm.topic_number, 10) || 1,
          topic_title: topicForm.topic_title.trim(),
          description: topicForm.description.trim() || null,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create topic');
      }

      setSuccess(`Topic "${topicForm.topic_title}" created successfully!`);
      setShowTopicModal(false);
      setTopicForm({
        level: levelFilter,
        topic_number: (topics.length || 0) + 1,
        topic_title: '',
        description: '',
      });
      fetchTopics();
    } catch (err) {
      setError(err.message || 'Failed to create topic');
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------------------------------
  // Question Management (In-Topic)
  // --------------------------------------------------------------------------
  const openNewQuestionModal = () => {
    if (!selectedTopic) return;
    const nextIndex = (selectedTopic.questions || []).length + 1;
    const cleanLevel = selectedTopic.level.toLowerCase();
    const cleanNum = String(selectedTopic.topic_number).padStart(2, '0');
    const autoId = `gt-${cleanLevel}-t${cleanNum}-${String(nextIndex).padStart(3, '0')}`;

    setEditingQuestion({
      id: autoId,
      level: selectedTopic.level,
      topic: selectedTopic.topic_title,
      difficulty: 'Easy',
      english_sentence: '',
      target_german: '',
      accepted_answers: [],
      hints: {
        verbs: [],
        nouns: [],
        adjectives: [],
        notes: '',
      },
      explanation: '',
    });
    setIsNewQuestion(true);
    setQuestionModalOpen(true);
  };

  const openEditQuestionModal = (q) => {
    setEditingQuestion({
      ...q,
      english_sentence: (q.english_sentence || q.english_prompt || q.prompt || q.english || q.sentence || '').trim(),
      target_german: (q.target_german || q.german_sentence || q.german || q.correct_german || q.target || '').trim(),
      accepted_answers: Array.isArray(q.accepted_answers) ? q.accepted_answers : [],
      hints: {
        verbs: Array.isArray(q.hints?.verbs) ? q.hints.verbs : [],
        nouns: Array.isArray(q.hints?.nouns) ? q.hints.nouns : [],
        adjectives: Array.isArray(q.hints?.adjectives) ? q.hints.adjectives : [],
        notes: q.hints?.notes || '',
      },
      explanation: q.explanation || '',
    });
    setIsNewQuestion(false);
    setQuestionModalOpen(true);
  };

  const handleSaveQuestion = async (e) => {
    e.preventDefault();
    if (!editingQuestion.english_sentence.trim() || !editingQuestion.target_german.trim()) {
      alert('English sentence and target German answer are required.');
      return;
    }

    const currentList = Array.isArray(selectedTopic.questions) ? [...selectedTopic.questions] : [];
    let updatedList = [];

    const finalizedQuestion = {
      ...editingQuestion,
      english_sentence: editingQuestion.english_sentence.trim(),
      target_german: editingQuestion.target_german.trim(),
      accepted_answers: (editingQuestion.accepted_answers || [])
        .map((a) => String(a).trim())
        .filter(Boolean),
      hints: {
        verbs: (editingQuestion.hints?.verbs || []).map((v) => String(v).trim()).filter(Boolean),
        nouns: (editingQuestion.hints?.nouns || []).map((n) => String(n).trim()).filter(Boolean),
        adjectives: (editingQuestion.hints?.adjectives || []).map((a) => String(a).trim()).filter(Boolean),
        notes: (editingQuestion.hints?.notes || '').trim(),
      },
      explanation: (editingQuestion.explanation || '').trim(),
    };

    if (isNewQuestion) {
      updatedList = [...currentList, finalizedQuestion];
    } else {
      updatedList = currentList.map((q) => (q.id === finalizedQuestion.id ? finalizedQuestion : q));
    }

    await persistTopicQuestions(updatedList);
    setQuestionModalOpen(false);
  };

  const handleDeleteQuestion = async (qId) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;
    const currentList = Array.isArray(selectedTopic.questions) ? [...selectedTopic.questions] : [];
    const updatedList = currentList.filter((q) => q.id !== qId);
    await persistTopicQuestions(updatedList);
  };

  const persistTopicQuestions = async (questionsArray) => {
    setLoading(true);
    setError('');
    try {
      const headers = await getAdminAuthHeaders();
      const res = await fetch('/api/admin/grammar-translation/topics', {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          id: selectedTopic.id,
          questions: questionsArray,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save question bank update');
      }

      setSelectedTopic((prev) => ({
        ...prev,
        questions: questionsArray,
        question_count: questionsArray.length,
      }));
      setSuccess('Topic questions updated successfully!');
      fetchTopics();
    } catch (err) {
      setError(err.message || 'Failed to save question bank update');
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------------------------------
  // JSON Batch Import / Export
  // --------------------------------------------------------------------------
  const handleImportJson = async () => {
    try {
      const parsed = JSON.parse(jsonInput);
      if (!Array.isArray(parsed)) {
        alert('JSON must be an array of question objects.');
        return;
      }

      if (parsed.length === 0) {
        alert('JSON array is empty. Please provide at least one question.');
        return;
      }

      // Basic validation and field normalization
      const sanitized = parsed.map((item, idx) => {
        const english = String(
          item.english_sentence ||
          item.english_prompt ||
          item.prompt ||
          item.english ||
          item.sentence ||
          ''
        ).trim();

        const german = String(
          item.target_german ||
          item.german_sentence ||
          item.german ||
          item.correct_german ||
          item.target ||
          ''
        ).trim();

        return {
          id: item.id || `gt-${selectedTopic.level.toLowerCase()}-t${String(selectedTopic.topic_number).padStart(2, '0')}-${String(idx + 1).padStart(3, '0')}`,
          level: selectedTopic.level,
          topic: selectedTopic.topic_title,
          difficulty: DIFFICULTIES.includes(item.difficulty) ? item.difficulty : 'Easy',
          english_sentence: english,
          target_german: german,
          accepted_answers: Array.isArray(item.accepted_answers) ? item.accepted_answers : [],
          hints: {
            verbs: Array.isArray(item.hints?.verbs) ? item.hints.verbs : [],
            nouns: Array.isArray(item.hints?.nouns) ? item.hints.nouns : [],
            adjectives: Array.isArray(item.hints?.adjectives) ? item.hints.adjectives : [],
            notes: item.hints?.notes || '',
          },
          explanation: item.explanation || '',
        };
      });

      // Strict validation: verify that all questions have non-blank English and German sentences
      const missingEnglishIdx = sanitized.findIndex((q) => !q.english_sentence);
      if (missingEnglishIdx !== -1) {
        alert(
          `Import rejected: Question #${missingEnglishIdx + 1} (${sanitized[missingEnglishIdx].id}) is missing an English prompt ("english_sentence" or "prompt"). Every question must have an English sentence.`
        );
        return;
      }

      const missingGermanIdx = sanitized.findIndex((q) => !q.target_german);
      if (missingGermanIdx !== -1) {
        alert(
          `Import rejected: Question #${missingGermanIdx + 1} (${sanitized[missingGermanIdx].id}) is missing a primary German translation ("target_german" or "german"). Every question must have an official German answer.`
        );
        return;
      }

      await persistTopicQuestions(sanitized);
      setShowJsonModal(false);
      setJsonInput('');
      alert(`Imported ${sanitized.length} questions successfully!`);
    } catch (err) {
      alert('Invalid JSON: ' + err.message);
    }
  };

  // Filtered Questions in view
  const filteredQuestions = useMemo(() => {
    if (!selectedTopic || !Array.isArray(selectedTopic.questions)) return [];
    let list = selectedTopic.questions;

    if (difficultyFilter !== 'All') {
      list = list.filter((q) => q.difficulty === difficultyFilter);
    }

    if (searchQuery.trim()) {
      const qLower = searchQuery.toLowerCase();
      list = list.filter(
        (q) =>
          (q.english_sentence || '').toLowerCase().includes(qLower) ||
          (q.target_german || '').toLowerCase().includes(qLower) ||
          (q.id || '').toLowerCase().includes(qLower)
      );
    }

    return list;
  }, [selectedTopic, difficultyFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Top Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          type="button"
          onClick={() => setMainTab('topics')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            mainTab === 'topics'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Topics & Question Banks</span>
        </button>

        <button
          type="button"
          onClick={() => setMainTab('suggestions')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            mainTab === 'suggestions'
              ? 'bg-emerald-500 text-slate-950 shadow-md'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <MessageSquarePlus className="w-4 h-4" />
          <span>Student Suggestions Queue</span>
          {pendingSuggestionsCount > 0 && (
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                mainTab === 'suggestions'
                  ? 'bg-slate-950 text-emerald-400'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}
            >
              {pendingSuggestionsCount}
            </span>
          )}
        </button>
      </div>

      {mainTab === 'suggestions' ? (
        <GrammarTranslationSuggestionsManager />
      ) : (
        <>
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <Layers className="w-8 h-8 text-amber-500" />
            Grammar Translation Manager
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage CEFR-level sentence translation topics, difficulty-tiered question banks, hints, and accepted answers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchTopics}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition flex items-center gap-2 text-sm"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              setTopicForm({
                level: levelFilter,
                topic_number: (topics.length || 0) + 1,
                topic_title: '',
                description: '',
              });
              setShowTopicModal(true);
            }}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition flex items-center gap-2 text-sm shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Topic</span>
          </button>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-3 text-red-400 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center gap-3 text-emerald-400 text-sm">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Level Filter Tabs */}
      <div className="flex gap-2 border-b border-slate-800 pb-3">
        {LEVELS.map((lvl) => (
          <button
            key={lvl}
            type="button"
            onClick={() => {
              setLevelFilter(lvl);
              setSelectedTopic(null);
            }}
            className={`px-5 py-2 rounded-xl text-sm font-bold transition ${
              levelFilter === lvl
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Level {lvl}
          </button>
        ))}
      </div>

      {/* Two Column Layout: Topics on Left, Questions on Right */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Topic List (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-500" />
                Topics ({topics.length})
              </h2>
              <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Level {levelFilter}</span>
            </div>

            {loading && topics.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-xs">
                <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-amber-500" />
                Loading topics...
              </div>
            ) : topics.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl p-4">
                No topics configured for Level {levelFilter} yet. Click "Add New Topic" to create one.
              </div>
            ) : (
              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                {topics.map((t) => {
                  const isSelected = selectedTopic?.id === t.id;
                  const qCount = Array.isArray(t.questions) ? t.questions.length : t.question_count || 0;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setSelectedTopic(t)}
                      className={`w-full text-left p-3.5 rounded-xl border transition flex items-center justify-between ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-500/50 text-white shadow-sm'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="truncate pr-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-extrabold text-amber-400 font-mono">
                            #{t.topic_number}
                          </span>
                          <span className="text-sm font-bold truncate">{t.topic_title}</span>
                        </div>
                        {t.description && (
                          <p className="text-[11px] text-slate-500 truncate mt-0.5">{t.description}</p>
                        )}
                      </div>
                      <span className="shrink-0 text-xs font-mono font-bold bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800 text-slate-400">
                        {qCount} Qs
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Question Bank of Selected Topic (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          {!selectedTopic ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-500 shadow-xl">
              <Layers className="w-10 h-10 mx-auto text-slate-700 mb-3" />
              <h3 className="text-lg font-bold text-slate-300 mb-1">No Topic Selected</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Select a topic from the left panel to inspect, add, edit, or import its question bank.
              </p>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
              {/* Topic Subheader */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/30">
                      Topic #{selectedTopic.topic_number}
                    </span>
                    <h2 className="text-xl font-extrabold text-white">{selectedTopic.topic_title}</h2>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Total in Question Bank: <strong className="text-white">{selectedTopic.question_count || 0} questions</strong> (Admin visibility only)
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setJsonInput(JSON.stringify(selectedTopic.questions || [], null, 2));
                      setShowJsonModal(true);
                    }}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>JSON Import/Export</span>
                  </button>
                  <button
                    type="button"
                    onClick={openNewQuestionModal}
                    className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Question</span>
                  </button>
                </div>
              </div>

              {/* Filters & Search within Topic */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs">
                <div className="flex items-center gap-2 flex-1 min-w-[220px]">
                  <Search className="w-3.5 h-3.5 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search English sentence or German answer..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent border-none text-white text-xs focus:outline-none w-full placeholder-slate-600"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-500 text-[11px] font-bold">Difficulty:</span>
                  <select
                    value={difficultyFilter}
                    onChange={(e) => setDifficultyFilter(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-md px-2 py-1 text-xs text-white focus:outline-none"
                  >
                    <option value="All">All Difficulties</option>
                    {DIFFICULTIES.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Questions List */}
              {filteredQuestions.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl">
                  No questions match your filter. Click "Add Question" to start building this topic bank.
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                  {filteredQuestions.map((q, idx) => (
                    <div
                      key={q.id || idx}
                      className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2 hover:border-slate-700 transition"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-[10px] text-slate-500">{q.id}</span>
                            <span
                              className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                                q.difficulty === 'Easy'
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                  : q.difficulty === 'Medium'
                                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                                  : q.difficulty === 'Hard'
                                  ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                              }`}
                            >
                              {q.difficulty || 'Easy'}
                            </span>
                          </div>

                          <p className="text-sm font-bold text-white leading-snug">
                            {q.english_sentence ? (
                              q.english_sentence
                            ) : (
                              <span className="text-rose-400 font-semibold flex items-center gap-1">
                                <AlertCircle className="w-3.5 h-3.5" />
                                Missing English Prompt
                              </span>
                            )}
                          </p>
                          <p className="text-sm text-emerald-300 font-semibold leading-snug">
                            {q.target_german ? (
                              q.target_german
                            ) : (
                              <span className="text-rose-400 font-semibold flex items-center gap-1">
                                <AlertCircle className="w-3.5 h-3.5" />
                                Missing German Answer
                              </span>
                            )}
                          </p>

                          {q.accepted_answers && q.accepted_answers.length > 0 && (
                            <div className="text-[11px] text-slate-400 flex items-center gap-1.5 flex-wrap pt-0.5">
                              <span className="text-slate-500 font-semibold">Accepted:</span>
                              {q.accepted_answers.map((alt, aIdx) => (
                                <span key={aIdx} className="bg-slate-900 px-1.5 py-0.5 rounded text-slate-300">
                                  {alt}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => openEditQuestionModal(q)}
                            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteQuestion(q.id)}
                            className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-lg transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Hints & Explanation Preview */}
                      {(q.hints?.verbs?.length > 0 || q.hints?.nouns?.length > 0 || q.explanation) && (
                        <div className="pt-2 border-t border-slate-900 flex flex-wrap gap-2 text-[11px]">
                          {q.hints?.verbs?.map((v, vIdx) => (
                            <span key={vIdx} className="bg-blue-500/10 text-blue-300 px-2 py-0.5 rounded border border-blue-500/20 font-mono">
                              Verb: {v}
                            </span>
                          ))}
                          {q.hints?.nouns?.map((n, nIdx) => (
                            <span key={nIdx} className="bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded border border-amber-500/20 font-mono">
                              Noun: {n}
                            </span>
                          ))}
                          {q.explanation && (
                            <span className="text-slate-500 italic truncate max-w-md">
                              Note: {q.explanation}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ---------------------------------------------------------------------- */}
      {/* MODAL 1: Create New Topic */}
      {/* ---------------------------------------------------------------------- */}
      {showTopicModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Create New Grammar Topic</h3>
              <button
                type="button"
                onClick={() => setShowTopicModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTopic} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Level</label>
                <select
                  value={topicForm.level}
                  onChange={(e) => setTopicForm({ ...topicForm, level: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                >
                  {LEVELS.map((lvl) => (
                    <option key={lvl} value={lvl}>
                      Level {lvl}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Topic Number / Order</label>
                <input
                  type="number"
                  min="1"
                  value={topicForm.topic_number}
                  onChange={(e) => setTopicForm({ ...topicForm, topic_number: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Topic Title</label>
                <input
                  type="text"
                  placeholder="e.g. Nominativ Sentences"
                  value={topicForm.topic_title}
                  onChange={(e) => setTopicForm({ ...topicForm, topic_title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Description (Optional)</label>
                <textarea
                  rows="2"
                  placeholder="Brief note on what grammar rules or sentence structures this topic drills..."
                  value={topicForm.description}
                  onChange={(e) => setTopicForm({ ...topicForm, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowTopicModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded-lg hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg transition"
                >
                  {loading ? 'Creating...' : 'Create Topic'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* MODAL 2: Add / Edit Question */}
      {/* ---------------------------------------------------------------------- */}
      {questionModalOpen && editingQuestion && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white">
                  {isNewQuestion ? 'Add New Question' : 'Edit Question'}
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">{editingQuestion.id}</p>
              </div>
              <button
                type="button"
                onClick={() => setQuestionModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuestion} className="space-y-4 text-xs">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Difficulty</label>
                  <select
                    value={editingQuestion.difficulty}
                    onChange={(e) => setEditingQuestion({ ...editingQuestion, difficulty: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                  >
                    {DIFFICULTIES.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Question ID (Stable Anchor)</label>
                  <input
                    type="text"
                    value={editingQuestion.id}
                    onChange={(e) => setEditingQuestion({ ...editingQuestion, id: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">English Sentence (Prompt)</label>
                <input
                  type="text"
                  placeholder="e.g. The teacher is friendly."
                  value={editingQuestion.english_sentence}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, english_sentence: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Primary Official German Answer</label>
                <input
                  type="text"
                  placeholder="e.g. Der Lehrer ist freundlich."
                  value={editingQuestion.target_german}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, target_german: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">
                  Accepted Alternative Answers (Comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Die Lehrerin ist freundlich., Der Lehrer ist nett."
                  value={(editingQuestion.accepted_answers || []).join(', ')}
                  onChange={(e) =>
                    setEditingQuestion({
                      ...editingQuestion,
                      accepted_answers: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              {/* Hints Box */}
              <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-3">
                <span className="font-bold text-amber-400 text-xs flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Hints Configuration (Must never reveal conjugated target answer)
                </span>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 text-[11px] font-semibold mb-1">
                      Verb Hints (Infinitive — Meaning)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. sein — to be"
                      value={(editingQuestion.hints?.verbs || []).join(', ')}
                      onChange={(e) =>
                        setEditingQuestion({
                          ...editingQuestion,
                          hints: {
                            ...editingQuestion.hints,
                            verbs: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                          },
                        })
                      }
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono text-[11px]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 text-[11px] font-semibold mb-1">
                      Noun Hints (Article + Singular — Meaning)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. der Lehrer — teacher"
                      value={(editingQuestion.hints?.nouns || []).join(', ')}
                      onChange={(e) =>
                        setEditingQuestion({
                          ...editingQuestion,
                          hints: {
                            ...editingQuestion.hints,
                            nouns: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                          },
                        })
                      }
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono text-[11px]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">
                  Grammar Explanation (Shown on Detailed Review or mistakes)
                </label>
                <textarea
                  rows="2"
                  placeholder="e.g. 'der Lehrer' takes Nominative masculine; verb 'sein' conjugates to 'ist' in position 2."
                  value={editingQuestion.explanation}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, explanation: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setQuestionModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded-lg hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg transition"
                >
                  {loading ? 'Saving...' : 'Save Question'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* MODAL 3: JSON Batch Import / Export */}
      {/* ---------------------------------------------------------------------- */}
      {showJsonModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">JSON Batch Import / Export</h3>
              <button
                type="button"
                onClick={() => setShowJsonModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Paste an array of question objects to replace or bulk-populate questions for{' '}
              <strong className="text-white">{selectedTopic?.topic_title}</strong>.
            </p>

            <textarea
              rows="12"
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white font-mono text-xs focus:outline-none focus:border-amber-500"
              placeholder='[ { "id": "gt-a1-t01-001", "difficulty": "Easy", "english_sentence": "...", "target_german": "...", "accepted_answers": [], "hints": { "verbs": [], "nouns": [] }, "explanation": "..." } ]'
            />

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowJsonModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded-lg hover:bg-slate-700 text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleImportJson}
                disabled={loading || !jsonInput.trim()}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold rounded-lg transition text-xs shadow-md"
              >
                {loading ? 'Processing...' : 'Apply JSON to Topic'}
              </button>
            </div>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
}
