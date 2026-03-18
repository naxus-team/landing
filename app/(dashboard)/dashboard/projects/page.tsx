import { redirect }        from "next/navigation";
import { getSession }      from "@/lib/auth/session";
import { findAllProjects } from "@/lib/db/projects";
import ProjectsClient      from "@/components/dashboard/projects/ProjectsClient";

export default async function ProjectsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const projects = await findAllProjects();

  return (
    <ProjectsClient
      projects={projects}
      role={session.role}
    />
  );
}