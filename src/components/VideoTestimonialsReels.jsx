import React, { useState } from 'react';
import { Play, X, Video, Award } from 'lucide-react';
import { videoReelsData } from '../mockData/seedData';

export default function VideoTestimonialsReels() {
  const [activeReel, setActiveReel] = useState(null);

  return (
    <div className="space-y-6">
      
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-bold border border-red-500/30">
          Student Video Stories
        </span>
        <h3 className="text-2xl font-extrabold text-white">Watch Real Student Journeys</h3>
        <p className="text-xs text-slate-400">Short video reels from Pakistani students who passed Goethe/TestDaF and moved to Germany.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {videoReelsData.map((reel) => (
          <div
            key={reel.id}
            onClick={() => setActiveReel(reel)}
            className="group bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden cursor-pointer hover:border-amber-500/50 transition duration-300 relative shadow-xl"
          >
            <div className="h-72 overflow-hidden relative">
              <img
                src={reel.thumbnail}
                alt={reel.studentName}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
              
              {/* Play Button Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-amber-500/90 text-slate-950 flex items-center justify-center shadow-gold-glow group-hover:scale-110 transition duration-300">
                  <Play className="w-6 h-6 fill-current ml-0.5" />
                </div>
              </div>
            </div>

            <div className="p-4 space-y-1.5 bg-slate-950">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">{reel.city}</span>
              <h4 className="text-sm font-bold text-white leading-tight">{reel.studentName}</h4>
              <p className="text-[11px] text-slate-400 line-clamp-2">{reel.outcome}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Video Lightbox Modal */}
      {activeReel && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/40 rounded-3xl max-w-2xl w-full p-6 relative overflow-hidden shadow-2xl space-y-4">
            
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">{activeReel.studentName}</h3>
                <span className="text-xs text-amber-400">{activeReel.city}</span>
              </div>
              <button onClick={() => setActiveReel(null)} className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="h-80 rounded-2xl overflow-hidden border border-slate-800 relative bg-slate-950 flex items-center justify-center">
              <img src={activeReel.thumbnail} alt={activeReel.studentName} className="w-full h-full object-cover opacity-60" />
              <div className="absolute inset-0 flex items-center justify-center text-center p-6 bg-slate-950/70">
                <div className="space-y-2">
                  <Video className="w-12 h-12 text-amber-400 mx-auto animate-pulse" />
                  <h4 className="text-sm font-bold text-white">{activeReel.outcome}</h4>
                  <p className="text-xs text-slate-300">Live Video Playback Simulated. Verified Video Testimonial.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
