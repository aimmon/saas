import { jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core"

export const config = pgTable("config", {
  name: text("name").primaryKey(),
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
})
