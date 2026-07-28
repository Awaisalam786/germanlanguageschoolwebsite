import React, { useState } from 'react';
import { 
  CheckCircle2, 
  MessageCircle,
  Sparkles
} from 'lucide-react';
import { translations } from '../i18n/translations';
import { initialCourses } from '../mockData/seedData';

export default function Enroll({ currentLang, setActiveTab }) {
  const t = translations[currentLang];
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    cnic: '',
    courseLevel: 'German A1 — Beginner Online Foundation',
    preferredBatch: 'Evening (18:00 - 20:30 PKT)'
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleOpenWhatsApp = (levelName = formData.courseLevel) => {
    const msg = encodeURIComponent(`Hi, I want to enroll in ${levelName}. My name is ${formData.fullName || 'Student'}. Please share payment details.`);
    window.open(`https://wa.me/923421189593?text=${msg}`, '_blank');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      <div className="text-center space-y-2">
        <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/30">
          Official Online Student Registration
        </span>
        <h1 className="text-3xl font-extrabold text-white">{t.enroll.title}</h1>
        <p className="text-xs text-slate-300">{t.enroll.subtitle}</p>
      </div>

      {isSubmitted ? (
        <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-8 text-center space-y-6 animate-fade-in shadow-2xl">
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/50">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-white">Registration Info Recorded!</h3>
            <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
              Click the button below to open WhatsApp (0342 1189593) and receive your payment details and seat confirmation.
            </p>
          </div>

          {/* Registration Details Summary */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 max-w-md mx-auto text-left text-xs space-y-2.5">
            <div className="flex justify-between text-slate-400">
              <span>Student Name:</span>
              <span className="text-white font-bold">{formData.fullName}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Course Level:</span>
              <span className="text-amber-400 font-bold">{formData.courseLevel}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Batch Timing:</span>
              <span className="text-white font-bold">{formData.preferredBatch}</span>
            </div>
          </div>

          <button
            onClick={() => handleOpenWhatsApp()}
            className="w-full max-w-md py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm rounded-2xl shadow-xl flex items-center justify-center gap-2 transition hover:scale-105"
          >
            <MessageCircle className="w-5 h-5 fill-current" />
            <span>Complete Enrollment on WhatsApp (0342 1189593)</span>
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-5">
          
          <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Student Registration Details</span>
          </h3>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">{t.enroll.fullName} *</label>
            <input
              type="text"
              required
              placeholder="e.g. Muhammad Usman Chaudhry"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">{t.enroll.email} *</label>
              <input
                type="email"
                required
                placeholder="usman@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">{t.enroll.phone} *</label>
              <input
                type="tel"
                required
                placeholder="+92 300 1234567"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">{t.enroll.selectedCourse}</label>
              <select
                value={formData.courseLevel}
                onChange={(e) => setFormData({ ...formData, courseLevel: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                {initialCourses.map((c) => (
                  <option key={c.id} value={c.title}>
                    {c.title} ({c.fees})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Preferred PKT Time Batch</label>
              <select
                value={formData.preferredBatch}
                onChange={(e) => setFormData({ ...formData, preferredBatch: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="Evening (18:00 - 20:30 PKT)">Evening Batch (18:00 - 20:30 PKT)</option>
                <option value="Night (21:00 - 23:30 PKT)">Night Batch (21:00 - 23:30 PKT)</option>
                <option value="Weekend Special (Sat & Sun)">Weekend Special Batch</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs shadow-gold-glow transition flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Submit Registration & Complete on WhatsApp</span>
            </button>
          </div>

        </form>
      )}

    </div>
  );
}
