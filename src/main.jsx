import "./style.css";

// Import utilities
import {
  validateApiKey,
  fetchPageSpeedData,
  extractMetrics,
  extractOpportunities,
} from "./utils/api.js";
import { exportToPDF } from "./utils/pdfExport.js";

// Import components
import {
  renderForm,
  renderLoadingState,
  performanceTips,
} from "./components/Form.js";
import { renderResultsHeader } from "./components/ResultsHeader.js";
import { renderScoresOverview } from "./components/ScoresOverview.js";
import { renderCoreWebVitals } from "./components/CoreWebVitals.js";
import { renderPerformanceMetrics } from "./components/PerformanceMetrics.js";
import { renderPageStatistics } from "./components/PageStatistics.js";
import { renderThirdPartyImpact } from "./components/ThirdPartyImpact.js";
import { renderOpportunitiesSection } from "./components/OpportunitiesSection.js";
import { renderRecommendationsSection } from "./components/RecommendationsSection.js";
import { renderPageScreenshot } from "./components/PageScreenshot.js";
import { renderAccessibilityDetails } from "./components/AccessibilityDetails.js";
import { renderSEOMetrics } from "./components/SEOMetrics.js";
import { renderBestPracticesDetails } from "./components/BestPracticesDetails.js";
import { renderResourceBreakdown } from "./components/ResourceBreakdown.js";
import { renderDiagnosticsSummary } from "./components/DiagnosticsSummary.js";
import { renderPerformanceInsights } from "./components/PerformanceInsights.js";
import { renderStrategyNote } from "./components/StrategyNote.js";

// Root container
const root = document.querySelector("#app");

root.innerHTML = `
  <main class="min-h-screen bg-gradient-to-b from-slate-50 to-white">
    <div class="max-w-5xl mx-auto px-4 py-12">
      <div class="text-center mb-12">
        <div class="inline-block bg-gradient-to-r from-green-100 to-emerald-100 px-4 py-2 rounded-full text-sm font-semibold text-green-700 mb-4">
          ✨ Free Website Performance Testing
        </div>
        <h1 class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
          Website Performance Test
        </h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          Get comprehensive performance analysis powered by Google PageSpeed Insights. Test your website in seconds and get actionable insights to improve user experience.
        </p>
      </div>

      ${renderForm()}
      ${renderLoadingState()}

      <div id="results" class="mt-16"></div>
    </div>
  </main>
`;

// Validate API key
if (!validateApiKey()) {
  console.error(
    "PageSpeed API key not configured. Please set VITE_PAGESPEED_API_KEY environment variable."
  );
}

const form = document.getElementById("testForm");
const loading = document.getElementById("loading");
const resultsDiv = document.getElementById("results");

// Function to rotate tips every 5 seconds
function startTipRotation() {
  let tipIndex = 0;
  const tipContainer = document.getElementById("tipContainer");

  if (!tipContainer) return;

  const tipInterval = setInterval(() => {
    tipContainer.style.opacity = "0";
    setTimeout(() => {
      tipIndex = (tipIndex + 1) % performanceTips.length;
      tipContainer.querySelector("p").textContent = performanceTips[tipIndex];
      tipContainer.style.opacity = "1";
    }, 150);
  }, 5000);

  return tipInterval;
}

let tipInterval = null;

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const url = document.getElementById("url").value.trim();
  const strategy = document.getElementById("strategy").value;
  if (!url) return;

  form.classList.add("hidden");
  loading.classList.remove("hidden");
  resultsDiv.innerHTML = "";

  // Start rotating tips
  tipInterval = startTipRotation();

  try {
    const data = await fetchPageSpeedData(url, strategy);
    const metrics = extractMetrics(data);
    const opportunities = extractOpportunities(data.lighthouseResult.audits);

    renderResults(url, metrics, opportunities, strategy);

    // Clear tip rotation interval when results are displayed
    if (tipInterval) {
      clearInterval(tipInterval);
      tipInterval = null;
    }
  } catch (err) {
    alert("Error: " + err.message);
    form.classList.remove("hidden");
    loading.classList.add("hidden");

    // Clear tip rotation interval on error
    if (tipInterval) {
      clearInterval(tipInterval);
      tipInterval = null;
    }
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
  // Use hex colors instead of any modern CSS color formats
  const color = score >= 90 ? "#10b981" : score >= 50 ? "#f59e0b" : "#ef4444";
  const bgColor = "#e5e7eb";
  const circumference = 2 * Math.PI * 36;
  const offset = circumference - (score / 100) * circumference;

  return `
    <div class="text-center">
      <div class="relative inline-block">
        <svg width="80" height="80">
          <circle cx="40" cy="40" r="36" stroke="${bgColor}" stroke-width="6" fill="none"/>
          <circle cx="40" cy="40" r="36" stroke="${color}" stroke-width="6" fill="none"
                  stroke-dasharray="${circumference}" stroke-dashoffset="${offset}"
                  transform="rotate(-90 40 40)" style="transition: stroke-dashoffset 0.5s"/>
        </svg>
        <div class="absolute inset-0 flex items-center justify-center">
          <div>
            <p class="text-xl font-bold" style="color: #111827;">${score}</p>
            <p class="text-xs" style="color: #6b7280;">/100</p>
          </div>
        </div>
      </div>
      <p class="text-sm font-medium mt-2" style="color: #111827;">${label}</p>
    </div>
  `;
}

// PDF Export Function
async function exportToPDFHandler(url, strategy, metrics, opportunities) {
  await exportToPDF(url, strategy, metrics, opportunities);
}

// Make exportToPDF available globally for onclick
window.exportToPDF = exportToPDFHandler;

function renderResults(url, metrics, opportunities, strategy) {
  loading.classList.add("hidden");

  // Create export callback
  const exportCallback = `window.exportToPDF('${url}', '${strategy}', ${JSON.stringify(
    metrics
  )}, ${JSON.stringify(opportunities)})`;

  // Build results HTML using components
  const header = renderResultsHeader(url, strategy, exportCallback);
  const strategyNote = renderStrategyNote(strategy);
  const perfInsights = renderPerformanceInsights(metrics.performance);
  const scores = renderScoresOverview(metrics);
  const metricsData = `<div id="metricsData" class="hidden" data-metrics='${JSON.stringify(
    metrics
  )}'></div>`;
  const opportunitiesData =
    opportunities.length > 0
      ? `<div id="opportunities" class="hidden" data-opportunities='${JSON.stringify(
          opportunities
        )}'></div>`
      : "";
  const coreWebVitals = renderCoreWebVitals(metrics);
  const perfMetrics = renderPerformanceMetrics(metrics);
  const diagnostics = renderDiagnosticsSummary(metrics);
  const stats = renderPageStatistics(metrics);
  const resourceBreakdown = renderResourceBreakdown(metrics);
  const thirdParty = renderThirdPartyImpact(metrics.thirdParty);
  const accessibilityDetails = renderAccessibilityDetails(
    metrics.accessibility
  );
  const bestPracticesDetails = renderBestPracticesDetails(
    metrics.bestPractices
  );
  const seoMetrics = renderSEOMetrics(metrics.seo);
  const oppsSection = renderOpportunitiesSection(opportunities);
  const recommendations = renderRecommendationsSection(metrics);
  const screenshot = renderPageScreenshot(metrics.screenshot);

  resultsDiv.innerHTML =
    header +
    strategyNote +
    perfInsights +
    scores +
    metricsData +
    opportunitiesData +
    coreWebVitals +
    perfMetrics +
    diagnostics +
    stats +
    resourceBreakdown +
    thirdParty +
    accessibilityDetails +
    bestPracticesDetails +
    seoMetrics +
    oppsSection +
    recommendations +
    screenshot +
    '<div class="text-center text-xs text-gray-500 mt-8">Powered by Google PageSpeed Insights</div>';
}
