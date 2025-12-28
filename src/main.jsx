import "./style.css";

// Root container
const root = document.querySelector("#app");

root.innerHTML = `
  <main class="max-w-5xl mx-auto px-4 py-16">
    <h1 class="text-3xl font-bold mb-2">Website Performance Test</h1>
    <p class="text-gray-600 mb-8">Comprehensive performance analysis powered by Google PageSpeed Insights</p>

    <form id="testForm" class="bg-white p-6 rounded-xl shadow-sm space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label class="block">
          <span class="text-sm font-medium">Website URL</span>
          <input id="url" type="url" required placeholder="https://example.com"
                 class="mt-1 w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500"/>
        </label>
        <label class="block">
          <span class="text-sm font-medium">Test Device</span>
          <select id="strategy" class="mt-1 w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-500">
            <option value="mobile">Mobile</option>
            <option value="desktop">Desktop</option>
          </select>
        </label>
      </div>
      <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
        Run Performance Test
      </button>
    </form>

    <div id="loading" class="hidden mt-10 text-center">
      <div class="inline-block h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      <p class="mt-4 text-sm text-slate-600">Running comprehensive audit...</p>
      <p class="text-xs text-slate-500 mt-2">This may take 15-30 seconds</p>
    </div>

    <div id="results" class="mt-10"></div>
  </main>
`;

// Replace with your Google PageSpeed Insights API key
const API_KEY = "AIzaSyAjPoTahh_AheHImaDk5etcZ2S28WPsvg8";

const form = document.getElementById("testForm");
const loading = document.getElementById("loading");
const resultsDiv = document.getElementById("results");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const url = document.getElementById("url").value.trim();
  const strategy = document.getElementById("strategy").value;
  if (!url) return;

  form.classList.add("hidden");
  loading.classList.remove("hidden");
  resultsDiv.innerHTML = "";

  try {
    // Fetch with all categories for comprehensive analysis
    const psiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(
      url
    )}&strategy=${strategy}&category=performance&category=accessibility&category=best-practices&category=seo&key=${API_KEY}`;
    const res = await fetch(psiUrl);
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);

    const audits = data.lighthouseResult.audits;
    const categories = data.lighthouseResult.categories;

    // Extract all metrics
    const r = {
      // Category scores
      performance: Math.round(categories.performance.score * 100),
      accessibility: Math.round(categories.accessibility?.score * 100) || 0,
      bestPractices: Math.round(categories["best-practices"]?.score * 100) || 0,
      seo: Math.round(categories.seo?.score * 100) || 0,

      // Core Web Vitals
      lcp: audits["largest-contentful-paint"].numericValue,
      cls: audits["cumulative-layout-shift"].numericValue,
      fid: audits["max-potential-fid"]?.numericValue || 0,

      // Other performance metrics
      ttfb: audits["server-response-time"]?.numericValue || 0,
      fcp: audits["first-contentful-paint"].numericValue,
      speedIndex: audits["speed-index"].numericValue,
      tti: audits["interactive"]?.numericValue || 0,
      tbt: audits["total-blocking-time"]?.numericValue || 0,
      fmp: audits["first-meaningful-paint"]?.numericValue || 0,

      // Page stats
      totalSize: audits["total-byte-weight"]?.numericValue || 0,
      domSize: audits["dom-size"]?.numericValue || 0,
      requestCount: audits["network-requests"]?.details?.items?.length || 0,
      jsTime: audits["mainthread-work-breakdown"]?.numericValue || 0,
      unusedCSS: audits["unused-css-rules"]?.details?.overallSavingsBytes || 0,
      unusedJS: audits["unused-javascript"]?.details?.overallSavingsBytes || 0,

      // Resources breakdown
      imageSize:
        audits["uses-optimized-images"]?.details?.overallSavingsBytes || 0,
      renderBlocking:
        audits["render-blocking-resources"]?.details?.items?.length || 0,
      thirdParty: audits["third-party-summary"]?.details?.items || [],

      // Screenshot
      screenshot: audits["final-screenshot"]?.details?.data || null,
    };

    // Get opportunities
    const opportunities = [];
    Object.entries(audits).forEach(([key, audit]) => {
      if (audit.details?.type === "opportunity" && audit.numericValue > 100) {
        opportunities.push({
          title: audit.title,
          description: audit.description,
          savings: audit.numericValue,
        });
      }
    });
    opportunities.sort((a, b) => b.savings - a.savings);

    renderResults(url, r, opportunities, strategy);
  } catch (err) {
    alert("Error: " + err.message);
    form.classList.remove("hidden");
    loading.classList.add("hidden");
  }
});

function scoreColor(value, good = 90, ok = 50) {
  if (value >= good) return "bg-green-100 text-green-700";
  if (value >= ok) return "bg-amber-100 text-amber-700";
  return "bg-red-100 text-red-700";
}

function metricColor(value, good, ok) {
  if (value <= good) return "bg-green-100 text-green-700";
  if (value <= ok) return "bg-amber-100 text-amber-700";
  return "bg-red-100 text-red-700";
}

function formatTime(ms) {
  if (ms < 1000) return Math.round(ms) + " ms";
  return (ms / 1000).toFixed(1) + " s";
}

function formatBytes(bytes) {
  if (!bytes) return "0 B";
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function metricCard(title, value, explanation, colorClass, icon = "") {
  return `
    <div class="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div class="inline-block px-2 py-1 rounded-full text-xs font-medium mb-2 ${colorClass}">
        ${
          colorClass.includes("green")
            ? "Good"
            : colorClass.includes("amber")
            ? "Needs improvement"
            : "Poor"
        }
      </div>
      <p class="text-sm text-slate-500">${title}</p>
      <p class="text-2xl font-bold">${value}</p>
      <p class="text-xs text-slate-600 mt-1">${explanation}</p>
    </div>
  `;
}

function scoreRing(score, label) {
  const color = score >= 90 ? "#10b981" : score >= 50 ? "#f59e0b" : "#ef4444";
  const circumference = 2 * Math.PI * 36;
  const offset = circumference - (score / 100) * circumference;

  return `
    <div class="text-center">
      <div class="relative inline-block">
        <svg width="80" height="80">
          <circle cx="40" cy="40" r="36" stroke="#e5e7eb" stroke-width="6" fill="none"/>
          <circle cx="40" cy="40" r="36" stroke="${color}" stroke-width="6" fill="none"
                  stroke-dasharray="${circumference}" stroke-dashoffset="${offset}"
                  transform="rotate(-90 40 40)" style="transition: stroke-dashoffset 0.5s"/>
        </svg>
        <div class="absolute inset-0 flex items-center justify-center">
          <div>
            <p class="text-xl font-bold">${score}</p>
            <p class="text-xs text-gray-500">/100</p>
          </div>
        </div>
      </div>
      <p class="text-sm font-medium mt-2">${label}</p>
    </div>
  `;
}

function renderResults(url, r, opportunities, strategy) {
  loading.classList.add("hidden");

  // Header with test info
  const header = `
    <div class="bg-white rounded-xl shadow-sm p-6 mb-6">
      <div class="flex justify-between items-start mb-4">
        <div>
          <h2 class="text-xl font-semibold mb-1">Performance Report</h2>
          <p class="text-sm text-gray-600">${url}</p>
          <p class="text-xs text-gray-500 mt-1">
            ${
              strategy === "mobile" ? "📱 Mobile" : "💻 Desktop"
            } Test • ${new Date().toLocaleString()}
          </p>
        </div>
        <button onclick="location.reload()" class="text-blue-600 hover:underline text-sm">
          ← New Test
        </button>
      </div>
    </div>
  `;

  // Score overview
  const scores = `
    <div class="bg-white rounded-xl shadow-sm p-6 mb-6">
      <h3 class="text-lg font-semibold mb-4">Overall Scores</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        ${scoreRing(r.performance, "Performance")}
        ${scoreRing(r.accessibility, "Accessibility")}
        ${scoreRing(r.bestPractices, "Best Practices")}
        ${scoreRing(r.seo, "SEO")}
      </div>
    </div>
  `;

  // Core Web Vitals (emphasized)
  const coreWebVitals = `
    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm p-6 mb-6">
      <h3 class="text-lg font-semibold mb-1">Core Web Vitals</h3>
      <p class="text-sm text-gray-600 mb-4">Google's key metrics for user experience</p>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        ${metricCard(
          "Largest Contentful Paint (LCP)",
          formatTime(r.lcp),
          "Main content load time • Target < 2.5s",
          metricColor(r.lcp, 2500, 4000)
        )}
        ${metricCard(
          "Cumulative Layout Shift (CLS)",
          r.cls.toFixed(3),
          "Visual stability score • Target < 0.1",
          metricColor(r.cls, 0.1, 0.25)
        )}
        ${metricCard(
          "Total Blocking Time (TBT)",
          formatTime(r.tbt),
          "Input responsiveness • Target < 200ms",
          metricColor(r.tbt, 200, 600)
        )}
      </div>
    </div>
  `;

  // All metrics
  const metrics = `
    <div class="bg-white rounded-xl shadow-sm p-6 mb-6">
      <h3 class="text-lg font-semibold mb-4">Performance Metrics</h3>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
        ${metricCard(
          "Time to First Byte",
          formatTime(r.ttfb),
          "Server response time",
          metricColor(r.ttfb, 800, 1800)
        )}
        ${metricCard(
          "First Contentful Paint",
          formatTime(r.fcp),
          "First visual response",
          metricColor(r.fcp, 1800, 3000)
        )}
        ${metricCard(
          "Speed Index",
          formatTime(r.speedIndex),
          "Content visibility speed",
          metricColor(r.speedIndex, 3400, 5800)
        )}
        ${metricCard(
          "Time to Interactive",
          formatTime(r.tti),
          "Full interactivity",
          metricColor(r.tti, 3800, 7300)
        )}
        ${metricCard(
          "First Meaningful Paint",
          formatTime(r.fmp || r.fcp),
          "Primary content visible",
          metricColor(r.fmp || r.fcp, 2000, 4000)
        )}
        ${metricCard(
          "Max Potential FID",
          formatTime(r.fid),
          "Worst-case input delay",
          metricColor(r.fid, 100, 300)
        )}
      </div>
    </div>
  `;

  // Page statistics
  const stats = `
    <div class="bg-white rounded-xl shadow-sm p-6 mb-6">
      <h3 class="text-lg font-semibold mb-4">Page Statistics</h3>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div class="bg-slate-50 p-3 rounded-lg">
          <p class="text-xs text-slate-600">Total Size</p>
          <p class="text-lg font-semibold">${formatBytes(r.totalSize)}</p>
        </div>
        <div class="bg-slate-50 p-3 rounded-lg">
          <p class="text-xs text-slate-600">DOM Elements</p>
          <p class="text-lg font-semibold">${r.domSize}</p>
        </div>
        <div class="bg-slate-50 p-3 rounded-lg">
          <p class="text-xs text-slate-600">Requests</p>
          <p class="text-lg font-semibold">${r.requestCount}</p>
        </div>
        <div class="bg-slate-50 p-3 rounded-lg">
          <p class="text-xs text-slate-600">JS Time</p>
          <p class="text-lg font-semibold">${formatTime(r.jsTime)}</p>
        </div>
        <div class="bg-slate-50 p-3 rounded-lg">
          <p class="text-xs text-slate-600">Unused CSS</p>
          <p class="text-lg font-semibold">${formatBytes(r.unusedCSS)}</p>
        </div>
        <div class="bg-slate-50 p-3 rounded-lg">
          <p class="text-xs text-slate-600">Unused JS</p>
          <p class="text-lg font-semibold">${formatBytes(r.unusedJS)}</p>
        </div>
        <div class="bg-slate-50 p-3 rounded-lg">
          <p class="text-xs text-slate-600">Image Savings</p>
          <p class="text-lg font-semibold">${formatBytes(r.imageSize)}</p>
        </div>
        <div class="bg-slate-50 p-3 rounded-lg">
          <p class="text-xs text-slate-600">Render Blocking</p>
          <p class="text-lg font-semibold">${r.renderBlocking}</p>
        </div>
      </div>
    </div>
  `;

  // Third party impact
  const thirdParty =
    r.thirdParty.length > 0
      ? `
    <div class="bg-white rounded-xl shadow-sm p-6 mb-6">
      <h3 class="text-lg font-semibold mb-4">Third-Party Impact</h3>
      <div class="space-y-2">
        ${r.thirdParty
          .slice(0, 5)
          .map(
            (tp) => `
          <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span class="text-sm font-medium">${tp.entity}</span>
            <div class="text-right">
              <span class="text-sm font-semibold">${formatTime(
                tp.mainThreadTime
              )}</span>
              <span class="text-xs text-gray-500 ml-2">${formatBytes(
                tp.transferSize
              )}</span>
            </div>
          </div>
        `
          )
          .join("")}
      </div>
    </div>
  `
      : "";

  // Opportunities
  const opportunitiesSection =
    opportunities.length > 0
      ? `
    <div class="bg-white rounded-xl shadow-sm p-6 mb-6">
      <h3 class="text-lg font-semibold mb-4">💡 Improvement Opportunities</h3>
      <div class="space-y-3">
        ${opportunities
          .slice(0, 5)
          .map(
            (opp) => `
          <div class="border-l-4 border-amber-400 pl-4 py-2">
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <p class="font-medium text-sm">${opp.title}</p>
                <p class="text-xs text-gray-600 mt-1">${opp.description}</p>
              </div>
              <span class="text-xs font-semibold text-amber-600 ml-4">Save ${formatTime(
                opp.savings
              )}</span>
            </div>
          </div>
        `
          )
          .join("")}
      </div>
    </div>
  `
      : "";

  // Screenshot
  const screenshot = r.screenshot
    ? `
    <div class="bg-white rounded-xl shadow-sm p-6 mb-6">
      <h3 class="text-lg font-semibold mb-4">Page Screenshot</h3>
      <img src="${r.screenshot}" alt="Page screenshot" class="w-full rounded-lg border"/>
    </div>
  `
    : "";

  // Recommendations based on scores
  const recommendations = `
    <div class="bg-blue-50 rounded-xl shadow-sm p-6 mb-6">
      <h3 class="text-lg font-semibold mb-4">📋 Quick Recommendations</h3>
      <ul class="space-y-2 text-sm">
        ${
          r.lcp > 2500
            ? "<li>• <strong>Optimize LCP:</strong> Consider lazy loading, optimizing server response, and using a CDN</li>"
            : ""
        }
        ${
          r.cls > 0.1
            ? "<li>• <strong>Fix layout shifts:</strong> Set explicit dimensions for images and embeds</li>"
            : ""
        }
        ${
          r.tbt > 200
            ? "<li>• <strong>Reduce blocking time:</strong> Split large JavaScript bundles and defer non-critical JS</li>"
            : ""
        }
        ${
          r.unusedCSS > 50000
            ? "<li>• <strong>Remove unused CSS:</strong> Use tools like PurgeCSS to eliminate dead code</li>"
            : ""
        }
        ${
          r.totalSize > 3000000
            ? "<li>• <strong>Reduce page weight:</strong> Compress images and minify assets</li>"
            : ""
        }
        ${
          r.requestCount > 100
            ? "<li>• <strong>Reduce requests:</strong> Bundle assets and implement resource hints</li>"
            : ""
        }
      </ul>
    </div>
  `;

  resultsDiv.innerHTML =
    header +
    scores +
    coreWebVitals +
    metrics +
    stats +
    thirdParty +
    opportunitiesSection +
    recommendations +
    screenshot +
    '<div class="text-center text-xs text-gray-500 mt-8">Powered by Google PageSpeed Insights</div>';
}
