import { eq } from "drizzle-orm"
import { db } from "@/db"
import { waitlist } from "@/db/waitlist.schema"

export async function getWaitlistByEmail(email: string) {
  const [result] = await db.select().from(waitlist).where(eq(waitlist.email, email)).limit(1)
  return result ?? null
}

export async function insertWaitlistEntry(data: { email: string; locale?: string }) {
  const [result] = await db
    .insert(waitlist)
    .values(data)
    .onConflictDoNothing({ target: waitlist.email })
    .returning()
  return result ?? null
}
