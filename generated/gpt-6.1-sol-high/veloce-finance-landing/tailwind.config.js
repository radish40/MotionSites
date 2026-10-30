export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      spacing: { 15: '60px' },
      fontFamily: {
        manrope: ['Manrope', 'sans-serif'],
        helvetica: ['Helvetica', 'Arial', 'sans-serif'],
        'helvetica-neue': ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        'product-sans': ['Product Sans', 'sans-serif'],
        'sf-compact': ['SF Compact Display', 'SF Compact Text', 'system-ui', 'sans-serif'],
      },
      colors: { 'sintra-dark': '#00041F', 'sintra-accent': '#B56939', 'sintra-light': '#EFF4FF', 'sintra-gray': '#49484F' },
    },
  },
  plugins: [],
};
