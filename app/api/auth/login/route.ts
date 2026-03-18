import { NextRequest, NextResponse } from "next/server";
import { verifyPassword } from "@/lib/auth/hash";
import { signAccessToken, signRefreshToken } from "@/lib/auth/jwt";
import { setAuthCookies } from "@/lib/auth/session";
import { type LoginInput } from "@/types/auth";
import { findUserByEmail } from "@/lib/db/users";
import { createSession } from "@/lib/db/sessions";

export async function POST(req: NextRequest) {
    try {
        const { email, password }: LoginInput = await req.json();

        console.log("LOGIN ATTEMPT:", {
            db: process.env.DATABASE_URL?.slice(0, 30),
            access: !!process.env.JWT_ACCESS_SECRET,
            refresh: !!process.env.JWT_REFRESH_SECRET,
        });

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        const user = await findUserByEmail(email);

        if (!user) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            );
        }

        if (!user.is_active) {
            return NextResponse.json(
                { error: "Account is disabled" },
                { status: 403 }
            );
        }

        if (user.provider !== "email" || !user.password) {
            return NextResponse.json(
                { error: `Please sign in with ${user.provider}` },
                { status: 400 }
            );
        }

        const valid = await verifyPassword(password, user.password);

        if (!valid) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            );
        }

        const accessToken = await signAccessToken({ sub: user.id, email: user.email, role: user.role, name: user.name });
        const refreshToken = await signRefreshToken({ sub: user.id });

        await createSession({
            user_id: user.id,
            refresh_token: refreshToken,
            user_agent: req.headers.get("user-agent") ?? "",
            ip: req.headers.get("x-forwarded-for") ?? "",
        });

        await setAuthCookies(accessToken, refreshToken);

        const { password: _password, ...safeUser } = user;
        return NextResponse.json({ user: safeUser, accessToken });
    } catch (error) {
        console.error("LOGIN ERROR:", error);
        return NextResponse.json(
            { error: "Internal server error", details: String(error) },
            { status: 500 }
        );
    }
}