import { NextRequest, NextResponse }  from "next/server";
import { getSession }                 from "@/lib/auth/session";
import { findAllProjects, createProject } from "@/lib/db/projects";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const projects = await findAllProjects();
    return NextResponse.json({ projects });
  } catch (error) {
    console.error("GET /api/projects:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { name, description, price, client_id, start_date, end_date } = body;

    if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });

    const project = await createProject({
      name,
      description,
      price:      price ? Number(price) : undefined,
      client_id,
      created_by: session.sub,
      start_date,
      end_date,
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    console.error("POST /api/projects:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}