import { pgTable, text, timestamp } from "drizzle-orm/pg-core"

export const waitlist = pgTable("waitlist", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  email: text("email").notNull().unique(),
  locale: text("locale").notNull().default("en"),
  createdAt: timestamp("created_at")
    .notNull()
    .$defaultFn(() => new Date()),
})
