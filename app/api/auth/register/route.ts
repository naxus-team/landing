import { NextRequest, NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth/hash";
import { signAccessToken, signRefreshToken } from "@/lib/auth/jwt";
import { setAuthCookies } from "@/lib/auth/session";
import { type RegisterInput } from "@/types/auth";
import { findUserByEmail, createUser } from "@/lib/db/users";
import { createSession } from "@/lib/db/sessions";

export async function POST(req: NextRequest) {
    try {
        const { name, email, password }: RegisterInput = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            );
        }

        if (password.length < 8) {
            return NextResponse.json(
                { error: "Password must be at least 8 characters" },
                { status: 400 }
            );
        }

        const existing = await findUserByEmail(email);

        if (existing) {
            return NextResponse.json(
                { error: "Email already in use" },
                { status: 409 }
            );
        }

        const hashedPassword = await hashPassword(password);

        const user = await createUser({
            name,
            email,
            password: hashedPassword,
        });

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
    } catch {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}