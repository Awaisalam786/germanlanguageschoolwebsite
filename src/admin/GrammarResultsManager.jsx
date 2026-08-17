import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Loader2, Search, Filter, ChevronDown, ChevronUp, User, Key, CheckCircle, XCircle } from 'lucide-react';

export default function GrammarResultsManager() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [levelFilter, setLevelFilter] = useState('All');
  const [userTypeFilter, setUserTypeFilter] = useState('All'); // 'All', 'free', 'student'
  const [searchQuery, setSearchQuery] = useState('');
  
  // Expandable row state
  const [expandedRows, setExpandedRows] = useState(new Set());

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('grammar_attempts')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error(error);
      if (error.code === '42P01') {
        alert("Table 'grammar_attempts' does not exist. Please run the SQL schema script.");
      }
    } else {
      setResults(data || []);
    }
    setLoading(false);
  };

  const toggleRow = (id) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) newExpanded.delete(id);
    else newExpanded.add(id);
    setExpandedRows(newExpanded);
  };

  const filteredResults = results.filter(r => {
    if (levelFilter !== 'All' && r.level !== levelFilter) return false;
    if (userTypeFilter !== 'All' && r.user_type !== userTypeFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = r.name?.toLowerCase().includes(q);
      const matchEmail = r.email?.toLowerCase().includes(q);
      const matchCode = r.access_code_used?.toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchCode) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Grammar Results</h1>
          <p className="text-slate-400 text-sm mt-1">Detailed scores and question breakdowns from the Grammar Engine.</p>
        </div>
        <button onClick={fetchResults} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition text-sm">
          Refresh Data
        </button>
      </div>

      {/* Filters */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search name, email, code..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="bg-transparent border-none text-white text-sm focus:outline-none w-full"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500" />
          <select 
            value={levelFilter}
            onChange={e => setLevelFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
          >
            <option value="All">All Levels</option>
            <option value="A1">A1</option>
            <option value="A2">A2</option>
            <option value="B1">B1</option>
            <option value="B2">B2</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <select 
            value={userTypeFilter}
            onChange={e => setUserTypeFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
          >
            <option value="All">All User Types</option>
            <option value="free">Free Users</option>
            <option value="student">Internal Students</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-950 text-slate-400">
              <tr>
                <th className="px-6 py-4 font-semibold">User</th>
                <th className="px-6 py-4 font-semibold">Level & Chapters</th>
                <th className="px-6 py-4 font-semibold">Score</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <Loader2 className="w-8 h-8 text-amber-500 animate-spin mx-auto" />
                  </td>
                </tr>
              ) : filteredResults.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                    No results found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredResults.map(r => (
                  <React.Fragment key={r.id}>
                    <tr className="hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${r.user_type === 'student' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                            {r.user_type === 'student' ? <Key className="w-4 h-4" /> : <User className="w-4 h-4" />}
                          </div>
                          <div>
                            <p className="font-bold text-white">{r.name || 'Anonymous'}</p>
                            <p className="text-[10px] text-slate-400">
                              {r.user_type === 'student' ? `Code: ${r.access_code_used}` : r.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-emerald-400">{r.level}</p>
                        <p className="text-xs text-slate-400">Ch: {Array.isArray(r.chapters_selected) ? r.chapters_selected.join(', ') : (r.chapters_selected || 'N/A')}</p>
                      </td>

                      <td className="px-6 py-4">
                        <p className="font-bold text-white text-lg">{r.score || r.correct_count}/{r.total_questions}</p>
                        <p className={`text-xs font-bold ${r.percentage >= 70 ? 'text-emerald-400' : r.percentage >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                          {r.percentage}%
                        </p>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-400">
                        {new Date(r.created_at).toLocaleDateString()}<br/>
                        {new Date(r.created_at).toLocaleTimeString()}
                      </td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => toggleRow(r.id)}
                          className="flex items-center gap-1 text-xs text-amber-500 hover:text-amber-400"
                        >
                          {expandedRows.has(r.id) ? (
                            <><ChevronUp className="w-4 h-4" /> Hide Review</>
                          ) : (
                            <><ChevronDown className="w-4 h-4" /> View Review</>
                          )}
                        </button>
                      </td>
                    </tr>
                    
                    {/* Expanded Review Section */}
                    {expandedRows.has(r.id) && (
                      <tr>
                        <td colSpan="6" className="p-0 border-b border-slate-800 bg-slate-950">
                          <div className="p-6">
                            <h4 className="text-sm font-bold text-slate-300 mb-4 border-b border-slate-800 pb-2">Question-by-Question Breakdown</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {r.question_results && r.question_results.map((q, idx) => (
                                <div key={idx} className={`p-4 rounded-xl border ${q.isCorrect ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
                                  <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs text-slate-400 font-bold tracking-wider uppercase">{q.type || 'Exercise'}</span>
                                    {q.isCorrect ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
                                  </div>
                                  <p className="text-sm font-bold text-white mb-2">{q.question}</p>
                                  
                                  <div className="text-xs space-y-1 mb-3">
                                    <p className="text-slate-400">
                                      Your Answer: <span className={q.isCorrect ? 'text-emerald-400 font-medium' : 'text-red-400 font-medium line-through'}>
                                        {q.userAnswer || '(Skipped)'}
                                      </span>
                                    </p>
                                    {!q.isCorrect && (
                                      <p className="text-slate-400">
                                        Correct: <span className="text-emerald-400 font-medium">{q.correctAnswer}</span>
                                      </p>
                                    )}
                                  </div>

                                  {q.explanation && (
                                    <div className="mt-2 pt-2 border-t border-slate-800/50">
                                      <p className="text-[11px] text-slate-400">
                                        <span className="text-blue-400 font-semibold">Rule:</span> {q.explanation}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
