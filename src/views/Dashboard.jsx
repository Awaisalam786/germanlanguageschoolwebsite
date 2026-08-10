"use client";

import React, { useState, useEffect } from 'react';
import { Loader2, ArrowLeft, Trophy, Target, History, LogOut, Mail, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [userEmail, setUserEmail] = useState(null);
  const [userName, setUserName] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // Check if user info is already in local storage
    const savedUserStr = localStorage.getItem('gls_free_user');
    if (savedUserStr) {
      try {
        const savedUser = JSON.parse(savedUserStr);
        if (savedUser && savedUser.email) {
          setUserName(savedUser.name);
          setUserEmail(savedUser.email);
          fetchAttempts(savedUser.email);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const fetchAttempts = async (email) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch(`/api/my-progress?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch progress');
      setAttempts(data.attempts || []);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message);
    }
    setLoading(false);
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (!emailInput) return;
    setUserEmail(emailInput);
    setUserName(null); // Unknown name, just looking up by email
    fetchAttempts(emailInput);
  };

  const handleLogout = () => {
    localStorage.removeItem('gls_free_user');
    setUserEmail(null);
    setUserName(null);
    setAttempts([]);
    setEmailInput('');
  };

  if (!userEmail) {
    return (
      <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl animate-fade-in relative">
          <Link href="/practice-tests" className="absolute top-6 left-6 text-slate-500 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="text-center mb-8 pt-4">
            <div className="w-16 h-16 mx-auto bg-amber-500/10 rounded-full flex items-center justify-center mb-4 border border-amber-500/20">
              <History className="w-8 h-8 text-amber-400" />
            </div>
            <h2 className="text-2xl font-extrabold text-white">View My Progress</h2>
            <p className="text-sm text-slate-400 mt-2">Enter the email address you used to take the tests.</p>
          </div>

          <form onSubmit={handleEmailSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xs text-center">
                {errorMsg}
              </div>
            )}
            <div>
              <input 
                type="email" 
                required 
                placeholder="you@example.com" 
                value={emailInput} 
                onChange={e => setEmailInput(e.target.value)} 
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-sm text-white focus:border-amber-500 focus:outline-none text-center" 
              />
            </div>
            <button 
              disabled={loading} 
              type="submit" 
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>View Progress <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Calculate stats
  const totalTests = attempts.length;
  const bestScore = totalTests > 0 ? Math.max(...attempts.map(a => a.percentage || 0)) : 0;
  const avgScore = totalTests > 0 
    ? Math.round(attempts.reduce((acc, curr) => acc + (curr.percentage || 0), 0) / totalTests)
    : 0;

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-6">
          <div>
            <Link href="/practice-tests" className="text-xs text-slate-400 hover:text-amber-400 mb-2 inline-flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" /> Back to tests
            </Link>
            <h1 className="text-3xl font-extrabold text-white">My Progress</h1>
            <p className="text-slate-400 text-sm mt-1">
              {userName ? `Welcome back, ${userName}` : `Viewing progress for ${userEmail}`}
            </p>
          </div>
          <button 
            onClick={handleLogout}
            className="px-4 py-2 bg-slate-900 border border-slate-800 hover:bg-red-500/10 hover:text-red-400 text-slate-300 text-sm font-bold rounded-lg transition-colors flex items-center gap-2 shadow-sm"
          >
            <LogOut className="w-4 h-4" /> Change Email
          </button>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center">
            <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex items-center gap-4 shadow-lg">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                  <History className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Tests Taken</p>
                  <p className="text-3xl font-extrabold text-white">{totalTests}</p>
                </div>
              </div>
              <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex items-center gap-4 shadow-lg">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                  <Target className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Avg Accuracy</p>
                  <p className="text-3xl font-extrabold text-white">{avgScore}%</p>
                </div>
              </div>
              <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex items-center gap-4 shadow-lg">
                <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                  <Trophy className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Best Score</p>
                  <p className="text-3xl font-extrabold text-white">{bestScore}%</p>
                </div>
              </div>
            </div>

            {/* History Table */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white">Recent Attempts</h2>
              
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-950 text-xs uppercase font-bold text-slate-500">
                    <tr>
                      <th className="px-6 py-4">Test Name</th>
                      <th className="px-6 py-4">Level</th>
                      <th className="px-6 py-4">Score</th>
                      <th className="px-6 py-4">Accuracy</th>
                      <th className="px-6 py-4 text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {attempts.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                          No tests found for this email. <Link href="/practice-tests" className="text-amber-400 hover:underline">Take one now.</Link>
                        </td>
                      </tr>
                    ) : (
                      attempts.map(attempt => (
                        <tr key={attempt.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="px-6 py-4 font-bold text-white">
                            {attempt.practice_materials?.title || 'Unknown Test'}
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2.5 py-1 bg-slate-800 rounded-md text-[10px] font-bold text-slate-400">
                              {attempt.practice_materials?.level || '—'}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-mono font-bold text-white">
                            {attempt.score} <span className="text-slate-500 font-normal">/ {attempt.total_marks}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`font-bold ${
                              (attempt.percentage || 0) >= 70 ? 'text-emerald-400' : 
                              (attempt.percentage || 0) >= 50 ? 'text-amber-400' : 'text-red-400'
                            }`}>
                              {attempt.percentage || 0}%
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
            </div>
          </>
        )}
      </div>
    </div>
  );
}
