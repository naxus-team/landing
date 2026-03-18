import { query, queryOne } from "./client";

export type DBProject = {
  id:            string;
  name:          string;
  description:   string | null;
  status:        string;
  price:         number | null;
  price_approved: boolean;
  client_id:     string | null;
  created_by:    string;
  start_date:    string | null;
  end_date:      string | null;
  created_at:    string;
  updated_at:    string;
};

export type DBProjectWithMeta = DBProject & {
  client_name:     string | null;
  client_email:    string | null;
  members_count:   number;
  milestones_total: number;
  milestones_done: number;
};

export async function findAllProjects(): Promise<DBProjectWithMeta[]> {
  return query<DBProjectWithMeta>(`
    SELECT
      p.*,
      u.name  AS client_name,
      u.email AS client_email,
      (SELECT COUNT(*) FROM project_members pm WHERE pm.project_id = p.id)::int AS members_count,
      (SELECT COUNT(*) FROM milestones m WHERE m.project_id = p.id)::int AS milestones_total,
      (SELECT COUNT(*) FROM milestones m WHERE m.project_id = p.id AND m.status = 'completed')::int AS milestones_done
    FROM projects p
    LEFT JOIN users u ON u.id = p.client_id
    ORDER BY p.created_at DESC
  `);
}

export async function findProjectById(id: string): Promise<DBProjectWithMeta | null> {
  return queryOne<DBProjectWithMeta>(`
    SELECT
      p.*,
      u.name  AS client_name,
      u.email AS client_email,
      (SELECT COUNT(*) FROM project_members pm WHERE pm.project_id = p.id)::int AS members_count,
      (SELECT COUNT(*) FROM milestones m WHERE m.project_id = p.id)::int AS milestones_total,
      (SELECT COUNT(*) FROM milestones m WHERE m.project_id = p.id AND m.status = 'completed')::int AS milestones_done
    FROM projects p
    LEFT JOIN users u ON u.id = p.client_id
    WHERE p.id = $1
  `, [id]);
}

export async function findProjectsByClient(clientId: string): Promise<DBProjectWithMeta[]> {
  return query<DBProjectWithMeta>(`
    SELECT
      p.*,
      u.name  AS client_name,
      u.email AS client_email,
      (SELECT COUNT(*) FROM project_members pm WHERE pm.project_id = p.id)::int AS members_count,
      (SELECT COUNT(*) FROM milestones m WHERE m.project_id = p.id)::int AS milestones_total,
      (SELECT COUNT(*) FROM milestones m WHERE m.project_id = p.id AND m.status = 'completed')::int AS milestones_done
    FROM projects p
    LEFT JOIN users u ON u.id = p.client_id
    WHERE p.client_id = $1
    ORDER BY p.created_at DESC
  `, [clientId]);
}

export async function createProject(data: {
  name:        string;
  description?: string;
  price?:      number;
  client_id?:  string;
  created_by:  string;
  start_date?: string;
  end_date?:   string;
}): Promise<DBProject> {
  const project = await queryOne<DBProject>(`
    INSERT INTO projects (name, description, price, client_id, created_by, start_date, end_date)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
  `, [
    data.name,
    data.description  ?? null,
    data.price        ?? null,
    data.client_id    ?? null,
    data.created_by,
    data.start_date   ?? null,
    data.end_date     ?? null,
  ]);
  return project!;
}

export async function updateProject(
  id: string,
  data: Partial<Pick<DBProject, "name" | "description" | "status" | "price" | "price_approved" | "start_date" | "end_date">>
): Promise<DBProject | null> {
  return queryOne<DBProject>(`
    UPDATE projects
    SET
      name           = COALESCE($2, name),
      description    = COALESCE($3, description),
      status         = COALESCE($4, status),
      price          = COALESCE($5, price),
      price_approved = COALESCE($6, price_approved),
      start_date     = COALESCE($7, start_date),
      end_date       = COALESCE($8, end_date)
    WHERE id = $1
    RETURNING *
  `, [
    id,
    data.name          ?? null,
    data.description   ?? null,
    data.status        ?? null,
    data.price         ?? null,
    data.price_approved ?? null,
    data.start_date    ?? null,
    data.end_date      ?? null,
  ]);
}