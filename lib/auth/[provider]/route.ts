import { NextRequest, NextResponse } from "next/server";
import { buildAuthUrl }              from "@/lib/auth/oauth";
import { type OAuthProvider }        from "@/lib/auth/oauth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ provider: OAuthProvider }> }
) {
  const { provider } = await params;

  if (provider !== "google" && provider !== "github") {
    return NextResponse.json({ error: "Unknown provider" }, { status: 400 });
  }

  const url = buildAuthUrl(provider);
  return NextResponse.redirect(url);
}