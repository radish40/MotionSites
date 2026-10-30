export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: { extend: {
    fontFamily: { sans: ['"Roobert TRIAL"', 'system-ui', 'sans-serif'], instrument: ['"Instrument Serif"', 'Georgia', 'serif'] },
    colors: { navy: { 950: '#020b1f', 900: '#041536' } }
  } },
  plugins: []
};
