import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { BookOpen, PlayCircle, Loader2, CheckCircle, AlertCircle, ArrowLeft, RotateCcw, Type, List, CheckSquare, XCircle, Trophy } from 'lucide-react';

const UmlautKeyboard = ({ onInsert }) => {
  const characters = ['Ä', 'Ö', 'Ü', 'ß', 'ä', 'ö', 'ü'];
  return (
    <div className="flex gap-2 justify-center mt-3 flex-wrap">
      {characters.map(char => (
        <button
          key={char}
          type="button"
          onClick={() => onInsert(char)}
          className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 text-white font-bold hover:bg-slate-700 hover:border-slate-500 transition-colors shadow-sm active:scale-95"
        >
          {char}
        </button>
      ))}
    </div>
  );
};

export default function ChapterVocabEngine({ level, onBack }) {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Setup Mode State
  const [selectedChapterIds, setSelectedChapterIds] = useState(new Set());
  const [testMode, setTestMode] = useState('mcq'); // 'mcq' or 'typing'
  
  // Test Run State
  const [testStarted, setTestStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  // Interaction State
  const [userAnswer, setUserAnswer] = useState('');
  const [mcqOptions, setMcqOptions] = useState([]);
  const [feedback, setFeedback] = useState(null); // 'correct' or 'incorrect'
  
  useEffect(() => {
    fetchChapters();
  }, [level]);

  const fetchChapters = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('vocab_chapters')
      .select('id, chapter_number, word_count, json_data')
      .eq('level', level)
      .order('chapter_number', { ascending: true });
      
    if (!error && data) {
      setChapters(data);
    }
    setLoading(false);
  };

  const toggleChapter = (id) => {
    const newSet = new Set(selectedChapterIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedChapterIds(newSet);
  };

  const startTest = () => {
    if (selectedChapterIds.size === 0) return;
    
    // Combine all selected JSON arrays
    let combined = [];
    chapters.forEach(chap => {
      if (selectedChapterIds.has(chap.id)) {
        combined = combined.concat(chap.json_data || []);
      }
    });

    if (combined.length === 0) {
      alert("Selected chapters have no words!");
      return;
    }

    // Shuffle
    combined = combined.sort(() => Math.random() - 0.5);
    
    setQuestions(combined);
    setTestStarted(true);
    setCurrentQIndex(0);
    setScore(0);
    setFinished(false);
    setFeedback(null);
    setUserAnswer('');
    
    if (testMode === 'mcq') {
      generateMcqOptions(combined[0], combined);
    }
  };

  const generateMcqOptions = (currentQ, allQ) => {
    // Generate 3 random wrong options
    const options = [currentQ.german];
    let attempts = 0;
    while (options.length < 4 && attempts < 50) {
      const randQ = allQ[Math.floor(Math.random() * allQ.length)];
      if (!options.includes(randQ.german)) {
        options.push(randQ.german);
      }
      attempts++;
    }
    setMcqOptions(options.sort(() => Math.random() - 0.5));
  };

  const handleMcqSelect = (option) => {
    if (feedback) return; // Prevent double click
    
    const isCorrect = option === questions[currentQIndex].german;
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    if (isCorrect) setScore(s => s + 1);
    
    setTimeout(() => {
      nextQuestion();
    }, 1500);
  };

  const handleTypingSubmit = (e) => {
    e.preventDefault();
    if (feedback || !userAnswer.trim()) return;

    // Check with basic normalization (case insensitive, trim spaces)
    const normalizedUser = userAnswer.trim().toLowerCase();
    const normalizedCorrect = questions[currentQIndex].german.trim().toLowerCase();
    
    const isCorrect = normalizedUser === normalizedCorrect;
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    if (isCorrect) setScore(s => s + 1);

    setTimeout(() => {
      nextQuestion();
    }, 2000);
  };

  const nextQuestion = () => {
    if (currentQIndex + 1 >= questions.length) {
      setFinished(true);
    } else {
      const nextIdx = currentQIndex + 1;
      setCurrentQIndex(nextIdx);
      setFeedback(null);
      setUserAnswer('');
      if (testMode === 'mcq') {
        generateMcqOptions(questions[nextIdx], questions);
      }
    }
  };

  const handleInsertUmlaut = (char) => {
    setUserAnswer(prev => prev + char);
  };

  const resetEngine = () => {
    setTestStarted(false);
    setFinished(false);
    setSelectedChapterIds(new Set());
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <Loader2 className="w-10 h-10 text-amber-500 animate-spin mx-auto mb-4" />
        <p className="text-slate-400">Loading chapters for Level {level}...</p>
      </div>
    );
  }

  // --- SETUP VIEW ---
  if (!testStarted) {
    return (
      <div className="animate-fade-in max-w-4xl mx-auto space-y-8">
        <button onClick={onBack} className="text-sm text-slate-400 hover:text-white flex items-center gap-2 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="text-center space-y-3 mb-8">
          <h1 className="text-3xl font-extrabold text-white">
            Level <span className="text-amber-500">{level}</span> Chapter Vocabulary
          </h1>
          <p className="text-sm text-slate-400">Combine chapters and test your memory.</p>
        </div>

        {chapters.length === 0 ? (
          <div className="text-center py-12 bg-slate-900 border border-slate-800 rounded-2xl">
            <p className="text-slate-400">No vocabulary chapters available for this level yet.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left: Chapter Selection */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-500" /> Select Chapters
              </h2>
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {chapters.map(chap => {
                  const isSelected = selectedChapterIds.has(chap.id);
                  return (
                    <button
                      key={chap.id}
                      onClick={() => toggleChapter(chap.id)}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                        isSelected 
                          ? 'bg-amber-500/10 border-amber-500 text-amber-400' 
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded flex items-center justify-center border ${isSelected ? 'bg-amber-500 border-amber-500 text-slate-900' : 'border-slate-600'}`}>
                          {isSelected && <CheckCircle className="w-3.5 h-3.5" />}
                        </div>
                        <span className="font-bold">Chapter {chap.chapter_number}</span>
                      </div>
                      <span className="text-xs opacity-70">{chap.word_count} words</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right: Test Settings */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <SettingsIcon className="w-5 h-5 text-emerald-400" /> Test Mode
              </h2>
              
              <div className="space-y-4 mb-auto">
                <button
                  onClick={() => setTestMode('mcq')}
                  className={`w-full flex items-start gap-4 p-4 rounded-xl border transition-all text-left ${
                    testMode === 'mcq'
                      ? 'bg-emerald-500/10 border-emerald-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <List className={`w-6 h-6 mt-0.5 ${testMode === 'mcq' ? 'text-emerald-400' : 'text-slate-500'}`} />
                  <div>
                    <h3 className="font-bold">Multiple Choice</h3>
                    <p className="text-xs mt-1 opacity-80">Select the correct German translation from 4 options.</p>
                  </div>
                </button>

                <button
                  onClick={() => setTestMode('typing')}
                  className={`w-full flex items-start gap-4 p-4 rounded-xl border transition-all text-left ${
                    testMode === 'typing'
                      ? 'bg-emerald-500/10 border-emerald-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <Type className={`w-6 h-6 mt-0.5 ${testMode === 'typing' ? 'text-emerald-400' : 'text-slate-500'}`} />
                  <div>
                    <h3 className="font-bold">Typing Mode</h3>
                    <p className="text-xs mt-1 opacity-80">Type the exact German word. Includes special characters.</p>
                  </div>
                </button>
              </div>

              <button
                onClick={startTest}
                disabled={selectedChapterIds.size === 0}
                className="mt-8 w-full py-4 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-extrabold rounded-xl flex justify-center items-center gap-2 transition-all shadow-lg hover:shadow-amber-500/20"
              >
                <PlayCircle className="w-5 h-5" /> Start Test
              </button>
              {selectedChapterIds.size === 0 && (
                <p className="text-center text-xs text-slate-500 mt-3">Select at least one chapter to begin.</p>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- RESULT VIEW ---
  if (finished) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="animate-fade-in max-w-2xl mx-auto space-y-8 text-center py-12">
        <div className="w-24 h-24 mx-auto bg-amber-500/10 border-4 border-amber-500/20 rounded-full flex items-center justify-center">
          <Trophy className="w-12 h-12 text-amber-400" />
        </div>
        <h2 className="text-4xl font-extrabold text-white">Test Complete!</h2>
        
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl">
          <p className="text-sm text-slate-500 uppercase tracking-widest font-bold mb-2">Final Score</p>
          <div className="text-7xl font-mono font-extrabold text-amber-400 mb-6">
            {score} <span className="text-3xl text-slate-500">/ {questions.length}</span>
          </div>
          
          <div className="w-full bg-slate-800 rounded-full h-3 mb-2">
            <div
              className={`h-3 rounded-full transition-all duration-1000 ${percentage >= 80 ? 'bg-emerald-500' : percentage >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <p className="text-slate-400 text-sm">{percentage}% Accuracy</p>
        </div>

        <div className="flex justify-center gap-4">
          <button onClick={resetEngine} className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl flex items-center gap-2 transition">
            <RotateCcw className="w-4 h-4" /> Try Again
          </button>
          <button onClick={onBack} className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition">
            Exit to Menu
          </button>
        </div>
      </div>
    );
  }

  // --- TEST RUNNER VIEW ---
  const currentQ = questions[currentQIndex];
  
  return (
    <div className="animate-fade-in max-w-3xl mx-auto flex flex-col min-h-[60vh]">
      <div className="flex items-center justify-between mb-8">
        <button onClick={resetEngine} className="text-xs text-slate-400 hover:text-white px-3 py-1.5 bg-slate-900 rounded-lg border border-slate-800">
          Quit
        </button>
        <div className="text-sm font-bold text-slate-300">
          Question {currentQIndex + 1} of {questions.length}
        </div>
        <div className="text-xs font-mono bg-amber-500/10 text-amber-400 px-3 py-1.5 rounded-lg border border-amber-500/20">
          Score: {score}
        </div>
      </div>

      <div className="w-full bg-slate-900 rounded-full h-1.5 mb-12 overflow-hidden">
        <div 
          className="bg-amber-500 h-full transition-all duration-300"
          style={{ width: `${((currentQIndex) / questions.length) * 100}%` }}
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-wide">
            {currentQ.english}
          </h2>
          {currentQ.article && (
            <p className="mt-4 text-slate-400 text-sm">Hint: Article is <span className="text-emerald-400 font-bold font-mono">{currentQ.article}</span></p>
          )}
        </div>

        {/* MCQ Mode */}
        {testMode === 'mcq' && (
          <div className="w-full grid sm:grid-cols-2 gap-4 max-w-2xl">
            {mcqOptions.map((opt, idx) => {
              let btnClass = "bg-slate-900 border-slate-800 text-white hover:border-amber-500 hover:bg-slate-800";
              if (feedback) {
                if (opt === currentQ.german) btnClass = "bg-emerald-500/20 border-emerald-500 text-emerald-400";
                else if (opt === userAnswer) btnClass = "bg-red-500/20 border-red-500 text-red-400";
                else btnClass = "bg-slate-900 border-slate-800 text-slate-600 opacity-50";
              }
              
              return (
                <button
                  key={idx}
                  onClick={() => { setUserAnswer(opt); handleMcqSelect(opt); }}
                  disabled={feedback !== null}
                  className={`p-6 rounded-2xl border-2 text-lg font-bold transition-all text-center shadow-lg ${btnClass}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        )}

        {/* Typing Mode */}
        {testMode === 'typing' && (
          <div className="w-full max-w-xl mx-auto space-y-6">
            <form onSubmit={handleTypingSubmit} className="relative">
              <input
                type="text"
                autoFocus
                disabled={feedback !== null}
                value={userAnswer}
                onChange={e => setUserAnswer(e.target.value)}
                placeholder="Type in German..."
                className={`w-full bg-slate-900 border-2 rounded-2xl px-6 py-5 text-center text-2xl font-bold text-white focus:outline-none shadow-xl transition-colors ${
                  feedback === 'correct' ? 'border-emerald-500 text-emerald-400' :
                  feedback === 'incorrect' ? 'border-red-500 text-red-400' :
                  'border-slate-800 focus:border-amber-500'
                }`}
              />
              <button 
                type="submit"
                disabled={feedback !== null || !userAnswer.trim()}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-amber-500 text-slate-950 rounded-xl hover:bg-amber-400 disabled:opacity-0 transition-opacity"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            </form>
            
            {/* Built-in Umlaut Keyboard */}
            <UmlautKeyboard onInsert={handleInsertUmlaut} />
          </div>
        )}

        {/* Feedback Area */}
        <div className="h-24 mt-8 flex items-center justify-center">
          {feedback === 'correct' && (
            <div className="flex items-center gap-3 text-emerald-400 animate-bounce">
              <CheckSquare className="w-8 h-8" />
              <span className="text-xl font-bold">Richtig!</span>
            </div>
          )}
          {feedback === 'incorrect' && (
            <div className="flex flex-col items-center gap-2 text-red-400 animate-pulse">
              <div className="flex items-center gap-3">
                <XCircle className="w-8 h-8" />
                <span className="text-xl font-bold">Falsch!</span>
              </div>
              <div className="text-slate-300 text-sm">
                Correct answer: <strong className="text-emerald-400">{currentQ.german}</strong>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Simple internal icon for Settings since we didn't import it at the top level
const SettingsIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
);
