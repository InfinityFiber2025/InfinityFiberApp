/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        infinity: {
          bg: '#0a0a0a',
          surface: '#111111',
          card: '#1a1a1a',
          border: '#262626',
          text: '#e5e5e5',
          subtext: '#a1a1aa',
          primary: '#3b82f6'
        }
      }
    }
  },
  plugins: [],
}
