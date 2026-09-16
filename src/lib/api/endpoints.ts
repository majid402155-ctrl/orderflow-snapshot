/**
 * ============================================================================
 * DJANGO ENDPOINT CONTRACT — customer-joy-studio -> kennedy-backend map
 * ============================================================================
 */

export const AUTH = {
  /** POST {username, password} -> {access, refresh, user} (SimpleJWT) */
  login: "/auth/login/",
  /** POST {refresh} -> {access} */
  refresh: "/auth/refresh/",
  /** POST {username, email, password, requested_role} -> {detail, username, status} */
  register: "/auth/signup/",
  /** Client-side token purge (SimpleJWT) */
  logout: "/auth/logout/",
  /** GET -> Profile data (reuses /api/profile/ to avoid redundant endpoints) */
  me: "/profile/",
  /** POST {email} -> 204 always (never leaks whether the account exists) */
  passwordReset: "/auth/password-reset/",
  /** POST {email, code, new_password} -> 200 */
  passwordResetConfirm: "/auth/password-reset-confirm/",
  /** POST -> 6-digit OTP emailed to the signed-in user */
  sendOtp: "/auth/send-otp/",
  /** POST {code} -> marks profile.is_email_verified = true */
  verifyOtp: "/auth/verify-otp/",
  /** SLICE 2.1 — POST {phone} -> {message}. Sends a 6-digit login code by SMS. */
  phoneOtp: "/auth/phone-otp/",
  /**
   * SLICE 2.1 — POST {phone, code} -> {access, refresh, is_new_customer, user}.
   * A phone we've never seen becomes a customer account silently (no password).
   */
  phoneVerify: "/auth/phone-verify/",
  /**
   * The v2.4 system guide names this one instead. Path spelling is UNCONFIRMED,
   * so `verifyPhoneCode()` tries `phoneVerify` first and falls back to this.
   */
  phoneVerifyAlt: "/auth/verify-otp/",
} as const;


export const PROFILE = {
  /** GET -> Profile */
  detail: "/profile/",
  /** PATCH {full_name, phone, avatar_url} -> Profile */
  update: "/profile/",
  /** Saved delivery addresses */
  addresses: "/addresses/",
  addressDetail: (id: number | string) => `/addresses/${id}/`,
  setDefaultAddress: (id: number | string) => `/addresses/${id}/set-default/`,
  /** POST {current_password, new_password} -> 200 */
  changePassword: "/profile/change-password/",
  /** Active rider for current customer order */
  activeRider: "/orders/active-rider/",

} as const;

export const MENU = {
  /** GET -> categories with nested dishes */
  categories: "/menu/categories/",
  /** GET -> Dish[] */
  dishes: "/menu/dishes/",
  /** GET -> structured book menu data from Django DB */
  book: "/menu/book/",
  /** GET /menu/dishes/{slug}/ */
  dish: (slug: string) => `/menu/dishes/${slug}/`,
} as const;

export const FAVOURITES = {
  /** GET -> {id, dish_slug, created_at}[] */
  list: "/favourites/",
  /** POST {dish_slug} */
  add: "/favourites/",
  /** DELETE /favourites/{id}/ or /favourites/{dish_slug}/ */
  remove: (id: number | string) => `/favourites/${id}/`,
  /** POST {slugs: string[]} */
  merge: "/favourites/merge/",
} as const;

export const ORDERS = {
  /** GET -> Order[] for the signed-in customer */
  list: "/orders/",
  /** POST {items[], address, payment, total} -> Order */
  create: "/orders/",
  /** DELETE /orders/{id}/ — admin-only permanent delete */
  detail: (id: number | string) => `/orders/${id}/`,
  /** GET/PATCH /orders/{id}/status/ */
  status: (id: number | string) => `/orders/${id}/status/`,
  /** POST /orders/{id}/assign-rider/ {rider_user_id: number} */
  assignRider: (id: number | string) => `/orders/${id}/assign-rider/`,
  /** PATCH /orders/{id}/controls/ {priority, eta_minutes, internal_notes, discount} */
  controls: (id: number | string) => `/orders/${id}/controls/`,
  /** GET /orders/{id}/rider-location/ -> {lat, lng, status, eta_minutes, updated_at} */
  riderLocation: (id: number | string) => `/orders/${id}/rider-location/`,
  /** POST /orders/{id}/rate/ {rating: number} */
  rate: (id: number | string) => `/orders/${id}/rate/`,
} as const;

export const ADMIN = {
  orders: "/orders/all/",
  stats: "/orders/analytics/",
  payments: "/orders/payments/",
  customers: "/orders/customers/",
  riders: "/admin/riders/",
  verifyPayment: (id: number | string) => `/orders/${id}/verify-payment/`,
  paymentStatus: (id: number | string) => `/orders/${id}/payment-status/`,
  pendingApprovals: "/admin/pending-approvals/",
  approveRider: (id: number | string) => `/admin/riders/${id}/approve/`,
  rejectRider: (id: number | string) => `/admin/riders/${id}/reject/`,
  verifyRider: (id: number | string) => `/admin/riders/${id}/fleet-verify/`,
  fleetVerify: (id: number | string) => `/admin/riders/${id}/fleet-verify/`,
  settleCash: (id: number | string) => `/admin/riders/${id}/settle-cash/`,
} as const;

export const ELEVENLABS = {
  /** GET -> {signed_url, is_guest, user} for the WebRTC voice agent */
  signedUrl: "/elevenlabs/signed-url/",
} as const;

export const VOICE = {
  /** POST -> create an order through the AI voice agent */
  order: "/orders/voice-order/",
  /** GET -> status of the in-flight voice order */
  status: "/orders/voice-status/",
} as const;

export const RIDER = {
  /** GET -> { assigned: Order[] } for the logged-in rider */
  jobs: "/orders/rider-jobs/",
  accept: (id: string | number) => `/orders/${id}/status/`,
  reject: (id: string | number) => `/orders/${id}/reject/`,
  location: (id: string | number) => `/orders/${id}/rider-location/`,
  /**
   * Rider endpoints: the master guide says NO `/auth/` prefix, the v2.4 system
   * guide shows `/api/auth/rider/...`. UNCONFIRMED — callers try the plain path
   * first and fall back to the `/auth/` twin on 404.
   */
  earnings: "/rider/earnings/",
  earningsAlt: "/auth/rider/earnings/",
  profile: "/rider/profile/",
  profileAlt: "/auth/rider/profile/",
  dutyStatus: "/rider/duty-status/",
  dutyStatusAlt: "/auth/rider/duty-status/",
  locationShare: "/rider/location-share/",
  locationShareAlt: "/auth/rider/location-share/",
} as const;
