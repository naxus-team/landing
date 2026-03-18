"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Settings, User, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/common/ThemeToggle";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { type JWTPayload } from "@/lib/auth/jwt";
import { ROLE_LABELS } from "@/types/index";
import { type Role } from "@/types/index";

export default function TopBar({ user }: { user: JWTPayload }) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/");
  };

  const initials = user.name
    ?.split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="h-14 border-b bg-background flex items-center justify-between px-6 shrink-0">

      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground capitalize">Dashboard</span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full w-8 h-8 relative"
          onClick={() => router.push("/dashboard/notifications")}
        >
          <Bell size={14} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="rounded-full gap-2 h-8 px-2">
              {user.avatar ? (
                <img
                  src={`/assets/teams/images/${user.avatar}`}
                  alt="User Avatar"
                  className="w-6 h-6 rounded-full object-cover"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-muted border flex items-center justify-center text-[10px] font-bold text-foreground shrink-0">
                  {initials}
                </div>
              )
              }
              <span className="text-xs font-medium hidden sm:block max-w-[120px] truncate">
                {user.name}
              </span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-52 rounded-2xl bg-background p-2">
            <DropdownMenuLabel className="px-2 pb-3">
              <div className="flex items-center gap-2.5">
                {user.avatar ? (
                  <img
                    src={`/assets/teams/images/${user.avatar}`}
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-muted border flex items-center justify-center text-[10px] font-bold text-foreground shrink-0">
                    {initials}
                  </div>
                )
                }
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate">{user.name}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
                  <p className="text-[10px] font-mono text-muted-foreground mt-0.5">
                    {ROLE_LABELS[user.role as Role]?.en ?? user.role}
                  </p>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="rounded-xl gap-2 cursor-pointer"
              onClick={() => router.push("/dashboard/profile")}
            >
              <User size={13} />
              Profile
            </DropdownMenuItem>

            <DropdownMenuItem
              className="rounded-xl gap-2 cursor-pointer"
              onClick={() => router.push("/dashboard/settings")}
            >
              <Settings size={13} />
              Settings
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="rounded-xl gap-2 cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-500/10"
              onClick={handleLogout}
              disabled={loggingOut}
            >
              <LogOut size={13} />
              {loggingOut ? "Signing out..." : "Sign out"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}