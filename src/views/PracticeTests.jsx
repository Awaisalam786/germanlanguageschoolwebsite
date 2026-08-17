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
  const [userType, setUserType] = useState(''); // 'free' | 'student'
  const [freeUserForm, setFreeUserForm] = useState({ name: '', phone: '', email: '' });
  const [storedFreeUser, setStoredFreeUser] = useState(null);
  const [accessCode, setAccessCode] = useState('');
  const [verifiedCode, setVerifiedCode] = useState(null);
  const [studentName, setStudentName] = useState('');
  const [batchName, setBatchName] = useState('');

  // Practice Test Navigation
  const [materials, setMaterials] = useState([]);
  const [readingPassages, setReadingPassages] = useState([]);
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
    // Check local storage for free user
    const savedUser = localStorage.getItem('gls_free_user');
    if (savedUser) {
      try {
        setStoredFreeUser(JSON.parse(savedUser));
        setUserType('free');
        setStep(2); // Skip straight to level selection if logged in
      } catch (e) {
        console.error(e);
      }
    }
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
  const handleFreeUserSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (!freeUserForm.name || !freeUserForm.phone || !freeUserForm.email) {
      setErrorMsg('All fields are required.');
      return;
    }

    const userData = {
      name: freeUserForm.name,
      phone: freeUserForm.phone,
      email: freeUserForm.email
    };

    localStorage.setItem('gls_free_user', JSON.stringify(userData));
    setStoredFreeUser(userData);
    setUserType('free');
    setStep(2); // Go to level selection
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

  const handleLogout = () => {
    if (userType === 'free') {
      localStorage.removeItem('gls_free_user');
      setStoredFreeUser(null);
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
      payload.first_name = storedFreeUser?.name;
      payload.phone = storedFreeUser?.phone;
      payload.email = storedFreeUser?.email;
    }

    try {
      const res = await fetch('/api/save-attempt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
    // 1. Strict filtering by the selected level
    const levelPassages = readingPassages.filter(p => p.level === selectedLevel);
    
    if (levelPassages.length === 0) {
      return (
        <div className="text-center text-slate-500 py-12 bg-slate-900/50 rounded-2xl border border-slate-800 border-dashed w-full">
          No reading passages uploaded yet for Level {selectedLevel}.
        </div>
      );
    }

    // 2. Group passages by chapter reference
    const grouped = levelPassages.reduce((acc, passage) => {
      const ch = passage.chapter_reference || 'Other';
      if (!acc[ch]) acc[ch] = [];
      acc[ch].push(passage);
      return acc;
    }, {});

    // 3. Sort the chapter keys numerically (1, 2, 3...) and place 'Other' at the end
    const sortedChapters = Object.keys(grouped).sort((a, b) => {
      if (a === 'Other') return 1;
      if (b === 'Other') return -1;
      return parseInt(a) - parseInt(b);
    });

    // 4. Render each chapter section with its sorted passages
    return (
      <div className="w-full">
        {sortedChapters.map(chapter => {
          // Sort passages within the chapter by passage_id
          const passages = grouped[chapter].sort((a, b) => a.passage_id - b.passage_id);

          return (
            <div key={chapter} className="mb-12">
              
              {/* Section Header */}
              <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-3">
                <BookOpen className="w-6 h-6 text-blue-500" />
                <h2 className="text-2xl font-playfair font-bold text-white">
                  {chapter === 'Other' ? 'Additional Passages' : `Chapter ${chapter}`}
                </h2>
              </div>

              {/* Section Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {passages.map(mat => (
                  <div 
                    key={mat.id} 
                    className="group relative bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-blue-500 transition-all shadow-lg hover:-translate-y-1 hover:shadow-blue-500/20 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 font-extrabold flex items-center justify-center text-xl border border-blue-500/30 shadow-inner">
                          {mat.level}
                        </div>
                        <span className="px-3 py-1 bg-slate-950 border border-slate-800 rounded-full text-[10px] uppercase tracking-widest text-slate-400 font-bold flex items-center gap-1.5">
                          <BookOpen className="w-3 h-3 text-blue-400" /> Reading
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-playfair font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                        {mat.passage_title}
                      </h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-2">
                        <CheckSquare className="w-3.5 h-3.5 text-slate-500" /> {mat.questions?.length || 0} Questions
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedMaterial(mat); // Use selectedMaterial to store the passage
                        setStep('reading_engine');
                      }}
                      className="relative z-10 mt-8 w-full py-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-blue-500 hover:bg-blue-500 hover:text-white font-bold text-sm transition-all flex items-center justify-center gap-2 group-hover:shadow-lg text-slate-300 group-hover:text-white"
                    >
                      Start Test 
                      <PlayCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 flex flex-col">

      {/* Top Right Navigation for logged-in users & students */}
      {step >= 2 && step !== 5 && (
        <div className="absolute top-4 right-4 sm:top-8 sm:right-8 flex items-center gap-4 z-40">
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
            Logout {userType === 'student' ? '(Student)' : '(Free User)'}
          </button>
        </div>
      )}

      {/* ───── STEP 1: Identity Choice ───── */}
      {step === 1 && (
        <div className="max-w-3xl mx-auto space-y-8 animate-fade-in mt-12">
          <div className="text-center space-y-3">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/30">
              Interactive Practice Tests
            </span>
            <h1 className="text-4xl font-extrabold text-white">Before You Begin</h1>
            <p className="text-sm text-slate-300">Choose how you want to track your progress.</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <button
              onClick={() => { setUserType('free'); setErrorMsg(''); setStep(1.1); }}
              className="p-8 bg-slate-900 border border-slate-800 rounded-2xl text-center hover:border-amber-500 hover:bg-amber-500/5 transition-all group shadow-lg hover:shadow-amber-500/10"
            >
              <div className="w-16 h-16 mx-auto bg-amber-500/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-amber-500/20">
                <User className="w-8 h-8 text-amber-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Free Practice</h3>
              <p className="text-xs text-slate-400">Enter your details to track your scores.</p>
            </button>

            <button
              onClick={() => { setUserType('student'); setErrorMsg(''); setStep(1.2); }}
              className="p-8 bg-slate-900 border border-slate-800 rounded-2xl text-center hover:border-emerald-500 hover:bg-emerald-500/5 transition-all group shadow-lg hover:shadow-emerald-500/10"
            >
              <div className="w-16 h-16 mx-auto bg-emerald-500/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-emerald-500/20">
                <Key className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">I'm an Enrolled Student</h3>
              <p className="text-xs text-slate-400">Use your student access code to begin.</p>
            </button>
          </div>
        </div>
      )}

      {/* STEP 1.1: Free User Details Form */}
      {step === 1.1 && (
        <div className="max-w-md mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl relative animate-fade-in mt-12">
          <button onClick={() => { setUserType(''); setErrorMsg(''); setStep(1); }} className="absolute top-4 right-4 text-xs text-slate-500 hover:text-white">← Change</button>
          <form onSubmit={handleFreeUserSubmit} className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-extrabold text-white">Your Details</h3>
              <p className="text-sm text-slate-400">We'll save your scores to this email.</p>
            </div>
            
            {errorMsg && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-2 text-red-400 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>{errorMsg}</p>
              </div>
            )}
            
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Full Name *</label>
              <input type="text" required placeholder="John Doe" value={freeUserForm.name} onChange={e => setFreeUserForm({...freeUserForm, name: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Email Address *</label>
              <input type="email" required placeholder="you@example.com" value={freeUserForm.email} onChange={e => setFreeUserForm({...freeUserForm, email: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Phone Number *</label>
              <input type="text" required placeholder="+923001234567" value={freeUserForm.phone} onChange={e => setFreeUserForm({...freeUserForm, phone: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none" />
            </div>
            <button type="submit" className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg flex items-center justify-center gap-2 mt-4 transition-colors">
              Continue to Level Selection <ArrowRight className="w-4 h-4" />
            </button>
          </form>
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
        <div className="max-w-5xl mx-auto space-y-8 animate-fade-in w-full mt-4 flex-1">
          <div className="text-center space-y-3 mb-10">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/30">
              Welcome, {userType === 'student' ? studentName : storedFreeUser?.name}!
            </span>
            <h1 className="text-4xl font-extrabold text-white">Select Your Level</h1>
            <p className="text-sm text-slate-300">Choose the German level you want to practice.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {getLevels().map(lvl => (
              <button
                key={lvl}
                onClick={() => navigateToCategorySelection(lvl)}
                className="group relative p-8 bg-slate-900 border border-slate-800 rounded-2xl text-center hover:border-amber-500 transition-all shadow-lg hover:-translate-y-1 hover:shadow-amber-500/20 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <h2 className="text-5xl font-extrabold text-white mb-3 group-hover:text-amber-400 transition-colors">{lvl}</h2>
                <p className="text-sm text-slate-400 group-hover:text-slate-300">View tests for Level {lvl}</p>
                <div className="mt-6 flex justify-center text-amber-500 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-2">
                  <ArrowRight className="w-6 h-6" />
                </div>
              </button>
            ))}
          </div>
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
          <div className="text-center space-y-3 mb-10">
            <h1 className="text-4xl font-extrabold text-white">
              Level <span className="text-amber-500">{selectedLevel}</span> Tests
            </h1>
            <p className="text-sm text-slate-300">What would you like to practice today?</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {htmlTestsEnabled && (
              <button
                onClick={() => navigateToContent('Grammar Test')}
                className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex items-center gap-6 hover:border-emerald-500 transition-all group shadow-lg hover:shadow-emerald-500/10 text-left"
              >
                <div className="w-16 h-16 shrink-0 bg-emerald-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform border border-emerald-500/20">
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
              className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex items-center gap-6 hover:border-blue-500 transition-all group shadow-lg hover:shadow-blue-500/10 text-left"
            >
              <div className="w-16 h-16 shrink-0 bg-blue-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform border border-blue-500/20">
                <BookOpen className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">Reading</h3>
                <p className="text-sm text-slate-400">Improve your reading comprehension with short passages.</p>
              </div>
            </button>

            <button
              onClick={() => navigateToContent('Speaking Test')}
              className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex items-center gap-6 hover:border-pink-500 transition-all group shadow-lg hover:shadow-pink-500/10 text-left"
            >
              <div className="w-16 h-16 shrink-0 bg-pink-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform border border-pink-500/20">
                <MessageCircle className="w-8 h-8 text-pink-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-pink-400 transition-colors">Speaking</h3>
                <p className="text-sm text-slate-400">Join our community to practice speaking with others.</p>
              </div>
            </button>

            <button
              onClick={() => setStep('vocab_engine')}
              className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex items-center gap-6 hover:border-amber-500 transition-all group shadow-lg hover:shadow-amber-500/10 text-left"
            >
              <div className="w-16 h-16 shrink-0 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-amber-500/20">
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

            <button
              onClick={() => setStep('grammar_engine')}
              className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex items-center gap-6 hover:border-emerald-500 transition-all group shadow-lg hover:shadow-emerald-500/10 text-left"
            >
              <div className="w-16 h-16 shrink-0 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-emerald-500/20">
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
                className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex items-center gap-6 hover:border-amber-500 transition-all group shadow-lg hover:shadow-amber-500/10 text-left"
              >
                <div className="w-16 h-16 shrink-0 bg-amber-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform border border-amber-500/20">
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
              className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex items-center gap-6 hover:border-amber-500 transition-all group shadow-lg hover:shadow-amber-500/10 text-left"
            >
              <div className="w-16 h-16 shrink-0 bg-amber-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform border border-amber-500/20">
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
        <div className="max-w-5xl mx-auto space-y-8 animate-fade-in w-full mt-4 flex-1">
          <div className="mb-4">
             <button onClick={goBackToCategory} className="text-sm text-slate-400 hover:text-white flex items-center gap-2 transition-colors">
              &larr; Back to Categories
            </button>
          </div>
          <div className="text-center space-y-3 mb-10">
            <h1 className="text-4xl font-extrabold text-white">
              {selectedLevel} <span className="text-amber-500">{selectedCategory}</span>
            </h1>
          </div>

          {/* Reading Test List */}
          {selectedCategory === 'Reading Test' && (
            loading ? (
              <div className="text-center py-12">
                <Loader2 className="w-8 h-8 text-amber-500 animate-spin mx-auto" />
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
                  ? <>Logged in as: <strong className="text-white">{storedFreeUser?.name || storedFreeUser?.email}</strong></>
                  : <>Code: <strong className="text-emerald-400">{verifiedCode}</strong></>
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
        <div className="max-w-2xl mx-auto text-center space-y-8 animate-fade-in py-12 flex-1 mt-12">

          {/* Score card — shown to ALL users */}
          <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center border-4 ${
            testResult.userType === 'student'
              ? 'bg-emerald-500/10 border-emerald-500/20'
              : 'bg-amber-500/10 border-amber-500/20'
          }`}>
            <Trophy className={`w-12 h-12 ${testResult.userType === 'student' ? 'text-emerald-400' : 'text-amber-400'}`} />
          </div>

          <div className="space-y-2">
            <h2 className="text-4xl font-extrabold text-white">Your Result</h2>
            <p className="text-slate-400 text-sm">
              {testResult.userType === 'free'
                ? `Great job, ${storedFreeUser?.name || 'Student'}!`
                : `Test completed! Great work.`}
            </p>
          </div>

          <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl space-y-4">
            {testResult.isFallback || testResult.score === null ? (
              <p className="text-slate-300">Your test has been submitted. Your score will be reviewed shortly.</p>
            ) : (
              <>
                <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Your Score</p>
                <div className={`text-7xl font-extrabold font-mono ${testResult.userType === 'student' ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {testResult.score} <span className="text-3xl text-slate-500">/ {testResult.totalMarks}</span>
                </div>
                {testResult.percentage !== null && (
                  <div className="space-y-2 mt-4">
                    <div className={`text-2xl font-bold ${testResult.percentage >= 70 ? 'text-emerald-400' : testResult.percentage >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                      {testResult.percentage}% Accuracy
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-1000 ${testResult.percentage >= 70 ? 'bg-emerald-500' : testResult.percentage >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                        style={{ width: `${testResult.percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-400 pt-2">
                      {testResult.percentage >= 70 ? '🎉 Excellent! You\'re ready for the next level.' : testResult.percentage >= 50 ? '👍 Good effort! Keep practicing.' : '📚 Keep studying — you\'ll get there!'}
                    </p>
                  </div>
                )}
              </>
            )}

            {/* Internal student: show teacher note below score */}
            {testResult.userType === 'student' && (
              <div className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 text-xs font-bold">
                <CheckCircle className="w-3.5 h-3.5" /> Results saved — your teacher can view your score
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            {testResult.userType === 'free' && (
              <Link href="/dashboard" className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition-colors">
                View My Progress
              </Link>
            )}
            <button onClick={() => { resetTestSession(); setStep(4); }} className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-colors">
              Take Another Test
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
