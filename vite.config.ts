import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Authorization'
    },
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 5173
    }
  },
  preview: {
    port: 5173,
    strictPort: true
  },
  define: {
    global: 'globalThis',
    'process.env': {}
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'wagmi',
      'viem',
      '@tanstack/react-query'
    ],
    esbuildOptions: {
      target: 'esnext'
    }
  }
});