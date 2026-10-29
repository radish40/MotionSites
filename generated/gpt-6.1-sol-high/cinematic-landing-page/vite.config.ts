import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
export default defineConfig({ plugins: [react()], base: '/motionsites-results/cinematic-landing-page/', build: { rollupOptions: { output: { manualChunks: { lottie: ['lottie-react'], motion: ['gsap', '@gsap/react'], react: ['react', 'react-dom'] } } } } });
