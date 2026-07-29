import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Upload, Trash2, Eye, Loader2 } from 'lucide-react';
import { applyAutoWatermark } from '../utils/watermark';
import { supabase } from '../lib/supabaseClient';
import { useGlobalContent } from '../context/GlobalContentContext';

export default function GalleryManager() {
  const { settings } = useGlobalContent();
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      setImages(data);
    }
    setLoading(false);
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      // Apply watermark automatically using Global Settings
      const originalSrc = event.target.result;
      const watermarkedUrl = applyAutoWatermark(originalSrc, settings?.watermark_text || "03421189593");
      
      const payload = {
        url: watermarkedUrl || originalSrc,
        caption: 'New Upload'
      };

      const { data, error } = await supabase.from('gallery').insert([payload]).select().single();
      
      if (!error && data) {
        setImages([data, ...images]);
      } else {
        alert('Failed to upload image');
      }
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this gallery image?')) {
      const { error } = await supabase.from('gallery').delete().eq('id', id);
      if (!error) {
        setImages(images.filter(img => img.id !== id));
      } else {
        alert('Failed to delete image');
      }
    }
  };

  const handleUpdateCaption = async (id, newCaption) => {
    const { error } = await supabase.from('gallery').update({ caption: newCaption }).eq('id', id);
    if (!error) {
      setImages(images.map(img => img.id === id ? { ...img, caption: newCaption } : img));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-amber-400" />
            <span>Gallery Management</span>
          </h2>
          <p className="text-xs text-slate-400">Upload class photos and event images. Watermark is auto-applied.</p>
        </div>

        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
          <button
            disabled={uploading}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-700 disabled:text-slate-500 text-slate-950 font-bold rounded-xl text-xs shadow-gold-glow flex items-center gap-2 transition"
          >
            <Upload className="w-4 h-4" />
            <span>{uploading ? 'Processing...' : 'Upload Image'}</span>
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map(img => (
          <div key={img.id} className="group relative rounded-xl overflow-hidden bg-slate-900 border border-slate-800 aspect-video">
            <img src={img.url} alt={img.caption} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition" />
            
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
              <input
                type="text"
                value={img.caption || ''}
                onChange={(e) => setImages(images.map(i => i.id === img.id ? { ...i, caption: e.target.value } : i))}
                onBlur={(e) => handleUpdateCaption(img.id, e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                placeholder="Image Caption"
              />
              <div className="flex items-center gap-2 mt-2">
                <button onClick={() => setPreview(img.url)} className="p-1.5 rounded bg-slate-800 text-amber-400 hover:bg-slate-700 flex-1 flex justify-center">
                  <Eye className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => handleDelete(img.id)} className="p-1.5 rounded bg-slate-800 text-red-400 hover:bg-slate-700 flex-1 flex justify-center">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm" onClick={() => setPreview(null)}>
          <img src={preview} alt="Preview" className="max-w-full max-h-full rounded-lg shadow-2xl" />
        </div>
      )}

    </div>
  );
}
