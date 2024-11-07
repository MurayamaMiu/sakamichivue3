import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { VitePWA } from 'vite-plugin-pwa'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  base: '/sakamichivue3', // 替换为你的 GitHub 项目名称
  plugins: [
    vue(),
    vueJsx(),
    VitePWA({
      registerType: 'autoUpdate',  // 自动更新服务工作线程
      // includeAssets: ['favicon.svg', 'favicon.ico', 'robots.txt', 'apple-touch-icon.png'],  // 包括的文件
      workbox: {
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.origin === 'https://murayamamiu.github.io',
            handler: 'CacheFirst',
          },
        ],
      },
      manifest: {
        name: 'SakamichiVue3',
        short_name: 'Sakamichi',
        description: '坂道應用合集',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'icon/logo192.jpg',
            sizes: '192x192',
            type: 'image/jpg'
          },
          {
            src: 'icon/logo512.jpg',
            sizes: '512x512',
            type: 'image/jpg'
          },
          {
            src: 'icon/logo512.jpg',
            sizes: '512x512',
            type: 'image/jpg',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  build: {
    rollupOptions: {
      input: {
        // eslint-disable-next-line no-undef
        main: resolve(__dirname, 'index.html'),
        // eslint-disable-next-line no-undef
        docs: resolve(__dirname, 'public/docs/index.html')
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
