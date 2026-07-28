import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

export default function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("AOA German Language School! I want to inquire about online course fees and enrollment.");

  const handleSendWhatsApp = () => {
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/923421189593?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {isOpen ? (
        <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-4 shadow-2xl w-80 mb-3 animate-fade-in relative">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950 font-bold">
                <MessageCircle className="w-5 h-5 fill-current text-white" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">German Language School</h4>
                <span className="flex items-center text-[10px] text-emerald-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 animate-pulse"></span>
                  Admissions Officer Online
                </span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs text-slate-300 mb-3 leading-relaxed">
            💬 AOA! Need fast help with Goethe/TestDaF exam dates, PKT course schedules, or enrollment details? Chat with us on WhatsApp!
          </div>

          <div className="space-y-2">
            <textarea
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
            <button
              onClick={handleSendWhatsApp}
              className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs flex items-center justify-center gap-2 transition shadow-lg"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Chat on WhatsApp (0342 1189593)</span>
            </button>
          </div>
        </div>
      ) : null}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-transform duration-300 relative group"
        title="Chat on WhatsApp (0342 1189593)"
      >
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
        </span>
        <MessageCircle className="w-7 h-7 fill-current" />
      </button>
    </div>
  );
}
