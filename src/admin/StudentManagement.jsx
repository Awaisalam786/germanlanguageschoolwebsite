import React, { useState, useEffect } from 'react';
import { Users, Search, Plus, Edit, Trash2, CheckCircle2, X, Loader2, BarChart } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    course_level: 'B1 - Intermediate',
    batch: '',
    progress_percentage: 0,
    student_status: 'Active',
    attendance: '95%',
    grade: 'A (90/100)',
    payment_status: 'Paid',
    mode: 'Online'
  });

  const filteredStudents = students.filter(s => 
    (s.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (s.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.course_level || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.batch || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('students').select('*').order('join_date', { ascending: false });
    if (!error && data) {
      setStudents(data);
    }
    setLoading(false);
  };

  const handleOpenAdd = () => {
    setEditingStudent(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      course_level: 'B1 - Intermediate',
      batch: '',
      progress_percentage: 0,
      student_status: 'Active',
      attendance: '95%',
      grade: 'A (90/100)',
      payment_status: 'Paid',
      mode: 'Online'
    });
    setShowModal(true);
  };

  const handleOpenEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      email: student.email,
      phone: student.phone,
      course_level: student.course_level,
      batch: student.batch || '',
      progress_percentage: student.progress_percentage || 0,
      student_status: student.student_status || 'Active',
      attendance: student.attendance,
      grade: student.grade,
      payment_status: student.payment_status,
      mode: student.mode
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student record?')) {
      const { error } = await supabase.from('students').delete().eq('id', id);
      if (!error) {
        setStudents(students.filter(s => s.id !== id));
      } else {
        alert('Failed to delete student');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      course_level: formData.course_level,
      batch: formData.batch,
      progress_percentage: parseInt(formData.progress_percentage, 10),
      student_status: formData.student_status,
      attendance: formData.attendance,
      grade: formData.grade,
      payment_status: formData.payment_status,
      mode: formData.mode
    };

    if (editingStudent) {
      const { data, error } = await supabase.from('students').update(payload).eq('id', editingStudent.id).select().single();
      if (!error && data) {
        setStudents(students.map(s => s.id === editingStudent.id ? data : s));
        setShowModal(false);
      }
    } else {
      const { data, error } = await supabase.from('students').insert([payload]).select().single();
      if (!error && data) {
        setStudents([data, ...students]);
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
            <Users className="w-6 h-6 text-amber-400" />
            <span>Student Record Management</span>
          </h2>
          <p className="text-xs text-slate-400">Add, track progress, assign batches, and update academic records.</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-gold-glow flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Student</span>
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          placeholder="Search students by name, email, level or batch..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
        />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-bold text-[10px]">
              <tr>
                <th className="p-4">Student & Contact</th>
                <th className="p-4">Level & Batch</th>
                <th className="p-4">Course Progress</th>
                <th className="p-4">Status & Payment</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredStudents.map((std) => (
                <tr key={std.id} className="hover:bg-slate-950/60">
                  <td className="p-4">
                    <div className="font-bold text-white text-sm">{std.name}</div>
                    <div className="text-slate-400 mt-1">{std.email}</div>
                    <div className="text-slate-400">{std.phone}</div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-bold text-[10px] border border-amber-500/20">
                      {std.course_level}
                    </span>
                    <div className="text-[11px] font-semibold text-emerald-400 mt-1">{std.batch || 'Unassigned Batch'}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{std.mode}</div>
                  </td>
                  <td className="p-4 min-w-[150px]">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-white">{std.progress_percentage || 0}%</span>
                      <BarChart className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5">
                      <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${std.progress_percentage || 0}%` }}></div>
                    </div>
                    <div className="mt-2 text-[10px] text-slate-400">Att: {std.attendance} | Grd: {std.grade}</div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1.5 flex flex-col items-start">
                      <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${
                        std.student_status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                        std.student_status === 'Completed' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                        'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {std.student_status || 'Active'}
                      </span>
                      <span className={`px-2 py-0.5 rounded border text-[10px] ${
                        std.payment_status === 'Paid' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                        'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}>
                        {std.payment_status}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button onClick={() => handleOpenEdit(std)} className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-400 transition">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(std.id)} className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-red-400 transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Student Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 relative space-y-4 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">
                {editingStudent ? 'Edit Student Details' : 'Add New Student Record'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest border-b border-slate-800 pb-1">Personal Info</h4>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Full Name</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:border-amber-500" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Email</label>
                    <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:border-amber-500" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Phone</label>
                    <input type="tel" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:border-amber-500" />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest border-b border-slate-800 pb-1">Course & Batch</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Course Enrolled</label>
                    <select value={formData.course_level} onChange={(e) => setFormData({...formData, course_level: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:border-amber-500">
                      <option>A1 - Beginner</option>
                      <option>A2 - Elementary</option>
                      <option>B1 - Intermediate</option>
                      <option>B2 - Upper Intermediate</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Batch Assignment</label>
                    <input type="text" placeholder="e.g. Batch Oct-2026" value={formData.batch} onChange={(e) => setFormData({ ...formData, batch: e.target.value })} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:border-amber-500" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Overall Progress (%)</label>
                    <input type="number" min="0" max="100" required value={formData.progress_percentage} onChange={(e) => setFormData({ ...formData, progress_percentage: e.target.value })} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:border-amber-500" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Student Status</label>
                    <select value={formData.student_status} onChange={(e) => setFormData({...formData, student_status: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:border-amber-500">
                      <option value="Active">Active</option>
                      <option value="Completed">Completed</option>
                      <option value="Paused">Paused</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest border-b border-slate-800 pb-1">Academic & Payment</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Attendance</label>
                    <input type="text" value={formData.attendance} onChange={(e) => setFormData({ ...formData, attendance: e.target.value })} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Grade</label>
                    <input type="text" value={formData.grade} onChange={(e) => setFormData({ ...formData, grade: e.target.value })} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white" />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Payment</label>
                    <select value={formData.payment_status} onChange={(e) => setFormData({...formData, payment_status: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white">
                      <option>Paid</option>
                      <option>Pending</option>
                    </select>
                  </div>
                </div>
              </div>

              <button type="submit" className="w-full py-3 mt-4 bg-amber-500 hover:bg-amber-400 transition text-slate-950 font-bold rounded-xl text-xs shadow-gold-glow">
                Save Comprehensive Record
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
