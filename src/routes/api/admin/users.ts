import { createFileRoute } from "@tanstack/react-router"
import { count, desc } from "drizzle-orm"
import { db, user } from "@/db"
import { Resp } from "@/shared/lib/tools/response"
import { getConfig } from "@/shared/model/config.model"
import { getUserCreditBalance } from "@/shared/model/credit.model"
import { getUserRolesWithExpiry } from "@/shared/model/rabc.model"
import { findActiveSubscriptionByUserId } from "@/shared/model/subscription.model"
import type { AdminUserListItem } from "@/shared/types/admin"

export const Route = createFileRoute("/api/admin/users")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const url = new URL(request.url)
          const page = Math.max(1, Number(url.searchParams.get("page")) || 1)
          const pageSize = Math.min(
            100,
            Math.max(1, Number(url.searchParams.get("pageSize")) || 10)
          )
          const offset = (page - 1) * pageSize

          const creditEnabled = await getConfig("public_credit_enable")

          const [[{ total }], users] = await Promise.all([
            db.select({ total: count() }).from(user),
            db
              .select({
                id: user.id,
                name: user.name,
                email: user.email,
                emailVerified: user.emailVerified,
                image: user.image,
                createdAt: user.createdAt,
                banned: user.banned,
                bannedAt: user.bannedAt,
              })
              .from(user)
              .orderBy(desc(user.createdAt))
              .limit(pageSize)
              .offset(offset),
          ])

          const enrichedUsers: AdminUserListItem[] = await Promise.all(
            users.map(async (u) => {
              const [roles, subscription, creditBalance] = await Promise.all([
                getUserRolesWithExpiry(u.id),
                findActiveSubscriptionByUserId(u.id),
                creditEnabled ? getUserCreditBalance(u.id) : Promise.resolve(0),
              ])

              return {
                ...u,
                banned: u.banned ?? false,
                bannedAt: u.bannedAt,
                roles,
                subscription: subscription
                  ? {
                      planId: subscription.planId,
                      planName: subscription.planId,
                      status: subscription.status,
                    }
                  : null,
                creditBalance,
              }
            })
          )

          return Resp.success({
            items: enrichedUsers,
            pagination: {
              page,
              pageSize,
              total,
              totalPages: Math.ceil(total / pageSize),
            },
          })
        } catch (error) {
          console.error("Failed to fetch users:", error)
          return Resp.error("Failed to fetch users")
        }
      },
    },
  },
})
