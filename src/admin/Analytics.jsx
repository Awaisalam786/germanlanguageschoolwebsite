import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Globe, 
  Smartphone, 
  Monitor, 
  Tablet, 
  Download, 
  Activity, 
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import { mockAnalyticsData } from '../mockData/seedData';
import { supabase } from '../lib/supabaseClient';

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('This Month');
  const [exporting, setExporting] = useState(false);
  const [liveUsersCount, setLiveUsersCount] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      const { count } = await supabase.from('students').select('*', { count: 'exact', head: true });
      setLiveUsersCount(count || 0);
    };
    fetchUsers();
  }, []);

  const handleExportPDF = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      const text = `GERMAN LANGUAGE SCHOOL ANALYTICS REPORT (${timeRange})\n\nTotal Monthly Visitors: 48,920\nGrowth: +24.5%\nAvg Session Duration: 4m 18s\nBounce Rate: 32.1%\nReal-time Active: 42 Users\n\nTOP VISITED PAGES:\n` + mockAnalyticsData.topVisitedPages.map(p => `- ${p.page} (${p.title}): ${p.views} views (${p.percentage}%)`).join('\n') + `\n\nTRAFFIC SOURCES:\n` + mockAnalyticsData.trafficSources.map(s => `- ${s.source}: ${s.percentage}%`).join('\n');
      const blob = new Blob([text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `GermanLanguageSchool_Analytics_Report_${timeRange.replace(/\s+/g, '_')}.txt`;
      a.click();
    }, 1000);
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-amber-400" />
            <span>Website Analytics & Viewership Telemetry</span>
          </h2>
          <p className="text-xs text-slate-400">
            Internal Google Analytics integration & custom page-wise traffic telemetry.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-xs font-bold text-white rounded-xl px-3 py-2 focus:outline-none"
          >
            <option value="Today">Today</option>
            <option value="This Week">This Week</option>
            <option value="This Month">This Month</option>
            <option value="Year 2026">Year 2026</option>
          </select>

          <button
            onClick={handleExportPDF}
            disabled={exporting}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow"
          >
            <Download className="w-4 h-4" />
            <span>{exporting ? 'Generating Report...' : 'Export Report (PDF/Excel)'}</span>
          </button>
        </div>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-2">
          <div className="text-xs text-slate-400 font-semibold">Total Unique Visitors</div>
          <div className="text-3xl font-extrabold text-white">{mockAnalyticsData.totalVisitorsThisMonth.toLocaleString()}</div>
          <div className="text-xs text-emerald-400 font-bold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{mockAnalyticsData.growthPercentage} vs last period</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-2">
          <div className="text-xs text-slate-400 font-semibold">Total Verified Students</div>
          <div className="text-3xl font-extrabold text-amber-400">{liveUsersCount}</div>
          <div className="text-xs text-slate-400">Live Database Sync</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-2">
          <div className="text-xs text-slate-400 font-semibold">Bounce Rate</div>
          <div className="text-3xl font-extrabold text-white">{mockAnalyticsData.bounceRate}</div>
          <div className="text-xs text-emerald-400 font-bold">Optimized loading speed</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-2">
          <div className="text-xs text-slate-400 font-semibold flex items-center justify-between">
            <span>Real-time Active</span>
            <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-400">{mockAnalyticsData.realtimeActiveUsers} Online</div>
          <div className="text-xs text-slate-400">Live active sessions</div>
        </div>
      </div>

      {/* Daily Visitors Bar Chart Visual */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Daily Traffic Overview (Visitors vs Page Views)</h3>
            <p className="text-xs text-slate-400">Monitored over the last 7 days</p>
          </div>
          <span className="text-xs font-bold text-amber-400">Peak: Friday (7,100 views)</span>
        </div>

        <div className="h-48 flex items-end justify-between gap-4 pt-4 border-b border-slate-800 pb-2 px-2">
          {mockAnalyticsData.dailyVisitors.map((d) => (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
              <div className="text-[10px] text-amber-400 font-bold opacity-0 group-hover:opacity-100 transition">
                {d.pageViews}
              </div>
              <div 
                className="w-full max-w-[32px] bg-gradient-to-t from-amber-600 to-amber-400 rounded-t-lg group-hover:from-amber-500 group-hover:to-amber-300 transition-all duration-300"
                style={{ height: `${(d.pageViews / 7100) * 100}%` }}
              ></div>
              <span className="text-xs font-semibold text-slate-400">{d.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Page-wise Breakdown & Traffic Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Most Visited Pages */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-base font-bold text-white">Page-Wise Viewership Breakdown</h3>
          <div className="space-y-3">
            {mockAnalyticsData.topVisitedPages.map((p) => (
              <div key={p.page} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-white">{p.title} <span className="text-slate-500 font-normal">({p.page})</span></span>
                  <span className="text-amber-400">{p.views.toLocaleString()} views ({p.percentage}%)</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: `${p.percentage * 2}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic Sources & Device Breakdown */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Traffic Acquisition Channels</h3>
            <div className="space-y-3">
              {mockAnalyticsData.trafficSources.map((s) => (
                <div key={s.source} className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-300">{s.source}</span>
                  <span className="text-amber-400 font-bold">{s.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Device Breakdown</h3>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <Smartphone className="w-5 h-5 text-amber-400 mx-auto" />
                <div className="text-xs font-bold text-white">64%</div>
                <div className="text-[10px] text-slate-400">Mobile</div>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <Monitor className="w-5 h-5 text-amber-400 mx-auto" />
                <div className="text-xs font-bold text-white">31%</div>
                <div className="text-[10px] text-slate-400">Desktop</div>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <Tablet className="w-5 h-5 text-amber-400 mx-auto" />
                <div className="text-xs font-bold text-white">5%</div>
                <div className="text-[10px] text-slate-400">Tablet</div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
