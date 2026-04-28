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

### Where to get `CLOUDFLARE_ACCOUNT_ID`

1. Open Cloudflare Dashboard.
2. Go to Workers & Pages (or check the right sidebar on most account pages).
3. Copy the Account ID (long hex string).

### Where to get `CLOUDFLARE_API_TOKEN`

1. Open Cloudflare Dashboard.
2. Go to My Profile > API Tokens > Create Token.
3. Use the Edit Cloudflare Workers template (or create a custom scoped token).
4. Copy the token value once created.

Recommended minimum token permissions:

- Account - Workers Scripts: Edit
- Account - Workers Routes: Edit
- Zone - Workers Routes: Edit
- Zone - Zone: Read
- Account - Account Settings: Read (optional, but useful)

Important resource scope:

- Include the account `amirahosbr`.
- Include the zone resource for `ujikaji.my` (or all zones if you prefer).

### Where to add secrets in GitHub

1. Open your repository in GitHub.
2. Go to Settings > Secrets and variables > Actions.
3. Click New repository secret.
4. Add:
   - `CLOUDFLARE_API_TOKEN` = token value
   - `CLOUDFLARE_ACCOUNT_ID` = account id value

After this, push to `main` and the deploy workflow should auto-deploy latest changes.

### Troubleshooting

If GitHub Actions fails with:

- `Authentication error [code: 10000]`
- endpoint like `/zones/<zone-id>/workers/routes`

then your token is missing zone-level permissions or zone resource access.

Fix:

1. Edit/recreate `CLOUDFLARE_API_TOKEN`.
2. Ensure it includes:
   - Zone - Workers Routes: Edit
   - Zone - Zone: Read
3. Ensure the token scope includes your `ujikaji.my` zone.
4. Update GitHub secret `CLOUDFLARE_API_TOKEN` and re-run workflow.

### DNS resolves in `dig` but browser/curl shows `ERR_NAME_NOT_RESOLVED`

Observed symptom:

- `dig yubinbango.ujikaji.my` returns IPs
- browser shows `ERR_NAME_NOT_RESOLVED` or `curl` says `Could not resolve host`

Likely cause:

- local resolver cache/path issue on macOS (stale negative cache), not Cloudflare deployment state.

Checks:

```bash
dig +short yubinbango.ujikaji.my
curl -I https://yubinbango.ujikaji.my
```

One-off recovery on macOS:

```bash
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder
```

If needed, clear browser DNS/socket caches and retry. This should not be needed on every deploy.
