import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { 
  FileCode2, Upload, Key, Plus, Trash2, CheckCircle, XCircle,
  Search, Copy, Loader2, RefreshCw, Eye, AlertCircle, Users, ExternalLink
} from 'lucide-react';

export default function PracticeTestManager() {
  const [activeTab, setActiveTab] = useState('materials'); 
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Materials State
  const [materials, setMaterials] = useState([]);
  const [uploadForm, setUploadForm] = useState({ level: 'A1', title: '', test_type: 'Full Exam', is_active: true });
  const [uploadFile, setUploadFile] = useState(null);
  
  // Codes State
  const [codes, setCodes] = useState([]);
  const [codeForm, setCodeForm] = useState({ first_name: '', last_name: '', phone: '', email: '' });

  useEffect(() => {
    if (activeTab === 'materials') fetchMaterials();
    if (activeTab === 'codes') fetchCodes();
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

      // 1. Upload to Storage
      const { error: uploadError } = await supabase.storage.from('practice_tests').upload(filePath, uploadFile);
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

  // --- ACCESS CODES MANAGEMENT ---
  const fetchCodes = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('student_access_codes').select('*').order('created_at', { ascending: false });
    if (!error && data) setCodes(data);
    setLoading(false);
  };

  const generateCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excluded confusing chars like O/0, I/1
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
      first_name: codeForm.first_name,
      last_name: codeForm.last_name,
      phone: codeForm.phone,
      email: codeForm.email,
      is_active: true
    }]);

    if (error) {
      showMessage("Error generating code.", 'error');
    } else {
      showMessage(`Code ${newCode} generated successfully!`);
      setCodeForm({ first_name: '', last_name: '', phone: '', email: '' });
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

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <FileCode2 className="w-6 h-6 text-amber-500" />
          Practice Tests & Access Codes
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Upload HTML test bundles and manage Meta-ready student access codes.
        </p>
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
      <div className="flex space-x-2 border-b border-slate-800 pb-px">
        <button
          onClick={() => setActiveTab('materials')}
          className={`px-4 py-2 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'materials' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Upload className="w-4 h-4" />
          Manage Materials
        </button>
        <button
          onClick={() => setActiveTab('codes')}
          className={`px-4 py-2 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'codes' ? 'border-amber-500 text-amber-400' : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Key className="w-4 h-4" />
          Student Access Codes
        </button>
      </div>

      {/* --- MATERIALS TAB --- */}
      {activeTab === 'materials' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
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
                <label className="block text-xs font-medium text-slate-400 mb-1">Test Type</label>
                <select 
                  value={uploadForm.test_type} 
                  onChange={e => setUploadForm({...uploadForm, test_type: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Full Exam">Full Exam</option>
                  <option value="Reading">Reading (Lesen)</option>
                  <option value="Listening">Listening (Hören)</option>
                  <option value="Writing">Writing (Schreiben)</option>
                  <option value="Grammar">Grammar / Vocab</option>
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
              <button onClick={fetchMaterials} className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors text-slate-300">
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
            
            <div className="grid gap-3">
              {materials.length === 0 && !loading && (
                <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-500 text-sm">
                  No practice tests uploaded yet.
                </div>
              )}
              {materials.map(mat => (
                <div key={mat.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center font-bold text-amber-400 border border-amber-500/20">
                      {mat.level}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{mat.title}</h4>
                      <p className="text-xs text-slate-400">{mat.test_type} • Added {new Date(mat.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => window.open(mat.file_url, '_blank')}
                      className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition"
                      title="Preview HTML Test"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => toggleMaterialStatus(mat.id, mat.is_active)}
                      className={`px-3 py-1 text-xs font-bold rounded-full border ${mat.is_active ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'}`}
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Generator Form */}
          <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 h-fit sticky top-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Key className="w-5 h-5 text-amber-400" />
              Generate Student Code
            </h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Generate a unique access code for an existing student. They can use this code to skip the lead capture form on the Practice Tests module.
            </p>
            <form onSubmit={handleGenerateStudentCode} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">First Name *</label>
                  <input type="text" required value={codeForm.first_name} onChange={e => setCodeForm({...codeForm, first_name: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Last Name *</label>
                  <input type="text" required value={codeForm.last_name} onChange={e => setCodeForm({...codeForm, last_name: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Phone (+92 format) *</label>
                <input type="text" required placeholder="+923001234567" value={codeForm.phone} onChange={e => setCodeForm({...codeForm, phone: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Email</label>
                <input type="email" placeholder="student@email.com" value={codeForm.email} onChange={e => setCodeForm({...codeForm, email: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500" />
              </div>
              
              <button disabled={loading} type="submit" className="w-full py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold rounded-lg text-sm transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-50">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Generate & Save Code
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
                  placeholder="Search students or codes..." 
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
                        <div className="font-bold text-white">{code.first_name} {code.last_name}</div>
                        <div className="text-xs text-slate-500">{code.phone} {code.email && `• ${code.email}`}</div>
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

    </div>
  );
}
