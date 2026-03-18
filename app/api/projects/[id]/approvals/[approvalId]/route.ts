import { NextRequest, NextResponse } from "next/server";
import { getSession }                from "@/lib/auth/session";
import { updateApproval }            from "@/lib/db/approvals";
import { updateMilestone }           from "@/lib/db/milestones";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; approvalId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { approvalId }    = await params;
    const { status, note }  = await req.json();

    const approval = await updateApproval(approvalId, {
      status,
      approved_by: session.sub,
      note,
    });

    if (!approval) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (approval.milestone_id && status === "approved") {
      await updateMilestone(approval.milestone_id, { status: "approved" });
    }

    return NextResponse.json({ approval });
  } catch (error) {
    console.error("PATCH approval:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}