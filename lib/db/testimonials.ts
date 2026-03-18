import { query } from "./client";

export type DBTestimonial = {
  id:           string;
  quote:        string;
  author_name:  string;
  author_title: string | null;
  author_image: string | null;
  company_id:   string | null;
  company_name: string | null;
  company_logo: string | null;
  is_active:    boolean;
  order_index:  number;
};

export async function findActiveTestimonials(): Promise<DBTestimonial[]> {
  return query<DBTestimonial>(`
    SELECT
      t.id,
      t.quote,
      t.author_name,
      t.author_title,
      t.author_image,
      t.company_id,
      c.name     AS company_name,
      c.logo_url AS company_logo
    FROM testimonials t
    LEFT JOIN companies c ON c.id = t.company_id
    WHERE t.is_active = true
    ORDER BY t.order_index ASC
  `);
}

export async function createTestimonial(data: {
  quote:        string;
  author_name:  string;
  author_title?: string;
  author_image?: string;
  company_id?:  string;
  client_id?:   string;
  order_index?: number;
}): Promise<DBTestimonial> {
  const result = await query<DBTestimonial>(`
    INSERT INTO testimonials
      (quote, author_name, author_title, author_image, company_id, client_id, order_index)
    VALUES ($1,$2,$3,$4,$5,$6,$7)
    RETURNING *
  `, [
    data.quote,
    data.author_name,
    data.author_title  ?? null,
    data.author_image  ?? null,
    data.company_id    ?? null,
    data.client_id     ?? null,
    data.order_index   ?? 0,
  ]);
  return result[0];
}