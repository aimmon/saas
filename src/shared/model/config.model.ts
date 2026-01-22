import { eq } from "drizzle-orm"
import { LRUCache } from "lru-cache"
import { type ConfigValues, configResolver, type PublicConfig } from "@/config/schema"
import { db } from "@/db"
import { config } from "@/db/config.schema"

const cache = new LRUCache<string, ConfigValues>({
  max: 1,
  ttl: 1000 * 60 * 60, // 1 hour
})

export async function getConfigByName(name: string) {
  const [result] = await db.select().from(config).where(eq(config.name, name)).limit(1)
  return result?.value ?? null
}

export async function getConfigs() {
  const results = await db.select().from(config)
  return Object.fromEntries(results.map((r) => [r.name, r.value]))
}

export async function getAllConfigs(): Promise<ConfigValues> {
  const cached = cache.get("config")
  if (cached) return cached

  const dbConfigs = await getConfigs()
  const configs = configResolver.resolveAllConfigs(dbConfigs)
  cache.set("config", configs)
  return configs
}

export async function getConfig<K extends keyof ConfigValues>(key: K): Promise<ConfigValues[K]> {
  const configs = await getAllConfigs()
  return configs[key]
}

export async function getPublicConfigs(): Promise<PublicConfig> {
  const configs = await getAllConfigs()
  return configResolver.filterPublicConfigs(configs) as PublicConfig
}

export function invalidateConfigCache() {
  cache.delete("config")
}

export async function setConfig(name: string, value: unknown) {
  await db.insert(config).values({ name, value }).onConflictDoUpdate({
    target: config.name,
    set: { value },
  })
  invalidateConfigCache()
}

export async function deleteConfig(name: string) {
  await db.delete(config).where(eq(config.name, name))
  invalidateConfigCache()
}
