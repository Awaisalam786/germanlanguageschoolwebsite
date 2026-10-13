import React, { useState, useEffect } from 'react';
import { BookOpen, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useGlobalContent } from '../context/GlobalContentContext';
import BookCard from '../components/BookCard';
import BookOrderModal from '../components/BookOrderModal';

export default function Books() {
  const { settings } = useGlobalContent();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBookForOrder, setSelectedBookForOrder] = useState(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

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

  const phone = settings?.whatsapp_number || '923421189593';
  const formattedPhone = phone.startsWith('0') ? '92' + phone.slice(1) : phone.replace(/[^0-9]/g, '');

  const handleOpenOrderModal = (book) => {
    setSelectedBookForOrder(book);
    setIsOrderModalOpen(true);
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
          Get official German language textbooks (including Netzwerk Neu), exam preparation materials, and grammar guides delivered to your doorstep anywhere in Pakistan.
        </p>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Loader2 className="w-10 h-10 text-amber-500 animate-spin mb-4" />
          <p>Loading books...</p>
        </div>
      ) : books.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-3 max-w-xl mx-auto">
          <BookOpen className="w-12 h-12 text-amber-400/40 mx-auto" />
          <h3 className="text-lg font-bold text-white">New Books Arriving Soon</h3>
          <p className="text-xs text-slate-400">
            Official German textbooks and exam prep guides are being updated. Check back shortly or reach out to admissions on WhatsApp for inquiries.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <BookCard 
              key={book.id} 
              book={book} 
              onOrder={handleOpenOrderModal} 
            />
          ))}
        </div>
      )}

      {/* Order Modal */}
      <BookOrderModal
        book={selectedBookForOrder}
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        businessPhone={formattedPhone}
      />
    </div>
  );
}
