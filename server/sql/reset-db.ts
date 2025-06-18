// reset-db.ts – drop → recreate → seed using explicit import
// ------------------------------------------------------------

import { getPool } from "@/db";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const pool = await getPool();
const here = dirname(fileURLToPath(import.meta.url));

/* ─────────────── drop all tables ─────────────── */
console.log("🔨 Dropping tables …");
await pool.query(`
  DROP TABLE IF EXISTS
    client_roster,
    goal_data,
    goals,
    attendance,
    clients,
    users
  CASCADE;
`);

/* ─────────────── recreate schema ─────────────── */
console.log("🛠️  Re-creating tables …");
const createModule = await import(join(here, "./create-tables.ts"));
if (typeof createModule.default === "function") {
  await createModule.default();
}

/* ─────────────── verify empty DB ─────────────── */
const { rows: empty } = await pool.query("SELECT * FROM clients");
console.log("Clients before seeding:", empty.length);

/* ─────────────── run seed.ts properly ─────────────── */
console.log("🌱 Seeding …");
try {
  const seedModule = await import(join(here, "./seed.ts"));
  if (typeof seedModule.runSeed === "function") {
    await seedModule.runSeed();
  } else {
    throw new Error("runSeed() not found in seed.ts");
  }
} catch (err) {
  console.error("❌ Error during seeding:", err);
  process.exit(1);
}

/* ─────────────── confirm results ─────────────── */
const { rows: seeded } = await pool.query(
  "SELECT id, fname, lname FROM clients ORDER BY id"
);
console.log(
  "Clients after seeding:",
  seeded.length,
  seeded.map((c) => `${c.fname} ${c.lname}`)
);

/* ─────────────── wrap up ─────────────── */
console.log("✅ Database reset complete.");
await pool.end();
process.exit(0);
