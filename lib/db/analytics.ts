import { query, queryOne } from "./client";

export type ProjectStats = {
  total:    number;
  active:   number;
  completed: number;
  draft:    number;
};

export type MilestoneStats = {
  total:     number;
  completed: number;
  pending:   number;
  in_progress: number;
};

export type MonthlyProject = {
  month:  string;
  count:  number;
};

export type RoleDistribution = {
  role:  string;
  count: number;
};

export async function getProjectStats(): Promise<ProjectStats> {
  const result = await queryOne<ProjectStats>(`
    SELECT
      COUNT(*)::int                                             AS total,
      COUNT(*) FILTER (WHERE status = 'active')::int           AS active,
      COUNT(*) FILTER (WHERE status = 'completed')::int        AS completed,
      COUNT(*) FILTER (WHERE status = 'draft')::int            AS draft
    FROM projects
  `);
  return result ?? { total: 0, active: 0, completed: 0, draft: 0 };
}

export async function getMilestoneStats(): Promise<MilestoneStats> {
  const result = await queryOne<MilestoneStats>(`
    SELECT
      COUNT(*)::int                                                 AS total,
      COUNT(*) FILTER (WHERE status = 'completed')::int            AS completed,
      COUNT(*) FILTER (WHERE status = 'pending')::int              AS pending,
      COUNT(*) FILTER (WHERE status = 'in_progress')::int          AS in_progress
    FROM milestones
  `);
  return result ?? { total: 0, completed: 0, pending: 0, in_progress: 0 };
}

export async function getMonthlyProjects(): Promise<MonthlyProject[]> {
  return query<MonthlyProject>(`
    SELECT
      TO_CHAR(created_at, 'Mon YY') AS month,
      COUNT(*)::int                 AS count
    FROM projects
    WHERE created_at >= NOW() - INTERVAL '6 months'
    GROUP BY TO_CHAR(created_at, 'Mon YY'), DATE_TRUNC('month', created_at)
    ORDER BY DATE_TRUNC('month', created_at) ASC
  `);
}

export async function getRoleDistribution(): Promise<RoleDistribution[]> {
  return query<RoleDistribution>(`
    SELECT
      role,
      COUNT(*)::int AS count
    FROM users
    GROUP BY role
    ORDER BY count DESC
  `);
}

export async function getRevenueStats() {
  const result = await queryOne<{
    total_budget:  number;
    total_paid:    number;
    total_pending: number;
  }>(`
    SELECT
      COALESCE(SUM(p.price), 0)::float                                          AS total_budget,
      COALESCE((SELECT SUM(amount) FROM payments WHERE status = 'paid'), 0)::float  AS total_paid,
      COALESCE((SELECT SUM(amount) FROM payments WHERE status IN ('pending','requested')), 0)::float AS total_pending
    FROM projects p
  `);
  return result ?? { total_budget: 0, total_paid: 0, total_pending: 0 };
}