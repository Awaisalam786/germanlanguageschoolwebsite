import React from 'react';
import { Video, Smartphone, Wifi, PlayCircle, HelpCircle, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

export default function HowOnlineWorks({ setActiveTab, onOpenTrialModal }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/30">
          Seamless Distance Learning Across Pakistan
        </span>
        <h1 className="text-4xl font-extrabold text-white">How 100% Online Classes Work</h1>
        <p className="text-sm text-slate-300">
          Learn German effectively from your home in Karachi, Lahore, Islamabad, Rawalpindi, Peshawar, Quetta, or anywhere in Pakistan.
        </p>
      </div>

      {/* 4 Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            step: '01',
            icon: Video,
            title: 'Live Interactive Zoom Classes',
            desc: 'Join live HD sessions with native German & certified Pakistani teachers. Speak, practice dialogues, and ask questions in real-time.'
          },
          {
            step: '02',
            icon: PlayCircle,
            title: 'HD Recorded Lecture Vault',
            desc: 'Missed a class due to electricity load shedding or internet glitch? Every lecture is recorded and uploaded within 2 hours.'
          },
          {
            step: '03',
            icon: Smartphone,
            title: 'Instructor WhatsApp Groups',
            desc: 'Get 24/7 access to dedicated batch WhatsApp groups for daily vocabulary drills, homework reviews, and direct teacher guidance.'
          },
          {
            step: '04',
            icon: ShieldCheck,
            title: 'Goethe Exam Mock Drills',
            desc: 'Rigorous Goethe-Zertifikat A1-C1 mock exams under realistic time limits with individual examiner feedback.'
          }
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.step} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative hover:border-amber-500/40 transition space-y-4 shadow-xl">
              <span className="text-4xl font-extrabold text-slate-800 absolute top-4 right-4 font-mono">{item.step}</span>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/30">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">{item.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          );
        })}
      </div>

      {/* System & Tech Requirements Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6">
        <h2 className="text-2xl font-bold text-white text-center">Simple Tech Requirements</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-2">
            <Smartphone className="w-6 h-6 text-amber-400" />
            <h4 className="text-base font-bold text-white">Device Choice</h4>
            <p className="text-xs text-slate-400">
              Any Android/iPhone smartphone, iPad/Tablet, or Windows/Mac Laptop.
            </p>
          </div>

          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-2">
            <Wifi className="w-6 h-6 text-emerald-400" />
            <h4 className="text-base font-bold text-white">Internet Speed</h4>
            <p className="text-xs text-slate-400">
              Standard 3G/4G mobile data or broadband Wi-Fi connection (1-2 Mbps is sufficient).
            </p>
          </div>

          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-2">
            <Video className="w-6 h-6 text-blue-400" />
            <h4 className="text-base font-bold text-white">Software App</h4>
            <p className="text-xs text-slate-400">
              Free Zoom Cloud Meetings app downloaded on your device.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="bg-gradient-to-r from-amber-600 to-red-600 rounded-3xl p-8 text-slate-950 text-center space-y-4 shadow-2xl">
        <h3 className="text-2xl font-extrabold">Experience a Live Online Demo Class First</h3>
        <p className="text-xs font-medium">Book a 30-minute free trial session to see our interactive Zoom setup live!</p>
        <button
          onClick={onOpenTrialModal}
          className="px-8 py-3 bg-slate-950 text-amber-400 font-extrabold rounded-xl text-xs shadow-2xl hover:scale-105 transition"
        >
          Book Free Live Zoom Demo
        </button>
      </div>

    </div>
  );
}
