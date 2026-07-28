import React, { useState } from 'react';
import { 
  FileText, 
  Upload, 
  Download, 
  Eye, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  Filter, 
  X,
  FileCheck,
  ShieldCheck
} from 'lucide-react';
import { initialDocuments } from '../mockData/seedData';

export default function Documents() {
  const [documents, setDocuments] = useState(initialDocuments);
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [previewDoc, setPreviewDoc] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    category: 'Certificates',
    studentName: 'Alexander Schmidt',
    file: null
  });

  const categories = ['All', 'Certificates', 'ID Proofs', 'Receipts', 'Syllabus'];

  const filteredDocs = documents.filter(doc => {
    const matchesCategory = filterCategory === 'All' || doc.category === filterCategory;
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          doc.studentName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSimulateUpload = (e) => {
    e.preventDefault();
    setIsUploading(true);

    setTimeout(() => {
      const newDoc = {
        id: `doc-00${documents.length + 1}`,
        title: uploadForm.title || 'Uploaded_Student_Document.pdf',
        category: uploadForm.category,
        studentName: uploadForm.studentName,
        studentId: 'std-999',
        uploadedDate: new Date().toISOString().split('T')[0],
        fileSize: '2.1 MB',
        fileType: 'PDF',
        ocrData: {
          extractedName: uploadForm.studentName,
          issueDate: new Date().toLocaleDateString('de-DE'),
          summary: `AI OCR Extraction complete for ${uploadForm.category}. High accuracy confidence (99.2%).`
        }
      };

      setDocuments([newDoc, ...documents]);
      setIsUploading(false);
      setUploadForm({ title: '', category: 'Certificates', studentName: 'Alexander Schmidt', file: null });
    }, 1500);
  };

  const handleDownload = (doc) => {
    const text = `GERMAN LANGUAGE SCHOOL DOCUMENT VAULT EXPORT\n\nTitle: ${doc.title}\nCategory: ${doc.category}\nStudent: ${doc.studentName}\nUploaded Date: ${doc.uploadedDate}\n\nOCR AUTOMATED SUMMARY:\n` + JSON.stringify(doc.ocrData, null, 2);
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = doc.title;
    a.click();
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-amber-400" />
            <span>Document Vault & OCR Parser</span>
          </h2>
          <p className="text-xs text-slate-400">
            Upload, categorize, preview, and auto-extract text data from student certificates, passports, and receipts.
          </p>
        </div>

        {/* Upload Form Trigger */}
        <button
          onClick={() => setIsUploading(!isUploading)}
          className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs shadow-gold-glow flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          <span>Upload & Parse Document</span>
        </button>
      </div>

      {/* Upload & OCR Panel Simulation */}
      {isUploading && (
        <div className="bg-slate-900 border border-amber-500/40 rounded-2xl p-6 shadow-2xl space-y-4 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Simulated Document OCR Analysis Engine</span>
            </h3>
            <button onClick={() => setIsUploading(false)} className="text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSimulateUpload} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Document Title</label>
              <input
                type="text"
                required
                placeholder="Goethe_B2_Certificate_Tariq.pdf"
                value={uploadForm.title}
                onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
              <select
                value={uploadForm.category}
                onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="Certificates">Certificates</option>
                <option value="ID Proofs">ID Proofs / Passports</option>
                <option value="Receipts">Payment Receipts</option>
                <option value="Syllabus">Course Syllabus</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Student Name</label>
              <input
                type="text"
                required
                placeholder="Student Name"
                value={uploadForm.studentName}
                onChange={(e) => setUploadForm({ ...uploadForm, studentName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="md:col-span-3">
              <button
                type="submit"
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow transition flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Process File with AI OCR Engine</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search documents by title or student name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                filterCategory === cat
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-bold text-[10px]">
              <tr>
                <th className="p-4">Document Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Student Name</th>
                <th className="p-4">Uploaded Date</th>
                <th className="p-4">File Size</th>
                <th className="p-4">OCR Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-950/60 transition">
                  <td className="p-4 font-bold text-white flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="truncate max-w-[200px]">{doc.title}</span>
                  </td>
                  <td className="p-4">
                    <span className="px-2.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] font-bold text-amber-400">
                      {doc.category}
                    </span>
                  </td>
                  <td className="p-4 font-medium text-slate-200">{doc.studentName}</td>
                  <td className="p-4 text-slate-400">{doc.uploadedDate}</td>
                  <td className="p-4 text-slate-400">{doc.fileSize}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Extracted</span>
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => setPreviewDoc(doc)}
                      className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-400 transition"
                      title="Preview OCR Data"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDownload(doc)}
                      className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-white transition"
                      title="Download Document"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* OCR Analysis Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/40 rounded-3xl max-w-2xl w-full p-6 relative overflow-hidden shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-bold text-white">OCR Data Analysis Summary</h3>
              </div>
              <button onClick={() => setPreviewDoc(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>File Name:</span>
                <span className="text-white font-bold">{previewDoc.title}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Category:</span>
                <span className="text-amber-400 font-bold">{previewDoc.category}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Student Owner:</span>
                <span className="text-white font-bold">{previewDoc.studentName}</span>
              </div>
            </div>

            {/* Extracted JSON Details */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Automated OCR Field Extraction:</h4>
              <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono text-emerald-400 overflow-x-auto">
                {JSON.stringify(previewDoc.ocrData, null, 2)}
              </pre>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => handleDownload(previewDoc)}
                className="px-4 py-2 bg-amber-500 text-slate-950 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow"
              >
                <Download className="w-4 h-4" />
                <span>Download Report PDF</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
