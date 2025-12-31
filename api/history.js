// /api/history.js
// Vercel serverless API route for history storage via Neon (Postgres)
// Requires: npm install @neondatabase/serverless

import { setHistory, getHistory } from "../src/utils/redis.js";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { id, data } = req.body;
    if (!id || !data)
      return res.status(400).json({ error: "Missing id or data" });
    await setHistory(id, data);
    return res.status(200).json({ ok: true });
  }
  if (req.method === "GET") {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: "Missing id" });
    const data = await getHistory(id);
    if (!data) return res.status(404).json({ error: "Not found" });
    return res.status(200).json({ data });
  }
  res.status(405).json({ error: "Method not allowed" });
}
