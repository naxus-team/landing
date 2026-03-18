import { NextRequest, NextResponse }                        from "next/server";
import { getSession }                                       from "@/lib/auth/session";
import { updateMemberRole, updateMemberStatus, deleteMember } from "@/lib/db/team";

const CAN_MANAGE = ["founder", "ceo", "cto", "coo"];

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ memberId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!CAN_MANAGE.includes(session.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { memberId }        = await params;
    const { role, is_active } = await req.json();

    if (memberId === session.sub) {
      return NextResponse.json({ error: "Cannot modify your own account" }, { status: 400 });
    }

    let member;
    if (role !== undefined) {
      member = await updateMemberRole(memberId, role);
    } else if (is_active !== undefined) {
      member = await updateMemberStatus(memberId, is_active);
    }

    if (!member) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ member });
  } catch (error) {
    console.error("PATCH /api/team/[memberId]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ memberId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!CAN_MANAGE.includes(session.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { memberId } = await params;

    if (memberId === session.sub) {
      return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 });
    }

    await deleteMember(memberId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/team/[memberId]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}