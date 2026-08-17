import React, { useState, useEffect } from 'react';
import { Award, ChevronLeft, ChevronRight, ShieldCheck, Lock, Loader2 } from 'lucide-react';
import ProtectedImage from './ProtectedImage';
import { supabase } from '../lib/supabaseClient';
import { useGlobalContent } from '../context/GlobalContentContext';

export default function CertificateShowcase() {
  const { settings } = useGlobalContent();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchCertificates = async () => {
      const { data } = await supabase.from('certificates').select('*').eq('verified', true).order('issue_date', { ascending: false });
      if (data) {
        const mapped = data.map(c => ({
          studentName: c.student_name,
          congratsTitle: c.congrats_title,
          examBody: c.exam_body,
          city: c.city,
          score: c.score,
          date: c.issue_date,
          quote: c.quote,
          imageUrl: c.image_url,
        }));
        setCertificates(mapped);
      }
      setLoading(false);
    };
    fetchCertificates();
  }, []);

  if (loading) {
    return (
      <section className="bg-slate-900/80 border-y border-slate-800 py-16 flex justify-center items-center">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </section>
    );
  }

  if (!certificates || certificates.length === 0) return null;

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? certificates.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === certificates.length - 1 ? 0 : prev + 1));
  };

  const cert = certificates[currentIndex];
  const congratsHeading = cert.congratsTitle || `Congratulations to ${cert.studentName}!`;

  return (
    <section className="bg-slate-900/80 border-y border-slate-800 py-16 relative overflow-hidden">
      
      {/* Background Lighting Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-amber-500/5 blur-[100px] pointer-events-none rounded-full"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/30">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% Verified Certificates • Protected Original Documents</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Real Student Certificate Showcase
          </h2>
          <p className="text-sm text-slate-300">
            Official Goethe-Zertifikat, telc, and ÖSD certificates achieved by our Pakistani online students.
          </p>
        </div>

        {/* Certificate Card Carousel */}
        <div className="max-w-4xl mx-auto bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
          
          <div className="grid grid-cols-12 gap-3 sm:gap-8 items-center">
            
            {/* Left Image View */}
            <div className="col-span-6 md:col-span-7 relative rounded-xl sm:rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center p-1 sm:p-2 group shadow-inner">
              <ProtectedImage
                src={cert.imageUrl}
                alt={congratsHeading}
                watermarkText={settings?.whatsapp_number || "03421189593"}
                objectFit="contain"
                className="w-full h-full rounded-lg sm:rounded-xl"
              />
              
              {/* Watermark Protection Badge */}
              <div className="absolute bottom-1 sm:bottom-3 left-1 sm:left-3 bg-slate-900/90 backdrop-blur-md px-1.5 sm:px-3 py-0.5 sm:py-1.5 rounded-md sm:rounded-lg border border-slate-800 text-[6px] sm:text-[10px] text-slate-300 flex items-center gap-1 pointer-events-none">
                <Lock className="w-2 h-2 sm:w-3 sm:h-3 text-emerald-400" />
                <span>Protected</span>
              </div>
            </div>

            {/* Right Card Details */}
            <div className="col-span-6 md:col-span-5 space-y-2 sm:space-y-4">
              
              {cert.examBody && (
                <div className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3.5 py-0.5 sm:py-1.5 rounded-lg sm:rounded-xl bg-amber-500/10 text-amber-400 text-[8px] sm:text-xs font-extrabold border border-amber-500/30">
                  <Award className="w-2.5 h-2.5 sm:w-4 sm:h-4 text-amber-400" />
                  <span>{cert.examBody}</span>
                </div>
              )}

              <h3 className="text-sm sm:text-2xl font-extrabold text-white leading-tight">
                {congratsHeading}
              </h3>

              {/* Detail Rows (Render only if present) */}
              <div className="bg-slate-900 p-2 sm:p-4 rounded-lg sm:rounded-xl border border-slate-800 space-y-1 sm:space-y-2 text-[8px] sm:text-xs">
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Name:</span>
                  <span className="text-white font-bold">{cert.studentName}</span>
                </div>

                {cert.city && (
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400">Location:</span>
                    <span className="text-amber-400 font-semibold">{cert.city}</span>
                  </div>
                )}

                {cert.score && (
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400">Score:</span>
                    <span className="text-emerald-400 font-extrabold">{cert.score}</span>
                  </div>
                )}

                {cert.date && (
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400">Issued:</span>
                    <span className="text-slate-300">
                      {new Date(cert.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) !== 'Invalid Date' 
                        ? new Date(cert.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) 
                        : cert.date}
                    </span>
                  </div>
                )}
              </div>

              {cert.quote && (
                <p className="text-[8px] sm:text-xs text-slate-300 italic border-l sm:border-l-2 border-amber-500 pl-1.5 sm:pl-3 leading-snug sm:leading-relaxed">
                  "{cert.quote}"
                </p>
              )}

            </div>

          </div>

          {/* Carousel Prev/Next Navigation Controls */}
          <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-800/80">
            <div className="text-xs text-slate-400 font-bold">
              Showing Certificate <span className="text-amber-400">{currentIndex + 1}</span> of {certificates.length}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={prevSlide}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-amber-500/50 transition"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextSlide}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-amber-500/50 transition"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
