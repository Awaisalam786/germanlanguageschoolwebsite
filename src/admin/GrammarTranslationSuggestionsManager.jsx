import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabaseClient';
import {
  MessageSquarePlus,
  CheckCircle,
  XCircle,
  Clock,
  RotateCcw,
  Search,
  Edit3,
  X,
  Loader2,
  AlertCircle,
  Database,
  User,
  Layers,
  Sparkles,
  HelpCircle,
  FileText
} from 'lucide-react';

export default function GrammarTranslationSuggestionsManager() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [pendingMigration, setPendingMigration] = useState(false);

  // Filters
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'approved' | 'rejected' | 'all'
  const [selectedLevel, setSelectedLevel] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Inline editing state: suggestionId -> edited text
  const [editingId, setEditingId] = useState(null);
  const [editedAlternative, setEditedAlternative] = useState('');

  // Rejection modal / inline state
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Processing state
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

      const res = await fetch(`/api/admin/grammar-translation/suggestions?status=${activeTab}`, {
        headers,
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (data.pending_migration) {
          setPendingMigration(true);
          setSuggestions([]);
          return;
        }
        throw new Error(data.error || 'Failed to load grammar translation suggestions.');
      }

      if (data.pending_migration) {
        setPendingMigration(true);
      } else {
        setPendingMigration(false);
      }

      setSuggestions(data.suggestions || []);
    } catch (err) {
      console.error('[GrammarTranslationSuggestionsManager] Fetch error:', err);
      setError(err.message || 'Error fetching translation suggestions.');
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

      const payload = {
        action: 'approve',
        suggestion_id: suggestion.id,
      };

      if (editingId === suggestion.id && editedAlternative.trim()) {
        payload.edited_alternative = editedAlternative.trim();
      }

      const res = await fetch('/api/admin/grammar-translation/suggestions/action', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      const result = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(result.error || 'Failed to approve suggestion.');
      }

      setSuccess(result.message || 'Alternative translation approved and question updated successfully!');
      setEditingId(null);
      setEditedAlternative('');

      // Refresh list
      await fetchSuggestions();
    } catch (err) {
      console.error('[handleApprove] Error:', err);
      setError(err.message || 'Error approving suggestion.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (suggestion) => {
    setProcessingId(suggestion.id);
    setError('');
    setSuccess('');

    try {
      const token = await getAuthToken();
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const payload = {
        action: 'reject',
        suggestion_id: suggestion.id,
        rejection_reason: rejectionReason.trim() || null,
      };

      const res = await fetch('/api/admin/grammar-translation/suggestions/action', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      const result = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(result.error || 'Failed to reject suggestion.');
      }

      setSuccess('Suggestion marked as rejected.');
      setRejectingId(null);
      setRejectionReason('');

      // Refresh list
      await fetchSuggestions();
    } catch (err) {
      console.error('[handleReject] Error:', err);
      setError(err.message || 'Error rejecting suggestion.');
    } finally {
      setProcessingId(null);
    }
  };

  const startEditing = (suggestion) => {
    setEditingId(suggestion.id);
    setEditedAlternative(suggestion.suggested_alternative || '');
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditedAlternative('');
  };

  // Filtered list
  const filteredSuggestions = useMemo(() => {
    return suggestions.filter((s) => {
      if (selectedLevel !== 'ALL' && s.level !== selectedLevel) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchEnglish = (s.english_sentence || '').toLowerCase().includes(query);
        const matchGerman = (s.official_german || '').toLowerCase().includes(query);
        const matchSuggested = (s.suggested_alternative || '').toLowerCase().includes(query);
        const matchTopic = (s.topic_title || '').toLowerCase().includes(query);
        const matchUser = (s.submitted_by_name || '').toLowerCase().includes(query);
        const matchNotes = (s.notes || '').toLowerCase().includes(query);
        if (!matchEnglish && !matchGerman && !matchSuggested && !matchTopic && !matchUser && !matchNotes) {
          return false;
        }
      }
      return true;
    });
  }, [suggestions, selectedLevel, searchQuery]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <MessageSquarePlus className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                Grammar Translation Suggestions
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Review Queue
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                Review, edit, and approve alternative German translations submitted by students.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={fetchSuggestions}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition border border-slate-700 disabled:opacity-50 self-start sm:self-auto"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Migration Alert Banner */}
      {pendingMigration && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-start gap-3 text-amber-200">
          <Database className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <h4 className="font-bold text-amber-300">Pending Database Schema Migration</h4>
            <p>
              The table <code className="bg-slate-950/60 px-1.5 py-0.5 rounded text-amber-300 font-mono">grammar_translation_suggestions</code> has not yet been executed in Supabase.
            </p>
            <p className="text-slate-400">
              Please apply the SQL migration located at <code className="text-slate-300 font-mono">supabase/grammar_translation_schema.sql</code> via the Supabase SQL Editor.
            </p>
          </div>
        </div>
      )}

      {/* Error & Success Messages */}
      {error && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-2 text-rose-400 text-xs">
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
            { id: 'pending', label: 'Pending Review', count: activeTab === 'pending' ? suggestions.length : null },
            { id: 'approved', label: 'Approved' },
            { id: 'rejected', label: 'Rejected' },
            { id: 'all', label: 'All Submissions' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span>{tab.label}</span>
              {tab.id === 'pending' && suggestions.length > 0 && activeTab === 'pending' && (
                <span className="bg-slate-950/30 px-1.5 py-0.2 rounded-full text-[10px] font-bold">
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
            {['ALL', 'A1', 'A2', 'B1', 'B2'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`px-2 py-0.5 rounded-lg text-xs font-bold transition ${
                  selectedLevel === lvl
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
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
              placeholder="Search sentence, translation..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
            />
          </div>
        </div>
      </div>

      {/* Main List */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Loading translation suggestions...</p>
        </div>
      ) : filteredSuggestions.length === 0 ? (
        <div className="py-16 text-center bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
          <CheckCircle className="w-10 h-10 text-slate-600 mx-auto" />
          <p className="text-sm font-semibold text-slate-300">No suggestions in this view</p>
          <p className="text-xs text-slate-500">
            {activeTab === 'pending'
              ? 'All student translation suggestions have been reviewed. Excellent!'
              : 'Try changing your status or level filter.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
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
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
                  {/* Left Column: Question Details & Sentences */}
                  <div className="space-y-3 flex-1">
                    {/* Header Badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                        <Layers className="w-3 h-3" />
                        <span>{suggestion.level} • {suggestion.topic_title || 'Topic'}</span>
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-lg text-[11px] font-bold uppercase ${
                          isPending
                            ? 'bg-amber-400/10 text-amber-300 border border-amber-400/20'
                            : isApproved
                            ? 'bg-emerald-400/10 text-emerald-300 border border-emerald-400/20'
                            : 'bg-rose-400/10 text-rose-300 border border-rose-400/20'
                        }`}
                      >
                        {suggestion.status}
                      </span>
                    </div>

                    {/* Sentence Context Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                      {/* English Prompt */}
                      <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block mb-1">
                          Original English Sentence
                        </span>
                        <p className="text-sm font-semibold text-slate-200">
                          {suggestion.english_sentence}
                        </p>
                      </div>

                      {/* Official German Answer */}
                      <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold block mb-1">
                          Official German Target
                        </span>
                        <p className="text-sm font-semibold text-white">
                          {suggestion.official_german}
                        </p>
                      </div>
                    </div>

                    {/* Student's Test Typed Answer (if different or recorded) */}
                    {suggestion.user_typed_answer && (
                      <div className="bg-slate-950/50 px-3 py-2 rounded-xl border border-slate-800/80 text-xs text-slate-400">
                        <span className="font-semibold text-slate-500 mr-1.5">Student's Typed Answer:</span>
                        <span className="italic text-slate-300">"{suggestion.user_typed_answer}"</span>
                      </div>
                    )}

                    {/* Student Notes / Optional Comments */}
                    {suggestion.notes && (
                      <div className="bg-slate-950/50 px-3 py-2 rounded-xl border border-slate-800/80 text-xs text-slate-400 flex items-start gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-slate-400 mr-1.5">Student Note:</span>
                          <span className="text-slate-300">{suggestion.notes}</span>
                        </div>
                      </div>
                    )}

                    {/* Proposed Alternative Translation Display / Edit */}
                    <div className="p-3.5 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Proposed Alternative Translation to Accept:</span>
                        </span>
                        {isPending && !isEditing && (
                          <button
                            type="button"
                            onClick={() => startEditing(suggestion)}
                            className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1 transition"
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
                            value={editedAlternative}
                            onChange={(e) => setEditedAlternative(e.target.value)}
                            className="flex-1 bg-slate-950 border border-emerald-500/40 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-400 font-medium"
                            placeholder="Edit German translation before approving..."
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
                          "{suggestion.suggested_alternative}"
                        </p>
                      )}
                    </div>

                    {/* Rejection Note (if rejected) */}
                    {isRejected && suggestion.rejection_reason && (
                      <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-300">
                        <strong className="text-rose-400">Rejection Reason:</strong> {suggestion.rejection_reason}
                      </div>
                    )}

                    {/* Submitter & Timestamp Info */}
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-1">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>Submitted by: <strong className="text-slate-400">{suggestion.submitted_by_name || 'Learner'}</strong> ({suggestion.user_type || 'free'})</span>
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
                  </div>

                  {/* Right Column: Action Buttons */}
                  <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0 lg:w-48 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                    {/* Approve Button */}
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() => handleApprove(suggestion)}
                      className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm ${
                        isApproved
                          ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500 hover:text-slate-950'
                          : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 disabled:opacity-50'
                      }`}
                    >
                      {isProcessing ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <>
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>{isEditing ? 'Save & Approve' : isApproved ? 'Re-Approve' : 'Approve Alternative'}</span>
                        </>
                      )}
                    </button>

                    {/* Reject Button / Prompt */}
                    {isRejecting ? (
                      <div className="space-y-2 p-2.5 bg-slate-950 border border-rose-500/30 rounded-xl">
                        <input
                          type="text"
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          placeholder="Optional reason..."
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-[11px] text-white focus:outline-none focus:border-rose-400"
                        />
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            disabled={isProcessing}
                            onClick={() => handleReject(suggestion)}
                            className="flex-1 py-1 bg-rose-500 hover:bg-rose-400 text-white font-bold text-[11px] rounded-lg transition"
                          >
                            Confirm
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setRejectingId(null);
                              setRejectionReason('');
                            }}
                            className="px-2 py-1 bg-slate-800 text-slate-400 hover:text-white text-[11px] rounded-lg"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        disabled={isProcessing}
                        onClick={() => {
                          setRejectingId(suggestion.id);
                          setRejectionReason('');
                        }}
                        className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border ${
                          isRejected
                            ? 'bg-slate-800 text-rose-400 border-rose-500/30 hover:bg-rose-500 hover:text-white'
                            : 'bg-slate-800/80 hover:bg-rose-500/20 text-rose-400 border-slate-800 hover:border-rose-500/40 disabled:opacity-50'
                        }`}
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>{isRejected ? 'Re-Reject' : 'Reject'}</span>
                      </button>
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
