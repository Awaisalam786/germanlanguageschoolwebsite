/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0F172A',
          darker: '#090D16',
          slate: '#1E293B',
          card: '#182234',
          gold: '#D97706',
          goldHover: '#B45309',
          goldLight: '#FEF3C7',
          goldAccent: '#F59E0B',
          red: '#DC2626',
          redHover: '#B91C1C',
          redLight: '#FEE2E2',
          cream: '#FFFBEB',
          muted: '#94A3B8'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
        urdu: ['Noto Nastaliq Urdu', 'Segoe UI', 'sans-serif']
      },
      boxShadow: {
        'gold-glow': '0 4px 20px -2px rgba(217, 119, 6, 0.25)',
        'red-glow': '0 4px 20px -2px rgba(220, 38, 38, 0.25)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.12)',
      }
    },
  },
  plugins: [],
}
