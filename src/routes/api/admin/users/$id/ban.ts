import { createFileRoute } from "@tanstack/react-router"
import { eq } from "drizzle-orm"
import { db, user } from "@/db"
import { Resp } from "@/shared/lib/tools/response"

export const Route = createFileRoute("/api/admin/users/$id/ban")({
  server: {
    handlers: {
      POST: async ({ params }) => {
        try {
          const { id } = params

          await db
            .update(user)
            .set({
              banned: true,
              bannedAt: new Date(),
            })
            .where(eq(user.id, id))

          return Resp.success({ banned: true })
        } catch (error) {
          console.error("Failed to ban user:", error)
          return Resp.error("Failed to ban user")
        }
      },
      DELETE: async ({ params }) => {
        try {
          const { id } = params

          await db
            .update(user)
            .set({
              banned: false,
              bannedAt: null,
            })
            .where(eq(user.id, id))

          return Resp.success({ banned: false })
        } catch (error) {
          console.error("Failed to unban user:", error)
          return Resp.error("Failed to unban user")
        }
      },
    },
  },
})
