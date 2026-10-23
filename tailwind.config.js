/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        forest: '#183F32',
        moss: '#285744',
        sage: '#A8BBA4',
        mint: '#E1EDE3',
        ivory: '#F7F6F0',
        lavender: '#DCD8E9',
        ink: '#24352D',
        muted: '#727B73',
      },
      fontFamily: {
        serif: ['"DM Serif Display"', 'Georgia', '"Times New Roman"', 'serif'],
        sans: ['Manrope', 'ui-sans-serif', 'system-ui', '-apple-system', '"Segoe UI"', 'sans-serif'],
      },
      maxWidth: { prose: '36rem' },
    },
  },
  plugins: [],
}
