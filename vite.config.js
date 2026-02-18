import { defineConfig } from 'vite'

const isGitHubActions = process.env.GITHUB_ACTIONS === 'true'
const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] || ''
const base = isGitHubActions && repoName ? `/${repoName}/` : '/'

export default defineConfig({
  base,
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
