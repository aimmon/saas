import { createServerFn } from "@tanstack/react-start"

// 服务端同步检查（给 middleware、auth-server 等纯服务端代码使用）
export const isAuthConfigured = !!process.env.BETTER_AUTH_SECRET && !!process.env.DATABASE_URL

// Server function: 通过 loader 传递给客户端
export const getIsAuthEnabled = createServerFn({ method: "GET" }).handler(() => {
  return isAuthConfigured
})
