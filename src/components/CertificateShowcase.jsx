import React, { useState } from 'react';
import { Award, ChevronLeft, ChevronRight, ShieldCheck, Lock } from 'lucide-react';
import { initialCertificates } from '../mockData/seedData';
import ProtectedImage from './ProtectedImage';

export default function CertificateShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!initialCertificates || initialCertificates.length === 0) return null;

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? initialCertificates.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === initialCertificates.length - 1 ? 0 : prev + 1));
  };

  const cert = initialCertificates[currentIndex];
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
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Left Image View: Aspect 4/3 Landscape Frame with object-contain */}
            <div className="md:col-span-7 relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 aspect-[4/3] flex items-center justify-center p-2 group shadow-inner">
              <ProtectedImage
                src={cert.imageUrl}
                alt={congratsHeading}
                watermarkText="0342 1189593"
                objectFit="contain"
                className="w-full h-full rounded-xl"
              />
              
              {/* Watermark Protection Badge */}
              <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-[10px] text-slate-300 flex items-center gap-1.5 pointer-events-none">
                <Lock className="w-3 h-3 text-emerald-400" />
                <span>Watermarked: 0342 1189593</span>
              </div>
            </div>

            {/* Right Card Details */}
            <div className="md:col-span-5 space-y-4">
              
              {cert.examBody && (
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500/10 text-amber-400 text-xs font-extrabold border border-amber-500/30">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>{cert.examBody}</span>
                </div>
              )}

              <h3 className="text-2xl font-extrabold text-white leading-tight">
                {congratsHeading}
              </h3>

              {/* Detail Rows (Render only if present) */}
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Student Name:</span>
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
                    <span className="text-slate-400">Score Achieved:</span>
                    <span className="text-emerald-400 font-extrabold">{cert.score}</span>
                  </div>
                )}

                {cert.date && (
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400">Issue Date:</span>
                    <span className="text-slate-300">{cert.date}</span>
                  </div>
                )}
              </div>

              {cert.quote && (
                <p className="text-xs text-slate-300 italic border-l-2 border-amber-500 pl-3 leading-relaxed">
                  "{cert.quote}"
                </p>
              )}

            </div>

          </div>

          {/* Carousel Prev/Next Navigation Controls */}
          <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-800/80">
            <div className="text-xs text-slate-400 font-bold">
              Showing Certificate <span className="text-amber-400">{currentIndex + 1}</span> of {initialCertificates.length}
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
