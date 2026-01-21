import { eq, inArray } from "drizzle-orm"
import { db, role, rolePermission, userRole } from "@/db"

export async function getUserRolesByUserId(userId: string) {
  const roles = await db
    .select({
      role: role,
      userRole: userRole,
    })
    .from(userRole)
    .innerJoin(role, eq(userRole.roleId, role.id))
    .where(
      eq(userRole.userId, userId),
    )

  return roles
    .filter((r) => !r.userRole.expiresAt || r.userRole.expiresAt > new Date())
    .map((r) => r.role)
}

export async function getUserPermissionRules(userId: string) {
  const roles = await getUserRolesByUserId(userId)
  if (roles.length === 0) return []

  const roleIds = roles.map((r) => r.id)

  const permissions = await db
    .select()
    .from(rolePermission)
    .where(inArray(rolePermission.roleId, roleIds))

  return permissions.map((p) => ({
    permissionCode: p.permissionCode,
    inverted: p.inverted,
    conditions: p.conditions ?? undefined,
  }))
}

export async function isUserAdmin(userId: string): Promise<boolean> {
  const roles = await getUserRolesByUserId(userId)
  return roles.some((r) => r.name === "super_admin" || r.name === "admin")
}
