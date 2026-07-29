import React, { useState, useEffect } from 'react';
import { Newspaper, Plus, Edit, Trash2, Calendar, Clock, X, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function BlogCMS() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Exam Tips',
    author: 'Dr. Michael Weber',
    read_time: '6 min read',
    summary: '',
    content: '',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80'
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      setPosts(data);
    }
    setLoading(false);
  };

  const handleOpenAdd = () => {
    setEditingPost(null);
    setFormData({
      title: '',
      category: 'Exam Tips',
      author: 'Dr. Michael Weber',
      read_time: '6 min read',
      summary: '',
      content: '',
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80'
    });
    setShowModal(true);
  };

  const handleOpenEdit = (post) => {
    setEditingPost(post);
    setFormData({ 
      title: post.title,
      category: post.category,
      author: post.author,
      read_time: post.read_time,
      summary: post.summary,
      content: post.content,
      image: post.image
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this article?')) {
      const { error } = await supabase.from('blog_posts').delete().eq('id', id);
      if (!error) {
        setPosts(posts.filter(p => p.id !== id));
      } else {
        alert('Failed to delete post');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingPost) {
      const { data, error } = await supabase.from('blog_posts').update(formData).eq('id', editingPost.id).select().single();
      if (!error && data) {
        setPosts(posts.map(p => p.id === editingPost.id ? data : p));
        setShowModal(false);
      } else {
        alert('Failed to update post');
      }
    } else {
      const { data, error } = await supabase.from('blog_posts').insert([formData]).select().single();
      if (!error && data) {
        setPosts([data, ...posts]);
        setShowModal(false);
      } else {
        alert('Failed to add post');
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Newspaper className="w-6 h-6 text-amber-400" />
            <span>Blog & Exam Tips CMS</span>
          </h2>
          <p className="text-xs text-slate-400">Publish exam guides, culture articles, and visa updates.</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-gold-glow flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Write New Article</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-amber-500 animate-spin" /></div>
      ) : (
        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="text-center text-slate-400 py-12">No blog posts found.</div>
          ) : posts.map((post) => (
            <div key={post.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img src={post.image} alt={post.title} className="w-20 h-20 rounded-xl object-cover border border-slate-800 shrink-0" />
                <div className="space-y-1">
                  <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-bold text-[10px]">
                    {post.category}
                  </span>
                  <h3 className="text-sm font-bold text-white leading-snug">{post.title}</h3>
                  <div className="text-[11px] text-slate-400">By {post.author} • {new Date(post.created_at).toLocaleDateString()}</div>
                </div>
              </div>

              <div className="flex space-x-2">
                <button onClick={() => handleOpenEdit(post)} className="p-2 rounded bg-slate-800 text-amber-400 hover:bg-slate-700">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(post.id)} className="p-2 rounded bg-slate-800 text-red-400 hover:bg-slate-700">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">{editingPost ? 'Edit Article' : 'Write New Article'}</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Article Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="Exam Tips">Exam Tips</option>
                    <option value="Visa & Career">Visa & Career</option>
                    <option value="Healthcare">Healthcare</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Author</label>
                  <input
                    type="text"
                    required
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Summary / Excerpt</label>
                <textarea
                  rows={2}
                  required
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Full Article Content</label>
                <textarea
                  rows={5}
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <button type="submit" className="w-full py-3 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs shadow">
                {editingPost ? 'Update Article' : 'Publish Article to Public Site'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
