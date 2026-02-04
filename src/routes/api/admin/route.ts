import { createFileRoute } from "@tanstack/react-router"
import { apiAdminMiddleware } from "@/shared/middleware/auth.middleware"

export const Route = createFileRoute("/api/admin")({
  server: {
    middleware: [apiAdminMiddleware],
  },
})
