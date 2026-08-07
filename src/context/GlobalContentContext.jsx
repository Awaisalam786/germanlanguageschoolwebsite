'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const GlobalContentContext = createContext();

export function GlobalContentProvider({ children }) {
  const [settings, setSettings] = useState({
    logo_url: '/temp-logo.png',
    tagline: 'Learn, Practice, Pass Goethe',
    whatsapp_number: '03421189593',
    support_email: 'germanlanguageschool1@gmail.com',
    watermark_text: '03421189593',
    address: 'Online Classes via Zoom / Google Meet',
    discount_code: '',
    payment_instructions: 'Click the button below to open WhatsApp and receive your payment details and seat confirmation.',
    hero_title: 'Learn German 100% Online from Anywhere in Pakistan',
    hero_description: 'Join 12,500+ successful Pakistani students. Live interactive Zoom classes, Goethe/TestDaF/telc/ÖSD preparation, recorded lecture access, and 98.4% exam pass rate.'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
      setSettings(prev => ({ ...prev, ...newSettings }));
      
      // Dynamically update favicon
      if (newSettings.logo_url) {
        let link = document.querySelector("link[rel~='icon']");
        if (!link) {
          link = document.createElement('link');
          link.rel = 'icon';
          document.head.appendChild(link);
        }
        link.href = newSettings.logo_url;
      }
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
