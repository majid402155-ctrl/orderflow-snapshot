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
