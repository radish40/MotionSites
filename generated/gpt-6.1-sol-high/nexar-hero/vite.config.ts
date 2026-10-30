import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({ plugins: [react()], base: '/motionsites-results/nexar-hero/', optimizeDeps: { exclude: ['lucide-react'] } });
