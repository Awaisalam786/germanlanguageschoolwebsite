import React, { useState, useEffect } from 'react';
import { Image as GalleryIcon, Maximize2, X, Lock, Loader2 } from 'lucide-react';
import ProtectedImage from '../components/ProtectedImage';
import { supabase } from '../lib/supabaseClient';
import { useGlobalContent } from '../context/GlobalContentContext';

export default function Gallery({ initialGallery = [] }) {
  const { settings } = useGlobalContent();
  const [gallery, setGallery] = useState(initialGallery);
  const [loading, setLoading] = useState(initialGallery.length === 0);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [lightboxImage, setLightboxImage] = useState(null);

  const categories = ['All', 'Live Classes', 'Certificates', 'Webinars'];

  useEffect(() => {
    if (initialGallery.length > 0) return;
    const fetchGallery = async () => {
      const { data } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
      if (data) {
        const mapped = data.map(item => ({
          id: item.id,
          category: 'Live Classes', 
          imageUrl: item.url,
          alt: 'German Learning School class',
          title: 'Live Zoom Session'
        }));
        setGallery(mapped);
      }
      setLoading(false);
    };
    fetchGallery();
  }, [initialGallery]);

  const filteredGallery = selectedCategory === 'All'
    ? gallery
    : gallery.filter(item => item.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
          <GalleryIcon className="w-6 h-6 text-amber-400" />
        </div>
        <h1 className="text-4xl font-extrabold text-white">Student Success Gallery</h1>
        <p className="text-sm text-slate-300">
          Glimpses from our live Zoom classes, student certificates, and community events across Pakistan.
        </p>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              selectedCategory === cat 
                ? 'bg-amber-500 text-slate-950 shadow-gold-glow' 
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex flex-col items-center justify-center py-24 text-slate-400 space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
            <p className="text-sm">Loading gallery...</p>
          </div>
        ) : filteredGallery.length === 0 ? (
          <div className="col-span-full text-center py-24 bg-slate-900/50 rounded-2xl border border-slate-800">
            <GalleryIcon className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">No Images Found</h3>
            <p className="text-sm text-slate-400">Check back later for updates.</p>
          </div>
        ) : (
          filteredGallery.map((item) => (
            <div 
              key={item.id} 
              className="group relative bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 aspect-[4/3] cursor-pointer"
              onClick={() => setLightboxImage(item)}
            >
              <ProtectedImage
                src={item.imageUrl}
                alt={item.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 flex justify-between items-end">
                  <div>
                    <span className="text-xs font-bold text-amber-400 mb-1 block">{item.category}</span>
                    <h3 className="text-white font-bold text-sm leading-tight">{item.title}</h3>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur flex items-center justify-center border border-white/20">
                    <Maximize2 className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Lightbox */}
      {lightboxImage && (
        <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-sm flex items-center justify-center p-4">
          <button 
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 right-4 sm:top-8 sm:right-8 w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors z-10"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="relative w-full max-w-5xl aspect-[4/3] sm:aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
            <ProtectedImage
              src={lightboxImage.imageUrl}
              alt={lightboxImage.alt}
              className="w-full h-full object-contain bg-black"
            />
            {/* Watermark overlay on lightbox */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-10">
              <div className="flex items-center gap-3 transform -rotate-12">
                <Lock className="w-12 h-12 text-white" />
                <span className="text-4xl font-extrabold text-white tracking-widest uppercase">Protected</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
