const COOKIE_NAME = "INTLAYER_LOCALE"
const MAX_AGE = 365 * 24 * 60 * 60

export function setLocaleCookie(locale: string) {
  const cookieString = `${COOKIE_NAME}=${locale}; path=/; max-age=${MAX_AGE}; SameSite=Lax`
  // biome-ignore lint: cookie assignment is intentional
  document.cookie = cookieString
}
