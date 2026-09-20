# Kennedy Multi-Tenant Restaurant SaaS — Frontend Handover Guide

> Read this first. It explains the product, how the code is organised, what is finished,
> what is half-finished, what does not exist yet, and how to continue.
> Companion files: `/roadmap.md` (checkbox list) and `/roadmap/` (detail, contract,
> blockers). Everything here is written against **backend v2.4**.

---

## 1. What this product is

Kennedy (brand: *Moon Grill, Narowal*) started as one restaurant's ordering site. It is
being turned into a **multi-restaurant SaaS**: one backend serves many restaurants
("tenants"), each with several branches, its own menu, staff, stock and subscription.

The backend is **Django 6.1 + Daphne (ASGI) + Django Channels + PostgreSQL + Redis**, with
WhatsApp (Evolution API) for login codes and ElevenLabs for voice ordering. It is done and
tested (52/52 live tests) but currently runs **on the developer's machine**, not on a
public URL.

This repository is the **frontend only**: React 19 + TanStack Start (file-based routing) +
Vite + Tailwind. It talks to the backend over HTTP and WebSockets.

### Five surfaces the frontend must provide

| # | Surface | Who uses it | Core screens |
|---|---|---|---|
| 1 | Customer storefront | Diners | menu, dish page, cart/checkout, sign-in, profile, public order tracking |
| 2 | Kitchen display (KDS) | Kitchen staff | ticket board, chime, one-tap status advance |
| 3 | Rider app | Riders | duty toggle, job list, live GPS sharing, earnings |
| 4 | Restaurant console | Cashier / manager / admin | orders feed, **counter POS**, inventory, branches, staff, analytics |
| 5 | Owner / SaaS layer | Restaurant owner | sign-up wizard, plan + subscription, invoice proof upload |

---

## 2. How the backend works (the parts that shape the UI)

**Tenant resolution.** Every request must carry `X-Tenant-Slug`. The backend resolves the
restaurant as: header → subdomain → the signed-in staff user's own tenant.

**Seven roles.** `customer · kitchen · rider · cashier · manager · admin · owner`.
`must_change_password: true` locks a user on `/change-password` until they set their own.

**Order lifecycle.**
`pending → confirmed → kitchen → packed → onway → delivered` (`cancelled` any time before
delivery). Moving an order to **confirmed deducts ingredients by recipe**; cancelling
restores them. If stock is short the backend answers **409 `insufficient_stock`** — that
needs its own "sold out" screen, not a generic error.

**Who may move what.** Kitchen does `confirmed → kitchen → packed` and can assign a rider.
The assigned rider does `packed → onway → delivered`. Admin/owner can do either.

**Money.** Prices in the UI are **display only**. The bill that counts is the order
response: `subtotal`, `delivery_fee`, `cod_fee`, `discount`, `total`. Takeaway and dine-in
orders carry **no address**, Rs 0 delivery and Rs 0 COD fee — the backend uses the branch
coordinates.

**Payments.** COD auto-verifies on delivery. JazzCash/EasyPaisa need a reference plus a
screenshot, reviewed by staff through `verify-payment`. Card is webhook-verified.

**Realtime (confirmed sockets).**

| Socket | Used by |
|---|---|
| `ws/orders/{order_code}/` | customer tracking — status + rider coordinates |
| `ws/kitchen/` | kitchen board + new-ticket chime |
| `ws/admin/fleet/` | all active riders on one map |

Payload: `{type: "order_update" | "rider_location", order_code, status, rider:{name, phone, lat, lng}}`.

**Order code, not id.** Orders are addressed publicly by `order_code` (`MG-XXXXXX`) — the
tracking page and sockets both use it.

The full endpoint-by-endpoint contract lives in **`roadmap/04-contract.md`**. Treat that
file as the source of truth; do not copy paths into components.

---

## 3. How this frontend is organised

```
src/
  routes/           one file = one URL (TanStack Start file routing)
    __root.tsx      app shell; every page renders inside its <Outlet />
    index.tsx       storefront
    dish.$slug.tsx  dish page
    cart.tsx        cart + checkout (the biggest screen)
    login / signup / forgot-password / reset-password / change-password
    profile.tsx     customer account, past orders, tracking
    admin*.tsx      console (orders, order detail, riders, customers, payments)
    rider*.tsx      rider app
  lib/
    api/client.ts   THE ONLY place that calls fetch(); tokens, refresh, tenant header, errors
    api/endpoints.ts  THE ONLY place that holds URL paths
    menu.ts cart.ts account.ts orders.ts branches.ts coupons.ts  domain modules
    auth.ts roles.ts auth-guard.ts tenant.ts money.ts order-status.ts
  hooks/            use-session, use-live-resource (the refresh engine), etc.
  components/       kennedy/ (storefront), admin/, auth/, profile/, ui/ (shadcn)
```

### Standing rules (do not break these)

1. **No component calls `fetch()`.** Everything goes through `src/lib/api/client.ts`.
2. **No URL string in a component.** Paths live only in `src/lib/api/endpoints.ts`.
3. Every request carries `X-Tenant-Slug`; never hardcode a tenant in a screen.
4. Displayed prices are estimates; the order response is the truth.
5. Anything marked UNCONFIRMED in the contract is read **defensively** — try both field
   names / both paths, show a dash rather than crash.
6. Realtime first, `useLiveResource` polling as the automatic fallback.
7. Every failure code has a designed state: `400` inline errors · `401` silent refresh then
   login · `403` role toast · `404` friendly empty state · `409` sold-out modal ·
   `429` disabled button with a 60-second countdown.

### The constraint that shapes everything

The backend is on `localhost`; this preview runs online and cannot reach it. So every
screen is written **once**, against the real contract, but reads from a **switchable
source**: the live API when `VITE_API_BASE_URL` is set and reachable, sample data
otherwise. When the backend goes public, set the env var — no screen is rewritten.

Environment variables: `VITE_API_BASE_URL`, `VITE_DEFAULT_TENANT_SLUG`,
`VITE_DEFAULT_BRANCH_ID`, `VITE_API_AUTH_MODE` (`jwt` default).

### Running it

```
bun install
bun run dev        # http://localhost:8080
bunx tsgo --noEmit # typecheck — must be clean before any slice is called done
```

---

## 4. What is DONE

### Phase 1 — Foundations (complete)
- **1.1 Tenant awareness** — `X-Tenant-Slug` on every request, resolved header → subdomain
  → default; login and profile remember the account's tenant. (`src/lib/tenant.ts`)
- **1.2 Seven roles + route guards** — each area declares who may enter; everyone else is
  redirected to their own home. (`src/lib/roles.ts`, `auth-guard.ts`)
- **1.3 One status vocabulary** — `placed → confirmed → kitchen → packed → onway →
  delivered`, with old wording translated automatically. (`src/lib/order-status.ts`)
- **1.4 One money parser + forced password change** — no more "Rs NaN"; temp-password
  staff are locked on `/change-password`. (`src/lib/money.ts`, `routes/change-password.tsx`)
- **1.5 One refresh engine** — `useLiveResource(key, fetcher, interval)` replaced six
  scattered timers; pauses on hidden tab, never overlaps, keeps last good data.
- **1.6 Two old bugs fixed** — doubled `/api/api/` URL, hand-typed rider paths.

### Phase 2 — Customer flow (2.1 → 2.5 done, 2.6 open)
- **2.1 / 2.1b Phone sign-in** — code delivered over **WhatsApp**; an unknown number
  becomes a customer silently. Both field spellings (`code`/`otp`) and both paths are
  tried. After too many attempts the button disables with a 60-second countdown (429).
- **2.2 Dish sizes** — real `sizes[]` with their own prices on the dish page and order
  dialog; `size_id` is stored on the cart line. Dishes without sizes fall back gracefully.
- **2.3 Multi-item order body** — one order carries every ticked line
  (`items[{dish_id, size_id, qty}]`) plus `order_type` (delivery / takeaway / dine-in),
  `branch_id` and optional `coupon_code`. Takeaway/dine-in need no address and show Rs 0
  delivery + Rs 0 COD. The confirmation quotes the **server's** total.
- **2.4 Branch picker** — branches with address, opening hours, live Open/Closed badge and
  delivery radius; the choice is remembered; a closed branch blocks the order; if the
  backend serves no branches the block hides itself.
- **2.5 Discount code box** — Apply previews the discount when the backend offers a preview
  endpoint; on 404 the code is marked "pending" and sent with the order, where the server
  decides. Invalid codes show inline; applied codes add a Discount line.

Per-slice detail with the exact files touched: **`roadmap/01-done.md`**.

---

## 5. What is WRONG or PARTIAL today

| Thing | Today | Should be |
|---|---|---|
| Cart bill | estimate rendered from local rules | the server's `subtotal/delivery_fee/cod_fee/discount/total` (slice 2.6) |
| Sold out | generic error toast | dedicated `409 insufficient_stock` modal (slice 2.6) |
| Tracking | inside `/profile`, addressed by order **id** | public `/track/$code` by order **code** |
| Admin console | built against the **old** pre-multi-tenant contract | rebuild on v2.4 endpoints |
| Payments screen | list only | payment-proof review (reference + screenshot) |
| Rider app | no live GPS watch | background watch posting to `/rider/location-share/` while `onway` |
| Rider earnings | sample data | real endpoint once the path is settled |
| Realtime | polling everywhere | sockets first, polling as fallback |
| Storefront | no category tabs, no branch context | `/menu/categories/`, branch-aware menu |

## 6. What DOES NOT EXIST yet (whole screens)

`/track/$code` (public tracking) · `/kitchen` (KDS) · `/admin/pos` (counter POS) ·
`/admin/inventory` · `/admin/branches` · `/admin/staff` · `/admin/billing` ·
`/onboard` (restaurant sign-up wizard) · fleet map.

Screen-by-screen state: **`roadmap/05-gap.md`**.

---

## 7. What to do next, in order

| Phase | Work |
|---|---|
| **2.6 (immediate)** | Show the server's bill in the cart summary; build the `409 insufficient_stock` sold-out modal |
| **3 Tracking** | Public `/track/$code`, 5-step timeline on `ws/orders/{order_code}/`, Leaflet map (customer / branch / rider pins), rating dialog on delivery |
| **4 Kitchen** | `/kitchen` board: `confirmed` + `kitchen` columns, elapsed timers turning amber past 15 min, one-tap advance, rider quick-assign, chime on `ws/kitchen/` |
| **5 Admin core** | Orders feed with `?status=a,b` filter and search by code/phone; priority/ETA/notes; rider assignment; payment-proof review; defensively parsed analytics |
| **5b Cashier / POS** | `/admin/pos` + `ManualOrderModal`: takeaway/delivery/dine-in toggle, customer name + phone (invisible account linking), searchable dish picker with sizes, staff-chosen initial status, create & print receipt (ESC/POS) |
| **6 Owner tools** | Inventory with low-stock alerts and manual adjust; branch manager (hours + radius); staff manager showing the one-time temp password exactly once; plan-quota 403 UI |
| **7 SaaS layer** | `/onboard` wizard with trial; billing page with plan + trial countdown; invoice proof upload |
| **8 Design unification** | One token set across all five surfaces (see below) |
| **9 Realtime rollout** | Fleet map on `ws/admin/fleet/`; move remaining screens from polling to push |

**Working rhythm:** one slice at a time. Before writing new code, update
`roadmap/01-done.md`, `roadmap/02-next.md` and `roadmap/05-gap.md`; after writing it, run
`bunx tsgo --noEmit` and check the screen in the preview.

---

## 8. Design brief (Phase 8 — for the designer taking this over)

Today **three visual languages** are merged in one app:

1. warm, animated storefront (cream + flame, display type, mascot, motion),
2. dark shadcn admin console,
3. a third, plainer rider layout.

There are also three navigation systems and duplicate dish / card / tracking components.

**Target:** one token set (colour, type scale, radius, shadow, spacing) shared by all five
surfaces, keeping the storefront's warmth and motion while making the console and rider app
feel like the same product. Tokens live in `src/styles.css`; components must use semantic
token classes, never hardcoded colours. Design unification runs **after** the missing
screens exist, so it is done once rather than five times.

Practical notes for the designer:
- Mobile first: riders and kitchen use phones/tablets; POS runs on a counter screen.
- Kitchen tickets must be readable at arm's length, with a loud colour for the elapsed timer.
- Every failure state in rule 7 above needs a designed treatment, not just a toast.

---

## 9. Open questions for the backend owner

Tracked in `roadmap/03-blockers.md`. The live ones:

- **The base URL.** The backend is local, so nothing can be verified against real
  responses. Everything is checked against the written contract. This is the single
  biggest blocker.
- Refund endpoint — does it exist, and what shape?
- Invoice proof upload — multipart field names?
- Receipt printing — browser print, ESC/POS bridge, or backend-rendered?
- Fleet socket payload — exact shape of `ws/admin/fleet/`?
- Coupon preview path — absent from v2.4; the frontend is coded to survive either answer.
- Rider paths appear with and without the `/auth/` prefix; both are tried.
