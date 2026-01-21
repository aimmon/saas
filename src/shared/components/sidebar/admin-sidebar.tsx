import { useRouterState } from "@tanstack/react-router"
import { Cog, Users } from "lucide-react"
import { useIntlayer } from "react-intlayer"
import { LocalizedLink, type To } from "@/shared/components/locale/localized-link"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/shared/components/ui/sidebar"

export default function AdminSidebar() {
  const content = useIntlayer("admin")
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname

  const navItems: { title: string; url: To; icon: typeof Users; match: string }[] = [
    {
      title: String(content.sidebar.users.value),
      url: "/admin/users",
      icon: Users,
      match: "/admin/users",
    },
    {
      title: String(content.sidebar.config.value),
      url: "/admin/config",
      icon: Cog,
      match: "/admin/config",
    },
  ]

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <LocalizedLink to="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Cog className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{content.title}</span>
                </div>
              </LocalizedLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = currentPath.includes(item.match)
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                      <LocalizedLink to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </LocalizedLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  )
}
