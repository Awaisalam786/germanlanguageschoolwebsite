"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { 
  CheckSquare, BookOpen, Key, User, Phone, Mail, 
  ArrowRight, Loader2, PlayCircle, CheckCircle, AlertCircle
} from 'lucide-react';
import Link from 'next/link';

export default function PracticeTests() {
  const [step, setStep] = useState(1); // 1: Selection, 2: Access Check, 3: Test Runner, 4: Result
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Step 1: Materials
  const [materials, setMaterials] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  // Step 2: Access Check
  const [accessType, setAccessType] = useState(''); // 'new' or 'existing'
  const [accessCode, setAccessCode] = useState('');
  const [studentInfo, setStudentInfo] = useState({ first_name: '', last_name: '', phone: '', email: '' });
  const [verifiedCode, setVerifiedCode] = useState(null); // stores code if successfully verified

  // Step 4: Result
  const [testResult, setTestResult] = useState(null); // { score, totalMarks, isFallback }

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('practice_materials').select('*').eq('is_active', true).order('created_at', { ascending: false });
    if (!error && data) {
      setMaterials(data);
      
      // Check if a specific testId was provided in the URL
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const testId = params.get('testId');
        if (testId) {
          const match = data.find(m => m.id === testId);
          if (match) {
            setSelectedMaterial(match);
            setAccessType('');
            setStep(2);
          }
        }
      }
    }
    setLoading(false);
  };

  const handleSelectMaterial = (mat) => {
    setSelectedMaterial(mat);
    setAccessType('');
    setStep(2);
  };

  const verifyAccessCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const { data, error } = await supabase.rpc('check_access_code', { code_input: accessCode.trim() });
      if (error) throw error;
      if (data && data.length > 0) {
        const student = data[0];
        setStudentInfo({
          first_name: student.first_name,
          last_name: student.last_name,
          phone: student.phone,
          email: student.email
        });
        setVerifiedCode(accessCode.trim());
        setStep(3); // Start test
      } else {
        setErrorMsg("Code not recognized or inactive. Please check with admin.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Error verifying code.");
    }
    setLoading(false);
  };

  const startTestAsNewStudent = (e) => {
    e.preventDefault();
    if (!studentInfo.first_name || !studentInfo.last_name || !studentInfo.phone) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }
    setVerifiedCode(null);
    setStep(3);
  };

  // --- Step 3: Test Runner ---
  useEffect(() => {
    if (step !== 3) return;

    const handleMessage = async (event) => {
      // Allow any origin since HTML bundles might be hosted on Supabase Storage which has a different domain
      const data = event.data;
      if (data && data.type === 'PRACTICE_TEST_COMPLETE') {
        await saveAttempt(data.score, data.totalMarks, data.answers, false);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [step]);

  const saveAttempt = async (score, totalMarks, answers, isFallback) => {
    setLoading(true);
    try {
      const { error } = await supabase.from('practice_attempts').insert([{
        material_id: selectedMaterial.id,
        first_name: studentInfo.first_name,
        last_name: studentInfo.last_name,
        phone: studentInfo.phone,
        email: studentInfo.email,
        country: 'Pakistan',
        score: isFallback ? null : score,
        total_marks: isFallback ? null : totalMarks,
        answers: answers || null,
        access_code_used: verifiedCode || null
      }]);
      if (error) throw error;
      setTestResult({ score, totalMarks, isFallback });
      setStep(4);
    } catch (err) {
      console.error("Error saving attempt:", err);
      alert("There was an error saving your score. Please take a screenshot of your result and contact admin.");
    }
    setLoading(false);
  };

  const handleManualFallbackSubmit = () => {
    if (window.confirm("Only click this if you have completely finished the test. Proceed?")) {
      saveAttempt(null, null, null, true);
    }
  };

  // --- Render Helpers ---
  const filteredMaterials = selectedLevel === 'All' ? materials : materials.filter(m => m.level === selectedLevel);
  const uniqueLevels = ['All', ...new Set(materials.map(m => m.level))];

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      
      {/* STEP 1: Selection */}
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
                      selectedLevel === lvl ? 'bg-amber-500 text-slate-950 shadow-lg' : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white hover:border-slate-600'
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

      {/* STEP 2: Access Check (The Fork) */}
      {step === 2 && (
        <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
          <div className="text-center space-y-2">
             <button onClick={() => { setStep(1); setAccessType(''); }} className="text-xs text-slate-400 hover:text-amber-400 mb-4 inline-block">&larr; Back to tests</button>
             <h2 className="text-3xl font-extrabold text-white">Access Verification</h2>
             <p className="text-sm text-slate-400">Selected Test: <strong className="text-white">{selectedMaterial?.title}</strong></p>
          </div>

          {!accessType ? (
            <div className="grid sm:grid-cols-2 gap-6">
              <button onClick={() => setAccessType('existing')} className="p-8 bg-slate-900 border border-slate-800 rounded-2xl text-center hover:border-emerald-500 hover:bg-emerald-500/5 transition-all group">
                <div className="w-16 h-16 mx-auto bg-emerald-500/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Key className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">I have a Student Code</h3>
                <p className="text-xs text-slate-400">For existing students with an access code.</p>
              </button>

              <button onClick={() => setAccessType('new')} className="p-8 bg-slate-900 border border-slate-800 rounded-2xl text-center hover:border-amber-500 hover:bg-amber-500/5 transition-all group">
                <div className="w-16 h-16 mx-auto bg-amber-500/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <User className="w-8 h-8 text-amber-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">I am a New Student</h3>
                <p className="text-xs text-slate-400">Register to take this free practice test.</p>
              </button>
            </div>
          ) : (
            <div className="max-w-md mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl relative">
              <button onClick={() => setAccessType('')} className="absolute top-4 right-4 text-xs text-slate-500 hover:text-white">Change</button>
              
              {errorMsg && (
                <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-2 text-red-400 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>{errorMsg}</p>
                </div>
              )}

              {accessType === 'existing' ? (
                <form onSubmit={verifyAccessCode} className="space-y-4">
                  <h3 className="text-xl font-bold text-white mb-6">Enter Access Code</h3>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Your Code</label>
                    <input 
                      type="text" required placeholder="e.g. GLS-7X2K"
                      value={accessCode} onChange={e => setAccessCode(e.target.value.toUpperCase())}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white font-mono uppercase tracking-widest focus:outline-none focus:border-emerald-500 text-center text-lg"
                    />
                  </div>
                  <button disabled={loading} type="submit" className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg transition-colors flex items-center justify-center gap-2">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify & Start Test'}
                  </button>
                </form>
              ) : (
                <form onSubmit={startTestAsNewStudent} className="space-y-4">
                  <h3 className="text-xl font-bold text-white mb-6">Student Details</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">First Name *</label>
                      <input type="text" required value={studentInfo.first_name} onChange={e => setStudentInfo({...studentInfo, first_name: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">Last Name *</label>
                      <input type="text" required value={studentInfo.last_name} onChange={e => setStudentInfo({...studentInfo, last_name: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Phone (+92 format) *</label>
                    <input type="text" required placeholder="+923001234567" value={studentInfo.phone} onChange={e => setStudentInfo({...studentInfo, phone: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Email</label>
                    <input type="email" placeholder="student@email.com" value={studentInfo.email} onChange={e => setStudentInfo({...studentInfo, email: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none" />
                  </div>
                  <button disabled={loading} type="submit" className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg transition-colors flex items-center justify-center gap-2 mt-4">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Start Test Now'}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      )}

      {/* STEP 3: Test Runner (Iframe) */}
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
                Logged in as: <strong className="text-white">{studentInfo.first_name}</strong>
              </div>
              <button 
                onClick={handleManualFallbackSubmit}
                disabled={loading}
                className="px-4 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold rounded-lg border border-red-500/30 transition-colors flex items-center gap-2"
              >
                {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Finish & Submit'}
              </button>
            </div>
          </div>
          
          {/* Sandbox Iframe */}
          <div className="flex-1 bg-white relative">
            <iframe 
              src={selectedMaterial?.file_url}
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin allow-forms"
              title="Practice Test"
            />
          </div>
        </div>
      )}

      {/* STEP 4: Result Screen */}
      {step === 4 && testResult && (
        <div className="max-w-2xl mx-auto text-center space-y-8 animate-fade-in py-12">
          
          <div className="w-24 h-24 mx-auto bg-emerald-500/10 rounded-full flex items-center justify-center border-4 border-emerald-500/20">
            <CheckCircle className="w-12 h-12 text-emerald-400" />
          </div>

          <div className="space-y-4">
            <h2 className="text-4xl font-extrabold text-white">Test Completed!</h2>
            
            {testResult.isFallback ? (
              <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
                <p className="text-slate-300">Your test attempt has been successfully submitted.</p>
                <p className="text-sm text-slate-400 mt-2">Your score will be reviewed and updated by our team shortly.</p>
              </div>
            ) : (
              <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl space-y-2">
                <p className="text-sm text-slate-400 uppercase tracking-widest font-bold">Your Score</p>
                <div className="text-6xl font-extrabold text-amber-400 font-mono">
                  {testResult.score} <span className="text-2xl text-slate-500">/ {testResult.totalMarks}</span>
                </div>
                {testResult.totalMarks > 0 && (
                  <div className="text-lg text-white font-bold mt-4">
                    {Math.round((testResult.score / testResult.totalMarks) * 100)}% Accuracy
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
            <button 
              onClick={() => { setStep(1); setAccessType(''); setAccessCode(''); }}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition-colors"
            >
              Take Another Test
            </button>
            <Link 
              href="/"
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-colors"
            >
              Back to Homepage
            </Link>
          </div>
          
        </div>
      )}

    </div>
  );
}
