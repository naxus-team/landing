import { SignJWT, jwtVerify } from "jose";

const ACCESS_SECRET  = new TextEncoder().encode(
  process.env.JWT_ACCESS_SECRET ?? "naxus-access-secret-2024-minimum-32-chars-long"
);
const REFRESH_SECRET = new TextEncoder().encode(
  process.env.JWT_REFRESH_SECRET ?? "naxus-refresh-secret-2024-minimum-32-chars-long"
);

export type JWTPayload = {
  sub:   string;
  avatar?: string;
  email: string;
  role:  string;
  name:  string;
};

export async function signAccessToken(payload: JWTPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(ACCESS_SECRET);
}

export async function signRefreshToken(payload: Pick<JWTPayload, "sub">): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(REFRESH_SECRET);
}

export async function verifyAccessToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, ACCESS_SECRET);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

export async function verifyRefreshToken(token: string): Promise<{ sub: string } | null> {
  try {
    const { payload } = await jwtVerify(token, REFRESH_SECRET);
    return { sub: payload.sub as string };
  } catch {
    return null;
  }
}