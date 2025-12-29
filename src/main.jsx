import "./style.css";

// Import utilities
import {
  validateApiKey,
  fetchPageSpeedData,
  extractMetrics,
  extractOpportunities,
} from "./utils/api.js";

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
  <main class="min-h-screen bg-white">
    <div class="max-w-6xl mx-auto px-6 py-12">
      <div class="text-center mb-12">
        <div class="inline-block bg-orange-50 px-4 py-2 rounded-full text-sm font-semibold text-primary mb-4">
          ⚡ Website Performance Analyzer
        </div>
        <h1 class="text-5xl md:text-6xl font-bold text-accent mb-4">
          Speed Test & Performance Insights
        </h1>
        <p class="text-xl text-gray-700 max-w-3xl mx-auto">
          Analyze your website performance with detailed metrics and actionable recommendations powered by Google PageSpeed Insights.
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
let testResults = {}; // Store results for both mobile and desktop

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

    // Store results for this strategy
    testResults[strategy] = { url, metrics, opportunities };

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

// PDF export has been removed from the codebase

function switchStrategy(newStrategy) {
  // Check if we have results for this strategy
  if (!testResults[newStrategy]) {
    // Fetch the data for the new strategy
    const url = Object.values(testResults)[0]?.url;
    if (!url) return;

    loading.classList.remove("hidden");
    resultsDiv.innerHTML = "";

    tipInterval = startTipRotation();

    fetchPageSpeedData(url, newStrategy)
      .then((data) => {
        const metrics = extractMetrics(data);
        const opportunities = extractOpportunities(
          data.lighthouseResult.audits
        );
        testResults[newStrategy] = { url, metrics, opportunities };
        renderResults(url, metrics, opportunities, newStrategy);

        if (tipInterval) {
          clearInterval(tipInterval);
          tipInterval = null;
        }
      })
      .catch((err) => {
        alert("Error: " + err.message);
        if (tipInterval) {
          clearInterval(tipInterval);
          tipInterval = null;
        }
        // Show previous results again
        const previousStrategy =
          newStrategy === "mobile" ? "desktop" : "mobile";
        if (testResults[previousStrategy]) {
          const { url, metrics, opportunities } = testResults[previousStrategy];
          renderResults(url, metrics, opportunities, previousStrategy);
        }
      });
  } else {
    // Show cached results
    const { url, metrics, opportunities } = testResults[newStrategy];
    renderResults(url, metrics, opportunities, newStrategy);
  }
}

function renderResults(url, metrics, opportunities, strategy) {
  loading.classList.add("hidden");

  // Build results HTML using components
  const header = renderResultsHeader(url, strategy);
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

  // Attach event listeners for strategy switching
  const mobileBtn = document.getElementById("switchMobileBtn");
  const desktopBtn = document.getElementById("switchDesktopBtn");

  if (mobileBtn) {
    mobileBtn.addEventListener("click", () => switchStrategy("mobile"));
  }
  if (desktopBtn) {
    desktopBtn.addEventListener("click", () => switchStrategy("desktop"));
  }

  // PDF export removed; no export button handler attached
}
