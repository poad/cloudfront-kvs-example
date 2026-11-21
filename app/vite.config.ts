/// <reference types="vite/client" />

import solidPlugin from '@solidjs/vite-plugin';
import { defineConfig } from 'vite';
import pages from 'vite-plugin-pages';

export default defineConfig({
  plugins: [
    pages({
      extensions: ['tsx', 'jsx'],
      importMode: 'async',
    }),
    solidPlugin(),
  ],
  build: {
    target: 'esnext',
  },
  resolve: {
    conditions: ['development', 'browser'],
  },
});
