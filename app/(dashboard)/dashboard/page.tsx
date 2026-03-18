import { redirect }   from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { ROLE_LABELS } from "@/types/index";
import { type Role }   from "@/types/index";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const STATS = [
    { label: "Active Projects",    value: "0" },
    { label: "Team Members",       value: "0" },
    { label: "Pending Approvals",  value: "0" },
    { label: "This Month",         value: "$0" },
  ];

  return (
    <div className="flex flex-col gap-8 max-w-full">
      <div>
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-1">
          Overview
        </p>
        <h1 className="text-2xl font-extrabold tracking-tighter text-foreground">
          Welcome back, {session.name?.split(" ")[0]}
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {ROLE_LABELS[session.role as Role]?.en ?? session.role} · Naxus
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col gap-1 p-5 rounded-2xl border bg-card hover:bg-muted/50 transition-colors duration-150"
          >
            <span className="text-2xl font-extrabold tracking-tighter text-foreground">
              {stat.value}
            </span>
            <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">
              {stat.label}
            </span>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border bg-card p-6">
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-4">
          Recent Projects
        </p>
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
            <span className="text-lg">📁</span>
          </div>
          <p className="text-sm text-muted-foreground">No projects yet</p>
          <a
            href="/dashboard/projects/new"
            className="text-xs font-medium text-foreground underline underline-offset-4"
          >
            Create your first project
          </a>
        </div>
      </div>
    </div>
  );
}