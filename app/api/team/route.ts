import { NextResponse }          from "next/server";
import { getSession }            from "@/lib/auth/session";
import { findAllTeamMembers }    from "@/lib/db/team";

const CAN_MANAGE = ["founder", "ceo", "cto", "coo"];

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const members = await findAllTeamMembers();
    return NextResponse.json({ members });
  } catch (error) {
    console.error("GET /api/team:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}