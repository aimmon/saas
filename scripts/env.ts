let viteEnv: Record<string, string> | null = null
try {
  if (import.meta.env) viteEnv = import.meta.env
} catch {}

if (!viteEnv) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const dotenv = require("dotenv")
  dotenv.config({ path: ".env.local" })
  dotenv.config({ path: ".env.development" })
  dotenv.config({ path: ".env" })
}

const devDefaults: Record<string, string> = {
  VITE_APP_URL: "http://localhost:3377",
  VITE_CURRENCY: "USD",
}

function getEnv(key: string): string | undefined {
  return viteEnv?.[key] ?? process.env[key] ?? devDefaults[key]
}

export const env = {
  get DATABASE_URL() {
    return getEnv("DATABASE_URL")
  },
  get BETTER_AUTH_SECRET() {
    return getEnv("BETTER_AUTH_SECRET")
  },
  get BETTER_AUTH_URL() {
    return getEnv("VITE_APP_URL")
  },
} as const
