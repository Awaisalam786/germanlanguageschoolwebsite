"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { 
  FileCode2, Upload, Key, Plus, Trash2, CheckCircle, XCircle,
  Search, Copy, Loader2, RefreshCw, Eye, AlertCircle, Users, ExternalLink,
  ClipboardList, Download, Edit3
} from 'lucide-react';

export default function PracticeTestManager() {
  const [activeTab, setActiveTab] = useState('materials'); 
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Materials State
  const [materials, setMaterials] = useState([]);
  const [uploadForm, setUploadForm] = useState({ level: 'A1', title: '', test_type: 'Vocab Test', is_active: true });
  const [uploadFile, setUploadFile] = useState(null);
  const [fixingIds, setFixingIds] = useState(new Set()); // tracks which files are being fixed
  
  // Material Filters
  const [matLevelFilter, setMatLevelFilter] = useState('All');
  const [matCatFilter, setMatCatFilter] = useState('All');
  
  // Codes State
  const [codes, setCodes] = useState([]);
  const [codeForm, setCodeForm] = useState({ batch_name: '' });

  // Results State
  const [attempts, setAttempts] = useState([]);
  const [resultsFilter, setResultsFilter] = useState('all'); // 'all' | 'anonymous' | 'student'

  useEffect(() => {
    if (activeTab === 'materials') fetchMaterials();
    if (activeTab === 'codes') fetchCodes();
    if (activeTab === 'results') fetchAttempts();
    if (activeTab === 'leads') fetchAttempts(); // same data, filtered differently
  }, [activeTab]);

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 5000);
  };

  // --- MATERIALS MANAGEMENT ---
  const fetchMaterials = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('practice_materials').select('*').order('created_at', { ascending: false });
    if (!error && data) setMaterials(data);
    setLoading(false);
  };

  const handleUploadMaterial = async (e) => {
    e.preventDefault();
    if (!uploadFile) return showMessage("Please select an HTML file to upload", 'error');
    if (!uploadFile.name.endsWith('.html')) return showMessage("File must be an HTML file", 'error');

    setLoading(true);
    try {
      const fileExt = uploadFile.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${uploadForm.level}/${fileName}`;

      // 1. Upload to Storage with proper HTML Content-Type so browsers render it instead of showing code
      const { error: uploadError } = await supabase.storage.from('practice_tests').upload(filePath, uploadFile, {
        contentType: 'text/html; charset=utf-8',
        upsert: true
      });
      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: publicUrlData } = supabase.storage.from('practice_tests').getPublicUrl(filePath);

      // 3. Save to DB
      const { error: dbError } = await supabase.from('practice_materials').insert([{
        level: uploadForm.level,
        title: uploadForm.title,
        test_type: uploadForm.test_type,
        file_url: publicUrlData.publicUrl,
        is_active: uploadForm.is_active
      }]);

      if (dbError) throw dbError;

      showMessage("Practice test uploaded successfully!");
      setUploadForm({ ...uploadForm, title: '' });
      setUploadFile(null);
      fetchMaterials();
    } catch (err) {
      console.error(err);
      showMessage("Error uploading test. Please try again.", 'error');
    }
    setLoading(false);
  };

  const toggleMaterialStatus = async (id, currentStatus) => {
    const { error } = await supabase.from('practice_materials').update({ is_active: !currentStatus }).eq('id', id);
    if (!error) fetchMaterials();
  };

  const deleteMaterial = async (id, fileUrl) => {
    if (!window.confirm("Are you sure you want to delete this test?")) return;
    
    // Extract path from public URL
    const pathSegments = fileUrl.split('/practice_tests/');
    if (pathSegments.length > 1) {
      const filePath = pathSegments[1];
      await supabase.storage.from('practice_tests').remove([filePath]);
    }
    
    const { error } = await supabase.from('practice_materials').delete().eq('id', id);
    if (!error) {
      showMessage("Material deleted");
      fetchMaterials();
    }
  };

  // Fix content-type of an already-uploaded file by re-uploading its content with text/html
  const fixContentType = async (mat) => {
    setFixingIds(prev => new Set([...prev, mat.id]));
    try {
      // 1. Extract storage file path from the public URL
      const pathSegments = mat.file_url.split('/practice_tests/');
      if (pathSegments.length < 2) throw new Error('Cannot extract file path from URL');
      const filePath = pathSegments[1].split('?')[0]; // strip any query params

      // 2. Fetch the raw HTML content
      const res = await fetch(mat.file_url);
      if (!res.ok) throw new Error('Failed to fetch file content');
      const htmlText = await res.text();

      // 3. Re-upload to same path with correct content-type (upsert overwrites)
      const blob = new Blob([htmlText], { type: 'text/html; charset=utf-8' });
      const { error: uploadError } = await supabase.storage
        .from('practice_tests')
        .upload(filePath, blob, { contentType: 'text/html; charset=utf-8', upsert: true });
      if (uploadError) throw uploadError;

      showMessage(`✅ Fixed content-type for "${mat.title}"`);
    } catch (err) {
      console.error(err);
      showMessage(`❌ Failed to fix "${mat.title}": ${err.message}`, 'error');
    }
    setFixingIds(prev => { const n = new Set(prev); n.delete(mat.id); return n; });
  };

  const fixAllContentTypes = async () => {
    if (!window.confirm(`Fix content-type for all ${materials.length} uploaded files? This is safe and non-destructive.`)) return;
    for (const mat of materials) {
      await fixContentType(mat);
    }
    showMessage('✅ All files fixed! Raw Supabase URLs will now render correctly in browser.');
  };

  // --- ACCESS CODES MANAGEMENT ---
  const fetchCodes = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('student_access_codes').select('*').order('created_at', { ascending: false });
    if (!error && data) setCodes(data);
    setLoading(false);
  };

  const generateCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; 
    let code = 'GLS-';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const handleGenerateStudentCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const newCode = generateCode();

    const { error } = await supabase.from('student_access_codes').insert([{
      access_code: newCode,
      batch_name: codeForm.batch_name,
      is_active: true
    }]);

    if (error) {
      showMessage("Error generating code.", 'error');
    } else {
      showMessage(`Code ${newCode} generated successfully!`);
      setCodeForm({ batch_name: '' });
      fetchCodes();
    }
    setLoading(false);
  };

  const toggleCodeStatus = async (id, currentStatus) => {
    const { error } = await supabase.from('student_access_codes').update({ is_active: !currentStatus }).eq('id', id);
    if (!error) fetchCodes();
  };

  const deleteCode = async (id) => {
    if (!window.confirm("Delete this access code?")) return;
    const { error } = await supabase.from('student_access_codes').delete().eq('id', id);
    if (!error) fetchCodes();
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showMessage("Code copied to clipboard!");
  };

  // --- RESULTS MANAGEMENT ---
  const fetchAttempts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('practice_attempts')
      .select('*, practice_materials(title, level)')
      .order('created_at', { ascending: false });
    if (!error && data) setAttempts(data);
    setLoading(false);
  };

  const updateScore = async (id) => {
    const scoreInput = window.prompt("Enter the final score:");
    if (!scoreInput) return;
    const totalInput = window.prompt("Enter total possible marks:");
    if (!totalInput) return;

    const { error } = await supabase.from('practice_attempts').update({
      score: parseInt(scoreInput),
      total_marks: parseInt(totalInput)
    }).eq('id', id);

    if (!error) fetchAttempts();
  };

  const exportMetaCSV = () => {
    // Only export anonymous users — they have name/phone/email for Meta Custom Audiences
    const leads = attempts.filter(a => a.user_type === 'anonymous' || (!a.access_code_used && a.phone));
    if (leads.length === 0) {
      showMessage('No anonymous leads to export yet.', 'error');
      return;
    }
    let csv = 'email,phone,fn,ln,country\n';
    leads.forEach(a => {
      csv += `"${a.email || ''}","${a.phone || ''}","${a.first_name || ''}","${a.last_name || ''}","${a.country || 'Pakistan'}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const el = document.createElement('a');
    el.href = url;
    el.download = `meta_leads_${new Date().toISOString().split('T')[0]}.csv`;
    el.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileCode2 className="w-6 h-6 text-amber-500" />
            Practice Tests & Leads
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Manage materials, access codes, and Meta-ready leads.
          </p>
        </div>
        {(activeTab === 'results' || activeTab === 'leads') && (
          <button 
            onClick={exportMetaCSV}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-sm transition-colors flex items-center gap-2 shadow-lg"
          >
            <Download className="w-4 h-4" />
            Export Leads for Meta (CSV)
          </button>
        )}
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl flex items-center gap-2 text-sm font-bold ${
          message.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/30' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
        }`}>
          {message.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-800 pb-px overflow-x-auto">
        <button
          onClick={() => setActiveTab('materials')}
          className={`px-4 py-2 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'materials' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Upload className="w-4 h-4" />
          Manage Materials
        </button>
        <button
          onClick={() => setActiveTab('codes')}
          className={`px-4 py-2 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'codes' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Key className="w-4 h-4" />
          Student Access Codes
        </button>
        <button
          onClick={() => setActiveTab('results')}
          className={`px-4 py-2 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'results' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          🎓 Student Results
        </button>
        <button
          onClick={() => setActiveTab('leads')}
          className={`px-4 py-2 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'leads' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          🌐 Anonymous Leads
        </button>
      </div>

      {/* --- MATERIALS TAB --- */}
      {activeTab === 'materials' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          
          {/* Upload Form */}
          <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 h-fit sticky top-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Upload className="w-5 h-5 text-amber-400" />
              Upload New Test
            </h3>
            <form onSubmit={handleUploadMaterial} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Target Level</label>
                <select 
                  value={uploadForm.level} 
                  onChange={e => setUploadForm({...uploadForm, level: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="A1">A1</option>
                  <option value="A2">A2</option>
                  <option value="B1">B1</option>
                  <option value="B2">B2</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Test Title</label>
                <input 
                  type="text" required
                  placeholder="e.g. Goethe Zertifikat A1 Mock 1"
                  value={uploadForm.title}
                  onChange={e => setUploadForm({...uploadForm, title: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Category (Test Type)</label>
                <select 
                  value={uploadForm.test_type} 
                  onChange={e => setUploadForm({...uploadForm, test_type: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Vocab Test">Vocab Test</option>
                  <option value="Grammar Test">Grammar Test</option>
                  <option value="Reading Test">Reading Test</option>
                  <option value="Speaking Test">Speaking Test</option>
                  <option value="Listening">Listening</option>
                  <option value="Writing">Writing</option>
                  <option value="Full Exam">Full Exam</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">HTML File Bundle</label>
                <input 
                  type="file" accept=".html" required
                  onChange={e => setUploadFile(e.target.files[0])}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-amber-500/20 file:text-amber-400 hover:file:bg-amber-500/30"
                />
                <p className="text-[10px] text-slate-500 mt-1">Make sure the HTML has the postMessage bridge script included.</p>
              </div>
              <button disabled={loading} type="submit" className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                Upload & Publish
              </button>
            </form>
          </div>

          {/* Materials List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Uploaded Materials</h3>
              <div className="flex items-center gap-2">
                <select
                  value={matLevelFilter}
                  onChange={e => setMatLevelFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="All">All Levels</option>
                  <option value="A1">A1</option>
                  <option value="A2">A2</option>
                  <option value="B1">B1</option>
                  <option value="B2">B2</option>
                </select>
                <select
                  value={matCatFilter}
                  onChange={e => setMatCatFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="All">All Categories</option>
                  <option value="Vocab Test">Vocab Test</option>
                  <option value="Grammar Test">Grammar Test</option>
                  <option value="Reading Test">Reading Test</option>
                  <option value="Speaking Test">Speaking Test</option>
                  <option value="Listening">Listening</option>
                  <option value="Writing">Writing</option>
                  <option value="Full Exam">Full Exam</option>
                </select>
                <button
                  onClick={fixAllContentTypes}
                  disabled={loading || materials.length === 0}
                  className="px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-xs font-bold rounded-lg border border-blue-500/30 transition-colors flex items-center gap-1.5 disabled:opacity-40"
                  title="Re-upload existing files with correct text/html content-type so browser renders them properly"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Fix All Content-Types
                </button>
                <button onClick={fetchMaterials} className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors text-slate-300">
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>
            
            <div className="grid gap-3">
              {materials.length === 0 && !loading && (
                <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-500 text-sm">
                  No practice tests uploaded yet.
                </div>
              )}
              {materials
                .filter(mat => (matLevelFilter === 'All' || mat.level === matLevelFilter) && (matCatFilter === 'All' || mat.test_type === matCatFilter))
                .map(mat => (
                <div key={mat.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between group gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center font-bold text-amber-400 border border-amber-500/20 shrink-0">
                      {mat.level}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{mat.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[10px] font-bold rounded">
                          {mat.test_type}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          Added {new Date(mat.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <button 
                      onClick={() => {
                        const link = `${window.location.origin}/practice-tests?testId=${mat.id}`;
                        navigator.clipboard.writeText(link);
                        showMessage(`Copied direct test link for "${mat.title}" to clipboard!`);
                      }}
                      className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold rounded-lg transition flex items-center gap-1.5 border border-slate-700"
                      title="Copy Direct Student Test Link"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Copy Test Link</span>
                    </button>
                    <button 
                      onClick={() => window.open(`/practice-tests?testId=${mat.id}`, '_blank')}
                      className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition"
                      title="Preview Student Experience on Website"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => fixContentType(mat)}
                      disabled={fixingIds.has(mat.id)}
                      className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-md transition disabled:opacity-50"
                      title="Fix Content-Type (re-uploads with text/html so raw URL renders correctly)"
                    >
                      {fixingIds.has(mat.id) ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                    </button>
                    <button 
                      onClick={() => toggleMaterialStatus(mat.id, mat.is_active)}
                      className={`px-3 py-1 text-[10px] font-bold rounded-full border ${mat.is_active ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'}`}
                    >
                      {mat.is_active ? 'Active' : 'Inactive'}
                    </button>
                    <button 
                      onClick={() => deleteMaterial(mat.id, mat.file_url)}
                      className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-md transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- ACCESS CODES TAB --- */}
      {activeTab === 'codes' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          
          {/* Generator Form */}
          <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 h-fit sticky top-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Key className="w-5 h-5 text-amber-400" />
              Generate Batch Code
            </h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Generate a unique access code for a batch. Students can use this code to skip the lead capture form on the Practice Tests module.
            </p>
            <form onSubmit={handleGenerateStudentCode} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Batch / Group Name *</label>
                <input type="text" required placeholder="e.g. A2 Kapitel 12 Evening" value={codeForm.batch_name} onChange={e => setCodeForm({...codeForm, batch_name: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500" />
              </div>
              
              <button disabled={loading} type="submit" className="w-full py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold rounded-lg text-sm transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-50">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Generate Code
              </button>
            </form>
          </div>

          {/* Codes List */}
          <div className="lg:col-span-2 space-y-4">
             <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-xl">
              <div className="relative w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input 
                  type="text" 
                  placeholder="Search batches or codes..." 
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <button onClick={fetchCodes} className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors text-slate-300">
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
            
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950 text-xs uppercase font-bold text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Student / Meta Info</th>
                    <th className="px-4 py-3">Access Code</th>
                    <th className="px-4 py-3 text-center">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {codes.length === 0 && !loading && (
                    <tr>
                      <td colSpan="4" className="px-4 py-8 text-center text-slate-500">No codes generated yet.</td>
                    </tr>
                  )}
                  {codes.map(code => (
                    <tr key={code.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-bold text-white">{code.batch_name || '—'}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono font-bold rounded-md text-xs">
                          {code.access_code}
                          <button onClick={() => copyToClipboard(code.access_code)} className="hover:text-white transition-colors">
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        {code.last_used_at && (
                          <div className="text-[10px] text-slate-500 mt-1">Used: {new Date(code.last_used_at).toLocaleDateString()}</div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button 
                          onClick={() => toggleCodeStatus(code.id, code.is_active)}
                          className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${code.is_active ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'}`}
                        >
                          {code.is_active ? 'Active' : 'Revoked'}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={() => deleteCode(code.id)} className="p-1.5 text-slate-500 hover:text-red-400 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- RESULTS & LEADS TAB --- */}
      {activeTab === 'results' && (
        <div className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center">
              <div className="text-2xl font-extrabold text-emerald-400">
                {attempts.filter(a => a.user_type === 'student' || a.access_code_used).length}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Internal Students</div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center">
              <div className="text-2xl font-extrabold text-white">
                {attempts.length}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Total Attempts (All Types)</div>
            </div>
          </div>

          {/* Filter + Search Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-xl mb-4">
            <div className="flex items-center gap-2">
              <select
                className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
                value={resultsFilter}
                onChange={e => setResultsFilter(e.target.value)}
              >
                <option value="all">All Batches</option>
                {[...new Set(attempts.filter(a => a.user_type === 'student').map(a => a.batch_name).filter(Boolean))].map(batch => (
                  <option key={batch} value={batch}>{batch}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950 text-xs uppercase font-bold text-slate-500">
                <tr>
                  <th className="px-4 py-3">Student & Batch</th>
                  <th className="px-4 py-3">Test</th>
                  <th className="px-4 py-3">Score</th>
                  <th className="px-4 py-3">%</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {attempts.length === 0 && !loading && (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-slate-500">No practice tests taken yet.</td>
                  </tr>
                )}
                {attempts
                  .filter(a => (a.user_type === 'student' || a.access_code_used) && (resultsFilter === 'all' || a.batch_name === resultsFilter))
                  .map(attempt => {
                    const isStudent = true;
                    const pct = attempt.percentage ?? (attempt.score != null && attempt.total_marks > 0
                      ? Math.round((attempt.score / attempt.total_marks) * 100)
                      : null);
                    return (
                      <tr key={attempt.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-4 py-3">
                          <div>
                            <div className="font-bold text-white">{attempt.student_name || attempt.first_name || 'Unknown Student'}</div>
                            <div className="text-[10px] text-slate-500">{attempt.batch_name || attempt.access_code_used || '—'}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm font-bold text-white">
                            {attempt.practice_materials ? attempt.practice_materials.title : 'Unknown Test'}
                          </div>
                          <div className="text-xs text-slate-500">
                            Level {attempt.practice_materials?.level} • {new Date(attempt.created_at).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {attempt.score === null ? (
                            <span className="px-2 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded text-[10px] font-bold">Pending</span>
                          ) : (
                            <div className="font-bold text-white">{attempt.score} <span className="text-slate-500 font-normal">/ {attempt.total_marks}</span></div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {pct !== null ? (
                            <span className={`font-bold text-sm ${
                              pct >= 70 ? 'text-emerald-400' : pct >= 50 ? 'text-amber-400' : 'text-red-400'
                            }`}>{pct}%</span>
                          ) : <span className="text-slate-600">—</span>}
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded text-[10px] font-bold flex items-center gap-1 w-max">
                            <Key className="w-3 h-3" /> Internal
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          {attempt.score === null && (
                            <button
                              onClick={() => updateScore(attempt.id)}
                              className="p-1.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-md transition-colors inline-flex"
                              title="Update Score"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- ANONYMOUS LEADS TAB --- */}
      {activeTab === 'leads' && (
        <div className="space-y-4 animate-fade-in">
          <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl text-blue-300 text-sm flex items-start gap-2">
            <Users className="w-4 h-4 mt-0.5 shrink-0" />
            <p>These are <strong>anonymous users</strong> who took a practice test without a student code. Use this data for <strong>Facebook/Meta retargeting</strong>. No scores are shown here — only contact info.</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950 text-xs uppercase font-bold text-slate-500">
                <tr>
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Full Name</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Test Taken</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {attempts.filter(a => a.user_type === 'anonymous' || (!a.access_code_used && a.phone)).length === 0 && !loading && (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-slate-500">No anonymous leads yet.</td>
                  </tr>
                )}
                {attempts
                  .filter(a => a.user_type === 'anonymous' || (!a.access_code_used && a.phone))
                  .map((lead, idx) => (
                    <tr key={lead.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-3 text-slate-500 text-xs">{idx + 1}</td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-white">{lead.first_name} {lead.last_name}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-slate-300">{lead.phone || '—'}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-slate-300">{lead.email || '—'}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-white">{lead.practice_materials?.title || 'Unknown'}</div>
                        <div className="text-xs text-slate-500">Level {lead.practice_materials?.level}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap">
                        {new Date(lead.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
