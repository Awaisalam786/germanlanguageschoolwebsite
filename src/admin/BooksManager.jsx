import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Edit, Trash2, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function BooksManager() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    image_url: '',
    in_stock: true
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('books').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      setBooks(data);
    }
    setLoading(false);
  };

  const handleOpenAdd = () => {
    setEditingBook(null);
    setFormData({
      title: '',
      description: '',
      price: '',
      image_url: '',
      in_stock: true
    });
    setShowModal(true);
  };

  const handleOpenEdit = (book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      description: book.description,
      price: book.price,
      image_url: book.image_url,
      in_stock: book.in_stock
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this book?')) {
      const { error } = await supabase.from('books').delete().eq('id', id);
      if (!error) {
        setBooks(books.filter(b => b.id !== id));
      } else {
        alert('Failed to delete book');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const payload = {
      title: formData.title,
      description: formData.description,
      price: formData.price,
      image_url: formData.image_url,
      in_stock: formData.in_stock
    };

    if (editingBook) {
      const { data, error } = await supabase.from('books').update(payload).eq('id', editingBook.id).select().single();
      if (!error && data) {
        setBooks(books.map(b => b.id === editingBook.id ? data : b));
        setShowModal(false);
      } else {
        alert('Failed to update book');
      }
    } else {
      const { data, error } = await supabase.from('books').insert([payload]).select().single();
      if (!error && data) {
        setBooks([data, ...books]);
        setShowModal(false);
      } else {
        alert('Failed to add book');
      }
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
          <p className="text-xs text-slate-400">Manage books and study materials available for students.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-amber-500 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold hover:bg-amber-400 transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add New Book
        </button>
      </div>

      {/* Book Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => (
          <div key={book.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-amber-500/40 transition flex flex-col justify-between">
            <div className="space-y-4">
              {book.image_url ? (
                <img src={book.image_url} alt={book.title} className="w-full h-48 object-cover rounded-xl border border-slate-800" />
              ) : (
                <div className="w-full h-48 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center text-slate-500">
                  <ImageIcon className="w-8 h-8 opacity-50" />
                </div>
              )}
              <div>
                <div className="flex justify-between items-start gap-2">
                  <h3 className="text-lg font-bold text-white leading-tight">{book.title}</h3>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 border ${
                    book.in_stock ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
                  }`}>
                    {book.in_stock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
                <div className="text-amber-400 font-bold mt-1">{book.price}</div>
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
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

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
                <p className="text-xs text-slate-400">Fill in the book details below.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Book Title</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Price (e.g. ₨ 3,500 PKR)</label>
                    <input
                      type="text"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Cover Image URL</label>
                    <input
                      type="text"
                      value={formData.image_url}
                      onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                      placeholder="https://example.com/book.jpg"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Description</label>
                    <textarea
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={3}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                    ></textarea>
                  </div>

                  <div className="flex items-center gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <input
                      type="checkbox"
                      id="in_stock"
                      checked={formData.in_stock}
                      onChange={(e) => setFormData({...formData, in_stock: e.target.checked})}
                      className="w-5 h-5 accent-amber-500 rounded border-slate-700 bg-slate-900 cursor-pointer"
                    />
                    <label htmlFor="in_stock" className="text-sm font-bold text-slate-300 select-none cursor-pointer">
                      Book is In Stock
                    </label>
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    type="submit"
                    className="w-full bg-amber-500 text-slate-950 py-3 rounded-xl font-bold shadow-gold-glow hover:bg-amber-400 transition"
                  >
                    {editingBook ? 'Update Book' : 'Add Book'}
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
