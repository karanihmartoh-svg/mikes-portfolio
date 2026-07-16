# mikes-portfolio — build

This repo contains a small static portfolio site. Use esbuild to rebuild minified JS files.

Install dependencies:

```bash
npm install
```

Build minified bundles:

```bash
npm run build
```

Watch for changes (requires `npm run build` to be adapted if needed):

```bash
npm run watch
```

Notes:
- Source (editable) JS files live in `src/`.
- Minified bundles are written to `js/` as `*.min.js`.
-
Environment variables & secrets
--------------------------------

1. Keep secrets out of client-side code. Any API keys or DB credentials must never be embedded in `index.html` or JavaScript that runs in the browser. If you need to call a third-party API that requires a secret, create a server-side proxy or serverless function that holds the secret and forwards requests.

2. Local development: copy `.env.example` to `.env` and fill in real values. Do NOT commit your `.env` file.

```bash
cp .env.example .env
# edit .env and add your real values
```

3. Start a local API proxy (example included):

```bash
npm install
npm run start:api
```

This runs `server/index.js`, which reads `FORMSUBMIT_EMAIL` from environment and exposes `POST /api/submit` to proxy form submissions. Your frontend can then POST to `/api/submit` instead of directly including secrets in the browser.

4. Loading env vars in Node code

Use `dotenv` for local development (already included in `devDependencies`). In Node files, call:

```js
require('dotenv').config();
const apiKey = process.env.THIRD_PARTY_API_KEY;
```

5. CI / Production

- Configure your environment variables in the hosting service (GitHub Actions, Vercel, Netlify, Docker, etc.). Do not store secrets in the repo.
- For serverless platforms (Netlify/Vercel), use their UI or CLI to set environment variables; your serverless functions can read `process.env` the same way.

6. Example: secure form submission flow

- Frontend (`fetch('/api/submit', { method: 'POST', body: formData })`) — no secrets in the browser.
- Server (`server/index.js`) — reads `FORMSUBMIT_EMAIL` from `process.env` and forwards the request to the provider.

If you want, I can update `src/app.js` to POST to `/api/submit` instead of `https://formsubmit.co/...` and add a short demonstration of storing secrets in GitHub Actions or Netlify.

