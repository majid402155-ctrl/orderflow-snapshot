# Next (re-planned against backend v2.4)

## Just finished
**2.2 Dish sizes** — dishes carry real `sizes[]` with prices and `size_id`; the dish page,
order dialog and cart all read them, with the old three-size ladder as fallback.

## Building next, in this order

| # | Slice | Why now |
|---|---|---|
| 2.3 | Multi-item cart + real order body (`branch_id`, `order_type`, `items[]`) | confirmed contract |
| 2.4 | Branch picker (opening hours + delivery radius aware) | `branch_id` is required |
| 2.5 | Coupon box (preview discount before placing) | |
| 2.6 | Real bill from the order response + **out-of-stock (409) modal** | never trust a client total |

## Then

- **Phase 3 Tracking** — new public `/track/$code` page, socket-first
  (`ws/orders/{order_code}/`) with the refresh engine as automatic fallback, 5-step
  timeline, rider bike marker interpolated on the map, rating dialog.
- **Phase 4 Kitchen board** (`/kitchen`) — two columns (`confirmed`, `kitchen`), elapsed
  timers turning amber past 15 min, chime on `ws/kitchen/`, one-tap advance, rider
  quick-assign.
- **Phase 5 Admin core** — orders feed with status filter and search, priority/ETA/notes,
  rider assignment, payment proof review, defensive analytics cards.
- **Phase 5b Cashier / POS** (`/admin/pos` + `<ManualOrderModal />`) — takeaway /
  delivery / dine-in toggle, customer name + phone, searchable dish picker with sizes,
  staff-chosen initial status, create & print ticket.
- **Phase 6 Owner tools** — inventory with low-stock alerts and restore-on-cancel
  messaging, branch manager (hours + radius), staff manager with the one-time temp
  password.
- **Phase 7 SaaS layer** — `/onboard` wizard with trial, plans grid, subscription card,
  invoice proof upload.
- **Phase 8 Design unification** — one token set across all five surfaces.
- **Phase 9 Realtime rollout** — fleet map (`ws/admin/fleet/`), remaining screens moved
  from refresh to push, exponential-backoff reconnect everywhere.
