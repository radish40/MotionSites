import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: '/motionsites-results/skybridge-404/',
  plugins: [tailwindcss()],
});
