import React, { useState, useEffect } from 'react';
import { BookOpen, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useGlobalContent } from '../context/GlobalContentContext';
import BookCard from '../components/BookCard';
import BookOrderModal from '../components/BookOrderModal';
import BookBundleCard from '../components/BookBundleCard';

export default function Books() {
  const { settings } = useGlobalContent();
  const [books, setBooks] = useState([]);
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [selectedBookForOrder, setSelectedBookForOrder] = useState(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        setLoading(true);
        setFetchError(null);

        // Fetch books
        const { data: booksData, error: booksError } = await supabase
          .from('books')
          .select('*')
          .order('created_at', { ascending: false });

        if (booksError) {
          console.error('Diagnostic [Books]: Failed to load books catalog.', booksError.message || booksError);
          if (isMounted) {
            setFetchError('Unable to load book catalogue at this time. Please try again or reach out on WhatsApp.');
          }
        } else if (isMounted) {
          setBooks(booksData || []);
        }

        // Fetch active bundles and their linked books (if table exists)
        try {
          const { data: bundlesData, error: bundlesError } = await supabase
            .from('book_bundles')
            .select(`
              *,
              book_bundle_items (
                book_id,
                item_order
              )
            `)
            .eq('is_active', true)
            .order('display_order', { ascending: true });

          if (!bundlesError && bundlesData && isMounted) {
            const booksMap = new Map((booksData || []).map(b => [b.id, b]));
            const hydratedBundles = bundlesData.map(bundle => {
              const items = (bundle.book_bundle_items || []).sort((a, b) => a.item_order - b.item_order);
              const bundleBooks = items.map(item => booksMap.get(item.book_id)).filter(Boolean);
              return {
                ...bundle,
                books: bundleBooks
              };
            });
            setBundles(hydratedBundles);
          }
        } catch (bundleErr) {
          // Non-critical: if bundles table is not migrated yet, bundles will remain empty
          console.warn('Diagnostic [Books]: Note on bundles table:', bundleErr?.message || bundleErr);
        }
      } catch (err) {
        console.error('Diagnostic [Books]: Unexpected error loading books.', err?.message || err);
        if (isMounted) {
          setFetchError('Unable to load book catalogue at this time. Please try again or reach out on WhatsApp.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    fetchData();

    return () => {
      isMounted = false;
    };
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
      ) : fetchError ? (
        <div className="bg-red-950/30 border border-red-800/60 rounded-3xl p-12 text-center space-y-4 max-w-xl mx-auto">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
          <h3 className="text-lg font-bold text-white">Temporary Loading Issue</h3>
          <p className="text-xs text-slate-300">
            {fetchError}
          </p>
          <div className="pt-2">
            <a
              href={`https://wa.me/${formattedPhone}?text=${encodeURIComponent('Hi, I would like to inquire about German learning books.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-lg"
            >
              Contact on WhatsApp
            </a>
          </div>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Bundle Offers Showcase (Rendered when bundles are configured) */}
          {bundles.length > 0 && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Special Promotional Packages
                  </span>
                  <h2 className="text-2xl font-black text-white mt-1">Book Bundle Offers</h2>
                  <p className="text-xs text-slate-400">
                    Get multiple textbook levels together and save on official exam preparation materials with Pakistan-wide doorstep delivery.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bundles.map((bundle) => (
                  <BookBundleCard
                    key={bundle.id}
                    bundle={bundle}
                    businessPhone={formattedPhone}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Individual Textbooks Section */}
          <div className="space-y-6">
            {bundles.length > 0 && (
              <div className="border-b border-slate-800 pb-3">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-amber-400" /> Individual Textbooks
                </span>
                <h3 className="text-xl font-bold text-white mt-1">Single Course Books</h3>
              </div>
            )}

            {books.length === 0 ? (
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
          </div>
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
