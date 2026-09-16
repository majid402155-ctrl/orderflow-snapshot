# Kennedy Frontend — Phase & Slice Roadmap

Detail lives in `/roadmap`. Review after every slice, then continue to the next.
Updated 16 Sep 2026 against the v2.4 backend system guide (multi-item + branches +
WebSockets all confirmed).

## Phase 1 — Foundations
- [x] 1.1 Tenant awareness: X-Tenant-Slug on every request from a global context
- [x] 1.2 7 roles + page permission guards
- [x] 1.3 Unified status vocabulary (kitchen/packed/onway replaces cooking/picking)
- [x] 1.4 Single price parser + forced password-change screen
- [x] 1.5 useLiveResource(key, fetcher, interval) hook replacing scattered intervals
- [x] 1.6 Fix ConnectionBanner double /api/api/menu/ bug; admin.riders.tsx hardcoded paths -> endpoints.ts

## Phase 2 — Customer Flow Upgrade
Multi-item `items: []` CONFIRMED by the v2.4 guide — no longer blocked.
- [x] 2.1 Phone+code sign-in, silent account creation
- [ ] 2.1b WhatsApp wording + verify-path fallback
- [ ] 2.3 Dish size selection (size_id)
- [ ] 2.4 Multi-item cart
- [ ] 2.2 Branch picker (opening hours + delivery radius)
- [ ] 2.5 Coupon box
- [ ] 2.6 Real bill from order response + out-of-stock (409) screen

## Phase 3 — Order Tracking (socket-first, refresh engine as fallback)
- [ ] 3.1 Status timeline on ws/orders/{order_code}/
- [ ] 3.2 Rider live map from pushed GPS
- [ ] 3.3 Rating dialog on delivery

## Phase 4 — Kitchen Screen
- [ ] 4.1 3-column ticket board
- [ ] 4.2 One-tap status advance
- [ ] 4.3 New-order chime over ws/kitchen/

## Phase 5 — Admin Core
- [ ] 5.1 Orders feed + rider assignment
- [ ] 5.2 Priority/ETA/notes controls
- [ ] 5.3 Real unassign call + proper refund flow (endpoint still to confirm)
- [ ] 5.4 Menu manager: dishes, categories, photo upload, discounts

## Phase 5b — Cashier / POS (new, from v2.4 guide)
- [ ] 5b.1 Counter order screen (source: "pos")
- [ ] 5b.2 Payment settle + verify
- [ ] 5b.3 Receipt print layout

## Phase 6 — Owner Tools
- [ ] 6.1 Inventory + low-stock warnings + recipe deduction view
- [ ] 6.2 Staff manager via POST /api/admin/staff/, show one-time temp password
- [ ] 6.3 Branch manager (hours + delivery radius) + plan quota 403 UI with billing link

## Phase 7 — SaaS Layer
- [ ] 7.1 Restaurant sign-up wizard with trial
- [ ] 7.2 Billing page: plan + trial countdown
- [ ] 7.3 Invoice proof upload (JazzCash / EasyPaisa screenshot + reference)

## Phase 8 — Design Unification
- [ ] 8.1 One Caddy token system across storefront/admin/rider (keep storefront motion)

## Phase 9 — Realtime Everywhere (new, sockets confirmed)
- [ ] 9.1 Fleet map on ws/admin/fleet/
- [ ] 9.2 Move remaining screens from refresh to push
