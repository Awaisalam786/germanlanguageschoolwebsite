import React, { useState } from 'react';
import { X, Calendar, Clock, Sparkles, CheckCircle } from 'lucide-react';
import { translations } from '../i18n/translations';

export default function TrialClassModal({ isOpen, onClose, currentLang }) {
  const t = translations[currentLang];
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    targetLevel: 'A1 - Beginner',
    preferredSlot: 'Evening (18:00 - 19:30 CEST)'
  });
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-amber-500/30 rounded-2xl max-w-md w-full p-6 shadow-2xl relative overflow-hidden">
        
        {/* Top Flag Stripe */}
        <div className="absolute top-0 left-0 right-0 h-1.5 german-flag-strip"></div>

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/60"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-white">Trial Class Booked!</h3>
            <p className="text-sm text-slate-300">
              We have emailed the Zoom trial invitation and placement test link to <span className="text-amber-400 font-semibold">{formData.email}</span>.
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>100% Free • No Credit Card Required</span>
            </div>

            <h3 className="text-xl font-extrabold text-white mb-1">Book a Free Live Trial Class</h3>
            <p className="text-xs text-slate-400 mb-6">
              Experience our interactive communicative methodology with native certified instructors.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">First Name</label>
                  <input
                    type="text" required placeholder="e.g. Alexander"
                    value={formData.first_name} onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Last Name</label>
                  <input
                    type="text" required placeholder="e.g. Schmidt"
                    value={formData.last_name} onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="alex@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">WhatsApp / Phone</label>
                  <input
                    type="tel" required placeholder="+92 300 0000000"
                    value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Select German Level</label>
                <select
                  value={formData.targetLevel}
                  onChange={(e) => setFormData({ ...formData, targetLevel: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="A1 - Beginner">A1 - Complete Beginner</option>
                  <option value="A2 - Elementary">A2 - Elementary German</option>
                  <option value="B1 - Intermediate">B1 - Intermediate (Job/Visa)</option>
                  <option value="B2 - Upper Intermediate">B2 - Upper Intermediate (University)</option>
                  <option value="B2 - Upper Intermediate">B2 - Upper Intermediate & Exam Prep</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Preferred Time Slot</label>
                <select
                  value={formData.preferredSlot}
                  onChange={(e) => setFormData({ ...formData, preferredSlot: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Morning (10:00 - 11:30 CEST)">Morning Batch (10:00 - 11:30 CEST)</option>
                  <option value="Afternoon (14:00 - 15:30 CEST)">Afternoon Batch (14:00 - 15:30 CEST)</option>
                  <option value="Evening (18:00 - 19:30 CEST)">Evening Batch (18:00 - 19:30 CEST)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-lg text-sm shadow-gold-glow transition hover:scale-[1.02]"
              >
                Reserve Free Trial Seat Now
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
