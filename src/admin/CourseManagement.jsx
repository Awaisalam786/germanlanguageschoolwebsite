import React, { useState, useEffect } from 'react';
import { GraduationCap, Plus, Edit, Trash2, Clock, Calendar, X, Eye, EyeOff, Star } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function CourseManagement() {
  const [activeTab, setActiveTab] = useState('courses'); // 'courses' or 'bundles'
  const [courses, setCourses] = useState([]);
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showBundleModal, setShowBundleModal] = useState(false);
  
  const [editingCourse, setEditingCourse] = useState(null);
  const [editingBundle, setEditingBundle] = useState(null);
  
  const [courseFormData, setCourseFormData] = useState({
    level: 'B1', title: '', duration: '', price: '', schedule: '', description: '', badge: '', is_featured: false, is_hidden: false
  });
  
  const [bundleFormData, setBundleFormData] = useState({
    title: '', description: '', badge: '', recommendedRibbon: '', duration: '', originalPricePKR: '', bundlePricePKR: '', bundlePriceEUR: '', youSaveText: '', isRecommended: false, is_hidden: false, levelsIncluded: []
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [coursesRes, bundlesRes] = await Promise.all([
      supabase.from('courses').select('*').order('created_at', { ascending: true }),
      supabase.from('course_bundles').select('*').order('created_at', { ascending: true })
    ]);
    if (coursesRes.data) setCourses(coursesRes.data);
    if (bundlesRes.data) setBundles(bundlesRes.data);
    setLoading(false);
  };

  // --- COURSE HANDLERS ---
  const handleOpenCourseAdd = () => {
    setEditingCourse(null);
    setCourseFormData({ level: 'B1', title: '', duration: '', price: '', schedule: '', description: '', badge: '', is_featured: false, is_hidden: false });
    setShowCourseModal(true);
  };

  const handleOpenCourseEdit = (course) => {
    setEditingCourse(course);
    setCourseFormData(course);
    setShowCourseModal(true);
  };

  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    if (editingCourse) {
      const { data } = await supabase.from('courses').update(courseFormData).eq('id', editingCourse.id).select();
      if (data) setCourses(courses.map(c => c.id === editingCourse.id ? data[0] : c));
    } else {
      const { data } = await supabase.from('courses').insert([courseFormData]).select();
      if (data) setCourses([...courses, data[0]]);
    }
    setShowCourseModal(false);
  };

  const deleteCourse = async (id) => {
    if (window.confirm('Delete this course?')) {
      await supabase.from('courses').delete().eq('id', id);
      setCourses(courses.filter(c => c.id !== id));
    }
  };

  // --- BUNDLE HANDLERS ---
  const handleOpenBundleAdd = () => {
    setEditingBundle(null);
    setBundleFormData({ title: '', description: '', badge: '', recommendedRibbon: '', duration: '', originalPricePKR: '', bundlePricePKR: '', bundlePriceEUR: '', youSaveText: '', isRecommended: false, is_hidden: false, levelsIncluded: [] });
    setShowBundleModal(true);
  };

  const handleOpenBundleEdit = (bundle) => {
    setEditingBundle(bundle);
    setBundleFormData(bundle);
    setShowBundleModal(true);
  };

  const handleBundleSubmit = async (e) => {
    e.preventDefault();
    if (editingBundle) {
      const { data } = await supabase.from('course_bundles').update(bundleFormData).eq('id', editingBundle.id).select();
      if (data) setBundles(bundles.map(b => b.id === editingBundle.id ? data[0] : b));
    } else {
      const { data } = await supabase.from('course_bundles').insert([bundleFormData]).select();
      if (data) setBundles([...bundles, data[0]]);
    }
    setShowBundleModal(false);
  };

  const deleteBundle = async (id) => {
    if (window.confirm('Delete this bundle?')) {
      await supabase.from('course_bundles').delete().eq('id', id);
      setBundles(bundles.filter(b => b.id !== id));
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-amber-400" />
            <span>Course & Bundles Management</span>
          </h2>
          <p className="text-xs text-slate-400">Manage individual courses and package bundles dynamically.</p>
        </div>
        <div className="flex gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button onClick={() => setActiveTab('courses')} className={`px-4 py-2 rounded-lg text-xs font-bold transition ${activeTab === 'courses' ? 'bg-amber-500 text-slate-900' : 'text-slate-400 hover:text-white'}`}>Individual Courses</button>
          <button onClick={() => setActiveTab('bundles')} className={`px-4 py-2 rounded-lg text-xs font-bold transition ${activeTab === 'bundles' ? 'bg-amber-500 text-slate-900' : 'text-slate-400 hover:text-white'}`}>Course Bundles</button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10 text-amber-400 font-bold">Loading data...</div>
      ) : activeTab === 'courses' ? (
        // COURSES VIEW
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={handleOpenCourseAdd} className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2"><Plus className="w-4 h-4" /> Add Course</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {courses.map(course => (
              <div key={course.id} className={`bg-slate-900 border ${course.is_hidden ? 'border-red-500/30 opacity-60' : 'border-slate-800'} rounded-2xl p-6 relative flex flex-col justify-between`}>
                <div className="absolute top-0 right-0 bg-slate-800 text-slate-300 font-bold px-3 py-1 rounded-bl-2xl text-xs flex gap-2">
                  {course.is_featured && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
                  {course.is_hidden ? <EyeOff className="w-3.5 h-3.5 text-red-400" /> : <Eye className="w-3.5 h-3.5 text-emerald-400" />}
                  {course.level}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white pr-16">{course.title}</h3>
                  <div className="text-xs text-slate-400 mt-2 space-y-1">
                    <div><Clock className="w-3 h-3 inline mr-1 text-amber-400"/>{course.duration}</div>
                    <div><Calendar className="w-3 h-3 inline mr-1 text-amber-400"/>{course.schedule}</div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center">
                  <div className="text-emerald-400 font-bold">{course.price}</div>
                  <div className="flex gap-2">
                    <button onClick={() => handleOpenCourseEdit(course)} className="p-1.5 bg-slate-800 text-amber-400 rounded"><Edit className="w-4 h-4"/></button>
                    <button onClick={() => deleteCourse(course.id)} className="p-1.5 bg-slate-800 text-red-400 rounded"><Trash2 className="w-4 h-4"/></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // BUNDLES VIEW
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={handleOpenBundleAdd} className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2"><Plus className="w-4 h-4" /> Add Bundle</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bundles.map(bundle => (
              <div key={bundle.id} className={`bg-slate-900 border ${bundle.is_hidden ? 'border-red-500/30 opacity-60' : 'border-slate-800'} rounded-2xl p-6 relative flex flex-col justify-between`}>
                <div className="absolute top-0 right-0 bg-slate-800 text-slate-300 font-bold px-3 py-1 rounded-bl-2xl text-xs flex gap-2">
                  {bundle.isRecommended && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
                  {bundle.is_hidden ? <EyeOff className="w-3.5 h-3.5 text-red-400" /> : <Eye className="w-3.5 h-3.5 text-emerald-400" />}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white pr-12">{bundle.title}</h3>
                  <div className="text-xs text-slate-400 mt-2">{bundle.description}</div>
                  <div className="mt-3 flex gap-1 flex-wrap">
                    {(bundle.levelsIncluded || []).map(lvl => (
                      <span key={lvl} className="px-2 py-0.5 bg-slate-800 text-[10px] rounded text-white">{lvl}</span>
                    ))}
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center">
                  <div className="text-emerald-400 font-bold">{bundle.bundlePricePKR}</div>
                  <div className="flex gap-2">
                    <button onClick={() => handleOpenBundleEdit(bundle)} className="p-1.5 bg-slate-800 text-amber-400 rounded"><Edit className="w-4 h-4"/></button>
                    <button onClick={() => deleteBundle(bundle.id)} className="p-1.5 bg-slate-800 text-red-400 rounded"><Trash2 className="w-4 h-4"/></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* COURSE MODAL */}
      {showCourseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-slate-800 flex justify-between"><h3 className="text-lg font-bold text-white">{editingCourse ? 'Edit Course' : 'Add Course'}</h3><button onClick={() => setShowCourseModal(false)} className="text-slate-400"><X className="w-5 h-5"/></button></div>
            <form onSubmit={handleCourseSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold text-slate-400 mb-1">Level</label><input type="text" required value={courseFormData.level} onChange={e => setCourseFormData({...courseFormData, level: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white" /></div>
                <div><label className="block text-xs font-bold text-slate-400 mb-1">Title</label><input type="text" required value={courseFormData.title} onChange={e => setCourseFormData({...courseFormData, title: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold text-slate-400 mb-1">Duration</label><input type="text" required value={courseFormData.duration} onChange={e => setCourseFormData({...courseFormData, duration: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white" /></div>
                <div><label className="block text-xs font-bold text-slate-400 mb-1">Price</label><input type="text" required value={courseFormData.price} onChange={e => setCourseFormData({...courseFormData, price: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white" /></div>
              </div>
              <div><label className="block text-xs font-bold text-slate-400 mb-1">Schedule</label><input type="text" required value={courseFormData.schedule} onChange={e => setCourseFormData({...courseFormData, schedule: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white" /></div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-xs text-white"><input type="checkbox" checked={courseFormData.is_featured} onChange={e => setCourseFormData({...courseFormData, is_featured: e.target.checked})} /> Featured</label>
                <label className="flex items-center gap-2 text-xs text-white"><input type="checkbox" checked={courseFormData.is_hidden} onChange={e => setCourseFormData({...courseFormData, is_hidden: e.target.checked})} /> Hidden</label>
              </div>
              <div className="flex justify-end gap-3 pt-4"><button type="button" onClick={() => setShowCourseModal(false)} className="text-xs text-slate-400">Cancel</button><button type="submit" className="px-6 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs">Save</button></div>
            </form>
          </div>
        </div>
      )}

      {/* BUNDLE MODAL */}
      {showBundleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-slate-800 flex justify-between"><h3 className="text-lg font-bold text-white">{editingBundle ? 'Edit Bundle' : 'Add Bundle'}</h3><button onClick={() => setShowBundleModal(false)} className="text-slate-400"><X className="w-5 h-5"/></button></div>
            <form onSubmit={handleBundleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div><label className="block text-xs font-bold text-slate-400 mb-1">Title</label><input type="text" required value={bundleFormData.title} onChange={e => setBundleFormData({...bundleFormData, title: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white" /></div>
              <div><label className="block text-xs font-bold text-slate-400 mb-1">Description</label><textarea required value={bundleFormData.description} onChange={e => setBundleFormData({...bundleFormData, description: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white h-20" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold text-slate-400 mb-1">Price PKR</label><input type="text" required value={bundleFormData.bundlePricePKR} onChange={e => setBundleFormData({...bundleFormData, bundlePricePKR: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white" /></div>
                <div><label className="block text-xs font-bold text-slate-400 mb-1">Price EUR</label><input type="text" required value={bundleFormData.bundlePriceEUR} onChange={e => setBundleFormData({...bundleFormData, bundlePriceEUR: e.target.value})} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white" /></div>
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-xs text-white"><input type="checkbox" checked={bundleFormData.isRecommended} onChange={e => setBundleFormData({...bundleFormData, isRecommended: e.target.checked})} /> Recommended Badge</label>
                <label className="flex items-center gap-2 text-xs text-white"><input type="checkbox" checked={bundleFormData.is_hidden} onChange={e => setBundleFormData({...bundleFormData, is_hidden: e.target.checked})} /> Hidden</label>
              </div>
              <div className="flex justify-end gap-3 pt-4"><button type="button" onClick={() => setShowBundleModal(false)} className="text-xs text-slate-400">Cancel</button><button type="submit" className="px-6 py-2 bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs">Save</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
