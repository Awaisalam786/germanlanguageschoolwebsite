import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { BookOpen, Upload, Trash2, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { translations } from '../i18n/translations';
import { useGlobalState } from '../context/GlobalStateContext';

export default function ChapterVocabManager() {
  const { currentLang } = useGlobalState();
  const t = translations[currentLang] || translations.en;
  
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    level: 'A1',
    chapter_number: '',
    json_text: ''
  });

  useEffect(() => {
    fetchChapters();
  }, []);

  const fetchChapters = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('vocab_chapters')
      .select('*')
      .order('level', { ascending: true })
      .order('chapter_number', { ascending: true });
      
    if (error) {
      console.error(error);
      if (error.code === '42P01') {
        setError("Table 'vocab_chapters' does not exist. Please run the SQL schema script in your Supabase dashboard.");
      }
    } else {
      setChapters(data || []);
    }
    setLoading(false);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!form.level || !form.chapter_number || !form.json_text) {
      setError('Please fill in all fields.');
      return;
    }

    let parsedJson = [];
    try {
      parsedJson = JSON.parse(form.json_text);
      if (!Array.isArray(parsedJson)) {
        throw new Error("JSON must be an array of vocabulary objects.");
      }
      if (parsedJson.length === 0) {
        throw new Error("JSON array cannot be empty.");
      }
    } catch (err) {
      setError('Invalid JSON format: ' + err.message);
      return;
    }

    setUploading(true);

    // Check if chapter already exists
    const { data: existing } = await supabase
      .from('vocab_chapters')
      .select('id')
      .eq('level', form.level)
      .eq('chapter_number', parseInt(form.chapter_number));

    if (existing && existing.length > 0) {
      // Update existing
      const { error: updateErr } = await supabase
        .from('vocab_chapters')
        .update({
          json_data: parsedJson,
          word_count: parsedJson.length
        })
        .eq('id', existing[0].id);

      if (updateErr) setError(updateErr.message);
      else {
        setSuccess(`Chapter ${form.chapter_number} updated successfully!`);
        setForm({ ...form, chapter_number: '', json_text: '' });
        fetchChapters();
      }
    } else {
      // Insert new
      const { error: insertErr } = await supabase
        .from('vocab_chapters')
        .insert([{
          level: form.level,
          chapter_number: parseInt(form.chapter_number),
          json_data: parsedJson,
          word_count: parsedJson.length
        }]);

      if (insertErr) setError(insertErr.message);
      else {
        setSuccess(`Chapter ${form.chapter_number} added successfully!`);
        setForm({ ...form, chapter_number: '', json_text: '' });
        fetchChapters();
      }
    }
    
    setUploading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this chapter?")) return;
    
    const { error } = await supabase.from('vocab_chapters').delete().eq('id', id);
    if (error) {
      alert("Error deleting chapter: " + error.message);
    } else {
      fetchChapters();
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setForm({ ...form, json_text: event.target.result });
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Chapter Vocabulary</h1>
          <p className="text-slate-400 text-sm mt-1">Manage JSON-powered multi-chapter vocabulary tests.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upload Form */}
        <div className="lg:col-span-1">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl sticky top-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5 text-emerald-400" />
              Upload Chapter JSON
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-2 text-red-400 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-center gap-2 text-emerald-400 text-xs">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <p>{success}</p>
              </div>
            )}

            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Level</label>
                <select 
                  value={form.level} 
                  onChange={e => setForm({...form, level: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="A1">A1</option>
                  <option value="A2">A2</option>
                  <option value="B1">B1</option>
                  <option value="B2">B2</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Chapter Number</label>
                <input 
                  type="number"
                  min="1"
                  required
                  value={form.chapter_number}
                  onChange={e => setForm({...form, chapter_number: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  placeholder="e.g. 1"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1 flex justify-between">
                  <span>JSON Vocabulary Data</span>
                  <label className="text-emerald-400 hover:text-emerald-300 cursor-pointer">
                    Browse File
                    <input type="file" accept=".json" className="hidden" onChange={handleFileUpload} />
                  </label>
                </label>
                <textarea 
                  required
                  rows={8}
                  value={form.json_text}
                  onChange={e => setForm({...form, json_text: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                  placeholder='[\n  {\n    "german": "das Auto",\n    "english": "the car",\n    "article": "das",\n    "example": "Ich kaufe das Auto."\n  }\n]'
                />
              </div>

              <button 
                type="submit" 
                disabled={uploading}
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-bold rounded-lg flex justify-center items-center gap-2 transition"
              >
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {uploading ? 'Saving...' : 'Save Chapter'}
              </button>
            </form>
          </div>
        </div>

        {/* Chapters List */}
        <div className="lg:col-span-2">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl h-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-500" />
                Uploaded Chapters
              </h2>
              <button 
                onClick={fetchChapters}
                className="text-xs text-slate-400 hover:text-white"
              >
                Refresh List
              </button>
            </div>

            {loading ? (
              <div className="py-12 flex justify-center">
                <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
              </div>
            ) : chapters.length === 0 ? (
              <div className="py-12 text-center text-slate-500 bg-slate-950/50 rounded-xl border border-slate-800 border-dashed">
                No chapters uploaded yet.
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {chapters.map(chap => (
                  <div key={chap.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center font-extrabold text-amber-400 border border-amber-500/20 text-lg">
                        {chap.level}
                      </div>
                      <div>
                        <h4 className="font-bold text-white">Chapter {chap.chapter_number}</h4>
                        <p className="text-xs text-slate-400">{chap.word_count} words</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDelete(chap.id)}
                      className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition opacity-0 group-hover:opacity-100"
                      title="Delete Chapter"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
