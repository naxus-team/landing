import { NextRequest, NextResponse }              from "next/server";
import { getSession }                             from "@/lib/auth/session";
import { updateMilestone, deleteMilestone }       from "@/lib/db/milestones";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; milestoneId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { milestoneId } = await params;
    const body            = await req.json();
    const milestone       = await updateMilestone(milestoneId, body);

    if (!milestone) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ milestone });
  } catch (error) {
    console.error("PATCH milestone:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; milestoneId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { milestoneId } = await params;
    await deleteMilestone(milestoneId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE milestone:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}