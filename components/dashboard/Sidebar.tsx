"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, FolderKanban, Users,
  BarChart3, FileText, UserCircle,
  ChevronLeft, ChevronRight, Settings,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n-context";
import Logo from "../common/Logo";

type NavItem = {
  href: string;
  icon: React.ElementType;
  labelKey: string;
  roles: string[];
};

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", icon: LayoutDashboard, labelKey: "overview", roles: ["*"] },
  { href: "/dashboard/projects", icon: FolderKanban, labelKey: "projects", roles: ["*"] },
  { href: "/dashboard/team", icon: Users, labelKey: "team", roles: ["founder", "ceo", "cto", "coo", "admin"] },
  { href: "/dashboard/analytics", icon: BarChart3, labelKey: "analytics", roles: ["founder", "ceo", "cto", "coo"] },
  { href: "/dashboard/content", icon: FileText, labelKey: "content", roles: ["founder", "ceo", "cto", "coo", "lead-engineer", "lead-designer"] },
  { href: "/dashboard/clients", icon: UserCircle, labelKey: "clients", roles: ["founder", "ceo", "cto", "coo"] },
  { href: "/dashboard/settings", icon: Settings, labelKey: "settings", roles: ["founder", "ceo", "cto"] },
];

function canAccess(roles: string[], userRole: string): boolean {
  return roles.includes("*") || roles.includes(userRole);
}

export default function Sidebar({ role }: { role: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const { t, isRTL } = useI18n();
  const [collapsed, setCollapsed] = useState(true);

  const visibleItems = NAV_ITEMS.filter((item) => canAccess(item.roles, role));

  const getLabel = (key: string): string => {
    const labels: Record<string, string> = {
      overview: t.nav.services,
      projects: t.nav.work,
      team: t.nav.team,
      analytics: "Analytics",
      content: "Content",
      clients: "Clients",
      settings: "Settings",
    };
    return labels[key] ?? key;
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className="hidden md:flex flex-col bg-card h-screen sticky top-0 shrink-0 overflow-hidden"
      style={{ borderInlineEnd: "1px solid var(--border)" }}
    >
      {/* Logo */}
      <div className={cn(
        "flex items-center h-14 px-4 shrink-0",
        collapsed ? "justify-center" : "gap-3"
      )} style={{ borderBottom: "1px solid var(--border)" }}>
        <Logo />
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.15 }}
              className="font-semibold text-sm text-foreground whitespace-nowrap overflow-hidden"
            >
              Naxus
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col gap-0.5 p-2 overflow-y-auto overflow-x-hidden">

        {!collapsed && (
          <p className="text-[9px] font-mono text-muted-foreground uppercase tracking-widest px-3 pb-1 pt-2">
            Menu
          </p>
        )}

        {visibleItems.map(({ href, icon: Icon, labelKey }) => {
          const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href + "/"));
          return (
            <button
              key={href}
              onClick={() => router.push(href)}
              title={collapsed ? getLabel(labelKey) : undefined}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl text-sm transition-all duration-150 w-full",
                collapsed ? "justify-center p-2.5" : "px-3 py-2.5",
                isActive
                  ? "bg-foreground text-background font-medium shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {/* Active indicator */}
              {isActive && !collapsed && (
                <motion.div
                  layoutId="active-indicator"
                  className="absolute inset-0 rounded-xl bg-foreground"
                  style={{ zIndex: -1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}

              <Icon size={15} className="shrink-0" />

              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -4 }}
                    transition={{ duration: 0.15 }}
                    className="truncate whitespace-nowrap flex-1 text-start"
                  >
                    {getLabel(labelKey)}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-2 shrink-0" style={{ borderTop: "1px solid var(--border)" }}>
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="w-full flex items-center justify-center p-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-150"
        >
          {collapsed
            ? (isRTL ? <ChevronLeft size={14} /> : <ChevronRight size={14} />)
            : (isRTL ? <ChevronRight size={14} /> : <ChevronLeft size={14} />)
          }
        </button>
      </div>
    </motion.aside>
  );
}