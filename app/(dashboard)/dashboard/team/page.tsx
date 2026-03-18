import { redirect }           from "next/navigation";
import { getSession }         from "@/lib/auth/session";
import { findAllTeamMembers } from "@/lib/db/team";
import TeamClient             from "@/components/dashboard/team/TeamClient";

export default async function TeamPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const members = await findAllTeamMembers();

  return (
    <TeamClient
      members={members}
      currentUserId={session.sub}
      currentRole={session.role}
    />
  );
}