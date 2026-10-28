import * as React from "react";
import { PanelLeft, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarCtx {
  open: boolean; // desktop expanded?
  setOpen: (v: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
  toggle: () => void;
}
const Ctx = React.createContext<SidebarCtx | null>(null);

export const useSidebar = () => {
  const c = React.useContext(Ctx);
  if (!c) throw new Error("useSidebar must be used inside SidebarProvider");
  return c;
};

export const SidebarProvider = ({ children, defaultOpen = true }: { children: React.ReactNode; defaultOpen?: boolean }) => {
  const [open, setOpen] = React.useState(defaultOpen);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const toggle = React.useCallback(() => {
    if (typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches) setOpen((o) => !o);
    else setMobileOpen((o) => !o);
  }, []);
  return (
    <Ctx.Provider value={{ open, setOpen, mobileOpen, setMobileOpen, toggle }}>
      <div className="flex min-h-screen w-full bg-background">{children}</div>
    </Ctx.Provider>
  );
};

/** collapsible="icon": desktop collapses to an icon rail; mobile becomes an overlay drawer. */
export const Sidebar = ({ children }: { children: React.ReactNode; collapsible?: "icon" }) => {
  const { open, mobileOpen, setMobileOpen } = useSidebar();
  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/30 md:hidden" onClick={() => setMobileOpen(false)} aria-hidden />
      )}
      <aside
        data-state={open ? "expanded" : "collapsed"}
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform md:sticky md:top-0 md:h-screen md:translate-x-0 md:transition-[width]",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          open ? "md:w-64" : "md:w-16",
        )}
      >
        {mobileOpen && (
          <button
            className="absolute right-3 top-3 rounded-md p-1 text-sidebar-foreground hover:bg-sidebar-accent md:hidden"
            onClick={() => setMobileOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        )}
        {children}
      </aside>
    </>
  );
};

export const SidebarHeader = ({ className, ...p }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("border-b border-sidebar-border p-4", className)} {...p} />
);
export const SidebarContent = ({ className, ...p }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex-1 overflow-y-auto p-2", className)} {...p} />
);
export const SidebarFooter = ({ className, ...p }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("border-t border-sidebar-border p-2", className)} {...p} />
);

export const SidebarTrigger = ({ className }: { className?: string }) => {
  const { toggle } = useSidebar();
  return (
    <button
      onClick={toggle}
      aria-label="Toggle sidebar"
      className={cn("inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-primary focus-visible:ring-2 focus-visible:ring-ring", className)}
    >
      <PanelLeft className="h-5 w-5" />
    </button>
  );
};

export const sidebarItemClass = (active: boolean, collapsed: boolean) =>
  cn(
    "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
    active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
    collapsed && "md:justify-center md:px-0",
  );
