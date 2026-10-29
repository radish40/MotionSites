import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: '/motionsites-results/arceage-stats/',
  plugins: [tailwindcss()],
});
