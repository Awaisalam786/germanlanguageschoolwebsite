import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { BookOpen, Upload, Trash2, Loader2, CheckCircle, AlertCircle, Edit2, Filter, X } from 'lucide-react';

export default function ReadingPassagesManager() {
  const [passages, setPassages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filterLevel, setFilterLevel] = useState('All');
  const [filterChapter, setFilterChapter] = useState('All');
  const [editingPassage, setEditingPassage] = useState(null);
  const [editJson, setEditJson] = useState('');

  const [form, setForm] = useState({
    level: 'A1',
    chapter_reference: '',
    json_text: ''
  });

  useEffect(() => {
    fetchPassages();
  }, []);

  const fetchPassages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('reading_passages')
      .select('*')
      .order('level', { ascending: true })
      .order('passage_id', { ascending: true });
      
    if (error) {
      console.error(error);
      if (error.code === '42P01') {
        setError("Table 'reading_passages' does not exist. Please run the SQL schema script.");
      }
    } else {
      setPassages(data || []);
    }
    setLoading(false);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!form.level || !form.json_text) {
      setError('Level and JSON Text are required.');
      return;
    }

    let parsedJson = null;
    try {
      parsedJson = JSON.parse(form.json_text);
    } catch (err) {
      setError('Invalid JSON format: ' + err.message);
      return;
    }

    // Convert to array if it's a single object
    const passagesArray = Array.isArray(parsedJson) ? parsedJson : [parsedJson];

    // Validate structure
    for (const p of passagesArray) {
      if (!p.passage_id || !p.passage_title || !p.passage_text || !Array.isArray(p.questions)) {
        setError('JSON objects must contain passage_id, passage_title, passage_text, and a questions array.');
        return;
      }
    }

    setUploading(true);

    let insertedCount = 0;
    let updatedCount = 0;

    for (const p of passagesArray) {
      let query = supabase
        .from('reading_passages')
        .select('id')
        .eq('level', form.level)
        .eq('passage_id', p.passage_id);

      if (form.chapter_reference) {
        query = query.eq('chapter_reference', parseInt(form.chapter_reference));
      } else {
        query = query.is('chapter_reference', null);
      }

      const { data: existing } = await query;

      const payload = {
        level: form.level,
        chapter_reference: form.chapter_reference ? parseInt(form.chapter_reference) : null,
        passage_id: p.passage_id,
        passage_title: p.passage_title,
        passage_text: p.passage_text,
        questions: p.questions
      };

      if (existing && existing.length > 0) {
        // Update existing
        const { error: updateErr } = await supabase
          .from('reading_passages')
          .update(payload)
          .eq('id', existing[0].id);

        if (updateErr) {
          setError(`Error updating passage ${p.passage_id}: ${updateErr.message}`);
          setUploading(false);
          return;
        }
        updatedCount++;
      } else {
        // Insert new
        const { error: insertErr } = await supabase
          .from('reading_passages')
          .insert([payload]);

        if (insertErr) {
          setError(`Error inserting passage ${p.passage_id}: ${insertErr.message}`);
          setUploading(false);
          return;
        }
        insertedCount++;
      }
    }
    
    setSuccess(`Successfully added ${insertedCount} and updated ${updatedCount} passages!`);
    setForm({ ...form, chapter_reference: '', json_text: '' });
    fetchPassages();
    setUploading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this passage?")) return;
    
    const { error } = await supabase.from('reading_passages').delete().eq('id', id);
    if (error) {
      alert("Error deleting passage: " + error.message);
    } else {
      fetchPassages();
    }
  };

  const openEditModal = (passage) => {
    setEditingPassage(passage);
    // Format JSON for editing, picking only the editable fields
    const editableData = {
      passage_id: passage.passage_id,
      passage_title: passage.passage_title,
      passage_text: passage.passage_text,
      questions: passage.questions
    };
    setEditJson(JSON.stringify(editableData, null, 2));
  };

  const handleEditSave = async () => {
    try {
      const parsed = JSON.parse(editJson);
      
      const payload = {
        passage_id: parsed.passage_id,
        passage_title: parsed.passage_title,
        passage_text: parsed.passage_text,
        questions: parsed.questions
      };

      const { error } = await supabase
        .from('reading_passages')
        .update(payload)
        .eq('id', editingPassage.id);

      if (error) throw error;

      setEditingPassage(null);
      setEditJson('');
      fetchPassages();
    } catch (err) {
      alert("Invalid JSON or save failed: " + err.message);
    }
  };

  // Compute filters
  const availableChapters = Array.from(new Set(
    passages
      .filter(p => filterLevel === 'All' || p.level === filterLevel)
      .map(p => p.chapter_reference || 'Other')
  )).sort((a, b) => {
    if (a === 'Other') return 1;
    if (b === 'Other') return -1;
    return parseInt(a) - parseInt(b);
  });

  const filteredPassages = passages.filter(p => {
    if (filterLevel !== 'All' && p.level !== filterLevel) return false;
    const ch = p.chapter_reference || 'Other';
    if (filterChapter !== 'All' && ch.toString() !== filterChapter.toString()) return false;
    return true;
  });

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
          <h1 className="text-3xl font-extrabold text-white">Reading Passages</h1>
          <p className="text-slate-400 text-sm mt-1">Manage reading comprehension tests.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upload Form */}
        <div className="lg:col-span-1">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Upload className="w-5 h-5 text-amber-500" />
              Upload Passage JSON
            </h2>
            
            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-2 text-red-400 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-emerald-400 text-xs">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <p>{success}</p>
              </div>
            )}

            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Level *</label>
                <select 
                  value={form.level}
                  onChange={(e) => setForm({...form, level: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-amber-500 focus:outline-none text-sm"
                >
                  <option value="A1">A1</option>
                  <option value="A2">A2</option>
                  <option value="B1">B1</option>
                  <option value="B2">B2</option>
                  <option value="C1">C1</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Chapter Reference (Optional)</label>
                <input 
                  type="number" 
                  placeholder="e.g. 1"
                  value={form.chapter_reference}
                  onChange={(e) => setForm({...form, chapter_reference: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-amber-500 focus:outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">JSON Content *</label>
                <div className="mb-2 relative">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg px-3 py-2 text-xs text-center text-slate-300 font-bold transition-colors">
                    Browse JSON File
                  </div>
                </div>
                <textarea
                  required
                  placeholder='[{"passage_id":1, "passage_title":"...", "passage_text":"...", "questions":[]}]'
                  value={form.json_text}
                  onChange={(e) => setForm({...form, json_text: e.target.value})}
                  className="w-full h-48 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 text-xs font-mono focus:border-amber-500 focus:outline-none custom-scrollbar"
                />
              </div>

              <button 
                type="submit" 
                disabled={uploading}
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl flex justify-center items-center gap-2 transition"
              >
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {uploading ? 'Processing...' : 'Upload Passages'}
              </button>
            </form>
          </div>
        </div>

        {/* Passages List */}
        <div className="lg:col-span-2">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl h-[800px] flex flex-col relative">
            
            {/* Edit Modal Overlay */}
            {editingPassage && (
              <div className="absolute inset-0 z-20 bg-slate-950/95 backdrop-blur-sm rounded-2xl p-6 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Edit2 className="w-4 h-4 text-amber-500" />
                    Edit Passage {editingPassage.passage_id}
                  </h3>
                  <button onClick={() => setEditingPassage(null)} className="text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <textarea
                  value={editJson}
                  onChange={(e) => setEditJson(e.target.value)}
                  className="flex-1 w-full bg-slate-900 border border-slate-800 rounded-xl p-4 text-slate-300 text-xs font-mono focus:border-amber-500 focus:outline-none custom-scrollbar mb-4"
                />
                <div className="flex gap-3">
                  <button onClick={() => setEditingPassage(null)} className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition">
                    Cancel
                  </button>
                  <button onClick={handleEditSave} className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition">
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-500" />
                Uploaded Passages
              </h2>
              <span className="text-xs text-slate-500 font-bold">{filteredPassages.length} Total</span>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2 text-slate-400 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg flex-1">
                <Filter className="w-4 h-4" />
                <select 
                  value={filterLevel}
                  onChange={e => {
                    setFilterLevel(e.target.value);
                    setFilterChapter('All'); // reset chapter filter on level change
                  }}
                  className="bg-transparent text-sm focus:outline-none w-full text-white"
                >
                  <option value="All">All Levels</option>
                  <option value="A1">A1</option>
                  <option value="A2">A2</option>
                  <option value="B1">B1</option>
                  <option value="B2">B2</option>
                  <option value="C1">C1</option>
                </select>
              </div>

              <div className="flex items-center gap-2 text-slate-400 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg flex-1">
                <BookOpen className="w-4 h-4" />
                <select 
                  value={filterChapter}
                  onChange={e => setFilterChapter(e.target.value)}
                  className="bg-transparent text-sm focus:outline-none w-full text-white"
                >
                  <option value="All">All Chapters</option>
                  {availableChapters.map(ch => (
                    <option key={ch} value={ch}>{ch === 'Other' ? 'Additional Passages' : `Chapter ${ch}`}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
                </div>
              ) : filteredPassages.length === 0 ? (
                <div className="text-center py-12 text-slate-500 border border-slate-800 border-dashed rounded-xl">
                  No passages match your filters.
                </div>
              ) : (
                filteredPassages.map(p => (
                  <div key={p.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center justify-between group hover:border-slate-700 transition">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-amber-500/10 text-amber-400 font-extrabold rounded-lg flex flex-col items-center justify-center">
                        <span className="text-[10px] leading-none opacity-80">ID</span>
                        <span className="text-sm leading-none mt-1">{p.passage_id}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[10px] font-bold rounded">Level {p.level}</span>
                          {p.chapter_reference && <span className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[10px] font-bold rounded">Ch {p.chapter_reference}</span>}
                        </div>
                        <h3 className="text-sm font-bold text-white">{p.passage_title}</h3>
                        <p className="text-xs text-slate-500">{p.questions.length} questions</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => openEditModal(p)}
                        className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-500/10 rounded-lg transition"
                        title="Edit JSON"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(p.id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition"
                        title="Delete Passage"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
