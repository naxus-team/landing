import { redirect }   from "next/navigation";
import { getSession } from "@/lib/auth/session";
import SettingsClient from "@/components/dashboard/settings/SettingsClient";

export default async function SettingsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return <SettingsClient user={session} />;
}