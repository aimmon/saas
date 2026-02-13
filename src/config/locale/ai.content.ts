import { type Dictionary, t } from "intlayer"

const aiContent = {
  key: "ai",
  content: {
    chat: {
      emptyTitle: t({ en: "Start a conversation", zh: "开始对话" }),
      emptyDescription: t({
        en: "Type a message below to start the conversation.",
        zh: "在下方输入消息开始对话。",
      }),
      placeholder: t({ en: "What would you like to know?", zh: "你想了解什么？" }),
    },
    modelPicker: {
      selectModel: t({ en: "Select Model", zh: "选择模型" }),
      searchPlaceholder: t({ en: "Search models...", zh: "搜索模型…" }),
      searchResults: t({ en: "Search Results", zh: "搜索结果" }),
      modelsCount: t({ en: "models", zh: "个模型" }),
      noModelsFound: t({ en: "No models found.", zh: "未找到模型。" }),
    },
  },
} satisfies Dictionary

export default aiContent
