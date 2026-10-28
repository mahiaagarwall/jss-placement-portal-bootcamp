import { CollegeLogo, COLLEGE_NAME } from "@/components/CollegeLogo";
import { NavLink, useLocation } from "react-router-dom";
import { Building2, GraduationCap, LayoutGrid } from "lucide-react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, sidebarItemClass, useSidebar } from "@/components/ui/sidebar";

const NAV = [
  { to: "/company/intelligence", label: "Company Intelligence", icon: Building2 },
  { to: "/company/skills", label: "Skill Intelligence", icon: GraduationCap },
];

export const AppSidebar = () => {
  const { open, setMobileOpen } = useSidebar();
  const { pathname } = useLocation();
  const collapsed = !open;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className={`flex items-center gap-3 ${collapsed ? "md:justify-center" : ""}`}>
          <CollegeLogo className={collapsed ? "h-9 w-9" : "h-11 w-11"} />
          <div className={`min-w-0 ${collapsed ? "md:hidden" : ""}`}>
            <p className="font-heading text-sm font-semibold leading-tight text-foreground">{COLLEGE_NAME}</p>
            <p className="mt-0.5 text-[10px] font-semibold tracking-wider text-primary">JSS NOIDA · INTELLIGENCE PLATFORM</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <nav className="space-y-1">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              title={label}
              onClick={() => setMobileOpen(false)}
              className={sidebarItemClass(pathname === to, collapsed)}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className={collapsed ? "md:hidden" : ""}>{label}</span>
            </NavLink>
          ))}
        </nav>
      </SidebarContent>

      <SidebarFooter>
        <NavLink to="/" title="All Companies" onClick={() => setMobileOpen(false)} className={sidebarItemClass(false, collapsed)}>
          <LayoutGrid className="h-5 w-5 shrink-0" />
          <span className={collapsed ? "md:hidden" : ""}>All Companies</span>
        </NavLink>
      </SidebarFooter>
    </Sidebar>
  );
};
