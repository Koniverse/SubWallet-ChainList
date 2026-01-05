/// <reference types='vitest' />
import { defineConfig, loadEnv } from 'vite';
import dts from 'vite-plugin-dts';
import * as path from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { fillAssetUrl } from './scripts/vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    root: __dirname,
    cacheDir: '../../node_modules/.vite/packages/chain-list',
    plugins: [
      dts({
        entryRoot: 'src',
        tsconfigPath: path.join(__dirname, 'tsconfig.lib.json'),
      }),
      viteStaticCopy({
        targets: [
          {
            transform: (contents: string, filename: string) => {
              return fillAssetUrl(contents, filename, env)
            },
            src: path.resolve(__dirname, 'src/data/*.json'),
            dest: 'data',
          },
        ],
      }),
    ],
    // Uncomment this if you are using workers.
    // worker: {
    //  plugins: [ nxViteTsPaths() ],
    // },
    // Configuration for building your library.
    // See: https://vitejs.dev/guide/build.html#library-mode
    build: {
      outDir: './dist',
      emptyOutDir: true,
      reportCompressedSize: true,
      commonjsOptions: {
        transformMixedEsModules: true,
      },
      lib: {
        // Could also be a dictionary or array of multiple entry points.
        entry: ['src/index.ts', 'src/types.ts'],
        name: '@subwallet/chain-list',
        fileName: (f, e) => {
          return f === 'es' ? `${e}.js` : `${e}.cjs`;
        },
        // Change this to the formats you want to support.
        // Don't forget to update your package.json as well.
        formats: ['es', 'cjs'],
      },
      rollupOptions: {
        // External packages that should not be bundled into your library.
        external: [/.*\.json/, 'ts-md5'],
      },
    },
    test: {
      name: '@subwallet/chain-list',
      watch: false,
      globals: true,
      environment: 'node',
      include: ['{src,tests,scripts}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
      reporters: ['default'],
      coverage: {
        reportsDirectory: './test-output/vitest/coverage',
        provider: 'v8' as const,
      },
    },
  };
});
