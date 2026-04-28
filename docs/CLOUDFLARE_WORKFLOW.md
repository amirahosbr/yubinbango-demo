# Cloudflare CLI Workflow (Wrangler)

This project is configured for a real CLI-based deploy workflow to Cloudflare Workers.

## One-time setup

1. Login to Cloudflare:

```bash
npx wrangler login
```

2. Verify account:

```bash
npx wrangler whoami
```

## Local workflows

- Regular Nuxt development:

```bash
npm run dev
```

- Cloudflare runtime preview (builds for Workers, then runs Wrangler):

```bash
npm run dev:cf
```

## Build and deploy

- Build Cloudflare artifact:

```bash
npm run build:cf
```

- Deploy to Cloudflare Workers:

```bash
npm run deploy:cf
```

After deploy, Cloudflare returns a public `*.workers.dev` URL.

## Custom domain

1. Add your domain in Cloudflare DNS (for example: `yubinbango.example.com`).
2. Attach a route/domain to this Worker from Wrangler or dashboard.
3. Re-deploy:

```bash
npm run deploy:cf
```

## Logs

```bash
npm run cf:tail
```

## Auto deploy from GitHub

This repository includes `.github/workflows/deploy-cloudflare.yml`.

It deploys automatically when you push to `main` (and can also be triggered manually from the Actions tab).

Add these GitHub repository secrets before first run:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
