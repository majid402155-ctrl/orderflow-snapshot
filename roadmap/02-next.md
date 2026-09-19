# Next (re-planned against backend v2.4)

## Just finished
**2.4 Branch picker on the cart** — branches are listed with hours, an Open/Closed badge and
the delivery radius; the pick is remembered and sent as `branch_id`, and a closed branch
blocks the order. (2.3 before it put the real multi-item order body in place.)

## Building next, in this order

| # | Slice | Why now |
|---|-------|---------|
| 2.5 | Coupon box (preview discount before placing) | body already accepts `coupon_code` |
| 2.6 | Real bill shown in the summary + **out-of-stock (409) modal** | never trust a client total |

## Then

- **Phase 3 Tracking** — public `/track/$code`, socket-first (`ws/orders/{order_code}/`)
  with the refresh engine as fallback, 5-step timeline, rider marker, rating dialog.
- **Phase 4 Kitchen board** (`/kitchen`) — confirmed/kitchen columns, elapsed timers,
  chime on `ws/kitchen/`, one-tap advance, rider quick-assign.
- **Phase 5 Admin core** — orders feed, priority/ETA/notes, rider assignment, payment
  proof review, defensive analytics cards.
- **Phase 5b Cashier / POS** (`/admin/pos` + `<ManualOrderModal />`).
- **Phase 6 Owner tools** — inventory, branches, staff manager.
- **Phase 7 SaaS layer** — `/onboard` wizard, plans, subscription, invoice proof.
- **Phase 8 Design unification** · **Phase 9 Realtime rollout**.
