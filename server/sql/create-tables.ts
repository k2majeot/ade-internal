// create-tables.ts – lookup tables + timestamps + auto-update triggers
import { getPool } from "@/db";

const pool = await getPool();

console.log("🛠️  Creating tables (with timestamps)…");

/* -------------------------------------------------- */
/* 1. Create lookup/reference tables                  */
/* -------------------------------------------------- */
await pool.query(`
  CREATE TABLE IF NOT EXISTS sides (
    id         SERIAL PRIMARY KEY,
    code       TEXT UNIQUE NOT NULL,
    label      TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS roles (
    id         SERIAL PRIMARY KEY,
    code       TEXT UNIQUE NOT NULL,
    label      TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS statuses (
    id         SERIAL PRIMARY KEY,
    code       TEXT UNIQUE NOT NULL,
    label      TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS presents (
    id         SERIAL PRIMARY KEY,
    code       TEXT UNIQUE NOT NULL,
    label      TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );
`);

/* -------------------------------------------------- */
/* 2. Create domain tables                            */
/* -------------------------------------------------- */
await pool.query(`
  CREATE TABLE IF NOT EXISTS clients (
    id         SERIAL PRIMARY KEY,
    fname      TEXT NOT NULL,
    lname      TEXT NOT NULL,
    side_id    INT  NOT NULL REFERENCES sides(id),
    status_id  INT  NOT NULL REFERENCES statuses(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS users (
    id         SERIAL PRIMARY KEY,
    fname      TEXT NOT NULL,
    lname      TEXT NOT NULL,
    username   TEXT NOT NULL UNIQUE,
    side_id    INT NOT NULL REFERENCES sides(id),
    role_id    INT NOT NULL REFERENCES roles(id),
    status_id  INT NOT NULL REFERENCES statuses(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS goals (
    id           SERIAL PRIMARY KEY,
    cid          INT REFERENCES clients(id) ON DELETE CASCADE,
    title        TEXT NOT NULL,
    objective    TEXT,
    instructions TEXT,
    reinforcer   TEXT,
    created_at   TIMESTAMP DEFAULT NOW(),
    updated_at   TIMESTAMP DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS client_roster (
    cid         INT REFERENCES clients(id) ON DELETE CASCADE,
    start_date  DATE NOT NULL,
    end_date    DATE,
    created_at  TIMESTAMP DEFAULT NOW(),
    updated_at  TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (cid, start_date)
  );

  CREATE TABLE IF NOT EXISTS attendance (
    id               SERIAL PRIMARY KEY,
    cid              INT REFERENCES clients(id) ON DELETE CASCADE,
    attendance_date  DATE NOT NULL,
    attendance_status_id       INT NOT NULL REFERENCES presents(id),
    created_at       TIMESTAMP DEFAULT NOW(),
    updated_at       TIMESTAMP DEFAULT NOW(),
    UNIQUE (cid, attendance_date)
  );

  CREATE TABLE IF NOT EXISTS goal_data (
    id             SERIAL PRIMARY KEY,
    gid            INT REFERENCES goals(id) ON DELETE CASCADE,
    goal_data_date DATE,
    activity       TEXT,
    comments       TEXT,
    prompt_level   TEXT,
    initial        TEXT,
    created_at     TIMESTAMP DEFAULT NOW(),
    updated_at     TIMESTAMP DEFAULT NOW(),
    UNIQUE (gid, goal_data_date)
  );

  CREATE TABLE IF NOT EXISTS session (
    sid    VARCHAR PRIMARY KEY,
    sess   JSONB NOT NULL,
    expire TIMESTAMP NOT NULL
  );
`);

/* -------------------------------------------------- */
/* 3. Generic trigger to update `updated_at`           */
/* -------------------------------------------------- */
await pool.query(`
  CREATE OR REPLACE FUNCTION touch_updated_at()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;
`);

/* Helper to attach trigger to a table */
async function addUpdateTrigger(table: string) {
  await pool.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_trigger
        WHERE tgname = 'trg_${table}_updated'
      ) THEN
        CREATE TRIGGER trg_${table}_updated
        BEFORE UPDATE ON ${table}
        FOR EACH ROW
        EXECUTE FUNCTION touch_updated_at();
      END IF;
    END;
    $$;
  `);
}

/* Attach trigger to every table that has updated_at */
const tablesWithUpdatedAt = [
  "sides",
  "roles",
  "statuses",
  "presents",
  "clients",
  "users",
  "goals",
  "client_roster",
  "attendance",
  "goal_data",
];

for (const tbl of tablesWithUpdatedAt) {
  await addUpdateTrigger(tbl);
}

console.log("✅  Tables & triggers created (seeding runs separately).");
