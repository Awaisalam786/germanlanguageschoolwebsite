import React, { useState, useEffect } from 'react';
import { BookOpen, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useGlobalContent } from '../context/GlobalContentContext';
import BookCard from '../components/BookCard';

export default function Books() {
  const { settings } = useGlobalContent();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      const { data, error } = await supabase.from('books').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        setBooks(data);
      }
      setLoading(false);
    };
    fetchBooks();
  }, []);

  const handleWhatsAppOrder = (bookTitle, couponCode = null) => {
    let msg = `Hi, I want to order ${bookTitle}.`;
    if (couponCode) {
      msg += ` I am applying the coupon code: ${couponCode}.`;
    }
    msg += ` Please confirm price and availability.`;
    
    const phone = settings?.whatsapp_number || '923421189593';
    // If it starts with 0, replace with 92 for wa.me link
    const formattedPhone = phone.startsWith('0') ? '92' + phone.slice(1) : phone;
    window.open(`https://wa.me/${formattedPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/30 inline-flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5" /> Official Study Materials
        </span>
        <h1 className="text-4xl font-extrabold text-white">Books & Resources</h1>
        <p className="text-sm text-slate-300">
          Get the official German language textbooks, exam preparation materials, and dictionaries delivered to your doorstep in Pakistan.
        </p>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Loader2 className="w-10 h-10 text-amber-500 animate-spin mb-4" />
          <p>Loading books...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <BookCard 
              key={book.id} 
              book={book} 
              onOrder={handleWhatsAppOrder} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
