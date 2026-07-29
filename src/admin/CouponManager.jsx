import React, { useState, useEffect } from 'react';
import { Ticket, Plus, Edit, Trash2, CheckCircle2, XCircle, Loader2, X } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function CouponManager() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [courses, setCourses] = useState([]);
  const [books, setBooks] = useState([]);

  const [formData, setFormData] = useState({
    coupon_code: '',
    discount_type: 'percentage',
    discount_value: 0,
    applicable_to: 'All Courses',
    target_item_id: '',
    expiry_date: '',
    usage_limit: '',
    is_active: true
  });

  useEffect(() => {
    fetchCoupons();
    fetchCoursesAndBooks();
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('coupons').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      setCoupons(data);
    }
    setLoading(false);
  };

  const fetchCoursesAndBooks = async () => {
    const [coursesRes, booksRes] = await Promise.all([
      supabase.from('courses').select('id, title'),
      supabase.from('books').select('id, title')
    ]);
    if (coursesRes.data) setCourses(coursesRes.data);
    if (booksRes.data) setBooks(booksRes.data);
  };

  const handleOpenAdd = () => {
    setEditingCoupon(null);
    setFormData({
      coupon_code: '',
      discount_type: 'percentage',
      discount_value: 0,
      applicable_to: 'All Courses',
      target_item_id: '',
      expiry_date: '',
      usage_limit: '',
      is_active: true
    });
    setShowModal(true);
  };

  const handleOpenEdit = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      coupon_code: coupon.coupon_code,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      applicable_to: coupon.applicable_to,
      target_item_id: coupon.target_item_id || '',
      expiry_date: coupon.expiry_date ? new Date(coupon.expiry_date).toISOString().split('T')[0] : '',
      usage_limit: coupon.usage_limit || '',
      is_active: coupon.is_active
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this coupon?')) {
      const { error } = await supabase.from('coupons').delete().eq('id', id);
      if (!error) {
        setCoupons(coupons.filter(c => c.id !== id));
      } else {
        alert('Failed to delete coupon.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const payload = {
      ...formData,
      usage_limit: formData.usage_limit ? parseInt(formData.usage_limit) : null,
      expiry_date: formData.expiry_date ? new Date(formData.expiry_date).toISOString() : null,
      target_item_id: (formData.applicable_to === 'Specific Course' || formData.applicable_to === 'Specific Book') ? formData.target_item_id : null
    };

    if (editingCoupon) {
      const { data, error } = await supabase.from('coupons').update(payload).eq('id', editingCoupon.id).select().single();
      if (!error && data) {
        setCoupons(coupons.map(c => c.id === editingCoupon.id ? data : c));
        setShowModal(false);
      } else {
        alert('Failed to update coupon.');
      }
    } else {
      const { data, error } = await supabase.from('coupons').insert([payload]).select().single();
      if (!error && data) {
        setCoupons([data, ...coupons]);
        setShowModal(false);
      } else {
        alert('Failed to create coupon.');
      }
    }
  };

  const toggleActive = async (coupon) => {
    const { data, error } = await supabase.from('coupons').update({ is_active: !coupon.is_active }).eq('id', coupon.id).select().single();
    if (!error && data) {
      setCoupons(coupons.map(c => c.id === coupon.id ? data : c));
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Ticket className="w-6 h-6 text-amber-400" />
            <span>Discount Coupon Manager</span>
          </h2>
          <p className="text-xs text-slate-400">Create promotional codes for courses and study materials.</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-gold-glow flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create Coupon</span>
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-amber-500 animate-spin" /></div>
          ) : (
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase font-bold text-[10px]">
                <tr>
                  <th className="p-4">Coupon Code</th>
                  <th className="p-4">Discount</th>
                  <th className="p-4">Applicable To</th>
                  <th className="p-4">Usage Limits</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {coupons.length === 0 ? (
                  <tr><td colSpan="6" className="p-8 text-center text-slate-500">No coupons available.</td></tr>
                ) : coupons.map((coupon) => (
                  <tr key={coupon.id} className={`hover:bg-slate-950/60 transition ${!coupon.is_active && 'opacity-50'}`}>
                    <td className="p-4 font-bold text-amber-400 text-sm tracking-wider">{coupon.coupon_code}</td>
                    <td className="p-4 font-bold text-white">
                      {coupon.discount_type === 'percentage' ? `${coupon.discount_value}% OFF` : `Rs ${coupon.discount_value} OFF`}
                    </td>
                    <td className="p-4 text-slate-300">{coupon.applicable_to}</td>
                    <td className="p-4">
                      <div>Used: {coupon.times_used} {coupon.usage_limit && `/ ${coupon.usage_limit}`}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {coupon.expiry_date ? `Exp: ${new Date(coupon.expiry_date).toLocaleDateString()}` : 'No Expiry'}
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <button onClick={() => toggleActive(coupon)} className="inline-flex items-center gap-1 focus:outline-none">
                        {coupon.is_active ? (
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px] border border-emerald-500/30">
                            <CheckCircle2 className="w-3 h-3" /> Active
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-500/20 text-slate-400 font-bold text-[10px] border border-slate-500/30">
                            <XCircle className="w-3 h-3" /> Inactive
                          </span>
                        )}
                      </button>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button onClick={() => handleOpenEdit(coupon)} className="p-2 rounded bg-slate-800 text-amber-400 hover:bg-slate-700 transition">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(coupon.id)} className="p-2 rounded bg-slate-800 text-red-400 hover:bg-slate-700 transition">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl my-8">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Ticket className="w-5 h-5 text-amber-400" />
                {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Coupon Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., SAVE20"
                  value={formData.coupon_code}
                  onChange={(e) => setFormData({ ...formData, coupon_code: e.target.value.toUpperCase() })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500 font-mono tracking-wider"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Discount Type</label>
                  <select
                    value={formData.discount_type}
                    onChange={(e) => setFormData({ ...formData, discount_type: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (PKR)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Discount Value</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.discount_value}
                    onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Applicable To</label>
                <select
                  value={formData.applicable_to}
                  onChange={(e) => setFormData({ ...formData, applicable_to: e.target.value, target_item_id: '' })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="All Courses">All Courses</option>
                  <option value="All Books">All Books</option>
                  <option value="Specific Course">Specific Course</option>
                  <option value="Specific Book">Specific Book</option>
                </select>
              </div>

              {formData.applicable_to === 'Specific Course' && (
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Select Course</label>
                  <select
                    required
                    value={formData.target_item_id}
                    onChange={(e) => setFormData({ ...formData, target_item_id: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="">-- Choose Course --</option>
                    {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                  </select>
                </div>
              )}

              {formData.applicable_to === 'Specific Book' && (
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Select Book</label>
                  <select
                    required
                    value={formData.target_item_id}
                    onChange={(e) => setFormData({ ...formData, target_item_id: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="">-- Choose Book --</option>
                    {books.map(b => <option key={b.id} value={b.id}>{b.title}</option>)}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Expiry Date (Optional)</label>
                  <input
                    type="date"
                    value={formData.expiry_date}
                    onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Usage Limit (Optional)</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g., 50"
                    value={formData.usage_limit}
                    onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 accent-amber-500 bg-slate-950 border-slate-700 rounded"
                />
                <label htmlFor="isActive" className="text-xs text-slate-300 cursor-pointer">
                  Coupon is currently active
                </label>
              </div>

              <button type="submit" className="w-full py-3 mt-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-gold-glow transition">
                {editingCoupon ? 'Save Changes' : 'Create Coupon'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
