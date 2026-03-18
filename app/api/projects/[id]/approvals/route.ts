import { NextRequest, NextResponse }                from "next/server";
import { getSession }                               from "@/lib/auth/session";
import { findApprovalsByProject, createApproval }   from "@/lib/db/approvals";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id }    = await params;
    const approvals = await findApprovalsByProject(id);
    return NextResponse.json({ approvals });
  } catch (error) {
    console.error("GET approvals:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id }                              = await params;
    const { type, milestone_id, note }        = await req.json();

    const approval = await createApproval({
      project_id:   id,
      milestone_id,
      type,
      requested_by: session.sub,
      note,
    });

    return NextResponse.json({ approval }, { status: 201 });
  } catch (error) {
    console.error("POST approval:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}