# js-supermariobros
Super Mario Bros with Javascript

## Development

```bash
npm install
npm run dev
```

## GitHub Pages Deployment

Deployment is configured through `.github/workflows/deploy.yml`.

1. Go to your GitHub repository `Settings > Pages`.
2. Set `Source` to `GitHub Actions`.
3. Push to `main` or `master` (or run the workflow manually).

The Vite `base` path is auto-configured during GitHub Actions builds to use `/<repo-name>/`.
