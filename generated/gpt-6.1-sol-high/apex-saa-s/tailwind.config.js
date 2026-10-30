export default {
 content: ['./index.html', './src/**/*.{ts,tsx}'],
 theme: { extend: {
 colors: Object.fromEntries(['background','foreground','primary','primary-foreground','secondary','secondary-foreground','muted','muted-foreground','border','card','ring'].map(name => [name, `hsl(var(--${name}) / <alpha-value>)`]).concat([['hero',{heading:'hsl(var(--hero-heading) / <alpha-value>)',sub:'hsl(var(--hero-sub) / <alpha-value>)'}]])),
 borderRadius: {lg:'var(--radius)'},
 keyframes: {marquee:{'0%':{transform:'translateX(0%)'},'100%':{transform:'translateX(-50%)'}}},
 animation: {marquee:'marquee 20s linear infinite'}
 }}, plugins: []
};
