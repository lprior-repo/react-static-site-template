import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig(({ command: _command, mode }) => {
  const _env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),

      // Progressive Web App configuration
      VitePWA({
        registerType: 'autoUpdate',
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        },
        includeAssets: ['favicon.svg', 'apple-touch-icon.png', 'robots.txt'],
        manifest: {
          name: 'React Static Site Template',
          short_name: 'React Static Site',
          description: 'A production-ready React static site template',
          theme_color: '#2563eb',
          background_color: '#ffffff',
          display: 'standalone',
          icons: [
            {
              src: '/icon-192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: '/icon-512.png',
              sizes: '512x512',
              type: 'image/png',
            },
          ],
        },
      }),

      // Bundle analyzer (only in analyze mode)
      mode === 'analyze' &&
        visualizer({
          filename: 'dist/stats.html',
          open: true,
          gzipSize: true,
          brotliSize: true,
        }),
    ].filter(Boolean),

    // Development server configuration
    server: {
      port: 3000,
      open: true,
      cors: true,
      host: true, // Allow external connections
    },

    // Preview server configuration
    preview: {
      port: 4173,
      open: true,
    },

    // Build configuration
    build: {
      outDir: 'dist',
      sourcemap: mode === 'development',
      minify: 'terser',
      target: 'es2020',

      // Bundle size optimization
      rollupOptions: {
        output: {
          manualChunks: {
            // Vendor chunk for large dependencies
            vendor: ['react', 'react-dom'],
            router: ['react-router-dom'],
          },

          // Asset naming conventions
          chunkFileNames: 'assets/js/[name].[hash].js',
          entryFileNames: 'assets/js/[name].[hash].js',
          assetFileNames: ({ name }) => {
            if (/\.(gif|jpe?g|png|svg)$/.test(name ?? '')) {
              return 'assets/images/[name].[hash][extname]';
            }
            if (/\.css$/.test(name ?? '')) {
              return 'assets/css/[name].[hash][extname]';
            }
            return 'assets/[name].[hash][extname]';
          },
        },
      },

      // Terser configuration for better compression
      terserOptions: {
        compress: {
          drop_console: mode === 'production',
          drop_debugger: mode === 'production',
        },
      },

      // Bundle size warnings
      chunkSizeWarningLimit: 500,
      assetsInlineLimit: 4096, // 4KB
    },

    // CSS configuration
    css: {
      devSourcemap: mode === 'development',
      preprocessorOptions: {
        scss: {
          additionalData: `$env: ${mode};`,
        },
      },
    },

    // Environment variables
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    },

    // Dependency optimization
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom', 'react-helmet-async'],
    },

    // Asset processing
    assetsInclude: ['**/*.xml', '**/*.txt'],
  };
});
