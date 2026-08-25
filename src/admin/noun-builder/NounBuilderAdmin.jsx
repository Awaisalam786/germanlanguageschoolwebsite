"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Upload, Plus, Search, FileText, CheckCircle, XCircle, Trash2, Edit2, Info, Loader2 } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const NounBuilderAdmin = () => {
  const [nouns, setNouns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Bulk import states
  const [csvData, setCsvData] = useState('');
  const [previewData, setPreviewData] = useState(null);
  
  const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1'];

  useEffect(() => {
    fetchNouns();
  }, []);

  const fetchNouns = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('noun_builder_nouns')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (!error && data) {
      setNouns(data);
    }
    setLoading(false);
  };

  const filteredNouns = useMemo(() => {
    let filtered = nouns;
    if (activeTab !== 'all' && activeTab !== 'bulk_import') {
      filtered = filtered.filter(n => n.cefr_level.toLowerCase() === activeTab.toLowerCase());
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(n => 
        n.german_noun.toLowerCase().includes(q) || 
        n.english_meaning.toLowerCase().includes(q)
      );
    }
    return filtered;
  }, [activeTab, searchQuery, nouns]);

  const handleCsvProcess = () => {
    if (!csvData.trim()) return;
    
    // Very basic CSV parser for demo purposes
    const lines = csvData.split('\n').filter(line => line.trim());
    if (lines.length === 0) return;
    
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    const parsed = lines.slice(1).map((line, idx) => {
      // Handle simple CSV without escaped commas for now
      const values = line.split(',');
      const record = {};
      headers.forEach((h, i) => {
        record[h] = values[i] ? values[i].trim() : '';
      });
      
      // Validation logic
      const errors = [];
      if (!record.german_noun) errors.push("Missing German Noun");
      if (!['der', 'die', 'das'].includes(record.article?.toLowerCase())) errors.push("Invalid Article");
      if (!record.english_meaning) errors.push("Missing English Meaning");
      if (!LEVELS.includes(record.cefr_level?.toUpperCase())) errors.push("Invalid CEFR Level");
      
      // Duplicate detection against current db state
      const isDuplicate = nouns.some(n => n.german_noun.toLowerCase() === record.german_noun?.toLowerCase());
      
      return {
        _temp_id: `import_${idx}`,
        ...record,
        article: record.article?.toLowerCase(),
        cefr_level: record.cefr_level?.toUpperCase(),
        status: 'active',
        errors,
        isDuplicate,
        isValid: errors.length === 0 && !isDuplicate
      };
    });
    
    setPreviewData(parsed);
  };

  const handleImportValidRecords = async () => {
    if (!previewData) return;
    
    const validRecords = previewData.filter(d => d.isValid).map(d => {
      const { _temp_id, errors, isDuplicate, isValid, ...dbRecord } = d;
      return dbRecord;
    });

    if (validRecords.length === 0) {
      alert("No valid records to import.");
      return;
    }

    setImporting(true);

    // Chunking to prevent large payload timeouts
    const chunkSize = 100;
    let successCount = 0;
    
    for (let i = 0; i < validRecords.length; i += chunkSize) {
      const chunk = validRecords.slice(i, i + chunkSize);
      const { error } = await supabase.from('noun_builder_nouns').insert(chunk);
      if (error) {
        console.error("Error inserting chunk:", error);
        alert(`Import interrupted. Error: ${error.message}`);
        break;
      }
      successCount += chunk.length;
    }

    setImporting(false);
    setPreviewData(null);
    setCsvData('');
    setActiveTab('all');
    fetchNouns(); // Refresh list
    alert(`Successfully imported ${successCount} nouns.`);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this noun?')) return;
    const { error } = await supabase.from('noun_builder_nouns').delete().eq('id', id);
    if (!error) {
      setNouns(nouns.filter(n => n.id !== id));
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 font-sans text-slate-100">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Noun Builder Admin</h1>
          <p className="text-slate-400 mt-1">Manage modular vocabulary database independently.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setActiveTab('bulk_import')}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-xl font-bold transition"
          >
            <Upload className="w-4 h-4" /> Bulk Import
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-bold transition shadow-lg hover:shadow-amber-500/20">
            <Plus className="w-4 h-4" /> Add Noun
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-800 pb-4">
        <button 
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${activeTab === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
        >
          All Nouns
        </button>
        {LEVELS.map(lvl => (
          <button 
            key={lvl}
            onClick={() => setActiveTab(lvl)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${activeTab === lvl ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
          >
            {lvl}
          </button>
        ))}
        <button 
          onClick={() => setActiveTab('bulk_import')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${activeTab === 'bulk_import' ? 'bg-blue-500/10 text-blue-400' : 'text-slate-400 hover:text-blue-400 hover:bg-slate-800/50'}`}
        >
          Bulk Import Tool
        </button>
      </div>

      {/* Content Area */}
      {activeTab === 'bulk_import' ? (
        <div className="animate-fade-in space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-start gap-3 mb-4">
              <FileText className="w-6 h-6 text-blue-400" />
              <div>
                <h2 className="text-xl font-bold text-white">CSV Bulk Import</h2>
                <p className="text-sm text-slate-400 mt-1">Paste your CSV data below. Required columns: <code>german_noun, article, english_meaning, plural, example_sentence, english_translation, cefr_level, memory_tip, image_url</code></p>
              </div>
            </div>
            
            <textarea
              value={csvData}
              onChange={(e) => setCsvData(e.target.value)}
              placeholder="german_noun,article,english_meaning,plural,example_sentence,english_translation,cefr_level,memory_tip,image_url&#10;Tisch,der,table,Tische,Der Tisch ist groß.,The table is big.,A1,Think about the table you eat at,"
              className="w-full h-48 bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm font-mono text-slate-300 focus:outline-none focus:border-blue-500 mb-4 custom-scrollbar"
            />
            
            <button 
              onClick={handleCsvProcess}
              className="px-6 py-2.5 bg-blue-500 hover:bg-blue-400 text-white font-bold rounded-xl transition"
            >
              Preview & Validate Data
            </button>
          </div>

          {previewData && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 overflow-hidden flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Validation Results</h3>
                <div className="flex gap-4 text-sm font-semibold">
                  <span className="text-emerald-400">{previewData.filter(d => d.isValid).length} Valid</span>
                  <span className="text-amber-400">{previewData.filter(d => d.isDuplicate).length} Duplicates</span>
                  <span className="text-red-400">{previewData.filter(d => !d.isValid && !d.isDuplicate).length} Errors</span>
                </div>
              </div>

              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-xs font-bold">
                    <tr>
                      <th className="p-4 rounded-tl-lg">Status</th>
                      <th className="p-4">German</th>
                      <th className="p-4">Meaning</th>
                      <th className="p-4">Level</th>
                      <th className="p-4">Plural</th>
                      <th className="p-4 rounded-tr-lg">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {previewData.map((row) => (
                      <tr key={row._temp_id} className="hover:bg-slate-800/30 transition">
                        <td className="p-4">
                          {row.isValid ? (
                            <span className="flex items-center gap-1 text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded text-xs font-bold"><CheckCircle className="w-3 h-3"/> Ready</span>
                          ) : row.isDuplicate ? (
                            <span className="flex items-center gap-1 text-amber-400 bg-amber-400/10 px-2 py-1 rounded text-xs font-bold"><Info className="w-3 h-3"/> Duplicate</span>
                          ) : (
                            <span className="flex items-center gap-1 text-red-400 bg-red-400/10 px-2 py-1 rounded text-xs font-bold"><XCircle className="w-3 h-3"/> Error</span>
                          )}
                        </td>
                        <td className="p-4 font-semibold text-white">
                          <span className="text-slate-400 mr-1 text-xs uppercase">{row.article}</span> 
                          {row.german_noun}
                        </td>
                        <td className="p-4 text-slate-300">{row.english_meaning}</td>
                        <td className="p-4 text-amber-500 font-bold">{row.cefr_level}</td>
                        <td className="p-4 text-slate-400">{row.plural}</td>
                        <td className="p-4 text-red-400 text-xs">{row.errors?.join(', ')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button 
                  onClick={() => setPreviewData(null)}
                  className="px-5 py-2 text-sm font-bold text-slate-400 hover:text-white transition"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleImportValidRecords}
                  disabled={importing}
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg text-sm font-bold transition shadow-lg flex items-center gap-2"
                >
                  {importing ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {importing ? 'Importing...' : 'Import Valid Records'}
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="animate-fade-in bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col min-h-[400px]">
          {/* Search Bar */}
          <div className="p-4 border-b border-slate-800 bg-slate-950/50">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search nouns..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto custom-scrollbar flex-1">
            {loading ? (
              <div className="flex items-center justify-center h-full p-12">
                <Loader2 className="w-8 h-8 animate-spin text-slate-500" />
              </div>
            ) : (
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-950 text-slate-400 uppercase text-xs font-bold">
                  <tr>
                    <th className="p-4">German Noun</th>
                    <th className="p-4">English Meaning</th>
                    <th className="p-4">Level</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {filteredNouns.map(noun => (
                    <tr key={noun.id} className="hover:bg-slate-800/50 transition group">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-slate-800 overflow-hidden shrink-0 border border-slate-700">
                            {noun.image_url && <img src={noun.image_url} alt="" className="w-full h-full object-cover opacity-80" />}
                          </div>
                          <div>
                            <span className={`text-[10px] font-black uppercase px-1.5 py-0.5 rounded mr-2 ${
                              noun.article === 'der' ? 'bg-blue-500/20 text-blue-400' :
                              noun.article === 'die' ? 'bg-red-500/20 text-red-400' :
                              'bg-green-500/20 text-green-400'
                            }`}>
                              {noun.article}
                            </span>
                            <span className="font-bold text-white text-base">{noun.german_noun}</span>
                            <p className="text-xs text-slate-500 mt-0.5">{noun.plural}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-slate-300 font-medium">{noun.english_meaning}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-xs font-black px-2 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded">
                          {noun.cefr_level}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`text-xs font-bold px-2 py-1 rounded ${noun.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                          {noun.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition">
                          <button className="p-2 hover:bg-blue-500/10 hover:text-blue-400 text-slate-400 rounded-lg transition">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(noun.id)} className="p-2 hover:bg-red-500/10 hover:text-red-400 text-slate-400 rounded-lg transition">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredNouns.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-500">
                        No nouns found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default NounBuilderAdmin;
