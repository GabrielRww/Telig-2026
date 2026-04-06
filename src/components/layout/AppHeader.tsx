import { LogOut, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function AppHeader() {
  return (
    <header className="h-14 flex items-center justify-between px-4 bg-header text-header-foreground border-b border-sidebar-border">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="text-header-foreground hover:bg-sidebar-accent" />
        <h1 className="text-lg font-bold tracking-tight">
          TELIG <span className="text-sm font-normal opacity-70">:)</span>
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="text-header-foreground hover:bg-sidebar-accent">
          <Bell className="h-4 w-4" />
        </Button>
        <div className="h-6 w-px bg-sidebar-border mx-1" />
        <span className="text-sm opacity-70 mr-2">Admin</span>
        <Button variant="ghost" size="sm" className="text-header-foreground hover:bg-sidebar-accent gap-2">
          <LogOut className="h-4 w-4" />
          Sair
        </Button>
      </div>
    </header>
  );
}
