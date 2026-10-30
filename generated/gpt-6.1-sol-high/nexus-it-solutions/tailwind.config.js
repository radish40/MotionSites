export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: { extend: {
    colors: { background: 'hsl(var(--background) / <alpha-value>)', foreground: 'hsl(var(--foreground) / <alpha-value>)', primary: 'hsl(var(--primary) / <alpha-value>)', 'muted-foreground': 'hsl(var(--muted-foreground) / <alpha-value>)' },
    fontFamily: { sans: ['Inter','sans-serif'], akshar: ['Akshar','sans-serif'] }
  } },
  plugins: []
};
