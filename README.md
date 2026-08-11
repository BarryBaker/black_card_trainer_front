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

Netlify builds this as a static site — there is no Docker involved on this side.
`netlify.toml` already sets the build command (`npm run build`), publish
directory (`dist`) and Node version, so connecting the GitHub repo is enough.

Pick one of two ways to reach the backend.

### Option A — proxy through Netlify (recommended)

Set one build environment variable in **Site configuration → Environment variables**:

| Variable           | Value                                  |
| ------------------ | -------------------------------------- |
| `API_PROXY_TARGET` | `https://<your-backend>.up.railway.app` |

The build then writes a `/api/* → <backend>/api/:splat 200` proxy rule into
`dist/_redirects`. The browser only ever calls the Netlify origin, so there is
no CORS to configure and deploy previews work unchanged.

### Option B — call the backend directly

Set `VITE_BASE_URL` to the backend URL instead (it overrides `.env.production`).
The backend must then allow the Netlify origin — on the backend service set:

```
CORS_ALLOWED_ORIGINS=https://<your-site>.netlify.app
```

Deploy previews get their own URLs, so each one needs adding to that list.

### Note on env vars

`VITE_*` values are inlined into the bundle at build time, not read at runtime.
Changing one in the Netlify UI requires a redeploy to take effect.
