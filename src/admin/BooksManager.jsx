import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Edit, Trash2, X, Loader2, Image as ImageIcon, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function BooksManager() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price_pkr: '',
    price_eur: '',
    cover_image: '',
    is_active: true,
    is_digital: false,
    pdf_url: '',
    stripe_price_id: ''
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    setLoading(true);
    setErrorMessage('');
    const { data, error } = await supabase.from('books').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      setBooks(data);
    } else if (error) {
      console.error('Failed to fetch books:', error);
      setErrorMessage(error.message);
    }
    setLoading(false);
  };

  const handleOpenAdd = () => {
    setEditingBook(null);
    setErrorMessage('');
    setFormData({
      title: '',
      description: '',
      price_pkr: '',
      price_eur: '0',
      cover_image: '',
      is_active: true,
      is_digital: false,
      pdf_url: '',
      stripe_price_id: ''
    });
    setShowModal(true);
  };

  const handleOpenEdit = (book) => {
    setEditingBook(book);
    setErrorMessage('');
    setFormData({
      title: book.title || '',
      description: book.description || '',
      price_pkr: book.price_pkr != null ? String(book.price_pkr) : '',
      price_eur: book.price_eur != null ? String(book.price_eur) : '0',
      cover_image: book.cover_image || book.image_url || '',
      is_active: book.is_active ?? book.in_stock ?? true,
      is_digital: Boolean(book.is_digital),
      pdf_url: book.pdf_url || '',
      stripe_price_id: book.stripe_price_id || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this book? This will permanently remove it.')) {
      const { error } = await supabase.from('books').delete().eq('id', id);
      if (!error) {
        setBooks(books.filter(b => b.id !== id));
      } else {
        alert('Failed to delete book: ' + (error?.message || 'Database error'));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage('');

    const numericPricePkr = parseFloat(formData.price_pkr);
    const numericPriceEur = parseFloat(formData.price_eur) || 0;

    if (isNaN(numericPricePkr) || numericPricePkr < 0) {
      setErrorMessage('Please enter a valid PKR price (numbers only, e.g. 3500).');
      setSubmitting(false);
      return;
    }

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      price_pkr: numericPricePkr,
      price_eur: numericPriceEur,
      cover_image: formData.cover_image?.trim() || null,
      is_active: Boolean(formData.is_active),
      is_digital: Boolean(formData.is_digital),
      pdf_url: formData.pdf_url?.trim() || null,
      stripe_price_id: formData.stripe_price_id?.trim() || null
    };

    try {
      if (editingBook) {
        const { data, error } = await supabase
          .from('books')
          .update(payload)
          .eq('id', editingBook.id)
          .select()
          .single();

        if (error) throw error;
        if (data) {
          setBooks(books.map(b => b.id === editingBook.id ? data : b));
          setShowModal(false);
        }
      } else {
        const { data, error } = await supabase
          .from('books')
          .insert([payload])
          .select()
          .single();

        if (error) throw error;
        if (data) {
          setBooks([data, ...books]);
          setShowModal(false);
        }
      }
    } catch (err) {
      console.error('Error saving book:', err);
      setErrorMessage(err.message || 'An error occurred while saving the book.');
    } finally {
      setSubmitting(false);
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
            <BookOpen className="w-6 h-6 text-amber-400" />
            <span>Books Manager</span>
          </h2>
          <p className="text-xs text-slate-400">Manage German textbooks, physical delivery stock, and digital study materials.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-amber-500 text-slate-950 px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-amber-400 transition flex items-center gap-2 shadow-gold-glow"
        >
          <Plus className="w-4 h-4" />
          Add New Book
        </button>
      </div>

      {/* Book Grid */}
      {books.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-4">
          <BookOpen className="w-12 h-12 text-amber-400/40 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Books Added Yet</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Click &ldquo;Add New Book&rdquo; to add your first physical textbook (such as Netzwerk Neu A1) or digital study resource.
          </p>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 bg-amber-500 text-slate-950 px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-amber-400 transition"
          >
            <Plus className="w-4 h-4" /> Add Book Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => {
            const displayImage = book.cover_image || book.image_url;
            const inStock = book.is_active ?? book.in_stock ?? true;
            return (
              <div key={book.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-amber-500/40 transition flex flex-col justify-between">
                <div className="space-y-4">
                  {displayImage ? (
                    <img src={displayImage} alt={book.title} className="w-full h-48 object-cover rounded-xl border border-slate-800" />
                  ) : (
                    <div className="w-full h-48 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center text-slate-500">
                      <ImageIcon className="w-8 h-8 opacity-50" />
                    </div>
                  )}
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="text-lg font-bold text-white leading-tight">{book.title}</h3>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 border ${
                        inStock ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
                      }`}>
                        {inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-amber-400 font-bold text-base">
                        ₨ {Number(book.price_pkr || 0).toLocaleString()} PKR
                      </span>
                      {Number(book.price_eur) > 0 && (
                        <span className="text-xs text-slate-400">
                          (€{Number(book.price_eur).toLocaleString()})
                        </span>
                      )}
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium ml-auto">
                        {book.is_digital ? 'Digital' : 'Physical Book'}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">{book.description}</p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-800 flex gap-2">
                  <button
                    onClick={() => handleOpenEdit(book)}
                    className="flex-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg transition flex items-center justify-center gap-2"
                  >
                    <Edit className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(book.id)}
                    className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-bold rounded-lg transition"
                    title="Delete book"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl shadow-2xl relative my-8">
            
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 p-2 text-slate-400 hover:text-white bg-slate-950 rounded-full hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white">{editingBook ? 'Edit Book' : 'Add New Book'}</h3>
                <p className="text-xs text-slate-400">Configure book details, pricing, and availability.</p>
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-2 text-red-400 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>{errorMessage}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Book Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Netzwerk Neu A1 (Kurs- und Übungsbuch)"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">Price in PKR (₨) *</label>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        required
                        placeholder="3500"
                        value={formData.price_pkr}
                        onChange={(e) => setFormData({...formData, price_pkr: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">Price in EUR (€) (Optional)</label>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        placeholder="0"
                        value={formData.price_eur}
                        onChange={(e) => setFormData({...formData, price_eur: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Cover Image URL</label>
                    <input
                      type="url"
                      placeholder="https://example.com/netzwerk-neu-a1.jpg"
                      value={formData.cover_image}
                      onChange={(e) => setFormData({...formData, cover_image: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Description *</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Comprehensive textbook for German A1 learners in Pakistan. Covers all vocabulary, grammar, and exam exercises."
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                      <input
                        type="checkbox"
                        id="is_active"
                        checked={formData.is_active}
                        onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                        className="w-4 h-4 accent-amber-500 rounded border-slate-700 bg-slate-900 cursor-pointer"
                      />
                      <label htmlFor="is_active" className="text-xs font-bold text-slate-300 select-none cursor-pointer">
                        Book is In Stock
                      </label>
                    </div>

                    <div className="flex items-center gap-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                      <input
                        type="checkbox"
                        id="is_digital"
                        checked={formData.is_digital}
                        onChange={(e) => setFormData({...formData, is_digital: e.target.checked})}
                        className="w-4 h-4 accent-amber-500 rounded border-slate-700 bg-slate-900 cursor-pointer"
                      />
                      <label htmlFor="is_digital" className="text-xs font-bold text-slate-300 select-none cursor-pointer">
                        Digital Resource (PDF)
                      </label>
                    </div>
                  </div>

                  {formData.is_digital && (
                    <div className="space-y-4 pt-2 border-t border-slate-800">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1">PDF Download URL</label>
                        <input
                          type="url"
                          placeholder="https://example.com/sample.pdf"
                          value={formData.pdf_url}
                          onChange={(e) => setFormData({...formData, pdf_url: e.target.value})}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1">Stripe Price ID (Optional)</label>
                        <input
                          type="text"
                          placeholder="price_1N..."
                          value={formData.stripe_price_id}
                          onChange={(e) => setFormData({...formData, stripe_price_id: e.target.value})}
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 py-3 rounded-xl font-bold shadow-gold-glow transition flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>{editingBook ? 'Update Book' : 'Add Book'}</span>
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
