import React, { useState } from 'react';
import { Video, Plus, Play, Trash2, Search, Link as LinkIcon, X } from 'lucide-react';

export default function RecordingsManager() {
  const [recordings, setRecordings] = useState([
    {
      id: 'rec-1',
      title: 'German A1 — Session 04: Nominative vs Accusative Drill',
      batch: 'A1 Evening Batch (20:00 PKT)',
      date: '2026-07-27',
      duration: '1 hr 45 min',
      videoUrl: 'https://zoom.us/rec/share/sample123',
      instructor: 'Miss Fatima Noor'
    },
    {
      id: 'rec-2',
      title: 'German B1 — Session 12: Subordinate Clauses (Weil/Obwohl)',
      batch: 'B1 Night Batch (21:00 PKT)',
      date: '2026-07-26',
      duration: '2 hr 10 min',
      videoUrl: 'https://zoom.us/rec/share/sample456',
      instructor: 'Dr. Michael Weber'
    }
  ]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    batch: 'A1 Evening Batch (20:00 PKT)',
    date: new Date().toISOString().split('T')[0],
    duration: '1 hr 30 min',
    videoUrl: '',
    instructor: 'Miss Fatima Noor'
  });

  const handleDelete = (id) => {
    if (confirm('Delete this recorded lecture link?')) {
      setRecordings(recordings.filter(r => r.id !== id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newRec = { id: `rec-${Date.now()}`, ...formData };
    setRecordings([newRec, ...recordings]);
    setShowModal(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Video className="w-6 h-6 text-amber-400" />
            <span>Class & Zoom Lecture Recording Manager</span>
          </h2>
          <p className="text-xs text-slate-400">Upload HD Zoom lecture recordings for enrolled Pakistani students to access anytime.</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-gold-glow flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Lecture Recording</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recordings.map((rec) => (
          <div key={rec.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 flex flex-col justify-between shadow-xl">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-400 font-bold border border-amber-500/30">
                  {rec.batch}
                </span>
                <span className="text-slate-400">{rec.date}</span>
              </div>
              <h3 className="text-base font-bold text-white leading-snug">{rec.title}</h3>
              <div className="text-xs text-slate-400">Instructor: <span className="text-slate-200 font-semibold">{rec.instructor}</span> • {rec.duration}</div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <a
                href={rec.videoUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Watch Zoom Recording</span>
              </a>
              <button onClick={() => handleDelete(rec.id)} className="p-1.5 rounded bg-slate-800 text-red-400 hover:bg-slate-700">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Add Zoom Class Recording</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Lecture Title</label>
                <input
                  type="text"
                  required
                  placeholder="German A1 — Session 05: Family Vocabulary"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Target Batch</label>
                <input
                  type="text"
                  required
                  value={formData.batch}
                  onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Zoom / Google Drive Recording Link</label>
                <input
                  type="url"
                  required
                  placeholder="https://zoom.us/rec/share/..."
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <button type="submit" className="w-full py-3 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs shadow">
                Publish Recording to Student Portal
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
