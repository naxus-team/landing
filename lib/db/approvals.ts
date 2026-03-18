import { query, queryOne } from "./client";

export type DBApproval = {
  id:           string;
  project_id:   string;
  milestone_id: string | null;
  type:         string;
  status:       string;
  requested_by: string | null;
  approved_by:  string | null;
  note:         string | null;
  created_at:   string;
  updated_at:   string;
};

export type DBApprovalWithMeta = DBApproval & {
  milestone_title:   string | null;
  requested_by_name: string | null;
  approved_by_name:  string | null;
};

export async function findApprovalsByProject(projectId: string): Promise<DBApprovalWithMeta[]> {
  return query<DBApprovalWithMeta>(`
    SELECT
      a.*,
      m.title  AS milestone_title,
      r.name   AS requested_by_name,
      ap.name  AS approved_by_name
    FROM approvals a
    LEFT JOIN milestones m ON m.id = a.milestone_id
    LEFT JOIN users r      ON r.id = a.requested_by
    LEFT JOIN users ap     ON ap.id = a.approved_by
    WHERE a.project_id = $1
    ORDER BY a.created_at DESC
  `, [projectId]);
}

export async function createApproval(data: {
  project_id:   string;
  milestone_id?: string;
  type:          string;
  requested_by:  string;
  note?:         string;
}): Promise<DBApproval> {
  const approval = await queryOne<DBApproval>(`
    INSERT INTO approvals (project_id, milestone_id, type, requested_by, note)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `, [
    data.project_id,
    data.milestone_id ?? null,
    data.type,
    data.requested_by,
    data.note         ?? null,
  ]);
  return approval!;
}

export async function updateApproval(
  id:   string,
  data: {
    status:      string;
    approved_by?: string;
    note?:        string;
  }
): Promise<DBApproval | null> {
  return queryOne<DBApproval>(`
    UPDATE approvals
    SET
      status      = $2,
      approved_by = COALESCE($3, approved_by),
      note        = COALESCE($4, note)
    WHERE id = $1
    RETURNING *
  `, [id, data.status, data.approved_by ?? null, data.note ?? null]);
}