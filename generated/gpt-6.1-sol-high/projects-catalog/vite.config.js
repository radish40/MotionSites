import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({
  base: '/motionsites-results/projects-catalog/',
  plugins: [tailwindcss()],
});
