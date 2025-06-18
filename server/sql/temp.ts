import { getPool } from "@/db";

const pool = await getPool();

const result = await pool.query(
  "TRUNCATE TABLE users RESTART IDENTITY CASCADE;"
);
console.log("📋 Table:");
console.table(result.rows);

await pool.end();
