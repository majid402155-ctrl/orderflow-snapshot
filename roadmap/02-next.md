# Next (re-planned against backend v2.4)

## Just finished
**2.5 Discount code box** — a code field on the cart summary; the backend previews the
discount when it can, otherwise the code rides along with the order. (2.3 put the real
multi-item order body in place, 2.4 added the branch picker.)

## Building next, in this order

| # | Slice | Why now |
|---|-------|---------|
| 2.6 | Real bill in the summary + **out-of-stock (409) modal** | never trust a client total; sold-out needs its own screen |

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

## Handover note
`main_content.md` at the project root is the full guide for anyone joining (system,
architecture, what is done, what is left, how to run it). Keep it updated with this file.
