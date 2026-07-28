import React, { useState } from 'react';
import { CreditCard, Smartphone, Building2, CheckCircle2, Copy, ShieldCheck } from 'lucide-react';
import { paymentAccountDetails } from '../mockData/seedData';

export default function Payments({ setActiveTab }) {
  const [copiedKey, setCopiedKey] = useState(null);

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/30">
          Official Payment Gateways in Pakistan
        </span>
        <h1 className="text-4xl font-extrabold text-white">Payment Methods & Fee Guide</h1>
        <p className="text-sm text-slate-300">
          Pay your course tuition fee easily in PKR via JazzCash, EasyPaisa, Bank Transfer (HBL / Meezan), or Credit/Debit Card.
        </p>
      </div>

      {/* Grid of Payment Channels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* 1. JazzCash Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 hover:border-amber-500/40 transition shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-red-600/20 text-red-500 flex items-center justify-center font-bold text-xl border border-red-500/30">
                📱
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">JazzCash Mobile Account</h3>
                <span className="text-xs text-amber-400 font-semibold">Instant Mobile Transfer</span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded bg-slate-950 text-slate-300 text-[10px] font-bold">PKR Only</span>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between items-center text-slate-300">
              <span>Account Number:</span>
              <span className="font-mono text-amber-400 font-bold text-sm flex items-center gap-2">
                {paymentAccountDetails.jazzcash.accountNumber}
                <button 
                  onClick={() => copyToClipboard(paymentAccountDetails.jazzcash.accountNumber, 'jc-num')}
                  className="text-slate-400 hover:text-white p-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Account Title:</span>
              <span className="text-white font-semibold">{paymentAccountDetails.jazzcash.accountTitle}</span>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            {paymentAccountDetails.jazzcash.instructions}
          </p>
        </div>

        {/* 2. EasyPaisa Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 hover:border-amber-500/40 transition shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold text-xl border border-emerald-500/30">
                💸
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">EasyPaisa Account</h3>
                <span className="text-xs text-emerald-400 font-semibold">Instant Mobile Transfer</span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded bg-slate-950 text-slate-300 text-[10px] font-bold">PKR Only</span>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between items-center text-slate-300">
              <span>Account Number:</span>
              <span className="font-mono text-emerald-400 font-bold text-sm flex items-center gap-2">
                {paymentAccountDetails.easypaisa.accountNumber}
                <button 
                  onClick={() => copyToClipboard(paymentAccountDetails.easypaisa.accountNumber, 'ep-num')}
                  className="text-slate-400 hover:text-white p-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Account Title:</span>
              <span className="text-white font-semibold">{paymentAccountDetails.easypaisa.accountTitle}</span>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            {paymentAccountDetails.easypaisa.instructions}
          </p>
        </div>

        {/* 3. Bank Transfer (HBL & Meezan) */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 hover:border-amber-500/40 transition shadow-xl md:col-span-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-xl border border-blue-500/30">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Direct Bank Wire Transfer (HBL & Meezan IBFT)</h3>
              <span className="text-xs text-blue-400 font-semibold">Online Banking & 1Link ATM Transfer</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* HBL */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <div className="font-bold text-white text-sm border-b border-slate-800 pb-1">Habib Bank Limited (HBL)</div>
              <div className="flex justify-between text-slate-300">
                <span>Account Number:</span>
                <span className="font-mono text-amber-400 font-bold">{paymentAccountDetails.bankHBL.accountNumber}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>IBAN:</span>
                <span className="font-mono text-white text-[11px] font-semibold">{paymentAccountDetails.bankHBL.iban}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Title:</span>
                <span className="text-slate-300 font-semibold">{paymentAccountDetails.bankHBL.accountTitle}</span>
              </div>
            </div>

            {/* Meezan Bank */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <div className="font-bold text-white text-sm border-b border-slate-800 pb-1">Meezan Bank (Islamic Banking)</div>
              <div className="flex justify-between text-slate-300">
                <span>Account Number:</span>
                <span className="font-mono text-emerald-400 font-bold">{paymentAccountDetails.bankMeezan.accountNumber}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>IBAN:</span>
                <span className="font-mono text-white text-[11px] font-semibold">{paymentAccountDetails.bankMeezan.iban}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Title:</span>
                <span className="text-slate-300 font-semibold">{paymentAccountDetails.bankMeezan.accountTitle}</span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* CTA Box */}
      <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-8 text-center max-w-3xl mx-auto space-y-4">
        <h3 className="text-2xl font-bold text-white">Ready to Confirm Your Registration?</h3>
        <p className="text-xs text-slate-400">
          Upload your payment receipt screenshot in our online enrollment form for instant seat verification.
        </p>
        <button
          onClick={() => setActiveTab('enroll')}
          className="px-8 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-gold-glow transition hover:scale-105"
        >
          Proceed to Registration Form
        </button>
      </div>

    </div>
  );
}
