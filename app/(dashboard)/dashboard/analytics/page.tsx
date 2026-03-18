import { redirect }          from "next/navigation";
import { getSession }        from "@/lib/auth/session";
import {
  getProjectStats, getMilestoneStats,
  getMonthlyProjects, getRoleDistribution, getRevenueStats,
} from "@/lib/db/analytics";
import AnalyticsClient from "@/components/dashboard/analytics/AnalyticsClient";

const CAN_VIEW = ["founder","ceo","cto","coo"];

export default async function AnalyticsPage() {
  const session = await getSession();
  if (!session)                   redirect("/login");
  if (!CAN_VIEW.includes(session.role)) redirect("/dashboard");

  const [projects, milestones, monthly, roles, revenue] = await Promise.all([
    getProjectStats(),
    getMilestoneStats(),
    getMonthlyProjects(),
    getRoleDistribution(),
    getRevenueStats(),
  ]);

  return (
    <AnalyticsClient
      projects={projects}
      milestones={milestones}
      monthly={monthly}
      roles={roles}
      revenue={revenue}
    />
  );
}