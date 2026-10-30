import animate from 'tailwindcss-animate';
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: { extend: {
    colors: { background: 'hsl(var(--background))', foreground: 'hsl(var(--foreground))', primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' } },
    borderRadius: { DEFAULT: 'var(--radius)' },
    fontFamily: { sans: ['Inter', 'sans-serif'] },
    keyframes: { marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } } },
    animation: { marquee: 'marquee 20s linear infinite' }
  } }, plugins: [animate]
};
