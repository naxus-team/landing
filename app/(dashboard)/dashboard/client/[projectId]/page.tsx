import { redirect }              from "next/navigation";
import { notFound }              from "next/navigation";
import { getSession }            from "@/lib/auth/session";
import { findProjectById }       from "@/lib/db/projects";
import { findMilestonesByProject } from "@/lib/db/milestones";
import { findApprovalsByProject }  from "@/lib/db/approvals";
import { findPaymentsByProject }   from "@/lib/db/payments";
import ClientRoadmap             from "@/components/dashboard/client/ClientRoadmap";

export default async function ClientProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { projectId } = await params;
  const project       = await findProjectById(projectId);
  if (!project)       notFound();

  const [milestones, approvals, payments] = await Promise.all([
    findMilestonesByProject(projectId),
    findApprovalsByProject(projectId),
    findPaymentsByProject(projectId),
  ]);

  return (
    <ClientRoadmap
      project={project}
      milestones={milestones}
      approvals={approvals}
      payments={payments}
      userId={session.sub}
      role={session.role}
    />
  );
}