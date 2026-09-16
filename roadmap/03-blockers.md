# Open questions — against backend v2.4 (16 Sep 2026)

The v2.4 guide (52/52 live tests passing) cleared most of the old blockers.

| # | Question | Status |
|---|---|---|
| B1 | Multi-item `items:[{dish_id,size_id,qty}]` on `POST /api/orders/` | ✅ CONFIRMED |
| B4 | Branches per tenant, `branch_id` on the order | ✅ CONFIRMED (hours + radius carried) |
| R1 | Realtime | ✅ CONFIRMED — `ws/orders/{order_code}/`, `ws/kitchen/`, `ws/admin/fleet/` |
| B8 | Counter/POS orders (`order_type`, `customer_name`, `customer_phone`, staff status) | ✅ CONFIRMED |
| B9 | `409 insufficient_stock` on checkout, stock restored on cancel | ✅ CONFIRMED |
| B3 | Verify path: `/auth/phone-verify/` vs `/auth/verify-otp/` | ⚠️ tries one, falls back |
| R2 | Rider paths: with or without the `/auth/` prefix | ⚠️ same fallback approach |
| R3 | Refresh path: `/auth/refresh/` vs `/auth/token/refresh/` | ⚠️ same fallback approach |
| R4 | Current user: `/profile/` vs `/auth/me/` | ⚠️ same fallback approach |
| B2 | Coupon path `/api/orders/apply-coupon/` — absent from v2.4 | ⚠️ coded defensively, hidden on 404 |
| B5 | Analytics field names | ⚠️ fallbacks in place |
| B7 | Does the order list accept `?status=confirmed,kitchen` as a comma list? | ✅ shown in v2.4 |
| B6 | Dedicated refund endpoint (today the UI works around verify-payment) | ❌ OPEN |
| B10 | Invoice proof upload shape (multipart vs JSON + URL) on `/api/billing/invoices/initiate/` | ❌ OPEN |
| B11 | Receipt printing: is there a server-rendered ESC/POS payload, or does the browser print? | ❌ OPEN |
| B12 | Fleet socket payload shape for `ws/admin/fleet/` (per-rider array?) | ❌ OPEN |

## The one blocker that outranks all of these
The backend is **local**. Until a reachable base URL exists, every screen is reviewed on
sample data and verified against the contract, not against live responses.

## What v2.4 changed in how we build
1. **Sockets are real** — push first, refresh engine as fallback.
2. **Order code, not id, addresses a socket and the tracking page** (`MG-XXXXXX`).
3. **Out of stock is a real answer** — `409` gets its own friendly modal.
4. **Cashier/POS is a surface we never planned.**
5. **Cancelling restores stock** — the UI should say so when staff cancel.
6. **OTP arrives on WhatsApp**, not SMS.
7. **Payments** — COD auto-verifies on delivery; wallets need a reference number and a
   screenshot reviewed by a manager; card is webhook-verified.
8. **Takeaway and dine-in skip the address entirely** — Rs 0 delivery and Rs 0 COD fee.
9. **Login is throttled** at 5 per minute — the form must handle `429`.
