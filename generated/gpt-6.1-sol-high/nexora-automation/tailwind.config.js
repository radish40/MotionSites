import animate from 'tailwindcss-animate';
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: { extend: {
    fontFamily: { display: ['var(--font-display)'], body: ['var(--font-body)'] },
    colors: { border: 'hsl(var(--border) / <alpha-value>)', ring: 'hsl(var(--ring) / <alpha-value>)', background: 'hsl(var(--background) / <alpha-value>)', foreground: 'hsl(var(--foreground) / <alpha-value>)', ...Object.fromEntries(['primary','secondary','muted','accent','success','warning','destructive'].map(x=>[x,{ DEFAULT: `hsl(var(--${x}) / <alpha-value>)`, foreground: `hsl(var(--${x}-foreground) / <alpha-value>)` }])) },
    borderRadius: { lg: 'var(--radius)' }
  } }, plugins: [animate]
};
