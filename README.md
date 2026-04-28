# yubinbango-demo

Nuxt 3 demo app for Japanese postal-code auto-fill patterns.

## Local development

```bash
npm install
npm run dev
```

## Cloudflare (CLI workflow)

This project is configured for Cloudflare Workers with Wrangler.

```bash
npm run build:cf
npm run deploy:cf
```

Custom domain is configured in `wrangler.jsonc`.

## GitHub auto deploy

`main` branch pushes trigger `.github/workflows/deploy-cloudflare.yml`.

Required GitHub repository secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

Token needs both account and zone permissions for route attach:

- Account - Workers Scripts: Edit
- Account - Workers Routes: Edit
- Zone - Workers Routes: Edit
- Zone - Zone: Read

See `docs/CLOUDFLARE_WORKFLOW.md` for full setup and troubleshooting.
