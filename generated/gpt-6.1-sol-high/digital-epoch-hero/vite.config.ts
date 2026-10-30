import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({base: '/motionsites-results/digital-epoch-hero/', plugins: [react(), tailwindcss()]});
