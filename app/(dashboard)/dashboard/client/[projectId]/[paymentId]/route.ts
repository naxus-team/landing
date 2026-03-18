import { NextRequest, NextResponse } from "next/server";
import { getSession }                from "@/lib/auth/session";
import { updatePayment }             from "@/lib/db/payments";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; paymentId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { paymentId }      = await params;
    const { status, paid_at } = await req.json();

    const payment = await updatePayment(paymentId, { status, paid_at });

    if (!payment) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ payment });
  } catch (error) {
    console.error("PATCH payment:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}