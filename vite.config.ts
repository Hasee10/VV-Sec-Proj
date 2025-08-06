// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      '@/components': path.resolve(__dirname, './components'),
      '@/pages': path.resolve(__dirname, './pages'),
      '@/styles': path.resolve(__dirname, './styles'),
      '@/utils': path.resolve(__dirname, './utils'),
    },
  },

  server: {
    port: 3000,
    host: true,
    strictPort: false,
    open: true,
  },

  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: 'terser',
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          animation: ['motion'],
          ui: ['lucide-react', 'class-variance-authority', 'clsx', 'tailwind-merge'],
        },
      },
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },

  css: {
    postcss: './postcss.config.js',
  },

  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'motion',
      'lucide-react',
    ],
  },

  preview: {
    port: 4173,
    host: true,
  },

  base: '/',
  publicDir: 'public',
});
