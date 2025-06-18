import { getPool } from "../db";

export async function getClientsService(name?: string) {
  let query = `
    SELECT id AS cid, name
    FROM clients
  `;
  const params: any[] = [];

  if (name) {
    query += ` WHERE name ILIKE $1`;
    params.push(`%${name}%`);
  }

  query += ` ORDER BY name`;

  const pool = await getPool();
  const result = await pool.query(query, params);
  return result.rows ?? [];
}
