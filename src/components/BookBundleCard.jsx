import React from 'react';
import { BookOpen, Sparkles, ShoppingBag, Check, ArrowRight, Tag } from 'lucide-react';
import { calculateBundleSavings, buildBundleWhatsAppUrl } from '../lib/bundleUtils';

export default function BookBundleCard({ bundle, businessPhone = '923421189593' }) {
  if (!bundle) return null;

  const books = bundle.books || [];
  const individualTotal = books.reduce((sum, b) => sum + (Number(b.price_pkr) || 0), 0);
  const bundlePrice = Number(bundle.bundle_price_pkr) || 0;

  const savings = calculateBundleSavings(individualTotal, bundlePrice);
  const whatsAppUrl = buildBundleWhatsAppUrl({
    businessPhone,
    bundleTitle: bundle.title,
    bundlePricePkr: bundlePrice,
    books
  });

  return (
    <div className="group relative bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 hover:border-amber-500/50 rounded-3xl p-6 sm:p-7 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 flex flex-col justify-between overflow-hidden">
      {/* Top golden accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-red-500 to-amber-500 opacity-80" />

      <div>
        {/* Ribbon / Badges */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-[11px] font-extrabold border border-amber-500/30 inline-flex items-center gap-1.5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            {bundle.badge || 'Bundle Offer'}
          </span>
          {savings.hasDiscount && (
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] font-extrabold border border-emerald-500/30 animate-pulse">
              Save {savings.discountPercentage}%
            </span>
          )}
        </div>

        {/* Book Covers Showcase Composition */}
        <div className="relative my-4 py-3 bg-slate-950/70 border border-slate-800/80 rounded-2xl flex items-center justify-center min-h-[190px] px-3 overflow-hidden">
          {books.length === 0 ? (
            <div className="text-center text-slate-500 py-8">
              <BookOpen className="w-10 h-10 mx-auto opacity-40 mb-2" />
              <p className="text-xs">Curated Book Set</p>
            </div>
          ) : (
            <div className={`flex items-center justify-center gap-2 sm:gap-3 flex-wrap ${books.length > 2 ? 'scale-95' : ''}`}>
              {books.map((book, idx) => {
                const cover = book.cover_image || book.image_url;
                return (
                  <div
                    key={book.id || idx}
                    className="relative group/book rounded-xl border border-slate-800 bg-slate-900/90 shadow-md p-1.5 flex flex-col items-center max-w-[105px] sm:max-w-[120px] transition-transform duration-300 hover:scale-105"
                    title={book.title}
                  >
                    <div className="w-20 h-28 sm:w-24 sm:h-32 rounded-lg bg-slate-950 overflow-hidden flex items-center justify-center">
                      {cover ? (
                        <img
                          src={cover}
                          alt={book.title}
                          className="w-full h-full object-contain"
                          loading="lazy"
                        />
                      ) : (
                        <div className="text-center p-2 text-slate-600">
                          <BookOpen className="w-6 h-6 mx-auto mb-1 opacity-40" />
                          <span className="text-[9px] line-clamp-2">{book.title}</span>
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-slate-300 truncate w-full text-center mt-1.5">
                      {book.title}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Bundle Title & Details */}
        <div className="space-y-2 mt-4">
          <h3 className="text-xl font-black text-white leading-tight group-hover:text-amber-400 transition-colors">
            {bundle.title}
          </h3>
          {bundle.description && (
            <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
              {bundle.description}
            </p>
          )}

          {/* Included books bullets */}
          <div className="pt-2 pb-1 space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Includes {books.length} Textbooks:
            </span>
            <ul className="space-y-1 text-xs text-slate-300">
              {books.map((b, i) => (
                <li key={b.id || i} className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">{b.title}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Pricing & CTA Section */}
      <div className="pt-5 mt-5 border-t border-slate-800 space-y-4">
        {/* Price summary */}
        <div className="flex items-baseline justify-between">
          <div>
            <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Bundle Offer Price</div>
            <div className="text-2xl font-black text-amber-400">
              ₨ {bundlePrice.toLocaleString()} <span className="text-xs font-bold text-slate-400">PKR</span>
            </div>
          </div>

          {/* Comparison and savings tag */}
          <div className="text-right">
            {savings.hasDiscount ? (
              <>
                <div className="text-xs text-slate-500 line-through">
                  ₨ {individualTotal.toLocaleString()} PKR
                </div>
                <div className="text-xs font-bold text-emerald-400">
                  Save ₨ {savings.savingsAmount.toLocaleString()} PKR ({savings.discountPercentage}%)
                </div>
              </>
            ) : (
              <span className="text-[11px] text-slate-400 font-medium">Standard Set Price</span>
            )}
          </div>
        </div>

        {/* WhatsApp Inquiry Button */}
        <a
          href={whatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-[0.99]"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Order Bundle on WhatsApp</span>
          <ArrowRight className="w-4 h-4" />
        </a>
        <p className="text-[10px] text-slate-400 text-center">
          Manual confirmation & stock verification via WhatsApp
        </p>
      </div>
    </div>
  );
}
