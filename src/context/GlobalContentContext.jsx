'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const GlobalContentContext = createContext();

export function GlobalContentProvider({ children }) {
  const [settings, setSettings] = useState({
    logo_url: '/logo.png',
    tagline: 'Learn, Practice, Pass Goethe',
    whatsapp_number: '03421189593',
    support_email: 'germanlanguageschool1@gmail.com',
    watermark_text: '03421189593',
    address: 'Online Classes via Zoom / Google Meet',
    discount_code: '',
    payment_instructions: 'Click the button below to open WhatsApp and receive your payment details and seat confirmation.',
    hero_title: 'Learn German Online with Expert Faculty',
    hero_description: 'Join students across Pakistan learning German online. Live interactive Zoom classes, exam-focused preparation for Goethe/TestDaF/telc/ÖSD, and access to recorded lectures for structured practice.',
    hero_primary_cta: 'Start Learning Now',
    hero_secondary_cta: 'View Course Fees',
    stats: [
      { label: 'Experienced Instructors', value: 'Expert Faculty', icon: 'check' },
      { label: 'Students learning online', value: 'Across Pakistan', icon: 'users' },
      { label: 'Exam-focused practice', value: 'High Success', icon: 'award' }
    ]
  });
  const [loading, setLoading] = useState(true);

  // On first mount, try to paint immediately from whatever we last fetched
  // in this browser tab (sessionStorage), instead of always showing the
  // hardcoded '/logo.png' default and then popping in the real branding
  // logo once the Supabase query resolves. This is what caused the logo to
  // look "delayed" — a fresh network round-trip (DB query + image fetch
  // from a different origin) ran on every single page load before the
  // configured logo could appear. The cached copy is only ever a stand-in
  // for the first paint; fetchSettings() below still always runs and keeps
  // the cache (and the live subscription) up to date.
  useEffect(() => {
    try {
      const cached = sessionStorage.getItem('gls_site_settings_cache');
      if (cached) {
        setSettings(prev => ({ ...prev, ...JSON.parse(cached) }));
      }
    } catch {
      // sessionStorage unavailable (private mode, etc.) — fall back to the
      // default state and the normal fetch below.
    }

    fetchSettings();

    // Subscribe to real-time changes
    const subscription = supabase
      .channel('site_settings_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_settings' }, () => {
        fetchSettings();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const fetchSettings = async () => {
    const { data, error } = await supabase.from('site_settings').select('*');
    if (!error && data) {
      const newSettings = {};
      data.forEach(item => {
        newSettings[item.key] = item.value;
      });
      setSettings(prev => {
        const merged = { ...prev, ...newSettings };
        try {
          sessionStorage.setItem('gls_site_settings_cache', JSON.stringify(newSettings));
        } catch {
          // ignore — caching is a pure optimization, never required
        }
        return merged;
      });

      // The favicon is served statically via the App Router file convention
      // (app/favicon.ico, app/icon.png, app/apple-icon.png). It is no longer
      // swapped to logo_url at runtime: that overwrote the server-rendered
      // <link rel="icon"> with the wide header logo after hydration.
    }
    setLoading(false);
  };

  return (
    <GlobalContentContext.Provider value={{ settings, loading, refetch: fetchSettings }}>
      {children}
    </GlobalContentContext.Provider>
  );
}

export function useGlobalContent() {
  return useContext(GlobalContentContext);
}
