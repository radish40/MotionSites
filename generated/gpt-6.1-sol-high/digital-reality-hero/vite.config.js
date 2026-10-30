import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: '/motionsites-results/digital-reality-hero/',
  plugins: [tailwindcss()],
});
