import { NextRequest, NextResponse }         from "next/server";
import { createServerClient }                from "@/lib/supabase/server";
import { exchangeCodeForToken, getOAuthUser } from "@/lib/auth/oauth";
import { signAccessToken, signRefreshToken } from "@/lib/auth/jwt";
import { setAuthCookies }                    from "@/lib/auth/session";
import { type OAuthProvider }                from "@/lib/auth/oauth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ provider: OAuthProvider }> }
) {
  const { provider } = await params;
  const code         = req.nextUrl.searchParams.get("code");
  const errorParam   = req.nextUrl.searchParams.get("error");

  if (errorParam || !code) {
    return NextResponse.redirect(
      new URL(`/login?error=oauth_denied`, req.url)
    );
  }

  try {
    const accessToken  = await exchangeCodeForToken(provider, code);
    const oauthUser    = await getOAuthUser(provider, accessToken);
    const db           = createServerClient();

    const { data: existing } = await db
      .from("users")
      .select("id, email, name, role, avatar, provider, is_active")
      .eq("provider",    provider)
      .eq("provider_id", oauthUser.id)
      .single();

    let user = existing;

    if (!user) {
      const { data: byEmail } = await db
        .from("users")
        .select("id, email, name, role, avatar, provider, is_active")
        .eq("email", oauthUser.email)
        .single();

      if (byEmail) {
        const { data: updated } = await db
          .from("users")
          .update({ provider, provider_id: oauthUser.id, avatar: oauthUser.avatar })
          .eq("id", byEmail.id)
          .select("id, email, name, role, avatar, provider, is_active")
          .single();

        user = updated;
      } else {
        const { data: created } = await db
          .from("users")
          .insert({
            email:       oauthUser.email,
            name:        oauthUser.name,
            avatar:      oauthUser.avatar,
            provider,
            provider_id: oauthUser.id,
          })
          .select("id, email, name, role, avatar, provider, is_active")
          .single();

        user = created;
      }
    }

    if (!user || !user.is_active) {
      return NextResponse.redirect(
        new URL("/login?error=account_disabled", req.url)
      );
    }

    const jwtAccessToken  = signAccessToken({
      sub:   user.id,
      email: user.email,
      role:  user.role,
      name:  user.name,
    });
    const jwtRefreshToken = signRefreshToken({ sub: user.id });

    await db.from("sessions").insert({
      user_id:       user.id,
      refresh_token: jwtRefreshToken,
      expires_at:    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      user_agent:    req.headers.get("user-agent") ?? "",
      ip:            req.headers.get("x-forwarded-for") ?? "",
    });

    await setAuthCookies(jwtAccessToken, jwtRefreshToken);

    return NextResponse.redirect(new URL("/dashboard", req.url));
  } catch {
    return NextResponse.redirect(
      new URL("/login?error=oauth_failed", req.url)
    );
  }
}