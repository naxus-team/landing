"use client";

import { useState }  from "react";
import { Menu, X }   from "lucide-react";
import { Button }    from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, FolderKanban, Users,
  BarChart3, FileText, UserCircle, Settings,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { cn }          from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard",           icon: LayoutDashboard, label: "Overview"  },
  { href: "/dashboard/projects",  icon: FolderKanban,    label: "Projects"  },
  { href: "/dashboard/team",      icon: Users,           label: "Team"      },
  { href: "/dashboard/analytics", icon: BarChart3,       label: "Analytics" },
  { href: "/dashboard/content",   icon: FileText,        label: "Content"   },
  { href: "/dashboard/clients",   icon: UserCircle,      label: "Clients"   },
  { href: "/dashboard/settings",  icon: Settings,        label: "Settings"  },
];

export default function MobileSidebar({ role }: { role: string }) {
  const pathname = usePathname();
  const [open,   setOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden rounded-full w-8 h-8"
        onClick={() => setOpen(true)}
      >
        <Menu size={15} />
      </Button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 start-0 w-64 bg-card border-e z-50 flex flex-col md:hidden"
            >
              <div className="flex items-center justify-between h-14 px-4 border-b">
                <span className="font-semibold text-sm">Naxus</span>
                <Button variant="ghost" size="icon" className="rounded-full w-7 h-7" onClick={() => setOpen(false)}>
                  <X size={14} />
                </Button>
              </div>
              <nav className="flex-1 flex flex-col gap-0.5 p-2">
                {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
                  const isActive = pathname === href || pathname.startsWith(href + "/");
                  return (
                    <a
                      key={href}
                      href={href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors",
                        isActive
                          ? "bg-foreground text-background font-medium"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <Icon size={15} className="shrink-0" />
                      {label}
                    </a>
                  );
                })}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}