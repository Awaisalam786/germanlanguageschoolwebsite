import React, { useState } from 'react';
import { CreditCard, CheckCircle2, Clock, MessageCircle, AlertCircle } from 'lucide-react';
import { initialStudents } from '../mockData/seedData';

export default function PaymentStatusTracker() {
  const [students, setStudents] = useState(initialStudents);

  const handleStatusChange = (id, newStatus) => {
    setStudents(students.map(s => s.id === id ? { ...s, paymentStatus: newStatus } : s));
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-amber-400" />
            <span>Enrollment & Payment Status Tracker</span>
          </h2>
          <p className="text-xs text-slate-400">Manually update student payment status after confirming payment details on WhatsApp (0342 1189593).</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-bold text-[10px]">
              <tr>
                <th className="p-4">Student Name</th>
                <th className="p-4">WhatsApp Contact</th>
                <th className="p-4">Course Level</th>
                <th className="p-4">Payment Status</th>
                <th className="p-4 text-right">Update Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {students.map((std) => (
                <tr key={std.id} className="hover:bg-slate-950/60">
                  <td className="p-4 font-bold text-white">{std.name}<br/><span className="text-[10px] text-slate-400">{std.city}</span></td>
                  <td className="p-4 text-emerald-400 font-medium flex items-center gap-1">
                    <MessageCircle className="w-3.5 h-3.5 fill-current" />
                    <span>{std.phone}</span>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-bold text-[10px]">
                      {std.courseLevel}
                    </span>
                  </td>
                  <td className="p-4 font-bold">
                    <span className={`px-2.5 py-1 rounded text-[10px] font-bold ${
                      std.paymentStatus.includes('Paid') ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      std.paymentStatus.includes('Pending') ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      {std.paymentStatus}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <select
                      value={std.paymentStatus.includes('Paid') ? 'Paid' : std.paymentStatus.includes('Pending') ? 'Pending' : 'Unpaid'}
                      onChange={(e) => handleStatusChange(std.id, e.target.value)}
                      className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="Paid">Paid (Confirmed on WhatsApp)</option>
                      <option value="Pending">Pending Verification</option>
                      <option value="Unpaid">Unpaid</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
