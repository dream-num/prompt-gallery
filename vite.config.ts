import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 5173,
    host: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia'],
          prism: ['prismjs'],
          utils: ['clipboard']
        }
      }
    },
    // Use esbuild for minification (default and faster than terser)
    minify: 'esbuild'
  },
  // Enable preload for critical resources
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia', 'prismjs', 'clipboard']
  }
})