import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Megaphone } from 'lucide-react';

const DEFAULT_ANNOUNCEMENT = 'WELCOME TO GERMAN LEARNING SCHOOL';

export default function AnnouncementTicker() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const cached = sessionStorage.getItem('gls_announcements_cache');
      if (cached) {
        const cachedMessages = JSON.parse(cached);
        if (Array.isArray(cachedMessages)) setAnnouncements(cachedMessages.filter(message => typeof message === 'string' && message.trim()));
      }
    } catch {
      // The ticker still renders its built-in message if storage is unavailable.
    }

    const fetchAnnouncements = async () => {
      try {
        const { data, error } = await supabase
          .from('announcements')
          .select('message_text')
          .eq('is_active', true)
          .order('display_order', { ascending: true })
          .order('created_at', { ascending: false });

        if (!error && data) {
          const messages = data.map((item) => item.message_text).filter(Boolean);
          setAnnouncements(messages);
          try {
            sessionStorage.setItem('gls_announcements_cache', JSON.stringify(messages));
          } catch {
            // Caching is only an optimization; the live announcements still render.
          }
        } else if (error) {
          console.error('Failed to fetch announcements:', error);
          setAnnouncements(current => current.length ? current : [DEFAULT_ANNOUNCEMENT]);
        }
      } catch (err) {
        console.error('Failed to fetch announcements:', err);
        setAnnouncements(current => current.length ? current : [DEFAULT_ANNOUNCEMENT]);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();

    const subscription = supabase
      .channel('announcements_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'announcements' }, () => {
        fetchAnnouncements();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  // Keep the bar in the first paint while Supabase fetches live copy.
  // This avoids a blank strip followed by a visible layout shift on refresh.
  const visibleAnnouncements = announcements.length > 0
    ? announcements
    : loading ? [DEFAULT_ANNOUNCEMENT] : [];

  if (visibleAnnouncements.length === 0) return null;

  // To create a seamless infinite marquee, duplicate the array
  const tickerContent = (
    <div className="flex items-center shrink-0 space-x-2 md:space-x-6">
      {visibleAnnouncements.map((msg, index) => (
        <div key={index} className="flex items-center space-x-2 md:space-x-6">
          <span className="font-bold text-amber-400 uppercase tracking-widest whitespace-nowrap text-[9px] md:text-[11px]">
            {msg}
          </span>
          <span className="text-slate-600 text-[8px] md:text-[10px]">•</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-slate-950 border-b border-slate-800/80 overflow-hidden relative z-[60] w-full box-border">
      <div className="flex items-stretch h-6 md:h-8 w-full box-border">
        
        {/* Left Icon Badge (Sticky) */}
        <div className="bg-red-600 flex items-center justify-center z-20 shrink-0 shadow-[4px_0_12px_rgba(0,0,0,0.5)] px-2 md:px-4">
          <Megaphone className="text-white w-3 h-3 md:w-4 md:h-4" />
        </div>

        {/* Scrolling Ticker Container */}
        <div className="flex-1 overflow-hidden relative flex items-center group box-border w-full">
          
          <div className="flex items-center animate-marquee group-hover:pause gap-2 md:gap-6 pl-2 md:pl-6 w-max">
            {tickerContent}
            {tickerContent}
            {tickerContent}
            {tickerContent}
          </div>

          <div className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-slate-950 to-transparent pointer-events-none z-10 w-6 md:w-8"></div>
          <div className="absolute right-0 top-0 bottom-0 bg-gradient-to-l from-slate-950 to-transparent pointer-events-none z-10 w-12 md:w-16"></div>
        </div>
      </div>
    </div>
  );
}
