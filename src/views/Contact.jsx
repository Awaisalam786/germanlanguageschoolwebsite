import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, CheckCircle, Clock, Video } from 'lucide-react';
import { translations } from '../i18n/translations';
import { useGlobalContent } from '../context/GlobalContentContext';

export default function Contact({ currentLang }) {
  const t = translations[currentLang];
  const { settings } = useGlobalContent();
  const whatsappNumber = settings?.whatsapp_number || '03421189593';
  const supportEmail = settings?.support_email || 'germanlanguageschool1@gmail.com';
  const formattedPhone = whatsappNumber.replace(/^0/, '92');
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    courseInterest: 'B1 Intermediate',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ first_name: '', last_name: '', email: '', phone: '', courseInterest: 'B1 Intermediate', message: '' });
    }, 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/30">
          Get in Touch With Admissions
        </span>
        <h1 className="text-4xl font-extrabold text-white">Contact German Learning School</h1>
        <p className="text-sm text-slate-300">
          Have questions about course fees, Goethe exam registrations, or visa advice? Speak to our counselor.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Contact Form */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
          <h3 className="text-xl font-bold text-white mb-2">Send Us a Direct Message</h3>
          <p className="text-xs text-slate-400 mb-6">Our admissions team responds within 2 business hours.</p>

          {submitted ? (
            <div className="p-6 bg-emerald-500/10 border border-emerald-500/40 rounded-xl text-center space-y-3">
              <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
              <h4 className="text-lg font-bold text-white">Vielen Dank! Message Sent.</h4>
              <p className="text-xs text-slate-300">We have received your inquiry and will contact you via email/WhatsApp shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">First Name *</label>
                  <input
                    type="text" required placeholder="e.g. Johann"
                    value={formData.first_name} onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Last Name *</label>
                  <input
                    type="text" required placeholder="e.g. Schmidt"
                    value={formData.last_name} onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 mt-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="johann@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Phone / WhatsApp</label>
                  <input
                    type="tel"
                    required
                    placeholder="+92 300 0000000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Course Interest</label>
                  <select
                    value={formData.courseInterest}
                    onChange={(e) => setFormData({ ...formData, courseInterest: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="A1 Beginner">A1 Beginner</option>
                    <option value="A2 Elementary">A2 Elementary</option>
                    <option value="B1 Intermediate">B1 Intermediate</option>
                    <option value="B2 Upper Intermediate">B2 Upper Intermediate</option>
                    <option value="B2 Upper Intermediate">B2 Upper Intermediate & Approbation</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Your Message *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="How can we assist you with your German learning goals?"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs shadow-gold-glow transition flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </div>

        {/* Admissions & Contact Info */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h4 className="text-base font-bold text-white border-l-2 border-amber-500 pl-2">Online German Language Academy</h4>
            
            <ul className="space-y-3.5 text-xs text-slate-300">
              <li className="flex items-start gap-3">
                <Video className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Live classes conducted 100% online via Zoom & Google Meet</span>
              </li>
              <li className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4 text-amber-400 shrink-0" />
                <span>WhatsApp: <a href={`https://wa.me/${formattedPhone}`} target="_blank" rel="noopener noreferrer" className="text-amber-400 font-bold hover:underline">{whatsappNumber}</a></span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Email: <a href={`mailto:${supportEmail}`} className="text-amber-400 hover:underline">{supportEmail}</a></span>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Student Support: Mon - Sat (09:00 - 21:00 PKT)</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3 text-xs text-slate-400">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Serving Students Across Pakistan</span>
            </div>
            <p className="leading-relaxed text-slate-300">
              Students can contact our admissions & support team directly on WhatsApp and email for batch timings, Goethe & telc exam preparation guidance, and fee details.
            </p>
            <div className="pt-2">
              <a
                href={`https://wa.me/${formattedPhone}?text=${encodeURIComponent("Hi, I would like to inquire about German language courses.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5 fill-current" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
