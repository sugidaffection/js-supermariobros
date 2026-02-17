import { defineConfig } from 'vite'

export default defineConfig({
  root: '.',
  publicDir: 'assets',
  server: {
    port: 8081,
    open: true,
    fs: {
      allow: ['assets']
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})
