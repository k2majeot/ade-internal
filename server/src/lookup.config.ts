export const LOOKUP_CONFIG = [
  { table: "roles", columns: ["id", "code", "label", "level"] },
  { table: "sides", columns: ["id", "code", "label"] },
  { table: "statuses", columns: ["id", "code", "label"] },
  { table: "attendance_statuses", columns: ["id", "code", "label"] },
  { table: "prompt_levels", columns: ["id", "code", "label"] },
] as const;
