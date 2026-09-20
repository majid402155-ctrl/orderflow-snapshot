# Done

## Phase 1 — Foundations ✅ (all six slices)

### 1.1 Tenant awareness
Every request now states which restaurant it belongs to, resolved automatically:
explicit override → web address subdomain → configured default → `moon-grill-narowal`.
Login and profile both remember the tenant the account belongs to.
Files: `src/lib/tenant.ts` (new), `src/lib/api/client.ts`, `src/lib/auth.ts`.

### 1.2 Seven roles + page permissions
customer, kitchen, rider, cashier, manager, admin, owner. Each area declares who may
enter; anyone else is sent quietly to their own home screen. The old five-role list is
gone; legacy "staff" is read as kitchen.
Files: `src/lib/roles.ts` (new), `src/lib/auth-guard.ts`, `src/routes/admin.tsx`,
`src/routes/rider.tsx`.

### 1.3 One status vocabulary
placed → confirmed → in the kitchen → packed → on the way → delivered. Old wording
("cooking", "picking", "out for delivery", …) is translated automatically so historic
orders still read correctly.
Files: `src/lib/order-status.ts` (new), `src/lib/orders.ts`, `src/lib/caddy.ts`,
`src/routes/profile.tsx`.

### 1.4 One price reader + forced password change
All amounts go through one parser, so a missing value shows a dash, never "Rs NaN".
Staff issued a temporary password are locked onto a "set your own password" screen
until they change it.
Files: `src/lib/money.ts` (new), `src/routes/change-password.tsx` (new), `src/lib/auth.ts`.

### 1.5 One refresh engine
`useLiveResource(key, fetcher, interval)` replaces the scattered timers: pauses when the
tab is hidden, refreshes on return, never overlaps, keeps the last good data.
Files: `src/hooks/use-live-resource.ts` (new).

### 1.6 Two old bugs fixed
The connection check was calling a doubled-up address; the riders page had hand-typed
links. Both now use the shared address list.
Files: `src/lib/api/client.ts` (`apiUrl`), `src/components/ConnectionBanner.tsx`,
`src/routes/admin.riders.tsx`.

---

## Phase 2 — Customer flow

### 2.1 Phone + code sign-in (silent account creation) ✅
Customers can sign in with a phone number and a 6-digit code — no password, and a
first-time number becomes an account without asking for one. The password form stays
for staff. If the server has not switched the feature on yet, the screen says so in
plain words instead of failing.
Files: `src/lib/api/endpoints.ts` (phone-otp / phone-verify), `src/lib/auth.ts`
(`requestPhoneCode`, `verifyPhoneCode`), `src/routes/login.tsx` (two sign-in modes).

### 2.1b WhatsApp wording, verify fallback, throttle countdown ✅
The code is sent over WhatsApp, so every line on the sign-in screen now says so
("WhatsApp code" tab, WhatsApp placeholder and helper text). The verify step sends both
field spellings (`code` and `otp`) and tries both paths, so whichever the server ends up
using, sign-in works. After too many attempts the server answers "too many requests": the
button now disables itself and counts down 60 seconds instead of letting the user keep
hammering a blocked door.
Files: `src/routes/login.tsx`, `src/lib/auth.ts`, `src/lib/api/endpoints.ts`.

### 2.2 Dish sizes from the menu itself ✅
Every dish now carries its real size list (`sizes[]` → label + price + `size_id`). The dish
page and the order dialog show those sizes with their own prices instead of a made-up
"+350/+700" ladder, and the chosen `size_id` is stored on the cart line ready for the order
body. Dishes without sizes (or when only sample data is available) fall back to the old
three-size ladder so nothing breaks.
Files: `src/lib/menu.ts` (`DishSize`, `Dish.sizes`, normaliser), `src/lib/cart.ts`
(`dishSizes`, `unitPriceFor`, `CartLine.sizeId`, smarter `addToCart`),
`src/routes/dish.$slug.tsx`, `src/components/kennedy/OrderDialog.tsx`.

### 2.3 Multi-item cart + real order body ✅
One order now carries every ticked line (`items[]` with `dish_id` + `size_id`), plus
`order_type` (delivery / takeaway / dine-in), `branch_id` and an optional `coupon_code`.
Takeaway and dine-in ask for no address and show Rs 0 delivery + Rs 0 cash-handling. The
confirmation quotes the bill the server returned instead of the cart's estimate.
Files: `src/lib/account.ts` (`OrderBill`, `getLastOrderBill`, `OrderType`, `OrderLineInput`,
rewritten `createOrder`), `src/lib/branches.ts` (new), `src/lib/api/endpoints.ts`
(`BRANCHES`), `src/routes/cart.tsx`.

### 2.4 Branch picker on the cart ✅
The cart lists the tenant's branches with address, opening hours, live Open/Closed badge
and (for delivery) the delivery radius. The choice is remembered for next time and sent as
`branch_id`; ordering from a closed branch is blocked with a plain message. When the
backend serves no branches the whole block stays hidden and the old auto-resolve applies.
Files: `src/lib/branches.ts` (`branchHours`, `isOpenNow`), `src/routes/cart.tsx`.

### 2.5 Discount code box on the cart ✅
The summary panel has a code field. Apply asks the backend what the code is worth; when
the deployment has no preview endpoint (404 on both spellings) the code is accepted as
"pending" and sent with the order, where the server has the final say. A rejected code
shows an inline message, an accepted one shows a Discount line and reduces the displayed
total, and either way `coupon_code` rides along in the order body.
Files: `src/lib/coupons.ts` (new — `CouponState`, `previewCoupon`, `normalizeCoupon`),
`src/lib/api/endpoints.ts` (`ORDERS.applyCoupon` + `applyCouponAlt`), `src/routes/cart.tsx`.
