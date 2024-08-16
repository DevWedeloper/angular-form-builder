/// <reference types="vitest" />

import analog from '@analogjs/platform';
import { defineConfig, splitVendorChunkPlugin } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    root: __dirname,
    publicDir: 'src/assets',
    build: {
      outDir: './dist/./client',
      reportCompressedSize: true,
      target: ['es2020'],
    },
    ssr: {
      optimizeDeps: {
        include: ['file-saver'],
      },
      noExternal: [
        '@spartan-ng/**',
        '@ng-icons/**',
        'ngx-scrollbar',
        'lodash',
        'file-saver',
      ],
    },
    plugins: [
      analog({
        prerender: {
          routes: ['/', '/builder', '/guide', '/quiz'],
        },
      }),
      tsconfigPaths(),
      splitVendorChunkPlugin(),
    ],
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['src/test-setup.ts'],
      include: ['**/*.spec.ts'],
      reporters: ['default'],
    },
    define: {
      'import.meta.vitest': mode !== 'production',
    },
  };
});
