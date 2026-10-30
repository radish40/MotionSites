import { defineConfig } from 'vite';
export default defineConfig({
  base: '/motionsites-results/luminex-hero/',
  build: { rollupOptions: { output: { manualChunks: { hls: ['hls.js/light'] } } } }
});
