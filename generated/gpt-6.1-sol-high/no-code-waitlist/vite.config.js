import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({ base: '/motionsites-results/no-code-waitlist/', plugins: [react(), tailwindcss()], build: { rollupOptions: { output: { manualChunks: { 'hls': ['hls.js'] } } } } });
