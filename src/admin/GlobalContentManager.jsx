import React, { useState, useEffect, useRef } from 'react';
import { Type, Save, CheckCircle2, AlertCircle, Image as ImageIcon, Upload } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useGlobalContent } from '../context/GlobalContentContext';

export default function GlobalContentManager() {
  const { settings, refetch } = useGlobalContent();
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Populate form with current settings
    setFormData(settings);
  }, [settings]);

  const handleChange = (id, value) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Please upload an image smaller than 2MB.");
      return;
    }

    setUploadingLogo(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `logo-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('branding')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('branding')
        .getPublicUrl(fileName);

      handleChange('logo_url', publicUrlData.publicUrl);
    } catch (error) {
      console.error('Error uploading logo:', error);
      alert('Failed to upload logo. Ensure the branding bucket exists in Supabase.');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);

    try {
      // Supabase requires updating rows individually or using upsert
      const updates = Object.keys(formData).map(key => ({
        key,
        value: formData[key],
        updated_at: new Date().toISOString()
      }));

      const { error } = await supabase.from('site_settings').upsert(updates);
      
      if (error) throw error;
      
      setStatus('success');
      refetch(); // Update context immediately
      
      // Clear success message after 3 seconds
      setTimeout(() => setStatus(null), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setStatus('error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <Type className="w-6 h-6 text-amber-400" />
          <span>Global Content Manager</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Update text here and it will instantly change everywhere on the website.
        </p>
      </div>

      {status === 'success' && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3 text-emerald-400 text-sm font-medium">
          <CheckCircle2 className="w-5 h-5" />
          <span>Global settings successfully updated! Changes are now live.</span>
        </div>
      )}

      {status === 'error' && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm font-medium">
          <AlertCircle className="w-5 h-5" />
          <span>Failed to update settings. Make sure you are logged in as an Admin.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-8 shadow-xl">
        
        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-2">Contact Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2">Primary WhatsApp Number</label>
              <input
                type="text"
                value={formData.whatsapp_number || ''}
                onChange={(e) => handleChange('whatsapp_number', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 transition"
                placeholder="e.g. 03421189593"
              />
              <p className="text-[10px] text-slate-500 mt-1">Used for all CTA buttons and links</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2">Support Email Address</label>
              <input
                type="email"
                value={formData.support_email || ''}
                onChange={(e) => handleChange('support_email', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 transition"
              />
            </div>
          </div>
        </div>

        {/* Website Main Copy */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-2">Website Main Text</h3>
          
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2">Main Hero Title</label>
              <input
                type="text"
                value={formData.hero_title || ''}
                onChange={(e) => handleChange('hero_title', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2">Main Hero Description</label>
              <textarea
                value={formData.hero_description || ''}
                onChange={(e) => handleChange('hero_description', e.target.value)}
                rows={3}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 transition resize-none"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Branding & Media */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-2">Logo, Branding & Media</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Logo Uploader */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-xs font-bold text-slate-400 mb-2">Main Website Logo</label>
              <div className="flex items-center gap-6 bg-slate-950 p-4 rounded-xl border border-slate-700">
                <div className="w-16 h-16 bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center shrink-0 border border-slate-800 relative">
                  {formData.logo_url ? (
                    <img src={formData.logo_url} alt="Current Logo" className="w-full h-full object-cover scale-[1.2]" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-slate-600" />
                  )}
                  {uploadingLogo && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleLogoUpload}
                    accept="image/png, image/jpeg, image/svg+xml"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingLogo}
                    className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded text-xs font-medium flex items-center gap-2 transition"
                  >
                    <Upload className="w-4 h-4" />
                    <span>{uploadingLogo ? 'Uploading...' : 'Upload New Logo'}</span>
                  </button>
                  <p className="text-[10px] text-slate-500 mt-2">Recommended: Transparent PNG or SVG, max 2MB. Updates Navbar, Footer, and Favicon instantly.</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2">Brand Tagline</label>
              <input
                type="text"
                value={formData.tagline || ''}
                onChange={(e) => handleChange('tagline', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 transition"
                placeholder="e.g. Learn, Practice, Pass Goethe"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2">Image Watermark Text</label>
              <input
                type="text"
                value={formData.watermark_text || ''}
                onChange={(e) => handleChange('watermark_text', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 transition"
              />
              <p className="text-[10px] text-slate-500 mt-1">Automatically applied to new Gallery images</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2">Footer Address text</label>
              <textarea
                value={formData.address || ''}
                onChange={(e) => handleChange('address', e.target.value)}
                rows={2}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 transition resize-none"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Enrollment & Payment */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-2">Enrollment & Payment</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2">Discount Coupon Code</label>
              <input
                type="text"
                value={formData.discount_code || ''}
                onChange={(e) => handleChange('discount_code', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 transition"
                placeholder="e.g. GERMAN20"
              />
              <p className="text-[10px] text-slate-500 mt-1">Leave blank to disable coupon display</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2">Payment Instructions Text</label>
              <textarea
                value={formData.payment_instructions || ''}
                onChange={(e) => handleChange('payment_instructions', e.target.value)}
                rows={3}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 transition resize-none"
                placeholder="e.g. Please transfer the fee to our official bank account..."
              ></textarea>
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-sm shadow-gold-glow flex items-center gap-2 transition"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Changes...' : 'Save Global Settings'}</span>
          </button>
        </div>

      </form>
    </div>
  );
}
