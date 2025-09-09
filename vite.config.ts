import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import viteImagemin from 'vite-plugin-imagemin'

export default defineConfig({
  plugins: [
    react(),
    viteImagemin({
      gifsicle: { optimizationLevel: 7 },
      mozjpeg: { quality: 80 },
      pngquant: { quality: [0.65, 0.8] },
      svgo: {
        plugins: [
          { name: 'removeViewBox', active: false },
          { name: 'removeEmptyAttrs', active: false }
        ]
      },
      webp: { quality: 75 }
    }),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'supabase-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 // 24 hours
              }
            }
          }
        ]
      },
      manifest: {
        name: 'DJ Elite - Swipe Right to DJ',
        short_name: 'DJ Elite',
        description: 'Connect with DJs worldwide and find your perfect gig match',
        theme_color: '#FFD700',
        background_color: '#000000',
        display: 'standalone',
        icons: [
          {
            src: '/Swipe Right.png',
            sizes: '192x192',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React chunk (loads first)
          vendor: ['react', 'react-dom'],
          // Database services (lazy load)
          supabase: ['@supabase/supabase-js'],
          // Real-time messaging (lazy load)
          ably: ['ably'],
          // UI libraries (lazy load)
          ui: ['framer-motion', '@tanstack/react-query'],
          // Router (loads with main)
          router: ['react-router-dom'],
          // Utils (shared)
          utils: ['use-debounce']
        }
      }
    },
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info']
      },
      mangle: {
        safari10: true
      }
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: false
  },
  optimizeDeps: {
    include: ['react', 'react-dom', '@supabase/supabase-js', 'ably']
  }
})