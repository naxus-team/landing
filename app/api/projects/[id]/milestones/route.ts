import { NextRequest, NextResponse }            from "next/server";
import { getSession }                           from "@/lib/auth/session";
import { findMilestonesByProject, createMilestone } from "@/lib/db/milestones";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id }     = await params;
    const milestones = await findMilestonesByProject(id);
    return NextResponse.json({ milestones });
  } catch (error) {
    console.error("GET milestones:", error);
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

    const { id }   = await params;
    const body     = await req.json();
    const { title, description, requires_approval, order_index, due_date } = body;

    if (!title) return NextResponse.json({ error: "Title is required" }, { status: 400 });

    const milestone = await createMilestone({
      project_id:         id,
      title,
      description,
      requires_approval,
      order_index:        order_index ?? 0,
      due_date,
    });

    return NextResponse.json({ milestone }, { status: 201 });
  } catch (error) {
    console.error("POST milestone:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}