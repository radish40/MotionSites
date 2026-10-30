import type { Config } from 'tailwindcss';
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: { extend: { colors: {
    background: 'hsl(var(--background))', foreground: 'hsl(var(--foreground))',
    primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
    secondary: 'hsl(var(--secondary))', muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
    accent: 'hsl(var(--accent))', border: 'hsl(var(--border))', input: 'hsl(var(--input))',
  } } }, plugins: [],
} satisfies Config;
