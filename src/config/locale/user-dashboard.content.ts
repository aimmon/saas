import { type Dictionary, t } from "intlayer"

export default {
  key: "user-dashboard",
  content: {
    menu: {
      settings: t({ en: "Settings", zh: "设置" }),
      account: t({ en: "Account", zh: "账户" }),
      usage: t({ en: "Usage", zh: "使用情况" }),
      topUp: t({ en: "Top Up", zh: "充值" }),
    },
    credits: {
      title: t({ en: "Credits", zh: "积分" }),
      balance: t({ en: "Current Balance", zh: "当前余额" }),
      upgrade: t({ en: "Upgrade", zh: "升级" }),
      totalCredits: t({ en: "Total Credits", zh: "总积分" }),
      purchasedCredits: t({
        en: "Purchased/Granted Credits (excl. daily bonus)",
        zh: "购买积分/赠送积分（不包含每日赠送）",
      }),
      dailyBonus: t({ en: "Daily Bonus Credits", zh: "每日赠送积分" }),
      dailyRefreshAt: t({
        en: "Next refresh: {time}",
        zh: "下次刷新：{time}",
      }),
      dailyAmount: t({
        en: "{amount} credits every 24 hours",
        zh: "每 24 小时赠送 {amount} 积分",
      }),
    },
    packages: {
      title: t({ en: "Credit Packages", zh: "积分包" }),
      credits: t({ en: "credits", zh: "积分" }),
      validFor: t({ en: "Valid for {days} days", zh: "有效期 {days} 天" }),
      neverExpires: t({ en: "Never expires", zh: "永不过期" }),
      buy: t({ en: "Buy Now", zh: "立即购买" }),
      processing: t({ en: "Processing...", zh: "处理中..." }),
      empty: t({ en: "No credit packages available", zh: "暂无可用积分包" }),
      emptyDesc: t({ en: "Please check back later", zh: "请稍后再试" }),
    },
    insufficientCredits: {
      title: t({ en: "Insufficient Credits", zh: "积分不足" }),
      description: t({
        en: "You need {required} credits but only have {current}. Purchase more credits to continue.",
        zh: "您需要 {required} 积分，但只有 {current} 积分。请购买更多积分以继续。",
      }),
      currentBalance: t({
        en: "Current balance: {credits} credits",
        zh: "当前余额：{credits} 积分",
      }),
      recommended: t({ en: "Recommended", zh: "推荐" }),
      cancel: t({ en: "Cancel", zh: "取消" }),
    },
    history: {
      title: t({ en: "Usage", zh: "使用情况" }),
      description: t({
        en: "View your credit transaction history",
        zh: "查看您的积分变动历史",
      }),
      empty: t({ en: "No credit records", zh: "暂无积分记录" }),
      time: t({ en: "Time", zh: "时间" }),
      type: t({ en: "Type", zh: "类型" }),
      change: t({ en: "Change", zh: "积分变动" }),
      totalRecords: t({ en: "{count} records", zh: "共 {count} 条记录" }),
    },
    creditTypes: {
      add_first_registration: t({ en: "Registration Bonus", zh: "注册赠送" }),
      add_subscription_payment: t({ en: "Subscription", zh: "订阅购买" }),
      add_one_time_payment: t({ en: "Purchase", zh: "充值购买" }),
      add_daily_bonus: t({ en: "Daily Bonus", zh: "每日赠送" }),
      add_admin: t({ en: "Admin Grant", zh: "管理员赠送" }),
      add_refund: t({ en: "Refund", zh: "退款返还" }),
      deduct_ai_use: t({ en: "AI Usage", zh: "AI 使用" }),
      ai_text: t({ en: "AI Text", zh: "AI 文本" }),
      ai_image: t({ en: "AI Image", zh: "AI 图片" }),
      ai_speech: t({ en: "AI Speech", zh: "AI 语音" }),
      ai_video: t({ en: "AI Video", zh: "AI 视频" }),
      deduct_expired: t({ en: "Expired", zh: "积分过期" }),
    },
  },
} satisfies Dictionary
