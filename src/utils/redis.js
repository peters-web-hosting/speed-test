// Utility for interacting with Neon (Postgres) for history storage
// Requires: npm install @neondatabase/serverless

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.NEON_DATABASE_URL);

// Ensure table exists (id TEXT PRIMARY KEY, data JSONB)
async function ensureTable() {
  await sql`CREATE TABLE IF NOT EXISTS history (
    id TEXT PRIMARY KEY,
    data JSONB
  )`;
}

export async function setHistory(id, data) {
  await ensureTable();
  await sql`
    INSERT INTO history (id, data)
    VALUES (${id}, ${JSON.stringify(data)})
    ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data
  `;
}

export async function getHistory(id) {
  await ensureTable();
  const rows = await sql`SELECT data FROM history WHERE id = ${id}`;
  return rows[0]?.data || null;
}
