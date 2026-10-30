export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: { extend: {
    colors: { background: 'hsl(var(--background))', foreground: 'hsl(var(--foreground) / <alpha-value>)', heading: 'hsl(var(--heading))', description: 'hsl(var(--description))', primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' } },
    fontFamily: { heading: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Text', 'SF Pro Display', 'system-ui', 'sans-serif'], body: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Text', 'SF Pro Display', 'system-ui', 'sans-serif'] },
    borderRadius: { full: 'var(--radius)' }
  } },
  plugins: []
};
