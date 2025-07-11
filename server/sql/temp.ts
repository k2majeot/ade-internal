import { getPool } from "@/db";

const pool = await getPool();

(async () => {
  try {
    const result = await pool.query(`SELECT * FROM users;`);
    console.log("👥 Users:");
    console.table(result.rows);
  } catch (err: any) {
    console.error("❌ Failed to query users:", err.message);
  } finally {
    await pool.end();
  }
})();
