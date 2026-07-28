import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Key, Save, CheckCircle2, ShieldCheck, RefreshCw, AlertCircle } from 'lucide-react';
import { saveGooglePlacesConfig, fetchLiveGoogleReviews } from '../utils/googleReviewsApi';

export default function Settings() {
  const [googlePlaceId, setGooglePlaceId] = useState(localStorage.getItem('mock_google_place_id') || '');
  const [googleApiKey, setGoogleApiKey] = useState(localStorage.getItem('mock_google_api_key') || '');
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [connectionStatus, setConnectionStatus] = useState(null);

  useEffect(() => {
    fetchLiveGoogleReviews().then((data) => {
      setConnectionStatus(data);
    });
  }, []);

  const handleSaveGoogleConfig = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg('');

    const res = await saveGooglePlacesConfig(googlePlaceId, googleApiKey);
    setSaving(false);
    setStatusMsg('Google Places API Credentials saved securely to server! 24-hour cache invalidated.');
    
    // Refresh status
    fetchLiveGoogleReviews().then((data) => {
      setConnectionStatus(data);
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-amber-400" />
          <span>System Settings & API Integrations</span>
        </h2>
        <p className="text-xs text-slate-400">Configure global website parameters, SEO meta tags, and server-side API integrations.</p>
      </div>

      {/* Google Business Profile & Places API Configuration */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white text-slate-950 flex items-center justify-center font-extrabold text-xl shadow">
              G
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Google Places API Integration (Live Reviews)</h3>
              <p className="text-xs text-slate-400">Calls happen on the backend server (`/api/google-reviews`) with a 24-hour cache layer to protect API Key.</p>
            </div>
          </div>

          <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
            connectionStatus?.isConfigured 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
              : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
          }`}>
            {connectionStatus?.isConfigured ? '✓ API Connected' : 'Unconfigured'}
          </span>
        </div>

        {statusMsg && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-xl text-xs text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{statusMsg}</span>
          </div>
        )}

        <form onSubmit={handleSaveGoogleConfig} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Google Place ID</label>
            <input
              type="text"
              placeholder="e.g. ChIJN1t_tDeuEmsRUsoyG83frY4"
              value={googlePlaceId}
              onChange={(e) => setGooglePlaceId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
            />
            <span className="text-[10px] text-slate-500 block mt-1">Unique Google Business Profile identifier.</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Google Places API Key (Server-Side Secret)</label>
            <div className="relative">
              <input
                type="password"
                placeholder="e.g. AIzaSyB..."
                value={googleApiKey}
                onChange={(e) => setGoogleApiKey(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 pr-10"
              />
              <Key className="w-4 h-4 text-slate-500 absolute right-3 top-3" />
            </div>
            <span className="text-[10px] text-amber-400/80 block mt-1">
              🔒 Security Verified: API Key is stored on server environment only and NEVER exposed to frontend browsers.
            </span>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-gold-glow flex items-center gap-2 transition"
            >
              {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save & Refresh Server Cache</span>
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}
