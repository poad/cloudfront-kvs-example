/// <reference types="vite/client" />

import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import pages from 'vite-plugin-pages';

export default defineConfig({
  plugins: [pages({
    extensions: ["tsx", "jsx"],
    importMode: 'async',
  }), solidPlugin()],
  build: {
    target: 'esnext',
  },
  resolve: {
    conditions: ['development', 'browser'],
  }
});
