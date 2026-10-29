import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({ plugins: [react()], base: '/motionsites-results/apex-program-accordion/', resolve: { alias: { '@': new URL('./src', import.meta.url).pathname } } });
