// History utility functions for speed-test

export function readHistory() {
  try {
    return JSON.parse(localStorage.getItem("speedtest_history") || "{}");
  } catch (e) {
    return {};
  }
}

export function writeHistory(obj) {
  localStorage.setItem("speedtest_history", JSON.stringify(obj));
}

export function findEntryByUrl(url) {
  const h = readHistory();
  return Object.values(h).find((e) => e.url === url) || null;
}

export function saveTestResult(url, metrics, opportunities, strategy) {
  const history = readHistory();
  let entry = Object.values(history).find((e) => e.url === url);
  const now = Date.now();
  if (entry) {
    entry.results = entry.results || {};
    entry.results[strategy] = { metrics, opportunities, ts: now };
    entry.lastUpdated = now;
    history[entry.id] = entry;
  } else {
    const id = `${now}-${btoa(url).replace(/=+$/, "")}`;
    entry = {
      id,
      url,
      created: now,
      lastUpdated: now,
      results: {
        [strategy]: { metrics, opportunities, ts: now },
      },
    };
    history[id] = entry;
  }
  writeHistory(history);
  return entry.id;
}

export function loadSharedResultFromURL(renderResults, setTestResults) {
  const params = new URLSearchParams(location.search);
  const id = params.get("resultId");
  if (!id) return false;
  const history = readHistory();
  const entry = history[id];
  if (!entry) return false;
  const strat = entry.results.mobile ? "mobile" : "desktop";
  const { metrics, opportunities } = entry.results[strat];
  const testResults = {};
  if (entry.results.mobile)
    testResults.mobile = {
      url: entry.url,
      metrics: entry.results.mobile.metrics,
      opportunities: entry.results.mobile.opportunities,
    };
  if (entry.results.desktop)
    testResults.desktop = {
      url: entry.url,
      metrics: entry.results.desktop.metrics,
      opportunities: entry.results.desktop.opportunities,
    };
  setTestResults(testResults);
  renderResults(entry.url, metrics, opportunities, strat);
  return true;
}
