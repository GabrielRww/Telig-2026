import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";

export function AppLayout() {
  return (
    <SidebarProvider className="h-full overflow-hidden">
      <div className="flex h-full w-full overflow-hidden">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0 min-h-0">
          <AppHeader />
          <main className="flex-1 min-h-0 p-6 overflow-y-auto overflow-x-hidden overscroll-contain bg-background">
            <Suspense
              fallback={
                <div className="flex h-full min-h-[40vh] items-center justify-center text-sm text-muted-foreground">
                  Carregando...
                </div>
              }
            >
              <Outlet />
            </Suspense>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
