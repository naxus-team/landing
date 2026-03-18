export const OAUTH_CONFIG = {
  google: {
    authUrl:      "https://accounts.google.com/o/oauth2/v2/auth",
    tokenUrl:     "https://oauth2.googleapis.com/token",
    userUrl:      "https://www.googleapis.com/oauth2/v2/userinfo",
    clientId:     process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    scopes:       ["openid", "email", "profile"],
  },
  github: {
    authUrl:      "https://github.com/login/oauth/authorize",
    tokenUrl:     "https://github.com/login/oauth/access_token",
    userUrl:      "https://api.github.com/user",
    clientId:     process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    scopes:       ["read:user", "user:email"],
  },
} as const;

export type OAuthProvider = keyof typeof OAUTH_CONFIG;

export function buildAuthUrl(provider: OAuthProvider): string {
  const config      = OAUTH_CONFIG[provider];
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/oauth/${provider}/callback`;
  const state       = crypto.randomUUID();

  const params = new URLSearchParams({
    client_id:     config.clientId,
    redirect_uri:  redirectUri,
    scope:         config.scopes.join(" "),
    response_type: "code",
    state,
  });

  if (provider === "google") {
    params.set("access_type",      "offline");
    params.set("prompt",           "consent");
  }

  return `${config.authUrl}?${params.toString()}`;
}

export async function exchangeCodeForToken(
  provider: OAuthProvider,
  code: string
): Promise<string> {
  const config      = OAUTH_CONFIG[provider];
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/oauth/${provider}/callback`;

  const res = await fetch(config.tokenUrl, {
    method:  "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Accept":        "application/json",
    },
    body: new URLSearchParams({
      client_id:     config.clientId,
      client_secret: config.clientSecret,
      code,
      redirect_uri:  redirectUri,
      grant_type:    "authorization_code",
    }),
  });

  const data = await res.json();

  if (!res.ok || !data.access_token) {
    throw new Error("Failed to exchange code for token");
  }

  return data.access_token;
}

export async function getOAuthUser(
  provider: OAuthProvider,
  accessToken: string
): Promise<{ id: string; email: string; name: string; avatar: string }> {
  const config = OAUTH_CONFIG[provider];

  const res = await fetch(config.userUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept:        "application/json",
    },
  });

  if (!res.ok) throw new Error("Failed to fetch OAuth user");

  const data = await res.json();

  if (provider === "google") {
    return {
      id:     data.id,
      email:  data.email,
      name:   data.name,
      avatar: data.picture,
    };
  }

  if (provider === "github") {
    let email = data.email;

    if (!email) {
      const emailRes = await fetch("https://api.github.com/user/emails", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept:        "application/json",
        },
      });
      const emails = await emailRes.json();
      email = emails.find((e: { primary: boolean; email: string }) => e.primary)?.email;
    }

    return {
      id:     String(data.id),
      email,
      name:   data.name ?? data.login,
      avatar: data.avatar_url,
    };
  }

  throw new Error("Unknown provider");
}