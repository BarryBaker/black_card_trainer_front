// Writes dist/_redirects after `vite build`.
//
// Set API_PROXY_TARGET (e.g. https://blackcardtrainer.up.railway.app) to have
// Netlify proxy /api/* to the backend. Requests then leave the browser as
// same-origin, which sidesteps CORS entirely — including on deploy previews,
// whose URLs change on every build and would never stay whitelisted.
//
// Leave API_PROXY_TARGET unset if the app calls the backend directly via
// VITE_BASE_URL instead.

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const outFile = resolve(process.cwd(), 'dist/_redirects');
const proxyTarget = process.env.API_PROXY_TARGET?.trim().replace(/\/$/, '');

const rules = [];

if (proxyTarget) {
  rules.push(`/api/* ${proxyTarget}/api/:splat 200`);
}

// SPA fallback: unknown paths serve index.html. Existing files (assets, and the
// /api proxy above) are matched first, so this only catches client-side routes.
rules.push('/* /index.html 200');

mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(outFile, `${rules.join('\n')}\n`);

console.log(
  proxyTarget
    ? `_redirects written, proxying /api/* -> ${proxyTarget}/api/*`
    : '_redirects written, no API proxy (API_PROXY_TARGET unset)'
);
