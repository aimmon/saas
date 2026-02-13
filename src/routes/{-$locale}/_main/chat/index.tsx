import { createFileRoute } from "@tanstack/react-router"
import { ChatPanel } from "@/shared/components/chat"

export const Route = createFileRoute("/{-$locale}/_main/chat/")({
  component: RouteComponent,
  ssr: false,
})

function RouteComponent() {
  return (
    <div className="flex flex-col size-full min-h-[calc(100vh-4rem)] p-4">
      <ChatPanel className="flex-1 min-h-0" />
    </div>
  )
}
