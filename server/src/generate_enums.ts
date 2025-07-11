import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { getPool } from "@/db";
import { LOOKUP_CONFIG } from "./lookup.config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const pool = await getPool();

const toEnumKey = (c: string) =>
  c
    .replace(/[\s\-\/]+/g, "_")
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .toUpperCase();

const toEnumName = (t: string) =>
  t
    .replace(/ses$/, "s")
    .replace(/s$/, "")
    .split("_")
    .map((p) => p[0].toUpperCase() + p.slice(1))
    .join("");

const generateEnumSet = (enumName: string, rows: any[], columns: string[]) => {
  const enums = rows
    .map((r) => `  ${toEnumKey(r.code)} = "${r.code}",`)
    .join("\n");

  const codeMap = rows
    .map((r) => `  \"${r.code}\": ${enumName}.${toEnumKey(r.code)},`)
    .join("\n");

  const idMap = rows
    .map((r) => `  ${r.id}: ${enumName}.${toEnumKey(r.code)},`)
    .join("\n");

  const shape = columns
    .map((c) => `${c}: ${typeof rows[0][c] === "number" ? "number" : "string"}`)
    .join("; ");

  const details = rows
    .map((r) => {
      const props = columns
        .map((c) => `${c}: ${JSON.stringify(r[c])}`)
        .join(", ");
      return `  [${enumName}.${toEnumKey(r.code)}]: { ${props} },`;
    })
    .join("\n");

  return `
export enum ${enumName} {
${enums}
}

export const CodeTo${enumName}: Record<string, ${enumName}> = {
${codeMap}
};

export const IdTo${enumName}: Record<number, ${enumName}> = {
${idMap}
};

export const ${enumName}Details: Record<${enumName}, { ${shape} }> = {
${details}
};`;
};

const run = async () => {
  const outDir = path.resolve(__dirname, "../../shared/src/generated");
  const outFile = path.join(outDir, "lookup.types.ts");
  fs.mkdirSync(outDir, { recursive: true });

  let out = `// AUTO-GENERATED FILE. DO NOT EDIT.\n\n`;
  const registry: string[] = [];

  for (const { table, columns } of LOOKUP_CONFIG) {
    const enumName = toEnumName(table);
    const rows = (await pool.query(`SELECT * FROM ${table} ORDER BY code`))
      .rows;

    if (!rows.length) continue;
    out += generateEnumSet(enumName, rows, columns) + "\n";
    registry.push(
      `  ${table}: { table: \"${table}\", codeToEnum: CodeTo${enumName}, idToEnum: IdTo${enumName}, details: ${enumName}Details },`
    );
  }

  out += `\nexport const LookupRegistry = {\n${registry.join(
    "\n"
  )}\n} as const;\n`;
  fs.writeFileSync(outFile, out.trim() + "\n");
  await pool.end();
};

run().catch((err) => {
  console.error("\u274C Enum generation failed:", err);
  process.exit(1);
});
