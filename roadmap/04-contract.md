# Backend contract v2.4 (the version we code against)

Base: `VITE_API_BASE_URL` (no trailing slash) · tenant `VITE_DEFAULT_TENANT_SLUG`
Headers on every call: `Content-Type: application/json`, `Accept: application/json`,
`X-Tenant-Slug`, `Authorization: Bearer <access>` when signed in.
On 401: one silent refresh (`/auth/refresh/`, fallback `/auth/token/refresh/`), then `/login`.
Access token 60 min · refresh 7 days · login throttled at 5/min (`429`).

## Tenants and branches
Tenant resolution: `X-Tenant-Slug` header → subdomain → the signed-in staff user's tenant.
A tenant has many branches; inventory and kitchen are **per branch**.

## Roles (7)
customer · kitchen · rider · cashier · manager · admin · owner
`must_change_password: true` locks the user on `/change-password`.

Route guards: `/kitchen` kitchen+admin+manager · `/rider` rider ·
`/admin/pos` + `/admin/orders` admin/owner/manager/cashier ·
`/admin/inventory` admin/owner/manager · `/admin/staff` admin/owner · `/admin/billing` owner.

Who may move what: kitchen does `confirmed → kitchen → packed` and may assign a rider;
the assigned rider does `packed → onway → delivered`; admin/owner may do either.

## Auth
- `POST /auth/login/` `{username, password}` → `{access, refresh, must_change_password, user:{id, role, full_name, tenant:{id,name,slug}}}`
- `POST /auth/phone-otp/` `{phone}` → 6-digit code **over WhatsApp**; unknown number becomes a customer silently
- `POST /auth/phone-verify/` (alt `/auth/verify-otp/`) `{phone, code|otp}` → `{access, refresh, is_new_customer, user}`
- Current user: `/profile/` (alt `/auth/me/`)
- Onboarding: `/onboard/initiate/` → `/verify/` → `/complete/`

## Menu
Dish `{id, name, slug, base_price, effective_price, image_url, is_available, is_featured, sizes:[{id,size,price}]}`
`GET /menu/categories/ | /menu/dishes/ | /menu/dishes/{slug}/ | /menu/book/`

## Checkout
```json
POST /orders/
{ "order_type": "delivery|takeaway|dine_in", "branch_id": 1, "payment": "cod",
  "coupon_code": "…",
  "items": [{"dish_id": 12, "size_id": 4, "qty": 2}],
  "address": {"street": "…", "area": "…", "city": "…", "lat": 32.1, "lng": 74.87} }
```
→ 201 `{id, order_code, status, subtotal, delivery_fee, cod_fee, discount, total, items[], address}`

Staff/POS variant adds `customer_name`, `customer_phone`, `status` (`confirmed` or
`kitchen`) and may use `source: "pos"`. Takeaway and dine-in need **no address**: the
backend uses the branch coordinates with Rs 0 delivery and Rs 0 COD fee.

Fees for display only: delivery Rs 120 under Rs 2000, free at or above; COD Rs 150 on
delivery orders. The bill is whatever the response says.

Coupon preview: `POST /orders/apply-coupon/ {code, subtotal}` (path unconfirmed).

## Status vocabulary
`pending → confirmed → kitchen → packed → onway → delivered`, `cancelled` before delivery.
`confirmed` deducts ingredients by recipe; `cancelled` restores them.
List filter: `GET /orders/?status=confirmed,kitchen`.

## Realtime (confirmed)
| Socket | For |
|---|---|
| `ws/orders/{order_code}/` | customer tracking — status + rider coordinates |
| `ws/kitchen/` | KDS board and chime |
| `ws/admin/fleet/` | all active riders on one map |

Payload `{type: "order_update"|"rider_location", order_code, status, rider:{name, phone, lat, lng}}`.
Reconnect with exponential backoff (1s, 2s, 4s, max 10s); fall back to the refresh engine.

## Rider
`POST /rider/duty-status/` (always POST) · `POST /rider/location-share/ {lat, lng}` during
`onway` · `/rider/profile/` · `/rider/earnings/` — each with the `/auth/…` twin as fallback.

## Admin / owner
`/orders/{id}/status/ | /controls/ | /assign-rider/ | /verify-payment/ | /payment-status/` ·
`/admin/menu/*` (+ multipart image upload) · `/inventory/` (+ `/{id}/adjust/`) ·
`POST /admin/staff/` (returns a one-time temp password) · `/admin/branches/` ·
`/billing/plans/ | /billing/subscription/ | /billing/invoices/initiate/` ·
`/orders/analytics/` (field names parsed defensively).

## Failure codes → UI
`400` inline field errors · `401` silent refresh then login · `403` "your role is not
authorized" toast · `404` friendly empty state · `409 insufficient_stock` sold-out modal ·
`429` disabled button with a 60-second countdown.
