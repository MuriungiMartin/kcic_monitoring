// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/', // Ensure this matches your deployment path
  server: {
    proxy: {
      '/api': {
        target: 'http://45.149.206.133:6047',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/odata': {
        target: 'http://45.149.206.133:6048',
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
