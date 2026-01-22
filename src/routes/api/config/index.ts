import { createFileRoute } from "@tanstack/react-router"
import { configResolver } from "@/config/schema"
import { Resp } from "@/shared/lib/tools/response"
import { getConfigs } from "@/shared/model/config.model"

export const Route = createFileRoute("/api/config/")({
  server: {
    handlers: {
      GET: async () => {
        const dbConfigs = await getConfigs()
        const values = configResolver.resolveAllConfigs(dbConfigs)
        const publicConfigs = configResolver.filterPublicConfigs(values)
        return Resp.success(publicConfigs)
      },
    },
  },
})
