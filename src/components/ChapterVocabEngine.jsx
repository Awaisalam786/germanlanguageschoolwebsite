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

export default function ChapterVocabEngine({ 
  level, 
  onBack, 
  userType, 
  storedFreeUser, 
  studentName, 
  verifiedCode 
}) {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Setup Mode State
  const [selectionMode, setSelectionMode] = useState('quick'); // 'quick' or 'custom'
  const [customSelectedChapterIds, setCustomSelectedChapterIds] = useState([]);
  const [selectedChapterCount, setSelectedChapterCount] = useState(1);
  const [sessionTime, setSessionTime] = useState(10); // 10, 20, 30 minutes
  
  // Test Run State
  const [testStarted, setTestStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [saving, setSaving] = useState(false);
  const [wordResults, setWordResults] = useState([]);
  const [timeLeft, setTimeLeft] = useState(null); // seconds remaining

  // Interaction State
  const [userAnswer, setUserAnswer] = useState('');
  const [mcqOptions, setMcqOptions] = useState([]);
  const [feedback, setFeedback] = useState(null); // 'correct' or 'incorrect'
  
  useEffect(() => {
    fetchChapters();
  }, [level]);

  const fetchChapters = async () => {
    setLoading(true);
    console.log(`[ChapterVocabEngine] Fetching chapters for level: "${level}"`);

    const { data, error } = await supabase
      .from('vocab_chapters')
      .select('id, chapter_number, word_count, json_data')
      .eq('level', level)
      .order('chapter_number', { ascending: true });
      
    console.log(`[ChapterVocabEngine] Query returned:`, { data, error });

    if (error) {
      console.error(`[ChapterVocabEngine] Error fetching chapters:`, error);
    }
      
    if (!error && data) {
      setChapters(data);
      if (data.length > 0) setSelectedChapterCount(1);
    }
    setLoading(false);
  };
  
  // Timer Countdown Effect
  useEffect(() => {
    if (testStarted && !finished && timeLeft !== null && timeLeft > 0) {
      const timerId = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timerId);
    } else if (timeLeft === 0 && !finished && !saving) {
      // Time's up! Auto-submit
      submitAttempt();
      setFinished(true);
    }
  }, [testStarted, finished, timeLeft, saving]);


  const startTest = () => {
    // Get active chapters based on mode
    const activeChapters = selectionMode === 'quick'
      ? chapters.slice(0, selectedChapterCount)
      : chapters.filter(chap => customSelectedChapterIds.includes(chap.id));
      
    if (activeChapters.length === 0 || chapters.length === 0) return;
    
    // Combine all selected JSON arrays
    let combined = [];
    activeChapters.forEach(chap => {
      combined = combined.concat(chap.json_data || []);
    });

    if (combined.length === 0) {
      alert("Selected chapters have no words!");
      return;
    }

    // Determine target question count based on session time (avg 20s per question)
    const targetQCount = sessionTime === 10 ? 30 : sessionTime === 20 ? 60 : 90;

    // Distribute randomly across the 3 formats (mcq, type_de, type_en)
    const formats = ['mcq', 'type_de', 'type_en'];
    let fIdx = 0;
    combined = combined.map(word => {
      const assignedFormat = formats[fIdx % 3];
      fIdx++;
      return { ...word, testFormat: assignedFormat };
    });

    // Shuffle again to randomize the format sequence
    combined = combined.sort(() => Math.random() - 0.5);
    
    // Trim to the target count
    combined = combined.slice(0, targetQCount);
    
    setQuestions(combined);
    setTestStarted(true);
    setCurrentQIndex(0);
    setScore(0);
    setFinished(false);
    setFeedback(null);
    setUserAnswer('');
    setWordResults([]);
    setTimeLeft(sessionTime * 60); // Set timer in seconds
    
    if (combined[0].testFormat === 'mcq') {
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
    
    // Save word result
    const currentWord = questions[currentQIndex];
    setWordResults(prev => [...prev, {
      german: currentWord.german,
      english: currentWord.english,
      userAnswer: option,
      isCorrect
    }]);

    setTimeout(() => {
      nextQuestion();
    }, 1500);
  };

  const handleTypingSubmit = (e) => {
    e.preventDefault();
    if (feedback || !userAnswer.trim()) return;

    // Helper to normalize strings: lowercases, trims space, removes trailing punctuation (.,;!?)
    const normalizeAnswer = (str) => {
      return str.trim().toLowerCase().replace(/[.,;!?]+$/, '');
    };

    const normalizedUser = normalizeAnswer(userAnswer);
    
    // For type_en, the correct answer is the english field, for type_de it's the german field
    const correctStr = questions[currentQIndex].testFormat === 'type_en' 
      ? questions[currentQIndex].english 
      : questions[currentQIndex].german;
      
    const normalizedCorrect = normalizeAnswer(correctStr);
    
    const isCorrect = normalizedUser === normalizedCorrect;
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    if (isCorrect) setScore(s => s + 1);

    // Save word result
    const currentWord = questions[currentQIndex];
    setWordResults(prev => [...prev, {
      german: currentWord.german,
      english: currentWord.english,
      userAnswer: userAnswer.trim(),
      isCorrect
    }]);

    setTimeout(() => {
      nextQuestion();
    }, 2000);
  };

  const nextQuestion = async () => {
    if (currentQIndex + 1 >= questions.length) {
      await submitAttempt();
      setFinished(true);
    } else {
      const nextIdx = currentQIndex + 1;
      setCurrentQIndex(nextIdx);
      setFeedback(null);
      setUserAnswer('');
      if (questions[nextIdx].testFormat === 'mcq') {
        generateMcqOptions(questions[nextIdx], questions);
      }
    }
  };

  const submitAttempt = async () => {
    setSaving(true);
    try {
      // Need to capture the very last result from state, but state updates might be async.
      // We will compute final score locally if needed, but wordResults might be 1 element behind.
      // Wait, since we update wordResults before setTimeout, it should be fully updated when nextQuestion runs.
      
      const totalQuestions = questions.length;
      // Re-calculate based on actual array to avoid stale state in async flow just in case
      let finalCorrect = 0;
      let finalWrong = 0;
      // We must grab from the latest state, but nextQuestion is inside a closure.
      // Let's rely on functional updates or just use the current score state + the last question (handled by wordResults).
      
      // Let's let React finish state updates
      const currentWordResults = wordResults.length === questions.length ? wordResults : [
        ...wordResults
      ]; // Just in case, it should be fully populated because nextQuestion runs 1.5s later.

      const finalCorrectCount = currentWordResults.filter(w => w.isCorrect).length;
      const finalPercentage = Math.round((finalCorrectCount / totalQuestions) * 100);

      const payload = {
        user_type: userType || 'free',
        name: userType === 'student' ? studentName : storedFreeUser?.name,
        email: userType === 'free' ? storedFreeUser?.email : null,
        phone: userType === 'free' ? storedFreeUser?.phone : null,
        access_code_used: userType === 'student' ? verifiedCode : null,
        level: level,
        chapters_selected: selectionMode === 'quick' 
          ? chapters.slice(0, selectedChapterCount).map(c => c.id)
          : customSelectedChapterIds,
        test_mode: 'mixed',
        total_questions: totalQuestions,
        correct_count: finalCorrectCount,
        wrong_count: totalQuestions - finalCorrectCount,
        percentage: finalPercentage,
        word_results: currentWordResults
      };

      await fetch('/api/save-vocab-attempt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (e) {
      console.error("Failed to save attempt", e);
    }
    setSaving(false);
  };

  const handleInsertUmlaut = (char) => {
    setUserAnswer(prev => prev + char);
  };

  const resetEngine = () => {
    setTestStarted(false);
    setFinished(false);
    setTimeLeft(null);
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
            {/* Left: Chapter Selection Counter/Custom */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col items-center text-center">
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-500" /> Select Chapters
              </h2>
              
              {/* Toggle Switch */}
              <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 mb-8 w-full max-w-sm">
                <button
                  onClick={() => setSelectionMode('quick')}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                    selectionMode === 'quick'
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Quick Select
                </button>
                <button
                  onClick={() => setSelectionMode('custom')}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                    selectionMode === 'custom'
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Custom Select
                </button>
              </div>

              {selectionMode === 'quick' ? (
                <>
                  <p className="text-slate-400 text-sm mb-8">How many chapters do you want to include?</p>
                  
                  <div className="flex items-center gap-6 mb-8">
                    <button 
                      onClick={() => setSelectedChapterCount(Math.max(1, selectedChapterCount - 1))}
                      disabled={selectedChapterCount <= 1}
                      className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-white hover:bg-slate-700 disabled:opacity-50 transition"
                    >
                      <span className="text-2xl font-bold">-</span>
                    </button>
                    
                    <div className="text-5xl font-extrabold text-amber-500 w-16 text-center">
                      {selectedChapterCount}
                    </div>
                    
                    <button 
                      onClick={() => setSelectedChapterCount(Math.min(chapters.length, selectedChapterCount + 1))}
                      disabled={selectedChapterCount >= chapters.length}
                      className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-white hover:bg-slate-700 disabled:opacity-50 transition"
                    >
                      <span className="text-2xl font-bold">+</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="w-full mb-8">
                  <p className="text-slate-400 text-sm mb-4 text-left">Select specific chapters to test:</p>
                  <div className="flex flex-wrap gap-3">
                    {chapters.map(chap => {
                      const isSelected = customSelectedChapterIds.includes(chap.id);
                      return (
                        <button
                          key={chap.id}
                          onClick={() => {
                            if (isSelected) {
                              setCustomSelectedChapterIds(prev => prev.filter(id => id !== chap.id));
                            } else {
                              setCustomSelectedChapterIds(prev => [...prev, chap.id]);
                            }
                          }}
                          className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all border ${
                            isSelected
                              ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600 hover:text-white'
                          }`}
                        >
                          {isSelected && <CheckCircle className="w-4 h-4" />}
                          Chapter {chap.chapter_number}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="w-full bg-slate-950 rounded-xl p-4 border border-slate-800 min-h-[100px] mt-auto">
                <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-3 text-left">Selected Chapters:</p>
                <div className="flex flex-wrap gap-2">
                  {selectionMode === 'quick' ? (
                    chapters.slice(0, selectedChapterCount).map(chap => (
                      <div key={chap.id} className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-lg text-sm font-bold flex items-center gap-2">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Ch {chap.chapter_number}
                      </div>
                    ))
                  ) : (
                    customSelectedChapterIds.length === 0 ? (
                      <p className="text-sm text-slate-500">None selected</p>
                    ) : (
                      chapters.filter(c => customSelectedChapterIds.includes(c.id)).map(chap => (
                        <div key={chap.id} className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-lg text-sm font-bold flex items-center gap-2">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Ch {chap.chapter_number}
                        </div>
                      ))
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Right: Info & Settings */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <List className="w-5 h-5 text-emerald-400" /> Session Settings
              </h2>
              
              <div className="mb-6">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Session Timer</label>
                <div className="grid grid-cols-3 gap-3">
                  {[10, 20, 30].map(time => (
                    <button
                      key={time}
                      onClick={() => setSessionTime(time)}
                      className={`py-3 rounded-xl border text-sm font-bold transition-all ${
                        sessionTime === time
                          ? 'bg-amber-500 text-slate-900 border-amber-500'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      {time} min
                    </button>
                  ))}
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  This determines the length of the timer and automatically pulls {sessionTime === 10 ? '30' : sessionTime === 20 ? '60' : '90'} random questions from your selected pool to fit the time limit.
                </p>
              </div>
              
              <div className="space-y-4 mb-auto text-slate-400 text-sm border-t border-slate-800 pt-4">
                <p>This test automatically mixes three formats:</p>
                <ul className="space-y-3 mt-4">
                  <li className="flex items-start gap-3">
                    <CheckSquare className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span><strong>Multiple Choice:</strong> Select correct German word.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Type className="w-5 h-5 text-blue-500 shrink-0" />
                    <span><strong>Typing:</strong> Translate in both directions.</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={startTest}
                disabled={
                  (selectionMode === 'quick' && (selectedChapterCount === 0 || chapters.length === 0)) ||
                  (selectionMode === 'custom' && customSelectedChapterIds.length === 0)
                }
                className="mt-8 w-full py-4 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-extrabold rounded-xl flex justify-center items-center gap-2 transition-all shadow-lg hover:shadow-amber-500/20"
              >
                <PlayCircle className="w-5 h-5" /> Start Test
              </button>
              {((selectionMode === 'quick' && selectedChapterCount === 0) || 
                (selectionMode === 'custom' && customSelectedChapterIds.length === 0)) && (
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
    if (saving) {
      return (
        <div className="py-24 text-center">
          <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Saving your results...</p>
        </div>
      );
    }

    if (userType === 'student') {
      return (
        <div className="animate-fade-in max-w-2xl mx-auto space-y-8 text-center py-12">
          <div className="w-24 h-24 mx-auto bg-emerald-500/10 border-4 border-emerald-500/20 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-emerald-400" />
          </div>
          <h2 className="text-4xl font-extrabold text-white">Test Complete!</h2>
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl">
            <p className="text-slate-300">Your score and detailed word review have been securely saved.</p>
            <p className="text-slate-500 text-sm mt-2">Your teacher will review your performance on the admin portal.</p>
          </div>
          <div className="flex justify-center gap-4">
            <button onClick={resetEngine} className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl flex items-center gap-2 transition">
              <RotateCcw className="w-4 h-4" /> Try Again
            </button>
            <button onClick={onBack} className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition">
              Exit to Menu
            </button>
          </div>
        </div>
      );
    }

    const percentage = Math.round((score / questions.length) * 100);
    
    let gradeLabel = 'Fail';
    let gradeStyle = 'text-red-400 bg-red-400/10 border-red-400/20';
    if (percentage >= 90) {
      gradeLabel = 'Excellent';
      gradeStyle = 'text-amber-400 bg-amber-400/10 border-amber-400/20';
    } else if (percentage >= 75) {
      gradeLabel = 'Good';
      gradeStyle = 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
    } else if (percentage >= 60) {
      gradeLabel = 'Pass';
      gradeStyle = 'text-blue-400 bg-blue-400/10 border-blue-400/20';
    }

    return (
      <div className="animate-fade-in max-w-3xl mx-auto space-y-8 text-center py-12">
        {percentage >= 75 ? (
          <div className="w-24 h-24 mx-auto bg-amber-500/10 border-4 border-amber-500/20 rounded-full flex items-center justify-center animate-bounce">
            <Trophy className="w-12 h-12 text-amber-400" />
          </div>
        ) : (
          <div className="w-24 h-24 mx-auto bg-slate-800 border-4 border-slate-700 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-slate-500" />
          </div>
        )}
        <h2 className="text-4xl font-extrabold text-white">
          {percentage >= 90 ? 'Outstanding!' : percentage >= 75 ? 'Great Job!' : percentage >= 60 ? 'Test Complete!' : 'Keep Practicing!'}
        </h2>
        
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl max-w-2xl mx-auto">
          <div className={`inline-block px-4 py-1 rounded-full border mb-4 font-bold tracking-widest uppercase text-sm ${gradeStyle}`}>
            Grade: {gradeLabel}
          </div>
          <div className="text-7xl font-mono font-extrabold text-white mb-6">
            {score} <span className="text-3xl text-slate-500">/ {questions.length}</span>
          </div>
          
          <div className="w-full bg-slate-800 rounded-full h-3 mb-2">
            <div
              className={`h-3 rounded-full transition-all duration-1000 ${
                percentage >= 90 ? 'bg-amber-400' :
                percentage >= 75 ? 'bg-emerald-500' :
                percentage >= 60 ? 'bg-blue-500' : 'bg-red-500'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <p className="text-slate-400 text-sm font-bold">{percentage}% Accuracy</p>
        </div>

        {/* Detailed Review for Free Users */}
        <div className="text-left bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl max-w-2xl mx-auto">
          <h3 className="text-xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Detailed Review</h3>
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {wordResults.map((word, idx) => (
              <div key={idx} className={`p-4 rounded-xl border flex items-center justify-between ${word.isCorrect ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                <div>
                  <p className="text-sm text-slate-400 font-bold mb-0.5">{word.english}</p>
                  <p className="text-lg font-extrabold text-white">{word.german}</p>
                  {!word.isCorrect && (
                    <p className="text-xs text-red-400 mt-1">You answered: {word.userAnswer}</p>
                  )}
                </div>
                {word.isCorrect ? <CheckCircle className="w-6 h-6 text-emerald-500 shrink-0" /> : <XCircle className="w-6 h-6 text-red-500 shrink-0" />}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-4 pt-4">
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
  
  const formatTime = (seconds) => {
    if (seconds === null) return "00:00";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="animate-fade-in max-w-3xl mx-auto flex flex-col min-h-[60vh]">
      <div className="flex items-center justify-between mb-8">
        <button onClick={resetEngine} className="text-xs text-slate-400 hover:text-white px-3 py-1.5 bg-slate-900 rounded-lg border border-slate-800 transition">
          Quit
        </button>
        <div className="text-sm font-bold text-slate-300">
          Question {currentQIndex + 1} of {questions.length}
        </div>
        <div className="flex items-center gap-3">
          {/* Countdown Timer Badge */}
          <div className={`text-xs font-mono px-3 py-1.5 rounded-lg border ${
            timeLeft !== null && timeLeft <= 60 
              ? 'bg-red-500/10 text-red-400 border-red-500/20 animate-pulse' 
              : 'bg-slate-800 text-slate-300 border-slate-700'
          }`}>
            Time: {formatTime(timeLeft)}
          </div>
          <div className="text-xs font-mono bg-amber-500/10 text-amber-400 px-3 py-1.5 rounded-lg border border-amber-500/20">
            Score: {score}
          </div>
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
          {currentQ.testFormat === 'type_en' ? (
             <div className="inline-block px-3 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-bold uppercase tracking-wider mb-4 border border-blue-500/20">
               Translate to English
             </div>
          ) : (
             <div className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-500/20">
               Translate to German
             </div>
          )}

          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-wide">
            {currentQ.testFormat === 'type_en' ? currentQ.german : currentQ.english}
          </h2>
          {currentQ.article && currentQ.testFormat !== 'type_en' && (
            <p className="mt-4 text-slate-400 text-sm">Hint: Article is <span className="text-emerald-400 font-bold font-mono">{currentQ.article}</span></p>
          )}
        </div>

        {/* MCQ Mode */}
        {currentQ.testFormat === 'mcq' && (
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
        {(currentQ.testFormat === 'type_de' || currentQ.testFormat === 'type_en') && (
          <div className="w-full max-w-xl mx-auto space-y-6">
            <form onSubmit={handleTypingSubmit} className="relative">
              <input
                type="text"
                autoFocus
                disabled={feedback !== null}
                value={userAnswer}
                onChange={e => setUserAnswer(e.target.value)}
                placeholder={currentQ.testFormat === 'type_en' ? "Type in English..." : "Type in German..."}
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
            
            {/* Built-in Umlaut Keyboard (Only show when typing German) */}
            {currentQ.testFormat === 'type_de' && (
              <UmlautKeyboard onInsert={handleInsertUmlaut} />
            )}
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
                Correct answer: <strong className="text-emerald-400">
                  {currentQ.testFormat === 'type_en' ? currentQ.english : currentQ.german}
                </strong>
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
