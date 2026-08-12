import React, { useState } from 'react';
import { Volume2, ArrowLeft } from 'lucide-react';

export default function AlphabetNumbersEngine({ onBack }) {
  const [playing, setPlaying] = useState(null);

  const alphabet = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 
    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 
    'Ä', 'Ö', 'Ü', 'ß'
  ];

  const numbers = [
    { num: 1, word: 'eins' },
    { num: 2, word: 'zwei' },
    { num: 3, word: 'drei' },
    { num: 4, word: 'vier' },
    { num: 5, word: 'fünf' },
    { num: 6, word: 'sechs' },
    { num: 7, word: 'sieben' },
    { num: 8, word: 'acht' },
    { num: 9, word: 'neun' },
    { num: 10, word: 'zehn' },
    { num: 11, word: 'elf' },
    { num: 12, word: 'zwölf' },
    { num: 13, word: 'dreizehn' },
    { num: 14, word: 'vierzehn' },
    { num: 15, word: 'fünfzehn' },
    { num: 16, word: 'sechzehn' },
    { num: 17, word: 'siebzehn' },
    { num: 18, word: 'achtzehn' },
    { num: 19, word: 'neunzehn' },
    { num: 20, word: 'zwanzig' }
  ];

  const playAudio = (text, id) => {
    if (!('speechSynthesis' in window)) return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    setPlaying(id);
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'de-DE';
    utterance.rate = 0.9; // Slightly slower for clearer pronunciation
    
    utterance.onend = () => {
      setPlaying(null);
    };
    
    utterance.onerror = () => {
      setPlaying(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>
        
        <div className="relative z-10">
          <button 
            onClick={onBack} 
            className="text-sm text-slate-400 hover:text-white flex items-center gap-2 transition-colors mb-3"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Categories
          </button>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-serif">
            Alphabet & <span className="text-amber-500">Numbers</span>
          </h1>
          <p className="text-slate-400 mt-2">Tap any card to hear the German pronunciation.</p>
        </div>
      </div>

      {/* Alphabet Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-6 font-serif border-b border-slate-800 pb-4">
          Das Alphabet
        </h2>
        
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
          {alphabet.map((letter) => {
            const id = `alpha_${letter}`;
            const isPlaying = playing === id;
            return (
              <button
                key={letter}
                onClick={() => playAudio(letter, id)}
                className={`relative group aspect-square flex flex-col items-center justify-center rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isPlaying 
                    ? 'bg-amber-500 border-amber-400 scale-105 shadow-[0_0_20px_rgba(245,158,11,0.3)]' 
                    : 'bg-slate-950 border-slate-800 hover:border-amber-500/50 hover:bg-slate-800'
                }`}
              >
                {/* Glow effect behind text on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-amber-500/0 group-hover:from-amber-500/5 group-hover:to-transparent transition-colors"></div>
                
                <span className={`text-3xl sm:text-4xl font-bold z-10 transition-colors duration-300 ${isPlaying ? 'text-slate-950' : 'text-white group-hover:text-amber-400'}`}>
                  {letter}
                </span>
                
                <Volume2 className={`w-4 h-4 mt-2 z-10 transition-colors duration-300 ${isPlaying ? 'text-slate-950 opacity-100' : 'text-slate-500 opacity-0 group-hover:opacity-100'}`} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Numbers Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-6 font-serif border-b border-slate-800 pb-4">
          Zahlen (Numbers 1-20)
        </h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {numbers.map((item) => {
            const id = `num_${item.num}`;
            const isPlaying = playing === id;
            return (
              <button
                key={item.num}
                onClick={() => playAudio(item.word, id)}
                className={`relative group p-4 flex flex-col items-center justify-center rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isPlaying 
                    ? 'bg-blue-500 border-blue-400 scale-105 shadow-[0_0_20px_rgba(59,130,246,0.3)]' 
                    : 'bg-slate-950 border-slate-800 hover:border-blue-500/50 hover:bg-slate-800'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:to-transparent transition-colors"></div>
                
                <span className={`text-2xl font-extrabold mb-1 z-10 transition-colors duration-300 ${isPlaying ? 'text-white' : 'text-slate-300 group-hover:text-blue-400'}`}>
                  {item.num}
                </span>
                <span className={`text-sm font-medium z-10 transition-colors duration-300 ${isPlaying ? 'text-blue-100' : 'text-slate-500 group-hover:text-slate-300'}`}>
                  {item.word}
                </span>
                
                <div className={`absolute top-2 right-2 transition-opacity duration-300 ${isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                  <Volume2 className={`w-3.5 h-3.5 ${isPlaying ? 'text-blue-200' : 'text-slate-500'}`} />
                </div>
              </button>
            );
          })}
        </div>
      </div>
      
      <div className="h-12"></div> {/* Bottom padding */}
    </div>
  );
}
