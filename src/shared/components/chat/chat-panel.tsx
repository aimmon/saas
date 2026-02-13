import { MessageSquareIcon } from "lucide-react"
import { nanoid } from "nanoid"
import { useCallback, useState } from "react"
import { useIntlayer } from "react-intlayer"
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/shared/components/ai-elements/conversation"
import { Message, MessageContent, MessageResponse } from "@/shared/components/ai-elements/message"
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  type PromptInputMessage,
  PromptInputProvider,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/shared/components/ai-elements/prompt-input"
import { ModelPicker } from "@/shared/components/chat/model-picker"
import { cn } from "@/shared/lib/utils"

export type ChatMessage = {
  id: string
  role: "user" | "assistant"
  content: string
}

export type ChatPanelProps = {
  className?: string
}

const DEFAULT_MODEL = "openai/gpt-4o-mini"

export function ChatPanel({ className }: ChatPanelProps) {
  const { chat } = useIntlayer("ai")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [status, setStatus] = useState<"ready" | "submitted" | "streaming">("ready")
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL)

  const handleSubmit = useCallback(
    async (message: PromptInputMessage, _event: React.FormEvent<HTMLFormElement>) => {
      const hasText = Boolean(message.text?.trim())
      const hasFiles = Boolean(message.files?.length)
      if (!hasText && !hasFiles) return

      const userMessage: ChatMessage = {
        id: nanoid(),
        role: "user",
        content: message.text || (hasFiles ? `[${message.files!.length} file(s) attached]` : ""),
      }
      setMessages((prev) => [...prev, userMessage])
      setStatus("submitted")

      await new Promise((r) => setTimeout(r, 300))
      setStatus("streaming")

      const assistantMessage: ChatMessage = {
        id: nanoid(),
        role: "assistant",
        content: `You said: "${userMessage.content}"`,
      }
      setMessages((prev) => [...prev, assistantMessage])
      setStatus("ready")
    },
    []
  )

  return (
    <div
      className={cn("flex flex-col size-full min-h-0 rounded-lg border bg-background", className)}
    >
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <Conversation className="relative size-full">
          <ConversationContent>
            {messages.length === 0 ? (
              <ConversationEmptyState
                description={chat.emptyDescription.value}
                icon={<MessageSquareIcon className="size-6" />}
                title={chat.emptyTitle.value}
              />
            ) : (
              messages.map((msg) => (
                <Message
                  from={msg.role}
                  key={msg.id}
                >
                  <MessageContent>
                    <MessageResponse>{msg.content}</MessageResponse>
                  </MessageContent>
                </Message>
              ))
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
      </div>

      <div className="shrink-0 border-t p-4">
        <PromptInputProvider>
          <PromptInput onSubmit={handleSubmit}>
            <PromptInputBody>
              <PromptInputTextarea placeholder={chat.placeholder.value} />
            </PromptInputBody>
            <PromptInputFooter>
              <PromptInputTools>
                <ModelPicker
                  selectedModel={selectedModel}
                  onModelSelect={setSelectedModel}
                />
              </PromptInputTools>
              <PromptInputSubmit status={status} />
            </PromptInputFooter>
          </PromptInput>
        </PromptInputProvider>
      </div>
    </div>
  )
}
