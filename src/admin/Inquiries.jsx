import React, { useState, useEffect } from 'react';
import { MessageSquare, CheckCircle2, Clock, Mail, Phone, RefreshCw, Trash2, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function Inquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      setInquiries(data);
    }
    setLoading(false);
  };

  const filteredInquiries = filter === 'All' 
    ? inquiries 
    : inquiries.filter(i => i.status === filter);

  const handleStatusChange = async (id, newStatus) => {
    const { data, error } = await supabase.from('inquiries').update({ status: newStatus }).eq('id', id).select().single();
    if (!error && data) {
      setInquiries(inquiries.map(i => i.id === id ? data : i));
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this inquiry?')) {
      const { error } = await supabase.from('inquiries').delete().eq('id', id);
      if (!error) {
        setInquiries(inquiries.filter(i => i.id !== id));
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-amber-400" />
            <span>Lead & Contact Inquiries</span>
          </h2>
          <p className="text-xs text-slate-400">Track and respond to incoming website form submissions.</p>
        </div>

        <div className="flex gap-2 flex-wrap">
          {['All', 'New Lead', 'In Progress', 'Resolved'].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                filter === st ? 'bg-amber-500 text-slate-950 shadow' : 'bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-amber-500 animate-spin" /></div>
      ) : (
        <div className="space-y-4">
          {filteredInquiries.length === 0 ? (
             <div className="text-center text-slate-400 py-12">No inquiries found for this filter.</div>
          ) : filteredInquiries.map((inq) => (
            <div key={inq.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3 relative group shadow-xl">
              <button 
                onClick={() => handleDelete(inq.id)}
                className="absolute top-4 right-4 p-1.5 bg-slate-800/80 rounded text-slate-400 hover:text-red-400 hover:bg-slate-800 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              
              <div className="flex items-center justify-between pr-10">
                <div>
                  <span className="px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/30">
                    {inq.course_interest}
                  </span>
                  <h3 className="text-base font-bold text-white mt-1">{inq.name}</h3>
                </div>

                <select
                  value={inq.status}
                  onChange={(e) => handleStatusChange(inq.id, e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1 text-xs text-amber-400 font-bold focus:outline-none focus:border-amber-500"
                >
                  <option value="New Lead">New Lead</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

              <p className="text-xs text-slate-300 bg-slate-950 p-3.5 rounded-xl border border-slate-800 leading-relaxed whitespace-pre-wrap">
                "{inq.message}"
              </p>

              <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80 gap-2">
                <div className="flex gap-4">
                  <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-amber-400" /> {inq.email}</span>
                  <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-amber-400" /> {inq.phone}</span>
                </div>
                <span className="text-[11px] text-slate-500">{new Date(inq.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
