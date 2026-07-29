import React, { useState, useEffect } from 'react';
import { UserCheck, Plus, Edit, Trash2, Mail, Award, X, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function TeacherManagement() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    role: 'German Lecturer & DaF Specialist',
    qualification: 'M.A. in German Linguistics',
    experience: '8 Years',
    specialty: 'Goethe & Telc Prep',
    email: '',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80'
  });

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('teachers').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching teachers:', error);
    } else {
      setTeachers(data || []);
    }
    setLoading(false);
  };

  const handleOpenAdd = () => {
    setEditingTeacher(null);
    setFormData({
      name: '',
      role: 'German Lecturer & DaF Specialist',
      qualification: 'M.A. in German Linguistics',
      experience: '8 Years',
      specialty: 'Goethe & Telc Prep',
      email: '',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80'
    });
    setShowModal(true);
  };

  const handleOpenEdit = (t) => {
    setEditingTeacher(t);
    setFormData({ ...t });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Delete teacher profile?')) {
      const { error } = await supabase.from('teachers').delete().eq('id', id);
      if (!error) {
        setTeachers(teachers.filter(t => t.id !== id));
      } else {
        alert('Failed to delete teacher');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // In our schema, we didn't add email, bio, or coursesAssigned. 
    // We will extract only the fields that exist in our schema to prevent errors.
    const payload = {
      name: formData.name,
      role: formData.role,
      qualification: formData.qualification,
      experience: formData.experience,
      specialty: formData.specialty,
      image: formData.image
    };

    if (editingTeacher) {
      const { data, error } = await supabase
        .from('teachers')
        .update(payload)
        .eq('id', editingTeacher.id)
        .select()
        .single();
        
      if (!error && data) {
        setTeachers(teachers.map(t => t.id === editingTeacher.id ? data : t));
        setShowModal(false);
      }
    } else {
      const { data, error } = await supabase
        .from('teachers')
        .insert([payload])
        .select()
        .single();
        
      if (!error && data) {
        setTeachers([data, ...teachers]);
        setShowModal(false);
      }
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-amber-400" />
            <span>Faculty & Teacher Management</span>
          </h2>
          <p className="text-xs text-slate-400">Manage native instructors, qualifications, and course assignments.</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-gold-glow flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Faculty Member</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {teachers.map((t) => (
          <div key={t.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex gap-4 items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={t.image} alt={t.name} className="w-16 h-16 rounded-xl object-cover border border-slate-700" />
              <div>
                <h3 className="text-base font-bold text-white">{t.name}</h3>
                <div className="text-xs text-amber-400 font-semibold">{t.role}</div>
                <div className="text-[11px] text-slate-400 mt-1">{t.qualification}</div>
              </div>
            </div>

            <div className="flex space-x-2">
              <button onClick={() => handleOpenEdit(t)} className="p-1.5 rounded bg-slate-800 text-amber-400 hover:bg-slate-700">
                <Edit className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(t.id)} className="p-1.5 rounded bg-slate-800 text-red-400 hover:bg-slate-700">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">{editingTeacher ? 'Edit Profile' : 'Add Faculty'}</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Teacher Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Role / Designation</label>
                <input
                  type="text"
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Qualification</label>
                  <input
                    type="text"
                    required
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <button type="submit" className="w-full py-3 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs shadow">
                Save Faculty Profile
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
