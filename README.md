# QR Generator (Vite + GitHub Pages)

Simple QR code generator for text/URL using the [`qrcode`](https://www.npmjs.com/package/qrcode) package.

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

## GitHub Pages deployment

The workflow is at `.github/workflows/deploy.yml` and deploys on pushes to `main`.

Repository settings required:

1. Go to **Settings → Pages**.
2. Set **Source** to **GitHub Actions**.
3. Push to `main` to trigger deployment.

The Vite `base` path is configured automatically for GitHub Actions builds using the repository name.
