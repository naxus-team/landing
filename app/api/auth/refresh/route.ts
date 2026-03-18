import { NextResponse } from "next/server";
import { verifyRefreshToken, signAccessToken, signRefreshToken } from "@/lib/auth/jwt";
import { setAuthCookies, getRefreshToken } from "@/lib/auth/session";
import { findUserById } from "@/lib/db/users";
import { findSession, updateSession } from "@/lib/db/sessions";

export async function POST() {
    try {
        const oldRefreshToken = await getRefreshToken();

        if (!oldRefreshToken) {
            return NextResponse.json(
                { error: "No refresh token" },
                { status: 401 }
            );
        }

        const payload = await verifyRefreshToken(oldRefreshToken);

        if (!payload) {
            return NextResponse.json(
                { error: "Invalid refresh token" },
                { status: 401 }
            );
        }

        const session = await findSession(oldRefreshToken);

        if (!session) {
            return NextResponse.json(
                { error: "Session expired" },
                { status: 401 }
            );
        }

        const user = await findUserById(session.user_id);

        if (!user || !user.is_active) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 401 }
            );
        }

        const newAccessToken = await signAccessToken({
            sub: user.id,
            email: user.email,
            role: user.role,
            name: user.name,
        });
        const newRefreshToken = await signRefreshToken({ sub: user.id });

        await updateSession(session.id, newRefreshToken);
        await setAuthCookies(newAccessToken, newRefreshToken);

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}