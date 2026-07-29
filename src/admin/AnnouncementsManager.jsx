import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Plus, Edit2, Trash2, CheckCircle2, AlertCircle, Save, RefreshCw, MoveUp, MoveDown, Megaphone } from 'lucide-react';

export default function AnnouncementsManager() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Edit / Add State
  const [isEditing, setIsEditing] = useState(false);
  const [currentAnnouncement, setCurrentAnnouncement] = useState({
    id: null,
    message_text: '',
    is_active: true,
    display_order: 0
  });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAnnouncements(data || []);
    } catch (err) {
      console.error('Error fetching announcements:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!currentAnnouncement.message_text.trim()) {
      setError('Message text is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        message_text: currentAnnouncement.message_text.trim(),
        is_active: currentAnnouncement.is_active,
        display_order: parseInt(currentAnnouncement.display_order, 10) || 0
      };

      if (currentAnnouncement.id) {
        // Update existing
        const { error: updateErr } = await supabase
          .from('announcements')
          .update(payload)
          .eq('id', currentAnnouncement.id);
        if (updateErr) throw updateErr;
        showSuccess('Announcement updated successfully!');
      } else {
        // Insert new
        const { error: insertErr } = await supabase
          .from('announcements')
          .insert([payload]);
        if (insertErr) throw insertErr;
        showSuccess('Announcement added successfully!');
      }

      setIsEditing(false);
      fetchAnnouncements();
    } catch (err) {
      console.error('Save error:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;
    
    setLoading(true);
    try {
      const { error: delErr } = await supabase
        .from('announcements')
        .delete()
        .eq('id', id);
      if (delErr) throw delErr;
      
      showSuccess('Announcement deleted!');
      fetchAnnouncements();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleToggleActive = async (announcement) => {
    setLoading(true);
    try {
      const { error: updateErr } = await supabase
        .from('announcements')
        .update({ is_active: !announcement.is_active })
        .eq('id', announcement.id);
      
      if (updateErr) throw updateErr;
      fetchAnnouncements();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleMoveOrder = async (announcement, direction) => {
    const currentIndex = announcements.findIndex(a => a.id === announcement.id);
    if (direction === 'up' && currentIndex === 0) return;
    if (direction === 'down' && currentIndex === announcements.length - 1) return;

    const swapIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const swapAnnouncement = announcements[swapIndex];

    setLoading(true);
    try {
      const currentOrder = announcement.display_order;
      const swapOrder = swapAnnouncement.display_order;
      
      const newCurrentOrder = currentOrder === swapOrder ? (direction === 'up' ? currentOrder - 1 : currentOrder + 1) : swapOrder;
      const newSwapOrder = currentOrder === swapOrder ? (direction === 'up' ? swapOrder + 1 : swapOrder - 1) : currentOrder;

      await supabase.from('announcements').update({ display_order: newCurrentOrder }).eq('id', announcement.id);
      await supabase.from('announcements').update({ display_order: newSwapOrder }).eq('id', swapAnnouncement.id);
      
      fetchAnnouncements();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-amber-500" />
            Announcement Ticker Manager
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage scrolling messages that appear at the very top of the public website.
          </p>
        </div>
        <button
          onClick={() => {
            setCurrentAnnouncement({ id: null, message_text: '', is_active: true, display_order: announcements.length * 10 });
            setIsEditing(true);
            setError(null);
          }}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition"
        >
          <Plus className="w-4 h-4" />
          Add Announcement
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl text-sm flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <p>{successMsg}</p>
        </div>
      )}

      {isEditing && (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
          <h2 className="text-lg font-bold text-white mb-4">
            {currentAnnouncement.id ? 'Edit Announcement' : 'Create New Announcement'}
          </h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Message Text</label>
              <textarea
                value={currentAnnouncement.message_text}
                onChange={(e) => setCurrentAnnouncement({ ...currentAnnouncement, message_text: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                placeholder="e.g. September Session Registrations are opening soon!"
                rows="3"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Display Order (Lower = First)</label>
                <input
                  type="number"
                  value={currentAnnouncement.display_order}
                  onChange={(e) => setCurrentAnnouncement({ ...currentAnnouncement, display_order: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
              <div className="flex items-center">
                <label className="flex items-center gap-3 cursor-pointer mt-4">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={currentAnnouncement.is_active}
                      onChange={(e) => setCurrentAnnouncement({ ...currentAnnouncement, is_active: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                  </div>
                  <span className="text-sm font-semibold text-slate-300">Active (Visible in Ticker)</span>
                </label>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Announcement
              </button>
            </div>
          </form>
        </div>
      )}

      {!isEditing && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          {loading && announcements.length === 0 ? (
            <div className="p-10 flex items-center justify-center text-amber-500">
              <RefreshCw className="w-6 h-6 animate-spin" />
            </div>
          ) : announcements.length === 0 ? (
            <div className="p-10 text-center text-slate-400 text-sm">
              No announcements found. Click "Add Announcement" to create your first ticker message.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950/50 text-[10px] uppercase tracking-wider text-slate-500 border-b border-slate-800">
                    <th className="p-4 font-bold">Order</th>
                    <th className="p-4 font-bold">Message</th>
                    <th className="p-4 font-bold">Status</th>
                    <th className="p-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {announcements.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-4 align-top">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-slate-400 bg-slate-950 px-2 py-1 rounded border border-slate-800">
                            {item.display_order}
                          </span>
                          <div className="flex flex-col gap-0.5">
                            <button 
                              onClick={() => handleMoveOrder(item, 'up')}
                              disabled={idx === 0}
                              className="text-slate-500 hover:text-amber-400 disabled:opacity-30 transition"
                            >
                              <MoveUp className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => handleMoveOrder(item, 'down')}
                              disabled={idx === announcements.length - 1}
                              className="text-slate-500 hover:text-amber-400 disabled:opacity-30 transition"
                            >
                              <MoveDown className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="text-sm text-slate-200 font-medium leading-relaxed max-w-xl">
                          {item.message_text}
                        </p>
                      </td>
                      <td className="p-4 align-top">
                        <button
                          onClick={() => handleToggleActive(item)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition ${
                            item.is_active 
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20' 
                              : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                          }`}
                        >
                          {item.is_active ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="p-4 align-top">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setCurrentAnnouncement(item);
                              setIsEditing(true);
                              setError(null);
                            }}
                            className="p-2 text-slate-400 hover:text-amber-400 hover:bg-amber-400/10 rounded-lg transition"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
