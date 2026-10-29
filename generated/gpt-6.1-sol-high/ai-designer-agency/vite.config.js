import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({ plugins: [react()], base: '/motionsites-results/ai-designer-agency/', build: { rollupOptions: { output: { manualChunks: { 'hls': ['hls.js'], 'motion': ['framer-motion'] } } } } });
