"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Loader2, ArrowLeft, Trophy, Target, History, LogOut, 
  ArrowRight, BookOpen, CheckCircle, Flame, Zap, User, 
  Sparkles, AlertCircle, Compass, GraduationCap 
} from 'lucide-react';
import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [authUser, setAuthUser] = useState(null);
  const [authProfile, setAuthProfile] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [schemaStatus, setSchemaStatus] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [authMode, setAuthMode] = useState('signin'); // 'signin' | 'signup'
  const [authForm, setAuthForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });

  // Check auth session on mount and listen to changes
  useEffect(() => {
    let isMounted = true;

    const checkSessionAndFetch = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user && isMounted) {
          const user = session.user;
          const profile = {
            id: user.id,
            name: user.user_metadata?.name || user.email?.split('@')[0],
            email: user.email,
            phone: user.user_metadata?.phone || '',
          };
          setAuthUser(user);
          setAuthProfile(profile);
          await fetchSecureProgress(session.access_token);
        } else if (isMounted) {
          // If no active auth session, check legacy local storage for convenience
          const savedUserStr = localStorage.getItem('gls_free_user');
          if (savedUserStr) {
            try {
              const savedUser = JSON.parse(savedUserStr);
              if (savedUser?.email) {
                setAuthForm(prev => ({ ...prev, email: savedUser.email, name: savedUser.name || '' }));
              }
            } catch (e) {
              console.error(e);
            }
          }
          setLoading(false);
        }
      } catch (err) {
        console.error('Session check error:', err);
        if (isMounted) setLoading(false);
      }
    };

    checkSessionAndFetch();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!isMounted) return;
      if (session?.user) {
        const user = session.user;
        const profile = {
          id: user.id,
          name: user.user_metadata?.name || user.email?.split('@')[0],
          email: user.email,
          phone: user.user_metadata?.phone || '',
        };
        setAuthUser(user);
        setAuthProfile(profile);
        await fetchSecureProgress(session.access_token);
      } else {
        setAuthUser(null);
        setAuthProfile(null);
        setAttempts([]);
        setSchemaStatus(null);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchSecureProgress = async (token) => {
    setErrorMsg('');
    try {
      const res = await fetch('/api/my-progress', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch progress');
      setAttempts(data.allAttempts || data.attempts || []);
      setSchemaStatus(data.schemaStatus || null);
      if (data.user) {
        setAuthProfile(prev => ({ ...prev, ...data.user }));
      }
    } catch (err) {
      console.error('[fetchSecureProgress] Error:', err);
      setErrorMsg(err.message || 'Could not load your progress records.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setErrorMsg('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: authForm.email.trim(),
        password: authForm.password,
      });

      if (error) throw error;

      const user = data.user;
      const profile = {
        id: user.id,
        name: user.user_metadata?.name || user.email.split('@')[0],
        email: user.email,
        phone: user.user_metadata?.phone || '',
      };

      localStorage.setItem('gls_free_user', JSON.stringify(profile));
      setAuthUser(user);
      setAuthProfile(profile);
      await fetchSecureProgress(data.session.access_token);
    } catch (err) {
      setErrorMsg(err.message || 'Invalid email or password.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/learner-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: authForm.name,
          email: authForm.email,
          password: authForm.password,
          phone: authForm.phone,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Account creation failed');

      // Auto-sign in immediately
      const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({
        email: authForm.email.trim(),
        password: authForm.password,
      });

      if (signInErr) throw signInErr;

      const user = signInData.user;
      const profile = {
        id: user.id,
        name: authForm.name || user.email.split('@')[0],
        email: user.email,
        phone: authForm.phone || '',
      };

      localStorage.setItem('gls_free_user', JSON.stringify(profile));
      setAuthUser(user);
      setAuthProfile(profile);
      await fetchSecureProgress(signInData.session.access_token);
    } catch (err) {
      setErrorMsg(err.message || 'Error creating account. Please try again.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error(err);
    }
    localStorage.removeItem('gls_free_user');
    setAuthUser(null);
    setAuthProfile(null);
    setAttempts([]);
    setLoading(false);
  };

  // Metrics & Stats Calculations
  const stats = useMemo(() => {
    const totalTests = attempts.length;
    const scoredAttempts = attempts.filter(a => a.percentage !== null && a.percentage !== undefined);
    const bestScore = totalTests > 0 ? Math.max(...attempts.map(a => a.percentage || 0)) : 0;
    const avgScore = scoredAttempts.length > 0
      ? Math.round(scoredAttempts.reduce((acc, curr) => acc + (curr.percentage || 0), 0) / scoredAttempts.length)
      : 0;

    // Calculate streak (consecutive active practice days)
    const uniqueDates = Array.from(new Set(
      attempts.map(a => new Date(a.created_at).toDateString())
    )).sort((a, b) => new Date(b) - new Date(a));

    let streakDays = 0;
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    if (uniqueDates.length > 0) {
      const hasRecentPractice = uniqueDates[0] === today || uniqueDates[0] === yesterday;
      if (hasRecentPractice) {
        streakDays = 1;
        let prevDate = new Date(uniqueDates[0]);
        for (let i = 1; i < uniqueDates.length; i++) {
          const currDate = new Date(uniqueDates[i]);
          const diffInDays = Math.round((prevDate - currDate) / (1000 * 60 * 60 * 24));
          if (diffInDays === 1) {
            streakDays++;
            prevDate = currDate;
          } else {
            break;
          }
        }
      }
    }

    // Weekly practice goal: 5 tests target
    const oneWeekAgo = Date.now() - 7 * 86400000;
    const testsThisWeek = attempts.filter(a => new Date(a.created_at).getTime() >= oneWeekAgo).length;

    // Continue Learning recommendation
    let nextLevel = 'A1';
    let recommendationTitle = 'Start German A1 Practice';
    let recommendationDesc = 'Begin with core vocabulary, basic greetings, and introductory grammar drills.';

    if (attempts.length > 0) {
      const latestAttempt = attempts[0];
      const latestLevel = latestAttempt.level || latestAttempt.practice_materials?.level || 'A1';
      nextLevel = latestLevel;

      if ((latestAttempt.percentage || 0) >= 80) {
        const levelsOrder = ['A1', 'A2', 'B1', 'B2'];
        const currentIdx = levelsOrder.indexOf(latestLevel);
        if (currentIdx !== -1 && currentIdx < levelsOrder.length - 1) {
          nextLevel = levelsOrder[currentIdx + 1];
          recommendationTitle = `Step Up to German ${nextLevel}`;
          recommendationDesc = `Great job mastering ${latestLevel}! Advance your skills with ${nextLevel} grammar and reading drills.`;
        } else {
          recommendationTitle = `Continue German ${latestLevel} Mastery`;
          recommendationDesc = `Challenge yourself with advanced exam-style drills in ${latestLevel}.`;
        }
      } else {
        recommendationTitle = `Continue German ${latestLevel} Practice`;
        recommendationDesc = `Reinforce your ${latestLevel} skills with targeted reading, grammar, and vocabulary exercises.`;
      }
    }

    return {
      totalTests,
      avgScore,
      bestScore,
      streakDays,
      testsThisWeek,
      weeklyGoal: 5,
      nextLevel,
      recommendationTitle,
      recommendationDesc,
    };
  }, [attempts]);

  // --- UNAUTHENTICATED STATE: Public Learner Auth Card ---
  if (!authUser && !loading) {
    return (
      <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl animate-fade-in relative">
          <Link href="/practice-tests" className="absolute top-6 left-6 text-slate-500 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <div className="text-center mb-8 pt-4">
            <div className="w-16 h-16 mx-auto bg-amber-500/10 rounded-2xl flex items-center justify-center mb-4 border border-amber-500/20">
              <User className="w-8 h-8 text-amber-400" />
            </div>
            <h2 className="text-2xl font-extrabold text-white">
              {authMode === 'signin' ? 'Learner Sign In' : 'Create Free Account'}
            </h2>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              {authMode === 'signin'
                ? 'Sign in to access your practice history, streaks, and CEFR progress securely.'
                : 'Create your learner account to save all test attempts to your personal profile.'}
            </p>
          </div>

          {/* Tab Selector */}
          <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-xl mb-6 border border-slate-800">
            <button
              type="button"
              onClick={() => { setAuthMode('signin'); setErrorMsg(''); }}
              className={`py-2 text-xs font-bold rounded-lg transition-colors ${authMode === 'signin' ? 'bg-amber-400 text-slate-950 shadow' : 'text-slate-400 hover:text-white'}`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode('signup'); setErrorMsg(''); }}
              className={`py-2 text-xs font-bold rounded-lg transition-colors ${authMode === 'signup' ? 'bg-amber-400 text-slate-950 shadow' : 'text-slate-400 hover:text-white'}`}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={authMode === 'signin' ? handleSignIn : handleSignUp} className="space-y-4">
            {errorMsg && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>{errorMsg}</p>
              </div>
            )}

            {authMode === 'signup' && (
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Full Name *</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. Ali Ahmed" 
                  value={authForm.name} 
                  onChange={e => setAuthForm({ ...authForm, name: e.target.value })} 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none" 
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Email Address *</label>
              <input 
                type="email" 
                required 
                placeholder="you@example.com" 
                value={authForm.email} 
                onChange={e => setAuthForm({ ...authForm, email: e.target.value })} 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none" 
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Password * (min 6 characters)</label>
              <input 
                type="password" 
                required 
                minLength={6}
                placeholder="••••••••" 
                value={authForm.password} 
                onChange={e => setAuthForm({ ...authForm, password: e.target.value })} 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none" 
              />
            </div>

            {authMode === 'signup' && (
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Phone Number (optional)</label>
                <input 
                  type="text" 
                  placeholder="+92 300 1234567" 
                  value={authForm.phone} 
                  onChange={e => setAuthForm({ ...authForm, phone: e.target.value })} 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none" 
                />
              </div>
            )}

            <button 
              disabled={authLoading} 
              type="submit" 
              className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50 mt-2"
            >
              {authLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {authMode === 'signin' ? 'Sign In & View Progress' : 'Create Free Account'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-800/80 text-center">
            <Link 
              href="/practice-tests" 
              className="text-xs text-slate-400 hover:text-amber-400 transition-colors inline-flex items-center gap-1"
            >
              Take practice tests without signing in <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-6">
          <div>
            <Link href="/practice-tests" className="text-xs text-slate-400 hover:text-amber-400 mb-2 inline-flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" /> Back to Practice Tests
            </Link>
            <h1 className="text-3xl font-extrabold text-white">Learner Dashboard</h1>
            <p className="text-slate-400 text-sm mt-1">
              Welcome back, <strong className="text-amber-400">{authProfile?.name || authUser?.email?.split('@')[0]}</strong>
              <span className="text-slate-600 mx-2">•</span>
              <span className="text-xs text-slate-500">{authUser?.email}</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/practice-tests"
              className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs sm:text-sm font-extrabold rounded-xl transition-all shadow-md flex items-center gap-1.5"
            >
              <Compass className="w-4 h-4" /> Start Practice
            </Link>
            <button 
              onClick={handleLogout}
              className="px-4 py-2.5 bg-slate-900 border border-slate-800 hover:bg-red-500/10 hover:text-red-400 text-slate-400 text-xs sm:text-sm font-semibold rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
            <p className="text-xs text-slate-400">Loading your progress...</p>
          </div>
        ) : (
          <>
            {/* Continue Learning & Goal Hero Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Continue Learning Card */}
              <div className="lg:col-span-2 relative isolate overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-br from-[#121d33] via-slate-900 to-slate-950 p-6 sm:p-8 shadow-xl">
                <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-20 -z-10 h-64 w-64 rounded-full bg-amber-500/15 blur-3xl" />
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div className="space-y-2 max-w-lg">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/25 bg-amber-400/10 px-3 py-1 text-xs font-bold text-amber-300">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Continue Learning
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                      {stats.recommendationTitle}
                    </h2>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {stats.recommendationDesc}
                    </p>
                  </div>
                  <Link
                    href="/practice-tests"
                    className="shrink-0 px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-sm rounded-xl transition-all shadow-lg flex items-center gap-2 hover:-translate-y-0.5"
                  >
                    Resume Practice <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Streak & Weekly Goal Widget */}
              <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Practice Streak</span>
                    <span className="flex items-center gap-1 text-xs font-extrabold text-amber-400">
                      <Flame className="w-4 h-4 fill-amber-400 text-amber-500" /> {stats.streakDays} Day{stats.streakDays === 1 ? '' : 's'}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-white">{stats.streakDays}</span>
                    <span className="text-xs text-slate-400">consecutive active practice {stats.streakDays === 1 ? 'day' : 'days'}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800/80">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-300">Weekly Goal</span>
                    <span className="text-xs font-extrabold text-emerald-400">{stats.testsThisWeek} / {stats.weeklyGoal} tests</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 rounded-full transition-all duration-700"
                      style={{ width: `${Math.min(100, (stats.testsThisWeek / stats.weeklyGoal) * 100)}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2">
                    {stats.testsThisWeek >= stats.weeklyGoal 
                      ? 'Goal achieved this week! Keep the momentum going.' 
                      : `${stats.weeklyGoal - stats.testsThisWeek} more test${stats.weeklyGoal - stats.testsThisWeek === 1 ? '' : 's'} to hit your weekly goal.`}
                  </p>
                </div>
              </div>

            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex items-center gap-4 shadow-lg">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shrink-0">
                  <History className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Tests Completed</p>
                  <p className="text-3xl font-extrabold text-white">{stats.totalTests}</p>
                </div>
              </div>

              <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex items-center gap-4 shadow-lg">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shrink-0">
                  <Target className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Avg Accuracy</p>
                  <p className="text-3xl font-extrabold text-white">{stats.avgScore}%</p>
                </div>
              </div>

              <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex items-center gap-4 shadow-lg">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 shrink-0">
                  <Trophy className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Best Accuracy</p>
                  <p className="text-3xl font-extrabold text-white">{stats.bestScore}%</p>
                </div>
              </div>
            </div>

            {/* Level-Wise Progress Breakdown & Level Selection */}
            <section className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
                <div>
                  <h2 className="text-xl font-bold text-white">CEFR Level Progression</h2>
                  <p className="text-sm text-slate-400">Track your performance and jump straight into level-specific practice tests.</p>
                </div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">A1 to B2 Roadmap</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { lvl: 'A1', title: 'Beginner', color: 'emerald', border: 'border-emerald-500/30', bg: 'bg-emerald-400', link: '/practice-tests/german-a1' },
                  { lvl: 'A2', title: 'Elementary', color: 'sky', border: 'border-sky-500/30', bg: 'bg-sky-400', link: '/practice-tests/german-a2' },
                  { lvl: 'B1', title: 'Intermediate', color: 'amber', border: 'border-amber-500/30', bg: 'bg-amber-400', link: '/practice-tests/german-b1' },
                  { lvl: 'B2', title: 'Upper Int.', color: 'violet', border: 'border-violet-500/30', bg: 'bg-violet-400', link: '/practice-tests/german-b2' },
                ].map(({ lvl, title, bg, border, link }) => {
                  const levelAttempts = attempts.filter(
                    a => (a.level === lvl || a.practice_materials?.level === lvl) && a.percentage !== null && a.percentage !== undefined
                  );
                  const accuracy = levelAttempts.length
                    ? Math.round(levelAttempts.reduce((sum, a) => sum + Number(a.percentage || 0), 0) / levelAttempts.length)
                    : 0;

                  return (
                    <div 
                      key={lvl} 
                      className={`rounded-2xl border ${border} bg-slate-900/80 p-5 flex flex-col justify-between space-y-4 shadow-lg`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-black text-white">{lvl}</span>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{title}</span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">
                            {levelAttempts.length ? `${levelAttempts.length} test${levelAttempts.length === 1 ? '' : 's'} taken` : 'No attempts yet'}
                          </p>
                        </div>
                        <span className="text-2xl font-black text-white">{accuracy}%</span>
                      </div>

                      <div className="space-y-1.5">
                        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${bg} rounded-full transition-all duration-700`}
                            style={{ width: `${accuracy}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                          <span>Accuracy</span>
                          <span>{accuracy}%</span>
                        </div>
                      </div>

                      <Link
                        href={link}
                        className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white hover:text-amber-400 text-xs font-bold rounded-xl transition-colors text-center flex items-center justify-center gap-1.5"
                      >
                        Practice {lvl} Tests <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Recent Attempts History Table */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">Recent Attempts</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Verified records linked strictly to your learner account.</p>
                </div>
                <span className="text-xs text-slate-500">{attempts.length} total attempt{attempts.length === 1 ? '' : 's'} saved</span>
              </div>
              
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-950 text-xs uppercase font-bold text-slate-500">
                    <tr>
                      <th className="px-6 py-4">Activity &amp; Title</th>
                      <th className="px-6 py-4">Level</th>
                      <th className="px-6 py-4">Score</th>
                      <th className="px-6 py-4">Accuracy</th>
                      <th className="px-6 py-4 text-right">Date &amp; Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {attempts.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                          No practice tests recorded yet.
                          <div className="mt-2">
                            <Link href="/practice-tests" className="text-amber-400 font-bold hover:underline inline-flex items-center gap-1">
                              Take your first practice test <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      attempts.map(attempt => (
                        <tr key={attempt.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-bold text-white">
                              {attempt.title || attempt.practice_materials?.title || 'German Practice Drill'}
                            </div>
                            {attempt.category && (
                              <span className="text-[10px] text-amber-400/90 font-medium mt-0.5 inline-block">
                                {attempt.category}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2.5 py-1 bg-slate-800 rounded-md text-[10px] font-bold text-slate-300">
                              {attempt.level || attempt.practice_materials?.level || '—'}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-mono font-bold text-white">
                            {attempt.score !== null && attempt.score !== undefined ? attempt.score : '—'}{' '}
                            <span className="text-slate-500 font-normal">
                              {attempt.total_marks ? `/ ${attempt.total_marks}` : ''}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`font-bold text-xs px-2.5 py-1 rounded-md ${
                              (attempt.percentage || 0) >= 80 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                              (attempt.percentage || 0) >= 50 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 
                              'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            }`}>
                              {attempt.percentage !== null && attempt.percentage !== undefined ? `${attempt.percentage}%` : 'Pending'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right text-xs text-slate-500">
                            {new Date(attempt.created_at).toLocaleDateString(undefined, {
                              year: 'numeric', month: 'short', day: 'numeric',
                              hour: '2-digit', minute: '2-digit'
                            })}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Database Setup Notice if Migration Pending */}
              {schemaStatus && (!schemaStatus.readingSupported || !schemaStatus.grammarSupported || !schemaStatus.vocabSupported) && (
                <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 flex items-start gap-3 text-xs text-slate-400">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-300">Database setup note:</span> Practice test attempts are fully saved to your account. Reading, Grammar, and Vocabulary engines will appear in your account history once the migration <code className="text-amber-400 bg-slate-950 px-1.5 py-0.5 rounded font-mono">supabase/add_user_id_to_attempt_tables.sql</code> is applied in Supabase.
                  </div>
                </div>
              )}
            </div>

          </>
        )}
      </div>
    </div>
  );
}
