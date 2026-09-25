import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ShieldCheck, Mail, BookOpen, Award, Star, Calendar, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

// Sample profiles from supabase/seed_data.sql (fictional names, invented
// credentials, Unsplash stock photos). They are still present in the live
// `teachers` table, so they are filtered out here and never shown as real
// staff. Delete them in Admin -> Teachers; this list can then be removed.
const SAMPLE_TEACHER_NAMES = new Set([
  'Prof. Dr. Michael Weber',
  'Miss Fatima Noor',
  'Sir Ahmed Shah',
]);
const withoutSampleProfiles = (list) =>
  (list || []).filter((t) => !SAMPLE_TEACHER_NAMES.has((t?.name || '').trim()));

export default function Teachers({ currentLang, onOpenTrialModal, initialTeachers = null }) {
  const [teachers, setTeachers] = useState(withoutSampleProfiles(initialTeachers));
  const [loading, setLoading] = useState(initialTeachers === null);

  useEffect(() => {
    if (initialTeachers !== null) return;
    const fetchTeachers = async () => {
      const { data } = await supabase.from('teachers').select('*').order('created_at', { ascending: false });
      if (data) setTeachers(withoutSampleProfiles(data));
      setLoading(false);
    };
    fetchTeachers();
  }, [initialTeachers]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/30">
          Meet Our Teaching Team
        </span>
        <h1 className="text-4xl font-extrabold text-white">German Language Instructors</h1>
        <p className="text-sm text-slate-300">
          Learn with instructors supporting our A1–B2 German courses and exam preparation. Instructor profiles are currently being updated.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {loading ? (
          <div className="col-span-full text-center text-slate-400 py-12 flex flex-col items-center">
            <Loader2 className="w-8 h-8 text-amber-500 animate-spin mb-4" />
            Loading teachers...
          </div>
        ) : teachers.length === 0 ? (
          <div className="col-span-full text-center py-12 text-slate-400">Contact us on WhatsApp to ask who teaches your batch.</div>
        ) : teachers.map((teacher) => (
          <div 
            key={teacher.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-amber-500/40 transition duration-300 flex flex-col md:flex-row gap-6 items-start"
          >
            <Image
              src={teacher.image}
              alt={teacher.name}
              width={176}
              height={192}
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
