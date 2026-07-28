import React, { useState, useEffect } from 'react';
import { 
  Palette, 
  Check, 
  RotateCcw, 
  Save, 
  AlertTriangle, 
  Sparkles, 
  Eye, 
  CheckCircle2, 
  History,
  MessageCircle
} from 'lucide-react';
import { 
  THEME_PRESETS, 
  getActiveTheme, 
  applyTheme, 
  resetThemeToDefault, 
  saveThemeToHistory, 
  getThemeHistory, 
  calculateContrastRatio 
} from '../utils/themeEngine';

export default function ThemeCustomizer() {
  const [activeColors, setActiveColors] = useState(getActiveTheme());
  const [selectedPresetId, setSelectedPresetId] = useState('classic');
  const [themeHistory, setThemeHistory] = useState(getThemeHistory());
  const [appliedNotice, setAppliedNotice] = useState('');

  // Contrast Ratio calculation
  const contrastRatio = calculateContrastRatio(activeColors.textBody, activeColors.bgPrimary);
  const isLowContrast = contrastRatio < 4.5;

  const handleSelectPreset = (preset) => {
    setSelectedPresetId(preset.id);
    setActiveColors({ ...preset.colors });
  };

  const handleColorChange = (key, value) => {
    setSelectedPresetId('custom');
    setActiveColors({ ...activeColors, [key]: value });
  };

  const handleApplyTheme = () => {
    applyTheme(activeColors);
    saveThemeToHistory(activeColors);
    setThemeHistory(getThemeHistory());
    setAppliedNotice('Theme applied site-wide! All pages updated dynamically.');
    setTimeout(() => setAppliedNotice(''), 4000);
  };

  const handleResetDefault = () => {
    const defaultColors = resetThemeToDefault();
    setActiveColors(defaultColors);
    setSelectedPresetId('classic');
    setAppliedNotice('Reset to default Classic Gold & Black theme.');
    setTimeout(() => setAppliedNotice(''), 4000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Palette className="w-6 h-6 text-amber-400" />
            <span>Theme Customizer & Design System</span>
          </h2>
          <p className="text-xs text-slate-400">
            Dynamically customize site-wide color schemes, button highlights, and background palettes with zero code changes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleResetDefault}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Default</span>
          </button>

          <button
            onClick={handleApplyTheme}
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold shadow-gold-glow flex items-center gap-2 transition hover:scale-105"
          >
            <Save className="w-4 h-4" />
            <span>Apply Theme Site-Wide</span>
          </button>
        </div>
      </div>

      {appliedNotice && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-2xl text-xs text-emerald-400 flex items-center gap-2 shadow-lg animate-fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="font-bold">{appliedNotice}</span>
        </div>
      )}

      {/* WCAG Low Contrast Warning Banner */}
      {isLowContrast && (
        <div className="bg-amber-500/10 border border-amber-500/40 p-4 rounded-2xl text-xs text-amber-400 flex items-center gap-2 shadow-lg animate-pulse">
          <AlertTriangle className="w-5 h-5 shrink-0 text-amber-400" />
          <div>
            <span className="font-bold block">Low Contrast Warning (WCAG Ratio: {contrastRatio}:1)</span>
            <span className="text-slate-300 text-[11px]">The text color and background color combination may be difficult for students to read. Recommended ratio is at least 4.5:1.</span>
          </div>
        </div>
      )}

      {/* 1. PRESET THEMES (READY-MADE PALETTES) */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Preset Color Palettes</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {THEME_PRESETS.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            return (
              <div
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`bg-slate-900 border rounded-2xl p-4 cursor-pointer transition-all duration-300 flex flex-col justify-between space-y-3 shadow-lg hover:scale-105 ${
                  isSelected ? 'border-amber-500 bg-slate-900/90 ring-2 ring-amber-500/30' : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-white">{preset.name}</span>
                    {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                  </div>

                  {/* Swatch Circles */}
                  <div className="flex items-center gap-2 pt-1">
                    {preset.swatch.map((c, i) => (
                      <span key={i} className="w-6 h-6 rounded-full border border-slate-700 shadow-inner" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                </div>

                <p className="text-[10px] text-slate-400 line-clamp-2">{preset.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. CUSTOM THEME BUILDER & LIVE PREVIEW PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Color Pickers */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center gap-2">
            <Palette className="w-4 h-4 text-amber-400" />
            <span>Custom Color Builder</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300">Primary Background</label>
              <input
                type="color"
                value={activeColors.bgPrimary}
                onChange={(e) => handleColorChange('bgPrimary', e.target.value)}
                className="w-8 h-8 rounded border-none bg-transparent cursor-pointer"
              />
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300">Secondary Background (Cards)</label>
              <input
                type="color"
                value={activeColors.bgSecondary}
                onChange={(e) => handleColorChange('bgSecondary', e.target.value)}
                className="w-8 h-8 rounded border-none bg-transparent cursor-pointer"
              />
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300">Primary Accent (Gold/Primary)</label>
              <input
                type="color"
                value={activeColors.accentPrimary}
                onChange={(e) => handleColorChange('accentPrimary', e.target.value)}
                className="w-8 h-8 rounded border-none bg-transparent cursor-pointer"
              />
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300">Secondary Accent (Red/Ribbon)</label>
              <input
                type="color"
                value={activeColors.accentSecondary}
                onChange={(e) => handleColorChange('accentSecondary', e.target.value)}
                className="w-8 h-8 rounded border-none bg-transparent cursor-pointer"
              />
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300">Heading Text Color</label>
              <input
                type="color"
                value={activeColors.textHeading}
                onChange={(e) => handleColorChange('textHeading', e.target.value)}
                className="w-8 h-8 rounded border-none bg-transparent cursor-pointer"
              />
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300">Body Text Color</label>
              <input
                type="color"
                value={activeColors.textBody}
                onChange={(e) => handleColorChange('textBody', e.target.value)}
                className="w-8 h-8 rounded border-none bg-transparent cursor-pointer"
              />
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300">WhatsApp / Success Green</label>
              <input
                type="color"
                value={activeColors.success}
                onChange={(e) => handleColorChange('success', e.target.value)}
                className="w-8 h-8 rounded border-none bg-transparent cursor-pointer"
              />
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300">Border / Divider Color</label>
              <input
                type="color"
                value={activeColors.border}
                onChange={(e) => handleColorChange('border', e.target.value)}
                className="w-8 h-8 rounded border-none bg-transparent cursor-pointer"
              />
            </div>

          </div>
        </div>

        {/* Right Real-Time Live Preview Panel */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center gap-2">
            <Eye className="w-4 h-4 text-amber-400" />
            <span>Real-Time Component Preview</span>
          </h3>

          {/* Sample Preview Container */}
          <div 
            className="p-6 rounded-2xl border space-y-4 shadow-2xl transition-all duration-300"
            style={{ 
              backgroundColor: activeColors.bgPrimary, 
              borderColor: activeColors.border 
            }}
          >
            {/* Sample Card */}
            <div 
              className="p-4 rounded-xl border space-y-3"
              style={{ 
                backgroundColor: activeColors.bgSecondary, 
                borderColor: activeColors.border 
              }}
            >
              <div className="flex justify-between items-center text-xs">
                <span className="px-2 py-0.5 rounded font-extrabold text-[10px]" style={{ backgroundColor: activeColors.accentPrimary, color: '#000' }}>
                  LEVEL B1
                </span>
                <span className="text-[10px]" style={{ color: activeColors.accentSecondary }}>
                  🔥 Visa Ready
                </span>
              </div>

              <h4 className="text-base font-extrabold" style={{ color: activeColors.textHeading }}>
                German B1 — Intermediate Online Course
              </h4>

              <p className="text-xs" style={{ color: activeColors.textBody }}>
                Essential level for German Ausbildung and job seeker visas.
              </p>

              <div className="pt-2 border-t flex justify-between items-center" style={{ borderColor: activeColors.border }}>
                <span className="text-sm font-extrabold" style={{ color: activeColors.accentPrimary }}>
                  ₨48,000 PKR
                </span>

                <button 
                  className="px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 shadow"
                  style={{ backgroundColor: activeColors.success, color: '#000' }}
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-current" />
                  <span>Enroll Now</span>
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* 3. ROLLBACK HISTORY (LAST 3 APPLIED THEMES) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <History className="w-4 h-4 text-amber-400" />
          <span>Rollback History (Last 3 Applied Themes)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {themeHistory.map((histTheme, idx) => (
            <div key={idx} className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-bold text-white block">Theme History #{idx + 1}</span>
                <div className="flex gap-1">
                  <span className="w-4 h-4 rounded-full border border-slate-700" style={{ backgroundColor: histTheme.bgPrimary }} />
                  <span className="w-4 h-4 rounded-full border border-slate-700" style={{ backgroundColor: histTheme.accentPrimary }} />
                  <span className="w-4 h-4 rounded-full border border-slate-700" style={{ backgroundColor: histTheme.accentSecondary }} />
                </div>
              </div>

              <button
                onClick={() => {
                  setActiveColors({ ...histTheme });
                  applyTheme(histTheme);
                  setAppliedNotice(`Restored Theme History #${idx + 1}!`);
                  setTimeout(() => setAppliedNotice(''), 4000);
                }}
                className="px-3 py-1.5 bg-slate-900 border border-slate-700 hover:border-amber-500 text-amber-400 text-xs font-bold rounded-lg transition"
              >
                Restore
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
