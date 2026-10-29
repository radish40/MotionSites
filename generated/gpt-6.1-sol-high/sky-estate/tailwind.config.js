export default {
 content: ['./index.html','./src/**/*.{ts,tsx}'],
 theme: { extend: {
 colors: { 'brand-blue':'#8F9EFF', 'brand-navy':'#271C40', 'brand-dark':'#020319' },
 fontFamily: { sans: ['Inter Tight','system-ui','sans-serif'] },
 keyframes: { marquee: {'0%':{transform:'translateX(0%)'},'100%':{transform:'translateX(-50%)'}}, 'marquee-reverse': {'0%':{transform:'translateX(-50%)'},'100%':{transform:'translateX(0%)'}} },
 animation: { marquee: 'marquee 30s linear infinite', 'marquee-reverse':'marquee-reverse 30s linear infinite' }
 } }, plugins: []
};
