import React, { useState, useEffect } from 'react';
import { Award, Plus, Eye, Trash2, ShieldCheck, Lock, Upload, Sparkles, CheckCircle2, Loader2, Image as ImageIcon } from 'lucide-react';
import ProtectedImage from '../components/ProtectedImage';
import { supabase } from '../lib/supabaseClient';
import ImageEditorModal from './ImageEditorModal';

export default function CertificateManager() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewCert, setPreviewCert] = useState(null);
  const [showPrivateOriginal, setShowPrivateOriginal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadNotice, setUploadNotice] = useState('');
  const [uploadingFile, setUploadingFile] = useState(false);
  const [editorFile, setEditorFile] = useState(null); // { url, name, extension }

  // 30-Second Quick Upload Form State
  const [newCert, setNewCert] = useState({
    studentName: '',
    examBody: 'Goethe-Zertifikat B1',
    city: '',
    score: '',
    date: '',
    quote: '',
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80'
  });

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('certificates').select('*').order('issue_date', { ascending: false });
    if (!error && data) {
      const mapped = data.map(c => ({
        id: c.id,
        studentName: c.student_name,
        congratsTitle: c.congrats_title,
        examBody: c.exam_body,
        city: c.city,
        score: c.score,
        date: c.issue_date,
        quote: c.quote,
        imageUrl: c.image_url,
        verified: c.verified
      }));
      setCertificates(mapped);
    }
    setLoading(false);
  };

  const toggleFeatured = async (id) => {
    const cert = certificates.find(c => c.id === id);
    if (!cert) return;
    
    const { error } = await supabase.from('certificates').update({ verified: !cert.verified }).eq('id', id);
    if (!error) {
      setCertificates(certificates.map(c => c.id === id ? { ...c, verified: !c.verified } : c));
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Remove certificate from showcase?')) {
      const { error } = await supabase.from('certificates').delete().eq('id', id);
      if (!error) {
        setCertificates(certificates.filter(c => c.id !== id));
      }
    }
  };

  const handleQuickUploadSubmit = async (e) => {
    e.preventDefault();
    if (!newCert.studentName) {
      alert('Please enter student name');
      return;
    }
    
    if (!newCert.imageUrl) {
      alert('Please upload a certificate image or provide a URL.');
      return;
    }

    const payload = {
      student_name: newCert.studentName,
      congrats_title: `Congratulations to ${newCert.studentName}!`,
      exam_body: newCert.examBody,
      city: newCert.city,
      score: newCert.score,
      issue_date: newCert.date || 'July 2026',
      quote: newCert.quote,
      image_url: newCert.imageUrl,
      verified: true
    };

    const { data, error } = await supabase.from('certificates').insert([payload]).select().single();

    if (!error && data) {
      const mapped = {
        id: data.id,
        studentName: data.student_name,
        congratsTitle: data.congrats_title,
        examBody: data.exam_body,
        city: data.city,
        score: data.score,
        date: data.issue_date,
        quote: data.quote,
        imageUrl: data.image_url,
        verified: data.verified
      };
      
      setCertificates([mapped, ...certificates]);
      setShowUploadModal(false);
      setUploadNotice(`Certificate for ${newCert.studentName} uploaded and watermarked!`);
      setTimeout(() => setUploadNotice(''), 4000);

      setNewCert({
        studentName: '',
        examBody: 'Goethe-Zertifikat B1',
        city: '',
        score: '',
        date: '',
        quote: '',
        imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80'
      });
    } else {
      console.error("Supabase Insert Error:", error);
      alert('Failed to upload certificate: ' + (error?.message || 'Unknown error'));
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // If it's an image, open the editor
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setEditorFile({ url, name: file.name, extension: file.name.split('.').pop() });
      // Reset the file input so the same file can be selected again if needed
      e.target.value = '';
      return;
    }

    // If it's a PDF or something else, upload directly
    await processFileUpload(file);
  };

  const handleEditorSave = async (base64Image, extension) => {
    setEditorFile(null);
    setUploadingFile(true);
    
    try {
      // Convert base64 to Blob
      const res = await fetch(base64Image);
      const blob = await res.blob();
      
      const fileName = `cert-${Date.now()}.${extension || 'jpg'}`;
      
      const { error: uploadError } = await supabase.storage
        .from('certificates')
        .upload(fileName, blob);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('certificates')
        .getPublicUrl(fileName);

      setNewCert(prev => ({ ...prev, imageUrl: publicUrlData.publicUrl }));
    } catch (error) {
      console.error('Error uploading edited certificate:', error);
      alert('Failed to upload file. Please run the SQL bucket script in Supabase first.');
    } finally {
      setUploadingFile(false);
    }
  };

  const processFileUpload = async (file) => {
    setUploadingFile(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `cert-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('certificates')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('certificates')
        .getPublicUrl(fileName);

      setNewCert(prev => ({ ...prev, imageUrl: publicUrlData.publicUrl }));
    } catch (error) {
      console.error('Error uploading certificate:', error);
      alert('Failed to upload file. Please run the SQL bucket script in Supabase first.');
    } finally {
      setUploadingFile(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-400" />
            <span>Featured Certificate Showcase Manager</span>
          </h2>
          <p className="text-xs text-slate-400">
            Upload raw landscape certificates in under 30 seconds. The system automatically applies the diagonal watermark (<span className="text-amber-400 font-bold">03421189593</span>) for public view.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold shadow-gold-glow flex items-center gap-2 transition hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Certificate (30-Sec Quick Form)</span>
        </button>
      </div>

      {uploadNotice && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-2xl text-xs text-emerald-400 flex items-center gap-2 shadow-lg">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="font-bold">{uploadNotice}</span>
        </div>
      )}

      {/* Grid of Certificates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {certificates.map((cert) => (
          <div key={cert.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 flex flex-col justify-between shadow-xl">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-bold border border-amber-500/30">
                  {cert.examBody}
                </span>
                <span className="text-slate-400 text-[10px]">{cert.date}</span>
              </div>
              <h3 className="text-base font-bold text-white">{cert.congratsTitle || `Congratulations to ${cert.studentName}!`}</h3>
              {cert.score && <p className="text-xs text-emerald-400 font-bold">Score: {cert.score}</p>}
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleFeatured(cert.id)}
                  className={`px-3 py-1 rounded text-xs font-bold transition ${
                    cert.verified ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {cert.verified ? '✓ Featured on Homepage' : 'Hidden'}
                </button>
                <button
                  onClick={() => { setPreviewCert(cert); setShowPrivateOriginal(false); }}
                  className="px-2.5 py-1 rounded bg-slate-800 text-amber-400 hover:bg-slate-700 text-xs font-bold flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>
              </div>

              <button onClick={() => handleDelete(cert.id)} className="p-1.5 rounded bg-slate-800 text-red-400 hover:bg-slate-700">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 30-Second Quick Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-fade-in">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Upload className="w-5 h-5 text-amber-400" />
                  <span>30-Second Certificate Upload</span>
                </h3>
                <p className="text-[11px] text-slate-400">Only Student Name & Level are required. Auto-watermarked upon upload.</p>
              </div>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleQuickUploadSubmit} className="space-y-4 text-xs">
              
              {/* Image Upload / URL */}
              <div className="space-y-1">
                <label className="text-slate-300 font-bold flex justify-between">
                  <span>Certificate Image / PDF File</span>
                  {uploadingFile && <span className="text-amber-400 text-[10px] animate-pulse flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin"/> Uploading...</span>}
                </label>
                
                {!newCert.imageUrl || newCert.imageUrl === 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80' ? (
                  <div className="w-full relative bg-slate-950 border border-slate-800 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-slate-900 transition-colors cursor-pointer overflow-hidden group">
                     <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={handleFileUpload}
                        disabled={uploadingFile}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                      />
                      <Upload className="w-8 h-8 text-slate-500 group-hover:text-amber-500 mb-2 transition-colors" />
                      <span className="font-bold text-slate-300">Click to upload file</span>
                      <span className="text-[10px] text-slate-500 mt-1">Supports JPG, PNG, PDF</span>
                  </div>
                ) : (
                  <div className="w-full bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span className="text-emerald-400 text-xs truncate">{newCert.imageUrl.split('/').pop()}</span>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setNewCert({...newCert, imageUrl: ''})}
                      className="text-red-400 hover:text-red-300 ml-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* 1. Student Name (REQUIRED) */}
              <div className="space-y-1">
                <label className="text-slate-300 font-bold">Student Name * (Required)</label>
                <input
                  type="text"
                  required
                  value={newCert.studentName}
                  onChange={(e) => setNewCert({ ...newCert, studentName: e.target.value })}
                  placeholder="e.g. Usman Chaudhry"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 focus:outline-none focus:border-amber-500 font-semibold"
                />
                <span className="text-[10px] text-amber-400 italic block">Heading automatically generated: "Congratulations to {newCert.studentName || '[Student Name]'}!"</span>
              </div>

              {/* 2. Certificate Level Dropdown (REQUIRED) */}
              <div className="space-y-1">
                <label className="text-slate-300 font-bold">Certificate Level / Exam Body * (Required Dropdown)</label>
                <select
                  value={newCert.examBody}
                  onChange={(e) => setNewCert({ ...newCert, examBody: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 focus:outline-none focus:border-amber-500 font-semibold"
                >
                  <option value="Goethe-Zertifikat A1">Goethe-Zertifikat A1</option>
                  <option value="Goethe-Zertifikat A2">Goethe-Zertifikat A2</option>
                  <option value="Goethe-Zertifikat B1">Goethe-Zertifikat B1</option>
                  <option value="Goethe-Zertifikat B2">Goethe-Zertifikat B2</option>
                  <option value="telc Deutsch A1-B2">telc Deutsch A1-B2</option>
                  <option value="ÖSD Zertifikat">ÖSD Zertifikat</option>
                </select>
              </div>

              {/* OPTIONAL FIELDS */}
              {/* 3. Optional Details */}
              <div className="pt-2 border-t border-slate-800">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Optional Details (Leave blank if not needed)</p>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="space-y-1">
                    <label className="text-slate-400">City / Location</label>
                    <input
                      type="text"
                      value={newCert.city}
                      onChange={(e) => setNewCert({ ...newCert, city: e.target.value })}
                      placeholder="Lahore"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-400">Score Achieved</label>
                    <input
                      type="text"
                      value={newCert.score}
                      onChange={(e) => setNewCert({ ...newCert, score: e.target.value })}
                      placeholder="e.g. 95/100 or 1,0"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400">Student Testimonial Quote</label>
                  <input
                    type="text"
                    value={newCert.quote}
                    onChange={(e) => setNewCert({ ...newCert, quote: e.target.value })}
                    placeholder="e.g. Cleared Goethe B2 on first attempt via live online classes."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowUploadModal(false)} className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition">Cancel</button>
                <button type="submit" className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-extrabold shadow-lg shadow-emerald-500/20 transition hover:scale-105 disabled:opacity-50" disabled={uploadingFile}>Save & Apply Auto-Watermark</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filerobot Image Editor Modal */}
      {editorFile && (
        <ImageEditorModal
          fileUrl={editorFile.url}
          fileName={editorFile.name}
          onSave={handleEditorSave}
          onClose={() => setEditorFile(null)}
        />
      )}

      {/* Certificate Preview Modal */}
      {previewCert && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">{previewCert.congratsTitle || `Congratulations to ${previewCert.studentName}!`}</h3>
                <span className="text-xs text-amber-400">{previewCert.examBody}</span>
              </div>
              <button onClick={() => setPreviewCert(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="flex items-center justify-between bg-slate-950 p-2 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-300 font-medium">Select Preview Mode:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowPrivateOriginal(false)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold ${
                    !showPrivateOriginal ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  Public Watermarked (03421189593)
                </button>
                <button
                  onClick={() => setShowPrivateOriginal(true)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold ${
                    showPrivateOriginal ? 'bg-emerald-500 text-slate-950' : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  Private Unwatermarked (Admin Record Only)
                </button>
              </div>
            </div>

            <div className="aspect-[4/3] max-h-[380px] rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 relative flex items-center justify-center p-2">
              <ProtectedImage
                src={previewCert.imageUrl}
                alt={previewCert.studentName}
                watermarkText="03421189593"
                isPrivateOriginal={showPrivateOriginal}
                objectFit="contain"
                className="w-full h-full rounded-xl"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
