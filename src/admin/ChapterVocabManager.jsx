import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { BookOpen, Upload, Trash2, Loader2, CheckCircle, AlertCircle, Edit2, X, Save, Search, Eye, Play } from 'lucide-react';
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
  const [editingChapter, setEditingChapter] = useState(null);
  const [editingWords, setEditingWords] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Preview State
  const [previewIndex, setPreviewIndex] = useState(null);
  const [previewDir, setPreviewDir] = useState('type_en'); // 'type_en' or 'type_de'
  const [previewTypedAnswer, setPreviewTypedAnswer] = useState('');
  const [previewFeedback, setPreviewFeedback] = useState(null);

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

  const handleEditStart = (chap) => {
    setEditingChapter(chap);
    setSearchQuery('');
    setPreviewIndex(null);
    const words = (chap.json_data || []).map(word => ({
      ...word,
      accepted_answers_str: word.accepted_answers ? word.accepted_answers.join(', ') : '',
      accepted_german_answers_str: word.accepted_german_answers ? word.accepted_german_answers.join(', ') : ''
    }));
    setEditingWords(words);
  };

  const handleWordChange = (index, field, value) => {
    const updated = [...editingWords];
    updated[index][field] = value;
    setEditingWords(updated);
  };

  const handlePreviewCheck = (e) => {
    e.preventDefault();
    if (previewIndex === null) return;
    
    const word = editingWords[previewIndex];
    const normalizeAnswer = (str) => str.trim().toLowerCase().replace(/[.,;!?]+$/, '');
    const normalizedUser = normalizeAnswer(previewTypedAnswer);
    let isCorrect = false;

    if (previewDir === 'type_en') {
      const enAns = (word.accepted_answers_str || '').split(',').map(s => s.trim()).filter(Boolean);
      if (!enAns.includes(word.english)) enAns.push(word.english);
      isCorrect = enAns.some(ans => normalizeAnswer(ans) === normalizedUser);
    } else {
      const deAns = (word.accepted_german_answers_str || '').split(',').map(s => s.trim()).filter(Boolean);
      if (!deAns.includes(word.german)) deAns.push(word.german);
      isCorrect = deAns.some(ans => normalizeAnswer(ans) === normalizedUser);
    }

    setPreviewFeedback(isCorrect ? 'correct' : 'incorrect');
  };

  const getPreviewMcqOptions = (word, dir) => {
    const others = editingWords.filter((_, idx) => idx !== previewIndex);
    const shuffled = [...others].sort(() => 0.5 - Math.random());
    const distractors = shuffled.slice(0, 3).map(w => dir === 'type_en' ? w.english : w.german);
    const correctAns = dir === 'type_en' ? word.english : word.german;
    return [correctAns, ...distractors].sort(() => 0.5 - Math.random());
  };

  const handleEditSave = async () => {
    const newJson = editingWords.map(word => {
      const cleanWord = { ...word };
      
      const enAns = (cleanWord.accepted_answers_str || '').split(',').map(s => s.trim()).filter(Boolean);
      if (enAns.length > 0) cleanWord.accepted_answers = enAns;
      else delete cleanWord.accepted_answers;
      
      const deAns = (cleanWord.accepted_german_answers_str || '').split(',').map(s => s.trim()).filter(Boolean);
      if (deAns.length > 0) cleanWord.accepted_german_answers = deAns;
      else delete cleanWord.accepted_german_answers;
      
      delete cleanWord.accepted_answers_str;
      delete cleanWord.accepted_german_answers_str;
      
      return cleanWord;
    });

    const { error } = await supabase
      .from('vocab_chapters')
      .update({ json_data: newJson })
      .eq('id', editingChapter.id);

    if (error) {
      alert("Failed to save chapter: " + error.message);
    } else {
      setEditingChapter(null);
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
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                      <button 
                        onClick={() => handleEditStart(chap)}
                        className="p-2 text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition"
                        title="Edit Words"
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
                <p className="text-slate-400 text-sm mt-1">Update primary words or add comma-separated synonyms for typing mode.</p>
              </div>
              
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search words..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <button 
                  onClick={() => setEditingChapter(null)} 
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition flex items-center gap-2"
                >
                  <X className="w-4 h-4" /> Cancel
                </button>
                <button 
                  onClick={handleEditSave} 
                  className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition flex items-center gap-2 shadow-lg hover:shadow-amber-500/20"
                >
                  <Save className="w-4 h-4" /> Save All
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar p-0 relative">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-950 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-amber-500 uppercase tracking-wider border-b border-slate-800">Primary German</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">German Synonyms</th>
                    <th className="px-6 py-4 text-xs font-bold text-emerald-500 uppercase tracking-wider border-b border-slate-800 border-l">Primary English</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">English Synonyms</th>
                    <th className="px-6 py-4 text-xs font-bold text-blue-400 uppercase tracking-wider border-b border-slate-800 border-l text-center">Test</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {editingWords
                    .map((word, index) => ({ ...word, originalIndex: index }))
                    .filter(w => 
                      (w.german || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                      (w.english || '').toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((word) => (
                    <tr key={word.originalIndex} className="hover:bg-slate-800/20 transition-colors">
                      <td className="p-2 border-r border-slate-800/50 w-1/4">
                        <input 
                          type="text" 
                          value={word.german} 
                          onChange={(e) => handleWordChange(word.originalIndex, 'german', e.target.value)}
                          className="w-full bg-transparent px-3 py-2 text-sm text-white focus:bg-slate-950 focus:outline-none focus:ring-1 focus:ring-amber-500 rounded"
                        />
                      </td>
                      <td className="p-2 border-r border-slate-800/50 w-1/4">
                        <input 
                          type="text" 
                          value={word.accepted_german_answers_str} 
                          onChange={(e) => handleWordChange(word.originalIndex, 'accepted_german_answers_str', e.target.value)}
                          className="w-full bg-transparent px-3 py-2 text-sm text-slate-400 focus:text-white focus:bg-slate-950 focus:outline-none focus:ring-1 focus:ring-amber-500 rounded"
                          placeholder="e.g. Auto, PKW"
                        />
                      </td>
                      <td className="p-2 border-r border-slate-800/50 w-1/4">
                        <input 
                          type="text" 
                          value={word.english} 
                          onChange={(e) => handleWordChange(word.originalIndex, 'english', e.target.value)}
                          className="w-full bg-transparent px-3 py-2 text-sm text-white focus:bg-slate-950 focus:outline-none focus:ring-1 focus:ring-emerald-500 rounded"
                        />
                      </td>
                      <td className="p-2 w-1/4">
                        <input 
                          type="text" 
                          value={word.accepted_answers_str} 
                          onChange={(e) => handleWordChange(word.originalIndex, 'accepted_answers_str', e.target.value)}
                          className="w-full bg-transparent px-3 py-2 text-sm text-slate-400 focus:text-white focus:bg-slate-950 focus:outline-none focus:ring-1 focus:ring-emerald-500 rounded"
                          placeholder="e.g. car, automobile"
                        />
                      </td>
                      <td className="p-2 border-l border-slate-800/50 text-center w-16">
                        <button
                          onClick={() => {
                            setPreviewIndex(word.originalIndex);
                            setPreviewTypedAnswer('');
                            setPreviewFeedback(null);
                          }}
                          className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition"
                          title="Preview & Test"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {editingWords.filter(w => 
                (w.german || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                (w.english || '').toLowerCase().includes(searchQuery.toLowerCase())
              ).length === 0 && (
                <div className="p-12 text-center text-slate-500">
                  No words found matching "{searchQuery}"
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewIndex !== null && editingWords[previewIndex] && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[60] flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl animate-fade-in overflow-hidden">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Play className="w-5 h-5 text-blue-500" /> Test Word Behavior
              </h3>
              <button 
                onClick={() => setPreviewIndex(null)} 
                className="text-slate-500 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              {/* Question Direction Toggle */}
              <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 mb-6">
                <button
                  onClick={() => { setPreviewDir('type_en'); setPreviewFeedback(null); setPreviewTypedAnswer(''); }}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    previewDir === 'type_en' ? 'bg-blue-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  DE ➔ EN
                </button>
                <button
                  onClick={() => { setPreviewDir('type_de'); setPreviewFeedback(null); setPreviewTypedAnswer(''); }}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    previewDir === 'type_de' ? 'bg-blue-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  EN ➔ DE
                </button>
              </div>

              <div className="text-center mb-6">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Prompt</span>
                <div className="text-3xl font-extrabold text-white">
                  {previewDir === 'type_en' ? editingWords[previewIndex].german : editingWords[previewIndex].english}
                </div>
              </div>

              <div className="space-y-6">
                {/* Typing Preview */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <h4 className="text-xs font-bold text-slate-400 mb-3 uppercase">Typing Simulation</h4>
                  <form onSubmit={handlePreviewCheck} className="flex gap-2">
                    <input 
                      type="text" 
                      value={previewTypedAnswer}
                      onChange={e => { setPreviewTypedAnswer(e.target.value); setPreviewFeedback(null); }}
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                      placeholder="Type answer & press enter"
                    />
                    <button type="submit" className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white text-sm font-bold rounded-lg transition">Check</button>
                  </form>
                  {previewFeedback && (
                    <div className={`mt-3 p-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 ${
                      previewFeedback === 'correct' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      {previewFeedback === 'correct' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                      {previewFeedback === 'correct' ? 'Accepted!' : 'Incorrect'}
                    </div>
                  )}
                  <p className="text-[10px] text-slate-500 mt-2 text-center">
                    Uses exact normalization & synonym rules as live engine.
                  </p>
                </div>

                {/* MCQ Preview */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <h4 className="text-xs font-bold text-slate-400 mb-3 uppercase">MCQ Distractor Preview</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {getPreviewMcqOptions(editingWords[previewIndex], previewDir).map((opt, i) => (
                      <div key={i} className={`p-2 rounded border text-sm text-center font-bold ${
                        opt === (previewDir === 'type_en' ? editingWords[previewIndex].english : editingWords[previewIndex].german)
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          : 'bg-slate-900 border-slate-800 text-slate-300'
                      }`}>
                        {opt}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
