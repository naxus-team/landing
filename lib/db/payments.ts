import { query, queryOne } from "./client";

export type DBPayment = {
  id:          string;
  project_id:  string;
  amount:      number;
  percentage:  number | null;
  description: string | null;
  status:      string;
  due_date:    string | null;
  paid_at:     string | null;
  created_at:  string;
};

export async function findPaymentsByProject(projectId: string): Promise<DBPayment[]> {
  return query<DBPayment>(
    "SELECT * FROM payments WHERE project_id = $1 ORDER BY created_at ASC",
    [projectId]
  );
}

export async function createPayment(data: {
  project_id:  string;
  amount:      number;
  percentage?: number;
  description?: string;
  due_date?:   string;
}): Promise<DBPayment> {
  const payment = await queryOne<DBPayment>(`
    INSERT INTO payments (project_id, amount, percentage, description, due_date)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `, [
    data.project_id,
    data.amount,
    data.percentage  ?? null,
    data.description ?? null,
    data.due_date    ?? null,
  ]);
  return payment!;
}

export async function updatePayment(
  id:   string,
  data: Partial<Pick<DBPayment, "status" | "paid_at">>
): Promise<DBPayment | null> {
  return queryOne<DBPayment>(`
    UPDATE payments
    SET
      status  = COALESCE($2, status),
      paid_at = COALESCE($3, paid_at)
    WHERE id = $1
    RETURNING *
  `, [id, data.status ?? null, data.paid_at ?? null]);
}