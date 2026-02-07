import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres"
import type { Pool } from "pg"

export * from "./auth.schema"
export * from "./config.schema"
export * from "./credit.schema"
export * from "./order.schema"
export * from "./payment.schema"
export * from "./rbac.schema"
export * from "./subscription.schema"
export * from "./waitlist.schema"

import * as authSchema from "./auth.schema"
import * as configSchema from "./config.schema"
import * as creditSchema from "./credit.schema"
import * as orderSchema from "./order.schema"
import * as paymentSchema from "./payment.schema"
import * as rbacSchema from "./rbac.schema"
import * as subscriptionSchema from "./subscription.schema"
import * as waitlistSchema from "./waitlist.schema"

const schema = {
  ...authSchema,
  ...configSchema,
  ...creditSchema,
  ...orderSchema,
  ...subscriptionSchema,
  ...paymentSchema,
  ...rbacSchema,
  ...waitlistSchema,
}

export type DbSchema = typeof schema
export type Database = NodePgDatabase<DbSchema>
export type DbTransaction = Parameters<Parameters<Database["transaction"]>[0]>[0]

let _db: Database | null = null

export const isDatabaseEnabled = !!process.env.DATABASE_URL

export function getDb(): Database | null {
  if (!isDatabaseEnabled) {
    return null
  }
  if (!_db) {
    _db = drizzle(process.env.DATABASE_URL!, { schema })
  }
  return _db
}

export function requireDb(): Database {
  const database = getDb()
  if (!database) {
    throw new Error("Database is not configured. Please set DATABASE_URL environment variable.")
  }
  return database
}

export async function closeDb(): Promise<void> {
  if (_db) {
    const client = (_db as unknown as { $client: Pool }).$client
    await client.end()
    _db = null
  }
}

export const db = new Proxy({} as Database, {
  get(_, prop) {
    return requireDb()[prop as keyof Database]
  },
})
