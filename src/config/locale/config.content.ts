import { type Dictionary, t } from "intlayer"

export default {
  key: "admin-config",
  content: {
    mailProvider: {
      label: t({ zh: "邮件服务商", en: "Mail Provider" }),
      description: t({ zh: "用于发送邮件的服务", en: "Service for sending emails" }),
    },
    mailProviderResend: {
      label: t({ zh: "Resend", en: "Resend" }),
    },
    mailProviderCustom: {
      label: t({ zh: "自定义 SMTP", en: "Custom SMTP" }),
    },
    mailFrom: {
      label: t({ zh: "发件邮箱", en: "From Email" }),
      description: t({
        zh: "用于发送邮件的邮箱 (VibeAny <noreply@auth.vibeany.dev>)",
        en: "Email for sending emails",
      }),
    },
    resendApiKey: {
      label: t({ zh: "Resend API Key", en: "Resend API Key" }),
      description: t({
        zh: "用于发送邮件的 API Key (https://resend.com/api-keys)",
        en: "API Key for sending emails (https://resend.com/api-keys)",
      }),
    },
    paymentProvider: {
      label: t({ zh: "支付服务商", en: "Payment Provider" }),
      description: t({ zh: "用于支付的服务", en: "Service for payment" }),
    },
    paymentProviderStripe: {
      label: t({ zh: "Stripe", en: "Stripe" }),
    },
    paymentProviderCreem: {
      label: t({ zh: "Creem", en: "Creem" }),
    },
    paymentStripeSecretKey: {
      label: t({ zh: "Stripe Secret Key", en: "Stripe Secret Key" }),
      description: t({ zh: "用于支付的 Secret Key", en: "Secret Key for payment" }),
    },
    paymentStripeWebhookSecret: {
      label: t({ zh: "Stripe Webhook Secret", en: "Stripe Webhook Secret" }),
      description: t({ zh: "用于支付的 Webhook Secret", en: "Webhook Secret for payment" }),
    },
    paymentCreemXApiKey: {
      label: t({ zh: "Creem X API Key", en: "Creem X API Key" }),
      description: t({ zh: "用于支付的 X API Key", en: "X API Key for payment" }),
    },
    paymentCreemTestMode: {
      label: t({ zh: "Creem Test Mode", en: "Creem Test Mode" }),
      description: t({ zh: "用于支付的测试模式", en: "Test mode for payment" }),
    },
    paymentCreemWebhookSecret: {
      label: t({ zh: "Creem Webhook Secret", en: "Creem Webhook Secret" }),
      description: t({ zh: "用于支付的 Webhook Secret", en: "Webhook Secret for payment" }),
    },
    groups: {
      mail: {
        title: t({ zh: "邮件设置", en: "Mail Settings" }),
        description: t({ zh: "邮件服务配置", en: "Mail service configuration" }),
      },
      payment: {
        title: t({ zh: "支付设置", en: "Payment Settings" }),
        description: t({ zh: "支付服务配置", en: "Payment service configuration" }),
      },
    },
  },
} satisfies Dictionary
