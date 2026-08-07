import React, { useState, useEffect, useMemo } from 'react';
import { Newspaper, Plus, Edit, Trash2, Calendar, Clock, X, Loader2, Save, Send, Eye, Link as LinkIcon, Settings, Tag, Globe } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

// Dynamically import react-quill-new to avoid SSR issues in Next.js
const ReactQuill = dynamic(() => import('react-quill-new'), { 
  ssr: false,
  loading: () => <div className="h-64 flex items-center justify-center text-slate-400 bg-slate-950 rounded-xl border border-slate-800">Loading editor...</div>
});

export default function BlogCMS() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Exam Tips',
    tags: '',
    author: 'Dr. Michael Weber',
    read_time: '5 min read',
    summary: '',
    content: '',
    image: '',
    status: 'Draft',
    meta_title: '',
    meta_description: ''
  });

  const [activeTab, setActiveTab] = useState('content'); // 'content' | 'seo'
  const [filterStatus, setFilterStatus] = useState('All');

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
      slug: '',
      category: 'Exam Tips',
      tags: '',
      author: 'Dr. Michael Weber',
      read_time: '5 min read',
      summary: '',
      content: '',
      image: '',
      status: 'Draft',
      meta_title: '',
      meta_description: ''
    });
    setActiveTab('content');
    setShowModal(true);
  };

  const handleOpenEdit = (post) => {
    setEditingPost(post);
    setFormData({ 
      title: post.title || '',
      slug: post.slug || '',
      category: post.category || 'Exam Tips',
      tags: post.tags ? post.tags.join(', ') : '',
      author: post.author || 'Dr. Michael Weber',
      read_time: post.read_time || '5 min read',
      summary: post.summary || '',
      content: post.content || '',
      image: post.image || '',
      status: post.status || 'Draft',
      meta_title: post.meta_title || '',
      meta_description: post.meta_description || ''
    });
    setActiveTab('content');
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this article completely?')) {
      const { error } = await supabase.from('blog_posts').delete().eq('id', id);
      if (!error) {
        setPosts(posts.filter(p => p.id !== id));
      } else {
        alert('Failed to delete post');
      }
    }
  };

  const generateSlug = (title) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Auto-generate slug if missing
    let finalSlug = formData.slug.trim();
    if (!finalSlug) finalSlug = generateSlug(formData.title);

    // Process tags
    const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(t => t.length > 0);

    const payload = {
      title: formData.title,
      slug: finalSlug,
      category: formData.category,
      tags: tagsArray,
      author: formData.author,
      read_time: formData.read_time,
      summary: formData.summary,
      content: formData.content,
      image: formData.image,
      status: formData.status,
      meta_title: formData.meta_title || formData.title,
      meta_description: formData.meta_description || formData.summary
    };

    if (editingPost) {
      const { data, error } = await supabase.from('blog_posts').update(payload).eq('id', editingPost.id).select().single();
      if (!error && data) {
        setPosts(posts.map(p => p.id === editingPost.id ? data : p));
        setShowModal(false);
      } else {
        alert('Failed to update post: ' + (error?.message || 'Unknown error'));
      }
    } else {
      const { data, error } = await supabase.from('blog_posts').insert([payload]).select().single();
      if (!error && data) {
        setPosts([data, ...posts]);
        setShowModal(false);
      } else {
        alert('Failed to add post: ' + (error?.message || 'Unknown error'));
      }
    }
  };

  // React Quill Modules for Toolbar
  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image', 'video'],
      ['clean']
    ],
  }), []);

  const filteredPosts = posts.filter(p => filterStatus === 'All' ? true : p.status === filterStatus);

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Newspaper className="w-6 h-6 text-amber-400" />
            <span>Blog Management</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">Write articles, manage SEO, and publish content independently.</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold rounded-xl text-xs shadow-gold-glow flex items-center gap-2 transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Write New Article</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        {['All', 'Published', 'Draft'].map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
              filterStatus === status 
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* List View */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-amber-500 animate-spin" /></div>
      ) : (
        <div className="space-y-4">
          {filteredPosts.length === 0 ? (
            <div className="text-center text-slate-400 py-12 bg-slate-900/50 rounded-2xl border border-slate-800/50">
              No blog posts found matching your criteria.
            </div>
          ) : filteredPosts.map((post) => (
            <div key={post.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm hover:border-slate-700 transition group">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                {post.image ? (
                  <img src={post.image} alt={post.title} className="w-24 h-24 rounded-xl object-cover border border-slate-800 shrink-0" />
                ) : (
                  <div className="w-24 h-24 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
                    <Newspaper className="w-8 h-8 text-slate-700" />
                  </div>
                )}
                
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      post.status === 'Published' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}>
                      {post.status || 'Draft'}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-bold text-[10px] border border-amber-500/20">
                      {post.category}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors leading-tight">
                    {post.title}
                  </h3>
                  <div className="text-[11px] text-slate-400 flex items-center gap-3 flex-wrap">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(post.created_at).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.read_time}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 border-slate-800 pt-3 sm:pt-0">
                {post.status === 'Published' && (
                  <a href={`/blog/${post.slug}`} target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition tooltip-trigger">
                    <Eye className="w-4 h-4" />
                  </a>
                )}
                <button onClick={() => handleOpenEdit(post)} className="px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-xs font-bold transition flex items-center gap-2">
                  <Edit className="w-3.5 h-3.5" /> Edit
                </button>
                <button onClick={() => handleDelete(post.id)} className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Editor Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex justify-center overflow-y-auto pt-10 pb-20 px-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-5xl w-full h-max min-h-[80vh] shadow-2xl overflow-hidden flex flex-col">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center bg-slate-950 px-6 py-4 border-b border-slate-800 sticky top-0 z-10">
              <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                {editingPost ? <Edit className="w-5 h-5 text-amber-400" /> : <Plus className="w-5 h-5 text-amber-400" />}
                {editingPost ? 'Edit Article' : 'Write New Article'}
              </h3>
              <div className="flex items-center gap-3">
                <button onClick={() => setShowModal(false)} className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row flex-1">
              
              {/* Left Column (Main Editor) */}
              <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                
                {/* Title */}
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Enter Blog Title Here..."
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-transparent text-3xl font-extrabold text-white placeholder-slate-600 focus:outline-none"
                  />
                  <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
                    <LinkIcon className="w-3.5 h-3.5" />
                    <span>/blog/</span>
                    <input 
                      type="text" 
                      placeholder="auto-generated-slug" 
                      value={formData.slug} 
                      onChange={(e) => setFormData({...formData, slug: e.target.value})}
                      className="bg-transparent border-b border-slate-700 border-dashed focus:border-amber-500 focus:outline-none text-slate-300 w-64"
                    />
                  </div>
                </div>

                {/* Rich Text Editor */}
                <div className="prose prose-invert max-w-none bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
                  <ReactQuill 
                    theme="snow" 
                    value={formData.content} 
                    onChange={(val) => setFormData({...formData, content: val})} 
                    modules={modules}
                    className="h-[500px] text-white"
                  />
                </div>
              </div>

              {/* Right Column (Settings & SEO) */}
              <div className="w-full lg:w-80 bg-slate-950 border-l border-slate-800 p-6 space-y-6 overflow-y-auto">
                
                {/* Publish Status Action */}
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">Status</span>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg border focus:outline-none ${
                        formData.status === 'Published' 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      <option value="Draft">Draft</option>
                      <option value="Published">Published</option>
                    </select>
                  </div>
                  
                  <button type="submit" className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold rounded-lg text-xs shadow-gold-glow flex items-center justify-center gap-2 transition active:scale-95">
                    {formData.status === 'Published' ? <Send className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                    <span>{formData.status === 'Published' ? (editingPost ? 'Update & Publish' : 'Publish Now') : 'Save as Draft'}</span>
                  </button>
                </div>

                {/* Settings Accordion */}
                <div className="space-y-4">
                  <h4 className="text-xs font-extrabold text-white uppercase tracking-widest flex items-center gap-2 border-b border-slate-800 pb-2">
                    <Settings className="w-4 h-4 text-amber-400" /> Post Details
                  </h4>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] text-slate-400 font-bold mb-1">Featured Image URL</label>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                      {formData.image && <img src={formData.image} className="mt-2 w-full h-24 object-cover rounded-lg border border-slate-800" alt="Preview" />}
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-400 font-bold mb-1">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      >
                        <option value="Exam Tips">Exam Tips</option>
                        <option value="Visa Guide">Visa Guide</option>
                        <option value="Success Stories">Success Stories</option>
                        <option value="Vocabulary & Grammar">Vocabulary & Grammar</option>
                        <option value="Germany Life">Germany Life</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-400 font-bold mb-1">Tags (comma separated)</label>
                      <div className="relative">
                        <Tag className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                        <input
                          type="text"
                          placeholder="goethe, speaking, b1..."
                          value={formData.tags}
                          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-400 font-bold mb-1">Author</label>
                      <input
                        type="text"
                        value={formData.author}
                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>

                {/* SEO Accordion */}
                <div className="space-y-4 pt-4">
                  <h4 className="text-xs font-extrabold text-white uppercase tracking-widest flex items-center gap-2 border-b border-slate-800 pb-2">
                    <Globe className="w-4 h-4 text-emerald-400" /> SEO Settings
                  </h4>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] text-slate-400 font-bold mb-1">Meta Title (Google Title)</label>
                      <input
                        type="text"
                        placeholder="Default is article title"
                        value={formData.meta_title}
                        onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                      <div className="text-[9px] text-slate-500 mt-1 text-right">{formData.meta_title.length} / 60 chars</div>
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-400 font-bold mb-1">Meta Description (Google Description) & Excerpt</label>
                      <textarea
                        rows={3}
                        placeholder="Brief summary for search engines and blog cards..."
                        value={formData.summary}
                        onChange={(e) => {
                          setFormData({ ...formData, summary: e.target.value, meta_description: e.target.value });
                        }}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                      <div className="text-[9px] text-slate-500 mt-1 text-right">{formData.summary.length} / 160 chars</div>
                    </div>
                  </div>
                </div>

              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
