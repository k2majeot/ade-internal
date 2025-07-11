// seed.ts  – works with lookup-table schema (FKs instead of raw strings)
import { getPool } from "@/db";
import { Present, Status, Side, Role } from "@shared/types";
import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
  AdminAddUserToGroupCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import config from "@/config";
import { subDays, formatISO } from "date-fns";

const pool = await getPool();
const cognito = new CognitoIdentityProviderClient({
  region: config.cognito.region,
});

/* ──────────────────────────────── helpers ──────────────────────────────── */
const today = new Date();
const dates = [0, 1, 2].map((d) =>
  formatISO(subDays(today, d), { representation: "date" })
);
const rand = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const log = (m: string) => console.log("✅", m);

const statusValues = Object.values(Status) as Status[];
const presentValues = Object.values(Present) as Present[];
const sideValues = Object.values(Side) as Side[];
const roleValues = Object.values(Role) as Role[];

/* ──────────────────────── lookup-table id helpers ──────────────────────── */
async function idFor(table: string, code: string): Promise<number> {
  const { rows } = await pool.query(
    `SELECT id FROM ${table} WHERE code = $1 LIMIT 1`,
    [code]
  );
  if (!rows[0]) throw new Error(`Code "${code}" not found in ${table}`);
  return rows[0].id as number;
}

/* ────────────────────────────────── clients ────────────────────────────── */
async function seedClients() {
  const names: [string, string][] = [
    ["Alice", "Anderson"],
    ["Bob", "Brown"],
    ["Charlie", "Clark"],
    ["Diana", "Davis"],
    ["Ethan", "Evans"],
    ["Fiona", "Frost"],
    ["George", "Gibson"],
    ["Hannah", "Hughes"],
    ["Ivan", "Ingram"],
    ["Julia", "Jones"],
  ];

  for (const [fname, lname] of names) {
    const statusId = await idFor("statuses", rand(statusValues));
    const sideId = await idFor("sides", rand(sideValues));

    await pool.query(
      `INSERT INTO clients (fname, lname, status_id, side_id)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT DO NOTHING`,
      [fname, lname, statusId, sideId]
    );
  }
  const { rows } = await pool.query("SELECT * FROM clients ORDER BY id");
  log(`Inserted ${rows.length} clients.`);
}

/* ─────────────────────────────────── users ─────────────────────────────── */
async function seedUsers() {
  const users = [
    { fname: "Admin", lname: "User", username: "admin" },
    { fname: "Tina", lname: "Therapist", username: "tina" },
    { fname: "Mike", lname: "Manager", username: "mike" },
    { fname: "Sam", lname: "Staff", username: "sam" },
  ];

  for (const u of users) {
    const side = rand(sideValues);
    const role = rand(roleValues);
    const status = rand(statusValues);

    const sideId = await idFor("sides", side);
    const roleId = await idFor("roles", role);
    const statusId = await idFor("statuses", status);

    // 1️⃣ insert into Postgres
    await pool.query(
      `INSERT INTO users (fname, lname, username, side_id, role_id, status_id)
       VALUES ($1,$2,$3,$4,$5,$6)
       ON CONFLICT DO NOTHING`,
      [u.fname, u.lname, u.username, sideId, roleId, statusId]
    );

    // 2️⃣ create/update user in Cognito
    try {
      await cognito.send(
        new AdminCreateUserCommand({
          UserPoolId: config.cognito.userPoolId,
          Username: u.username,
          TemporaryPassword: config.cognito.tempPassword,
          MessageAction: "SUPPRESS",
          UserAttributes: [
            { Name: "email", Value: `${u.username}@placeholder.com` },
            { Name: "email_verified", Value: "true" },
          ],
        })
      );
    } catch (err: any) {
      if (err.name !== "UsernameExistsException") throw err;
    }

    // 3️⃣ add user to Cognito group (role)
    await cognito.send(
      new AdminAddUserToGroupCommand({
        UserPoolId: config.cognito.userPoolId,
        Username: u.username,
        GroupName: role, // role code = group name
      })
    );
  }

  const { rows } = await pool.query("SELECT * FROM users ORDER BY id");
  log(`Inserted ${rows.length} users (and synced to Cognito).`);
}

/* ─────────────────────────────────── goals ─────────────────────────────── */
async function seedGoals() {
  await pool.query(`
    INSERT INTO goals (cid,title,objective,instructions,reinforcer) VALUES
      (1,'Reading Practice','Improve comprehension','Read a short book','Stickers'),
      (1,'Math Drills','Addition fluency','Do 10 flashcards','Play time'),
      (1,'Social Skills','Initiate conversation','Practice greetings','High five'),
      (2,'Writing Letters','Improve handwriting','Write 3 sentences','Coloring time'),
      (2,'Counting Objects','Count to 20','Use beans','Tokens'),
      (2,'Listening Task','Auditory memory','Follow 3-step command','Music time'),
      (3,'Art Time','Fine-motor control','Colour within lines','Stamps'),
      (3,'Puzzle Solving','Visual logic','Complete 10-piece puzzle','Cheering'),
      (3,'Music ID','Auditory discrimination','Identify 3 instruments','Dance break')
    ON CONFLICT DO NOTHING;
  `);
  log("Inserted 9 goals.");
}

/* ───────────────────────────────── goal_data ───────────────────────────── */
async function seedGoalData() {
  const activities = [
    "Flashcards",
    "Reading",
    "Colouring",
    "Puzzle",
    "Music",
    "Simon Says",
  ];
  const comments = [
    "Did well",
    "Needed help",
    "Refused",
    "Distracted",
    "Excellent",
  ];
  const levels = ["I", "VP", "PP", "GP", "R", "NR"];
  const initials = ["AB", "CD", "EF"];

  for (let gid = 1; gid <= 9; gid++) {
    for (const date of dates) {
      await pool.query(
        `INSERT INTO goal_data (gid,goal_data_date,activity,comments,prompt_level,initial)
         VALUES ($1,$2,$3,$4,$5,$6)
         ON CONFLICT (gid,goal_data_date) DO NOTHING`,
        [
          gid,
          date,
          rand(activities),
          rand(comments),
          rand(levels),
          rand(initials),
        ]
      );
    }
  }
  log("Inserted goal_data for last 3 days.");
}

/* ───────────────────────────── client_roster ───────────────────────────── */
async function seedClientRoster() {
  const activeCids = [4, 5, 6];
  const endedCids = [1, 2, 3, 7, 8, 9, 10];

  let total = 0;
  for (const cid of activeCids) {
    await pool.query(
      `INSERT INTO client_roster (cid,start_date,end_date)
       VALUES ($1,$2,NULL)
       ON CONFLICT (cid,start_date) DO NOTHING`,
      [cid, dates[0]]
    );
    total++;
  }
  for (const [i, cid] of endedCids.entries()) {
    const start = dates[i % dates.length];
    await pool.query(
      `INSERT INTO client_roster (cid,start_date,end_date)
       VALUES ($1,$2,$2)
       ON CONFLICT (cid,start_date) DO NOTHING`,
      [cid, start]
    );
    total++;
  }
  log(`Inserted ${total} client_roster rows.`);
  return {
    [dates[0]]: [1, 2, 4, 5, 6],
    [dates[1]]: [2, 3, 7],
    [dates[2]]: [1, 3, 8],
  };
}

/* ───────────────────────────────── attendance ──────────────────────────── */
async function seedAttendance(roster: Record<string, number[]>) {
  let total = 0;
  for (const [date, cids] of Object.entries(roster)) {
    for (const cid of cids) {
      const presentId = await idFor("presents", rand(presentValues));

      await pool.query(
        `INSERT INTO attendance (cid, present_id, attendance_date)
         VALUES ($1,$2,$3)
         ON CONFLICT (cid,attendance_date) DO NOTHING`,
        [cid, presentId, date]
      );
      total++;
    }
  }
  log(`Inserted ${total} attendance rows.`);
}

/* ────────────────────────────────── runner ─────────────────────────────── */
export async function runSeed() {
  console.log("🌱  Seeding…");
  await seedClients();
  await seedUsers();
  await seedGoals();
  await seedGoalData();
  const roster = await seedClientRoster();
  await seedAttendance(roster);
  console.log("🌾  Seeding complete.");
}

if (import.meta.url === process.argv[1] || import.meta.main) {
  runSeed()
    .catch((err) => {
      console.error("❌ Seed failed:", err);
      process.exit(1);
    })
    .finally(async () => {
      await pool.end();
    });
}
