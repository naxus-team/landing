import { query, queryOne } from "./client";

export type DBMilestone = {
  id:                string;
  project_id:        string;
  title:             string;
  description:       string | null;
  status:            string;
  requires_approval: boolean;
  order_index:       number;
  due_date:          string | null;
  completed_at:      string | null;
  created_at:        string;
  updated_at:        string;
};

export async function findMilestonesByProject(projectId: string): Promise<DBMilestone[]> {
  return query<DBMilestone>(
    "SELECT * FROM milestones WHERE project_id = $1 ORDER BY order_index ASC",
    [projectId]
  );
}

export async function createMilestone(data: {
  project_id:         string;
  title:              string;
  description?:       string;
  requires_approval?: boolean;
  order_index:        number;
  due_date?:          string;
}): Promise<DBMilestone> {
  const milestone = await queryOne<DBMilestone>(`
    INSERT INTO milestones (project_id, title, description, requires_approval, order_index, due_date)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `, [
    data.project_id,
    data.title,
    data.description       ?? null,
    data.requires_approval ?? false,
    data.order_index,
    data.due_date          ?? null,
  ]);
  return milestone!;
}

export async function updateMilestone(
  id: string,
  data: Partial<Pick<DBMilestone, "title" | "description" | "status" | "requires_approval" | "order_index" | "due_date" | "completed_at">>
): Promise<DBMilestone | null> {
  return queryOne<DBMilestone>(`
    UPDATE milestones
    SET
      title              = COALESCE($2, title),
      description        = COALESCE($3, description),
      status             = COALESCE($4, status),
      requires_approval  = COALESCE($5, requires_approval),
      order_index        = COALESCE($6, order_index),
      due_date           = COALESCE($7, due_date),
      completed_at       = COALESCE($8, completed_at)
    WHERE id = $1
    RETURNING *
  `, [
    id,
    data.title             ?? null,
    data.description       ?? null,
    data.status            ?? null,
    data.requires_approval ?? null,
    data.order_index       ?? null,
    data.due_date          ?? null,
    data.completed_at      ?? null,
  ]);
}

export async function deleteMilestone(id: string): Promise<void> {
  await query("DELETE FROM milestones WHERE id = $1", [id]);
}