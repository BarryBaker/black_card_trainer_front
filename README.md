# Black Card Trainer — frontend

React + Vite single-page app. It talks to the Flask backend at `/api/db/*`.

## Local development

```bash
npm install
npm run dev
```

`.env` points at the local backend (`http://127.0.0.1:3001`). Copy `.env.example`
if you need a different setup.

## Deploying to Netlify

Netlify builds this as a static site — no Docker on this side. Everything is in
`netlify.toml`: build command, publish directory, Node version, and the API
proxy. Connect the GitHub repo and deploy; **there are no environment variables
to set in the Netlify UI.**

### How the app reaches the backend

`VITE_BASE_URL` is empty in `.env.production`, so the app requests
`/api/db/...` on its own origin. `netlify.toml` then proxies `/api/*` to the
Railway backend. The browser only ever talks to Netlify, so no CORS
configuration is needed on the backend and deploy previews work unchanged.

To point at a different backend, edit the `to =` line in the `/api/*` redirect
in `netlify.toml`. Rule order in that file matters — the API proxy must stay
above the SPA catch-all, or `/api/*` gets answered with `index.html`.

### Note on env vars

`VITE_*` values are inlined into the bundle at build time, not read at runtime.
Changing one requires a redeploy to take effect.
