import { NextRequest, NextResponse }                 from "next/server";
import { findUserByResetToken, clearResetToken }     from "@/lib/db/users";
import { hashPassword }                              from "@/lib/auth/hash";
import { query }                                     from "@/lib/db/client";

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const user = await findUserByResetToken(token);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired reset link" },
        { status: 400 }
      );
    }

    const hashed = await hashPassword(password);

    await query(
      `UPDATE users
       SET password = $2, reset_token = NULL, reset_token_expires = NULL
       WHERE id = $1`,
      [user.id, hashed]
    );

    // حذف كل الـ sessions القديمة
    await query(
      "DELETE FROM sessions WHERE user_id = $1",
      [user.id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("reset-password:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}