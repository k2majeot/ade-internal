#!/usr/bin/env ts-node
/* reset-db.ts – full reset with plural table names & prompt_levels lookup */

import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { subDays, formatISO } from "date-fns";
import {
  CognitoIdentityProviderClient,
  ListUsersCommand,
  AdminDeleteUserCommand,
  AdminCreateUserCommand,
  AdminAddUserToGroupCommand,
} from "@aws-sdk/client-cognito-identity-provider";

import { getPool } from "@/db";
import config from "@/config";

const pool = await getPool();
const cg = new CognitoIdentityProviderClient({ region: config.cognito.region });

/* ───── lookup constants (plural table names) ───── */
const SIDES = [
  { code: "one", label: "ADE" },
  { code: "two", label: "ADE TOO!" },
  { code: "both", label: "Both Sides" },
] as const;

const ROLES = [
  { code: "admin", label: "Admin", level: 100 },
  { code: "user", label: "User", level: 1 },
] as const;

const STATUSES = [
  { code: "active", label: "Active" },
  { code: "deactivated", label: "Deactivated" },
] as const;

const ATTENDANCE_STATUSES = [
  { code: "present", label: "Present" },
  { code: "absent", label: "Absent" },
  { code: "not_scheduled", label: "Not Scheduled" },
] as const;

const PROMPT_LEVELS = [
  { code: "independent", label: "Independent" },
  { code: "gestural_prompt", label: "Gestural Prompt" },
  { code: "verbal_prompt", label: "Verbal Prompt" },
  { code: "physical_prompt", label: "Physical Prompt" },
  { code: "hand_over_hand", label: "Hand-Over-Hand" },
  { code: "no_response", label: "No Response" },
  { code: "refused", label: "Refused" },
] as const;

/* ───── generic helpers ───── */
const banner = (m: string) =>
  console.log(`\n${"=".repeat(42)}\n${m}\n${"=".repeat(42)}`);
const rand = <T>(arr: readonly T[]) =>
  arr[Math.floor(Math.random() * arr.length)];
const today = new Date();
const dates = [0, 1, 2].map((d) =>
  formatISO(subDays(today, d), { representation: "date" })
);

/* 1. purge Cognito ----------------------------------------------------- */
async function purgeCognito() {
  banner("🧹 Purging Cognito users");
  const { Users } = await cg.send(
    new ListUsersCommand({ UserPoolId: config.cognito.userPoolId, Limit: 60 })
  );
  for (const u of Users ?? []) {
    if (!u.Username) continue;
    await cg.send(
      new AdminDeleteUserCommand({
        UserPoolId: config.cognito.userPoolId,
        Username: u.Username,
      })
    );
    console.log("🗑️  Deleted:", u.Username);
  }
  console.log(`✅  Deleted ${Users?.length ?? 0} Cognito user(s).`);
}

/* 2. drop tables ------------------------------------------------------- */
async function dropAllTables() {
  banner("🔨 Dropping ALL tables");
  await pool.query(`
    DROP TABLE IF EXISTS
      client_rosters, goal_data, goals, attendances,
      clients, users,
      sides, roles, statuses, attendance_statuses, prompt_levels,
      sessions
    CASCADE;`);
  console.log("✅  Tables dropped.");
}

/* 3. create schema ----------------------------------------------------- */
async function createSchema() {
  banner("🛠️  Creating schema");
  await pool.query(`
    /* lookup tables */
    CREATE TABLE sides (id SERIAL PRIMARY KEY, code TEXT UNIQUE, label TEXT,
                        created_at TIMESTAMP DEFAULT NOW(), updated_at TIMESTAMP DEFAULT NOW());
    CREATE TABLE roles (id SERIAL PRIMARY KEY, code TEXT UNIQUE, label TEXT, level INT,
                        created_at TIMESTAMP DEFAULT NOW(), updated_at TIMESTAMP DEFAULT NOW());
    CREATE TABLE statuses (id SERIAL PRIMARY KEY, code TEXT UNIQUE, label TEXT,
                           created_at TIMESTAMP DEFAULT NOW(), updated_at TIMESTAMP DEFAULT NOW());
    CREATE TABLE attendance_statuses (id SERIAL PRIMARY KEY, code TEXT UNIQUE, label TEXT,
                                      created_at TIMESTAMP DEFAULT NOW(), updated_at TIMESTAMP DEFAULT NOW());
    CREATE TABLE prompt_levels (id SERIAL PRIMARY KEY, code TEXT UNIQUE, label TEXT,
                                created_at TIMESTAMP DEFAULT NOW(), updated_at TIMESTAMP DEFAULT NOW());

    /* domain tables */
    CREATE TABLE clients (
      id SERIAL PRIMARY KEY,
      fname TEXT, lname TEXT,
      side_id   INT REFERENCES sides(id),
      status_id INT REFERENCES statuses(id),
      created_at TIMESTAMP DEFAULT NOW(), updated_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      fname TEXT, lname TEXT, username TEXT UNIQUE,
      side_id INT REFERENCES sides(id),
      role_id INT REFERENCES roles(id),
      status_id INT REFERENCES statuses(id),
      created_at TIMESTAMP DEFAULT NOW(), updated_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE goals (
      id SERIAL PRIMARY KEY,
      client_id INT REFERENCES clients(id) ON DELETE CASCADE,
      title TEXT, objective TEXT, instructions TEXT, reinforcer TEXT,
      created_at TIMESTAMP DEFAULT NOW(), updated_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE client_rosters (
      client_id INT REFERENCES clients(id) ON DELETE CASCADE,
      start_date DATE, end_date DATE,
      created_at TIMESTAMP DEFAULT NOW(), updated_at TIMESTAMP DEFAULT NOW(),
      PRIMARY KEY (client_id, start_date)
    );

    CREATE TABLE attendances (
      id SERIAL PRIMARY KEY,
      client_id INT REFERENCES clients(id) ON DELETE CASCADE,
      attendance_date DATE,
      attendance_status_id INT REFERENCES attendance_statuses(id),
      created_at TIMESTAMP DEFAULT NOW(), updated_at TIMESTAMP DEFAULT NOW(),
      UNIQUE (client_id, attendance_date)
    );

    CREATE TABLE goal_data (
      id SERIAL PRIMARY KEY,
      goal_id INT REFERENCES goals(id) ON DELETE CASCADE,
      goal_data_date DATE,
      activity TEXT, comments TEXT,
      prompt_level_id INT REFERENCES prompt_levels(id),
      initial TEXT,
      created_at TIMESTAMP DEFAULT NOW(), updated_at TIMESTAMP DEFAULT NOW(),
      UNIQUE (goal_id, goal_data_date)
    );

    CREATE TABLE sessions (
      sid VARCHAR PRIMARY KEY,
      sess JSONB NOT NULL,
      expire TIMESTAMP NOT NULL
    );

    /* updated_at trigger */
    CREATE OR REPLACE FUNCTION touch_updated_at()
    RETURNS TRIGGER AS $$ BEGIN NEW.updated_at=NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql;

    DO $$
    DECLARE t RECORD; BEGIN
      FOR t IN SELECT tablename FROM pg_tables WHERE schemaname='public' LOOP
        IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname='trg_'||t.tablename||'_updated')
        THEN EXECUTE format(
          'CREATE TRIGGER trg_%s_updated BEFORE UPDATE ON %I
           FOR EACH ROW EXECUTE FUNCTION touch_updated_at();',
          t.tablename, t.tablename);
        END IF;
      END LOOP;
    END$$;
  `);
  console.log("✅  Schema created.");
}

/* 4. seed -------------------------------------------------------------- */
async function seed() {
  banner("🌱 Seeding lookup tables");
  const bulk = async (
    table: string,
    rows: readonly Record<string, string | number>[]
  ) => {
    const columns = Object.keys(rows[0]);
    const values = rows
      .map(
        (row) =>
          `(${columns
            .map((col) => `'${String(row[col]).replace(/'/g, "''")}'`)
            .join(",")})`
      )
      .join(",");

    await pool.query(
      `INSERT INTO ${table} (${columns.join(", ")}) VALUES ${values};`
    );
  };

  await bulk("sides", SIDES);
  await bulk("roles", ROLES);
  await bulk("statuses", STATUSES);
  await bulk("attendance_statuses", ATTENDANCE_STATUSES);
  await bulk("prompt_levels", PROMPT_LEVELS);

  const idFor = async (table: string, code: string) =>
    (await pool.query(`SELECT id FROM ${table} WHERE code=$1`, [code])).rows[0]
      ?.id ??
    (() => {
      throw new Error(`code ${code} missing in ${table}`);
    })();

  banner("🌱 Seeding admin user");
  await pool.query(
    `INSERT INTO users(fname,lname,username,side_id,role_id,status_id)
     VALUES('Admin','User','admin',
            $1,$2,$3)`,
    [
      await idFor("sides", "both"),
      await idFor("roles", "admin"),
      await idFor("statuses", "active"),
    ]
  );

  /* sync to Cognito */
  try {
    await cg.send(
      new AdminCreateUserCommand({
        UserPoolId: config.cognito.userPoolId,
        Username: "admin",
        TemporaryPassword: config.cognito.tempPassword,
        MessageAction: "SUPPRESS",
        UserAttributes: [
          { Name: "email", Value: "admin@example.com" },
          { Name: "email_verified", Value: "true" },
        ],
      })
    );
  } catch (e: any) {
    if (e.name !== "UsernameExistsException") throw e;
  }

  await cg.send(
    new AdminAddUserToGroupCommand({
      UserPoolId: config.cognito.userPoolId,
      Username: "admin",
      GroupName: "Admin",
    })
  );

  banner("🌱 Seeding demo data");
  const clientNames: [string, string][] = [
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

  for (const [f, l] of clientNames) {
    await pool.query(
      `INSERT INTO clients(fname,lname,side_id,status_id) VALUES($1,$2,$3,$4)`,
      [
        f,
        l,
        await idFor("sides", rand(SIDES).code),
        await idFor("statuses", rand(STATUSES).code),
      ]
    );
  }

  await pool.query(`
    INSERT INTO goals(client_id,title,objective,instructions,reinforcer) VALUES
      (1,'Reading Practice','Improve comprehension','Read a short book','Stickers'),
      (1,'Math Drills','Addition fluency','Do 10 flashcards','Play time'),
      (1,'Social Skills','Initiate conversation','Practice greetings','High five'),
      (2,'Writing Letters','Improve handwriting','Write 3 sentences','Coloring time'),
      (2,'Counting Objects','Count to 20','Use beans','Tokens'),
      (2,'Listening Task','Auditory memory','Follow 3-step command','Music time'),
      (3,'Art Time','Fine-motor control','Colour within lines','Stamps'),
      (3,'Puzzle Solving','Visual logic','Complete 10-piece puzzle','Cheering'),
      (3,'Music ID','Auditory discrimination','Identify 3 instruments','Dance break');
  `);

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
  const initials = ["AB", "CD", "EF"];

  for (let gid = 1; gid <= 9; gid++) {
    for (const d of dates) {
      await pool.query(
        `INSERT INTO goal_data(goal_id,goal_data_date,activity,comments,prompt_level_id,initial)
         VALUES($1,$2,$3,$4,$5,$6)`,
        [
          gid,
          d,
          rand(activities),
          rand(comments),
          await idFor("prompt_levels", rand(PROMPT_LEVELS).code),
          rand(initials),
        ]
      );
    }
  }

  const roster: { [k: string]: number[] } = {
    [dates[0]]: [1, 2, 4, 5, 6],
    [dates[1]]: [2, 3, 7],
    [dates[2]]: [1, 3, 8],
  };

  for (const [date, cids] of Object.entries(roster)) {
    for (const cid of cids) {
      await pool.query(
        `INSERT INTO client_rosters(client_id,start_date,end_date)
         VALUES($1,$2,NULL) ON CONFLICT DO NOTHING`,
        [cid, date]
      );
      await pool.query(
        `INSERT INTO attendances(client_id,attendance_date,attendance_status_id)
         VALUES($1,$2,$3) ON CONFLICT DO NOTHING`,
        [
          cid,
          date,
          await idFor("attendance_statuses", rand(ATTENDANCE_STATUSES).code),
        ]
      );
    }
  }
  console.log("✅  Demo data seeded");
}

/* 5. verify ------------------------------------------------------------- */
async function verify() {
  banner("🔍 Verification");
  console.table((await pool.query("SELECT id,username FROM users")).rows);
  console.table(
    (await pool.query("SELECT id,fname,lname FROM clients LIMIT 5")).rows
  );
}

/* 🏁 MAIN --------------------------------------------------------------- */
(async () => {
  try {
    await purgeCognito();
    await dropAllTables();
    await createSchema();
    await seed();
    await verify();
    banner("🎉  Full reset complete");
    process.exit(0);
  } catch (err) {
    console.error("❌  Reset failed:", err);
    process.exit(1);
  } finally {
    await pool.end().catch(() => {});
  }
})();
