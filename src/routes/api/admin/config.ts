import { createFileRoute } from "@tanstack/react-router"
import { configResolver, configSchema } from "@/config/schema"
import { adminMiddleware } from "@/shared/middleware/auth"
import { getConfigs, setConfig } from "@/shared/model/config.model"

export const Route = createFileRoute("/api/admin/config")({
  server: {
    middleware: [adminMiddleware],
    handlers: {
      GET: async () => {
        const dbConfigs = await getConfigs()
        const values = configResolver.resolveAllConfigs(dbConfigs)
        const metas = configResolver.getConfigMetas(values)
        return Response.json(metas)
      },

      PUT: async ({ request }) => {
        const body = await request.json()
        const { key, value } = body as { key: string; value: unknown }

        if (!key || !(key in configSchema)) {
          return Response.json({ error: "Invalid config key" }, { status: 400 })
        }

        if (configResolver.isConfigLocked(key as keyof typeof configSchema)) {
          return Response.json({ error: "Config is locked by environment variable" }, { status: 400 })
        }

        const validation = configResolver.validateConfig(key as keyof typeof configSchema, value)
        if (!validation.success) {
          return Response.json({ error: validation.error }, { status: 400 })
        }

        await setConfig(key, value)
        return Response.json({ success: true })
      },
    },
  },
})
