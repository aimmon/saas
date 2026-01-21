import { z } from "zod"
import { createConfigResolver, defineConfig, defineGroup } from "@/shared/lib/config/helper"

export const configSchema = defineConfig({
  mail_provider: {
    type: "select",
    default: "resend",
    env: "EMAIL_PROVIDER",
    labelKey: "mail_provider",
    descriptionKey: "mail_provider",
    options: [
      { value: "resend", labelKey: "mail_provider_resend" },
      { value: "custom", labelKey: "mail_provider_custom" },
    ],
    validation: z.enum(["resend", "custom"]),
  },
  mail_from: {
    type: "string",
    default: "",
    env: "EMAIL_FROM",
    labelKey: "mail_from",
    descriptionKey: "mail_from",
  },
  mail_resend_api_key: {
    type: "string",
    default: "",
    env: "RESEND_API_KEY",
    labelKey: "resend_api_key",
    descriptionKey: "resend_api_key",
  },
})

export const configGroups = [
  defineGroup({
    id: "mail",
    labelKey: "mail",
    prefixes: ["mail_"],
  }),
]

export const configResolver = createConfigResolver(configSchema)

export type ConfigValues = ReturnType<typeof configResolver.resolveAllConfigs>
