import React, { useState } from 'react';
import { ShieldCheck, Key, Lock, ArrowRight, CheckCircle2, UserCheck } from 'lucide-react';

export default function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState('germanlanguageschool1@gmail.com');
  const [password, setPassword] = useState('••••••••••••');
  const [selectedRole, setSelectedRole] = useState('Super Admin');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [step2FA, setStep2FA] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInitialSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (twoFactorEnabled) {
        setStep2FA(true);
      } else {
        onLogin({ email, role: selectedRole, twoFactorEnabled: false });
      }
    }, 800);
  };

  const handleVerify2FA = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin({ email, role: selectedRole, twoFactorEnabled: true });
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl relative z-10 overflow-hidden space-y-6">
        
        <div className="h-1.5 german-flag-strip absolute top-0 left-0 right-0"></div>

        <div className="text-center space-y-2 pt-2">
          <div className="w-14 h-14 bg-slate-950 border border-amber-500/40 rounded-2xl flex items-center justify-center mx-auto shadow-gold-glow">
            <ShieldCheck className="w-8 h-8 text-amber-400" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">German Language School Admin Portal</h2>
          <p className="text-xs text-slate-400">Secure JWT Authentication & Role-Based Access</p>
        </div>

        {!step2FA ? (
          <form onSubmit={handleInitialSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Admin Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Demo Role Selection</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-amber-400 font-bold focus:outline-none focus:border-amber-500"
              >
                <option value="Super Admin">Super Admin (Full Read/Write Access)</option>
                <option value="Editor">Editor (CMS & Inquiries Access)</option>
                <option value="Viewer">Viewer (Read-Only Analytics)</option>
              </select>
            </div>

            {/* 2FA Toggle switch */}
            <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Simulate 2FA Security Check</span>
              </span>
              <input
                type="checkbox"
                checked={twoFactorEnabled}
                onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-gold-glow transition flex items-center justify-center gap-2"
            >
              {loading ? 'Authenticating JWT Token...' : (
                <>
                  <span>Sign In to Admin Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* 2FA Step */
          <form onSubmit={handleVerify2FA} className="space-y-4 animate-fade-in">
            <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl text-center space-y-1">
              <Key className="w-6 h-6 text-amber-400 mx-auto" />
              <h4 className="text-xs font-bold text-white">Two-Factor Authentication</h4>
              <p className="text-[10px] text-slate-400">Enter 6-digit code sent to Google Authenticator / SMS</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 text-center">2FA Security Code</label>
              <input
                type="text"
                required
                maxLength={6}
                placeholder="123456"
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-center text-lg tracking-widest font-mono text-amber-400 focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-gold-glow transition flex items-center justify-center gap-2"
            >
              {loading ? 'Verifying 2FA Security Token...' : 'Verify & Enter Dashboard'}
            </button>

            <button
              type="button"
              onClick={() => setStep2FA(false)}
              className="w-full text-center text-xs text-slate-400 hover:text-white"
            >
              Back to Password
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
