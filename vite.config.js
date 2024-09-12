import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'url';
import { resolve } from 'path';

// Get the directory name of the current module
const __dirname = fileURLToPath(new URL('.', import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3005,
  },
  resolve: {
    alias: {
      crypto: resolve(__dirname, 'node_modules/crypto-browserify'),
      stream: resolve(__dirname, 'node_modules/stream-browserify'),
      assert: resolve(__dirname, 'node_modules/assert'),
      buffer: resolve(__dirname, 'node_modules/buffer'),
      util: resolve(__dirname, 'node_modules/util'),
      process: resolve(__dirname, 'node_modules/process/browser'),
    },
  },
  define: {
    global: {},
  },
});
