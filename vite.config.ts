import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    // Image optimization removed due to security vulnerabilities
    // Using build-time optimization instead
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
            src: '/swipe-right.png',
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
          'vendor-core': ['react', 'react-dom'],
          // Database services (lazy load)
          'vendor-db': ['@supabase/supabase-js', '@supabase/postgrest-js'],
          // Real-time messaging (lazy load)
          'vendor-realtime': ['ably', 'pusher-js', 'socket.io-client'],
          // UI libraries (lazy load)
          'vendor-ui': ['framer-motion', '@tanstack/react-query', 'react-spring'],
          // Router (loads with main)
          'vendor-router': ['react-router-dom'],
          // Payment processing
          'vendor-payment': ['@stripe/stripe-js', '@stripe/react-stripe-js'],
          // Utils (shared)
          'vendor-utils': ['use-debounce', 'zustand', 'zod']
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
    chunkSizeWarningLimit: 500,
    sourcemap: false
  },
  optimizeDeps: {
    include: ['react', 'react-dom', '@supabase/supabase-js', 'ably']
  }
})