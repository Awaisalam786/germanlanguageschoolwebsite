import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabaseClient';
import { 
  MessageSquarePlus, 
  CheckCircle, 
  XCircle, 
  Clock, 
  RotateCcw, 
  Search, 
  Filter, 
  Edit3, 
  Save, 
  X, 
  Loader2, 
  AlertCircle, 
  Database,
  ArrowRight,
  User,
  BookOpen
} from 'lucide-react';

export default function VocabSuggestionsManager() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [pendingMigration, setPendingMigration] = useState(false);

  // Filters
  const [activeTab, setActiveTab] = useState('pending'); // 'pending', 'approved', 'rejected', 'all'
  const [selectedLevel, setSelectedLevel] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Inline editing state: suggestionId -> edited text
  const [editingId, setEditingId] = useState(null);
  const [editedSynonym, setEditedSynonym] = useState('');

  // Rejection modal / inline state
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Action processing state
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchSuggestions();
  }, [activeTab]);

  const getAuthToken = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
  };

  const fetchSuggestions = async () => {
    setLoading(true);
    setError('');
    try {
      const token = await getAuthToken();
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`/api/vocab-suggestions?status=${activeTab}`, {
        headers,
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (data.pending_migration) {
          setPendingMigration(true);
          setSuggestions([]);
          return;
        }
        throw new Error(data.error || 'Failed to load vocabulary suggestions.');
      }

      if (data.pending_migration) {
        setPendingMigration(true);
      } else {
        setPendingMigration(false);
      }

      setSuggestions(data.suggestions || []);
    } catch (err) {
      console.error('[VocabSuggestionsManager] Fetch error:', err);
      setError(err.message || 'Error fetching suggestions.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (suggestion) => {
    setProcessingId(suggestion.id);
    setError('');
    setSuccess('');

    try {
      const token = await getAuthToken();
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const finalSynonym = editingId === suggestion.id ? editedSynonym.trim() : suggestion.suggested_synonym;

      const res = await fetch('/api/vocab-suggestions/action', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          action: 'approve',
          suggestion_id: suggestion.id,
          edited_synonym: finalSynonym,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || 'Failed to approve suggestion.');
      }

      setSuccess(data.message || 'Suggestion approved and integrated successfully!');
      setEditingId(null);
      setEditedSynonym('');

      // Refresh list
      fetchSuggestions();
    } catch (err) {
      setError(err.message || 'Error processing approval.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (suggestionId) => {
    setProcessingId(suggestionId);
    setError('');
    setSuccess('');

    try {
      const token = await getAuthToken();
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/vocab-suggestions/action', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          action: 'reject',
          suggestion_id: suggestionId,
          rejection_reason: rejectionReason.trim() || null,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || 'Failed to reject suggestion.');
      }

      setSuccess('Suggestion marked as rejected.');
      setRejectingId(null);
      setRejectionReason('');

      // Refresh list
      fetchSuggestions();
    } catch (err) {
      setError(err.message || 'Error processing rejection.');
    } finally {
      setProcessingId(null);
    }
  };

  const startEditing = (suggestion) => {
    setEditingId(suggestion.id);
    setEditedSynonym(suggestion.suggested_synonym);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditedSynonym('');
  };

  // Filtered view
  const filteredSuggestions = useMemo(() => {
    return suggestions.filter(s => {
      const matchesLevel = selectedLevel === 'ALL' || s.level === selectedLevel;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        s.word_german?.toLowerCase().includes(q) ||
        s.word_english?.toLowerCase().includes(q) ||
        s.suggested_synonym?.toLowerCase().includes(q) ||
        s.submitted_by_name?.toLowerCase().includes(q);
      return matchesLevel && matchesSearch;
    });
  }, [suggestions, selectedLevel, searchQuery]);

  const pendingCount = suggestions.filter(s => s.status === 'pending').length;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <MessageSquarePlus className="w-6 h-6 text-amber-400" />
              Vocabulary Suggestions Queue
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Admin Review
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Review student-submitted synonyms and corrections. Approved synonyms are automatically integrated into official chapter vocabulary.
          </p>
        </div>

        <button
          onClick={fetchSuggestions}
          disabled={loading}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-2 transition self-start sm:self-auto border border-slate-700"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Queue
        </button>
      </div>

      {/* Migration Notice Banner */}
      {pendingMigration && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-start gap-3 text-amber-300">
          <Database className="w-5 h-5 shrink-0 mt-0.5 text-amber-400" />
          <div className="text-xs space-y-1">
            <p className="font-bold">Database Setup Notice: vocab_suggestions Table Pending</p>
            <p className="text-amber-200/80">
              The <code className="bg-slate-900 px-1.5 py-0.5 rounded text-amber-300 font-mono">vocab_suggestions</code> table does not exist in your Supabase database yet.
              To enable student suggestions and admin approvals, run the SQL script found in:
              <br />
              <code className="bg-slate-900 px-1.5 py-0.5 rounded text-white font-mono mt-1 inline-block">supabase/vocab_suggestions_schema.sql</code>
            </p>
          </div>
        </div>
      )}

      {/* Error / Success Alerts */}
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-2 text-red-400 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}
      {success && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-start gap-2 text-emerald-400 text-xs">
          <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <p>{success}</p>
        </div>
      )}

      {/* Filters Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {[
            { id: 'pending', label: 'Pending', count: activeTab === 'pending' ? suggestions.length : null },
            { id: 'approved', label: 'Approved' },
            { id: 'rejected', label: 'Rejected' },
            { id: 'all', label: 'All Submissions' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-amber-400 text-slate-950 shadow'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span>{tab.label}</span>
              {tab.id === 'pending' && suggestions.length > 0 && activeTab === 'pending' && (
                <span className="bg-slate-950/20 px-1.5 py-0.2 rounded-full text-[10px] font-bold">
                  {suggestions.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Level and Search */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Level Filter */}
          <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-xl px-2 py-1">
            <span className="text-[11px] text-slate-500 font-semibold px-1">Level:</span>
            {['ALL', 'A1', 'A2', 'B1', 'B2'].map(lvl => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`px-2 py-0.5 rounded-lg text-xs font-bold transition ${
                  selectedLevel === lvl
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative flex-1 md:w-60">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search words, synonyms..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>
      </div>

      {/* Main List */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Loading suggestions...</p>
        </div>
      ) : filteredSuggestions.length === 0 ? (
        <div className="py-16 text-center bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
          <CheckCircle className="w-10 h-10 text-slate-600 mx-auto" />
          <p className="text-sm font-semibold text-slate-300">No suggestions in this view</p>
          <p className="text-xs text-slate-500">
            {activeTab === 'pending'
              ? 'All student suggestions have been reviewed. Excellent!'
              : 'Try changing your status or level filter.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredSuggestions.map((suggestion) => {
            const isProcessing = processingId === suggestion.id;
            const isEditing = editingId === suggestion.id;
            const isRejecting = rejectingId === suggestion.id;
            const isPending = suggestion.status === 'pending';
            const isApproved = suggestion.status === 'approved';
            const isRejected = suggestion.status === 'rejected';

            return (
              <div
                key={suggestion.id}
                className={`bg-slate-900 border rounded-2xl p-5 transition-all shadow-sm ${
                  isPending
                    ? 'border-slate-800 hover:border-slate-700'
                    : isApproved
                    ? 'border-emerald-500/20 bg-emerald-500/[0.02]'
                    : 'border-rose-500/20 bg-rose-500/[0.02]'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left Column: Word details */}
                  <div className="space-y-2 flex-1">
                    {/* Badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        Level {suggestion.level} • Chapter {suggestion.chapter_number}
                      </span>
                      <span className={`px-2 py-0.5 rounded-lg text-xs font-semibold ${
                        suggestion.target_language === 'german'
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        Target: {suggestion.target_language === 'german' ? 'German Synonym' : 'English Synonym'}
                      </span>
                      <span className={`px-2 py-0.5 rounded-lg text-[11px] font-bold uppercase ${
                        isPending
                          ? 'bg-amber-400/10 text-amber-300 border border-amber-400/20'
                          : isApproved
                          ? 'bg-emerald-400/10 text-emerald-300 border border-emerald-400/20'
                          : 'bg-rose-400/10 text-rose-300 border border-rose-400/20'
                      }`}>
                        {suggestion.status}
                      </span>
                    </div>

                    {/* Words Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1">
                      <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block">German Primary</span>
                        <span className="text-sm font-bold text-white">{suggestion.word_german}</span>
                      </div>
                      <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block">English Primary</span>
                        <span className="text-sm font-bold text-slate-200">{suggestion.word_english}</span>
                      </div>
                      <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block">Learner's Test Answer</span>
                        <span className="text-sm text-slate-300 italic">{suggestion.user_answer || '(none)'}</span>
                      </div>
                    </div>

                    {/* Proposed Synonym display / edit */}
                    <div className="mt-2 p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-amber-300">
                          Proposed Synonym to Add:
                        </span>
                        {isPending && !isEditing && (
                          <button
                            type="button"
                            onClick={() => startEditing(suggestion)}
                            className="text-xs text-slate-400 hover:text-amber-400 flex items-center gap-1 transition"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Edit before approval</span>
                          </button>
                        )}
                      </div>

                      {isEditing ? (
                        <div className="mt-2 flex items-center gap-2">
                          <input
                            type="text"
                            value={editedSynonym}
                            onChange={(e) => setEditedSynonym(e.target.value)}
                            className="flex-1 bg-slate-950 border border-amber-500/40 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400 font-medium"
                            placeholder="Edit synonym before approving..."
                          />
                          <button
                            type="button"
                            onClick={cancelEditing}
                            className="p-1.5 text-slate-400 hover:text-white"
                            title="Cancel edit"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <p className="text-base font-extrabold text-white mt-1">
                          "{suggestion.suggested_synonym}"
                        </p>
                      )}
                    </div>

                    {/* Submitter & Timestamp Info */}
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-1">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>Submitted by: <strong className="text-slate-400">{suggestion.submitted_by_name || 'Anonymous'}</strong> ({suggestion.user_type || 'free'})</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(suggestion.created_at).toLocaleString()}</span>
                      </span>
                      {suggestion.reviewed_by && (
                        <>
                          <span>•</span>
                          <span className="text-slate-400">
                            Reviewed by {suggestion.reviewed_by} on {new Date(suggestion.reviewed_at).toLocaleDateString()}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Rejection Reason if present */}
                    {suggestion.rejection_reason && (
                      <p className="text-xs text-rose-400/90 bg-rose-500/10 p-2 rounded-lg border border-rose-500/20">
                        Reason for rejection: {suggestion.rejection_reason}
                      </p>
                    )}
                  </div>

                  {/* Right Column: Actions */}
                  <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0 lg:min-w-44 justify-center">
                    {isPending ? (
                      <>
                        {isRejecting ? (
                          <div className="space-y-2 p-3 bg-slate-950 rounded-xl border border-rose-500/30">
                            <span className="text-xs text-rose-300 font-semibold block">Optional rejection reason:</span>
                            <input
                              type="text"
                              value={rejectionReason}
                              onChange={(e) => setRejectionReason(e.target.value)}
                              placeholder="e.g. Spelling error or false synonym"
                              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none"
                            />
                            <div className="flex items-center gap-2 pt-1">
                              <button
                                type="button"
                                disabled={isProcessing}
                                onClick={() => handleReject(suggestion.id)}
                                className="flex-1 px-2.5 py-1 bg-rose-500 hover:bg-rose-400 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition"
                              >
                                {isProcessing ? 'Rejecting...' : 'Confirm'}
                              </button>
                              <button
                                type="button"
                                onClick={() => { setRejectingId(null); setRejectionReason(''); }}
                                className="px-2 py-1 text-slate-400 hover:text-white text-xs"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <button
                              type="button"
                              disabled={isProcessing}
                              onClick={() => handleApprove(suggestion)}
                              className="w-full px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition shadow"
                            >
                              {isProcessing ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <>
                                  <CheckCircle className="w-3.5 h-3.5" />
                                  <span>Approve & Add to Vocab</span>
                                </>
                              )}
                            </button>

                            <button
                              type="button"
                              disabled={isProcessing}
                              onClick={() => setRejectingId(suggestion.id)}
                              className="w-full px-4 py-2 bg-slate-800 hover:bg-rose-500/20 hover:text-rose-300 text-slate-400 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition border border-slate-700/80"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>
                          </>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-2">
                        {isApproved ? (
                          <div className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                            <CheckCircle className="w-4 h-4" />
                            <span>Integrated in Chapter</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1 text-xs font-bold text-rose-400 bg-rose-500/10 px-3 py-1.5 rounded-xl border border-rose-500/20">
                            <XCircle className="w-4 h-4" />
                            <span>Rejected</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
