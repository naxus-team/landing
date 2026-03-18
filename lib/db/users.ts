import { query, queryOne } from "./client";

export type DBUser = {
  id:          string;
  email:       string;
  password:    string | null;
  name:        string;
  avatar:      string | null;
  role:        string;
  provider:    string;
  provider_id: string | null;
  is_active:   boolean;
  created_at:  string;
  updated_at:  string;
};

export async function findUserByEmail(email: string): Promise<DBUser | null> {
  return queryOne<DBUser>(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );
}

export async function findUserById(id: string): Promise<DBUser | null> {
  return queryOne<DBUser>(
    "SELECT * FROM users WHERE id = $1",
    [id]
  );
}

export async function findUserByProvider(
  provider: string,
  providerId: string
): Promise<DBUser | null> {
  return queryOne<DBUser>(
    "SELECT * FROM users WHERE provider = $1 AND provider_id = $2",
    [provider, providerId]
  );
}

export async function createUser(data: {
  email:       string;
  password?:   string;
  name:        string;
  avatar?:     string;
  provider?:   string;
  provider_id?: string;
}): Promise<DBUser> {
  const user = await queryOne<DBUser>(
    `INSERT INTO users (email, password, name, avatar, provider, provider_id)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      data.email,
      data.password   ?? null,
      data.name,
      data.avatar     ?? null,
      data.provider   ?? "email",
      data.provider_id ?? null,
    ]
  );
  return user!;
}

export async function updateUser(
  id: string,
  data: Partial<Pick<DBUser, "provider" | "provider_id" | "avatar">>
): Promise<DBUser | null> {
  return queryOne<DBUser>(
    `UPDATE users
     SET provider = COALESCE($2, provider),
         provider_id = COALESCE($3, provider_id),
         avatar = COALESCE($4, avatar)
     WHERE id = $1
     RETURNING *`,
    [id, data.provider ?? null, data.provider_id ?? null, data.avatar ?? null]
  );
}

export async function saveResetToken(
  userId:    string,
  token:     string,
  expiresAt: Date
): Promise<void> {
  await query(
    `UPDATE users
     SET reset_token = $2, reset_token_expires = $3
     WHERE id = $1`,
    [userId, token, expiresAt.toISOString()]
  );
}

export async function findUserByResetToken(token: string): Promise<DBUser | null> {
  return queryOne<DBUser>(
    `SELECT * FROM users
     WHERE reset_token = $1
     AND reset_token_expires > NOW()`,
    [token]
  );
}

export async function clearResetToken(userId: string): Promise<void> {
  await query(
    `UPDATE users
     SET reset_token = NULL, reset_token_expires = NULL, password = $2
     WHERE id = $1`,
    [userId]
  );
}