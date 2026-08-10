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
  const [step, setStep] = useState(1); // 1: Selection, 2: Identity, 3: Test Runner, 4: Result, 5: Profile Completion, 6: Check Email
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  // Auth & Profile
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [emailInput, setEmailInput] = useState('');
  const [profileForm, setProfileForm] = useState({ name: '', phone: '' });

  // Step 1
  const [materials, setMaterials] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  // Step 2
  const [userType, setUserType] = useState(''); // 'free' | 'student'
  const [accessCode, setAccessCode] = useState('');
  const [verifiedCode, setVerifiedCode] = useState(null);

  // Step 3
  const [htmlContent, setHtmlContent] = useState('');
  const [htmlLoading, setHtmlLoading] = useState(false);

  // Step 4
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    checkSession();
    fetchMaterials();
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        checkProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setSession(session);
    if (session) {
      checkProfile(session.user.id);
    }
  };

  const checkProfile = async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching profile:', error);
    }

    if (data && data.name && data.phone) {
      setProfile(data);
      // If we were waiting for profile, go to tests
      if (step === 5) setStep(1);
    } else {
      // Need to complete profile
      setStep(5);
    }
  };

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
            // If already logged in and have profile, skip identity step
            if (session && profile) {
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
    
    if (session && profile) {
      setUserType('free');
      setStep(3);
    } else if (session && !profile) {
      setStep(5); // Complete profile first
    } else {
      setStep(2);
    }
  };

  // --- Path A: Free User (Email Magic Link) ---
  const handleSendMagicLink = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    
    if (!emailInput) {
      setErrorMsg('Email is required.');
      setLoading(false);
      return;
    }

    const redirectUrl = `${window.location.origin}/auth/callback?next=/practice-tests${selectedMaterial ? `?testId=${selectedMaterial.id}` : ''}`;
    
    const { error } = await supabase.auth.signInWithOtp({
      email: emailInput,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });

    if (error) {
      setErrorMsg(error.message);
    } else {
      setStep(6); // Show "Check your email" screen
    }
    setLoading(false);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    if (!profileForm.name || !profileForm.phone) {
      setErrorMsg('Name and phone are required.');
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: session.user.id,
        name: profileForm.name,
        phone: profileForm.phone,
        email: session.user.email
      });

    if (error) {
      setErrorMsg(error.message);
    } else {
      setProfile({ name: profileForm.name, phone: profileForm.phone, email: session.user.email });
      if (selectedMaterial) {
        setUserType('free');
        setStep(3);
      } else {
        setStep(1);
      }
    }
    setLoading(false);
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
        setVerifiedCode(accessCode.trim());
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
    const percentage = (!isFallback && totalMarks > 0)
      ? Math.round((score / totalMarks) * 100)
      : null;

    const payload = {
      material_id: selectedMaterial?.id || null,
      user_type: userType, // 'free' or 'student'
      // Free User fields (server API handles using session user_id)
      // but we pass it anyway
      user_id: userType === 'free' ? session?.user?.id : null,
      
      // We don't send name/phone anymore! Profiles table handles it.
      
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

  const handleManualSubmit = () => {
    if (window.confirm('Submit the test now? Make sure you have finished all questions.')) {
      saveAttempt(null, null, null, true);
    }
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

  const filteredMaterials = selectedLevel === 'All'
    ? materials
    : materials.filter(m => m.level === selectedLevel);
  const uniqueLevels = ['All', ...new Set(materials.map(m => m.level))];

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">

      {/* Top Right Navigation for logged-in users */}
      {session && step !== 3 && step !== 5 && (
        <div className="absolute top-4 right-4 sm:top-8 sm:right-8 flex items-center gap-4">
          <Link href="/dashboard" className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors bg-slate-900 border border-slate-800 px-4 py-2 rounded-lg shadow-lg">
            <LayoutDashboard className="w-4 h-4 text-amber-500" />
            My Progress
          </Link>
          <button 
            onClick={async () => { await supabase.auth.signOut(); resetAll(); }}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-red-400 transition-colors bg-slate-900 border border-slate-800 px-4 py-2 rounded-lg"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      )}

      {/* ───── STEP 5: Profile Completion ───── */}
      {step === 5 && (
        <div className="max-w-md mx-auto space-y-8 animate-fade-in pt-12">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-extrabold text-white">Complete Your Profile</h2>
            <p className="text-sm text-slate-400">Just one more step before you can take practice tests.</p>
          </div>
          
          <form onSubmit={handleSaveProfile} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-4">
            {errorMsg && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-2 text-red-400 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>{errorMsg}</p>
              </div>
            )}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Full Name *</label>
              <input
                type="text" required
                value={profileForm.name}
                onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Phone Number *</label>
              <input
                type="text" required placeholder="+923001234567"
                value={profileForm.phone}
                onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
            <button disabled={loading} type="submit" className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg transition-colors flex items-center justify-center gap-2 mt-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Profile'}
            </button>
          </form>
        </div>
      )}

      {/* ───── STEP 6: Check Email ───── */}
      {step === 6 && (
        <div className="max-w-md mx-auto text-center space-y-8 animate-fade-in pt-12">
          <div className="w-24 h-24 mx-auto bg-blue-500/10 rounded-full flex items-center justify-center border-4 border-blue-500/20">
            <Mail className="w-12 h-12 text-blue-400" />
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-extrabold text-white">Check Your Email</h2>
            <p className="text-slate-400">
              We've sent a magic login link to <strong className="text-white">{emailInput}</strong>.
            </p>
            <p className="text-sm text-slate-500">
              Click the link in the email to log in and continue to your test. You can close this window.
            </p>
          </div>
          <button onClick={() => setStep(2)} className="text-sm text-slate-400 hover:text-white underline">
            Try a different email
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
      {step === 2 && (
        <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
          <div className="text-center space-y-2">
            <button onClick={() => { setStep(1); setUserType(''); }} className="text-xs text-slate-400 hover:text-amber-400 mb-4 inline-block">← Back to tests</button>
            <h2 className="text-3xl font-extrabold text-white">Before You Begin</h2>
            <p className="text-sm text-slate-400">Selected: <strong className="text-white">{selectedMaterial?.title}</strong></p>
          </div>

          {!userType && (
            <div className="grid sm:grid-cols-2 gap-6">
              {/* Free / Magic Link */}
              <button
                onClick={() => { setUserType('free'); setErrorMsg(''); }}
                className="p-8 bg-slate-900 border border-slate-800 rounded-2xl text-center hover:border-amber-500 hover:bg-amber-500/5 transition-all group"
              >
                <div className="w-16 h-16 mx-auto bg-amber-500/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-amber-500/20">
                  <User className="w-8 h-8 text-amber-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Free Signup / Login</h3>
                <p className="text-xs text-slate-400">Track your progress and see your scores instantly.</p>
                <div className="mt-4 text-xs text-amber-400 font-bold flex items-center justify-center gap-1">
                  <Trophy className="w-3.5 h-3.5" /> My Progress Dashboard
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

              {/* ── Path A: Free / Magic Link ── */}
              {userType === 'free' && (
                <form onSubmit={handleSendMagicLink} className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">Login with Email</h3>
                    <p className="text-xs text-slate-400 mt-1">We'll send you a secure magic link to log in. No password required!</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Email Address</label>
                    <input
                      type="email" required placeholder="you@example.com"
                      value={emailInput}
                      onChange={e => setEmailInput(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <button disabled={loading} type="submit" className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg transition-colors flex items-center justify-center gap-2 mt-2">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Send Magic Link <Mail className="w-4 h-4" /></>}
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
                {userType === 'free'
                  ? <>Logged in as: <strong className="text-white">{profile?.name || session?.user?.email}</strong></>
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
              {testResult.userType === 'free'
                ? `Great job, ${profile?.name || 'Student'}!`
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
