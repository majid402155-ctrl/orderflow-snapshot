# Overview

## The product
Kennedy — a food-ordering product being turned into a **multi-restaurant SaaS**.
Three surfaces: the customer storefront, the restaurant console (admin/owner/manager/
cashier/kitchen) and the rider console.

## The constraint that shapes everything
The upgraded backend runs **locally**; this frontend runs **online**. An online page
cannot reach `localhost`. So every screen is written once, against the real contract,
but reads from a **switchable source**: the live API when a reachable base URL is set,
sample data otherwise. Flip one setting when the backend is public — no screen is
written twice.

## Standing rules
1. No component calls `fetch()` directly — everything goes through `src/lib/api/client.ts`.
2. Every request carries `X-Tenant-Slug`; the tenant is never hardcoded in a screen.
3. Prices shown in the UI are **display-only**. The real bill always comes back from
   the order response.
4. Anything marked UNCONFIRMED is read defensively (fallback field names), so a rename
   shows a zero or a dash — never a crash.
5. Polling only. No realtime/socket code until the backend confirms it exists.
6. Endpoint paths live only in `src/lib/api/endpoints.ts`.

## Plan shape
8 phases, 26 slices. One slice at a time, reviewed before the next.
Phases: 1 Foundations · 2 Customer flow · 3 Tracking · 4 Kitchen · 5 Admin core ·
6 Owner tools · 7 SaaS layer · 8 Design unification.
