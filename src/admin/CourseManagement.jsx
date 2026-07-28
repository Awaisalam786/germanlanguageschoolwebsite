import React, { useState } from 'react';
import { GraduationCap, Plus, Edit, Trash2, Clock, Calendar, X } from 'lucide-react';
import { initialCourses } from '../mockData/seedData';

export default function CourseManagement() {
  const [courses, setCourses] = useState(initialCourses);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    level: 'B1',
    title: '',
    duration: '8 Weeks (80 Hours)',
    fees: '€590',
    schedule: 'Mon, Wed, Fri (18:00 - 20:30 CEST)',
    seats: 15,
    instructor: 'Dr. Michael Weber',
    description: ''
  });

  const handleOpenAdd = () => {
    setEditingCourse(null);
    setFormData({
      level: 'B1',
      title: '',
      duration: '8 Weeks (80 Hours)',
      fees: '€590',
      schedule: 'Mon, Wed, Fri (18:00 - 20:30 CEST)',
      seats: 15,
      instructor: 'Dr. Michael Weber',
      description: ''
    });
    setShowModal(true);
  };

  const handleOpenEdit = (course) => {
    setEditingCourse(course);
    setFormData({ ...course });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (confirm('Delete this course offering?')) {
      setCourses(courses.filter(c => c.id !== id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingCourse) {
      setCourses(courses.map(c => c.id === editingCourse.id ? { ...c, ...formData } : c));
    } else {
      const newCourse = {
        id: `crs-${Date.now()}`,
        enrolled: 0,
        badge: `${formData.level} Intensive`,
        syllabus: ['Grammar checkpoints', 'Goethe exam prep'],
        rating: 5.0,
        ...formData
      };
      setCourses([...courses, newCourse]);
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
          <p className="text-xs text-slate-400">Manage course levels (A1-B2), tuition fees, schedules, and capacity.</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-gold-glow flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Course</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((c) => (
          <div key={c.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-400 font-bold text-xs">
                  {c.level} Level
                </span>
                <span className="text-xs font-bold text-white">{c.fees}</span>
              </div>
              <h3 className="text-base font-bold text-white">{c.title}</h3>
              <p className="text-xs text-slate-400 line-clamp-2">{c.description}</p>
              <div className="text-[11px] text-slate-400 space-y-1 pt-2">
                <div>Duration: <span className="text-slate-200">{c.duration}</span></div>
                <div>Schedule: <span className="text-slate-200">{c.schedule}</span></div>
                <div>Instructor: <span className="text-amber-400 font-semibold">{c.instructor}</span></div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end space-x-2">
              <button onClick={() => handleOpenEdit(c)} className="p-1.5 rounded bg-slate-800 text-amber-400 hover:bg-slate-700">
                <Edit className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded bg-slate-800 text-red-400 hover:bg-slate-700">
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
              <h3 className="text-lg font-bold text-white">{editingCourse ? 'Edit Course' : 'Create Course'}</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Level</label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="A1">A1</option>
                    <option value="A2">A2</option>
                    <option value="B1">B1</option>
                    <option value="B2">B2</option>
                    <option value="C1">C1</option>
                    <option value="C2">C2</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Tuition Fee</label>
                  <input
                    type="text"
                    required
                    value={formData.fees}
                    onChange={(e) => setFormData({ ...formData, fees: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Schedule</label>
                <input
                  type="text"
                  required
                  value={formData.schedule}
                  onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <button type="submit" className="w-full py-3 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs shadow">
                Save Course Details
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
