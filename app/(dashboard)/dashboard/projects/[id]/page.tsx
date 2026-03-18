import { redirect }          from "next/navigation";
import { notFound }          from "next/navigation";
import { getSession }        from "@/lib/auth/session";
import { findProjectById }   from "@/lib/db/projects";
import { findMilestonesByProject } from "@/lib/db/milestones";
import ProjectDetail         from "@/components/dashboard/projects/ProjectDetail";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { id }   = await params;
  const project  = await findProjectById(id);
  if (!project)  notFound();

  const milestones = await findMilestonesByProject(id);

  return (
    <ProjectDetail
      project={project}
      milestones={milestones}
      role={session.role}
      userId={session.sub}
    />
  );
}