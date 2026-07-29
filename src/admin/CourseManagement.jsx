import React, { useState, useEffect } from 'react';
import { GraduationCap, Plus, Edit, Trash2, Clock, Calendar, X } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function CourseManagement() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    level: 'B1',
    title: '',
    duration: '8 Weeks (80 Hours)',
    price: '€590',
    schedule: 'Flexible Live Batches Available'
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('courses').select('*').order('created_at', { ascending: true });
    if (error) {
      console.error('Error fetching courses:', error);
    } else {
      setCourses(data || []);
    }
    setLoading(false);
  };

  const handleOpenAdd = () => {
    setEditingCourse(null);
    setFormData({
      level: 'B1',
      title: '',
      duration: '8 Weeks (80 Hours)',
      price: '€590',
      schedule: 'Flexible Live Batches Available'
    });
    setShowModal(true);
  };

  const handleOpenEdit = (course) => {
    setEditingCourse(course);
    setFormData({ 
      level: course.level,
      title: course.title,
      duration: course.duration,
      price: course.price,
      schedule: course.schedule
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this course offering?')) {
      const { error } = await supabase.from('courses').delete().eq('id', id);
      if (!error) {
        setCourses(courses.filter(c => c.id !== id));
      } else {
        alert('Error deleting course: ' + error.message);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingCourse) {
      const { data, error } = await supabase
        .from('courses')
        .update(formData)
        .eq('id', editingCourse.id)
        .select();
      
      if (!error && data) {
        setCourses(courses.map(c => c.id === editingCourse.id ? data[0] : c));
      } else {
        alert('Error updating course: ' + error?.message);
      }
    } else {
      const { data, error } = await supabase
        .from('courses')
        .insert([formData])
        .select();
        
      if (!error && data) {
        setCourses([...courses, data[0]]);
      } else {
        alert('Error adding course: ' + error?.message);
      }
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-amber-400" />
            <span>Course Catalog & Schedule Management</span>
          </h2>
          <p className="text-xs text-slate-400">Manage course levels (A1-B2), tuition fees, schedules, and capacity (Synced with Supabase).</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-gold-glow flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Course</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10 text-amber-400 font-bold">Loading courses from Supabase...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between">
              
              {/* Level Badge */}
              <div className="absolute top-0 right-0 bg-amber-500/10 text-amber-400 font-bold px-4 py-2 rounded-bl-2xl text-xs border-b border-l border-amber-500/20">
                {course.level}
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white pr-12">{course.title}</h3>
                
                <div className="space-y-2">
                  <div className="flex items-center text-xs text-slate-400 gap-2">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center text-xs text-slate-400 gap-2">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span>{course.schedule}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-800/80 flex items-center justify-between">
                <div className="text-sm font-black text-emerald-400">{course.price}</div>
                <div className="flex space-x-2">
                  <button onClick={() => handleOpenEdit(course)} className="p-1.5 rounded bg-slate-800 text-amber-400 hover:bg-slate-700">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(course.id)} className="p-1.5 rounded bg-slate-800 text-red-400 hover:bg-slate-700">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">{editingCourse ? 'Edit Course' : 'Add New Course'}</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">Level (e.g. A1)</label>
                  <input
                    type="text"
                    required
                    value={formData.level}
                    onChange={(e) => setFormData({...formData, level: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">Duration</label>
                  <input
                    type="text"
                    required
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">Tuition Fee</label>
                  <input
                    type="text"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">Schedule Information</label>
                <input
                  type="text"
                  required
                  value={formData.schedule}
                  onChange={(e) => setFormData({...formData, schedule: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500/50"
                />
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
                  Save Course to Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
