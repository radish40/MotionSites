import type { Config } from 'tailwindcss';
export default { content: ['./index.html', './src/**/*.{ts,tsx}'], theme: { extend: { colors: { background: 'hsl(var(--background) / <alpha-value>)', foreground: 'hsl(var(--foreground) / <alpha-value>)', landing: { surface: 'rgba(255, 255, 255, 0.10)' } }, fontFamily: { sans: ['Inter', 'sans-serif'] } } }, plugins: [] } satisfies Config;
