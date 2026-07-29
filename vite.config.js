import { defineConfig } from 'vite'

// GitHub Pages uses /<repo-name>/ as base path
export default defineConfig({
  base: '/',
  server: {
    port: 8081,
    open: false
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  },
  publicDir: 'public'
})
