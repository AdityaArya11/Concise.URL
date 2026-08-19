/**
 * app.js
 * -----------------------------------------------------------------------
 * SYSTEM DESIGN NOTE — the redirect handler below is the single most
 * important piece of this backend, because it's the one endpoint that
 * runs orders of magnitude more often than everything else combined
 * (see PLANNING.md / README for the back-of-envelope read:write ratio).
 * It is deliberately the ONLY handler that touches the cache before the
 * database, and it does the least possible work: cache check → maybe one
 * DB read → 302. No auth, no heavy validation, no unnecessary I/O.
 * -----------------------------------------------------------------------
 */
const express = require('express');
const cors = require('cors');
const path = require('path');

const env = require('./config/env');
const authRoutes = require('./routes/auth.routes');
const linksRoutes = require('./routes/links.routes');
const publicRoutes = require('./routes/public.routes');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');
const { redirectLimiter } = require('./middleware/rateLimiter');
const cache = require('./services/cache.service');
const { linkRepository } = require('./repositories');

const app = express();

app.use(cors());
app.use(express.json({ limit: '15kb' }));
app.disable('x-powered-by');
app.set('trust proxy', 1);

app.use('/api/auth', authRoutes);
app.use('/api', publicRoutes); // must come before /api/links so POST /api/links/:code/unlock (public) isn't shadowed by the requireAuth middleware mounted on linksRoutes below
app.use('/api/links', linksRoutes);

// ---- Redirect hot-path: GET /:code -------------------------------------
app.get('/:code', redirectLimiter, async (req, res, next) => {
  const { code } = req.params;
  if (code.includes('.') || code === 'favicon.ico') return next();

  // 1. Cache-aside read.
  let link = await cache.getLink(code);
  if (!link) {
    link = await linkRepository.findByCode(code);
    if (link) await cache.setLink(code, link);
  }

  if (!link) return res.status(404).send(notFoundHtml());

  if (link.expiresAt && new Date(link.expiresAt).getTime() < Date.now()) {
    return res.status(410).send(expiredHtml());
  }

  if (link.passwordHash) {
    // Protected link: show a minimal unlock form instead of redirecting.
    // The click itself is only counted once the password check succeeds
    // (see links.controller.js#unlockLink) — an unentered password
    // shouldn't inflate click analytics.
    return res.status(200).send(passwordPromptHtml(code));
  }

  const updated = await linkRepository.recordClick(code);
  await cache.setLink(code, updated); // keep the cache warm with the fresh click count
  return res.redirect(302, link.longUrl);
});

app.use('/api', notFoundHandler);
app.use(errorHandler);

// --- tiny inline HTML helpers for the redirect edge cases (kept here to
// avoid pulling in a template engine for three small pages) -------------
function shellHtml(title, bodyHtml) {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title} — Concise</title>
  <style>
    body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#131210;color:#F7F7F5;font-family:Inter,ui-sans-serif,system-ui,sans-serif;text-align:center;padding:24px;}
    .box{max-width:380px;} h1{font-size:1.6rem;margin:0 0 10px;} p{color:#A4A196;margin:0 0 20px;font-size:0.95rem;}
    a,button{color:#818CF8;text-decoration:none;border:1px solid #2E2C27;padding:10px 18px;border-radius:10px;background:transparent;font:inherit;cursor:pointer;}
    input{width:100%;padding:10px 12px;border-radius:8px;border:1px solid #2E2C27;background:#1C1B17;color:#F7F7F5;margin-bottom:12px;font:inherit;box-sizing:border-box;}
    form{display:flex;flex-direction:column;gap:8px;}
  </style></head><body><div class="box">${bodyHtml}</div></body></html>`;
}
function notFoundHtml() {
  return shellHtml('Not found', `<h1>404</h1><p>This short link doesn't exist, or it expired.</p><a href="${env.appBaseUrl}">← Back to Concise</a>`);
}
function expiredHtml() {
  return shellHtml('Expired', `<h1>Link expired</h1><p>This short link is no longer active.</p><a href="${env.appBaseUrl}">← Back to Concise</a>`);
}
function passwordPromptHtml(code) {
  return shellHtml(
    'Protected link',
    `<h1>🔒 Protected link</h1><p>This link requires a password to continue.</p>
     <form id="f"><input type="password" id="pw" placeholder="Enter password" autofocus /><button type="submit">Continue</button></form>
     <p id="err" style="color:#F87171;display:none;margin-top:10px;">Incorrect password.</p>
     <script>
       document.getElementById('f').addEventListener('submit', async (e) => {
         e.preventDefault();
         const password = document.getElementById('pw').value;
         const res = await fetch('/api/links/${code}/unlock', {
           method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ password })
         });
         if (res.ok) { const data = await res.json(); window.location.href = data.longUrl; }
         else { document.getElementById('err').style.display = 'block'; }
       });
     </script>`
  );
}

module.exports = app;
