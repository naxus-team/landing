import { NextRequest, NextResponse }            from "next/server";
import { getSession }                           from "@/lib/auth/session";
import { findProjectById, updateProject }       from "@/lib/db/projects";
import { findMilestonesByProject }              from "@/lib/db/milestones";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const project = await findProjectById(id);
    if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const milestones = await findMilestonesByProject(id);
    return NextResponse.json({ project, milestones });
  } catch (error) {
    console.error("GET /api/projects/[id]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id }  = await params;
    const body    = await req.json();
    const project = await updateProject(id, body);

    if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ project });
  } catch (error) {
    console.error("PATCH /api/projects/[id]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}