import { createFileRoute } from "@tanstack/react-router"
import { isAuthConfigured } from "@/shared/lib/auth/auth-config"
import { auth } from "@/shared/lib/auth/auth-server"

const notConfiguredResponse = () =>
  new Response(JSON.stringify({ error: "Authentication is not configured" }), {
    status: 503,
    headers: { "Content-Type": "application/json" },
  })

export const Route = createFileRoute("/api/auth/$")({
  server: {
    handlers: {
      GET: async ({ request }: { request: Request }) => {
        if (!isAuthConfigured || !auth) return notConfiguredResponse()
        return await auth.handler(request)
      },
      POST: async ({ request }: { request: Request }) => {
        if (!isAuthConfigured || !auth) return notConfiguredResponse()
        return await auth.handler(request)
      },
    },
  },
})
