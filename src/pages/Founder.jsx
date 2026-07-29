import React from 'react';
import { Award, GraduationCap, ShieldCheck, MessageCircle, CheckCircle, UserCheck } from 'lucide-react';
import { founderData } from '../mockData/seedData';

export default function Founder({ setActiveTab }) {
  const handleWhatsApp = () => {
    const msg = encodeURIComponent("AOA! I want to consult with Founder & Head Mentor regarding German university/visa guidance.");
    window.open(`https://wa.me/923421189593?text=${msg}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/30">
          Founder & Academic Mentor
        </span>
        <h1 className="text-4xl font-extrabold text-white">Meet Our Founder & Head Mentor</h1>
        <p className="text-sm text-slate-300">
          Personal mentorship and academic leadership dedicated to empowering Pakistani students to succeed in Germany.
        </p>
      </div>

      {/* Founder Spotlight Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* Founder Image */}
          <div className="md:col-span-5 relative rounded-2xl overflow-hidden border border-slate-700">
            <img
              src={founderData.image}
              alt={founderData.name}
              className="w-full h-[400px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
            
            <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur border border-amber-500/30 p-3 rounded-xl">
              <span className="text-amber-400 font-bold text-xs block">{founderData.name}</span>
              <span className="text-[11px] text-slate-400 block">{founderData.credentials}</span>
            </div>
          </div>

          {/* Founder Message & Bio */}
          <div className="md:col-span-7 space-y-6">
            
            <div>
              <span className="px-3 py-1 rounded-md bg-amber-500/10 text-amber-400 text-xs font-extrabold border border-amber-500/30">
                {founderData.experience}
              </span>
              <h2 className="text-3xl font-extrabold text-white mt-2">{founderData.name}</h2>
              <div className="text-xs font-bold text-amber-400">{founderData.title}</div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {founderData.bio}
            </p>

            {/* Quote Box */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block">Founder's Message to Students:</span>
              <p className="text-xs text-slate-300 italic leading-relaxed">
                "{founderData.message}"
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={handleWhatsApp}
                className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow flex items-center gap-2 transition"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Consult Founder on WhatsApp (03421189593)</span>
              </button>

              <button
                onClick={() => setActiveTab('courses')}
                className="px-6 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold text-xs hover:border-amber-500/50 transition"
              >
                Explore Online Courses
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
