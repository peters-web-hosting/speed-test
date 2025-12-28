// app.js
// Peters Web Performance Test – with loading screen + client-friendly audit explanations

import express from "express";
import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

async function runLighthouse(url) {
  const chrome = await chromeLauncher.launch({
    chromeFlags: ["--headless=new", "--no-sandbox", "--disable-gpu"]
  });

  const options = {
    logLevel: "error",
    output: "json",
    onlyCategories: ["performance"],
    port: chrome.port
  };

  const result = await lighthouse(url, options);
  await chrome.kill();

  const audits = result.lhr.audits;

  return {
    performance: Math.round(result.lhr.categories.performance.score * 100),
    ttfb: audits["server-response-time"].numericValue.toFixed(0),
    fcp: audits["first-contentful-paint"].numericValue.toFixed(0),
    lcp: audits["largest-contentful-paint"].numericValue.toFixed(0),
    cls: audits["cumulative-layout-shift"].numericValue.toFixed(2),
    speedIndex: audits["speed-index"].numericValue.toFixed(0)
  };
}

app.get("/", (req, res) => {
  res.send(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Peters Web Performance Test</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-50 text-slate-800">
  <main class="max-w-3xl mx-auto px-4 py-16">
    <h1 class="text-2xl font-semibold mb-6">Website Performance Test</h1>

    <form method="POST" action="/run" onsubmit="showLoading()"
      class="bg-white p-6 rounded-xl shadow-sm space-y-4">
      <label class="block">
        <span class="text-sm font-medium">Website URL</span>
        <input name="url" type="url" required placeholder="https://example.com"
          class="mt-1 w-full rounded-lg border px-4 py-2" />
      </label>

      <button type="submit"
        class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
        Run Test
      </button>
    </form>

    <div id="loading" class="hidden mt-10 text-center">
      <div class="inline-block h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      <p class="mt-4 text-sm text-slate-600">Running Lighthouse audit… this can take up to 30 seconds.</p>
    </div>

    <p class="text-sm text-slate-500 mt-8">Powered by Google Lighthouse · Peters Web</p>
  </main>

  <script>
    function showLoading() {
      document.querySelector('form').classList.add('hidden');
      document.getElementById('loading').classList.remove('hidden');
    }
  </script>
</body>
</html>`);
});

app.post("/run", async (req, res) => {
  const { url } = req.body;

  try {
    const r = await runLighthouse(url);

    res.send(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Performance Results</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-50 text-slate-800">
  <main class="max-w-5xl mx-auto px-4 py-16">
    <h1 class="text-2xl font-semibold mb-4">Performance Results</h1>

    <div class="mb-6 rounded-xl p-4 shadow-sm ${summaryBanner(r)}">
      <p class="font-medium">Summary</p>
      <p class="text-sm">${summaryText(r)}</p>
    </div>

    <div class="bg-white p-6 rounded-xl shadow-sm mb-6">
      <p class="text-sm text-slate-500">${url}</p>
      <p class="text-lg font-medium">Overall Performance Score: ${r.performance}/100</p>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
  ${metricCard("TTFB", r.ttfb + " ms", "Time to first byte. Measures server responsiveness.", scoreColour(r.ttfb, 800, 1800))}
  ${metricCard("FCP", r.fcp + " ms", "When the first content appears on screen.", scoreColour(r.fcp, 1800, 3000))}
  ${metricCard("LCP", r.lcp + " ms", "When the main page content finishes loading.", scoreColour(r.lcp, 2500, 4000))}
  ${metricCard("CLS", r.cls, "Visual stability. Lower is better (under 0.1 is ideal).", scoreColour(r.cls, 0.1, 0.25))}
  ${metricCard("Speed Index", r.speedIndex + " ms", "How quickly content is visually displayed.", scoreColour(r.speedIndex, 3400, 5800))}
</div>

    <section class="bg-white p-6 rounded-xl shadow-sm mb-8">
      <h2 class="text-lg font-semibold mb-3">Traffic light legend</h2>
      <ul class="text-sm space-y-1">
        <li><span class="inline-block px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs">Good</span> Meets best-practice thresholds</li>
        <li><span class="inline-block px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs">Needs improvement</span> Acceptable but could be better</li>
        <li><span class="inline-block px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs">Poor</span> Likely impacting users and SEO</li>
      </ul>
    </section>

    <section class="bg-white p-6 rounded-xl shadow-sm">
      <h2 class="text-lg font-semibold mb-4">What do these results mean?</h2>
      <ul class="space-y-3 text-sm text-slate-700">
        <li><strong>Fast server response</strong> improves SEO and user satisfaction.</li>
        <li><strong>Good LCP</strong> helps visitors see important content quickly.</li>
        <li><strong>Low CLS</strong> prevents frustrating layout shifts.</li>
        <li><strong>Overall score</strong> reflects real-world user experience.</li>
      </ul>
    </section>

    <a href="/" class="inline-block mt-8 text-blue-600 hover:underline">Run another test</a>
  </main>
</body>
</html>`);
  } catch (err) {
    res.status(500).send(`<pre>${err.stack}</pre>`);
  }
});

function verdictFromScore(score) {
  if (score >= 90) return { text: "Good", cls: "bg-green-100 text-green-700" };
  if (score >= 70) return { text: "Fair", cls: "bg-amber-100 text-amber-700" };
  return { text: "Poor", cls: "bg-red-100 text-red-700" };
}

function summaryBanner(r) {
  const reds = countIssues(r).critical;
  const ambers = countIssues(r).needs;
  return reds > 0 ? "bg-red-50" : ambers > 0 ? "bg-amber-50" : "bg-green-50";
}

function summaryText(r) {
  const { critical, needs } = countIssues(r);
  const verdict = verdictFromScore(r.performance);
  return `${needs} issues need improvement, ${critical} critical issues · Overall verdict: ${verdict.text}`;
}

function countIssues(r) {
  let critical = 0;
  let needs = 0;

  if (r.ttfb > 1800) critical++; else if (r.ttfb > 800) needs++;
  if (r.fcp > 3000) critical++; else if (r.fcp > 1800) needs++;
  if (r.lcp > 4000) critical++; else if (r.lcp > 2500) needs++;
  if (r.cls > 0.25) critical++; else if (r.cls > 0.1) needs++;
  if (r.speedIndex > 5800) critical++; else if (r.speedIndex > 3400) needs++;

  return { critical, needs };
}

function scoreColour(value, good, ok) {
  if (value <= good) return "bg-green-100 text-green-700";
  if (value <= ok) return "bg-amber-100 text-amber-700";
  return "bg-red-100 text-red-700";
}

function metricCard(title, value, explanation, colourClass) {
  return `
    <div class="bg-white p-4 rounded-xl shadow-sm">
      <div class="inline-block px-2 py-1 rounded-full text-xs font-medium mb-2 ${colourClass}">
        ${colourClass.includes('green') ? 'Good' : colourClass.includes('amber') ? 'Needs improvement' : 'Poor'}
      </div>
      <p class="text-sm text-slate-500">${title}</p>
      <p class="text-xl font-semibold">${value}</p>
      <p class="text-xs text-slate-600 mt-1">${explanation}</p>
    </div>
  `;
}

app.listen(PORT, () => {
  console.log(`Running on http://localhost:${PORT}`);
});
