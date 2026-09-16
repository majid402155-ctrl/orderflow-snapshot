# Open questions — updated against the v2.4 system guide (16 Sep 2026)

The v2.4 guide (52/52 live tests passing) **cleared most of the old blockers**.

| # | Question | Status |
|---|---|---|
| B1 | Multi-item `items: [{dish_id, size_id, qty}]` on `POST /api/orders/` | ✅ **CONFIRMED** — Phase 2 unblocked |
| B4 | Branches per tenant, `branch_id` on the order | ✅ **CONFIRMED** — branches are core to the model |
| R1 | Realtime | ✅ **CONFIRMED** — `ws/orders/{order_code}/`, `ws/kitchen/`, `ws/admin/fleet/` |
| B3 | OTP: send is `/api/auth/phone-otp/`; verify is spelled `/phone-verify/` in one guide and `/verify-otp/` in the other | ⚠️ tries one, falls back to the other automatically |
| R2 | Rider paths: master guide says **no** `/auth/` prefix, v2.4 guide shows `/api/auth/rider/...` | ⚠️ same fallback approach |
| B2 | Coupon path `/api/orders/apply-coupon/` — not mentioned in v2.4 | ⚠️ coded defensively |
| B5 | Analytics field names | ⚠️ fallbacks in place |
| B6 | Dedicated refund endpoint (today the UI works around verify-payment) | ❌ **OPEN** |
| B7 | Does the order list accept `?status=confirmed,kitchen` as a comma list? | ⚠️ assumed, filters client-side too |

## New facts that change the frontend

1. **WebSockets are real.** Tracking, kitchen board and the fleet map can push instead of poll. The refresh engine built in Phase 1 stays as the automatic fallback when a socket can't connect.
2. **Order code, not id, addresses a socket** (`MG-XXXXXX`).
3. **Out of stock is a real answer**: `409 insufficient_stock` on checkout needs its own friendly screen, not a generic error.
4. **Cashier/POS is a surface we never planned** — counter orders with `source: "pos"`, payment settle, receipt print.
5. **Cancelling restores stock** — the UI should say so when staff cancel.
6. **OTP arrives on WhatsApp**, not SMS — the wording on the sign-in screen must say WhatsApp.
7. **Payments**: COD auto-verifies on delivery; JazzCash/EasyPaisa need a reference number **and a screenshot upload** reviewed by a manager.
8. **Branches carry opening hours and a delivery radius** — the customer branch picker should respect both.
