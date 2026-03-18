"use client";

import { useState }     from "react";
import { motion }       from "framer-motion";
import {
  Shield, MoreHorizontal, UserX,
  UserCheck, Trash2, Search, ChevronDown,
} from "lucide-react";
import { Button }       from "@/components/ui/button";
import { Badge }        from "@/components/ui/badge";
import { Input }        from "@/components/ui/input";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ROLE_LABELS, ROLE_STYLES } from "@/types/index";
import { type Role }    from "@/types/index";
import { type DBTeamMember } from "@/lib/db/team";

const ALL_ROLES: Role[] = [
  "founder","ceo","cto","coo","lead-engineer","senior-engineer",
  "engineer","lead-designer","designer","product-manager",
  "devops","ai-engineer","sales","marketing","advisor","viewer",
];

const CAN_MANAGE = ["founder","ceo","cto","coo"];

type Props = {
  members:       DBTeamMember[];
  currentUserId: string;
  currentRole:   string;
};

export default function TeamClient({ members: initial, currentUserId, currentRole }: Props) {
  const [members, setMembers] = useState<DBTeamMember[]>(initial);
  const [search,  setSearch]  = useState("");
  const [loading, setLoading] = useState<string | null>(null);

  const canManage = CAN_MANAGE.includes(currentRole);

  const filtered = members.filter((m) =>
    m.name?.toLowerCase().includes(search.toLowerCase()) ||
    m.avatar?.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase()) ||
    m.role.toLowerCase().includes(search.toLowerCase())
  );

  const handleRoleChange = async (memberId: string, role: string) => {
    setLoading(memberId);
    const res  = await fetch(`/api/team/${memberId}`, {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ role }),
    });
    const data = await res.json();
    if (res.ok) {
      setMembers((prev) => prev.map((m) => m.id === memberId ? { ...m, role: data.member.role } : m));
    }
    setLoading(null);
  };

  const handleToggleStatus = async (memberId: string, isActive: boolean) => {
    setLoading(memberId);
    const res  = await fetch(`/api/team/${memberId}`, {
      method:  "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ is_active: isActive }),
    });
    const data = await res.json();
    if (res.ok) {
      setMembers((prev) => prev.map((m) => m.id === memberId ? { ...m, is_active: data.member.is_active } : m));
    }
    setLoading(null);
  };

  const handleDelete = async (memberId: string) => {
    if (!confirm("Are you sure you want to remove this member?")) return;
    setLoading(memberId);
    const res = await fetch(`/api/team/${memberId}`, { method: "DELETE" });
    if (res.ok) {
      setMembers((prev) => prev.filter((m) => m.id !== memberId));
    }
    setLoading(null);
  };

  const initials = (name: string | null) =>
    name?.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() ?? "?";

  return (
    <div className="flex flex-col gap-6 max-w-full">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-1">
            Team
          </p>
          <h1 className="text-2xl font-extrabold tracking-tighter text-foreground">
            Team Members
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {members.length} member{members.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search members..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-xl h-9 ps-9 bg-muted border-0 text-sm"
        />
      </div>

      {/* Role legend */}
      <div className="flex flex-wrap gap-2">
        {["founder","ceo","cto","engineer","designer","viewer"].map((r) => (
          <Badge
            key={r}
            className={`text-[10px] px-2 py-0.5 rounded-full border-0 ${ROLE_STYLES[r as Role] ?? ""}`}
          >
            {ROLE_LABELS[r as Role]?.en ?? r}
          </Badge>
        ))}
      </div>

      {/* Members list */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 rounded-2xl border bg-card">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg">👥</div>
          <p className="text-sm text-muted-foreground">No members found</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((member, i) => {
            const isSelf    = member.id === currentUserId;
            const isLoading = loading === member.id;

            return (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                className={`flex items-center gap-4 p-4 rounded-2xl border bg-card transition-colors duration-150 ${
                  !member.is_active ? "opacity-60" : ""
                }`}
              >
                {/* Avatar */}
                {member.avatar ? (
                  <img
                    src={`/assets/teams/images/${member.avatar}?u=${member.id}`}
                    alt={member.name ?? member.email}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-medium text-foreground">
                    {initials(member.name ?? member.email)}
                  </div>
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className="text-sm font-semibold text-foreground truncate">
                      {member.name ?? "Unnamed"}
                    </span>
                    {isSelf && (
                      <Badge className="text-[9px] px-1.5 py-0 rounded-full border-0 bg-blue-500/10 text-blue-600">
                        You
                      </Badge>
                    )}
                    {!member.is_active && (
                      <Badge className="text-[9px] px-1.5 py-0 rounded-full border-0 bg-red-500/10 text-red-500">
                        Inactive
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{member.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={`text-[10px] px-2 py-0 rounded-full border-0 ${ROLE_STYLES[member.role as Role] ?? "bg-muted text-muted-foreground"}`}>
                      {ROLE_LABELS[member.role as Role]?.en ?? member.role}
                    </Badge>
                    <span className="text-[10px] font-mono text-muted-foreground capitalize">
                      via {member.provider}
                    </span>
                  </div>
                </div>

                {/* Role selector */}
                {canManage && !isSelf && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full h-7 gap-1 text-xs hidden sm:flex"
                        disabled={isLoading}
                      >
                        <Shield size={11} />
                        Change Role
                        <ChevronDown size={10} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 rounded-2xl p-2 max-h-64 overflow-y-auto">
                      <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest px-2 pb-2">
                        Select Role
                      </p>
                      {ALL_ROLES.map((r) => (
                        <DropdownMenuItem
                          key={r}
                          className="rounded-xl gap-2 cursor-pointer"
                          onClick={() => handleRoleChange(member.id, r)}
                        >
                          <Badge className={`text-[10px] px-2 py-0 rounded-full border-0 ${ROLE_STYLES[r] ?? ""}`}>
                            {ROLE_LABELS[r]?.en ?? r}
                          </Badge>
                          {member.role === r && (
                            <span className="ms-auto text-[10px] text-emerald-600">✓</span>
                          )}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}

                {/* Actions menu */}
                {canManage && !isSelf && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full w-8 h-8 text-muted-foreground"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <span className="w-3 h-3 rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground animate-spin" />
                        ) : (
                          <MoreHorizontal size={14} />
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44 rounded-2xl p-2">
                      <DropdownMenuItem
                        className="rounded-xl gap-2 cursor-pointer"
                        onClick={() => handleToggleStatus(member.id, !member.is_active)}
                      >
                        {member.is_active ? (
                          <>
                            <UserX size={13} />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <UserCheck size={13} />
                            Activate
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="rounded-xl gap-2 cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-500/10"
                        onClick={() => handleDelete(member.id)}
                      >
                        <Trash2 size={13} />
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Stats footer */}
      <div className="grid grid-cols-3 gap-3 pt-2">
        {[
          { label: "Total Members",   value: members.length                                    },
          { label: "Active",          value: members.filter((m) => m.is_active).length         },
          { label: "Inactive",        value: members.filter((m) => !m.is_active).length        },
        ].map((stat) => (
          <div key={stat.label} className="flex flex-col gap-1 p-4 rounded-2xl border bg-card">
            <span className="text-xl font-extrabold tracking-tighter text-foreground">
              {stat.value}
            </span>
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}