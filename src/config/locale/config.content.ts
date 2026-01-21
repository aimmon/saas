import { type Dictionary, t } from "intlayer"

export default {
  key: "admin-config",
  content: {
    mail_provider: {
      label: t({ zh: "邮件服务商", en: "Mail Provider" }),
      description: t({ zh: "用于发送邮件的服务", en: "Service for sending emails" }),
    },
    mail_provider_resend: {
      label: t({ zh: "Resend", en: "Resend" }),
    },
    mail_provider_custom: {
      label: t({ zh: "自定义 SMTP", en: "Custom SMTP" }),
    },
    mail_from: {
      label: t({ zh: "发件邮箱", en: "From Email" }),
      description: t({
        zh: "用于发送邮件的邮箱 (VibeAny <noreply@auth.vibeany.dev>)",
        en: "Email for sending emails",
      }),
    },
    resend_api_key: {
      label: t({ zh: "Resend API Key", en: "Resend API Key" }),
      description: t({
        zh: "用于发送邮件的 API Key (https://resend.com/api-keys)",
        en: "API Key for sending emails (https://resend.com/api-keys)",
      }),
    },
    groups: {
      mail: {
        title: t({ zh: "邮件设置", en: "Mail Settings" }),
        description: t({ zh: "邮件服务配置", en: "Mail service configuration" }),
      },
    },
  },
} satisfies Dictionary
