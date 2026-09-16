# Next (re-planned against the v2.4 system guide)

## Just finished
**2.1 Phone + code sign-in** — built. One correction queued: the code arrives on
**WhatsApp**, so the screen wording changes to say so (folded into 2.1b below).

## Building next, in this order
| # | Slice | Why now |
|---|---|---|
| 2.1b | WhatsApp wording + the verify-path fallback | tiny, finishes 2.1 correctly |
| 2.3 | Dish sizes on the dish page and in the cart | the order body needs `size_id` |
| 2.4 | Multi-item cart | now **confirmed** by the backend |
| 2.2 | Branch picker (opening hours + delivery radius aware) | `branch_id` is required on the order |
| 2.5 | Coupon box | preview discount before placing |
| 2.6 | Real bill from the order response + **out-of-stock (409) screen** | never trust a client total |

## Then
- **Phase 3 Tracking** — now socket-first (`ws/orders/{order_code}/`) with the Phase 1
  refresh engine as automatic fallback; rider map; rating dialog.
- **Phase 4 Kitchen board** — socket chime on new order (`ws/kitchen/`), one-tap advance.
- **Phase 5 Admin core** — orders feed, rider assignment, priority/ETA/notes, menu manager.
- **Phase 5b Cashier / POS (new)** — counter order screen, settle payment, receipt.
- **Phase 6 Owner tools** — inventory with low-stock alerts and recipe deduction view,
  staff manager with the one-time temp password, branch manager with hours + radius.
- **Phase 7 SaaS layer** — sign-up wizard with trial, plans, invoices, proof upload.
- **Phase 8 Design unification.**
- **Phase 9 (new) Realtime everywhere** — fleet map (`ws/admin/fleet/`), and switching the
  remaining screens from refresh to push.
