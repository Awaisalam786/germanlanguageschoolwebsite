import React, { useState, useEffect } from 'react';
import { Video, Plus, Play, Trash2, Search, Link as LinkIcon, X, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function RecordingsManager() {
  const [recordings, setRecordings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    batch: 'A1 Evening Batch (20:00 PKT)',
    date: new Date().toISOString().split('T')[0],
    duration: '1 hr 30 min',
    video_url: '',
    instructor: 'Miss Fatima Noor'
  });

  useEffect(() => {
    fetchRecordings();
  }, []);

  const fetchRecordings = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('recordings').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      setRecordings(data);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this recorded lecture link?')) {
      const { error } = await supabase.from('recordings').delete().eq('id', id);
      if (!error) {
        setRecordings(recordings.filter(r => r.id !== id));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.from('recordings').insert([formData]).select().single();
    if (!error && data) {
      setRecordings([data, ...recordings]);
      setShowModal(false);
      setFormData({
        title: '',
        batch: 'A1 Evening Batch (20:00 PKT)',
        date: new Date().toISOString().split('T')[0],
        duration: '1 hr 30 min',
        video_url: '',
        instructor: 'Miss Fatima Noor'
      });
    } else {
      alert('Failed to add recording.');
    }
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

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-amber-500 animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recordings.length === 0 ? (
             <div className="col-span-1 md:col-span-2 text-center text-slate-400 py-12">No recordings added yet.</div>
          ) : recordings.map((rec) => (
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
                  href={rec.video_url}
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
      )}

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
                  value={formData.video_url}
                  onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
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
