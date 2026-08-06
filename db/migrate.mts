import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { neon } from "@neondatabase/serverless";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL belum diset di environment.");
}

const sql = neon(connectionString);

const schemaPath = fileURLToPath(new URL("./schema.sql", import.meta.url));
const schema = readFileSync(schemaPath, "utf8");

const statements = schema
  .split(";")
  .map((s) => s.trim())
  .filter((s) => s.length > 0 && !s.startsWith("--"));

for (const statement of statements) {
  await sql.query(statement);
}

console.log(`Migrasi selesai — ${statements.length} statement dijalankan.`);
