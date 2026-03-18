"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Plus, Search, ArrowUpRight, Clock, CheckCircle2, Circle, PauseCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { type DBProjectWithMeta } from "@/lib/db/projects";


const STATUS_CONFIG = {
  draft: { label: "Draft", icon: Circle, color: "bg-muted text-muted-foreground" },
  pending_approval: { label: "Pending Approval", icon: Clock, color: "bg-yellow-500/10 text-yellow-600" },
  active: { label: "Active", icon: CheckCircle2, color: "bg-emerald-500/10 text-emerald-600" },
  paused: { label: "Paused", icon: PauseCircle, color: "bg-orange-500/10 text-orange-600" },
  completed: { label: "Completed", icon: CheckCircle2, color: "bg-blue-500/10 text-blue-600" },
  cancelled: { label: "Cancelled", icon: Circle, color: "bg-red-500/10 text-red-500" },
} as const;

type Props = {
  projects: DBProjectWithMeta[];
  role: string;
};

const canCreate = ["founder", "ceo", "cto", "coo", "lead-engineer", "product-manager"];

export default function ProjectsClient({ projects, role }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const FILTERS = [
    { value: "all", label: "All" },
    { value: "active", label: "Active" },
    { value: "draft", label: "Draft" },
    { value: "paused", label: "Paused" },
    { value: "completed", label: "Completed" },
  ];

  const filtered = projects.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.client_name?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || p.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="flex flex-col gap-6 max-w-full">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tighter text-foreground">
            All Projects
          </h1>
        </div>
        {canCreate.includes(role) && (
          <Button className="rounded-full gap-2 shrink-0" onClick={() => router.push("/dashboard/projects/new")}>
            <Plus size={14} />
            New Project
          </Button>
        )}
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-xl h-9 ps-9 bg-muted border-0 text-sm"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {FILTERS.map((f) => (
            <Button
              key={f.value}
              variant={filter === f.value ? "default" : "outline"}
              size="sm"
              className="rounded-full h-9 text-xs"
              onClick={() => setFilter(f.value)}
            >
              {f.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Projects list */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 rounded-2xl border bg-card">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg">
            📁
          </div>
          <p className="text-sm text-muted-foreground">No projects found</p>
          {canCreate.includes(role) && (
            <Button size="sm" className="rounded-full gap-2 mt-1" onClick={() => router.push("/dashboard/projects/new")}>
              <Plus size={12} />
              Create one
            </Button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((project, i) => {
            const status = STATUS_CONFIG[project.status as keyof typeof STATUS_CONFIG];
            const Icon = status?.icon ?? Circle;
            const progress = project.milestones_total > 0
              ? Math.round((project.milestones_done / project.milestones_total) * 100)
              : 0;

            return (
              <motion.a
                key={project.id}
                href={`/dashboard/projects/${project.id}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="group flex items-center gap-4 p-4 rounded-2xl border bg-card hover:bg-muted/50 transition-colors duration-150"
              >
                {/* Status icon */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${status?.color ?? ""}`}>
                  <Icon size={14} />
                </div>

                {/* Main info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-foreground truncate">
                      {project.name}
                    </span>
                    <Badge className={`text-[10px] px-2 py-0 rounded-full border-0 shrink-0 ${status?.color}`}>
                      {status?.label}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-mono">
                    {project.client_name && (
                      <span>{project.client_name}</span>
                    )}
                    <span>{project.members_count} members</span>
                    <span>{project.milestones_done}/{project.milestones_total} milestones</span>
                  </div>
                </div>

                {/* Progress */}
                <div className="hidden sm:flex flex-col items-end gap-1.5 shrink-0 w-24">
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {progress}%
                  </span>
                  <div className="w-full h-1 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-foreground rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Price */}
                {project.price && (
                  <div className="hidden md:block text-sm font-semibold text-foreground shrink-0">
                    ${project.price.toLocaleString()}
                  </div>
                )}

                {/* Arrow */}
                <div className="w-7 h-7 rounded-full border flex items-center justify-center text-muted-foreground group-hover:bg-foreground group-hover:text-background group-hover:border-foreground transition-all duration-150 shrink-0">
                  <ArrowUpRight size={12} />
                </div>
              </motion.a>
            );
          })}
        </div>
      )}
    </div>
  );
}