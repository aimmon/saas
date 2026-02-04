import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"
import AdminSidebar from "@/shared/components/sidebar/admin-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/shared/components/ui/sidebar"
import { isAuthEnabled } from "@/shared/lib/auth/auth-config"
import { pageAdminMiddleware } from "@/shared/middleware/auth.middleware"

export const Route = createFileRoute("/{-$locale}/_main/admin")({
  component: RouteComponent,
  ssr: false,
  server: {
    middleware: [pageAdminMiddleware],
  },
  beforeLoad: async () => {
    if (!isAuthEnabled) {
      throw redirect({
        to: "/{-$locale}/404",
      })
    }
  },
})

function RouteComponent() {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <main
        className="flex min-h-dvh min-w-0 flex-1 flex-col"
        style={{ fontFamily: "Inter Variable" }}
      >
        <div className="flex items-center border-b p-2 md:hidden">
          <SidebarTrigger />
        </div>
        <div className="flex-1 space-y-6 p-4 sm:p-6">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  )
}
