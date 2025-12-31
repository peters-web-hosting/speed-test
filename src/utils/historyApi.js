// src/utils/historyApi.js
// Contains history API helpers split from main.jsx

export async function _getHistoryById(id) {
  const res = await fetch(`/api/history?id=${encodeURIComponent(id)}`);
  if (!res.ok) return null;
  const { data } = await res.json();
  return data;
}

export async function _saveTestResult(url, metrics, opportunities, strategy) {
  const now = Date.now();
  const id = `${btoa(url).replace(/=+$/, "")}`;
  let entry = await _getHistoryById(id);
  if (entry) {
    entry.results = entry.results || {};
    entry.results[strategy] = { metrics, opportunities, ts: now };
    entry.lastUpdated = now;
  } else {
    entry = {
      id,
      url,
      created: now,
      lastUpdated: now,
      results: {
        [strategy]: { metrics, opportunities, ts: now },
      },
    };
  }
  await fetch("/api/history", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, data: entry }),
  });
  return id;
}

export async function _findEntryByUrl(url) {
  const id = `${btoa(url).replace(/=+$/, "")}`;
  return await _getHistoryById(id);
}
