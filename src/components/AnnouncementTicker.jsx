import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Megaphone } from 'lucide-react';

export default function AnnouncementTicker() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const { data, error } = await supabase
          .from('announcements')
          .select('message_text')
          .eq('is_active', true)
          .order('display_order', { ascending: true })
          .order('created_at', { ascending: false });

        if (!error && data) {
          setAnnouncements(data.map((item) => item.message_text));
        }
      } catch (err) {
        console.error('Failed to fetch announcements:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();

    // Optionally set up real-time listener for announcements
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

  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobileDevice(window.screen.width < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (loading || announcements.length === 0) {
    return null;
  }

  // To create a seamless infinite marquee, we can duplicate the announcements array a few times.
  const tickerContent = (
    <div className={`flex items-center shrink-0 ${isMobileDevice ? 'space-x-12' : 'space-x-6'}`}>
      {announcements.map((msg, index) => (
        <div key={index} className={`flex items-center ${isMobileDevice ? 'space-x-12' : 'space-x-6'}`}>
          <span className={`font-bold text-amber-400 uppercase tracking-widest whitespace-nowrap ${isMobileDevice ? 'text-2xl' : 'text-[11px]'}`}>
            {msg}
          </span>
          <span className={`text-slate-600 ${isMobileDevice ? 'text-xl' : 'text-[10px]'}`}>•</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-slate-950 border-b border-slate-800/80 overflow-hidden relative z-50">
      <div className={`flex items-stretch ${isMobileDevice ? 'h-16' : 'h-8'}`}>
        
        {/* Left Icon Badge (Sticky) */}
        <div className={`bg-red-600 flex items-center justify-center z-10 shrink-0 shadow-[4px_0_12px_rgba(0,0,0,0.5)] ${isMobileDevice ? 'px-6' : 'px-3'}`}>
          <Megaphone className={`text-white ${isMobileDevice ? 'w-7 h-7' : 'w-3.5 h-3.5'}`} />
        </div>

        {/* Scrolling Ticker Container */}
        <div className="flex-1 overflow-hidden relative flex items-center group">
          
          <div className={`flex items-center animate-marquee group-hover:pause ${isMobileDevice ? 'gap-12 pl-12' : 'gap-6 pl-6'}`}>
            {tickerContent}
            {tickerContent}
            {tickerContent}
            {tickerContent}
          </div>

          <div className={`absolute left-0 top-0 bottom-0 bg-gradient-to-r from-slate-950 to-transparent pointer-events-none z-10 ${isMobileDevice ? 'w-16' : 'w-8'}`}></div>
          <div className={`absolute right-0 top-0 bottom-0 bg-gradient-to-l from-slate-950 to-transparent pointer-events-none z-10 ${isMobileDevice ? 'w-24' : 'w-12'}`}></div>
        </div>
      </div>
    </div>
  );
}
