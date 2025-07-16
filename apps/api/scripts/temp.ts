import { getPool } from "@/db";

async function listAllContacts() {
  const pool = await getPool();

  try {
    const { rows } = await pool.query(`
      SELECT id, fname, lname, email, phone, message, created_at
      FROM contact
      ORDER BY created_at DESC
    `);
    console.log(`📋 Found ${rows.length} contacts:`);
    console.table(rows);
  } catch (err: any) {
    console.error("❌ Error querying contacts:", err.message);
  } finally {
    await pool.end();
  }
}
console.log("test cloudflare pages watch");

listAllContacts();
