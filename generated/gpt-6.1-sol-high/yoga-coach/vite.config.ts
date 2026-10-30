import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';
export default defineConfig({base:'/motionsites-results/yoga-coach/',plugins:[react(),tailwindcss()],build:{rollupOptions:{output:{manualChunks:{hls:['hls.js']}}}},resolve:{alias:{'@':fileURLToPath(new URL('.',import.meta.url))}}});
