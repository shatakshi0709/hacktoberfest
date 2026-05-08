import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('react') || id.includes('react-dom')) {
            return 'vendor'
          }
          if (id.includes('lucide-react') || id.includes('framer-motion')) {
            return 'ui'
          }
          if (id.includes('recharts')) {
            return 'charts'
          }
          if (id.includes('leaflet')) {
            return 'maps'
          }
        }
      }
    }
  },
  base: process.env.NODE_ENV === 'production' ? '/foai-end/' : '/'
})
