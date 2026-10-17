import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: false
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.js',
    include: ['tests/**/*.test.{js,jsx}', 'test/**/*.test.{js,jsx}']
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/leaflet') || id.includes('node_modules/react-leaflet')) {
            return 'vendor-leaflet';
          }
          if (id.includes('node_modules/lucide-react')) {
            return 'vendor-lucide';
          }
          if (id.includes('clauses_c22_3_no1')) {
            return 'data-csa-c22-no1';
          }
          if (id.includes('clauses_c22_3_60826')) {
            return 'data-csa-60826';
          }
          if (id.includes('clauses_csa_o15')) {
            return 'data-csa-o15';
          }
          if (id.includes('plsCaddLessons')) {
            return 'data-pls-lessons';
          }

          if (id.includes('tablesRegistry') || id.includes('tableContentResolver') || id.includes('table13.js') || id.includes('table9.js')) {
            return 'data-csa-tables';
          }
          if (id.includes('csaGeoDatabase.json')) {
            return 'data-csa-geo';
          }
        }
      }
    }
  }
})

