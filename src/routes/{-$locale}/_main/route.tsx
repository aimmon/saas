import { createFileRoute, Outlet } from "@tanstack/react-router"
import { GlobalContextProvider } from "@/shared/context/global.context"
import { isAuthEnabled } from "@/shared/lib/auth/auth-config"

export const Route = createFileRoute("/{-$locale}/_main")({
  component: RouteComponent,
  loader: () => ({
    isAuthEnabled,
  }),
})

function RouteComponent() {
  return (
    <GlobalContextProvider>
      <Outlet />
    </GlobalContextProvider>
  )
}
