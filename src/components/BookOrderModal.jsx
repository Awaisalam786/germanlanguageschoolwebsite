import React, { useState } from 'react';
import { X, ShoppingBag, Send, CheckCircle2, AlertCircle, Loader2, MapPin, Phone, User, ExternalLink } from 'lucide-react';

export default function BookOrderModal({ book, isOpen, onClose, businessPhone = '923421189593' }) {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [city, setCity] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [quantity, setQuantity] = useState(1);
  
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [orderResult, setOrderResult] = useState(null);

  if (!isOpen || !book) return null;

  const unitPrice = Number(book.price_pkr || 0);
  const estimatedTotal = unitPrice * quantity;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage('');

    if (quantity < 1 || quantity > 20) {
      setErrorMessage('Quantity must be between 1 and 20.');
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/book-orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          book_id: book.id,
          customer_name: fullName.trim(),
          phone_number: phoneNumber.trim(),
          delivery_address: deliveryAddress.trim(),
          city: city.trim(),
          quantity: Number(quantity)
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit order request.');
      }

      setOrderResult(data);

      // Open WhatsApp automatically
      if (data.whatsapp_url) {
        window.open(data.whatsapp_url, '_blank', 'noopener,noreferrer');
      }
    } catch (err) {
      console.error('Order submission error:', err);
      setErrorMessage(err.message || 'Network error. Please try again or reach out on WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setOrderResult(null);
    setErrorMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl relative my-8 overflow-hidden">
        {/* Top bar */}
        <div className="h-1.5 german-flag-strip absolute top-0 left-0 right-0"></div>

        <button
          onClick={handleClose}
          className="absolute right-4 top-4 p-2 text-slate-400 hover:text-white bg-slate-950 rounded-full hover:bg-slate-800 transition z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 space-y-6">
          {!orderResult ? (
            <>
              {/* Header */}
              <div>
                <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-[11px] font-bold border border-amber-500/30 inline-flex items-center gap-1.5 mb-2">
                  <ShoppingBag className="w-3.5 h-3.5" /> Book Delivery in Pakistan
                </span>
                <h3 className="text-xl font-extrabold text-white">Order {book.title}</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Enter your delivery address below. We will prepare your WhatsApp order message for confirmation.
                </p>
              </div>

              {/* Price summary pill */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-medium">Estimated Amount</div>
                  <div className="text-lg font-black text-amber-400">
                    ₨ {estimatedTotal.toLocaleString()} PKR
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400">Unit: ₨ {unitPrice.toLocaleString()} PKR</span>
                  <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">Cash/Online Transfer on verification</div>
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-2 text-red-400 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>{errorMessage}</p>
                </div>
              )}

              {/* Order Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-amber-400" /> Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Muhammad Ali"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-amber-400" /> WhatsApp / Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 0300 1234567"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" /> City *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Lahore, Karachi, Islamabad"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" /> Complete Delivery Address *
                  </label>
                  <textarea
                    required
                    rows={2}
                    placeholder="e.g. House 14, Street 3, Sector F-8/2, Islamabad"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Quantity</label>
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    {[1, 2, 3, 4, 5, 10].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'Copy' : 'Copies'}</option>
                    ))}
                  </select>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 py-3 rounded-xl font-bold text-sm shadow-gold-glow transition flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Preparing Order...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Continue to WhatsApp</span>
                      </>
                    )}
                  </button>
                  <p className="text-[11px] text-slate-400 text-center mt-2">
                    Clicking opens WhatsApp with your pre-filled order request. You must tap <strong>Send</strong> in WhatsApp to submit.
                  </p>
                </div>
              </form>
            </>
          ) : (
            /* Success confirmation screen */
            <div className="space-y-6 text-center py-2">
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">Order Request Created</span>
                <h3 className="text-xl font-extrabold text-white mt-1">Order Reference: {orderResult.order_ref}</h3>
                <p className="text-xs text-slate-300 mt-2 max-w-sm mx-auto leading-relaxed">
                  Your details have been logged in our system. Please make sure to press <strong>Send</strong> in WhatsApp to complete your message to our admissions team.
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-left text-xs space-y-2">
                <div className="flex justify-between border-b border-slate-800/80 pb-2">
                  <span className="text-slate-400">Book:</span>
                  <span className="font-semibold text-white">{book.title}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/80 pb-2">
                  <span className="text-slate-400">Recipient:</span>
                  <span className="font-semibold text-white">{fullName} ({city})</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/80 pb-2">
                  <span className="text-slate-400">Payable Amount:</span>
                  <span className="font-bold text-amber-400">₨ {estimatedTotal.toLocaleString()} PKR</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Payment Status:</span>
                  <span className="font-bold text-amber-400">Pending Manual Verification</span>
                </div>
              </div>

              <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-left text-[11px] text-amber-300 space-y-1">
                <p className="font-bold">Next Steps:</p>
                <ol className="list-decimal list-inside space-y-0.5 text-slate-300">
                  <li>Send the WhatsApp message to our admissions team.</li>
                  <li>Our team verifies stock availability and provides payment details (Bank Transfer/JazzCash/EasyPaisa).</li>
                  <li>Once payment is verified, we dispatch your book with courier tracking details.</li>
                </ol>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                {orderResult.whatsapp_url && (
                  <a
                    href={orderResult.whatsapp_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 rounded-xl text-xs transition"
                  >
                    <ExternalLink className="w-4 h-4" /> Open WhatsApp Again
                  </a>
                )}
                <button
                  onClick={handleClose}
                  className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
