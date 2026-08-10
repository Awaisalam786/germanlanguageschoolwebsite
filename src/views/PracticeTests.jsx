"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import {
  CheckSquare, BookOpen, Key, User, Phone, Mail,
  ArrowRight, Loader2, PlayCircle, CheckCircle, AlertCircle, Trophy, Star
} from 'lucide-react';
import Link from 'next/link';

export default function PracticeTests() {
  const [step, setStep] = useState(1); // 1: Selection, 2: Identity, 3: Test Runner, 4: Result
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Step 1
  const [materials, setMaterials] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  // Step 2
  const [userType, setUserType] = useState(''); // 'anonymous' | 'student'
  const [accessCode, setAccessCode] = useState('');
  const [anonInfo, setAnonInfo] = useState({ first_name: '', last_name: '', phone: '', email: '' });
  const [verifiedCode, setVerifiedCode] = useState(null);
  const [studentName, setStudentName] = useState(''); // pulled from access code lookup

  // Step 3
  const [htmlContent, setHtmlContent] = useState('');
  const [htmlLoading, setHtmlLoading] = useState(false);

  // Step 4
  const [testResult, setTestResult] = useState(null); // { score, totalMarks, percentage, userType }

  useEffect(() => { fetchMaterials(); }, []);

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
          if (match) { setSelectedMaterial(match); setStep(2); }
        }
      }
    }
    setLoading(false);
  };

  const handleSelectMaterial = (mat) => {
    setSelectedMaterial(mat);
    setUserType('');
    setErrorMsg('');
    setStep(2);
  };

  // --- Path A: Anonymous user submits form ---
  const startTestAsAnonymous = (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!anonInfo.first_name || !anonInfo.last_name || !anonInfo.phone || !anonInfo.email) {
      setErrorMsg('All fields are required to proceed.');
      return;
    }
    setStep(3);
  };

  // --- Path B: Existing student verifies code ---
  const verifyAccessCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const { data, error } = await supabase.rpc('check_access_code', { code_input: accessCode.trim() });
      if (error) throw error;
      if (data && data.length > 0) {
        const student = data[0];
        setVerifiedCode(accessCode.trim());
        setStudentName(student.first_name || 'Student');
        setStep(3);
      } else {
        setErrorMsg('Code not recognized or inactive. Please check with admin.');
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
          // Fallback to direct URL
          const fallbackRes = await fetch(selectedMaterial.file_url);
          if (!fallbackRes.ok) throw new Error('Failed to load test file');
          setHtmlContent(await fallbackRes.text());
          return;
        }
        setHtmlContent(await res.text());
      } catch (err) {
        console.error('[loadHtml] Error:', err);
        alert(`Could not load test: ${err.message}`);
        setStep(2);
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

  // --- Save attempt via server API (bypasses RLS) ---
  const saveAttempt = async (score, totalMarks, answers, isFallback) => {
    setLoading(true);
    const percentage = (!isFallback && totalMarks > 0)
      ? Math.round((score / totalMarks) * 100)
      : null;

    const payload = {
      material_id: selectedMaterial?.id || null,
      user_type: userType, // 'anonymous' or 'student'
      // Anonymous fields
      first_name: userType === 'anonymous' ? anonInfo.first_name : null,
      last_name: userType === 'anonymous' ? anonInfo.last_name : null,
      phone: userType === 'anonymous' ? anonInfo.phone : null,
      email: userType === 'anonymous' ? anonInfo.email : null,
      // Student fields
      access_code_used: userType === 'student' ? verifiedCode : null,
      // Scores
      score: isFallback ? null : score,
      total_marks: isFallback ? null : totalMarks,
      percentage: isFallback ? null : percentage,
      answers: answers || null,
      country: 'Pakistan',
    };

    try {
      console.log('[saveAttempt] Payload:', payload);

      const res = await fetch('/api/save-attempt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      console.log('[saveAttempt] Response:', res.status, result);

      if (!res.ok) throw new Error(result.error || 'Save failed');

      setTestResult({ score, totalMarks, percentage, isFallback, userType });
      setStep(4);
    } catch (err) {
      console.error('[saveAttempt] Error:', err);
      alert(`Error saving result: ${err.message}\n\nPlease screenshot your result and contact admin.`);
    }
    setLoading(false);
  };

  const handleManualSubmit = () => {
    if (window.confirm('Submit the test now? Make sure you have finished all questions.')) {
      saveAttempt(null, null, null, true);
    }
  };

  const resetAll = () => {
    setStep(1);
    setUserType('');
    setAccessCode('');
    setAnonInfo({ first_name: '', last_name: '', phone: '', email: '' });
    setVerifiedCode(null);
    setStudentName('');
    setTestResult(null);
    setHtmlContent('');
    setErrorMsg('');
  };

  const filteredMaterials = selectedLevel === 'All'
    ? materials
    : materials.filter(m => m.level === selectedLevel);
  const uniqueLevels = ['All', ...new Set(materials.map(m => m.level))];

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">

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
      {step === 2 && (
        <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
          <div className="text-center space-y-2">
            <button onClick={() => { setStep(1); setUserType(''); }} className="text-xs text-slate-400 hover:text-amber-400 mb-4 inline-block">← Back to tests</button>
            <h2 className="text-3xl font-extrabold text-white">Before You Begin</h2>
            <p className="text-sm text-slate-400">Selected: <strong className="text-white">{selectedMaterial?.title}</strong></p>
          </div>

          {/* Fork: choose path */}
          {!userType && (
            <div className="grid sm:grid-cols-2 gap-6">
              {/* New / Anonymous */}
              <button
                onClick={() => { setUserType('anonymous'); setErrorMsg(''); }}
                className="p-8 bg-slate-900 border border-slate-800 rounded-2xl text-center hover:border-amber-500 hover:bg-amber-500/5 transition-all group"
              >
                <div className="w-16 h-16 mx-auto bg-amber-500/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-amber-500/20">
                  <User className="w-8 h-8 text-amber-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">I'm a New Student</h3>
                <p className="text-xs text-slate-400">Take a free practice test and see your score instantly.</p>
                <div className="mt-4 text-xs text-amber-400 font-bold flex items-center justify-center gap-1">
                  <Trophy className="w-3.5 h-3.5" /> Score shown after test
                </div>
              </button>

              {/* Existing / Student with code */}
              <button
                onClick={() => { setUserType('student'); setErrorMsg(''); }}
                className="p-8 bg-slate-900 border border-slate-800 rounded-2xl text-center hover:border-emerald-500 hover:bg-emerald-500/5 transition-all group"
              >
                <div className="w-16 h-16 mx-auto bg-emerald-500/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-emerald-500/20">
                  <Key className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">I'm an Enrolled Student</h3>
                <p className="text-xs text-slate-400">Use your student access code to begin.</p>
                <div className="mt-4 text-xs text-emerald-400 font-bold flex items-center justify-center gap-1">
                  <Star className="w-3.5 h-3.5" /> Results sent to teacher
                </div>
              </button>
            </div>
          )}

          {/* Forms */}
          {userType && (
            <div className="max-w-md mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl relative">
              <button onClick={() => { setUserType(''); setErrorMsg(''); }} className="absolute top-4 right-4 text-xs text-slate-500 hover:text-white transition-colors">← Change</button>

              {errorMsg && (
                <div className="mb-5 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-2 text-red-400 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>{errorMsg}</p>
                </div>
              )}

              {/* ── Path A: Anonymous ── */}
              {userType === 'anonymous' && (
                <form onSubmit={startTestAsAnonymous} className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">Your Details</h3>
                    <p className="text-xs text-slate-400 mt-1">We'll show your score right after the test.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">First Name *</label>
                      <input
                        type="text" required
                        value={anonInfo.first_name}
                        onChange={e => setAnonInfo({ ...anonInfo, first_name: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">Last Name *</label>
                      <input
                        type="text" required
                        value={anonInfo.last_name}
                        onChange={e => setAnonInfo({ ...anonInfo, last_name: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Phone Number * (+92...)</label>
                    <input
                      type="text" required placeholder="+923001234567"
                      value={anonInfo.phone}
                      onChange={e => setAnonInfo({ ...anonInfo, phone: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Email Address *</label>
                    <input
                      type="email" required placeholder="you@example.com"
                      value={anonInfo.email}
                      onChange={e => setAnonInfo({ ...anonInfo, email: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <button type="submit" className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg transition-colors flex items-center justify-center gap-2 mt-2">
                    Start Test Now <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* ── Path B: Enrolled Student ── */}
              {userType === 'student' && (
                <form onSubmit={verifyAccessCode} className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">Enter Access Code</h3>
                    <p className="text-xs text-slate-400 mt-1">Your results will be shared with your teacher.</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Your Student Code</label>
                    <input
                      type="text" required placeholder="e.g. GLS-7X2KP"
                      value={accessCode}
                      onChange={e => setAccessCode(e.target.value.toUpperCase())}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white font-mono uppercase tracking-widest focus:outline-none focus:border-emerald-500 text-center text-lg"
                    />
                  </div>
                  <button disabled={loading} type="submit" className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg transition-colors flex items-center justify-center gap-2">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (<>Verify & Start Test <ArrowRight className="w-4 h-4" /></>)}
                  </button>
                </form>
              )}
            </div>
          )}
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
                {userType === 'anonymous'
                  ? <>Student: <strong className="text-white">{anonInfo.first_name}</strong></>
                  : <>Code: <strong className="text-emerald-400">{verifiedCode}</strong></>
                }
              </div>
              <button
                onClick={handleManualSubmit}
                disabled={loading}
                className="px-4 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold rounded-lg border border-red-500/30 transition-colors flex items-center gap-2"
              >
                {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Finish & Submit'}
              </button>
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
              {testResult.userType === 'anonymous'
                ? `Great job, ${anonInfo.first_name}!`
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
            <button onClick={resetAll} className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition-colors">
              Take Another Test
            </button>
            <Link href="/" className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-colors">
              Back to Homepage
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
