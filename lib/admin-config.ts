// NOTE: admin credentials are managed by Supabase. This file is deprecated
// and kept only for backwards compatibility. It no longer provides default
// credentials — if values are required, they must be set via environment
// variables. Prefer using Supabase auth helpers instead of these values.

export const ADMIN_USERNAME = process.env.ADMIN_USERNAME ?? undefined
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? undefined
export const ADMIN_COOKIE_NAME = process.env.ADMIN_COOKIE_NAME ?? undefined
// Session lifetime in seconds (optional)
export const ADMIN_COOKIE_MAX_AGE = process.env.ADMIN_COOKIE_MAX_AGE ? Number(process.env.ADMIN_COOKIE_MAX_AGE) : undefined
