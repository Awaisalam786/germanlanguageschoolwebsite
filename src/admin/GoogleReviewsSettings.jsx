import React, { useState } from 'react';
import { Star, RefreshCw, Key, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';

export default function GoogleReviewsSettings() {
  const [placeId, setPlaceId] = useState('ChIJ...example');
  const [apiKey, setApiKey] = useState('AIzaSy...example');
  const [isConnected, setIsConnected] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    setSaveStatus('Saving...');
    setTimeout(() => {
      setIsConnected(!!placeId && !!apiKey);
      setSaveStatus('Settings Saved Successfully');
      setTimeout(() => setSaveStatus(''), 3000);
    }, 800);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  };

  return (
    <div className="space-y-8 max-w-2xl">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <Star className="w-6 h-6 text-amber-400" />
          <span>Google Reviews Settings</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">Connect your Google Business Profile to auto-sync student reviews to the homepage.</p>
      </div>

      {/* Status Card */}
      <div className={`p-4 rounded-xl border flex items-center justify-between ${isConnected ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
        <div className="flex items-center gap-3">
          {isConnected ? <CheckCircle2 className="w-8 h-8 text-emerald-400" /> : <AlertCircle className="w-8 h-8 text-red-400" />}
          <div>
            <h3 className={`font-bold ${isConnected ? 'text-emerald-400' : 'text-red-400'}`}>
              {isConnected ? 'API Connected & Active' : 'API Not Connected'}
            </h3>
            <p className="text-[11px] text-slate-400">
              {isConnected ? 'Last sync: 2 hours ago. Syncs automatically every 24 hours.' : 'Please provide a valid Place ID and API Key to fetch reviews.'}
            </p>
          </div>
        </div>
        
        <button
          onClick={handleRefresh}
          disabled={!isConnected || isRefreshing}
          className="px-4 py-2 bg-slate-900 border border-slate-700 hover:bg-slate-800 disabled:opacity-50 text-white font-bold rounded-lg text-xs flex items-center gap-2 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
          <span>{isRefreshing ? 'Syncing...' : 'Refresh Now'}</span>
        </button>
      </div>

      {/* Settings Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-sm font-bold text-white mb-4 border-b border-slate-800 pb-3">API Configuration</h3>
        
        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Google Place ID</span>
            </label>
            <input
              type="text"
              value={placeId}
              onChange={e => setPlaceId(e.target.value)}
              placeholder="e.g., ChIJN1t_tDeuEmsRUsoyG83frY4"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50"
            />
            <p className="text-[10px] text-slate-500 mt-1">You can find this using the Google Maps Place ID Finder.</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span>Google Places API Key</span>
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50"
            />
            <p className="text-[10px] text-slate-500 mt-1">Ensure your API key has the Places API enabled and is restricted to your domain.</p>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-slate-800">
            <span className="text-xs text-emerald-400 font-bold">{saveStatus}</span>
            <button
              type="submit"
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-gold-glow transition"
            >
              Save Configuration
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}
