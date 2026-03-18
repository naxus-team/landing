import { query, queryOne } from "./client";
import { type DBUser }     from "./users";

export type DBTeamMember = Pick<DBUser,
  "id" | "name" | "email" | "avatar" | "role" | "provider" | "is_active" | "created_at"
>;

export async function findAllTeamMembers(): Promise<DBTeamMember[]> {
  return query<DBTeamMember>(`
    SELECT id, name, email, avatar, role, provider, is_active, created_at
    FROM users
    ORDER BY
      CASE role
        WHEN 'founder'         THEN 1
        WHEN 'ceo'             THEN 2
        WHEN 'cto'             THEN 3
        WHEN 'coo'             THEN 4
        WHEN 'lead-engineer'   THEN 5
        WHEN 'lead-designer'   THEN 6
        WHEN 'senior-engineer' THEN 7
        WHEN 'engineer'        THEN 8
        WHEN 'designer'        THEN 9
        WHEN 'product-manager' THEN 10
        WHEN 'devops'          THEN 11
        WHEN 'ai-engineer'     THEN 12
        WHEN 'sales'           THEN 13
        WHEN 'marketing'       THEN 14
        WHEN 'advisor'         THEN 15
        ELSE 99
      END,
      created_at ASC
  `);
}

export async function updateMemberRole(
  id:   string,
  role: string
): Promise<DBTeamMember | null> {
  return queryOne<DBTeamMember>(`
    UPDATE users
    SET role = $2
    WHERE id = $1
    RETURNING id, name, email, avatar, role, provider, is_active, created_at
  `, [id, role]);
}

export async function updateMemberStatus(
  id:       string,
  isActive: boolean
): Promise<DBTeamMember | null> {
  return queryOne<DBTeamMember>(`
    UPDATE users
    SET is_active = $2
    WHERE id = $1
    RETURNING id, name, email, avatar, role, provider, is_active, created_at
  `, [id, isActive]);
}

export async function deleteMember(id: string): Promise<void> {
  await query("DELETE FROM users WHERE id = $1", [id]);
}