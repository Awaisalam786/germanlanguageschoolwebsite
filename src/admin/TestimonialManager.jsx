import React, { useState, useEffect } from 'react';
import { MessageSquare, Plus, Edit, Trash2, Star, Video, Image as ImageIcon, X } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function TestimonialManager() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    course: 'A1 Beginner',
    rating: 5,
    text: '',
    type: 'text'
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      setTestimonials(data);
    }
    setLoading(false);
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ name: '', course: 'A1 Beginner', rating: 5, text: '', type: 'text' });
    setShowModal(true);
  };

  const handleOpenEdit = (t) => {
    setEditingId(t.id);
    setFormData({ 
      name: t.name,
      course: t.course,
      rating: t.rating,
      text: t.text,
      type: t.type
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this testimonial?')) {
      const { error } = await supabase.from('testimonials').delete().eq('id', id);
      if (!error) {
        setTestimonials(testimonials.filter(t => t.id !== id));
      } else {
        alert('Error deleting testimonial: ' + error.message);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      const { data, error } = await supabase
        .from('testimonials')
        .update(formData)
        .eq('id', editingId)
        .select();
      
      if (!error && data) {
        setTestimonials(testimonials.map(t => t.id === editingId ? data[0] : t));
      } else {
        alert('Error updating testimonial: ' + error?.message);
      }
    } else {
      const { data, error } = await supabase
        .from('testimonials')
        .insert([formData])
        .select();
        
      if (!error && data) {
        setTestimonials([data[0], ...testimonials]);
      } else {
        alert('Error adding testimonial: ' + error?.message);
      }
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-amber-400" />
            <span>Testimonials Manager</span>
          </h2>
          <p className="text-xs text-slate-400">Manage student success stories, text reviews, and video testimonials (Synced with Supabase).</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-gold-glow flex items-center gap-2 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add Testimonial</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10 text-amber-400 font-bold">Loading testimonials from Supabase...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map(t => (
            <div key={t.id} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-white font-bold">{t.name}</h3>
                    <span className="text-[10px] text-amber-400 font-bold tracking-wider uppercase">{t.course}</span>
                  </div>
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[...Array(t.rating)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                  </div>
                </div>
                <p className="text-xs text-slate-400 italic">"{t.text}"</p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  {t.type === 'video' ? <Video className="w-3.5 h-3.5" /> : <ImageIcon className="w-3.5 h-3.5" />}
                  <span>{t.type} format</span>
                </div>
                <div className="flex space-x-2">
                  <button onClick={() => handleOpenEdit(t)} className="p-1.5 rounded bg-slate-800 text-amber-400 hover:bg-slate-700 transition">
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(t.id)} className="p-1.5 rounded bg-slate-800 text-red-400 hover:bg-slate-700 transition">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">{editingId ? 'Edit Testimonial' : 'Add New Testimonial'}</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Student Name</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Course / Level</label>
                  <input
                    required
                    type="text"
                    value={formData.course}
                    onChange={e => setFormData({...formData, course: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Rating (1-5)</label>
                  <input
                    required
                    type="number"
                    min="1" max="5"
                    value={formData.rating}
                    onChange={e => setFormData({...formData, rating: parseInt(e.target.value)})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Type</label>
                  <select
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500/50"
                  >
                    <option value="text">Text Review</option>
                    <option value="video">Video URL / Embed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Review Content / URL</label>
                <textarea
                  required
                  rows="4"
                  value={formData.text}
                  onChange={e => setFormData({...formData, text: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500/50"
                ></textarea>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-gold-glow transition"
                >
                  Save Testimonial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
