// Admin credentials and cookie config
export const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin'
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'password'
export const ADMIN_COOKIE_NAME = process.env.ADMIN_COOKIE_NAME || 'admin_session'
// Session lifetime in seconds (default 7 days)
export const ADMIN_COOKIE_MAX_AGE = Number(process.env.ADMIN_COOKIE_MAX_AGE || 60 * 60 * 24 * 7)
