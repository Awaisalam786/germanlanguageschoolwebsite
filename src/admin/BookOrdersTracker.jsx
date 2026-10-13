import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Edit, Trash2, X, Loader2, CheckCircle2, Clock, Package, Truck, ExternalLink, Send, AlertCircle, MapPin, Phone } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function BookOrdersTracker() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const [formData, setFormData] = useState({
    order_ref: '',
    customer_name: '',
    phone_number: '',
    delivery_address: '',
    city: '',
    book_title: '',
    quantity: 1,
    final_payable_pkr: '',
    payment_status: 'Pending Confirmation',
    dispatch_status: 'Processing',
    courier_name: '',
    tracking_number: '',
    tracking_url: '',
    notes: ''
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setErrorMessage('');
    
    // Try fetching from book_manual_orders first
    let { data, error } = await supabase
      .from('book_manual_orders')
      .select('*')
      .order('created_at', { ascending: false });

    // If table doesn't exist yet, fallback to legacy book_orders
    if (error && error.message?.includes('does not exist')) {
      const fallback = await supabase
        .from('book_orders')
        .select('*')
        .order('created_at', { ascending: false });
      data = fallback.data;
      error = fallback.error;
    }

    if (!error && data) {
      setOrders(data);
    } else if (error) {
      console.warn('Could not fetch book orders:', error.message);
      setErrorMessage(error.message);
    }
    setLoading(false);
  };

  const handleOpenAdd = () => {
    setEditingOrder(null);
    setErrorMessage('');
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    setFormData({
      order_ref: `GLS-BK-${randomSuffix}`,
      customer_name: '',
      phone_number: '',
      delivery_address: '',
      city: '',
      book_title: '',
      quantity: 1,
      final_payable_pkr: '',
      payment_status: 'Pending Confirmation',
      dispatch_status: 'Processing',
      courier_name: '',
      tracking_number: '',
      tracking_url: '',
      notes: ''
    });
    setShowModal(true);
  };

  const handleOpenEdit = (order) => {
    setEditingOrder(order);
    setErrorMessage('');
    setFormData({
      order_ref: order.order_ref || `ORD-${order.id?.slice(0, 8)}`,
      customer_name: order.customer_name || order.customer_email || '',
      phone_number: order.phone_number || '',
      delivery_address: order.delivery_address || '',
      city: order.city || '',
      book_title: order.book_title || 'Book Order',
      quantity: order.quantity || 1,
      final_payable_pkr: order.final_payable_pkr != null ? String(order.final_payable_pkr) : (order.amount_total != null ? String(order.amount_total) : ''),
      payment_status: order.payment_status || 'Pending Confirmation',
      dispatch_status: order.dispatch_status || 'Processing',
      courier_name: order.courier_name || '',
      tracking_number: order.tracking_number || '',
      tracking_url: order.tracking_url || '',
      notes: order.notes || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this book order log? This action cannot be undone.')) {
      const table = editingOrder?.order_ref ? 'book_manual_orders' : 'book_orders';
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (!error) {
        setOrders(orders.filter(o => o.id !== id));
      } else {
        alert('Failed to delete order: ' + (error?.message || 'Database error'));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage('');

    const payload = {
      order_ref: formData.order_ref.trim(),
      customer_name: formData.customer_name.trim(),
      phone_number: formData.phone_number.trim(),
      delivery_address: formData.delivery_address.trim(),
      city: formData.city.trim(),
      book_title: formData.book_title.trim(),
      quantity: Number(formData.quantity) || 1,
      final_payable_pkr: parseFloat(formData.final_payable_pkr) || 0,
      total_price_pkr: parseFloat(formData.final_payable_pkr) || 0,
      unit_price_pkr: (parseFloat(formData.final_payable_pkr) || 0) / (Number(formData.quantity) || 1),
      payment_status: formData.payment_status,
      dispatch_status: formData.dispatch_status,
      courier_name: formData.courier_name.trim() || null,
      tracking_number: formData.tracking_number.trim() || null,
      tracking_url: formData.tracking_url.trim() || null,
      notes: formData.notes.trim() || null
    };

    try {
      if (editingOrder) {
        const { data, error } = await supabase
          .from('book_manual_orders')
          .update(payload)
          .eq('id', editingOrder.id)
          .select()
          .single();

        if (error) throw error;
        if (data) {
          setOrders(orders.map(o => o.id === editingOrder.id ? data : o));
          setShowModal(false);
        }
      } else {
        const { data, error } = await supabase
          .from('book_manual_orders')
          .insert([payload])
          .select()
          .single();

        if (error) throw error;
        if (data) {
          setOrders([data, ...orders]);
          setShowModal(false);
        }
      }
    } catch (err) {
      console.error('Error saving order:', err);
      setErrorMessage(err.message || 'Database error. Make sure book_manual_orders table migration is applied.');
    } finally {
      setSubmitting(false);
    }
  };

  const shareTrackingViaWhatsApp = (order) => {
    const phone = (order.phone_number || '').replace(/^0/, '92').replace(/[^0-9]/g, '');
    if (!phone) {
      alert('No phone number recorded for this customer.');
      return;
    }

    const courier = order.courier_name || 'Courier';
    const tracking = order.tracking_number ? `Tracking Number: ${order.tracking_number}` : '';
    const trackingLink = order.tracking_url ? `Track here: ${order.tracking_url}` : '';

    const msg = [
      `Salam ${order.customer_name}! 📦`,
      `Your book order for *${order.book_title}* (Ref: ${order.order_ref}) has been dispatched via *${courier}*.`,
      tracking,
      trackingLink,
      `Please let us know once you receive the package. Thank you for learning with German Learning School!`
    ].filter(Boolean).join('\n\n');

    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const getPaymentBadge = (status) => {
    switch (status) {
      case 'Paid':
        return <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-bold">Paid</span>;
      case 'Awaiting Payment':
        return <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[11px] font-bold">Awaiting Payment</span>;
      case 'Cancelled':
        return <span className="px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-[11px] font-bold">Cancelled</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[11px] font-bold">Pending Confirmation</span>;
    }
  };

  const getDispatchBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-bold flex items-center gap-1 w-fit"><CheckCircle2 className="w-3 h-3" /> Delivered</span>;
      case 'Shipped':
        return <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[11px] font-bold flex items-center gap-1 w-fit"><Truck className="w-3 h-3" /> Shipped</span>;
      case 'Cancelled':
        return <span className="px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-[11px] font-bold">Cancelled</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-[11px] font-bold flex items-center gap-1 w-fit"><Package className="w-3 h-3" /> Processing</span>;
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
          <p className="text-xs text-slate-400">Track customer delivery addresses, manual payment verification, and courier dispatch.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-amber-500 text-slate-950 px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-amber-400 transition flex items-center gap-2 shadow-gold-glow"
        >
          <Plus className="w-4 h-4" />
          Log Manual Order
        </button>
      </div>

      {errorMessage && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start gap-3 text-amber-300 text-xs">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Database Notice:</p>
            <p className="mt-0.5 text-slate-300">
              The `book_manual_orders` table migration is pending approval. Once the migration SQL is executed in Supabase, order history will be synchronized automatically.
            </p>
          </div>
        </div>
      )}

      {/* Orders List */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="px-5 py-4">Order Ref / Date</th>
                <th className="px-5 py-4">Customer & City</th>
                <th className="px-5 py-4">Book & Qty</th>
                <th className="px-5 py-4">Amount</th>
                <th className="px-5 py-4">Payment</th>
                <th className="px-5 py-4">Dispatch & Courier</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-slate-500 text-sm">
                    No book orders recorded yet. When customers submit the website order form or orders are logged manually, they will appear here.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-800/30 transition">
                    <td className="px-5 py-4">
                      <div className="font-mono font-bold text-white text-xs">{order.order_ref || `ORD-${order.id?.slice(0, 8)}`}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {order.created_at ? new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-bold text-white">{order.customer_name || 'N/A'}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-amber-400" /> {order.phone_number || order.customer_email || 'N/A'}
                      </div>
                      {order.city && (
                        <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-amber-400" /> {order.city}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-medium text-white">{order.book_title || 'Netzwerk Neu'}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Qty: {order.quantity || 1}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-bold text-amber-400">
                        ₨ {Number(order.final_payable_pkr || order.amount_total || 0).toLocaleString()} PKR
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {getPaymentBadge(order.payment_status)}
                    </td>
                    <td className="px-5 py-4 space-y-1">
                      {getDispatchBadge(order.dispatch_status)}
                      {order.courier_name && (
                        <div className="text-[10px] text-slate-400">
                          {order.courier_name}: <span className="font-mono text-white">{order.tracking_number || 'Pending Tracking'}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {order.phone_number && (
                          <button
                            onClick={() => shareTrackingViaWhatsApp(order)}
                            className="p-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg transition"
                            title="Share Tracking on WhatsApp"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenEdit(order)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition"
                          title="Edit Order"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(order.id)}
                          className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition"
                          title="Delete Order"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Add Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl relative my-8 overflow-hidden">
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 p-2 text-slate-400 hover:text-white bg-slate-950 rounded-full hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white">{editingOrder ? 'Update Book Order' : 'Log Manual Order'}</h3>
                <p className="text-xs text-slate-400">Update payment status, fulfillment tracking, and dispatch details.</p>
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-2 text-red-400 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>{errorMessage}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Order Reference *</label>
                    <input
                      type="text"
                      required
                      value={formData.order_ref}
                      onChange={(e) => setFormData({...formData, order_ref: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Book Title *</label>
                    <input
                      type="text"
                      required
                      value={formData.book_title}
                      onChange={(e) => setFormData({...formData, book_title: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Customer Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.customer_name}
                      onChange={(e) => setFormData({...formData, customer_name: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">WhatsApp / Phone *</label>
                    <input
                      type="text"
                      required
                      value={formData.phone_number}
                      onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-400 mb-1">Complete Delivery Address</label>
                    <input
                      type="text"
                      value={formData.delivery_address}
                      onChange={(e) => setFormData({...formData, delivery_address: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">City</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Quantity</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.quantity}
                      onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Final Payable Amount (₨ PKR)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.final_payable_pkr}
                      onChange={(e) => setFormData({...formData, final_payable_pkr: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Payment Status (Independent)</label>
                    <select
                      value={formData.payment_status}
                      onChange={(e) => setFormData({...formData, payment_status: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-semibold"
                    >
                      <option value="Pending Confirmation">Pending Confirmation</option>
                      <option value="Awaiting Payment">Awaiting Payment</option>
                      <option value="Paid">Paid</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Dispatch Status (Independent)</label>
                    <select
                      value={formData.dispatch_status}
                      onChange={(e) => setFormData({...formData, dispatch_status: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-semibold"
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-800">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Courier Service</label>
                    <input
                      type="text"
                      placeholder="TCS, Leopards, Trax"
                      value={formData.courier_name}
                      onChange={(e) => setFormData({...formData, courier_name: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Tracking Number</label>
                    <input
                      type="text"
                      placeholder="e.g. 774910294"
                      value={formData.tracking_number}
                      onChange={(e) => setFormData({...formData, tracking_number: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Tracking URL</label>
                    <input
                      type="url"
                      placeholder="https://track.courier.com/..."
                      value={formData.tracking_url}
                      onChange={(e) => setFormData({...formData, tracking_url: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Internal Notes</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Paid via JazzCash, student also enrolled in A1 batch"
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 py-3 rounded-xl font-bold transition flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Saving Order...</span>
                      </>
                    ) : (
                      <span>{editingOrder ? 'Update Order Details' : 'Save Order Log'}</span>
                    )}
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
