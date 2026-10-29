/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: { extend: {
    colors: { background: 'hsl(var(--background) / <alpha-value>)', foreground: 'hsl(var(--foreground) / <alpha-value>)', landing: { surface: 'rgba(255,255,255,0.10)' } },
    fontFamily: { sans: ['Inter', 'sans-serif'], inter: ['Inter', 'sans-serif'] },
    transitionDuration: { 400: '400ms' }
  } },
  plugins: []
};
