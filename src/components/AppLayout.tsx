import { Link, Outlet, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useCompany } from "@/context/CompanyContext";

export const AppLayout = () => {
  const { selected } = useCompany();
  const { pathname } = useLocation();
  const page = pathname.endsWith("/skills") ? "Skill Intelligence" : "Company Intelligence";

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col bg-background">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-border bg-surface px-3 sm:px-4">
          <SidebarTrigger />
          <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-sm text-muted-foreground">
            <Link to="/" className="transition-colors hover:text-primary">Companies</Link>
            <ChevronRight className="h-4 w-4 shrink-0" />
            <span className="truncate">{selected?.companyName ?? "Company"}</span>
            <ChevronRight className="h-4 w-4 shrink-0" />
            <span className="truncate font-medium text-foreground">{page}</span>
          </nav>
          <div className="ml-auto"><ThemeToggle /></div>
        </header>
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
};
