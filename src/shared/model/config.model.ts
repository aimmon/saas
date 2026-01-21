import { eq } from "drizzle-orm"
import { db } from "@/db"
import { config } from "@/db/config.schema"

export async function getConfigByName(name: string) {
  const [result] = await db.select().from(config).where(eq(config.name, name)).limit(1)
  return result?.value ?? null
}

export async function getConfigs() {
  const results = await db.select().from(config)
  return Object.fromEntries(results.map((r) => [r.name, r.value]))
}

export async function setConfig(name: string, value: unknown) {
  await db
    .insert(config)
    .values({ name, value })
    .onConflictDoUpdate({
      target: config.name,
      set: { value },
    })
}

export async function deleteConfig(name: string) {
  await db.delete(config).where(eq(config.name, name))
}
