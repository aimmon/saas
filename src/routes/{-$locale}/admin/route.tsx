import { createFileRoute, Outlet } from "@tanstack/react-router"
import AdminSidebar from "@/shared/components/sidebar/admin-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/shared/components/ui/sidebar"
import { adminMiddleware, authMiddleware } from "@/shared/middleware/auth"

export const Route = createFileRoute("/{-$locale}/admin")({
  component: RouteComponent,
  ssr: false,
  server: {
    middleware: [authMiddleware, adminMiddleware],
  },
})

function RouteComponent() {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <main
        className="flex min-h-dvh flex-1 flex-col"
        style={{ fontFamily: "Inter Variable" }}
      >
        <SidebarTrigger />
        <Outlet />
      </main>
    </SidebarProvider>
  )
}
