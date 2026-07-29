import React, { useState, useEffect } from 'react';
import { Image as GalleryIcon, Maximize2, X, Lock, Loader2 } from 'lucide-react';
import ProtectedImage from '../components/ProtectedImage';
import { supabase } from '../lib/supabaseClient';
import { useGlobalContent } from '../context/GlobalContentContext';

export default function Gallery() {
  const { settings } = useGlobalContent();
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [lightboxImage, setLightboxImage] = useState(null);

  const categories = ['All', 'Live Classes', 'Certificates', 'Webinars'];

  useEffect(() => {
    const fetchGallery = async () => {
      const { data } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
      if (data) {
        const mapped = data.map(item => ({
          id: item.id,
          category: 'Live Classes', // default category since we didn't add it to DB
          imageUrl: item.url,
          title: item.caption
        }));
        setGallery(mapped);
      }
      setLoading(false);
    };
    fetchGallery();
  }, []);

  const filteredGallery = selectedCategory === 'All'
    ? gallery
    : gallery.filter(item => item.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/30">
          Live Online Class Screenshots & Verified Moments
        </span>
        <h1 className="text-4xl font-extrabold text-white">Success Stories & Photo Gallery</h1>
        <p className="text-sm text-slate-300">
          Real moments from our live Zoom classrooms, webinars, and certificate achievements across Pakistan.
        </p>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === cat
                ? 'bg-amber-500 text-slate-950 shadow-gold-glow'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Photo Cards Grid with Protected Watermarked Images */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-full text-center text-slate-400 py-12 flex flex-col items-center">
            <Loader2 className="w-8 h-8 text-amber-500 animate-spin mb-4" />
            Loading gallery...
          </div>
        ) : filteredGallery.map((item) => (
          <div
            key={item.id}
            onClick={() => setLightboxImage(item)}
            className="group bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden cursor-pointer hover:border-amber-500/50 transition duration-300 shadow-xl"
          >
            <div className="h-64 overflow-hidden relative">
              <ProtectedImage
                src={item.imageUrl}
                alt={item.title}
                watermarkText={settings?.whatsapp_number || "03421189593"}
                className="w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition pointer-events-none"></div>

              <div className="absolute top-3 right-3 p-2 rounded-xl bg-slate-950/80 text-amber-400 opacity-0 group-hover:opacity-100 transition pointer-events-none">
                <Maximize2 className="w-4 h-4" />
              </div>
            </div>

            <div className="p-5 space-y-1.5 bg-slate-950">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest block">{item.category}</span>
              <h3 className="text-base font-bold text-white leading-tight">{item.title}</h3>
              <p className="text-xs text-slate-400">{item.caption}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal with Protected Image */}
      {lightboxImage && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/40 rounded-3xl max-w-3xl w-full p-6 relative overflow-hidden shadow-2xl space-y-4">
            
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">{lightboxImage.title}</h3>
                <span className="text-xs text-amber-400">{lightboxImage.category}</span>
              </div>
              <button onClick={() => setLightboxImage(null)} className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="h-[420px] rounded-2xl overflow-hidden border border-slate-800 relative bg-slate-950 flex items-center justify-center">
              <ProtectedImage
                src={lightboxImage.imageUrl}
                alt={lightboxImage.title}
                watermarkText={settings?.whatsapp_number || "03421189593"}
                className="w-auto h-auto max-w-full max-h-[85vh] mx-auto rounded-lg shadow-2xl border border-slate-700"
              />
            </div>

            <p className="text-xs text-slate-300 text-center italic">
              {lightboxImage.caption} • <span className="text-amber-400 font-semibold">Protected Image ({settings?.whatsapp_number || "03421189593"})</span>
            </p>

          </div>
        </div>
      )}

    </div>
  );
}
