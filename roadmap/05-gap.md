# Gap analysis — this frontend vs backend v2.4 (16 Sep 2026)

Legend: **BUILT** · **PARTIAL** (exists, incomplete or on sample data) · **MISSING** ·
**WRONG** (built against a contract the backend no longer uses).

## 1. Routes today (22) vs routes v2.4 needs

| Route | State |
|---|---|
| `/` storefront | BUILT — but no sizes, no branch, no category tabs from `/menu/categories/` |
| `/dish/$slug` | PARTIAL — single price, no `sizes[]` picker |
| `/cart` | PARTIAL — single-dish body, no `size_id`, no `branch_id`, no coupon, no `cod_fee` |
| `/login`, `/signup`, `/forgot-password`, `/reset-password` | BUILT — phone code over WhatsApp (2.1/2.1b), 429 countdown on the button |
| `/change-password` | BUILT (forced when `must_change_password`) |
| `/profile` | BUILT — orders, addresses, security |
| `/admin`, `/admin/orders`, `/admin/orders/$id`, `/admin/riders` | BUILT on the old contract |
| `/admin/customers`, `/admin/payments` | PARTIAL — no screenshot proof review |
| `/rider`, `/rider/jobs`, `/rider/profile` | BUILT — no live GPS watch |
| `/rider/earnings` | PARTIAL — sample data until earnings path is settled |
| `/track/$code` | **MISSING** — v2.4 tracks by `order_code`, publicly, no login |
| `/kitchen` | **MISSING** — kitchen role still lands on the admin feed |
| `/admin/pos` | **MISSING** — the whole counter/phone/WhatsApp order surface |
| `/admin/inventory` | **MISSING** |
| `/admin/branches` | **MISSING** |
| `/admin/staff` | **MISSING** |
| `/admin/analytics` | PARTIAL — folded into `/admin`, field names not defensive everywhere |
| `/admin/billing` | **MISSING** |
| `/onboard` | **MISSING** |

## 2. Wrong against v2.4 (must be corrected, not extended)

| Thing | Today | v2.4 |
|---|---|---|
| Order body | single dish, `{dish_slug, size, qty}` | `{branch_id, order_type, items:[{dish_id,size_id,qty}], address?}` |
| Tracking address | order `id` | order **`code`** (`MG-XXXXXX`) |
| Token refresh | `/api/auth/refresh/` | guide also names `/api/auth/token/refresh/` — try both |
| Fees | `cod_fee` treated as a payment-method fee in the cart | server-calculated; takeaway/dine-in = Rs 0 delivery **and** Rs 0 COD fee |
| Realtime | polling only, by decision | sockets confirmed; polling becomes the fallback |
| Role of the profile call | `/profile/` | v2.4 guide names `/api/auth/me/` — keep the fallback pair |

## 3. Missing behaviours (no screen anywhere)

- Counter POS: order type toggle (takeaway / delivery / dine-in), customer name + phone
  with invisible account linking, staff-chosen initial status, receipt print.
- Out of stock: `409 insufficient_stock` needs its own modal, not a generic error.
- Inventory: stock table, low-stock red badges, manual adjust, "cancelling restores stock".
- Branches: opening hours and delivery radius, respected by the customer branch picker.
- Staff: create staff, show the one-time temp password exactly once.
- Billing: plan tiers, subscription state (`trialing` / `active` / `past_due`), invoice
  proof upload (JazzCash / EasyPaisa screenshot + reference).
- Fleet map: all active riders on one map for manager/admin.
- KDS chime on a new order ticket.

## 4. Design state

Three visual languages are merged today: warm animated storefront, dark console, and a
third rider layout — with three navigation systems and duplicate dish/card/tracking
components. Target: one token set across all five surfaces, keeping the storefront motion.
Design unification runs as Phase 8, after the screens exist, so it is done once.
