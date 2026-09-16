# Verified backend contract (the version we code against)

Base: `VITE_API_BASE_URL` (no trailing slash) · tenant `VITE_DEFAULT_TENANT_SLUG`
Headers on every call: `Content-Type: application/json`, `X-Tenant-Slug`,
`Authorization: Bearer <access>` when signed in. On 401: one silent
`POST /api/auth/refresh/`, then `/login`.

## Roles (7)
customer · kitchen · rider · cashier · manager · admin · owner
`must_change_password: true` locks the user on `/change-password`.

## Auth
- `POST /api/auth/login/` `{username: phone, password}` →
  `{access, refresh, must_change_password, user:{id, role, full_name, tenant:{id,name,slug}}}`
- `POST /api/auth/phone-otp/` `{phone}` → `{message}`
- `POST /api/auth/phone-verify/` `{phone, code}` → `{access, refresh, is_new_customer, user}`
  (new customer is created silently — no password asked)
- Onboarding: `/api/onboard/initiate/` → `/verify/` → `/complete/`

## Menu
Dish `{id, name, slug, base_price, image_url, is_available, is_featured, sizes:[{id,size,price}]}`
`GET /api/menu/categories/ | /dishes/ | /dishes/{slug}/`

## Checkout
`POST /api/orders/` `{branch_id, payment, coupon_code, address{...}, items:[{dish_id,size_id,qty}]}`
→ 201 `{id, order_code, status, subtotal, discount, delivery_fee, total, items[]}`
Coupon preview: `POST /api/orders/apply-coupon/ {code, subtotal}`

## Status vocabulary
pending → confirmed → kitchen → packed → onway → delivered (cancelled anytime)

## Polling
customer order 3–5s · admin feed 10s · rider jobs 10–15s · rider GPS share 10–15s

## Rider
`POST /api/rider/duty-status/` (always POST) · `/rider/location-share/` ·
`/rider/earnings/` · `/rider/profile/`

## Admin / owner
orders status + assign-rider + controls · `/api/admin/menu/*` (+ multipart image upload) ·
`/api/inventory/` · `POST /api/admin/staff/` (returns one-time temp password) ·
`/api/admin/branches/` · `/api/billing/*` · `/api/orders/analytics/` (defensive parse)

---

# v2.4 system-guide deltas (16 Sep 2026)

- **Realtime confirmed**: `ws/orders/{order_code}/` (customer), `ws/kitchen/` (KDS),
  `ws/admin/fleet/` (control room). Payload: `{type:"order_update", order_code, status,
  rider:{name, phone, lat, lng}}`. Sockets are addressed by **order_code**, not id.
- **Multi-item checkout confirmed**, with `branch_id`, `payment`, `items[]` and an
  address carrying `lat, lng, street, area, city`.
- **OTP is delivered over WhatsApp** (Evolution API). Send `/api/auth/phone-otp/`;
  verify path spelled `/phone-verify/` in one guide, `/verify-otp/` in the other.
- **Stock**: confirming an order deducts ingredients by recipe; not enough stock returns
  `409 insufficient_stock`; cancelling restores stock.
- **Payments**: COD auto-verifies on delivery. JazzCash/EasyPaisa need a reference number
  plus a screenshot, reviewed via `POST /api/orders/{id}/verify-payment/`. Card is webhook-verified.
- **Cashier/POS**: counter orders created with `source: "pos"`; receipts print ESC/POS.
- **Branches** carry opening hours and a delivery radius; inventory and kitchen are per branch.
- **Role matrix** (from the guide): kitchen may assign a rider; rider alone moves
  `packed -> onway -> delivered`; manager sees analytics and inventory but not staff;
  only admin/owner manage staff; only owner manages the SaaS subscription.
- **Orders list filter**: `GET /api/orders/?status=confirmed,kitchen`.
- **Rider paths** appear as `/api/auth/rider/duty-status/` and `/api/auth/rider/earnings/`
  here, contradicting the master guide — both spellings are tried.
