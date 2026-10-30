import type { Config } from 'tailwindcss';
export default { content: ['./app/**/*.{ts,tsx}'], theme: { extend: { colors: Object.fromEntries(['bg','surface','text','muted','accent','stroke'].map(name => [name, `var(--${name})`])), fontFamily: { display: ['var(--font-display)'], body: ['var(--font-body)'] } } }, plugins: [] } satisfies Config;
