import React from 'react';
import { BookOpen, Tag, ShoppingCart } from 'lucide-react';

export default function BookCard({ book, onOrder }) {
  const inStock = book.is_active ?? book.in_stock ?? true;
  const displayImage = book.cover_image || book.image_url;
  const pricePkr = Number(book.price_pkr || 0);
  const formattedPrice = pricePkr > 0 ? `₨ ${pricePkr.toLocaleString()} PKR` : (book.price || 'Price on request');

  return (
    <div className="group bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-amber-500/40 transition duration-300 flex flex-col justify-between shadow-lg hover:shadow-2xl hover:-translate-y-1">
      <div className="space-y-4">
        {displayImage ? (
          <div className="h-56 overflow-hidden rounded-xl border border-slate-800 bg-slate-950 flex items-center justify-center p-2">
            <img 
              src={displayImage} 
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
            <div className="flex items-center gap-1.5 text-amber-400 font-extrabold">
              <Tag className="w-4 h-4" />
              <span>{formattedPrice}</span>
            </div>
            <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${
              inStock ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
            }`}>
              {inStock ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
          {book.description}
        </p>
      </div>

      <div className="pt-5 mt-5 border-t border-slate-800 space-y-3">
        <button
          onClick={() => onOrder && onOrder(book)}
          disabled={!inStock}
          className={`w-full py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
            inStock 
              ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-gold-glow' 
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          {inStock ? 'Order on WhatsApp' : 'Currently Unavailable'}
        </button>
      </div>
    </div>
  );
}
