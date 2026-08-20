# Concise — a URL Shortener SaaS

A full-stack URL shortener built as both a real product and a system-design
reference: React/Vite/Tailwind frontend, Node/Express backend, MongoDB +
Redis for storage/caching, JWT auth.

See `PLANNING.md` for the full UI/UX plan (design tokens, component
hierarchy, wireframes, user flow) written before any code.

---

## Quick start (local dev, zero external services required)

The backend ships with a **dual storage/cache backend** so you can run the
whole thing with nothing installed beyond Node — or point it at real
MongoDB + Redis when you're ready. See §"Storage modes" below.

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
npm start
# → http://localhost:4000
```

By default `.env` has `DB_MODE=memory` and `CACHE_MODE=redis`. If you don't
have Redis running locally, either install it or set `CACHE_MODE=memory` in
`.env` — the app degrades gracefully either way (see `src/services/cache.service.js`).

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
# → http://localhost:5173
```

Register a new account in the UI — there's no seed data or demo login by
design; the whole flow (register → create links → see them on the
dashboard) is meant to be exercised end to end.

### 3. Docker (both services + Redis, one command)

```bash
docker compose up --build
```
Frontend on **:5173**, backend on **:4000**, Redis on **:6379**.

---

## Storage modes — how this actually maps to the requested tech stack

The brief asked for MongoDB + Redis. This project implements both for real
(`src/repositories/mongo/*`, real Mongoose schemas, real `ioredis` client)
**and** an in-memory equivalent behind the exact same interface
(`src/repositories/memory/*`), selected with one environment variable:

```env
DB_MODE=memory     # or 'mongo'
CACHE_MODE=memory  # or 'redis'
```

Why: this makes the project runnable and testable with zero setup, while
the production-shaped code (Mongo schemas, atomic counter pattern, Redis
cache-aside) is fully written and ready — pointing `DB_MODE=mongo` at a
real `MONGO_URI` (e.g. MongoDB Atlas) is the only change needed to go live.
Every route (`src/controllers/*`) is written against `src/repositories/index.js`
and has no idea which backend it's actually talking to.

**Auth note:** the brief mentioned Clerk. This build uses JWT (bcrypt +
signed tokens) instead, because Clerk requires real API keys that can't be
provisioned in this environment — the login/register UX is identical
either way, and swapping in Clerk later means replacing
`src/controllers/auth.controller.js` and the frontend's `AuthContext`,
not restructuring the app.

---

## System design — the parts that matter

### Encoding: counter-based Base62
`src/services/encoder.service.js`. Every link gets the next value from an
atomically-incrementing MongoDB counter (`src/models/Counter.js`, using
Mongo's `findOneAndUpdate` + `$inc` — the standard auto-increment
workaround since Mongo has no native `SERIAL`), encoded into Base62
(`0-9A-Za-z`). Collision-free by construction, no retry logic anywhere.

### Caching: cache-aside + write-through
`src/services/cache.service.js`. The redirect handler (`GET /:code` in
`src/app.js`) is the hottest path in the app by a wide margin, so it's the
only place that checks Redis before touching the database. Writes
invalidate the cache entry rather than trying to keep two copies in sync.
If Redis is unreachable, every cache call degrades to "skip caching"
instead of throwing — a cache outage should never become an app outage.

### Rate limiting: asymmetric by endpoint
`src/middleware/rateLimiter.js`. Auth endpoints get the tightest limit
(brute-force target), link creation is moderate, redirects are loosest by
far — a link shared in a group chat can legitimately get hundreds of
clicks in seconds and must not be throttled.

### Data model
`src/models/Link.js`. Click counts are aggregated into daily buckets
directly on the Link document for this project's scale (cheap single-query
reads for the dashboard chart). At real production scale you'd split raw
click events into their own collection — see the comment in that file for
the exact reasoning and schema.

---

## Project structure

```
concise/
├── PLANNING.md              full UI/UX plan written before implementation
├── docker-compose.yml        full local stack: frontend + backend + redis
├── backend/
│   ├── server.js
│   └── src/
│       ├── models/            Mongoose schemas (User, Link, Counter)
│       ├── repositories/       memory/ and mongo/ implementations behind one interface
│       ├── controllers/        auth, links
│       ├── routes/             auth, links, public (unlock + health)
│       ├── middleware/         auth, rate limiting, error handling
│       ├── services/           encoder, cache, jwt, qr
│       └── config/             env, db connection
└── frontend/
    └── src/
        ├── components/
        │   ├── ui/              Button, Card, Modal, Toast, Dropdown, ...
        │   ├── layout/          Navbar, Sidebar, Topbar, AppLayout, AuthLayout
        │   ├── charts/           ClicksOverTimeChart (Chart.js)
        │   ├── marketing/        Hero, FeatureGrid, Pricing, Testimonials, FAQ
        │   └── dashboard/        LinksTable, ConfirmDeleteModal
        ├── pages/                Landing, Login, Register, Dashboard, CreateLink, 404
        ├── context/               Auth, Theme, Toast (Context API, no Redux)
        ├── routes/                ProtectedRoute
        └── lib/                   axios instance, formatters
```

---

## API reference

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | — | Create an account |
| POST | `/api/auth/login` | — | Get a JWT |
| GET | `/api/auth/me` | ✓ | Current user |
| POST | `/api/links` | ✓ | Create a short link |
| GET | `/api/links?search=&page=&limit=` | ✓ | List your links |
| GET | `/api/links/stats` | ✓ | Dashboard top-card stats |
| GET | `/api/links/:id` | ✓ | One link's detail |
| PATCH | `/api/links/:id` | ✓ | Update URL/expiration |
| DELETE | `/api/links/:id` | ✓ | Delete a link |
| POST | `/api/links/:code/unlock` | — | Submit a password for a protected link |
| GET | `/:code` | — | The redirect itself |
| GET | `/api/health` | — | Liveness probe |

---

## Deploying

- **Frontend** → any static host (Vercel, Netlify, Cloudflare Pages) or the
  included Dockerfile (builds to a static bundle served by nginx). Set
  `VITE_API_URL` to your deployed backend's URL at build time.
- **Backend** → Render/Railway/Fly.io or a VPS with the included
  Dockerfile. Set `DB_MODE=mongo` with a MongoDB Atlas `MONGO_URI`, and
  `CACHE_MODE=redis` with a managed Redis URL (Upstash, Redis Cloud, or
  your platform's Redis add-on).
- Set a strong random `JWT_SECRET` in production — the `.env.example`
  value is a placeholder only.
