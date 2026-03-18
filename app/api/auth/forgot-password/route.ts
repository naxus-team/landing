import { NextRequest, NextResponse } from "next/server";
import { findUserByEmail, saveResetToken } from "@/lib/db/users";
import { randomBytes }               from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const user = await findUserByEmail(email);

    if (!user || user.provider !== "email") {
      return NextResponse.json({ success: true });
    }

    const token     = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await saveResetToken(user.id, token, expiresAt);

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

    console.log("RESET LINK:", resetUrl);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("forgot-password:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}