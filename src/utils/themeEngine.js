// DYNAMIC THEME CUSTOMIZER ENGINE FOR GERMAN LANGUAGE SCHOOL

export const THEME_PRESETS = [
  {
    id: 'classic',
    name: 'Classic Gold & Black (Default)',
    description: 'German flag inspired: Dark Slate Charcoal, Imperial Gold, Maroon accents.',
    swatch: ['#0F172A', '#F59E0B', '#DC2626'],
    colors: {
      bgPrimary: '#0F172A',
      bgSecondary: '#1E293B',
      accentPrimary: '#F59E0B',
      accentSecondary: '#DC2626',
      textHeading: '#FFFFFF',
      textBody: '#CBD5E1',
      success: '#10B981',
      border: '#334155'
    }
  },
  {
    id: 'navy',
    name: 'Deep Navy & Gold',
    description: 'Corporate & academic elegance: Deep Navy Blue background with Gold highlights.',
    swatch: ['#0B132B', '#F4A261', '#1C2541'],
    colors: {
      bgPrimary: '#0B132B',
      bgSecondary: '#1C2541',
      accentPrimary: '#F4A261',
      accentSecondary: '#E76F51',
      textHeading: '#FFFFFF',
      textBody: '#E2E8F0',
      success: '#2EC4B6',
      border: '#3A506B'
    }
  },
  {
    id: 'emerald',
    name: 'Charcoal & Emerald',
    description: 'Modern, fresh & energetic: Dark Charcoal with Vibrant Emerald Green accents.',
    swatch: ['#121212', '#10B981', '#34D399'],
    colors: {
      bgPrimary: '#121212',
      bgSecondary: '#1E1E1E',
      accentPrimary: '#10B981',
      accentSecondary: '#059669',
      textHeading: '#FFFFFF',
      textBody: '#D1D5DB',
      success: '#34D399',
      border: '#27272A'
    }
  },
  {
    id: 'maroon',
    name: 'Maroon & Cream',
    description: 'Warm, rich & prestigious: Deep Maroon background with Cream/Gold accents.',
    swatch: ['#2B0910', '#E0A96D', '#4A121A'],
    colors: {
      bgPrimary: '#2B0910',
      bgSecondary: '#3D0F19',
      accentPrimary: '#E0A96D',
      accentSecondary: '#991B1B',
      textHeading: '#FFFFFF',
      textBody: '#F1F5F9',
      success: '#10B981',
      border: '#5C1D28'
    }
  },
  {
    id: 'midnight',
    name: 'Midnight Blue & Silver',
    description: 'Sleek tech & modern feel: Midnight Blue background with Silver/Cyan highlights.',
    swatch: ['#0A1128', '#38BDF8', '#1E293B'],
    colors: {
      bgPrimary: '#0A1128',
      bgSecondary: '#001F54',
      accentPrimary: '#38BDF8',
      accentSecondary: '#0284C7',
      textHeading: '#FFFFFF',
      textBody: '#E2E8F0',
      success: '#34D399',
      border: '#1E3A8A'
    }
  }
];

// Apply Theme to DOM root
export function applyTheme(themeColors) {
  if (!themeColors) return;

  const root = document.documentElement;
  root.style.setProperty('--color-bg-primary', themeColors.bgPrimary);
  root.style.setProperty('--color-bg-secondary', themeColors.bgSecondary);
  root.style.setProperty('--color-accent-primary', themeColors.accentPrimary);
  root.style.setProperty('--color-accent-secondary', themeColors.accentSecondary);
  root.style.setProperty('--color-text-heading', themeColors.textHeading);
  root.style.setProperty('--color-text-body', themeColors.textBody);
  root.style.setProperty('--color-success', themeColors.success);
  root.style.setProperty('--color-border', themeColors.border);

  // Save active theme in localStorage
  localStorage.setItem('gls_active_theme', JSON.stringify(themeColors));
}

// Get Active Theme or Default
export function getActiveTheme() {
  const saved = localStorage.getItem('gls_active_theme');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      return THEME_PRESETS[0].colors;
    }
  }
  return THEME_PRESETS[0].colors;
}

// Save to Rollback History (Keeps last 3)
export function saveThemeToHistory(themeColors) {
  const history = getThemeHistory();
  const updated = [themeColors, ...history.filter(t => JSON.stringify(t) !== JSON.stringify(themeColors))].slice(0, 3);
  localStorage.setItem('gls_theme_history', JSON.stringify(updated));
}

// Get Theme History
export function getThemeHistory() {
  const saved = localStorage.getItem('gls_theme_history');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      return [THEME_PRESETS[0].colors];
    }
  }
  return [THEME_PRESETS[0].colors];
}

// Reset Theme to Default Classic Gold
export function resetThemeToDefault() {
  const defaultColors = THEME_PRESETS[0].colors;
  applyTheme(defaultColors);
  return defaultColors;
}

// WCAG Contrast Calculator (Relative Luminance Check)
export function calculateContrastRatio(hex1, hex2) {
  const getLuminance = (hex) => {
    const rgb = parseInt(hex.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    const a = [r, g, b].map(v => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };

  try {
    const l1 = getLuminance(hex1);
    const l2 = getLuminance(hex2);
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    return Math.round(ratio * 10) / 10;
  } catch (e) {
    return 5.0; // fallback safe
  }
}
