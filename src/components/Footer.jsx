import React from 'react';
import { Mail, Phone, Globe, CheckCircle2, ArrowRight, ShieldCheck, Video } from 'lucide-react';
import Link from 'next/link';
import { translations } from '../i18n/translations';
import { useGlobalContent } from '../context/GlobalContentContext';

export default function Footer({ currentLang, setActiveTab }) {
  const t = translations[currentLang];
  const { settings } = useGlobalContent();
  const formattedPhone = settings?.whatsapp_number?.replace(/^0/, '92') || '923421189593';

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 pt-16 pb-8 relative overflow-hidden">
      {/* Background Accent Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-3 cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-950 p-[1px] shadow-lg flex items-center justify-center shrink-0 border border-amber-500/20 overflow-hidden">
                {settings?.logo_url ? (
                  <img src={settings.logo_url} alt="Logo" className="w-full h-full object-cover scale-[1.2]" />
                ) : (
                  <span className="text-xl">🇩🇪</span>
                )}
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white font-sans flex items-center flex-wrap gap-1 leading-none">
                German <span className="gold-gradient-text">Language School</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pakistan’s premier 100% online German language academy. Live interactive Zoom classes, recorded lecture archives, and Goethe exam preparation for students across Pakistan.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>100% Online • Learn from Anywhere in Pakistan</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-amber-500 pl-2">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              {['home', 'courses', 'howItWorks', 'teachers', 'gallery', 'blog', 'payments', 'faq', 'contact'].map((page) => (
                <li key={page}>
                  <Link href={page === "home" ? "/" : "/" + page}
                    className="hover:text-amber-400 transition-colors capitalize flex items-center gap-1.5"
                  >
                    <ArrowRight className="w-3 h-3 text-slate-600" />
                    <span>{t.nav[page] || page}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: German Level Shortcuts */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-red-500 pl-2">
              Online CEFR Batches
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center justify-between bg-slate-900/60 p-2 rounded border border-slate-800">
                <span className="font-semibold text-white">A1 & A2 Beginner</span>
                <span className="text-amber-400 text-[10px]">₨35,000 / €120</span>
              </li>
              <li className="flex items-center justify-between bg-slate-900/60 p-2 rounded border border-slate-800">
                <span className="font-semibold text-white">B1 & B2 Intermediate</span>
                <span className="text-amber-400 text-[10px]">₨48,000 / €160</span>
              </li>
              <li className="flex items-center justify-between bg-slate-900/60 p-2 rounded border border-slate-800">
                <span className="font-semibold text-white">Goethe & telc Exam Prep</span>
                <span className="text-amber-400 text-[10px]">100% Online</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Newsletter */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-amber-500 pl-2">
              Admissions Support
            </h4>
            <ul className="space-y-3 text-xs mb-4">
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{settings?.whatsapp_number || '+92 342 1189593'} (WhatsApp & Call)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{settings?.support_email || 'germanlanguageschool1@gmail.com'}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Video className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Live Interactive Zoom Platform</span>
              </li>
            </ul>

            {/* Newsletter input */}
            <div className="mt-2">
              <label className="text-[11px] font-medium text-slate-300 block mb-1.5">Get Free German Visa & Exam Updates</label>
              <div className="flex gap-1">
                <input
                  type="email"
                  placeholder="Enter email..."
                  className="bg-slate-900 border border-slate-700 rounded-l px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500 w-full"
                />
                <button className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-3 py-1.5 rounded-r font-bold text-xs transition">
                  Join
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Disclaimer & Copyright */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p className="text-center md:text-left">© {new Date().getFullYear()} German Language School. All rights reserved. 100% Online Institute.</p>
          <div className="flex items-center space-x-4">
            <button onClick={() => window.open(`https://wa.me/${formattedPhone}?text=Hi,%20I%20would%20like%20to%20enroll.%20Please%20share%20the%20payment%20details.`, '_blank')} className="hover:text-slate-300">WhatsApp Payment Guide</button>
          </div>
        </div>

      </div>
    </footer>
  );
}
