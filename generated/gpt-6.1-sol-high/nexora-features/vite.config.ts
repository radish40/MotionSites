import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/motionsites-results/nexora-features/',
  preview: { host: '127.0.0.1' },
  plugins: [
    tailwindcss(),
    tanstackStart({
      prerender: { enabled: true, autoStaticPathsDiscovery: true, crawlLinks: false, failOnError: true },
    }),
    react(),
  ],
})
