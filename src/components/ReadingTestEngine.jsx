import React, { useState } from 'react';
import { Loader2, RotateCcw, CheckCircle, XCircle, ChevronLeft } from 'lucide-react';

export default function ReadingTestEngine({
  passage,
  onBack,
  userType,
  storedFreeUser,
  studentName,
  verifiedCode,
  batchName
}) {
  const [answers, setAnswers] = useState({}); // mapping of questionIndex -> selected option
  const [finished, setFinished] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Results
  const [score, setScore] = useState(0);
  const [percentage, setPercentage] = useState(0);

  const questions = passage?.questions || [];
  const totalMarks = questions.length;

  const handleOptionSelect = (qIndex, option) => {
    if (finished) return;
    setAnswers({
      ...answers,
      [qIndex]: option
    });
  };

  const handleSubmit = async () => {
    // Check if all questions are answered
    if (Object.keys(answers).length < totalMarks) {
      if (!window.confirm("You have unanswered questions. Are you sure you want to submit?")) {
        return;
      }
    }

    setFinished(true);
    setSaving(true);

    let currentScore = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correct_answer) {
        currentScore++;
      }
    });

    const currentPercentage = Math.round((currentScore / totalMarks) * 100);
    setScore(currentScore);
    setPercentage(currentPercentage);

    // Save to Database
    const payload = {
      passage_id: passage.passage_id,
      level: passage.level,
      user_type: userType,
      score: currentScore,
      total_marks: totalMarks,
      percentage: currentPercentage,
    };

    if (userType === 'student') {
      payload.access_code_used = verifiedCode;
      payload.name = studentName;
    } else {
      payload.name = storedFreeUser?.name;
      payload.phone = storedFreeUser?.phone;
      payload.email = storedFreeUser?.email;
    }

    try {
      await fetch('/api/save-reading-attempt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.error('Error saving reading attempt:', err);
    }

    setSaving(false);
  };

  const resetEngine = () => {
    setAnswers({});
    setFinished(false);
    setScore(0);
    setPercentage(0);
  };

  // --- RESULT VIEW ---
  if (finished) {
    if (saving) {
      return (
        <div className="py-24 text-center">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Saving your results...</p>
        </div>
      );
    }

    if (userType === 'student') {
      return (
        <div className="animate-fade-in max-w-2xl mx-auto space-y-8 text-center py-12">
          <div className="w-24 h-24 mx-auto bg-blue-500/10 border-4 border-blue-500/20 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-blue-400" />
          </div>
          <h2 className="text-4xl font-extrabold text-white">Test Complete!</h2>
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl">
            <p className="text-slate-300">Your score has been securely saved.</p>
            <p className="text-slate-500 text-sm mt-2">Your teacher will review your performance on the admin portal.</p>
          </div>
          <div className="flex justify-center gap-4">
            <button onClick={resetEngine} className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl flex items-center gap-2 transition">
              <RotateCcw className="w-4 h-4" /> Try Again
            </button>
            <button onClick={onBack} className="px-6 py-3 bg-blue-500 hover:bg-blue-400 text-slate-950 font-bold rounded-xl transition">
              Exit to Menu
            </button>
          </div>
        </div>
      );
    }

    // Free User Result View
    let badgeColor = 'bg-slate-500';
    let badgeText = 'Completed';
    if (percentage >= 90) { badgeColor = 'bg-amber-500 text-slate-900'; badgeText = 'Excellent!'; }
    else if (percentage >= 75) { badgeColor = 'bg-emerald-500 text-slate-900'; badgeText = 'Good'; }
    else if (percentage >= 60) { badgeColor = 'bg-blue-500 text-slate-900'; badgeText = 'Pass'; }
    else { badgeColor = 'bg-red-500 text-white'; badgeText = 'Fail'; }

    return (
      <div className="animate-fade-in max-w-4xl mx-auto text-center space-y-8">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 shadow-2xl relative overflow-hidden">
          <h2 className="text-3xl font-extrabold text-white mb-2">Test Results</h2>
          <div className="flex justify-center items-center gap-6 my-8">
            <div className="text-center">
              <p className="text-sm text-slate-400 font-bold uppercase tracking-wider mb-2">Score</p>
              <div className="text-5xl font-black text-white">{score}<span className="text-2xl text-slate-500">/{totalMarks}</span></div>
            </div>
            <div className="w-px h-16 bg-slate-800"></div>
            <div className="text-center">
              <p className="text-sm text-slate-400 font-bold uppercase tracking-wider mb-2">Grade</p>
              <div className={`px-4 py-1.5 rounded-full font-bold text-lg ${badgeColor}`}>
                {badgeText}
              </div>
            </div>
          </div>
          <p className="text-slate-400 text-sm font-bold">{percentage}% Accuracy</p>
        </div>

        {/* Detailed Review */}
        <div className="text-left bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl max-w-3xl mx-auto">
          <h3 className="text-xl font-bold text-white mb-4 border-b border-slate-800 pb-2">Review Answers</h3>
          <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            {questions.map((q, idx) => {
              const userAns = answers[idx];
              const isCorrect = userAns === q.correct_answer;
              return (
                <div key={idx} className={`p-5 rounded-2xl border ${isCorrect ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
                  <h4 className="text-white font-bold mb-3">{idx + 1}. {q.question}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {q.options.map((opt, oIdx) => {
                      let btnClass = "px-4 py-3 rounded-xl border text-sm font-bold text-left bg-slate-950 border-slate-800 text-slate-400";
                      if (opt === q.correct_answer) {
                        btnClass = "px-4 py-3 rounded-xl border text-sm font-bold text-left bg-emerald-500/20 border-emerald-500 text-emerald-400 relative overflow-hidden";
                      } else if (opt === userAns && !isCorrect) {
                        btnClass = "px-4 py-3 rounded-xl border text-sm font-bold text-left bg-red-500/20 border-red-500 text-red-400";
                      }
                      return (
                        <div key={oIdx} className={btnClass}>
                          {opt}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-center gap-4 pt-4">
          <button onClick={resetEngine} className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl flex items-center gap-2 transition">
            <RotateCcw className="w-4 h-4" /> Try Again
          </button>
          <button onClick={onBack} className="px-6 py-3 bg-blue-500 hover:bg-blue-400 text-slate-950 font-bold rounded-xl transition">
            Exit to Menu
          </button>
        </div>
      </div>
    );
  }

  // --- TEST RUNNER VIEW ---
  return (
    <div className="animate-fade-in w-full h-[calc(100vh-140px)] flex flex-col lg:flex-row gap-6">
      {/* LEFT: Passage */}
      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl flex flex-col lg:h-full overflow-hidden">
        <div className="flex items-center gap-4 border-b border-slate-800 pb-4 mb-6 shrink-0">
          <button onClick={onBack} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 text-slate-300">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-playfair font-bold text-white">{passage.passage_title}</h2>
            <span className="text-xs text-blue-400 font-bold uppercase tracking-wider">Level {passage.level}</span>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 text-slate-300 leading-relaxed text-lg whitespace-pre-wrap font-poppins">
          {passage.passage_text}
        </div>
      </div>

      {/* RIGHT: Questions */}
      <div className="lg:w-[45%] xl:w-[40%] flex flex-col gap-4 lg:h-full overflow-hidden">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex-1 overflow-y-auto custom-scrollbar flex flex-col">
          <h3 className="text-xl font-bold text-white mb-6 border-b border-slate-800 pb-4 sticky top-0 bg-slate-900 z-10">Questions</h3>
          
          <div className="space-y-8 flex-1">
            {questions.map((q, idx) => (
              <div key={idx} className="bg-slate-950 border border-slate-800 p-5 rounded-2xl shadow-sm">
                <h4 className="text-white font-bold mb-4">{idx + 1}. {q.question}</h4>
                <div className="space-y-3">
                  {q.options.map((opt, oIdx) => {
                    const isSelected = answers[idx] === opt;
                    return (
                      <button
                        key={oIdx}
                        onClick={() => handleOptionSelect(idx, opt)}
                        className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-bold transition-all ${
                          isSelected 
                            ? 'bg-blue-500/10 border-blue-500/50 text-blue-400'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600 hover:text-white'
                        }`}
                      >
                        {opt}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800 shrink-0 sticky bottom-0 bg-slate-900">
            <button
              onClick={handleSubmit}
              disabled={Object.keys(answers).length === 0}
              className="w-full py-4 bg-blue-500 hover:bg-blue-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-bold text-lg rounded-xl transition shadow-lg hover:shadow-blue-500/20"
            >
              Submit Answers
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
