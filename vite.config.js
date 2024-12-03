import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    base: '/property/',
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
        }
    }
});
