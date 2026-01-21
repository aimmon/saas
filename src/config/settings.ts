import { getConfigs } from "@/shared/model/config.model"

export const envConfigs = {
  app_url: "http://localhost:3377",
  app_name: "VibeAny",
  app_logo: "/logo.svg",

  blog_initial_load_size: 12,
  blog_related_posts_size: 3,

  payment_enabled: true,
  payment_provider: "stripe",

  credit_enabled: false,
  credit_allow_free_user_purchase: false,
  credit_signup_bonus_enabled: false,
  credit_signup_bonus_amount: 0,
  credit_signup_bonus_expire_days: 0,

  newsletter_auto_subscribe: true,
} as const

export type ConfigKey = keyof typeof envConfigs
export type ConfigValue<K extends ConfigKey> = (typeof envConfigs)[K]

function getEnvValue(key: string): string | undefined {
  if (typeof import.meta.env !== "undefined") {
    return import.meta.env[key] ?? import.meta.env[key.toUpperCase()]
  }
  return process.env[key] ?? process.env[key.toUpperCase()]
}

function parseValue<T>(value: string | undefined, defaultValue: T): T {
  if (value === undefined) return defaultValue

  if (typeof defaultValue === "boolean") {
    return (value === "true" || value === "1") as T
  }
  if (typeof defaultValue === "number") {
    const num = Number(value)
    return (Number.isNaN(num) ? defaultValue : num) as T
  }
  return value as T
}

export async function getAllConfigs(): Promise<typeof envConfigs> {
  const dbConfigs = await getConfigs()
  const result: Record<string, unknown> = { ...envConfigs }

  for (const key of Object.keys(envConfigs)) {
    if (key in dbConfigs) {
      result[key] = dbConfigs[key]
    }
  }

  for (const key of Object.keys(envConfigs) as ConfigKey[]) {
    const envValue = getEnvValue(key) ?? getEnvValue(key.toUpperCase())
    if (envValue !== undefined) {
      result[key] = parseValue(envValue, envConfigs[key])
    }
  }

  return result as typeof envConfigs
}

export async function getConfig<K extends ConfigKey>(key: K): Promise<ConfigValue<K>> {
  const configs = await getAllConfigs()
  return configs[key]
}
