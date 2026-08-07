import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  MessageCircle,
  Sparkles,
  Send,
  Clock,
  ChevronDown,
  Star
} from 'lucide-react';
import { translations } from '../i18n/translations';
import { supabase } from '../lib/supabaseClient';
import { useGlobalContent } from '../context/GlobalContentContext';

export default function Enroll({ currentLang, setActiveTab, selectedCourse }) {
  const { settings } = useGlobalContent();
  const formattedPhone = settings?.whatsapp_number?.replace(/^0/, '92') || '923421189593';
  const t = translations[currentLang];
  const [courses, setCourses] = useState([]);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    cnic: '',
    courseLevel: selectedCourse || 'German A1 — Beginner Online Foundation',
    preferredBatch: 'Evening (18:00 - 20:30 PKT)'
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      const { data } = await supabase.from('courses').select('*').order('created_at', { ascending: true });
      if (data) setCourses(data);
    };
    fetchCourses();
  }, []);

  const handleOpenWhatsApp = (levelName = formData.courseLevel) => {
    const msg = encodeURIComponent(`Hi, I want to enroll in ${levelName}. My name is ${formData.fullName || 'Student'}. Please share payment details.`);
    window.open(`https://wa.me/${formattedPhone}?text=${msg}`, '_blank');
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
              {settings?.payment_instructions || 'Click the button below to open WhatsApp and receive your payment details and seat confirmation.'}
            </p>
          </div>

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
            className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl shadow-lg flex items-center justify-center gap-2 transition active:scale-95"
          >
            <Send className="w-5 h-5" />
            <span>Complete Enrollment on WhatsApp ({settings?.whatsapp_number})</span>
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
                {courses.length === 0 ? (
                  <option value="">Loading courses...</option>
                ) : (
                  courses.map((c) => (
                    <option key={c.id} value={c.title}>
                      {c.title} ({c.price})
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 ml-1 block">Preferred Batch Timing</label>
              <div className="relative">
                <Clock className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
                <select
                  required
                  value={formData.preferredBatch}
                  onChange={(e) => setFormData({...formData, preferredBatch: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-12 pr-4 py-3.5 text-sm text-white focus:outline-none focus:border-amber-500 appearance-none transition shadow-inner"
                >
                  <option>Morning (10:00 - 12:30 PKT)</option>
                  <option>Evening (18:00 - 20:30 PKT)</option>
                  <option>Weekend (Sat/Sun Morning)</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-4 pointer-events-none" />
              </div>
            </div>
          </div>

          {settings?.discount_code && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-center mt-4">
              <p className="text-xs text-amber-400 font-bold flex items-center justify-center gap-2">
                <Star className="w-4 h-4 fill-current" />
                Use Code: <span className="text-white text-sm bg-slate-950 px-2 py-1 rounded">{settings.discount_code}</span> on WhatsApp to claim your discount!
              </p>
            </div>
          )}

          <div className="pt-4 border-t border-slate-800">
            <button
              type="submit"
              className="w-full mt-6 py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-lg shadow-gold-glow flex items-center justify-center gap-2 transition active:scale-95"
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
