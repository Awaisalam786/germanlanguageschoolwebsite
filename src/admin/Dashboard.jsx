import React, { useState, useEffect } from 'react';
import { 
  Users, 
  GraduationCap, 
  DollarSign, 
  MessageSquare, 
  TrendingUp, 
  Plus, 
  FileText, 
  Download, 
  Activity,
  ArrowUpRight,
  ShieldAlert
} from 'lucide-react';
import { mockAnalyticsData } from '../mockData/seedData';
import { supabase } from '../lib/supabaseClient';

export default function Dashboard({ setCurrentTab }) {
  const [stats, setStats] = useState({
    students: 0,
    courses: 0,
    inquiries: 0
  });
  const [recentInquiries, setRecentInquiries] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      const [{ count: studentCount }, { count: courseCount }, { count: inquiryCount }, { data: inquiries }] = await Promise.all([
        supabase.from('students').select('*', { count: 'exact', head: true }),
        supabase.from('courses').select('*', { count: 'exact', head: true }),
        supabase.from('inquiries').select('*', { count: 'exact', head: true }),
        supabase.from('inquiries').select('*').order('created_at', { ascending: false }).limit(5)
      ]);
      
      setStats({
        students: studentCount || 0,
        courses: courseCount || 0,
        inquiries: inquiryCount || 0
      });
      setRecentInquiries(inquiries || []);
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-amber-500/30 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/40">
            Official System Control Panel
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Welcome back, Super Admin</h2>
          <p className="text-xs text-slate-300">
            Real-time enrollment activity, OCR document parsing queue, and live traffic telemetry.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 shrink-0">
          <button
            onClick={() => setCurrentTab('documents')}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow"
          >
            <FileText className="w-4 h-4" />
            <span>Upload Document / OCR</span>
          </button>
          <button
            onClick={() => setCurrentTab('students')}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 border border-slate-700"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {/* KPI Counters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Total Enrolled Students</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{stats.students}</div>
          <div className="flex items-center text-xs text-emerald-400 gap-1 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Live Data</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Active Course Batches</span>
            <GraduationCap className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-3xl font-extrabold text-white">{stats.courses} Batches</div>
          <div className="text-xs text-slate-400">Live Data</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Monthly Tuition Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-400">€148,900</div>
          <div className="flex items-center text-xs text-emerald-400 gap-1 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18.5% YoY Growth</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Real-time Active Users</span>
            <Activity className="w-4 h-4 text-amber-400 animate-pulse" />
          </div>
          <div className="text-3xl font-extrabold text-amber-400">
            {mockAnalyticsData.realtimeActiveUsers} Online
          </div>
          <div className="text-xs text-slate-400">Website live Telemetry</div>
        </div>
      </div>

      {/* Quick Inquiries & Recent Enrollees Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Pending Leads Table */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-amber-400" />
              <span>Recent Form Inquiries</span>
            </h3>
            <button
              onClick={() => setCurrentTab('inquiries')}
              className="text-xs text-amber-400 font-bold hover:underline"
            >
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase font-bold text-[10px]">
                <tr>
                  <th className="p-3">Name</th>
                  <th className="p-3">Level Interest</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {recentInquiries.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-3 text-center text-slate-500">No recent inquiries found</td>
                  </tr>
                ) : recentInquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-slate-950/50">
                    <td className="p-3 font-semibold text-white">{inq.name}</td>
                    <td className="p-3 text-amber-400 font-medium">{inq.course_interest || inq.courseInterest}</td>
                    <td className="p-3 text-slate-400">{new Date(inq.created_at).toLocaleDateString()}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        inq.status === 'New Lead' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                        inq.status === 'In Progress' ? 'bg-blue-500/20 text-blue-400' : 'bg-emerald-500/20 text-emerald-400'
                      }`}>
                        {inq.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* OCR Vault Quick Digest */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Document OCR Queue</span>
            </h3>
            <button
              onClick={() => setCurrentTab('documents')}
              className="text-xs text-amber-400 font-bold hover:underline"
            >
              Vault Manager
            </button>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-white">
                <span>Goethe_Zertifikat_B2_Sample.pdf</span>
                <span className="text-emerald-400 text-[10px]">Verified OCR</span>
              </div>
              <p className="text-[11px] text-slate-400">Extracted Name: Tariq Mehmood | Score: 93.5% (Sehr Gut)</p>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-white">
                <span>Passport_Copy_Elena_Rostova.pdf</span>
                <span className="text-emerald-400 text-[10px]">Verified OCR</span>
              </div>
              <p className="text-[11px] text-slate-400">Passport #: N78492019 | Expiry: Nov 2031</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
