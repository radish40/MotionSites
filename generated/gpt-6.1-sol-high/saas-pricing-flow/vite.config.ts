import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/motionsites-results/saas-pricing-flow/',
  plugins: [react()],
});
