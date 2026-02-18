import { defineConfig } from 'vite'

// GitHub Pages uses /<repo-name>/ as base path
export default defineConfig({
  base: '/js-supermariobros/',
  server: {
    port: 8081,
    open: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  },
  publicDir: 'public'
})
