"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import {
  CheckSquare, BookOpen, Key, User, Phone, Mail,
  ArrowRight, Loader2, PlayCircle, CheckCircle, AlertCircle, Trophy, Star,
  LogOut, LayoutDashboard
} from 'lucide-react';
import Link from 'next/link';

export default function PracticeTests() {
  const [step, setStep] = useState(1); // 1: Selection, 2: Identity, 3: Test Runner, 4: Result
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Auth & Profile for Free Users
  const [freeUserForm, setFreeUserForm] = useState({ name: '', phone: '', email: '' });
  const [storedFreeUser, setStoredFreeUser] = useState(null);

  // Step 1
  const [materials, setMaterials] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  // Step 2 (Students)
  const [userType, setUserType] = useState(''); // 'free' | 'student'
  const [accessCode, setAccessCode] = useState('');
  const [verifiedCode, setVerifiedCode] = useState(null);
  const [studentName, setStudentName] = useState('');
  const [batchName, setBatchName] = useState('');

  // Step 3
  const [htmlContent, setHtmlContent] = useState('');
  const [htmlLoading, setHtmlLoading] = useState(false);

  // Step 4
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    fetchMaterials();
    // Check local storage for free user
    const savedUser = localStorage.getItem('gls_free_user');
    if (savedUser) {
      try {
        setStoredFreeUser(JSON.parse(savedUser));
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
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const testId = params.get('testId');
        if (testId) {
          const match = data.find(m => m.id === testId);
          if (match) { 
            setSelectedMaterial(match); 
            // If we have stored user, jump to test
            const saved = localStorage.getItem('gls_free_user');
            if (saved) {
              setUserType('free');
              setStep(3);
            } else {
              setStep(2); 
            }
          }
        }
      }
    }
    setLoading(false);
  };

  const handleSelectMaterial = (mat) => {
    setSelectedMaterial(mat);
    setUserType('');
    setErrorMsg('');
    
    if (storedFreeUser) {
      setUserType('free');
      setStep(3);
    } else {
      setStep(2);
    }
  };

  // --- Path A: Free User Submit ---
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
    setStep(3);
  };

  // --- Path B: Existing student verifies code ---
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
        setStep(2.5);
      } else {
        setErrorMsg('Batch code not recognized or inactive. Please check with admin.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Error verifying code. Please try again.');
    }
    setLoading(false);
  };

  // --- Step 3: Load HTML + listen for postMessage ---
  useEffect(() => {
    if (step !== 3 || !selectedMaterial) return;

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
        setStep(1);
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

  // --- Save attempt via server API ---
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
      setStep(4);
    } catch (err) {
      console.error('[saveAttempt] Error:', err);
      alert(`Error saving result: ${err.message}\n\nPlease screenshot your result and contact admin.`);
    }
    setLoading(false);
  };


  const resetAll = () => {
    setStep(1);
    setUserType('');
    setAccessCode('');
    setVerifiedCode(null);
    setTestResult(null);
    setHtmlContent('');
    setErrorMsg('');
  };

  const handleLogout = () => {
    if (userType === 'free') {
      localStorage.removeItem('gls_free_user');
      setStoredFreeUser(null);
    }
    resetAll();
  };

  const filteredMaterials = selectedLevel === 'All'
    ? materials
    : materials.filter(m => m.level === selectedLevel);
  const uniqueLevels = ['All', ...new Set(materials.map(m => m.level))];

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">

      {/* Top Right Navigation for logged-in users & students */}
      {((storedFreeUser && step !== 3) || (userType === 'student' && step !== 3)) && (
        <div className="absolute top-4 right-4 sm:top-8 sm:right-8 flex items-center gap-4 z-50">
          {storedFreeUser && (
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

      {/* ───── STEP 1: Test Selection ───── */}
      {step === 1 && (
        <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
          <div className="text-center space-y-3">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/30">
              Free Practice Materials
            </span>
            <h1 className="text-4xl font-extrabold text-white">Interactive Practice Tests</h1>
            <p className="text-sm text-slate-300">Test your German skills with our live grading system.</p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 text-amber-500 animate-spin mx-auto" />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Level Filter */}
              <div className="flex flex-wrap justify-center gap-3">
                {uniqueLevels.map(lvl => (
                  <button
                    key={lvl}
                    onClick={() => setSelectedLevel(lvl)}
                    className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                      selectedLevel === lvl
                        ? 'bg-amber-500 text-slate-950 shadow-lg'
                        : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white hover:border-slate-600'
                    }`}
                  >
                    {lvl === 'All' ? 'All Levels' : `Level ${lvl}`}
                  </button>
                ))}
              </div>

              {/* Materials Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMaterials.length === 0 ? (
                  <div className="col-span-full text-center text-slate-500 py-12 bg-slate-900/50 rounded-2xl border border-slate-800 border-dashed">
                    No active tests found for this level.
                  </div>
                ) : (
                  filteredMaterials.map(mat => (
                    <div key={mat.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between group hover:border-amber-500/50 transition-colors shadow-lg">
                      <div>
                        <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 font-extrabold flex items-center justify-center text-lg mb-4 border border-amber-500/20">
                          {mat.level}
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">{mat.title}</h3>
                        <p className="text-xs text-slate-400 flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" /> {mat.test_type}</p>
                      </div>
                      <button
                        onClick={() => handleSelectMaterial(mat)}
                        className="mt-6 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300 font-bold text-sm transition-all flex items-center justify-center gap-2 group-hover:shadow-gold-glow"
                      >
                        Start Test <PlayCircle className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ───── STEP 2: Identity Choice ───── */}
      {step === 2 && !userType && (
        <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
          <div className="text-center space-y-2">
            <button onClick={() => { setStep(1); setUserType(''); }} className="text-xs text-slate-400 hover:text-amber-400 mb-4 inline-block">← Back to tests</button>
            <h2 className="text-3xl font-extrabold text-white">Before You Begin</h2>
            <p className="text-sm text-slate-400">Selected: <strong className="text-white">{selectedMaterial?.title}</strong></p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <button
              onClick={() => { setUserType('free'); setErrorMsg(''); }}
              className="p-8 bg-slate-900 border border-slate-800 rounded-2xl text-center hover:border-amber-500 hover:bg-amber-500/5 transition-all group"
            >
              <div className="w-16 h-16 mx-auto bg-amber-500/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-amber-500/20">
                <User className="w-8 h-8 text-amber-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Free Practice</h3>
              <p className="text-xs text-slate-400">Enter your details to track your scores.</p>
            </button>

            <button
              onClick={() => { setUserType('student'); setErrorMsg(''); }}
              className="p-8 bg-slate-900 border border-slate-800 rounded-2xl text-center hover:border-emerald-500 hover:bg-emerald-500/5 transition-all group"
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

      {/* Free User Details Form */}
      {step === 2 && userType === 'free' && (
        <div className="max-w-md mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl relative animate-fade-in">
          <button onClick={() => { setUserType(''); setErrorMsg(''); }} className="absolute top-4 right-4 text-xs text-slate-500 hover:text-white">← Change</button>
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
            <button type="submit" className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg flex items-center justify-center gap-2 mt-4">
              Continue to Test <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Student Details Form */}
      {step === 2 && userType === 'student' && (
        <div className="max-w-md mx-auto animate-fade-in">
          <button onClick={() => { setUserType(''); setStep(1); }} className="mb-6 text-sm text-slate-400 hover:text-white flex items-center gap-2">
            &larr; Back to tests
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

      {/* STEP 2.5: ENTER STUDENT NAME */}
      {step === 2.5 && userType === 'student' && (
        <div className="max-w-md mx-auto animate-fade-in">
          <button onClick={() => setStep(2)} className="mb-6 text-sm text-slate-400 hover:text-white flex items-center gap-2">&larr; Back to code entry</button>
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-2xl">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6"><User className="w-6 h-6 text-emerald-400" /></div>
            <h2 className="text-2xl font-extrabold text-white mb-2">Almost there!</h2>
            <p className="text-slate-400 text-sm mb-6">You are joining <strong className="text-emerald-400">{batchName}</strong>. Please enter your name.</p>
            <form onSubmit={(e) => { e.preventDefault(); setStep(3); }} className="space-y-4">
              <input type="text" required placeholder="John Doe" value={studentName} onChange={e => setStudentName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500" />
              <button type="submit" className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl flex justify-center items-center gap-2"><PlayCircle className="w-5 h-5" /> Start Test</button>
            </form>
          </div>
        </div>
      )}

      {/* ───── STEP 3: Test Runner ───── */}
      {step === 3 && (
        <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col animate-fade-in">
          {/* Top Bar */}
          <div className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 shrink-0">
            <div className="flex items-center gap-3 text-white">
              <CheckSquare className="w-5 h-5 text-amber-500" />
              <div className="font-bold">{selectedMaterial?.title}</div>
              <div className="px-2 py-0.5 bg-slate-800 rounded text-[10px] text-slate-400 hidden sm:block">Level {selectedMaterial?.level}</div>
            </div>
            <div className="flex items-center gap-3">
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

      {/* ───── STEP 4: Result Screen ───── */}
      {step === 4 && testResult && (
        <div className="max-w-2xl mx-auto text-center space-y-8 animate-fade-in py-12">

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
                  <div className="space-y-2">
                    <div className={`text-2xl font-bold ${testResult.percentage >= 70 ? 'text-emerald-400' : testResult.percentage >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                      {testResult.percentage}% Accuracy
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-1000 ${testResult.percentage >= 70 ? 'bg-emerald-500' : testResult.percentage >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                        style={{ width: `${testResult.percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-400">
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
            <button onClick={resetAll} className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-colors">
              Take Another Test
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
