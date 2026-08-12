import React, { useState } from 'react';
import { Volume2, ArrowLeft } from 'lucide-react';

export default function AlphabetNumbersEngine({ onBack }) {
  const [playing, setPlaying] = useState(null);

  const alphabet = [
    { letter: 'A', pron: 'Ah' },
    { letter: 'B', pron: 'Beh' },
    { letter: 'C', pron: 'Tseh' },
    { letter: 'D', pron: 'Deh' },
    { letter: 'E', pron: 'Eh' },
    { letter: 'F', pron: 'Ef' },
    { letter: 'G', pron: 'Geh' },
    { letter: 'H', pron: 'Hah' },
    { letter: 'I', pron: 'Ih' },
    { letter: 'J', pron: 'Yot' },
    { letter: 'K', pron: 'Kah' },
    { letter: 'L', pron: 'El' },
    { letter: 'M', pron: 'Em' },
    { letter: 'N', pron: 'En' },
    { letter: 'O', pron: 'Oh' },
    { letter: 'P', pron: 'Peh' },
    { letter: 'Q', pron: 'Kuh' },
    { letter: 'R', pron: 'Er' },
    { letter: 'S', pron: 'Es' },
    { letter: 'T', pron: 'Teh' },
    { letter: 'U', pron: 'Uh' },
    { letter: 'V', pron: 'Fau' },
    { letter: 'W', pron: 'Veh' },
    { letter: 'X', pron: 'Iks' },
    { letter: 'Y', pron: 'Ypsilon' },
    { letter: 'Z', pron: 'Tset' },
    { letter: 'Ä', pron: 'Ah-Umlaut' },
    { letter: 'Ö', pron: 'Oh-Umlaut' },
    { letter: 'Ü', pron: 'Uh-Umlaut' },
    { letter: 'ß', pron: 'Eszett' }
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

  const soundRules = [
    { combo: "sch", description: "Pronounced like English 'sh'", example_word: "Schule", example_meaning: "school" },
    { combo: "ch (after a, o, u, au)", description: "Guttural 'kh' sound from the throat (Ach-Laut)", example_word: "Buch", example_meaning: "book" },
    { combo: "ch (after e, i, ä, ö, ü)", description: "Softer 'kh/sh' sound (Ich-Laut)", example_word: "ich", example_meaning: "I" },
    { combo: "ig (at end of word)", description: "Pronounced like 'ikh'", example_word: "wichtig", example_meaning: "important" },
    { combo: "sp (at start of word)", description: "Pronounced like 'shp'", example_word: "Sport", example_meaning: "sport" },
    { combo: "st (at start of word)", description: "Pronounced like 'sht'", example_word: "Stadt", example_meaning: "city" },
    { combo: "ie", description: "Long 'ee' sound", example_word: "Sie", example_meaning: "you (formal)" },
    { combo: "ei", description: "Pronounced like 'eye' / 'ai'", example_word: "mein", example_meaning: "my" },
    { combo: "eu / äu", description: "Pronounced like 'oy'", example_word: "neu", example_meaning: "new" },
    { combo: "au", description: "Pronounced like 'ow'", example_word: "Haus", example_meaning: "house" },
    { combo: "z", description: "Pronounced like 'ts'", example_word: "Zug", example_meaning: "train" },
    { combo: "v", description: "Usually pronounced like 'f'", example_word: "Vater", example_meaning: "father" },
    { combo: "w", "description": "Pronounced like 'v'", example_word: "Wasser", example_meaning: "water" },
    { combo: "qu", "description": "Pronounced like 'kv'", example_word: "Quelle", example_meaning: "source" },
    { combo: "pf", description: "Both sounds blended together", example_word: "Pferd", example_meaning: "horse" },
    { combo: "tion (at end of word)", description: "Pronounced like 'tsyohn', not English 'shun'", example_word: "Information", example_meaning: "information" },
    { combo: "s + vowel (at start of word)", description: "Pronounced like 'z' (soft, like English 'zoo')", example_word: "sagen", example_meaning: "to say" }
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
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {alphabet.map((item) => {
            const id = `alpha_${item.letter}`;
            const isPlaying = playing === id;
            return (
              <button
                key={item.letter}
                onClick={() => playAudio(item.letter, id)}
                className={`relative group p-4 flex flex-col items-center justify-center rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isPlaying 
                    ? 'bg-amber-500 border-amber-400 scale-105 shadow-[0_0_20px_rgba(245,158,11,0.3)]' 
                    : 'bg-slate-950 border-slate-800 hover:border-amber-500/50 hover:bg-slate-800'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-amber-500/0 group-hover:from-amber-500/5 group-hover:to-transparent transition-colors"></div>
                
                <span className={`text-3xl sm:text-4xl font-extrabold mb-1 z-10 transition-colors duration-300 ${isPlaying ? 'text-slate-950' : 'text-white group-hover:text-amber-400'}`}>
                  {item.letter}
                </span>
                <span className={`text-sm font-medium z-10 transition-colors duration-300 ${isPlaying ? 'text-amber-950/70' : 'text-slate-500 group-hover:text-amber-200'}`}>
                  {item.pron}
                </span>
                
                <div className={`absolute top-2 right-2 transition-opacity duration-300 ${isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                  <Volume2 className={`w-3.5 h-3.5 ${isPlaying ? 'text-amber-950' : 'text-slate-500'}`} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sound Combinations Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-6 font-serif border-b border-slate-800 pb-4">
          Sound Combinations
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {soundRules.map((rule, index) => {
            const id = `rule_${index}`;
            const isPlaying = playing === id;
            return (
              <div
                key={index}
                className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-2xl font-extrabold text-white mb-2 font-serif text-amber-500">
                    {rule.combo}
                  </h3>
                  <p className="text-sm text-slate-400 mb-4 h-10">
                    {rule.description}
                  </p>
                </div>
                
                <button
                  onClick={() => playAudio(rule.example_word, id)}
                  className={`relative group w-full p-3 flex justify-between items-center rounded-xl border transition-all duration-300 overflow-hidden ${
                    isPlaying 
                      ? 'bg-amber-500 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]' 
                      : 'bg-slate-900 border-slate-700 hover:border-amber-500/50 hover:bg-slate-800'
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-amber-500/0 group-hover:from-amber-500/5 group-hover:to-transparent transition-colors"></div>
                  
                  <div className="text-left z-10">
                    <span className={`block font-bold transition-colors duration-300 ${isPlaying ? 'text-slate-950' : 'text-white group-hover:text-amber-400'}`}>
                      {rule.example_word}
                    </span>
                    <span className={`block text-xs font-medium transition-colors duration-300 ${isPlaying ? 'text-amber-950/70' : 'text-slate-500 group-hover:text-amber-200'}`}>
                      {rule.example_meaning}
                    </span>
                  </div>
                  
                  <div className={`z-10 transition-opacity duration-300 ${isPlaying ? 'opacity-100' : 'opacity-50 group-hover:opacity-100'}`}>
                    <Volume2 className={`w-5 h-5 ${isPlaying ? 'text-amber-950' : 'text-slate-400 group-hover:text-amber-400'}`} />
                  </div>
                </button>
              </div>
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
