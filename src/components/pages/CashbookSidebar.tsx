import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  LayoutDashboard,
  LogOut,
  Wallet,
  Receipt,
  Tags,
  Contact,
  Users,
  Settings,
  ArrowLeftRight,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { useAuthStore } from "@/Store/AuthStore";
import CashbookMark from "@/components/CashbookMark";
import { NavLink } from "./NavLink";

const navigationGroups = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
      { title: "Transactions", url: "/transactions", icon: Receipt },
      { title: "Cashbooks", url: "/cashbooks", icon: Wallet },
    ],
  },
  {
    label: "Management",
    items: [
      { title: "Categories", url: "/categories", icon: Tags },
      { title: "Contacts", url: "/contacts", icon: Contact },
      {
        title: "Business Members",
        url: "/business-members",
        icon: Users,
      },
      { title: "Reports", url: "/reports", icon: BarChart3 },
    ],
  },
  {
    label: "System",
    items: [
      { title: "Settings", url: "/settings", icon: Settings },
    ],
  },
];

export default function CashbookSidebar() {
  const navigate = useNavigate();
  const { state, isMobile, setOpenMobile } = useSidebar();
  const collapsed = state === "collapsed";

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        {/* Logo */}
        <div className={`border-b border-sidebar-border p-4 ${
          collapsed ? "px-2" : ""
        }`}>
          <div className="flex items-center gap-3">
            <CashbookMark className="h-10 w-10 rounded-xl" iconClassName="h-5 w-5" />

            {!collapsed && (
              <div>
                <h1 className="text-lg font-bold text-sidebar-foreground">
                  Cashbook
                </h1>
                <p className="text-xs text-sidebar-foreground/60">
                  Financial Management
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation groups */}
        {navigationGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild tooltip={item.title}>
                      <NavLink
                        to={item.url}
                        end
                        onClick={() => {
                          if (isMobile) setOpenMobile(false);
                        }}
                        className="hover:bg-sidebar-accent/60"
                        activeClassName="bg-emerald-600 text-white font-medium hover:bg-emerald-700"
                      >
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}

        {/* User and logout */}
        <div className="mt-auto border-t border-sidebar-border p-3">
          {!collapsed && (
            <div className="mb-3 flex items-center gap-3 rounded-lg bg-sidebar-accent/40 p-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-600 font-semibold text-white">
                {user?.username?.charAt(0).toUpperCase() || "U"}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-sidebar-foreground">
                  {user?.username || "User"}
                </p>
                <p className="truncate text-xs text-sidebar-foreground/60">
                  {user?.role || "Member"}
                </p>
              </div>
            </div>
          )}

          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={handleLogout}
                tooltip="Sign out"
                className="text-sidebar-foreground/70 hover:text-red-500"
              >
                <LogOut className="h-4 w-4" />
                {!collapsed && <span>Sign out</span>}
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
