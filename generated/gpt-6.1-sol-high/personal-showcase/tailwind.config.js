/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: { extend: {
    colors: { cream: '#efeee9' },
    fontFamily: Object.fromEntries(['hn', 'sans', 'serif'].map(name => [name, ['"Helvetica Neue ME"', 'Helvetica', 'Arial', 'sans-serif']]))
  } },
  plugins: []
};
