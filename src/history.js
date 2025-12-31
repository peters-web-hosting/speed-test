// src/history.js
// Handles history fetch, save, and rendering logic
import {
  _getHistoryById,
  _saveTestResult,
  _findEntryByUrl,
} from "./utils/historyApi.js";
import { renderResults } from "./render.js";

export function setupHistory() {
  // Optionally, wire up history panel and shared result loading here
  // Example: load shared result from URL on page load
  window.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(location.search);
    const id = params.get("resultId");
    if (id) {
      const entry = await _getHistoryById(id);
      if (entry) {
        const strat = entry.results.mobile ? "mobile" : "desktop";
        const { metrics, opportunities } = entry.results[strat];
        renderResults(entry.url, metrics, opportunities, strat);
      }
    }
  });
}
