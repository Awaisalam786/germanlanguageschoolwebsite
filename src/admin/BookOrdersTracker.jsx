import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Edit, Trash2, X, Loader2, CheckCircle, Clock, Package } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function BookOrdersTracker() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  
  const [formData, setFormData] = useState({
    customer_name: '',
    phone_number: '',
    book_title: '',
    status: 'Pending'
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('book_orders').select('*').order('order_date', { ascending: false });
    if (!error && data) {
      setOrders(data);
    }
    setLoading(false);
  };

  const handleOpenAdd = () => {
    setEditingOrder(null);
    setFormData({
      customer_name: '',
      phone_number: '',
      book_title: '',
      status: 'Pending'
    });
    setShowModal(true);
  };

  const handleOpenEdit = (order) => {
    setEditingOrder(order);
    setFormData({
      customer_name: order.customer_name,
      phone_number: order.phone_number,
      book_title: order.book_title,
      status: order.status
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this order log?')) {
      const { error } = await supabase.from('book_orders').delete().eq('id', id);
      if (!error) {
        setOrders(orders.filter(o => o.id !== id));
      } else {
        alert('Failed to delete order');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const payload = {
      customer_name: formData.customer_name,
      phone_number: formData.phone_number,
      book_title: formData.book_title,
      status: formData.status
    };

    if (editingOrder) {
      const { data, error } = await supabase.from('book_orders').update(payload).eq('id', editingOrder.id).select().single();
      if (!error && data) {
        setOrders(orders.map(o => o.id === editingOrder.id ? data : o));
        setShowModal(false);
      } else {
        alert('Failed to update order');
      }
    } else {
      const { data, error } = await supabase.from('book_orders').insert([payload]).select().single();
      if (!error && data) {
        setOrders([data, ...orders]);
        setShowModal(false);
      } else {
        alert('Failed to add order');
      }
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold flex items-center gap-1.5 w-fit"><CheckCircle className="w-3.5 h-3.5" /> Delivered</span>;
      case 'Confirmed':
        return <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold flex items-center gap-1.5 w-fit"><Package className="w-3.5 h-3.5" /> Confirmed</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold flex items-center gap-1.5 w-fit"><Clock className="w-3.5 h-3.5" /> Pending</span>;
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
            <ShoppingCart className="w-6 h-6 text-amber-400" />
            <span>Book Orders Tracker</span>
          </h2>
          <p className="text-xs text-slate-400">Manually log and track WhatsApp book orders.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-amber-500 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold hover:bg-amber-400 transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Log New Order
        </button>
      </div>

      {/* Orders List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/50 border-b border-slate-800">
                <th className="px-6 py-4 text-xs font-bold text-slate-400">Customer Name</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400">Phone</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400">Book Title</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500 text-sm">
                    No orders logged yet.
                  </td>
                </tr>
              ) : orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-800/20 transition group">
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-white">{order.customer_name}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-300">
                    {order.phone_number}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-200">
                    {order.book_title}
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-400">
                    {new Date(order.order_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleOpenEdit(order)} className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(order.id)} className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl relative my-8">
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 p-2 text-slate-400 hover:text-white bg-slate-950 rounded-full hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="p-8 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white">{editingOrder ? 'Edit Order' : 'Log New Order'}</h3>
                <p className="text-xs text-slate-400">Enter customer and book details below.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Customer Name</label>
                    <input
                      type="text"
                      required
                      value={formData.customer_name}
                      onChange={(e) => setFormData({...formData, customer_name: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Phone Number</label>
                    <input
                      type="text"
                      required
                      value={formData.phone_number}
                      onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Book Title</label>
                    <input
                      type="text"
                      required
                      value={formData.book_title}
                      onChange={(e) => setFormData({...formData, book_title: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Order Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    type="submit"
                    className="w-full bg-amber-500 text-slate-950 py-3 rounded-xl font-bold shadow-gold-glow hover:bg-amber-400 transition"
                  >
                    {editingOrder ? 'Update Order' : 'Log Order'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
