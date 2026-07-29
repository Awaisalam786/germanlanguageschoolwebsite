import React, { useState } from 'react';
import { BookOpen, Tag, ShoppingCart, Check, X, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function BookCard({ book, onOrder }) {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponMessage, setCouponMessage] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [showCouponInput, setShowCouponInput] = useState(false);

  const handleApplyCoupon = async (e) => {
    e.stopPropagation();
    if (!couponCode) return;
    setIsApplying(true);
    setCouponMessage('');

    const { data: coupons, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('coupon_code', couponCode.toUpperCase())
      .eq('is_active', true);

    if (error || !coupons || coupons.length === 0) {
      setCouponMessage('Invalid or inactive coupon');
      setIsApplying(false);
      return;
    }

    const coupon = coupons[0];

    if (coupon.expiry_date && new Date(coupon.expiry_date) < new Date()) {
      setCouponMessage('Coupon has expired');
      setIsApplying(false);
      return;
    }

    if (coupon.usage_limit && coupon.times_used >= coupon.usage_limit) {
      setCouponMessage('Coupon usage limit reached');
      setIsApplying(false);
      return;
    }

    if (coupon.applicable_to === 'Specific Book' && coupon.target_item_id !== book.id) {
      setCouponMessage('Coupon not applicable to this book');
      setIsApplying(false);
      return;
    }
    
    if (coupon.applicable_to === 'Specific Course' || coupon.applicable_to === 'All Courses') {
      setCouponMessage('Coupon not applicable to books');
      setIsApplying(false);
      return;
    }

    setAppliedCoupon(coupon);
    setCouponMessage('Coupon applied!');
    setIsApplying(false);
  };

  const getDiscountedPrice = (priceStr, coupon) => {
    if (!coupon || !priceStr) return priceStr;
    const numericMatch = priceStr.match(/[\d,]+/);
    if (!numericMatch) return priceStr;
    const originalPrice = parseFloat(numericMatch[0].replace(/,/g, ''));
    let newPrice = originalPrice;
    
    if (coupon.discount_type === 'percentage') {
      newPrice = originalPrice - (originalPrice * (coupon.discount_value / 100));
    } else {
      newPrice = originalPrice - coupon.discount_value;
    }
    
    return priceStr.replace(numericMatch[0], Math.max(0, newPrice).toLocaleString());
  };

  const finalPrice = appliedCoupon ? getDiscountedPrice(book.price, appliedCoupon) : book.price;

  return (
    <div className="group bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-amber-500/40 transition duration-300 flex flex-col justify-between shadow-lg hover:shadow-2xl hover:-translate-y-1">
      <div className="space-y-4">
        {book.image_url ? (
          <div className="h-56 overflow-hidden rounded-xl border border-slate-800 bg-slate-950 flex items-center justify-center">
            <img 
              src={book.image_url} 
              alt={book.title} 
              className="h-full object-contain group-hover:scale-105 transition duration-500"
            />
          </div>
        ) : (
          <div className="h-56 rounded-xl border border-slate-800 bg-slate-950 flex items-center justify-center text-slate-500">
            <BookOpen className="w-12 h-12 opacity-50" />
          </div>
        )}
        
        <div>
          <div className="flex justify-between items-start gap-2 mb-1.5">
            <h3 className="text-lg font-bold text-white leading-tight">{book.title}</h3>
          </div>
          
          <div className="flex items-center justify-between mt-2">
            <div className="flex flex-col">
              {appliedCoupon && (
                <span className="line-through text-xs text-slate-500 font-normal">{book.price}</span>
              )}
              <div className="flex items-center gap-1.5 text-amber-400 font-extrabold">
                <Tag className="w-4 h-4" />
                <span>{finalPrice}</span>
              </div>
            </div>
            <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${
              book.in_stock ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
            }`}>
              {book.in_stock ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
          {book.description}
        </p>
      </div>

      <div className="pt-5 mt-5 border-t border-slate-800 space-y-3">
        {/* Coupon Section */}
        {book.in_stock && (
          <div className="bg-slate-950/50 rounded-lg p-2.5 border border-slate-800 flex flex-col gap-2">
            {!showCouponInput && !appliedCoupon ? (
              <button 
                onClick={(e) => { e.stopPropagation(); setShowCouponInput(true); }}
                className="text-[10px] text-amber-400 font-bold flex items-center gap-1 hover:underline w-full justify-center"
              >
                <Tag className="w-3 h-3" /> Have a coupon code?
              </button>
            ) : appliedCoupon ? (
              <div className="flex items-center justify-between text-[10px]">
                <span className="flex items-center gap-1 text-emerald-400 font-bold">
                  <Check className="w-3 h-3" /> {appliedCoupon.coupon_code} applied
                </span>
                <button 
                  onClick={(e) => { e.stopPropagation(); setAppliedCoupon(null); setCouponCode(''); setCouponMessage(''); }}
                  className="text-slate-400 hover:text-red-400"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5">
                  <input 
                    type="text" 
                    placeholder="Enter code" 
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded p-1.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                  <button 
                    onClick={handleApplyCoupon}
                    disabled={isApplying || !couponCode}
                    className="px-2 py-1.5 bg-amber-500 text-slate-950 rounded font-bold text-xs hover:bg-amber-400 disabled:opacity-50"
                  >
                    {isApplying ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Apply'}
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setShowCouponInput(false); setCouponMessage(''); setCouponCode(''); }}
                    className="p-1.5 text-slate-400 hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
                {couponMessage && (
                  <span className={`text-[9px] ${couponMessage === 'Coupon applied!' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {couponMessage}
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        <button
          onClick={() => onOrder(book.title, appliedCoupon?.coupon_code)}
          disabled={!book.in_stock}
          className={`w-full py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
            book.in_stock 
              ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-gold-glow' 
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          {book.in_stock ? 'Order on WhatsApp' : 'Currently Unavailable'}
        </button>
      </div>
    </div>
  );
}
