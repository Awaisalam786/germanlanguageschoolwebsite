import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabaseClient';
import { BookOpen, Upload, Trash2, Loader2, CheckCircle, AlertCircle, Edit2, X, Save, Search, Type, List, AlignLeft, Edit3, Play } from 'lucide-react';
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
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [previewExercise, setPreviewExercise] = useState(null);
  
  // New state for exercise type tabs
  const [activeTab, setActiveTab] = useState('fill_blank');
  
  const [form, setForm] = useState({
    level: 'A1',
    chapter_number: '',
    topic_title: '',
    json_text: ''
  });

  const EXERCISE_TABS = [
    { id: 'fill_blank', label: 'Fill in the Blanks', icon: Edit3 },
    { id: 'mcq', label: 'Multiple Choice', icon: List },
    { id: 'word_order', label: 'Sentence Structure', icon: AlignLeft },
    { id: 'hint_construction', label: 'Hint Construction', icon: Type }
  ];

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
      if (error.code === '42P01' || error.message.includes('exercise_type')) {
        setError("Database schema error. Please run the SQL patch to add exercise_type to grammar_chapters.");
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
      
      // Enforce that all items in the array match the active tab's type (optional but good for consistency)
      const invalidItems = parsedJson.filter(item => item.type !== activeTab);
      if (invalidItems.length > 0) {
         throw new Error(`Found exercises with type other than '${activeTab}'. Please ensure all exercises match the selected tab.`);
      }
    } catch (err) {
      setError('Invalid JSON format: ' + err.message);
      return;
    }

    setUploading(true);

    // Check if chapter/type already exists
    const { data: existing } = await supabase
      .from('grammar_chapters')
      .select('id')
      .eq('level', form.level)
      .eq('chapter_number', parseInt(form.chapter_number))
      .eq('exercise_type', activeTab);

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
        setSuccess(`Chapter ${form.chapter_number} (${activeTab}) updated successfully!`);
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
          exercise_type: activeTab,
          topic_title: form.topic_title,
          json_data: parsedJson,
          word_count: parsedJson.length
        }]);

      if (insertErr) setError(insertErr.message);
      else {
        setSuccess(`Chapter ${form.chapter_number} (${activeTab}) added successfully!`);
        setForm({ ...form, chapter_number: '', topic_title: '', json_text: '' });
        fetchChapters();
      }
    }
    
    setUploading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this chapter's exercises for this type?")) return;
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

  const globalSearchResults = useMemo(() => {
    if (!globalSearchQuery.trim()) return [];
    const query = globalSearchQuery.toLowerCase();
    const results = [];
    chapters.forEach(chap => {
      (chap.json_data || []).forEach(ex => {
        if (
          (ex.topic || '').toLowerCase().includes(query) ||
          (ex.question || ex.prompt || ex.correct_sentence || '').toLowerCase().includes(query) ||
          (ex.correct_answer || '').toLowerCase().includes(query) ||
          (ex.type || '').toLowerCase().includes(query)
        ) {
          results.push({
            chapter: chap,
            exercise: ex
          });
        }
      });
    });
    return results.slice(0, 50); // limit to 50 results
  }, [globalSearchQuery, chapters]);

  const jumpToEdit = (chap, queryStr) => {
    setActiveTab(chap.exercise_type);
    handleEditStart(chap);
    setSearchQuery(queryStr);
    setGlobalSearchQuery('');
  };

  // --- Evaluation Logic for Preview ---
  const checkAnswer = (ex, typedAns, chipOrder = []) => {
    const normalize = (text) => (text || '').trim().toLowerCase().replace(/[.,!?]+$/, "");
    
    if (ex.type === 'fill_blank' || ex.type === 'mcq') {
      const correct = normalize(ex.correct_answer || '');
      const accepted = (ex.accepted_answers || []).map(normalize);
      const student = normalize(typedAns || '');
      return student === correct || accepted.includes(student);
    }
    if (ex.type === 'word_order') {
      // WORD ORDER CHECKING: Strip all punctuation and case globally.
      const normalizeWO = (str) => (str || '').toLowerCase().replace(/[.,!?]/g, '').replace(/\s+/g, ' ').trim();
      const correct = normalizeWO(ex.correct_sentence);
      const student = normalizeWO(chipOrder.join(' '));
      return student === correct;
    }
    if (ex.type === 'hint_construction') {
      const correct = (ex.correct_answer || '').trim();
      const accepted = (ex.accepted_answers || []).map(a => a.trim());
      const student = (typedAns || '').trim();
      return student === correct || accepted.includes(student);
    }
    return false;
  };

  const displayedChapters = chapters.filter(c => c.exercise_type === activeTab);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Grammar Chapters</h1>
          <p className="text-slate-400 text-sm mt-1">Organize exercises by type and topic.</p>
        </div>
        
        <div className="w-full md:w-[28rem] relative z-40">
          <Search className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Global search across all chapters & types..."
            value={globalSearchQuery}
            onChange={(e) => setGlobalSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 shadow-xl"
          />
          
          {globalSearchQuery && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-h-96 overflow-y-auto custom-scrollbar">
              {globalSearchResults.length === 0 ? (
                <div className="p-4 text-sm text-slate-400 text-center">No results found globally.</div>
              ) : (
                <div className="divide-y divide-slate-800">
                  {globalSearchResults.map((res, idx) => {
                    const text = res.exercise.question || res.exercise.prompt || res.exercise.correct_sentence || res.exercise.correct_answer || 'Exercise';
                    return (
                      <div key={idx} className="p-4 hover:bg-slate-800/50 flex justify-between items-center gap-4 group transition cursor-default">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                              {res.chapter.exercise_type.replace('_', ' ')}
                            </span>
                            <span className="text-xs text-slate-400 truncate">
                              Lvl {res.chapter.level} - Ch {res.chapter.chapter_number}: {res.chapter.topic_title}
                            </span>
                          </div>
                          <p className="text-sm text-white truncate" title={text}>{text}</p>
                        </div>
                        <button 
                          onClick={() => jumpToEdit(res.chapter, globalSearchQuery)}
                          className="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white rounded-lg transition shrink-0 opacity-0 group-hover:opacity-100"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-800 pb-4">
        {EXERCISE_TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setError(''); setSuccess(''); }}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold transition-all ${
                isActive 
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20' 
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Icon className="w-5 h-5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upload Form */}
        <div className="lg:col-span-1">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl sticky top-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5 text-emerald-400" />
              Upload {EXERCISE_TABS.find(t => t.id === activeTab)?.label}
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
                  placeholder={`[\n  {\n    "type": "${activeTab}",\n    "topic": "...",\n    "question": "...",\n    "correct_answer": "...",\n    "explanation": "..."\n  }\n]`}
                />
              </div>

              <button 
                type="submit" 
                disabled={uploading}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
              >
                {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                Save {EXERCISE_TABS.find(t => t.id === activeTab)?.label}
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
                Uploaded {EXERCISE_TABS.find(t => t.id === activeTab)?.label}
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
            ) : displayedChapters.length === 0 ? (
              <div className="py-12 text-center text-slate-500 bg-slate-950/50 rounded-xl border border-slate-800 border-dashed">
                No chapters uploaded for this type yet.
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {displayedChapters.map(chap => (
                  <div key={chap.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center justify-between group hover:border-emerald-500/50 transition">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center font-extrabold text-emerald-400 border border-emerald-500/20 text-lg shrink-0">
                        {chap.level}
                      </div>
                      <div>
                        <h4 className="font-bold text-white leading-tight mb-1">Ch {chap.chapter_number}: {chap.topic_title}</h4>
                        <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">{chap.word_count} exercises</p>
                      </div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition shrink-0">
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
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                  Edit Level {editingChapter.level} - Chapter {editingChapter.chapter_number}
                  <span className="text-xs px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-full ml-2 uppercase tracking-wider">{activeTab.replace('_', ' ')}</span>
                </h3>
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
                {/* Dynamic Table Header based on active tab */}
                <div className="grid grid-cols-12 gap-2 p-3 bg-slate-900 border border-slate-800 rounded-t-xl text-xs font-bold text-slate-400 uppercase tracking-wider sticky top-0 z-10">
                  {activeTab === 'word_order' ? (
                    <>
                      <div className="col-span-4">Scrambled Words (CSV)</div>
                      <div className="col-span-5">Correct Sentence</div>
                      <div className="col-span-3">Explanation</div>
                    </>
                  ) : activeTab === 'hint_construction' ? (
                    <>
                      <div className="col-span-2">Prompt</div>
                      <div className="col-span-2">Template</div>
                      <div className="col-span-3">Correct Answer</div>
                      <div className="col-span-2">Accepted Answers (CSV)</div>
                      <div className="col-span-3">Explanation</div>
                    </>
                  ) : activeTab === 'mcq' ? (
                    <>
                      <div className="col-span-4">Question</div>
                      <div className="col-span-2">Correct Answer</div>
                      <div className="col-span-3">Options (CSV)</div>
                      <div className="col-span-3">Explanation</div>
                    </>
                  ) : (
                    // fill_blank
                    <>
                      <div className="col-span-4">Question</div>
                      <div className="col-span-2">Correct Answer</div>
                      <div className="col-span-3">Accepted Answers (CSV)</div>
                      <div className="col-span-3">Explanation</div>
                    </>
                  )}
                </div>

                {/* Table Body */}
                <div className="border border-t-0 border-slate-800 rounded-b-xl divide-y divide-slate-800/50 bg-slate-900/50">
                  {filteredExercises.map((ex, index) => {
                    const originalIndex = editingExercises.indexOf(ex);
                    return (
                      <div key={originalIndex} className="grid grid-cols-12 gap-2 p-2 hover:bg-slate-800/30 transition items-center">
                        
                        {activeTab === 'word_order' && (
                          <>
                            <div className="col-span-4">
                              <input 
                                type="text"
                                value={(ex.scrambled_words || []).join(', ')}
                                onChange={(e) => handleCellChange(originalIndex, 'scrambled_words', e.target.value)}
                                className="w-full bg-slate-950/50 border border-transparent hover:border-slate-700 focus:border-blue-500 rounded px-2 py-1.5 text-sm text-white focus:outline-none transition"
                              />
                            </div>
                            <div className="col-span-5">
                              <input 
                                type="text"
                                value={ex.correct_sentence || ''}
                                onChange={(e) => handleCellChange(originalIndex, 'correct_sentence', e.target.value)}
                                className="w-full bg-slate-950/50 border border-transparent hover:border-slate-700 focus:border-blue-500 rounded px-2 py-1.5 text-sm text-white focus:outline-none transition"
                              />
                            </div>
                          </>
                        )}

                        {activeTab === 'hint_construction' && (
                          <>
                            <div className="col-span-2">
                              <input 
                                type="text"
                                value={ex.prompt || ''}
                                onChange={(e) => handleCellChange(originalIndex, 'prompt', e.target.value)}
                                className="w-full bg-slate-950/50 border border-transparent hover:border-slate-700 focus:border-blue-500 rounded px-2 py-1.5 text-sm text-white focus:outline-none transition"
                              />
                            </div>
                            <div className="col-span-2">
                              <input 
                                type="text"
                                value={ex.sentence_template || ''}
                                onChange={(e) => handleCellChange(originalIndex, 'sentence_template', e.target.value)}
                                className="w-full bg-slate-950/50 border border-transparent hover:border-slate-700 focus:border-blue-500 rounded px-2 py-1.5 text-sm text-slate-300 focus:outline-none transition"
                              />
                            </div>
                            <div className="col-span-3">
                              <input 
                                type="text"
                                value={ex.correct_answer || ''}
                                onChange={(e) => handleCellChange(originalIndex, 'correct_answer', e.target.value)}
                                className="w-full bg-slate-950/50 border border-transparent hover:border-slate-700 focus:border-blue-500 rounded px-2 py-1.5 text-sm text-white focus:outline-none transition"
                              />
                            </div>
                            <div className="col-span-2">
                              <input 
                                type="text"
                                value={(ex.accepted_answers || []).join(', ')}
                                onChange={(e) => handleCellChange(originalIndex, 'accepted_answers', e.target.value)}
                                className="w-full bg-slate-950/50 border border-transparent hover:border-slate-700 focus:border-blue-500 rounded px-2 py-1.5 text-sm text-slate-300 focus:outline-none transition"
                              />
                            </div>
                          </>
                        )}

                        {(activeTab === 'fill_blank' || activeTab === 'mcq') && (
                          <>
                            <div className="col-span-4">
                              <input 
                                type="text"
                                value={ex.question || ''}
                                onChange={(e) => handleCellChange(originalIndex, 'question', e.target.value)}
                                className="w-full bg-slate-950/50 border border-transparent hover:border-slate-700 focus:border-blue-500 rounded px-2 py-1.5 text-sm text-white focus:outline-none transition"
                              />
                            </div>
                            <div className="col-span-2">
                              <input 
                                type="text"
                                value={ex.correct_answer || ''}
                                onChange={(e) => handleCellChange(originalIndex, 'correct_answer', e.target.value)}
                                className="w-full bg-slate-950/50 border border-transparent hover:border-slate-700 focus:border-blue-500 rounded px-2 py-1.5 text-sm text-white focus:outline-none transition"
                              />
                            </div>
                            <div className="col-span-3">
                              <input 
                                type="text"
                                value={activeTab === 'mcq' ? (ex.options || []).join(', ') : (ex.accepted_answers || []).join(', ')}
                                onChange={(e) => handleCellChange(originalIndex, activeTab === 'mcq' ? 'options' : 'accepted_answers', e.target.value)}
                                className="w-full bg-slate-950/50 border border-transparent hover:border-slate-700 focus:border-blue-500 rounded px-2 py-1.5 text-sm text-slate-300 focus:outline-none transition"
                              />
                            </div>
                          </>
                        )}

                        {/* Explanation is common to all */}
                        <div className="col-span-3 flex items-center gap-2">
                          <input 
                            type="text"
                            value={ex.explanation || ''}
                            onChange={(e) => handleCellChange(originalIndex, 'explanation', e.target.value)}
                            className="w-full bg-slate-950/50 border border-transparent hover:border-slate-700 focus:border-blue-500 rounded px-2 py-1.5 text-sm text-slate-400 focus:outline-none transition"
                          />
                          <button 
                            onClick={() => setPreviewExercise(ex)}
                            className="p-1.5 text-blue-400 hover:text-white bg-blue-500/10 hover:bg-blue-500 rounded transition shrink-0"
                            title="Preview Exercise"
                          >
                            <Play className="w-4 h-4" />
                          </button>
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
      
      {/* Preview Modal */}
      {previewExercise && (
        <PreviewModal 
          exercise={previewExercise} 
          onClose={() => setPreviewExercise(null)} 
          onCheck={checkAnswer} 
        />
      )}
    </div>
  );
}

function PreviewModal({ exercise, onClose, onCheck }) {
  const [inputVal, setInputVal] = useState('');
  const [availableChips, setAvailableChips] = useState([]);
  const [selectedChips, setSelectedChips] = useState([]);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    setInputVal('');
    setSelectedChips([]);
    setFeedback(null);
    if (exercise.type === 'word_order') {
      setAvailableChips([...(exercise.scrambled_words || [])]);
    }
  }, [exercise]);

  const handleChipTap = (chip, fromAvailable) => {
    setFeedback(null);
    if (fromAvailable) {
      const idx = availableChips.findIndex(c => c === chip);
      const newAvail = [...availableChips];
      newAvail.splice(idx, 1);
      setAvailableChips(newAvail);
      setSelectedChips([...selectedChips, chip]);
    } else {
      const idx = selectedChips.findIndex(c => c === chip);
      const newSel = [...selectedChips];
      newSel.splice(idx, 1);
      setSelectedChips(newSel);
      setAvailableChips([...availableChips, chip]);
    }
  };

  const handleTest = (val = inputVal, chips = selectedChips) => {
    setFeedback(onCheck(exercise, val, chips));
  };

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg shadow-2xl animate-fade-in p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Play className="w-5 h-5 text-blue-400" />
            Preview: {exercise.type.replace('_', ' ')}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5"/></button>
        </div>
        
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 min-h-[200px] flex flex-col justify-center">
          <div className="text-center text-lg text-white mb-6">
            {exercise.type === 'hint_construction' ? exercise.prompt : exercise.question}
          </div>

          {exercise.type === 'mcq' && (
            <div className="flex flex-col gap-2">
              {(exercise.options || []).map((opt, i) => (
                <button 
                  key={i} 
                  onClick={() => handleTest(opt)}
                  className="w-full py-3 bg-slate-900 border border-slate-700 hover:border-blue-500 rounded-xl text-white font-medium transition"
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {(exercise.type === 'fill_blank' || exercise.type === 'hint_construction') && (
            <div className="space-y-4">
              {exercise.type === 'hint_construction' && (
                <div className="text-center text-slate-400 text-sm">{exercise.sentence_template}</div>
              )}
              <input 
                autoFocus
                type="text"
                value={inputVal}
                onChange={e => { setInputVal(e.target.value); setFeedback(null); }}
                onKeyDown={e => e.key === 'Enter' && handleTest()}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 text-center text-lg"
                placeholder="Type answer..."
              />
              <button 
                onClick={() => handleTest()}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition"
              >
                Check Answer
              </button>
            </div>
          )}

          {exercise.type === 'word_order' && (
            <div className="space-y-6">
              <div className="min-h-[60px] p-4 bg-slate-900 border border-slate-700 rounded-xl flex flex-wrap gap-2 items-center justify-center">
                {selectedChips.map((chip, i) => (
                  <button key={i} onClick={() => handleChipTap(chip, false)} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold shadow hover:bg-blue-500">
                    {chip}
                  </button>
                ))}
                {selectedChips.length === 0 && <span className="text-slate-500 text-sm">Tap words to build sentence</span>}
              </div>
              
              <div className="flex flex-wrap gap-2 justify-center">
                {availableChips.map((chip, i) => (
                  <button key={i} onClick={() => handleChipTap(chip, true)} className="px-4 py-2 bg-slate-800 border border-slate-700 text-white rounded-lg font-bold hover:border-slate-500 transition">
                    {chip}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => handleTest(null, selectedChips)}
                disabled={availableChips.length > 0}
                className={`w-full py-3 font-bold rounded-xl transition ${availableChips.length === 0 ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
              >
                Check Sentence
              </button>
            </div>
          )}
        </div>

        {feedback !== null && (
          <div className={`mt-4 p-4 rounded-xl flex items-center justify-center gap-2 font-bold text-lg animate-fade-in ${feedback ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
            {feedback ? (
              <><CheckCircle className="w-6 h-6" /> Correct!</>
            ) : (
              <><X className="w-6 h-6" /> Incorrect</>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
