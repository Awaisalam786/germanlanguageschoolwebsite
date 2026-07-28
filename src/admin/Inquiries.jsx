import React, { useState } from 'react';
import { MessageSquare, CheckCircle2, Clock, Mail, Phone, RefreshCw } from 'lucide-react';
import { initialInquiries } from '../mockData/seedData';

export default function Inquiries() {
  const [inquiries, setInquiries] = useState(initialInquiries);
  const [filter, setFilter] = useState('All');

  const filteredInquiries = filter === 'All' 
    ? inquiries 
    : inquiries.filter(i => i.status === filter);

  const handleStatusChange = (id, newStatus) => {
    setInquiries(inquiries.map(i => i.id === id ? { ...i, status: newStatus } : i));
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

        <div className="flex gap-2">
          {['All', 'New Lead', 'In Progress', 'Resolved'].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                filter === st ? 'bg-amber-500 text-slate-950 shadow' : 'bg-slate-900 text-slate-400 border border-slate-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredInquiries.map((inq) => (
          <div key={inq.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/30">
                  {inq.courseInterest}
                </span>
                <h3 className="text-base font-bold text-white mt-1">{inq.name}</h3>
              </div>

              <select
                value={inq.status}
                onChange={(e) => handleStatusChange(inq.id, e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1 text-xs text-amber-400 font-bold focus:outline-none"
              >
                <option value="New Lead">New Lead</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>

            <p className="text-xs text-slate-300 bg-slate-950 p-3.5 rounded-xl border border-slate-800 leading-relaxed">
              "{inq.message}"
            </p>

            <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80 gap-2">
              <div className="flex gap-4">
                <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-amber-400" /> {inq.email}</span>
                <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-amber-400" /> {inq.phone}</span>
              </div>
              <span className="text-[11px] text-slate-500">{inq.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
