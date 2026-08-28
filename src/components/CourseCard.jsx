import React, { useState } from 'react';
import { Clock, Calendar, MessageCircle, Tag, Check, X, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import Link from 'next/link';

export default function CourseCard({ course, onEnroll }) {
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

    if (coupon.applicable_to === 'Specific Course' && coupon.target_item_id !== course.id) {
      setCouponMessage('Coupon not applicable to this course');
      setIsApplying(false);
      return;
    }
    
    if (coupon.applicable_to === 'Specific Book' || coupon.applicable_to === 'All Books') {
      setCouponMessage('Coupon not applicable to courses');
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

  const finalPricePKR = appliedCoupon ? getDiscountedPrice(course.feesPKR, appliedCoupon) : course.feesPKR;

  const computeEUR = (pkrStr) => {
    if (!pkrStr) return '0';
    const match = String(pkrStr).match(/[\d,]+/);
    if (!match) return pkrStr;
    const val = parseFloat(match[0].replace(/,/g, ''));
    return Math.round(val / 300).toLocaleString();
  };

  const rawEUR = (course.feesEUR === course.feesPKR || String(course.feesEUR).includes('PKR') || String(course.feesEUR).includes('Rs'))
    ? computeEUR(course.feesPKR)
    : course.feesEUR;

  const finalPriceEUR = appliedCoupon ? getDiscountedPrice(String(rawEUR), appliedCoupon) : String(rawEUR);

  const handleEnrollClick = (e) => {
    e.stopPropagation();
    onEnroll(course.title, appliedCoupon?.coupon_code);
  };

  return (
    <div
      onClick={(e) => {
        // Prevent clicking the card from triggering if clicking inside input
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'BUTTON') {
          onEnroll(course.title, appliedCoupon?.coupon_code);
        }
      }}
      className="w-full max-w-full box-border group relative bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between h-full shadow-xl hover:shadow-2xl hover:scale-[1.01] hover:-translate-y-1 cursor-pointer overflow-hidden"
    >
      <div className="space-y-4 flex flex-col flex-1 w-full box-border">
        
        {/* Top Row: Clean Level Badge & Optional Subtle Feature Tag */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="px-3 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold">
            Level {course.level}
          </span>

          {course.featuredBadge && (
            <span className="px-2.5 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800 text-[11px] font-medium">
              {course.featuredBadge.replace(/[^a-zA-Z0-9\s&]/g, '').trim()}
            </span>
          )}
        </div>

        {/* Course Title */}
        <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors leading-snug">
          <Link href={['A1', 'A2', 'B1', 'B2'].includes(course.level) ? `/courses/german-${course.level.toLowerCase()}` : '/courses'} className="hover:underline" onClick={(e) => e.stopPropagation()}>{course.title}</Link>
        </h3>

        {/* Short Description */}
        <p className="text-xs text-slate-300 leading-relaxed font-normal">
          {course.description}
        </p>

        {/* Duration & Flexible Live Batches Info */}
        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 flex flex-col justify-center gap-2 text-xs mt-auto min-h-[92px]">
          <div className="flex items-start justify-between gap-2 text-slate-300">
            <span className="flex items-center gap-1.5 text-slate-400 shrink-0">
              <Clock className="w-3.5 h-3.5 text-red-500 shrink-0" />
              <span>Duration:</span>
            </span>
            <span className="font-semibold text-white text-right">{course.duration}</span>
          </div>

          <div className="flex items-start justify-between gap-2 text-slate-300">
            <span className="flex items-center gap-1.5 text-slate-400 shrink-0">
              <Calendar className="w-3.5 h-3.5 text-red-500 shrink-0" />
              <span>Schedule:</span>
            </span>
            <span className="font-semibold text-amber-400 text-[11px] text-right">{course.schedule}</span>
          </div>
        </div>

      </div>

      {/* Card Footer */}
      <div className="pt-4 mt-5 border-t border-slate-800/80 space-y-3">
        
        {/* Coupon Section */}
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
                  onClick={(e) => e.stopPropagation()}
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

        <div className="flex items-center justify-between gap-2 sm:gap-3">
          {/* Vertical Stacked Fee Display */}
          <div className="flex flex-col gap-0">
            <div className="text-[9px] sm:text-xs text-slate-400 font-semibold tracking-wide">Course Fee</div>
            <div className="flex items-baseline gap-1 sm:gap-1.5">
              <span className="text-sm sm:text-lg font-extrabold text-white">PKR {finalPricePKR}</span>
              {appliedCoupon && course.feesPKR !== finalPricePKR && (
                <span className="text-[8px] sm:text-[10px] text-slate-500 line-through">PKR {course.feesPKR}</span>
              )}
            </div>
            <div className="text-[8px] sm:text-[10px] text-slate-500 font-medium tracking-wide">
              <span className="text-slate-400 font-bold">€{finalPriceEUR}</span> for intl. students
            </div>
          </div>

          {/* WhatsApp Enroll Button */}
          <button
            onClick={handleEnrollClick}
            className="group/btn shrink-0 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-[10px] sm:text-xs font-extrabold shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/40 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-1 sm:gap-1.5 whitespace-nowrap"
          >
            <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current shrink-0 animate-pulse group-hover/btn:scale-110 transition-transform duration-300" />
            <span className="whitespace-nowrap">Enroll Now</span>
          </button>
        </div>

      </div>
    </div>
  );
}
