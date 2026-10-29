export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: { extend: {
    fontFamily: { sans: ['Inter', 'sans-serif'] },
    colors: { background: 'hsl(var(--background) / <alpha-value>)', foreground: 'hsl(var(--foreground) / <alpha-value>)', primary: 'hsl(var(--primary) / <alpha-value>)', accent: 'hsl(var(--accent) / <alpha-value>)' }
  } }, plugins: []
};
