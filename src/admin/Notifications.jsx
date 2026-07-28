import React, { useState } from 'react';
import { Bell, Mail, MessageSquare, ShieldAlert, Send } from 'lucide-react';
import { initialNotifications } from '../mockData/seedData';

export default function Notifications() {
  const [logs, setLogs] = useState(initialNotifications);
  const [newSms, setNewSms] = useState({ recipient: '', message: '' });
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSendManual = (e) => {
    e.preventDefault();
    const newLog = {
      id: `nt-${Date.now()}`,
      type: 'SMS',
      recipient: newSms.recipient,
      subject: 'Manual Alert',
      message: newSms.message,
      status: 'Delivered',
      timestamp: new Date().toLocaleString()
    };
    setLogs([newLog, ...logs]);
    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
      setNewSms({ recipient: '', message: '' });
    }, 2500);
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-amber-400" />
            <span>Notification & Dispatch System</span>
          </h2>
          <p className="text-xs text-slate-400">Automated SMS & Email notifications sent to students and admins.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Send Alert Box */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-base font-bold text-white">Send Direct SMS / Email Alert</h3>

          {sentSuccess ? (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center text-xs text-emerald-400 font-bold">
              ✓ Message dispatched successfully!
            </div>
          ) : (
            <form onSubmit={handleSendManual} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Recipient Phone / Email</label>
                <input
                  type="text"
                  required
                  placeholder="+49 176 998811 or student@example.com"
                  value={newSms.recipient}
                  onChange={(e) => setNewSms({ ...newSms, recipient: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Message Content</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Class schedule reminder or document receipt notification..."
                  value={newSms.message}
                  onChange={(e) => setNewSms({ ...newSms, message: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow"
              >
                <Send className="w-4 h-4" />
                <span>Dispatch Alert</span>
              </button>
            </form>
          )}
        </div>

        {/* Dispatch Log Table */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-base font-bold text-white">System Notification Logs</h3>
          <div className="space-y-3">
            {logs.map((log) => (
              <div key={log.id} className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-bold text-[10px]">
                    {log.type} • {log.recipient}
                  </span>
                  <span className="text-emerald-400 font-bold text-[10px]">{log.status}</span>
                </div>
                <div className="font-semibold text-white mt-1">{log.subject}</div>
                <p className="text-slate-400">{log.message}</p>
                <span className="text-[10px] text-slate-500 block pt-1">{log.timestamp}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
