import { z } from "zod"
import { createConfigResolver, defineConfig, defineGroup } from "@/shared/lib/config/helper"

export const configSchema = defineConfig({
  payment_provider: {
    type: "select",
    default: "stripe",
    env: "PAYMENT_PROVIDER",
    labelKey: "paymentProvider",
    descriptionKey: "paymentProvider",
    options: [{ value: "stripe" }, { value: "creem" }],
  },
  payment_stripe_secret_key: {
    type: "string",
    default: "",
    env: "STRIPE_SECRET_KEY",
    labelKey: "paymentStripeSecretKey",
    descriptionKey: "paymentStripeSecretKey",
  },
  payment_stripe_webhook_secret: {
    type: "string",
    default: "",
    env: "STRIPE_WEBHOOK_SECRET",
    labelKey: "paymentStripeWebhookSecret",
    descriptionKey: "paymentStripeWebhookSecret",
  },
  payment_creem_x_api_key: {
    type: "string",
    default: "",
    env: "CREEM_X_API_KEY",
    labelKey: "paymentCreemXApiKey",
    descriptionKey: "paymentCreemXApiKey",
  },
  payment_creem_test_mode: {
    type: "boolean",
    default: true,
    env: "CREEM_TEST_MODE",
    labelKey: "paymentCreemTestMode",
    descriptionKey: "paymentCreemTestMode",
  },
  payment_creem_webhook_secret: {
    type: "string",
    default: "",
    env: "CREEM_WEBHOOK_SECRET",
    labelKey: "paymentCreemWebhookSecret",
    descriptionKey: "paymentCreemWebhookSecret",
  },
  // mail
  mail_provider: {
    type: "select",
    default: "resend",
    env: "EMAIL_PROVIDER",
    labelKey: "mailProvider",
    descriptionKey: "mailProvider",
    options: [{ value: "resend" }, { value: "custom" }],
    validation: z.enum(["resend", "custom"]),
  },
  mail_from: {
    type: "string",
    default: "",
    env: "EMAIL_FROM",
    labelKey: "mailFrom",
    descriptionKey: "mailFrom",
  },
  mail_resend_api_key: {
    type: "string",
    default: "",
    env: "RESEND_API_KEY",
    labelKey: "resendApiKey",
    descriptionKey: "resendApiKey",
  },
})

export const configGroups = [
  defineGroup({
    id: "mail",
    labelKey: "mail",
    prefixes: ["mail_"],
  }),
  defineGroup({
    id: "payment",
    labelKey: "payment",
    prefixes: ["payment_"],
  }),
]

export const configResolver = createConfigResolver(configSchema)

export type ConfigValues = ReturnType<typeof configResolver.resolveAllConfigs>
