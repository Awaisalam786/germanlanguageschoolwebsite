"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import {
  CheckSquare, BookOpen, Key, User,
  ArrowRight, Loader2, PlayCircle, CheckCircle, AlertCircle, Trophy,
  LogOut, LayoutDashboard, Languages, MessageCircle, Brain, Volume2
} from 'lucide-react';
import Link from 'next/link';
import ChapterVocabEngine from '../components/ChapterVocabEngine';
import ReadingTestEngine from '../components/ReadingTestEngine';
import AlphabetNumbersEngine from '../components/AlphabetNumbersEngine';
import GrammarEngine from '../components/GrammarEngine';

export default function PracticeTests() {
  // Navigation Steps:
  // 1 = Identity Choice
  // 1.1 = Free Form
  // 1.2 = Student Code
  // 1.3 = Student Name
  // 2 = Level Selection
  // 3 = Category Selection
  // 4 = Content (Test List or Placeholder)
  // 5 = Test Runner
  // 6 = Result
  const [step, setStep] = useState(1); 
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Auth & Profile
  const [userType, setUserType] = useState(''); // 'free' | 'student' | 'anonymous'
  const [authUser, setAuthUser] = useState(null);
  const [authMode, setAuthMode] = useState('signup'); // 'signup' | 'signin'
  const [learnerForm, setLearnerForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [storedFreeUser, setStoredFreeUser] = useState(null);
  const [accessCode, setAccessCode] = useState('');
  const [verifiedCode, setVerifiedCode] = useState(null);
  const [studentName, setStudentName] = useState('');
  const [batchName, setBatchName] = useState('');

  // Practice Test Navigation
  const [materials, setMaterials] = useState([]);
  const [readingPassages, setReadingPassages] = useState([]);
  const [progressAttempts, setProgressAttempts] = useState([]);

  // Fetch attempts securely with Bearer token for authenticated learners
  useEffect(() => {
    if (step !== 3 || userType !== 'free') {
      setProgressAttempts([]);
      return;
    }
    let active = true;
    const fetchUserProgress = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token) return;
        const res = await fetch('/api/my-progress', {
          headers: { Authorization: `Bearer ${session.access_token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (active) setProgressAttempts(data.attempts || []);
        }
      } catch (e) {
        console.error('Error fetching progress:', e);
      }
    };
    fetchUserProgress();
    return () => { active = false; };
  }, [step, userType]);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null); // 'Vocab Test', 'Grammar Test', 'Reading Test', 'Speaking Test'
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [htmlTestsEnabled, setHtmlTestsEnabled] = useState(true);

  // Test Runner State
  const [htmlContent, setHtmlContent] = useState('');
  const [htmlLoading, setHtmlLoading] = useState(false);
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    fetchMaterials();

    // Check for existing Supabase Auth session first
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const user = session.user;
        const profile = {
          id: user.id,
          name: user.user_metadata?.name || user.email?.split('@')[0],
          email: user.email,
          phone: user.user_metadata?.phone || '',
        };
        setAuthUser(user);
        setStoredFreeUser(profile);
        setUserType('free');
        setStep(2); // Skip directly to level selection
      } else {
        // Fallback: check localStorage for saved session
        const savedUser = localStorage.getItem('gls_free_user');
        if (savedUser) {
          try {
            setStoredFreeUser(JSON.parse(savedUser));
            setUserType('free');
            setStep(2);
          } catch (e) {
            console.error(e);
          }
        }
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const user = session.user;
        const profile = {
          id: user.id,
          name: user.user_metadata?.name || user.email?.split('@')[0],
          email: user.email,
          phone: user.user_metadata?.phone || '',
        };
        setAuthUser(user);
        setStoredFreeUser(profile);
      } else {
        setAuthUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchMaterials = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('practice_materials')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setMaterials(data);
    }
    
    // Fetch Reading Passages
    const { data: readingData, error: readingError } = await supabase
      .from('reading_passages')
      .select('*')
      .order('passage_id', { ascending: true });
      
    if (!readingError && readingData) {
      setReadingPassages(readingData);
    }
    
    // Fetch Settings
    const { data: settingsData } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'html_tests_enabled')
      .single();
      
    if (settingsData) {
      setHtmlTestsEnabled(settingsData.value === 'true');
    }
    
    setLoading(false);
  };

  // --- Session Reset (CRITICAL) ---
  const resetTestSession = () => {
    setSelectedMaterial(null);
    setHtmlContent('');
    setTestResult(null);
    setHtmlLoading(false);
    setErrorMsg('');
  };

  // --- Auth Handlers ---
  const handleLearnerSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/learner-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: learnerForm.name,
          email: learnerForm.email,
          password: learnerForm.password,
          phone: learnerForm.phone
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create account');

      const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({
        email: learnerForm.email.trim(),
        password: learnerForm.password
      });

      if (signInErr) throw signInErr;

      const user = signInData.user;
      const profile = {
        id: user.id,
        name: learnerForm.name || user.email.split('@')[0],
        email: user.email,
        phone: learnerForm.phone || ''
      };
      localStorage.setItem('gls_free_user', JSON.stringify(profile));
      setStoredFreeUser(profile);
      setAuthUser(user);
      setUserType('free');
      setStep(2);
    } catch (err) {
      setErrorMsg(err.message || 'Error creating account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLearnerSignin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: learnerForm.email.trim(),
        password: learnerForm.password
      });

      if (error) throw error;

      const user = data.user;
      const profile = {
        id: user.id,
        name: user.user_metadata?.name || user.email.split('@')[0],
        email: user.email,
        phone: user.user_metadata?.phone || ''
      };
      localStorage.setItem('gls_free_user', JSON.stringify(profile));
      setStoredFreeUser(profile);
      setAuthUser(user);
      setUserType('free');
      setStep(2);
    } catch (err) {
      setErrorMsg(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const startGuestPractice = () => {
    setErrorMsg('');
    setStoredFreeUser(null);
    setUserType('anonymous');
    setStep(2);
  };

  const verifyAccessCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const { data, error } = await supabase.rpc('check_batch_code', { code_input: accessCode.trim() });
      if (error) throw error;
      if (data && data.length > 0) {
        setVerifiedCode(accessCode.trim());
        setBatchName(data[0].batch_name);
        setStep(1.3);
      } else {
        setErrorMsg('Batch code not recognized or inactive. Please check with admin.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Error verifying code. Please try again.');
    }
    setLoading(false);
  };

  const handleStudentNameSubmit = (e) => {
    e.preventDefault();
    setStep(2); // Go to level selection
  };

  const handleLogout = async () => {
    if (userType === 'free') {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.error(e);
      }
      localStorage.removeItem('gls_free_user');
      setStoredFreeUser(null);
      setAuthUser(null);
    }
    setStep(1);
    setUserType('');
    setAccessCode('');
    setVerifiedCode(null);
    setStudentName('');
    resetTestSession();
  };

  // --- Navigation Handlers ---
  const navigateToCategorySelection = (level) => {
    setSelectedLevel(level);
    resetTestSession();
    setStep(3);
  };

  const navigateToContent = (category) => {
    setSelectedCategory(category);
    resetTestSession();
    setStep(4);
  };

  const navigateToTest = (mat) => {
    resetTestSession();
    setSelectedMaterial(mat);
    setStep(5);
  };

  const goBackToLevel = () => {
    resetTestSession();
    setSelectedLevel(null);
    setStep(2);
  };

  const goBackToCategory = () => {
    resetTestSession();
    setSelectedCategory(null);
    setStep(3);
  };

  // --- Test Runner ---
  useEffect(() => {
    if (step !== 5 || !selectedMaterial) return;

    const loadHtml = async () => {
      setHtmlLoading(true);
      setHtmlContent('');
      try {
        const res = await fetch(`/api/serve-test/${selectedMaterial.id}`);
        if (!res.ok) {
          const fallbackRes = await fetch(selectedMaterial.file_url);
          if (!fallbackRes.ok) throw new Error('Failed to load test file');
          setHtmlContent(await fallbackRes.text());
          return;
        }
        setHtmlContent(await res.text());
      } catch (err) {
        console.error('[loadHtml] Error:', err);
        alert(`Could not load test: ${err.message}`);
        setStep(4); // Fallback to list
      } finally {
        setHtmlLoading(false);
      }
    };

    loadHtml();

    const handleMessage = async (event) => {
      const data = event.data;
      if (data && data.type === 'PRACTICE_TEST_COMPLETE') {
        await saveAttempt(data.score, data.totalMarks, data.answers, false);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [step, selectedMaterial]);

  // --- Save Attempt ---
  const saveAttempt = async (score, totalMarks, answers, isFallback) => {
    setLoading(true);
    const isComplete = !isFallback && totalMarks > 0;
    const percentage = isComplete ? Math.round((score / totalMarks) * 100) : null;

    const payload = {
      material_id: selectedMaterial?.id || null,
      user_type: userType, // 'free' or 'student'
      score: isComplete ? score : null,
      total_marks: isComplete ? totalMarks : null,
      percentage: percentage,
      answers: answers || null,
      country: 'Pakistan',
    };

    if (userType === 'student') {
      payload.access_code_used = verifiedCode;
      payload.batch_name = batchName;
      payload.student_name = studentName;
      payload.first_name = studentName;
    } else {
      payload.first_name = storedFreeUser?.name || 'Learner';
      payload.phone = storedFreeUser?.phone || 'N/A';
      payload.email = storedFreeUser?.email || null;
      payload.user_id = authUser?.id || storedFreeUser?.id || null;
    }

    try {
      const headers = { 'Content-Type': 'application/json' };
      if (userType !== 'student') {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
          headers['Authorization'] = `Bearer ${session.access_token}`;
        }
      }

      const res = await fetch('/api/save-attempt', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Save failed');

      setTestResult({ score, totalMarks, percentage, isFallback, userType });
      setStep(6);
    } catch (err) {
      console.error('[saveAttempt] Error:', err);
      alert(`Error saving result: ${err.message}\n\nPlease screenshot your result and contact admin.`);
    }
    setLoading(false);
  };

  // --- Data Selectors ---
  const getLevels = () => {
    // Return explicit base levels, plus any other custom levels found in materials
    const defaultLevels = ['A1', 'A2', 'B1', 'B2'];
    const activeLevels = new Set(materials.map(m => m.level));
    defaultLevels.forEach(l => activeLevels.add(l));
    return Array.from(activeLevels).sort();
  };

  const extractChapterNumber = (title) => {
    const match = title.match(/Chapter\s*(\d+)/i);
    return match ? parseInt(match[1], 10) : 999;
  };

  const filteredTests = materials
    .filter(m => m.level === selectedLevel && m.test_type === selectedCategory)
    .sort((a, b) => extractChapterNumber(a.title) - extractChapterNumber(b.title));

  const renderReadingPassages = () => {
    const normalizedLevel = String(selectedLevel || '').trim().toUpperCase();
    const levelPassages = readingPassages.filter(
      passage => String(passage.level || '').trim().toUpperCase() === normalizedLevel
    );
    const questionCount = passage => Array.isArray(passage.questions) ? passage.questions.length : 0;
    const totalQuestions = levelPassages.reduce((total, passage) => total + questionCount(passage), 0);

    if (levelPassages.length === 0) {
      return (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8 text-center shadow-xl sm:p-12">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-400/10">
            <BookOpen className="h-8 w-8 text-blue-300" />
          </div>
          <h2 className="text-xl font-bold text-white">Reading passages are on the way</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-400">
            There are no reading passages available for {selectedLevel} right now. Please check back soon or choose another skill.
          </p>
          <button onClick={goBackToCategory} className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-slate-600 hover:bg-slate-700">
            &larr; Back to skills
          </button>
        </div>
      );
    }

    const grouped = levelPassages.reduce((groups, passage) => {
      const chapter = String(passage.chapter_reference || '').trim() || 'Other';
      if (!groups[chapter]) groups[chapter] = [];
      groups[chapter].push(passage);
      return groups;
    }, {});

    const sortedChapters = Object.keys(grouped).sort((a, b) => {
      if (a === 'Other') return 1;
      if (b === 'Other') return -1;
      const numberA = Number((a.match(/\d+/) || [])[0]);
      const numberB = Number((b.match(/\d+/) || [])[0]);
      if (numberA && numberB && numberA !== numberB) return numberA - numberB;
      return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
    });

    return (
      <div className="space-y-8">
        <section className="relative isolate overflow-hidden rounded-3xl border border-blue-400/20 bg-gradient-to-br from-[#101c35] via-slate-900 to-slate-950 px-5 py-6 shadow-xl sm:px-8 sm:py-8">
          <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-20 -z-10 h-56 w-56 rounded-full bg-blue-400/10 blur-3xl" />
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-200">
                <BookOpen className="h-3.5 w-3.5" /> Reading practice
              </span>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                {selectedLevel} <span className="text-amber-400">Reading</span>
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-slate-300 sm:text-base">
                Choose a passage, read at your own pace, then answer a few questions to check your understanding.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:min-w-56">
              <div className="rounded-2xl border border-slate-700/80 bg-slate-950/60 px-4 py-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Passages</p>
                <p className="mt-1 text-2xl font-extrabold text-white">{levelPassages.length}</p>
              </div>
              <div className="rounded-2xl border border-slate-700/80 bg-slate-950/60 px-4 py-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Questions</p>
                <p className="mt-1 text-2xl font-extrabold text-blue-300">{totalQuestions}</p>
              </div>
            </div>
          </div>
        </section>

        {sortedChapters.map(chapter => {
          const passages = [...grouped[chapter]].sort((a, b) => {
            const idA = Number(a.passage_id ?? a.id ?? 0);
            const idB = Number(b.passage_id ?? b.id ?? 0);
            return idA - idB;
          });
          const chapterLabel = chapter === 'Other'
            ? 'Additional passages'
            : /^\d+$/.test(chapter) ? `Chapter ${chapter}` : chapter;

          return (
            <section key={chapter} aria-labelledby={`reading-chapter-${chapter.replace(/[^a-z0-9]/gi, '-')}`}>
              <div className="mb-4 flex flex-wrap items-end justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-400/10"><BookOpen className="h-5 w-5 text-blue-300" /></span>
                  <div>
                    <h2 id={`reading-chapter-${chapter.replace(/[^a-z0-9]/gi, '-')}`} className="text-lg font-bold text-white sm:text-xl">{chapterLabel}</h2>
                    <p className="mt-0.5 text-xs text-slate-500">Passages to build your reading confidence</p>
                  </div>
                </div>
                <span className="rounded-full border border-slate-800 bg-slate-900 px-3 py-1 text-xs font-medium text-slate-400">{passages.length} {passages.length === 1 ? 'passage' : 'passages'}</span>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {passages.map((passage, index) => {
                  const passageQuestions = questionCount(passage);
                  const excerpt = String(passage.passage_text || '').replace(/\s+/g, ' ').trim();
                  const preview = excerpt.length > 132 ? `${excerpt.slice(0, 132).trimEnd()}…` : excerpt;

                  return (
                    <article key={passage.id || passage.passage_id || `${chapter}-${index}`} className="group relative flex min-h-[260px] flex-col overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-5 shadow-lg shadow-black/10 transition duration-200 hover:-translate-y-1 hover:border-blue-400/40 hover:shadow-xl hover:shadow-blue-950/30">
                      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500/70 via-cyan-400/60 to-transparent opacity-70 transition group-hover:opacity-100" />
                      <div className="mb-5 flex items-center justify-between gap-3">
                        <span className="inline-flex h-11 min-w-11 items-center justify-center rounded-xl border border-blue-400/25 bg-blue-400/10 px-2 text-sm font-extrabold text-blue-300">{passage.level || selectedLevel}</span>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-950/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400"><BookOpen className="h-3 w-3 text-blue-300" /> Reading</span>
                      </div>
                      <h3 className="text-lg font-bold leading-snug text-white transition-colors group-hover:text-blue-200">{passage.passage_title || 'Untitled passage'}</h3>
                      <p className="mt-2 line-clamp-3 min-h-[3.75rem] text-sm leading-relaxed text-slate-400">{preview || 'Read this short German passage and answer the questions to practice comprehension.'}</p>
                      <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-800/90 pt-4">
                        <span className="inline-flex items-center gap-2 text-xs font-medium text-slate-400"><CheckSquare className="h-4 w-4 text-blue-300" />{passageQuestions} {passageQuestions === 1 ? 'question' : 'questions'}</span>
                        <button onClick={() => { setSelectedMaterial(passage); setStep('reading_engine'); }} aria-label={`Start reading test: ${passage.passage_title || 'Untitled passage'}`} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-blue-500 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-950/30 transition hover:bg-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300">
                          Start reading <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 flex flex-col">

      {/* Top Right Navigation for logged-in users & students */}
      {step >= 2 && step !== 5 && (
        <div className="absolute top-4 right-4 sm:top-8 sm:right-8 flex items-center gap-3 z-40">
          {userType === 'free' && (
            <Link href="/dashboard" className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors bg-slate-900 border border-slate-800 px-4 py-2 rounded-lg shadow-lg">
              <LayoutDashboard className="w-4 h-4 text-amber-500" />
              My Progress
            </Link>
          )}
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-red-400 transition-colors bg-slate-900 border border-slate-800 px-4 py-2 rounded-lg"
          >
            <LogOut className="w-4 h-4" />
            Logout {userType === 'student' ? (studentName ? `(${studentName})` : '(Student)') : userType === 'anonymous' ? '(Guest)' : storedFreeUser?.name ? `(${storedFreeUser.name})` : '(Learner)'}
          </button>
        </div>
      )}

      {/* ───── STEP 1: Identity Choice ───── */}
      {step === 1 && (
        <div className="max-w-3xl mx-auto space-y-8 animate-fade-in mt-12">
          <div className="text-center space-y-3">
            {/* Page H1 (this is the step the server renders for /practice-tests).
                Styled as the existing pill so the design is unchanged. */}
            <h1 className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/30">
              Free German Practice Tests (A1–B2)
            </h1>
            <h2 className="text-4xl font-extrabold text-white">Before You Begin</h2>
            <p className="text-sm text-slate-300">Choose how you want to track your progress.</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl text-center hover:border-amber-500/70 transition-all group shadow-lg hover:shadow-amber-500/10 flex flex-col justify-between">
              <div>
                <div className="w-16 h-16 mx-auto bg-amber-500/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-amber-500/20">
                  <User className="w-8 h-8 text-amber-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Public Learner Account</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Sign up or log in to automatically save your scores to your personal account, track level-wise progress, and build your practice streak.
                </p>
              </div>
              <div className="mt-6 space-y-2.5">
                <button
                  onClick={() => { setAuthMode('signup'); setUserType('free'); setErrorMsg(''); setStep(1.1); }}
                  className="w-full rounded-xl bg-amber-400 px-4 py-3 text-sm font-extrabold text-slate-950 transition hover:bg-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200"
                >
                  Create Learner Account <ArrowRight className="ml-1 inline h-4 w-4" />
                </button>
                <button
                  onClick={() => { setAuthMode('signin'); setUserType('free'); setErrorMsg(''); setStep(1.1); }}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-xs font-bold text-slate-200 transition hover:bg-slate-700 hover:text-white"
                >
                  Already have an account? Sign In
                </button>
                <button
                  onClick={startGuestPractice}
                  className="pt-2 text-xs font-semibold text-slate-400 underline decoration-slate-600 underline-offset-4 transition hover:text-white"
                >
                  Practice as guest without saving
                </button>
              </div>
            </div>

            <button
              onClick={() => { setUserType('student'); setErrorMsg(''); setStep(1.2); }}
              className="p-8 bg-slate-900 border border-slate-800 rounded-2xl text-center hover:border-emerald-500 hover:bg-emerald-500/5 transition-all group shadow-lg hover:shadow-emerald-500/10 flex flex-col justify-between"
            >
              <div>
                <div className="w-16 h-16 mx-auto bg-emerald-500/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-emerald-500/20">
                  <Key className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">I'm an Enrolled Student</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Use your student batch access code to practice tests assigned by your teacher. Your results will be saved directly for teacher review.
                </p>
              </div>
              <div className="mt-6 w-full">
                <span className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-slate-950 transition group-hover:bg-emerald-400">
                  Enter Student Code <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* STEP 1.1: Public Learner Auth (Sign Up / Sign In) */}
      {step === 1.1 && (
        <div className="max-w-md mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl relative animate-fade-in mt-12">
          <button onClick={() => { setUserType(''); setErrorMsg(''); setStep(1); }} className="absolute top-4 right-4 text-xs text-slate-500 hover:text-white transition-colors">
            ← Change
          </button>

          <div className="text-center mb-6">
            <div className="w-12 h-12 mx-auto bg-amber-500/10 rounded-xl flex items-center justify-center mb-3 border border-amber-500/20">
              <User className="w-6 h-6 text-amber-400" />
            </div>
            <h3 className="text-2xl font-extrabold text-white">
              {authMode === 'signup' ? 'Create Learner Account' : 'Learner Sign In'}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {authMode === 'signup' 
                ? 'Save your practice scores, track CEFR progress, and continue anytime.' 
                : 'Sign in to access your saved attempts and learning history.'}
            </p>
          </div>

          {/* Toggle Tabs */}
          <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-xl mb-6 border border-slate-800">
            <button
              type="button"
              onClick={() => { setAuthMode('signup'); setErrorMsg(''); }}
              className={`py-2 text-xs font-bold rounded-lg transition-colors ${authMode === 'signup' ? 'bg-amber-400 text-slate-950 shadow' : 'text-slate-400 hover:text-white'}`}
            >
              New Account
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode('signin'); setErrorMsg(''); }}
              className={`py-2 text-xs font-bold rounded-lg transition-colors ${authMode === 'signin' ? 'bg-amber-400 text-slate-950 shadow' : 'text-slate-400 hover:text-white'}`}
            >
              Sign In
            </button>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-2 text-red-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <p>{errorMsg}</p>
            </div>
          )}

          <form onSubmit={authMode === 'signup' ? handleLearnerSignup : handleLearnerSignin} className="space-y-4">
            {authMode === 'signup' && (
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ali Ahmed"
                  value={learnerForm.name}
                  onChange={e => setLearnerForm({ ...learnerForm, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none"
                />
              </div>
            )}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Email Address *</label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={learnerForm.email}
                onChange={e => setLearnerForm({ ...learnerForm, email: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Password * (min 6 characters)</label>
              <input
                type="password"
                required
                minLength={6}
                placeholder="••••••••"
                value={learnerForm.password}
                onChange={e => setLearnerForm({ ...learnerForm, password: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
            {authMode === 'signup' && (
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Phone Number (optional)</label>
                <input
                  type="text"
                  placeholder="+92 300 1234567"
                  value={learnerForm.phone}
                  onChange={e => setLearnerForm({ ...learnerForm, phone: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none"
                />
              </div>
            )}
            <button
              disabled={loading}
              type="submit"
              className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg flex items-center justify-center gap-2 mt-4 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {authMode === 'signup' ? 'Create Account & Continue' : 'Sign In & Continue'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-slate-800 text-center">
            <button
              onClick={startGuestPractice}
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              Skip login and try a test as guest →
            </button>
          </div>
        </div>
      )}

      {/* STEP 1.2: Student Details Form */}
      {step === 1.2 && (
        <div className="max-w-md mx-auto animate-fade-in mt-12">
          <button onClick={() => { setUserType(''); setStep(1); }} className="mb-6 text-sm text-slate-400 hover:text-white flex items-center gap-2">
            &larr; Change User Type
          </button>
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6">
              <Key className="w-6 h-6 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-extrabold text-white mb-2">Student Access</h2>
            <p className="text-slate-400 text-sm mb-6">Enter your batch access code to proceed.</p>
            {errorMsg && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">{errorMsg}</div>}
            <form onSubmit={verifyAccessCode} className="space-y-4">
              <input type="text" required placeholder="e.g. GLS-XXXXX" value={accessCode} onChange={e => setAccessCode(e.target.value.toUpperCase())} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white font-mono text-lg tracking-wider focus:outline-none focus:border-emerald-500 transition-colors" />
              <button disabled={loading} type="submit" className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl flex justify-center items-center gap-2">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><CheckCircle className="w-5 h-5" /> Verify Code</>}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* STEP 1.3: ENTER STUDENT NAME */}
      {step === 1.3 && (
        <div className="max-w-md mx-auto animate-fade-in mt-12">
          <button onClick={() => setStep(1.2)} className="mb-6 text-sm text-slate-400 hover:text-white flex items-center gap-2">&larr; Back to code entry</button>
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6"><User className="w-6 h-6 text-emerald-400" /></div>
            <h2 className="text-2xl font-extrabold text-white mb-2">Almost there!</h2>
            <p className="text-slate-400 text-sm mb-6">You are joining <strong className="text-emerald-400">{batchName}</strong>. Please enter your name.</p>
            <form onSubmit={handleStudentNameSubmit} className="space-y-4">
              <input type="text" required placeholder="John Doe" value={studentName} onChange={e => setStudentName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500" />
              <button type="submit" className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl flex justify-center items-center gap-2">Continue to Level Selection <ArrowRight className="w-4 h-4" /></button>
            </form>
          </div>
        </div>
      )}

            {/* ───── STEP 2: Level Selection ───── */}
      {step === 2 && (
        <div className="max-w-6xl mx-auto w-full mt-4 flex-1 animate-fade-in">
          <section className="relative isolate min-h-[290px] overflow-hidden rounded-[2rem] border border-slate-800 bg-gradient-to-br from-[#101c35] via-slate-900 to-slate-950 px-6 py-10 sm:px-10 sm:py-12 lg:min-h-[330px] shadow-2xl shadow-black/30">
            <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-24 z-0 h-72 w-72 rounded-full bg-amber-500/15 blur-3xl" />
            <div aria-hidden="true" className="absolute inset-y-0 right-0 z-0 hidden w-[58%] items-end justify-end overflow-hidden sm:flex"><img src="/berlin-gate.png" alt="" className="h-full w-full object-contain object-right-bottom opacity-95" /><div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/40 to-transparent" /></div>
            <div className="relative z-10 max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-bold text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Welcome{(userType === 'student' ? studentName : storedFreeUser?.name) ? ', ' + (userType === 'student' ? studentName : storedFreeUser?.name) : ''}
              </span>
              <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl"><span className="text-amber-400">DE</span> Practice Center</h1>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">Master German with interactive tests and exercises. Choose your level and take the next step.</p>
              <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-400">
                <span className="inline-flex items-center gap-2"><BookOpen className="h-4 w-4 text-amber-400" /> Improve Skills</span>
                <span className="inline-flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-400" /> Practice at your own pace</span><span className="inline-flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-400" /> Exam Ready</span><span className="inline-flex items-center gap-2"><BookOpen className="h-4 w-4 text-pink-400" /> Learn Step by Step</span>
              </div>
            </div>
          {userType === 'free' && <Link href="/dashboard" className="relative z-10 mt-6 inline-flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-3 text-sm font-extrabold text-slate-950 shadow-lg shadow-amber-950/30 transition hover:bg-amber-300">View My Progress <ArrowRight className="h-4 w-4" /></Link>}</section>

          <div className="mb-5 mt-10 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-white">Select Your Level</h2>
              <p className="mt-1 text-sm text-slate-400">Choose the level that matches your German learning journey.</p>
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">CEFR learning levels</span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {getLevels().map((lvl, index) => {
              const levelMaterials = materials.filter(material => material.level === lvl);
              const levelReadings = readingPassages.filter(passage => passage.level === lvl);
              const testCount = levelMaterials.length + levelReadings.length;
              const levelInfo = {
                A1: { name: 'Beginner', detail: 'Start with the essentials', color: 'emerald' },
                A2: { name: 'Elementary', detail: 'Grow everyday fluency', color: 'blue' },
                B1: { name: 'Intermediate', detail: 'Use German independently', color: 'amber' },
                B2: { name: 'Upper intermediate', detail: 'Communicate with confidence', color: 'violet' },
              }[lvl] || { name: 'German practice', detail: 'Explore available exercises', color: 'amber' };
              const tones = {
                emerald: 'border-emerald-400/25 bg-emerald-400/10 text-emerald-300 group-hover:border-emerald-300/60 group-hover:shadow-emerald-950/50',
                blue: 'border-blue-400/25 bg-blue-400/10 text-blue-300 group-hover:border-blue-300/60 group-hover:shadow-blue-950/50',
                amber: 'border-amber-400/25 bg-amber-400/10 text-amber-300 group-hover:border-amber-300/60 group-hover:shadow-amber-950/50',
                violet: 'border-violet-400/25 bg-violet-400/10 text-violet-300 group-hover:border-violet-300/60 group-hover:shadow-violet-950/50',
              }[levelInfo.color];
              return (
                <button
                  key={lvl}
                  onClick={() => navigateToCategorySelection(lvl)}
                  className={'group relative flex min-h-64 flex-col overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-800/90 to-slate-950 p-5 text-left shadow-lg transition duration-200 hover:-translate-y-1 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ' + tones}
                  aria-label={'Choose ' + lvl + ' ' + levelInfo.name + ' German practice'}
                >
                  <div className={'flex items-start justify-between rounded-xl border border-slate-700/70 bg-gradient-to-br ' + (levelInfo.color === 'emerald' ? 'from-emerald-500/30 via-emerald-950/20' : levelInfo.color === 'blue' ? 'from-sky-500/30 via-blue-950/20' : levelInfo.color === 'amber' ? 'from-amber-500/30 via-amber-950/20' : 'from-violet-500/30 via-violet-950/20') + ' to-slate-900 p-4'}>
                    <span className={'inline-flex h-14 w-14 items-center justify-center rounded-2xl border text-2xl font-black ' + tones}>{lvl}</span>
                    <span className="rounded-full border border-slate-700 bg-slate-950/70 px-2.5 py-1 text-[11px] font-bold text-slate-300">{levelInfo.name}</span>
                  </div>
                  <div className="mt-5">
                    <h3 className="text-lg font-bold text-white">German {lvl}</h3>
                    <p className="mt-1 text-sm text-slate-400">{levelInfo.detail}</p>
                  </div>
                  <div className="mt-auto flex items-center justify-between border-t border-slate-800 pt-4">
                    <span className="text-xs text-slate-400">{loading ? 'Loading practice…' : testCount + (testCount === 1 ? ' activity' : ' activities') + ' available'}</span>
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 text-white transition group-hover:bg-amber-400 group-hover:text-slate-950"><ArrowRight className="h-4 w-4" /></span>
                  </div>
                  <span className="sr-only">Level {index + 1} of {getLevels().length}</span>
                </button>
              );
            })}
          </div>
          <p className="mt-5 text-center text-xs text-slate-500">🇩🇪  New to German? A1 is a great place to start.</p>
        </div>
      )}

{/* ───── STEP 3: Category Selection ───── */}
      {step === 3 && (
        <div className="max-w-5xl mx-auto space-y-8 animate-fade-in w-full mt-4 flex-1">
          <div className="mb-4">
             <button onClick={goBackToLevel} className="text-sm text-slate-400 hover:text-white flex items-center gap-2 transition-colors">
              &larr; Back to Levels
            </button>
          </div>
          <div className="relative isolate overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-r from-[#101c35] via-slate-900 to-slate-950 p-5 text-left shadow-xl sm:p-7">
            <h1 className="text-4xl font-extrabold text-white">
              <span className="text-amber-400">DE</span> {selectedLevel} Practice Center
            </h1>
            <p className="text-sm text-slate-300">Choose a skill to practice. Build your German step by step.</p><div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-slate-400"><span className="inline-flex items-center gap-2"><BookOpen className="h-4 w-4 text-amber-400" />Improve skills</span><span className="inline-flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-400" />Track your progress</span><span className="inline-flex items-center gap-2"><Trophy className="h-4 w-4 text-pink-400" />Build exam confidence</span></div> {(() => { const scoredAttempts = progressAttempts.filter(attempt => attempt.percentage !== null && attempt.percentage !== undefined); const averageProgress = scoredAttempts.length ? Math.round(scoredAttempts.reduce((total, attempt) => total + Number(attempt.percentage || 0), 0) / scoredAttempts.length) : 0; const skillCount = 6 + (htmlTestsEnabled ? 2 : 0); return <div className="mx-auto grid max-w-4xl grid-cols-1 gap-3 text-left sm:grid-cols-3"><div className="rounded-2xl border border-amber-400/20 bg-slate-900/80 p-4"><p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Practice activities</p><p className="mt-1 text-2xl font-extrabold text-amber-400">{materials.filter(item => item.level === selectedLevel).length + readingPassages.filter(item => item.level === selectedLevel).length}</p><p className="text-xs text-slate-500">available for {selectedLevel}</p></div><div className="rounded-2xl border border-blue-400/20 bg-slate-900/80 p-4"><p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Skills</p><p className="mt-1 text-2xl font-extrabold text-blue-300">{skillCount}</p><p className="text-xs text-slate-500">ways to build your German</p></div><div className="rounded-2xl border border-emerald-400/25 bg-gradient-to-br from-emerald-500/10 to-slate-900 p-4"><div className="flex items-center justify-between"><p className="text-xs font-semibold uppercase tracking-wider text-slate-300">Your progress</p><span className="text-lg font-extrabold text-emerald-300">{userType === 'free' && scoredAttempts.length ? `${averageProgress}%` : '—'}</span></div><div role="progressbar" aria-label="Average practice score" aria-valuemin={0} aria-valuemax={100} aria-valuenow={userType === 'free' ? averageProgress : 0} className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-amber-400 transition-all duration-700" style={{ width: `${userType === 'free' && scoredAttempts.length ? averageProgress : 0}%` }} /></div><p className="mt-2 text-xs text-slate-400">{userType === 'free' ? (scoredAttempts.length ? `${scoredAttempts.length} completed test${scoredAttempts.length === 1 ? '' : 's'} · average score` : 'Complete your first test to start tracking') : 'Free learner scores appear here'}</p></div></div>; })()}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {htmlTestsEnabled && (
              <button
                onClick={() => navigateToContent('Grammar Test')}
                className="group relative flex min-h-[184px] items-center gap-5 overflow-hidden rounded-2xl border border-emerald-400/40 bg-gradient-to-br from-emerald-500/[0.20] via-slate-900 to-slate-900 p-5 text-left shadow-lg shadow-black/10 transition duration-300 hover:-translate-y-1 hover:border-emerald-400/50 hover:shadow-xl hover:shadow-emerald-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 sm:p-6"
              >
                <div className="w-20 h-20 shrink-0 bg-emerald-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform border border-emerald-500/20">
                  <BookOpen className="w-8 h-8 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">Grammar Test</h3>
                  <p className="text-sm text-slate-400">Practice grammar rules, sentence structure, and forms.</p>
                </div>
              </button>
            )}

            <button
              onClick={() => navigateToContent('Reading Test')}
              className="group relative flex min-h-[184px] items-center gap-5 overflow-hidden rounded-2xl border border-blue-400/40 bg-gradient-to-br from-blue-500/[0.20] via-slate-900 to-slate-900 p-5 text-left shadow-lg shadow-black/10 transition duration-300 hover:-translate-y-1 hover:border-blue-400/50 hover:shadow-xl hover:shadow-blue-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 sm:p-6"
            >
              <div className="w-20 h-20 shrink-0 bg-blue-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform border border-blue-500/20">
                <BookOpen className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">Reading</h3>
                <p className="text-sm text-slate-400">Improve your reading comprehension with short passages.</p>
              </div>
            </button>

            <button
              onClick={() => navigateToContent('Speaking Test')}
              className="group relative flex min-h-[184px] items-center gap-5 overflow-hidden rounded-2xl border border-pink-400/40 bg-gradient-to-br from-pink-500/[0.20] via-slate-900 to-slate-900 p-5 text-left shadow-lg shadow-black/10 transition duration-300 hover:-translate-y-1 hover:border-pink-400/50 hover:shadow-xl hover:shadow-pink-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 sm:p-6"
            >
              <div className="w-20 h-20 shrink-0 bg-pink-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform border border-pink-500/20">
                <MessageCircle className="w-8 h-8 text-pink-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-pink-400 transition-colors">Speaking</h3>
                <p className="text-sm text-slate-400">Join our community to practice speaking with others.</p>
              </div>
            </button>

            <button
              onClick={() => setStep('vocab_engine')}
              className="group relative flex min-h-[184px] items-center gap-5 overflow-hidden rounded-2xl border border-amber-400/40 bg-gradient-to-br from-amber-500/[0.20] via-slate-900 to-slate-900 p-5 text-left shadow-lg shadow-black/10 transition duration-300 hover:-translate-y-1 hover:border-amber-400/50 hover:shadow-xl hover:shadow-amber-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 sm:p-6"
            >
              <div className="w-20 h-20 shrink-0 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-amber-500/20">
                <Brain className="w-8 h-8 text-slate-950" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors">Vocabulary</h3>
                  <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-[10px] font-bold rounded-full uppercase">New</span>
                </div>
                <p className="text-sm text-slate-400">Select multiple vocabulary chapters and test yourself in MCQ or Typing mode.</p>
              </div>
            </button>

            <Link
              href="/practice-tests/noun-builder"
              className="group relative flex min-h-[184px] items-center gap-5 overflow-hidden rounded-2xl border border-blue-400/40 bg-gradient-to-br from-blue-500/[0.20] via-slate-900 to-slate-900 p-5 text-left shadow-lg shadow-black/10 transition duration-300 hover:-translate-y-1 hover:border-blue-400/50 hover:shadow-xl hover:shadow-blue-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 sm:p-6"
            >
              <div className="w-20 h-20 shrink-0 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/20">
                <Languages className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">Noun Builder</h3>
                  <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-[10px] font-bold rounded-full uppercase">New</span>
                </div>
                <p className="text-sm text-slate-400">Master German nouns and their articles (der, die, das) with interactive flashcards.</p>
              </div>
            </Link>

            <button
              onClick={() => setStep('grammar_engine')}
              className="group relative flex min-h-[184px] items-center gap-5 overflow-hidden rounded-2xl border border-emerald-400/40 bg-gradient-to-br from-emerald-500/[0.20] via-slate-900 to-slate-900 p-5 text-left shadow-lg shadow-black/10 transition duration-300 hover:-translate-y-1 hover:border-emerald-400/50 hover:shadow-xl hover:shadow-emerald-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 sm:p-6"
            >
              <div className="w-20 h-20 shrink-0 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-emerald-500/20">
                <Brain className="w-8 h-8 text-slate-950" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">Grammar</h3>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-full uppercase">New</span>
                </div>
                <p className="text-sm text-slate-400">Master grammar rules with interactive exercises and real-time checking.</p>
              </div>
            </button>

            {htmlTestsEnabled && (
              <button
                onClick={() => navigateToContent('Vocab Test')}
                className="group relative flex min-h-[184px] items-center gap-5 overflow-hidden rounded-2xl border border-amber-400/40 bg-gradient-to-br from-amber-500/[0.20] via-slate-900 to-slate-900 p-5 text-left shadow-lg shadow-black/10 transition duration-300 hover:-translate-y-1 hover:border-amber-400/50 hover:shadow-xl hover:shadow-amber-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 sm:p-6"
              >
                <div className="w-20 h-20 shrink-0 bg-amber-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform border border-amber-500/20">
                  <Languages className="w-8 h-8 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-amber-400 transition-colors">Vocab Test</h3>
                  <p className="text-sm text-slate-400">Test your vocabulary and word meaning skills.</p>
                </div>
              </button>
            )}

            <button
              onClick={() => setStep('alphabet_engine')}
              className="group relative flex min-h-[184px] items-center gap-5 overflow-hidden rounded-2xl border border-amber-400/40 bg-gradient-to-br from-amber-500/[0.20] via-slate-900 to-slate-900 p-5 text-left shadow-lg shadow-black/10 transition duration-300 hover:-translate-y-1 hover:border-amber-400/50 hover:shadow-xl hover:shadow-amber-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 sm:p-6"
            >
              <div className="w-20 h-20 shrink-0 bg-amber-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform border border-amber-500/20">
                <Volume2 className="w-8 h-8 text-amber-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-amber-400 transition-colors">Alphabets Sounding, Counting</h3>
                <p className="text-sm text-slate-400">Practice German alphabet and numbers pronunciation.</p>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* ───── STEP: Chapter Vocab Engine ───── */}
      {step === 'vocab_engine' && (
        <div className="w-full mt-4 flex-1">
          <ChapterVocabEngine 
            level={selectedLevel} 
            onBack={() => setStep(3)} 
            userType={userType}
            storedFreeUser={storedFreeUser}
            studentName={studentName}
            verifiedCode={verifiedCode}
          />
        </div>
      )}

      {/* ───── STEP: Grammar Engine ───── */}
      {step === 'grammar_engine' && (
        <div className="w-full mt-4 flex-1">
          <GrammarEngine 
            level={selectedLevel} 
            onBack={() => setStep(3)} 
            userType={userType}
            storedFreeUser={storedFreeUser}
            studentName={studentName}
            verifiedCode={verifiedCode}
          />
        </div>
      )}

      {/* ───── STEP: Alphabet & Numbers Engine ───── */}
      {step === 'alphabet_engine' && (
        <div className="w-full mt-4 flex-1">
          <AlphabetNumbersEngine onBack={() => setStep(3)} />
        </div>
      )}

      {/* ───── STEP: Reading Test Engine ───── */}
      {step === 'reading_engine' && selectedMaterial && (
        <div className="w-full mt-4 flex-1">
          <ReadingTestEngine 
            passage={selectedMaterial}
            onBack={() => setStep(4)}
            userType={userType}
            storedFreeUser={storedFreeUser}
            studentName={studentName}
            verifiedCode={verifiedCode}
            batchName={batchName}
          />
        </div>
      )}

      {/* ───── STEP 4: Content (Test List, Placeholder, or WhatsApp) ───── */}
      {step === 4 && (
        <div className="max-w-5xl mx-auto space-y-6 animate-fade-in w-full mt-8 flex-1">
          <div className="mb-4">
             <button onClick={goBackToCategory} className="text-sm text-slate-400 hover:text-white flex items-center gap-2 transition-colors">
              &larr; Back to Categories
            </button>
          </div>
          {selectedCategory !== 'Reading Test' && (
            <div className="text-center space-y-3 mb-10">
              <h1 className="text-4xl font-extrabold text-white">
                {selectedLevel} <span className="text-amber-500">{selectedCategory}</span>
              </h1>
            </div>
          )}

          {/* Reading Test List */}
          {selectedCategory === 'Reading Test' && (
            loading ? (
              <div className="space-y-6" aria-label="Loading reading passages">
                <div className="animate-pulse rounded-3xl border border-slate-800 bg-slate-900 p-8">
                  <div className="h-4 w-32 rounded bg-slate-800" />
                  <div className="mt-4 h-8 w-64 max-w-full rounded bg-slate-800" />
                  <div className="mt-3 h-4 w-full max-w-xl rounded bg-slate-800" />
                </div>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{[0, 1, 2].map(item => <div key={item} className="h-64 animate-pulse rounded-2xl border border-slate-800 bg-slate-900" />)}</div>
              </div>
            ) : (
              renderReadingPassages()
            )
          )}

          {/* Speaking Test WhatsApp Link */}
          {selectedCategory === 'Speaking Test' && (
            <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl mx-auto shadow-xl">
              <div className="w-20 h-20 mx-auto bg-emerald-500/10 rounded-full flex items-center justify-center mb-6">
                <MessageCircle className="w-10 h-10 text-emerald-400" />
              </div>
              <h2 className="text-3xl font-extrabold text-white mb-3">Practice Speaking</h2>
              <p className="text-slate-400 max-w-md mx-auto mb-8">Ready to practice your spoken German? Join our dedicated WhatsApp group to interact with other students and teachers.</p>
              <button 
                onClick={() => window.open('https://chat.whatsapp.com/IfPPrtHgGxQ29Xz2Boyekd', '_blank')}
                className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-3 transition shadow-lg mx-auto hover:-translate-y-1"
              >
                <MessageCircle className="w-5 h-5" />
                Join Speaking Practice Group
              </button>
            </div>
          )}

          {/* Test List (Vocab or Grammar) */}
          {(selectedCategory === 'Vocab Test' || selectedCategory === 'Grammar Test') && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                <div className="col-span-full text-center py-12">
                  <Loader2 className="w-8 h-8 text-amber-500 animate-spin mx-auto" />
                </div>
              ) : filteredTests.length === 0 ? (
                <div className="col-span-full text-center text-slate-500 py-12 bg-slate-900/50 rounded-2xl border border-slate-800 border-dashed">
                  No {selectedCategory.toLowerCase()}s uploaded yet for Level {selectedLevel}.
                </div>
              ) : (
                filteredTests.map(mat => (
                  <div 
                    key={mat.id} 
                    className="group relative bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-amber-500 transition-all shadow-lg hover:-translate-y-1 hover:shadow-amber-500/20 overflow-hidden"
                  >
                    {/* Subtle gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 font-extrabold flex items-center justify-center text-xl border border-amber-500/30 shadow-inner">
                          {mat.level}
                        </div>
                        <span className="px-3 py-1 bg-slate-950 border border-slate-800 rounded-full text-[10px] uppercase tracking-widest text-slate-400 font-bold flex items-center gap-1.5">
                          <BookOpen className="w-3 h-3 text-emerald-400" /> {mat.test_type}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-playfair font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
                        {mat.title}
                      </h3>
                    </div>

                    <button
                      onClick={() => navigateToTest(mat)}
                      className="relative z-10 mt-8 w-full py-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500 hover:bg-amber-500 hover:text-slate-950 text-slate-300 font-bold text-sm transition-all flex items-center justify-center gap-2 group-hover:shadow-lg"
                    >
                      Start Test 
                      <PlayCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {/* ───── STEP 5: Test Runner ───── */}
      {step === 5 && (
        <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col animate-fade-in">
          {/* Top Bar */}
          <div className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 shrink-0">
            <div className="flex items-center gap-3 text-white">
              <CheckSquare className="w-5 h-5 text-amber-500" />
              <div className="font-bold">{selectedMaterial?.title}</div>
              <div className="px-2 py-0.5 bg-slate-800 rounded text-[10px] text-slate-400 hidden sm:block">Level {selectedMaterial?.level}</div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setStep(4)} 
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-lg border border-slate-700 transition-colors mr-4"
              >
                Quit Test
              </button>
              <div className="text-xs text-slate-400 hidden sm:block">
                {userType === 'free'
                  ? <>Progress saved for: <strong className="text-white">{storedFreeUser?.name || storedFreeUser?.email}</strong></>
                  : userType === 'student'
                    ? <>Student code: <strong className="text-emerald-400">{verifiedCode}</strong></>
                    : <>Free guest practice</>
                }
              </div>
            </div>
          </div>

          {/* iframe */}
          <div className="flex-1 bg-white relative">
            {htmlLoading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-950">
                <div className="text-center space-y-3">
                  <Loader2 className="w-10 h-10 text-amber-500 animate-spin mx-auto" />
                  <p className="text-slate-400 text-sm">Loading test...</p>
                </div>
              </div>
            ) : htmlContent ? (
              <iframe
                srcDoc={htmlContent}
                style={{ width: '100%', height: '100%', border: 'none' }}
                sandbox="allow-scripts allow-same-origin allow-forms"
                title="Practice Test"
              />
            ) : null}
          </div>
        </div>
      )}

      {/* ───── STEP 6: Result Screen ───── */}
      {step === 6 && testResult && (
        <main className="mx-auto flex w-full max-w-5xl flex-1 animate-fade-in items-center px-4 py-8 sm:px-6 sm:py-12">
          <section aria-labelledby="practice-result-title" className="relative isolate w-full overflow-hidden rounded-3xl border border-slate-700/80 bg-[#0b1224] shadow-2xl shadow-black/40">
            <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-28 -z-10 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />
            <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 left-1/3 -z-10 h-64 w-64 rounded-full bg-amber-400/[0.08] blur-3xl" />
            <div className="border-b border-slate-800/90 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-[#111c32]/80 px-5 py-5 sm:px-8 sm:py-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-4">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${testResult.userType === 'student' ? 'border-emerald-400/25 bg-emerald-400/10' : 'border-amber-400/25 bg-amber-400/10'}`}><Trophy className={`h-6 w-6 ${testResult.userType === 'student' ? 'text-emerald-300' : 'text-amber-300'}`} /></div>
                  <div className="min-w-0">
                    <div className="mb-1 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-300"><CheckCircle className="h-3.5 w-3.5" /> Test completed</div>
                    <h1 id="practice-result-title" className="truncate text-2xl font-extrabold tracking-tight text-white sm:text-3xl">Great work{testResult.userType === 'free' ? `, ${storedFreeUser?.name || 'Student'}` : testResult.userType === 'student' && studentName ? `, ${studentName}` : ''}!</h1>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 sm:justify-end">
                  <span className="rounded-full border border-slate-700 bg-slate-950/70 px-3 py-1.5 text-xs font-semibold text-slate-300">Level {selectedLevel || '—'}</span>
                  <span className="max-w-full truncate rounded-full border border-slate-700 bg-slate-950/70 px-3 py-1.5 text-xs font-semibold text-slate-300">{selectedMaterial?.title || selectedCategory || 'German practice'}</span>
                </div>
              </div>
            </div>
            <div className="grid gap-4 p-4 sm:gap-5 sm:p-6 lg:grid-cols-12 lg:p-7">
              <section aria-label="Your score and accuracy" className="rounded-2xl border border-slate-700/80 bg-gradient-to-br from-slate-900/95 to-slate-900/50 p-5 sm:p-7 lg:col-span-7">
                {testResult.isFallback || testResult.score === null ? (
                  <div className="flex min-h-48 flex-col items-center justify-center text-center">
                    <span className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-300"><CheckCircle className="h-6 w-6" /></span>
                    <p className="text-xl font-bold text-white">Your test has been submitted</p>
                    <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-400">Your answers are being reviewed. Your score will appear here when it’s ready.</p>
                  </div>
                ) : (
                  <div className="grid items-center gap-6 sm:grid-cols-[auto_1fr] sm:gap-8">
                    <div className="mx-auto h-32 w-32 rounded-full p-[6px] shadow-lg shadow-emerald-950/30 sm:mx-0 sm:h-36 sm:w-36" style={{ background: `conic-gradient(${testResult.percentage >= 70 ? '#34d399' : testResult.percentage >= 50 ? '#fbbf24' : '#f87171'} ${Math.max(0, Math.min(100, testResult.percentage ?? 0))}%, #263247 0)` }} role="progressbar" aria-label="Test accuracy" aria-valuemin={0} aria-valuemax={100} aria-valuenow={testResult.percentage ?? 0}>
                      <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-[#0b1224]"><span className={`text-4xl font-extrabold tracking-tight ${testResult.percentage >= 70 ? 'text-emerald-300' : testResult.percentage >= 50 ? 'text-amber-300' : 'text-rose-300'}`}>{testResult.percentage ?? 0}%</span><span className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Accuracy</span></div>
                    </div>
                    <div className="min-w-0 text-center sm:text-left">
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Your score</p>
                      <p className={`mt-1 text-5xl font-extrabold tabular-nums tracking-tight sm:text-6xl ${testResult.userType === 'student' ? 'text-emerald-300' : 'text-amber-300'}`}>{testResult.score}<span className="ml-1 text-2xl font-semibold text-slate-500">/ {testResult.totalMarks}</span></p>
                      <p className="mt-3 text-sm leading-relaxed text-slate-300">{testResult.percentage >= 70 ? 'Excellent result — you’re ready for the next challenge.' : testResult.percentage >= 50 ? 'Good progress — keep practicing to build confidence.' : 'Every attempt helps you improve. Keep going!'}</p>
                      <div className="mt-5 h-2.5 w-full overflow-hidden rounded-full bg-slate-800 ring-1 ring-slate-700/80" aria-hidden="true"><div className={`h-full rounded-full transition-all duration-1000 ${testResult.percentage >= 70 ? 'bg-gradient-to-r from-emerald-500 to-emerald-300' : testResult.percentage >= 50 ? 'bg-gradient-to-r from-amber-500 to-amber-300' : 'bg-gradient-to-r from-rose-500 to-rose-300'}`} style={{ width: `${Math.max(0, Math.min(100, testResult.percentage ?? 0))}%` }} /></div>
                      <div className="mt-2 flex justify-between text-[11px] font-medium text-slate-500"><span>Keep learning</span><span>{testResult.percentage ?? 0}% complete</span></div>
                    </div>
                  </div>
                )}
              </section>
              <aside aria-label="Test summary" className="rounded-2xl border border-slate-700/80 bg-slate-900/65 p-5 sm:p-6 lg:col-span-5">
                <div className="mb-4 flex items-center justify-between"><h2 className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Test summary</h2><span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-300"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Complete</span></div>
                <dl className="divide-y divide-slate-800/90">
                  <div className="flex items-center justify-between gap-3 py-3"><dt className="text-sm text-slate-400">Level</dt><dd className="text-sm font-bold text-white">{selectedLevel || '—'}</dd></div>
                  <div className="flex items-start justify-between gap-3 py-3"><dt className="shrink-0 text-sm text-slate-400">Practice</dt><dd className="text-right text-sm font-semibold text-white">{selectedMaterial?.title || selectedCategory || 'German practice'}</dd></div>
                  <div className="flex items-center justify-between gap-3 py-3"><dt className="text-sm text-slate-400">Learner</dt><dd className="max-w-[60%] truncate text-right text-sm font-semibold text-white">{testResult.userType === 'free' ? (storedFreeUser?.name || 'Free learner') : testResult.userType === 'student' ? (studentName || 'Student') : 'Guest'}</dd></div>
                </dl>
                {testResult.userType === 'student' && <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.07] px-3.5 py-3 text-xs leading-relaxed text-emerald-200"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" /> Your result has been saved for your teacher.</div>}
              </aside>
            </div>

            {/* Pedagogical Feedback and Recommended Next Activity */}
            <div className="px-5 pb-6 sm:px-8 space-y-4">
              <div className={`p-4 rounded-2xl border flex items-start gap-3.5 ${
                (testResult.percentage ?? 0) >= 80 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                  : (testResult.percentage ?? 0) >= 50 
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' 
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}>
                <Trophy className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm">
                    {(testResult.percentage ?? 0) >= 80 
                      ? 'Ausgezeichnet! (Excellent Mastery)' 
                      : (testResult.percentage ?? 0) >= 50 
                      ? 'Gut gemacht! (Solid Progress)' 
                      : 'Weiter so! (Keep Practicing)'}
                  </h4>
                  <p className="text-xs mt-1 leading-relaxed opacity-90">
                    {(testResult.percentage ?? 0) >= 80 
                      ? 'Outstanding performance! You have demonstrated confident command of this topic. Move to the next skill or challenge yourself at the next CEFR level.' 
                      : (testResult.percentage ?? 0) >= 50 
                      ? 'Good effort! You understand the foundational principles. Try another exercise or retake to push your accuracy above 80%.' 
                      : 'German learning requires repetition and consistency. Review the rules, reinforce key vocabulary, and take another practice test!'}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Recommended Next Activity</span>
                  <h5 className="text-sm font-bold text-white mt-0.5">
                    {selectedCategory === 'Grammar Test' ? `German ${selectedLevel || 'A1'} Reading Comprehension` : selectedCategory === 'Reading Test' ? `German ${selectedLevel || 'A1'} Vocabulary Practice` : `German ${selectedLevel || 'A1'} Grammar Drills`}
                  </h5>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Strengthen your German comprehension with targeted interactive exercises.
                  </p>
                </div>
                <button
                  onClick={() => {
                    resetTestSession();
                    setStep(3); // Go to category selection for this level
                  }}
                  className="shrink-0 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 font-bold text-xs rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5"
                >
                  Explore {selectedLevel || 'CEFR'} Skills <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-800/90 bg-slate-950/25 px-4 py-4 sm:flex-row sm:justify-end sm:px-6 sm:py-5 lg:px-7">
              <button onClick={() => { resetTestSession(); setStep(4); }} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-5 py-3 text-sm font-bold text-white transition hover:border-slate-600 hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400">Take Another Test <ArrowRight className="h-4 w-4" /></button>
              {testResult.userType === 'free' && <Link href="/dashboard" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-amber-400 px-5 py-3 text-sm font-extrabold text-slate-950 shadow-lg shadow-amber-950/20 transition hover:-translate-y-0.5 hover:bg-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200">View My Progress <ArrowRight className="h-4 w-4" /></Link>}
            </div>
          </section>
        </main>
      )}

      {/* Level-Specific Practice Tests & Course Navigation */}
      <div className="max-w-5xl mx-auto px-4 py-12 mt-12 border-t border-slate-800 text-slate-400 w-full">
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <h2 className="text-2xl font-bold text-white">Level-Specific Practice Tests &amp; Online Courses</h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Practice for each CEFR milestone with our free interactive tests, or join our structured live classes for guided preparation.
          </p>
        </div>

        {/* 4 Level Practice Links */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link
            href="/practice-tests/german-a1"
            className="p-5 bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl transition-all group block text-left shadow-lg"
          >
            <div className="text-amber-400 font-extrabold text-xs uppercase tracking-wider mb-1">Beginner</div>
            <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors flex items-center justify-between">
              German A1 Practice Test
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
            </h3>
            <p className="text-xs text-slate-400 mt-1.5">Vocabulary, basic greetings, and present tense drills.</p>
          </Link>

          <Link
            href="/practice-tests/german-a2"
            className="p-5 bg-slate-900 border border-slate-800 hover:border-blue-500/50 rounded-2xl transition-all group block text-left shadow-lg"
          >
            <div className="text-blue-400 font-extrabold text-xs uppercase tracking-wider mb-1">Elementary</div>
            <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors flex items-center justify-between">
              German A2 Practice Test
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
            </h3>
            <p className="text-xs text-slate-400 mt-1.5">Past tense, daily conversations, and sentence structure.</p>
          </Link>

          <Link
            href="/practice-tests/german-b1"
            className="p-5 bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl transition-all group block text-left shadow-lg"
          >
            <div className="text-emerald-400 font-extrabold text-xs uppercase tracking-wider mb-1">Intermediate</div>
            <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors flex items-center justify-between">
              German B1 Practice Test
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
            </h3>
            <p className="text-xs text-slate-400 mt-1.5">Independent grammar, reading, and exam preparation.</p>
          </Link>

          <Link
            href="/practice-tests/german-b2"
            className="p-5 bg-slate-900 border border-slate-800 hover:border-purple-500/50 rounded-2xl transition-all group block text-left shadow-lg"
          >
            <div className="text-purple-400 font-extrabold text-xs uppercase tracking-wider mb-1">Upper Intermediate</div>
            <h3 className="text-base font-bold text-white group-hover:text-purple-400 transition-colors flex items-center justify-between">
              German B2 Practice Test
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
            </h3>
            <p className="text-xs text-slate-400 mt-1.5">Advanced vocabulary, academic texts, and professional skills.</p>
          </Link>
        </div>

        {/* Course CTA Banner */}
        <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h3 className="text-base font-bold text-white">Need structured lessons with a live teacher?</h3>
            <p className="text-xs text-slate-400 mt-0.5">Live online Zoom batches covering A1 to B2 with exam preparation and personalized feedback.</p>
          </div>
          <Link
            href="/courses"
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-all shrink-0 flex items-center gap-1.5"
          >
            Explore German Courses <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Exam Guides Links */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
          <span className="font-semibold text-slate-300">Exam Preparation Guides:</span>
          <Link href="/goethe-exam-preparation" className="hover:text-amber-400 transition-colors">Goethe Exam Preparation</Link>
          <span className="text-slate-700">•</span>
          <Link href="/telc-exam-preparation" className="hover:text-amber-400 transition-colors">telc Exam Preparation</Link>
          <span className="text-slate-700">•</span>
          <Link href="/testdaf-preparation" className="hover:text-amber-400 transition-colors">TestDaF Preparation</Link>
        </div>
      </div>
    </div>
  );
}
