import React, { useState, useEffect } from 'react';
import { ShieldCheck, Mail, BookOpen, Award, Star, Calendar, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function Teachers({ currentLang, onOpenTrialModal }) {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeachers = async () => {
      const { data } = await supabase.from('teachers').select('*').order('created_at', { ascending: false });
      if (data) setTeachers(data);
      setLoading(false);
    };
    fetchTeachers();
  }, []);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/30">
          Native German Faculty & Certified Examiners
        </span>
        <h1 className="text-4xl font-extrabold text-white">Our Certified Instructors</h1>
        <p className="text-sm text-slate-300">
          Learn from experienced academics, Goethe-Zertifikat evaluators, and native DaF experts committed to your fluency.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {loading ? (
          <div className="col-span-full text-center text-slate-400 py-12 flex flex-col items-center">
            <Loader2 className="w-8 h-8 text-amber-500 animate-spin mb-4" />
            Loading teachers...
          </div>
        ) : teachers.map((teacher) => (
          <div 
            key={teacher.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-amber-500/40 transition duration-300 flex flex-col md:flex-row gap-6 items-start"
          >
            <img
              src={teacher.image}
              alt={teacher.name}
              className="w-full md:w-44 h-48 rounded-xl object-cover border border-slate-700 shrink-0"
            />
            
            <div className="space-y-3 flex-1">
              <div>
                <span className="px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[11px] font-bold border border-amber-500/20">
                  {teacher.specialty}
                </span>
                <h3 className="text-xl font-bold text-white mt-1">{teacher.name}</h3>
                <div className="text-xs text-amber-400 font-semibold">{teacher.role}</div>
              </div>

              <div className="text-xs text-slate-300 font-medium space-y-1">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Award className="w-3.5 h-3.5 text-red-500" />
                  <span>{teacher.qualification}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{teacher.experience}</span>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">{teacher.bio}</p>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Teaches: <span className="text-white font-semibold">
                    {teacher.courses_assigned ? teacher.courses_assigned.join(', ') : 'All Levels'}
                  </span>
                </span>
                <button
                  onClick={onOpenTrialModal}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 transition"
                >
                  Book Demo
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
