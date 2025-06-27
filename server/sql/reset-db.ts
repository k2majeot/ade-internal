// reset-db.ts – full reset including Cognito users

import { getPool } from "@/db";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  CognitoIdentityProviderClient,
  ListUsersCommand,
  AdminDeleteUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import config from "@/config";

const pool = await getPool();
const here = dirname(fileURLToPath(import.meta.url));

// ─────────────────────────────────────────────────────────────
// 1. Delete Cognito Users
// ─────────────────────────────────────────────────────────────

console.log("🧹 Deleting users from Cognito…");

const cognitoClient = new CognitoIdentityProviderClient({
  region: config.cognito.region,
});

async function deleteAllCognitoUsers(): Promise<void> {
  const userPoolId = config.cognito.userPoolId;

  const listCommand = new ListUsersCommand({
    UserPoolId: userPoolId,
    Limit: 60,
  });

  const response = await cognitoClient.send(listCommand);
  const users = response.Users ?? [];

  for (const user of users) {
    const username = user.Username;
    if (!username) continue;

    const deleteCommand = new AdminDeleteUserCommand({
      UserPoolId: userPoolId,
      Username: username,
    });

    await cognitoClient.send(deleteCommand);
    console.log(`🗑️ Deleted: ${username}`);
  }

  console.log(`✅ Deleted ${users.length} Cognito user(s).`);
}

await deleteAllCognitoUsers();

// ─────────────────────────────────────────────────────────────
// 2. Drop Tables
// ─────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────
// 3. Recreate schema
// ─────────────────────────────────────────────────────────────

console.log("🛠️  Re-creating tables …");
const createModule = await import(join(here, "./create-tables.ts"));
if (typeof createModule.default === "function") {
  await createModule.default();
}

// ─────────────────────────────────────────────────────────────
// 4. Verify
// ─────────────────────────────────────────────────────────────

const { rows: empty } = await pool.query("SELECT * FROM clients");
console.log("Clients before seeding:", empty.length);

// ─────────────────────────────────────────────────────────────
// 5. Run Seeder
// ─────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────
// 6. Confirm
// ─────────────────────────────────────────────────────────────

const { rows: seeded } = await pool.query(
  "SELECT id, fname, lname FROM clients ORDER BY id"
);
console.log(
  "Clients after seeding:",
  seeded.length,
  seeded.map((c) => `${c.fname} ${c.lname}`)
);

console.log("✅ Database and Cognito reset complete.");
await pool.end();
process.exit(0);
