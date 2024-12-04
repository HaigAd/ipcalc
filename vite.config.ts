import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: true,
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-icons', '@radix-ui/react-slot']
        }
      }
    },
    // Ensure assets use relative paths
    assetsDir: 'assets',
    emptyOutDir: true
  },
  // Use relative paths for all assets
  base: './'
})
