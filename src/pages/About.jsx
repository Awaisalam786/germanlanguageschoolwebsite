import React from 'react';
import { ShieldCheck, Award, GraduationCap, Users, CheckCircle, Globe2, BookOpen } from 'lucide-react';

export default function About({ currentLang, setActiveTab }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/30">
          Established in Berlin, Germany
        </span>
        <h1 className="text-4xl font-extrabold text-white">About German Language School</h1>
        <p className="text-sm text-slate-300 leading-relaxed">
          Pioneering communicative German language instruction for over 15 years. Dedicated to empowering global talent to succeed in higher education, healthcare careers, and integration in Germany.
        </p>
      </div>

      {/* Mission & Vision Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/30">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">Our Mission</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            To provide high-yield, Goethe-Institut aligned German language instruction with small class sizes, native faculty, and real-world cultural immersion. We bridge the gap between classroom learning and successful academic/career integration.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center border border-red-500/30">
            <Globe2 className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">Our Global Impact</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            With students originating from over 45 countries, German Language School serves as a global launchpad for engineers, doctors, nurses, researchers, and university candidates aiming for a bright future in Germany.
          </p>
        </div>
      </div>

      {/* Key Milestones Counter */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-8 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
        <div>
          <div className="text-3xl font-extrabold text-white">15+</div>
          <div className="text-xs text-amber-400 font-semibold mt-1">Years of Academic Excellence</div>
        </div>
        <div>
          <div className="text-3xl font-extrabold text-amber-400">12,500+</div>
          <div className="text-xs text-slate-400 font-semibold mt-1">Certified Graduates</div>
        </div>
        <div>
          <div className="text-3xl font-extrabold text-white">98.4%</div>
          <div className="text-xs text-amber-400 font-semibold mt-1">Goethe & Telc Pass Rate</div>
        </div>
        <div>
          <div className="text-3xl font-extrabold text-red-500">25+</div>
          <div className="text-xs text-slate-400 font-semibold mt-1">Native Instructors</div>
        </div>
      </div>

      {/* Quality Guarantees */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-white text-center">Academic Accreditations & Standards</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Goethe-Institut Compliant',
              desc: 'Curriculum designed according to CEFR guidelines ensuring total alignment with official Goethe-Zertifikat examinations.'
            },
            {
              title: 'Telc Certified Partner',
              desc: 'Specialized preparation tracks for Telc B1, B2, C1 Hochschule, and Telc B2-C1 Medizin exams.'
            },
            {
              title: 'BAMF Approved Framework',
              desc: 'Integration course standards following the recommendations of the German Federal Office for Migration.'
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-2">
              <CheckCircle className="w-5 h-5 text-amber-400" />
              <h4 className="text-base font-bold text-white">{item.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
