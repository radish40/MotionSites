export default {
 content: ['./index.html', './src/**/*.{js,jsx}'],
 theme: {
  fontFamily: { body: ['Barlow', 'sans-serif'], accent: ['Instrument Serif', 'serif'] },
  extend: { colors: Object.fromEntries(['background','foreground','card','card-foreground','primary','primary-foreground','secondary','secondary-foreground','muted','muted-foreground','accent','accent-foreground','border','input','ring'].map(key => [key, `hsl(var(--${key}) / <alpha-value>)`])) }
 }, plugins: []
};
