/// <reference types="vite/client" />

import { defineConfig } from 'vite';
import pages from 'vite-plugin-pages';
import solidPlugin from 'vite-plugin-solid';

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
