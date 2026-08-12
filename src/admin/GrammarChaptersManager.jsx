import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabaseClient';
import { BookOpen, Upload, Trash2, Loader2, CheckCircle, AlertCircle, Edit2, X, Save, Search, Play } from 'lucide-react';
import { translations } from '../i18n/translations';
import { useGlobalState } from '../context/GlobalStateContext';

export default function GrammarChaptersManager() {
  const { currentLang } = useGlobalState();
  const t = translations[currentLang] || translations.en;
  
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingChapter, setEditingChapter] = useState(null);
  const [editingExercises, setEditingExercises] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [form, setForm] = useState({
    level: 'A1',
    chapter_number: '',
    topic_title: '',
    json_text: ''
  });

  useEffect(() => {
    fetchChapters();
  }, []);

  const fetchChapters = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('grammar_chapters')
      .select('*')
      .order('level', { ascending: true })
      .order('chapter_number', { ascending: true });
      
    if (error) {
      console.error(error);
      if (error.code === '42P01') {
        setError("Table 'grammar_chapters' does not exist. Please run the SQL schema script in your Supabase dashboard.");
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
    
    if (!form.level || !form.chapter_number || !form.topic_title || !form.json_text) {
      setError('Please fill in all fields.');
      return;
    }

    let parsedJson = [];
    try {
      parsedJson = JSON.parse(form.json_text);
      if (!Array.isArray(parsedJson)) {
        throw new Error("JSON must be an array of exercise objects.");
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
      .from('grammar_chapters')
      .select('id')
      .eq('level', form.level)
      .eq('chapter_number', parseInt(form.chapter_number));

    if (existing && existing.length > 0) {
      // Update existing
      const { error: updateErr } = await supabase
        .from('grammar_chapters')
        .update({
          topic_title: form.topic_title,
          json_data: parsedJson,
          word_count: parsedJson.length
        })
        .eq('id', existing[0].id);

      if (updateErr) setError(updateErr.message);
      else {
        setSuccess(`Chapter ${form.chapter_number} updated successfully!`);
        setForm({ ...form, chapter_number: '', topic_title: '', json_text: '' });
        fetchChapters();
      }
    } else {
      // Insert new
      const { error: insertErr } = await supabase
        .from('grammar_chapters')
        .insert([{
          level: form.level,
          chapter_number: parseInt(form.chapter_number),
          topic_title: form.topic_title,
          json_data: parsedJson,
          word_count: parsedJson.length
        }]);

      if (insertErr) setError(insertErr.message);
      else {
        setSuccess(`Chapter ${form.chapter_number} added successfully!`);
        setForm({ ...form, chapter_number: '', topic_title: '', json_text: '' });
        fetchChapters();
      }
    }
    
    setUploading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this chapter?")) return;
    const { error } = await supabase.from('grammar_chapters').delete().eq('id', id);
    if (error) setError(error.message);
    else fetchChapters();
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

  // --- Editing Flow ---
  const handleEditStart = (chap) => {
    setEditingChapter(chap);
    setEditingExercises(JSON.parse(JSON.stringify(chap.json_data || [])));
    setSearchQuery('');
  };

  const handleCellChange = (index, field, value) => {
    const updated = [...editingExercises];
    if (field === 'accepted_answers' || field === 'options' || field === 'scrambled_words') {
      // split by comma and trim
      updated[index][field] = value.split(',').map(s => s.trim()).filter(s => s);
    } else {
      updated[index][field] = value;
    }
    setEditingExercises(updated);
  };

  const handleSaveEdits = async () => {
    setUploading(true);
    const { error } = await supabase
      .from('grammar_chapters')
      .update({
        json_data: editingExercises,
        word_count: editingExercises.length
      })
      .eq('id', editingChapter.id);

    if (error) {
      alert("Error saving: " + error.message);
    } else {
      alert("Changes saved successfully!");
      setEditingChapter(null);
      fetchChapters();
    }
    setUploading(false);
  };

  const filteredExercises = useMemo(() => {
    if (!searchQuery.trim()) return editingExercises;
    const query = searchQuery.toLowerCase();
    return editingExercises.filter(ex => 
      (ex.topic || '').toLowerCase().includes(query) ||
      (ex.question || ex.prompt || ex.correct_sentence || '').toLowerCase().includes(query) ||
      (ex.correct_answer || '').toLowerCase().includes(query) ||
      (ex.type || '').toLowerCase().includes(query)
    );
  }, [searchQuery, editingExercises]);

  const getStimulus = (ex) => {
    if (ex.type === 'word_order') return (ex.scrambled_words || []).join(', ');
    if (ex.type === 'hint_construction') return `${ex.prompt} | ${ex.sentence_template}`;
    return ex.question || '';
  };

  const getAnswer = (ex) => {
    if (ex.type === 'word_order') return ex.correct_sentence || '';
    return ex.correct_answer || '';
  };

  const getOptionsOrAccepted = (ex) => {
    if (ex.type === 'mcq') return (ex.options || []).join(', ');
    return (ex.accepted_answers || []).join(', ');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Grammar Chapters</h1>
          <p className="text-slate-400 text-sm mt-1">Manage JSON-powered multi-type grammar exercises.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upload Form */}
        <div className="lg:col-span-1">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl sticky top-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5 text-emerald-400" />
              Upload Grammar JSON
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
                <label className="block text-xs font-medium text-slate-400 mb-1">Topic Title</label>
                <input 
                  type="text"
                  required
                  value={form.topic_title}
                  onChange={e => setForm({...form, topic_title: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  placeholder="e.g. Präsens Verben"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1 flex justify-between">
                  <span>JSON Exercise Data</span>
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
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-emerald-500 custom-scrollbar"
                  placeholder={`[\n  {\n    "type": "fill_blank",\n    "topic": "Präsens Verben",\n    "question": "Ich ___ (haben) ein Auto.",\n    "correct_answer": "habe",\n    "accepted_answers": ["habe"],\n    "explanation": "ich takes -e ending in Präsens"\n  }\n]`}
                />
              </div>

              <button 
                type="submit" 
                disabled={uploading}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
              >
                {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                Save Chapter
              </button>
            </form>
          </div>
        </div>

        {/* Chapters List */}
        <div className="lg:col-span-2">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl h-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-500" />
                Uploaded Grammar Chapters
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
                <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
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
                      <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center font-extrabold text-emerald-400 border border-emerald-500/20 text-lg">
                        {chap.level}
                      </div>
                      <div>
                        <h4 className="font-bold text-white">Ch {chap.chapter_number}: {chap.topic_title}</h4>
                        <p className="text-xs text-slate-400">{chap.word_count} exercises</p>
                      </div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                      <button 
                        onClick={() => handleEditStart(chap)}
                        className="p-2 text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition"
                        title="Edit Exercises"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(chap.id)}
                        className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                        title="Delete Chapter"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Overlay */}
      {editingChapter && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-7xl max-h-[90vh] flex flex-col shadow-2xl animate-fade-in overflow-hidden">
            <div className="p-6 border-b border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 z-10 shrink-0">
              <div>
                <h3 className="text-2xl font-bold text-white">Edit Level {editingChapter.level} - Chapter {editingChapter.chapter_number}</h3>
                <p className="text-slate-400 text-sm mt-1">{editingChapter.topic_title} — Update exercises, options, or accepted answers.</p>
              </div>
              
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text" 
                    placeholder="Search within chapter..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <button 
                  onClick={() => setEditingChapter(null)}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto custom-scrollbar p-6 bg-slate-950/50">
              <div className="min-w-[900px]">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-2 p-3 bg-slate-900 border border-slate-800 rounded-t-xl text-xs font-bold text-slate-400 uppercase tracking-wider sticky top-0 z-10">
                  <div className="col-span-1">Type</div>
                  <div className="col-span-3">Stimulus (Question/Prompt)</div>
                  <div className="col-span-2">Correct Answer</div>
                  <div className="col-span-3">Options / Accepted (CSV)</div>
                  <div className="col-span-3">Explanation</div>
                </div>

                {/* Table Body */}
                <div className="border border-t-0 border-slate-800 rounded-b-xl divide-y divide-slate-800/50 bg-slate-900/50">
                  {filteredExercises.map((ex, index) => {
                    const originalIndex = editingExercises.indexOf(ex);
                    return (
                      <div key={originalIndex} className="grid grid-cols-12 gap-2 p-2 hover:bg-slate-800/30 transition items-center">
                        <div className="col-span-1 px-2">
                          <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-950 px-2 py-1 rounded">
                            {ex.type}
                          </span>
                        </div>
                        
                        {/* Stimulus */}
                        <div className="col-span-3">
                          {ex.type === 'word_order' ? (
                            <input 
                              type="text"
                              value={getStimulus(ex)}
                              onChange={(e) => handleCellChange(originalIndex, 'scrambled_words', e.target.value)}
                              className="w-full bg-slate-950/50 border border-transparent hover:border-slate-700 focus:border-blue-500 rounded px-2 py-1.5 text-sm text-white focus:outline-none transition"
                              title="Scrambled words (comma separated)"
                            />
                          ) : ex.type === 'hint_construction' ? (
                            <div className="space-y-1">
                              <input 
                                type="text"
                                value={ex.prompt || ''}
                                onChange={(e) => handleCellChange(originalIndex, 'prompt', e.target.value)}
                                className="w-full bg-slate-950/50 border border-transparent hover:border-slate-700 focus:border-blue-500 rounded px-2 py-1 text-sm text-white focus:outline-none transition"
                                placeholder="Prompt"
                              />
                              <input 
                                type="text"
                                value={ex.sentence_template || ''}
                                onChange={(e) => handleCellChange(originalIndex, 'sentence_template', e.target.value)}
                                className="w-full bg-slate-950/50 border border-transparent hover:border-slate-700 focus:border-blue-500 rounded px-2 py-1 text-sm text-slate-300 focus:outline-none transition"
                                placeholder="Template"
                              />
                            </div>
                          ) : (
                            <input 
                              type="text"
                              value={getStimulus(ex)}
                              onChange={(e) => handleCellChange(originalIndex, 'question', e.target.value)}
                              className="w-full bg-slate-950/50 border border-transparent hover:border-slate-700 focus:border-blue-500 rounded px-2 py-1.5 text-sm text-white focus:outline-none transition"
                            />
                          )}
                        </div>

                        {/* Correct Answer */}
                        <div className="col-span-2">
                          <input 
                            type="text"
                            value={getAnswer(ex)}
                            onChange={(e) => handleCellChange(originalIndex, ex.type === 'word_order' ? 'correct_sentence' : 'correct_answer', e.target.value)}
                            className="w-full bg-slate-950/50 border border-transparent hover:border-slate-700 focus:border-blue-500 rounded px-2 py-1.5 text-sm text-white focus:outline-none transition"
                          />
                        </div>

                        {/* Options / Accepted Answers */}
                        <div className="col-span-3">
                          <input 
                            type="text"
                            value={getOptionsOrAccepted(ex)}
                            onChange={(e) => handleCellChange(originalIndex, ex.type === 'mcq' ? 'options' : 'accepted_answers', e.target.value)}
                            className="w-full bg-slate-950/50 border border-transparent hover:border-slate-700 focus:border-blue-500 rounded px-2 py-1.5 text-sm text-slate-300 focus:outline-none transition"
                            placeholder="Comma separated"
                          />
                        </div>

                        {/* Explanation */}
                        <div className="col-span-3 flex gap-2 items-center">
                          <input 
                            type="text"
                            value={ex.explanation || ''}
                            onChange={(e) => handleCellChange(originalIndex, 'explanation', e.target.value)}
                            className="w-full bg-slate-950/50 border border-transparent hover:border-slate-700 focus:border-blue-500 rounded px-2 py-1.5 text-sm text-slate-400 focus:outline-none transition"
                          />
                        </div>

                      </div>
                    );
                  })}
                  
                  {filteredExercises.length === 0 && (
                    <div className="p-8 text-center text-slate-500">
                      No exercises match your search.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-800 bg-slate-900 shrink-0 flex justify-end gap-4">
              <button 
                onClick={() => setEditingChapter(null)}
                className="px-6 py-2.5 rounded-xl font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveEdits}
                disabled={uploading}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition flex items-center gap-2 shadow-lg shadow-blue-500/20"
              >
                {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
