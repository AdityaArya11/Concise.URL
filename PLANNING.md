# Concise — Product & Engineering Plan

**Concise** — "Links, distilled." A URL shortener for teams who care about their brand
in every link they share. Minimal wordmark, lowercase, one accent color, no logo mark
needed at this stage (text wordmark is enough — see Stripe, Linear pre-Series B).

---

## 1. Design system

### 1.1 Color system

Neutral-first palette (near-black text on near-white surface), one restrained accent.
No neon, no gradients as a base treatment — gradients appear in exactly one place
(the hero product-preview card border) and nowhere else.

```
Accent (brand)          Neutral (warm gray, not pure gray)
--accent-50   #EEF2FF    --gray-25    #FCFCFB
--accent-100  #E0E7FF    --gray-50    #F7F7F5
--accent-200  #C7D2FE    --gray-100   #EFEEEA
--accent-300  #A5B4FC    --gray-200   #E3E1DA
--accent-400  #818CF8    --gray-300   #CBC8BE
--accent-500  #6366F1                            <- brand accent, used sparingly
--accent-600  #4F46E5    --gray-500   #78766D
--accent-700  #4338CA    --gray-700   #47453F
--accent-800  #3730A3    --gray-800   #2E2C27
--accent-900  #312E81    --gray-900   #1C1B17    <- primary text (not pure black)

Semantic
--success   #16A34A   (emerald-600)
--warning   #D97706   (amber-600)
--danger    #DC2626   (red-600)
--info      accent-500
```

Dark mode is not "invert the palette" — it's a separate deliberate scale:
`--gray-900` becomes the page background (`#131210`, slightly warmer than pure black),
surfaces sit one step up (`#1C1B17`), text inverts to `--gray-50`. Accent shifts one
stop lighter (`accent-400`) to keep contrast on dark surfaces.

### 1.2 Typography

**Inter**, variable weight. One scale, used consistently — no ad-hoc font sizes.

| Token | Size / line-height | Weight | Use |
|---|---|---|---|
| `display` | 48px / 56px | 600 | Hero headline only |
| `h1` | 32px / 40px | 600 | Page titles |
| `h2` | 24px / 32px | 600 | Section headers |
| `h3` | 18px / 28px | 600 | Card titles |
| `body-lg` | 16px / 24px | 400 | Marketing body copy |
| `body` | 14px / 20px | 400 | App/dashboard default |
| `caption` | 12px / 16px | 500 | Labels, table headers, badges |
| `mono` | 13px / 20px | 500 | API keys, short codes |

### 1.3 Spacing & radius (8px grid)

`4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96` px — every margin/padding/gap in the app
snaps to this scale. Radius: `6px` (inputs, small controls), `10px` (buttons, badges),
`14px` (cards), `20px` (modals, the hero preview card). Shadows are one subtle
elevation system, not per-component invention:

```
--shadow-sm:  0 1px 2px rgba(28,27,23,0.04)
--shadow-md:  0 4px 12px rgba(28,27,23,0.06), 0 1px 2px rgba(28,27,23,0.04)
--shadow-lg:  0 12px 32px rgba(28,27,23,0.10), 0 2px 6px rgba(28,27,23,0.05)
```

### 1.4 Motion

Framer Motion, restrained: 150–200ms ease-out for hovers/toggles, 250ms for page/modal
transitions, spring only on the copy-success checkmark and toast entrances. No bounce,
no floating decorative elements, no parallax.

---

## 2. Information architecture / user flow

```
Landing (/) ──► Register (/register) ──► Dashboard (/dashboard)
   │                                          │
   └──► Login (/login) ─────────────────────► │
                                               ├─► Create Link (/links/new)
                                               ├─► Analytics (/analytics/:code)
                                               ├─► Profile (/profile)
                                               └─► 404 for unknown links/routes
```

Auth-gated routes (`/dashboard`, `/links/new`, `/analytics/*`, `/profile`) sit behind
a `<ProtectedRoute>` wrapper reading from `AuthContext`. Unauthenticated visits bounce
to `/login` with a `?redirect=` back to the original destination.

---

## 3. Component hierarchy

```
App
├─ ThemeProvider (light/dark, persisted)
├─ AuthProvider (user, token, login/logout/register)
├─ ToastProvider (global toast queue)
└─ Router
   ├─ MarketingLayout
   │   └─ LandingPage
   │       ├─ Hero (headline + animated product-preview card)
   │       ├─ LogoStrip
   │       ├─ FeatureGrid (FeatureCard × 6)
   │       ├─ HowItWorks (Step × 3)
   │       ├─ PricingSection (PricingCard × 3)
   │       ├─ Testimonials (TestimonialCard × 3)
   │       ├─ FAQSection (Accordion)
   │       └─ Footer
   ├─ AuthLayout
   │   ├─ LoginPage (AuthForm)
   │   └─ RegisterPage (AuthForm)
   └─ AppLayout (ProtectedRoute)
       ├─ Sidebar (nav, collapsible)
       ├─ Topbar (search, theme toggle, user menu)
       ├─ DashboardPage
       │   ├─ StatCard × 4
       │   ├─ ClicksOverTimeChart
       │   ├─ DeviceDistributionChart
       │   ├─ LinksTable (SearchBar, FilterDropdown, Pagination, RowActions)
       │   └─ EmptyState (shown when zero links)
       ├─ CreateLinkPage (multi-section form + LivePreviewCard)
       ├─ AnalyticsPage (per-link deep dive: 8 charts + heatmap)
       ├─ ProfilePage (Avatar, PasswordForm, ApiKeyCard, NotificationSettings, ThemeSettings, BillingCard)
       └─ NotFoundPage

Shared/reusable (src/components/ui):
  Button · Card · Badge · Modal · Toast · Dropdown · SearchBar · Table ·
  Skeleton · EmptyState · Avatar · Tabs · Tooltip · Switch · Input · Select
```

---

## 4. Folder structure

```
concise/
├── frontend/                  React + Vite + Tailwind
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/            Button, Card, Modal, Toast, Dropdown, ...
│   │   │   ├── layout/        Navbar, Sidebar, Topbar, Footer
│   │   │   ├── charts/        ClicksChart, DeviceChart, CountryChart, ...
│   │   │   └── marketing/     Hero, FeatureGrid, PricingSection, ...
│   │   ├── pages/              LandingPage, LoginPage, DashboardPage, ...
│   │   ├── context/            AuthContext, ThemeContext, ToastContext
│   │   ├── hooks/               useAuth, useTheme, useToast, useDebounce
│   │   ├── lib/                 axios instance, formatters, mock data
│   │   ├── routes/              ProtectedRoute, AppRouter
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── tailwind.config.js
│   └── package.json
└── backend/                    Node + Express + MongoDB
    ├── src/
    │   ├── models/              User.js, Link.js, Click.js
    │   ├── controllers/         auth.controller.js, links.controller.js, ...
    │   ├── routes/               auth.routes.js, links.routes.js, ...
    │   ├── middleware/          auth.js, errorHandler.js, rateLimiter.js
    │   ├── services/             redis.service.js, qr.service.js
    │   ├── config/                db.js, swagger.js
    │   └── app.js
    ├── server.js
    └── package.json
```

---

## 5. Wireframes (text)

**Landing hero**
```
[ Concise ]                              [ Sign in ] [ Get started ]
Short links your brand doesn't have to be ashamed of.
Create, track, and manage links with real analytics — not vanity metrics.
[ Try it free — no card required ]
┌────────────────────────────────────────┐
│  concise.io/launch          ⧉ copy      │  ← live animated preview card
│  1,204 clicks · 38 countries            │
└────────────────────────────────────────┘
```

**Dashboard**
```
[Sidebar]  Total Links | Total Clicks | Active Links | QR Codes    (4 stat cards)
           ┌ Clicks over time ──────┐ ┌ Device split ──┐
           └─────────────────────────┘ └────────────────┘
           [ Search... ] [ Filter ▾ ]              [ + New link ]
           ┌ Recent links table: alias | clicks | created | status | actions ┐
           └──────────────────────────────────────────────────────────────────┘
```

**Create link**
```
Original URL [___________________________]
Custom alias [concise.io/____] (availability check, debounced)
Expiration   [date picker]      Password [toggle → input]
UTM params   [source][medium][campaign] (collapsible)
[ ] Generate QR code
──────────────────────────────
Live preview card updates as you type → [ Create link ]
```

This document covers items 1–8 of the brief. Building the actual code next.
