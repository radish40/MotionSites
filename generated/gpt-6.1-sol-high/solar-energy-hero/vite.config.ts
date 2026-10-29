import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  base: '/motionsites-results/solar-energy-hero/',
  plugins: [react()],
  optimizeDeps: { exclude: ['lucide-react'] },
});
