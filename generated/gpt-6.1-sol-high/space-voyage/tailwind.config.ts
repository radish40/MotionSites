import type { Config } from 'tailwindcss';
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: { extend: {
    fontFamily: { heading: ["'Instrument Serif'", 'serif'], body: ["'Barlow'", 'sans-serif'] },
    colors: { background: 'hsl(var(--background) / <alpha-value>)', foreground: 'hsl(var(--foreground) / <alpha-value>)' },
    borderRadius: { DEFAULT: 'var(--radius)' },
  } }, plugins: [],
} satisfies Config;
