import React, { useState } from 'react';
import { Award, Plus, Eye, Trash2, ShieldCheck, Lock, Upload, Sparkles, CheckCircle2 } from 'lucide-react';
import { initialCertificates } from '../mockData/seedData';
import ProtectedImage from '../components/ProtectedImage';

export default function CertificateManager() {
  const [certificates, setCertificates] = useState(initialCertificates);
  const [previewCert, setPreviewCert] = useState(null);
  const [showPrivateOriginal, setShowPrivateOriginal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadNotice, setUploadNotice] = useState('');

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

  const toggleFeatured = (id) => {
    setCertificates(certificates.map(c => c.id === id ? { ...c, verified: !c.verified } : c));
  };

  const handleDelete = (id) => {
    if (confirm('Remove certificate from showcase?')) {
      setCertificates(certificates.filter(c => c.id !== id));
    }
  };

  const handleQuickUploadSubmit = (e) => {
    e.preventDefault();
    if (!newCert.studentName) {
      alert('Please enter student name');
      return;
    }

    const createdCert = {
      id: `cert-${Date.now()}`,
      studentName: newCert.studentName,
      congratsTitle: `Congratulations to ${newCert.studentName}!`,
      examBody: newCert.examBody,
      city: newCert.city,
      score: newCert.score,
      date: newCert.date || 'July 2026',
      quote: newCert.quote,
      imageUrl: newCert.imageUrl,
      verified: true
    };

    setCertificates([createdCert, ...certificates]);
    setShowUploadModal(false);
    setUploadNotice(`Certificate for ${newCert.studentName} uploaded and watermarked!`);
    setTimeout(() => setUploadNotice(''), 4000);

    // Reset form
    setNewCert({
      studentName: '',
      examBody: 'Goethe-Zertifikat B1',
      city: '',
      score: '',
      date: '',
      quote: '',
      imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80'
    });
  };

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
            Upload raw landscape certificates in under 30 seconds. The system automatically applies the diagonal watermark (<span className="text-amber-400 font-bold">0342 1189593</span>) for public view.
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
                <label className="text-slate-300 font-bold">Certificate Image URL / Raw File</label>
                <input
                  type="text"
                  value={newCert.imageUrl}
                  onChange={(e) => setNewCert({ ...newCert, imageUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-100 focus:outline-none focus:border-amber-500"
                />
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
              <div className="border-t border-slate-800 pt-3 space-y-3">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Optional Details (Leave blank if not needed)</span>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 font-medium">City / Location</label>
                    <input
                      type="text"
                      value={newCert.city}
                      onChange={(e) => setNewCert({ ...newCert, city: e.target.value })}
                      placeholder="e.g. Lahore, Pakistan"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 font-medium">Score Achieved</label>
                    <input
                      type="text"
                      value={newCert.score}
                      onChange={(e) => setNewCert({ ...newCert, score: e.target.value })}
                      placeholder="e.g. 94 / 100 (Sehr Gut)"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 font-medium">Student Testimonial Quote</label>
                  <input
                    type="text"
                    value={newCert.quote}
                    onChange={(e) => setNewCert({ ...newCert, quote: e.target.value })}
                    placeholder="e.g. Cleared Goethe B2 on first attempt via live online classes."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-100"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-950 text-slate-400 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold shadow-lg"
                >
                  Save & Apply Auto-Watermark
                </button>
              </div>

            </form>
          </div>
        </div>
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
                  Public Watermarked (0342 1189593)
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
                watermarkText="0342 1189593"
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
