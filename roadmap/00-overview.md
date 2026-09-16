# Overview

## The product
Kennedy — a food-ordering product being turned into a **multi-restaurant SaaS**
(backend v2.4, Django 6.1 + Daphne ASGI + Channels + Redis + PostgreSQL).

Five surfaces, not three:
1. **Customer storefront** — menu, multi-item cart, WhatsApp-code sign-in, tracking.
2. **Kitchen display (KDS)** — ticket board with chime, one-tap advance.
3. **Rider app** — duty toggle, job cards, live GPS streaming.
4. **Restaurant console** — orders feed, **counter POS**, inventory, branches, staff, analytics.
5. **Owner/SaaS layer** — subscription, plans, invoice proof upload.

## The constraint that shapes everything
The v2.4 backend runs **locally**; this frontend runs **online**. An online page cannot
reach `localhost`. So every screen is written once, against the real contract, but reads
from a **switchable source**: the live API when a reachable base URL is set, sample data
otherwise. Flip one setting when the backend is public — no screen is written twice.

## Standing rules
1. No component calls `fetch()` directly — everything goes through `src/lib/api/client.ts`.
2. Every request carries `X-Tenant-Slug`; the tenant is never hardcoded in a screen.
3. Prices shown in the UI are **display-only**. The real bill always comes back from the
   order response (`subtotal`, `delivery_fee`, `cod_fee`, `discount`, `total`).
4. Anything marked UNCONFIRMED is read defensively (fallback field names and paths), so a
   rename shows a dash — never a crash.
5. **Realtime first, refresh as fallback.** Sockets are confirmed
   (`ws/orders/{order_code}/`, `ws/kitchen/`, `ws/admin/fleet/`); `useLiveResource` takes
   over automatically when a socket cannot connect.
6. Endpoint paths live only in `src/lib/api/endpoints.ts`; socket paths beside them.
7. Every failure code in the v2.4 table has a designed screen — especially
   `409 insufficient_stock` and `429 too many attempts`.

## Plan shape
10 phases. One slice at a time, reviewed before the next.
1 Foundations · 2 Customer flow · 3 Tracking · 4 Kitchen · 5 Admin core ·
5b Cashier/POS · 6 Owner tools · 7 SaaS layer · 8 Design unification · 9 Realtime rollout.
