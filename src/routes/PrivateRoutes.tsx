import { Navigate, Outlet } from "react-router-dom";
import {
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import CashbookSidebar from "@/components/pages/CashbookSidebar";
import { useAuthStore } from "@/Store/AuthStore";

function DashboardShell() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <CashbookSidebar />

        <div className="flex min-w-0 flex-1 flex-col">

          <header className="h-14 flex items-center border-b border-border bg-card px-4">
            <SidebarTrigger className="mr-4" />

            <h2 className="text-sm font-medium text-muted-foreground">
              Cashbook
            </h2>
          </header>

          <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-4 py-5 sm:p-6">
            <Outlet />
          </main>

        </div>
      </div>
    </SidebarProvider>
  );
}

export function PrivateRoutes() {
  const accessToken = useAuthStore(
    (state) => state.accessToken
  );

  if (!accessToken) {
    return <Navigate to="/" replace />;
  }

  return <DashboardShell />;
}