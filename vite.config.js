// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/', // Ensure this matches your deployment path
  server: {
    proxy: {
      '/api': {
        target: 'http://185.219.142.163:7047',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/odata': {
        target: 'http://185.219.142.163:7048',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/odata/, '')
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    // Optionally add source maps for production debugging
    sourcemap: true
  }
})
