import { query, queryOne } from "./client";

export type DBSession = {
  id:            string;
  user_id:       string;
  refresh_token: string;
  user_agent:    string | null;
  ip:            string | null;
  expires_at:    string;
  created_at:    string;
};

export async function createSession(data: {
  user_id:       string;
  refresh_token: string;
  user_agent?:   string;
  ip?:           string;
}): Promise<DBSession> {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session = await queryOne<DBSession>(
    `INSERT INTO sessions (user_id, refresh_token, user_agent, ip, expires_at)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [
      data.user_id,
      data.refresh_token,
      data.user_agent ?? null,
      data.ip         ?? null,
      expiresAt.toISOString(),
    ]
  );
  return session!;
}

export async function findSession(refreshToken: string): Promise<DBSession | null> {
  return queryOne<DBSession>(
    `SELECT * FROM sessions
     WHERE refresh_token = $1 AND expires_at > NOW()`,
    [refreshToken]
  );
}

export async function updateSession(
  id: string,
  refreshToken: string
): Promise<void> {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await query(
    `UPDATE sessions
     SET refresh_token = $2, expires_at = $3
     WHERE id = $1`,
    [id, refreshToken, expiresAt.toISOString()]
  );
}

export async function deleteSession(refreshToken: string): Promise<void> {
  await query(
    "DELETE FROM sessions WHERE refresh_token = $1",
    [refreshToken]
  );
}