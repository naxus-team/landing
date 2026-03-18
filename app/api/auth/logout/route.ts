import { NextResponse }                           from "next/server";
import { clearAuthCookies, getRefreshToken }      from "@/lib/auth/session";
import { deleteSession }                          from "@/lib/db/sessions";

export async function POST() {
  try {
    const refreshToken = await getRefreshToken();

    if (refreshToken) {
      await deleteSession(refreshToken);
    }

    await clearAuthCookies();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}