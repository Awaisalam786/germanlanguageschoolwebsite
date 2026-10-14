import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Plus,
  Edit,
  Trash2,
  X,
  Loader2,
  Check,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  AlertCircle,
  BookOpen
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import BookBundleCard from '../components/BookBundleCard';
import { calculateBundleSavings } from '../lib/bundleUtils';

export default function BookBundlesManager() {
  const [bundles, setBundles] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBundle, setEditingBundle] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [previewMode, setPreviewMode] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [bundlePricePkr, setBundlePricePkr] = useState('');
  const [badge, setBadge] = useState('Best Value');
  const [isActive, setIsActive] = useState(true);
  const [selectedBookIds, setSelectedBookIds] = useState([]); // Array of book IDs in order

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      // 1. Fetch all books
      const { data: booksData, error: booksError } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false });

      if (booksError) throw booksError;
      setAllBooks(booksData || []);

      // 2. Fetch bundles if table exists
      const { data: bundlesData, error: bundlesError } = await supabase
        .from('book_bundles')
        .select(`
          *,
          book_bundle_items (
            book_id,
            item_order
          )
        `)
        .order('display_order', { ascending: true });

      if (!bundlesError && bundlesData) {
        // Hydrate books in each bundle
        const booksMap = new Map((booksData || []).map(b => [b.id, b]));
        const hydrated = bundlesData.map(bundle => {
          const items = (bundle.book_bundle_items || []).sort((a, b) => a.item_order - b.item_order);
          const bundleBooks = items.map(item => booksMap.get(item.book_id)).filter(Boolean);
          return {
            ...bundle,
            books: bundleBooks
          };
        });
        setBundles(hydrated);
      } else {
        // Table may not yet be migrated in production; initialize empty state gracefully
        setBundles([]);
      }
    } catch (err) {
      console.warn('[BookBundlesManager] Note: bundles table may not exist yet:', err?.message || err);
      setBundles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingBundle(null);
    setTitle('');
    setDescription('');
    setBundlePricePkr('');
    setBadge('Best Value');
    setIsActive(true);
    setSelectedBookIds([]);
    setErrorMessage('');
    setPreviewMode(false);
    setShowModal(true);
  };

  const handleOpenEdit = (bundle) => {
    setEditingBundle(bundle);
    setTitle(bundle.title || '');
    setDescription(bundle.description || '');
    setBundlePricePkr(String(bundle.bundle_price_pkr || ''));
    setBadge(bundle.badge || 'Best Value');
    setIsActive(bundle.is_active ?? true);
    setSelectedBookIds((bundle.books || []).map(b => b.id));
    setErrorMessage('');
    setPreviewMode(false);
    setShowModal(true);
  };

  const handleToggleBook = (bookId) => {
    if (selectedBookIds.includes(bookId)) {
      setSelectedBookIds(selectedBookIds.filter(id => id !== bookId));
    } else {
      setSelectedBookIds([...selectedBookIds, bookId]);
    }
  };

  const handleMoveBook = (index, direction) => {
    const newIds = [...selectedBookIds];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= newIds.length) return;
    const temp = newIds[index];
    newIds[index] = newIds[targetIdx];
    newIds[targetIdx] = temp;
    setSelectedBookIds(newIds);
  };

  const handleDelete = async (bundleId) => {
    if (!confirm('Are you sure you want to delete this bundle offer?')) return;
    try {
      const { error } = await supabase.from('book_bundles').delete().eq('id', bundleId);
      if (error) throw error;
      setBundles(bundles.filter(b => b.id !== bundleId));
    } catch (err) {
      alert('Failed to delete bundle: ' + (err.message || 'Database error'));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (selectedBookIds.length < 2) {
      setErrorMessage('Please select at least 2 books to create a bundle offer.');
      return;
    }

    const priceNum = parseFloat(bundlePricePkr);
    if (isNaN(priceNum) || priceNum <= 0) {
      setErrorMessage('Please provide a valid bundle price in PKR (greater than 0).');
      return;
    }

    setSubmitting(true);

    try {
      const bundlePayload = {
        title: title.trim(),
        description: description.trim(),
        bundle_price_pkr: priceNum,
        badge: badge.trim() || 'Bundle Offer',
        is_active: Boolean(isActive)
      };

      let bundleId = editingBundle?.id;

      if (editingBundle) {
        const { data, error } = await supabase
          .from('book_bundles')
          .update(bundlePayload)
          .eq('id', editingBundle.id)
          .select()
          .single();

        if (error) throw error;
        bundleId = data.id;

        // Delete existing items to replace with new selection order
        await supabase.from('book_bundle_items').delete().eq('bundle_id', bundleId);
      } else {
        const { data, error } = await supabase
          .from('book_bundles')
          .insert([bundlePayload])
          .select()
          .single();

        if (error) throw error;
        bundleId = data.id;
      }

      // Insert junction items
      const itemsPayload = selectedBookIds.map((bookId, index) => ({
        bundle_id: bundleId,
        book_id: bookId,
        item_order: index
      }));

      const { error: itemsError } = await supabase
        .from('book_bundle_items')
        .insert(itemsPayload);

      if (itemsError) throw itemsError;

      setShowModal(false);
      await fetchData();
    } catch (err) {
      console.error('Failed to save bundle:', err);
      setErrorMessage(err.message || 'Could not save bundle. Note: Ensure the book_bundles migration has been executed in Supabase.');
    } finally {
      setSubmitting(false);
    }
  };

  // Compute live preview object
  const booksMap = new Map(allBooks.map(b => [b.id, b]));
  const selectedBooks = selectedBookIds.map(id => booksMap.get(id)).filter(Boolean);
  const previewIndividualTotal = selectedBooks.reduce((sum, b) => sum + (Number(b.price_pkr) || 0), 0);
  const previewBundlePrice = Number(bundlePricePkr) || 0;
  const previewSavings = calculateBundleSavings(previewIndividualTotal, previewBundlePrice);

  const previewBundleObj = {
    id: 'preview',
    title: title || 'Bundle Title Preview',
    description: description || 'Promotional textbook set description preview.',
    bundle_price_pkr: previewBundlePrice,
    badge: badge || 'Bundle Offer',
    books: selectedBooks
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin mr-3" />
        <span>Loading Bundle Offers...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-400" />
            <span>Book Bundle Offers Manager</span>
          </h2>
          <p className="text-xs text-slate-400">
            Create promotional book bundles with automatic multi-cover display, savings calculation, and WhatsApp inquiry buttons.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-amber-500 text-slate-950 px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-amber-400 transition flex items-center gap-2 shadow-gold-glow"
        >
          <Plus className="w-4 h-4" />
          Create New Bundle
        </button>
      </div>

      {/* List / Grid of Bundles */}
      {bundles.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-4">
          <Sparkles className="w-12 h-12 text-amber-400/40 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Bundle Offers Created Yet</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Combine multiple books (e.g. Netzwerk neu A1 + A2) into an attractive discount bundle with automatic savings calculation and WhatsApp order links.
          </p>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 bg-amber-500 text-slate-950 px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-amber-400 transition"
          >
            <Plus className="w-4 h-4" /> Create First Bundle
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bundles.map((bundle) => {
            const indTotal = (bundle.books || []).reduce((s, b) => s + (Number(b.price_pkr) || 0), 0);
            const savings = calculateBundleSavings(indTotal, bundle.bundle_price_pkr);

            return (
              <div
                key={bundle.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-amber-500/40 transition flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-bold border border-amber-500/30">
                      {bundle.badge || 'Bundle Offer'}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      bundle.is_active ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      {bundle.is_active ? 'Active' : 'Disabled'}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white">{bundle.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{bundle.description}</p>

                  {/* Covers row */}
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center gap-2 overflow-x-auto">
                    {(bundle.books || []).map((b, i) => (
                      <div key={b.id || i} className="w-14 h-20 rounded bg-slate-900 shrink-0 border border-slate-800 overflow-hidden flex items-center justify-center">
                        {b.cover_image ? (
                          <img src={b.cover_image} alt={b.title} className="w-full h-full object-contain" />
                        ) : (
                          <BookOpen className="w-5 h-5 text-slate-600" />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Pricing info */}
                  <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Bundle Price:</span>
                      <span className="font-extrabold text-amber-400">₨ {Number(bundle.bundle_price_pkr).toLocaleString()} PKR</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Individual Sum:</span>
                      <span className="text-slate-300">₨ {indTotal.toLocaleString()} PKR</span>
                    </div>
                    {savings.hasDiscount && (
                      <div className="flex justify-between text-emerald-400 font-bold">
                        <span>Savings:</span>
                        <span>₨ {savings.savingsAmount.toLocaleString()} ({savings.discountPercentage}% OFF)</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800 flex gap-2">
                  <button
                    onClick={() => handleOpenEdit(bundle)}
                    className="flex-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg transition flex items-center justify-center gap-2"
                  >
                    <Edit className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(bundle.id)}
                    className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-bold rounded-lg transition"
                    title="Delete bundle"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Modal with Live Preview */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl shadow-2xl relative my-8 overflow-hidden">
            {/* Top Bar */}
            <div className="h-1.5 german-flag-strip absolute top-0 left-0 right-0"></div>

            <button
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 p-2 text-slate-400 hover:text-white bg-slate-950 rounded-full hover:bg-slate-800 transition z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6 sm:p-8 space-y-6 max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-xl font-extrabold text-white">
                    {editingBundle ? 'Edit Bundle Offer' : 'Create New Bundle Offer'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Select books from inventory, arrange their order, and configure promotional pricing.
                  </p>
                </div>

                {/* Preview tab toggle */}
                <button
                  type="button"
                  onClick={() => setPreviewMode(!previewMode)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                    previewMode ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  {previewMode ? 'Back to Editor' : 'Preview Card'}
                </button>
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-2 text-red-400 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>{errorMessage}</p>
                </div>
              )}

              {previewMode ? (
                /* Card Preview View */
                <div className="space-y-4">
                  <div className="text-center text-xs text-slate-400">
                    Live preview of how this bundle will render on the public <code className="text-amber-400">/books</code> page:
                  </div>
                  <div className="max-w-md mx-auto">
                    <BookBundleCard bundle={previewBundleObj} />
                  </div>
                </div>
              ) : (
                /* Form Editor View */
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Bundle Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Netzwerk neu A1 + A2 Complete Set"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Ribbon Badge</label>
                      <input
                        type="text"
                        placeholder="e.g. Best Value, Most Popular, Beginner Bundle"
                        value={badge}
                        onChange={(e) => setBadge(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Description</label>
                    <textarea
                      rows={2}
                      placeholder="Brief summary of why this bundle is recommended (e.g. Complete textbook set for Goethe A1 and A2 exam candidates)."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Book Picker & Reordering */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-300">
                        Select Included Books (Pick at least 2) *
                      </label>
                      <span className="text-[11px] text-amber-400 font-semibold">
                        {selectedBookIds.length} Selected
                      </span>
                    </div>

                    {allBooks.length === 0 ? (
                      <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400 text-center">
                        No books found in the database. Please add books in the Books Manager first.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 bg-slate-950 rounded-xl border border-slate-800">
                        {allBooks.map((book) => {
                          const isSelected = selectedBookIds.includes(book.id);
                          return (
                            <button
                              type="button"
                              key={book.id}
                              onClick={() => handleToggleBook(book.id)}
                              className={`p-2.5 rounded-lg border text-left transition flex items-center justify-between text-xs ${
                                isSelected
                                  ? 'bg-amber-500/10 border-amber-500/40 text-white'
                                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <div className="w-7 h-9 bg-slate-950 rounded shrink-0 overflow-hidden flex items-center justify-center">
                                  {book.cover_image ? (
                                    <img src={book.cover_image} alt={book.title} className="w-full h-full object-contain" />
                                  ) : (
                                    <BookOpen className="w-3.5 h-3.5 text-slate-600" />
                                  )}
                                </div>
                                <div className="truncate">
                                  <div className="font-bold truncate text-slate-200">{book.title}</div>
                                  <div className="text-[10px] text-amber-400">₨ {Number(book.price_pkr || 0).toLocaleString()} PKR</div>
                                </div>
                              </div>
                              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ml-2 shrink-0 ${
                                isSelected ? 'bg-amber-500 border-amber-500 text-slate-950' : 'border-slate-700'
                              }`}>
                                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Reorder Selected Books */}
                    {selectedBookIds.length > 0 && (
                      <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 space-y-2">
                        <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">
                          Cover Display Order (Use arrows to reorder):
                        </span>
                        <div className="space-y-1.5">
                          {selectedBookIds.map((id, index) => {
                            const book = booksMap.get(id);
                            if (!book) return null;
                            return (
                              <div
                                key={id}
                                className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800 text-xs"
                              >
                                <div className="flex items-center gap-2 truncate">
                                  <span className="text-[10px] font-bold text-amber-400 w-4">{index + 1}.</span>
                                  <span className="font-bold text-slate-200 truncate">{book.title}</span>
                                  <span className="text-[10px] text-slate-400">
                                    (₨ {Number(book.price_pkr || 0).toLocaleString()})
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 shrink-0">
                                  <button
                                    type="button"
                                    disabled={index === 0}
                                    onClick={() => handleMoveBook(index, -1)}
                                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300"
                                    title="Move Up"
                                  >
                                    <ArrowUp className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    disabled={index === selectedBookIds.length - 1}
                                    onClick={() => handleMoveBook(index, 1)}
                                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300"
                                    title="Move Down"
                                  >
                                    <ArrowDown className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Pricing and Savings Calculation */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">
                        Promotional Bundle Price (PKR) *
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        step="50"
                        placeholder="e.g. 4500"
                        value={bundlePricePkr}
                        onChange={(e) => setBundlePricePkr(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono font-bold"
                      />
                    </div>

                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col justify-center">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Individual Total:</span>
                        <span className="font-bold text-white">₨ {previewIndividualTotal.toLocaleString()} PKR</span>
                      </div>
                      <div className="flex justify-between text-xs mt-1">
                        <span className="text-slate-400">Configured Saving:</span>
                        <span className={`font-bold ${previewSavings.hasDiscount ? 'text-emerald-400' : 'text-slate-400'}`}>
                          {previewSavings.hasDiscount
                            ? `₨ ${previewSavings.savingsAmount.toLocaleString()} (${previewSavings.discountPercentage}% OFF)`
                            : 'No Discount'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Active Toggle */}
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="bundleIsActive"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-500 bg-slate-950 border-slate-700 focus:ring-0"
                    />
                    <label htmlFor="bundleIsActive" className="text-xs text-slate-300 font-medium">
                      Publish bundle offer on public <code className="text-amber-400">/books</code> page
                    </label>
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 text-xs font-bold transition flex items-center gap-2 shadow-gold-glow"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Saving Bundle...</span>
                        </>
                      ) : (
                        <span>{editingBundle ? 'Update Bundle' : 'Create Bundle'}</span>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
