// Results rendering logic for speed-test
import { renderResultsHeader } from "./ResultsHeader.jsx";
import { renderScoresOverview } from "./ScoresOverview.js";
import { renderCoreWebVitals } from "./CoreWebVitals.js";
import { renderPerformanceMetrics } from "./PerformanceMetrics.js";
import { renderPageStatistics } from "./PageStatistics.js";
import { renderThirdPartyImpact } from "./ThirdPartyImpact.js";
import { renderOpportunitiesSection } from "./OpportunitiesSection.js";
import { renderRecommendationsSection } from "./RecommendationsSection.js";
import { renderPageScreenshot } from "./PageScreenshot.js";
import { renderAccessibilityDetails } from "./AccessibilityDetails.js";
import { renderSEOMetrics } from "./SEOMetrics.js";
import { renderBestPracticesDetails } from "./BestPracticesDetails.js";
import { renderResourceBreakdown } from "./ResourceBreakdown.js";
import { renderDiagnosticsSummary } from "./DiagnosticsSummary.js";
import { renderPerformanceInsights } from "./PerformanceInsights.js";
import { renderStrategyNote } from "./StrategyNote.js";

export function renderResults(
  resultsDiv,
  url,
  metrics,
  opportunities,
  strategy,
  categories
) {
  // Hide loading spinner
  const loading = document.getElementById("loading");
  if (loading) loading.classList.add("hidden");

  // Build results HTML using components
  const header = renderResultsHeader(url, strategy);
  const strategyNote = renderStrategyNote(strategy);
  // Only render sections for selected categories
  categories =
    Array.isArray(categories) && categories.length
      ? categories
      : ["performance", "accessibility", "best-practices", "seo"];
  const perfInsights = categories.includes("performance")
    ? renderPerformanceInsights(metrics.performance)
    : "";
  const scores = renderScoresOverview(metrics, categories);
  const metricsData = `<div id=\"metricsData\" class=\"hidden\" data-metrics='${JSON.stringify(
    metrics
  )}'></div>`;
  const opportunitiesData =
    opportunities.length > 0
      ? `<div id=\"opportunities\" class=\"hidden\" data-opportunities='${JSON.stringify(
          opportunities
        )}'></div>`
      : "";
  const coreWebVitals = categories.includes("performance")
    ? renderCoreWebVitals(metrics)
    : "";
  const perfMetrics = categories.includes("performance")
    ? renderPerformanceMetrics(metrics)
    : "";
  const diagnostics = categories.includes("performance")
    ? renderDiagnosticsSummary(metrics)
    : "";
  const stats = categories.includes("performance")
    ? renderPageStatistics(metrics)
    : "";
  const resourceBreakdown = categories.includes("performance")
    ? renderResourceBreakdown(metrics)
    : "";
  const thirdParty = categories.includes("performance")
    ? renderThirdPartyImpact(metrics.thirdParty)
    : "";
  const accessibilityDetails = categories.includes("accessibility")
    ? renderAccessibilityDetails(metrics.accessibility)
    : "";
  const bestPracticesDetails = categories.includes("best-practices")
    ? renderBestPracticesDetails(metrics.bestPractices)
    : "";
  const seoMetrics = categories.includes("seo")
    ? renderSEOMetrics(metrics.seo, metrics.seoDetails)
    : "";
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
  const compareBtn = document.getElementById("compareBtn");
  const historyBtn = document.getElementById("historyBtn");

  // These handlers may need to be customized to your app's state management
  if (compareBtn)
    compareBtn.addEventListener(
      "click",
      () =>
        window.showCompareForCurrentUrl && window.showCompareForCurrentUrl(url)
    );
  if (historyBtn)
    historyBtn.addEventListener(
      "click",
      () => window.renderHistoryPanel && window.renderHistoryPanel()
    );

  if (mobileBtn) {
    mobileBtn.addEventListener(
      "click",
      () => window.switchStrategy && window.switchStrategy("mobile")
    );
  }
  if (desktopBtn) {
    desktopBtn.addEventListener(
      "click",
      () => window.switchStrategy && window.switchStrategy("desktop")
    );
  }
}

export function showCompareForCurrentUrl(
  resultsDiv,
  url,
  testResults,
  previousStrategy = "mobile"
) {
  const entry = testResults || null;
  if (!entry) {
    alert("No saved results to compare for this URL.");
    return;
  }
  const m = entry.mobile?.metrics || null;
  const d = entry.desktop?.metrics || null;
  if (!m || !d) {
    alert("Both mobile and desktop results are required to compare.");
    return;
  }

  const left = `
    <div class=\"w-full md:w-1/2 p-3\">
      <h4 class=\"text-lg font-bold mb-2\">Mobile</h4>
      ${renderScoresOverview(m)}
      ${renderCoreWebVitals(m)}
    </div>`;
  const right = `
    <div class=\"w-full md:w-1/2 p-3\">
      <h4 class=\"text-lg font-bold mb-2\">Desktop</h4>
      ${renderScoresOverview(d)}
      ${renderCoreWebVitals(d)}
    </div>`;

  resultsDiv.innerHTML = `
    <div class=\"mb-4 flex items-center justify-between\">
      <h3 class=\"text-lg font-bold\">Compare Mobile vs Desktop</h3>
      <div class=\"flex items-center gap-2\">
        <button id=\"closeCompareBtn\" aria-label=\"Close comparison and return to results\" class=\"px-3 py-1 rounded bg-white border border-gray-200 text-sm\">Close</button>
      </div>
    </div>
    <div class=\"flex flex-col md:flex-row gap-4\">
      ${left}
      ${right}
    </div>`;

  // wire the close button to restore previous single-strategy view
  const closeBtn = document.getElementById("closeCompareBtn");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      // prefer the provided previousStrategy, fallback to mobile
      const strat = previousStrategy || (entry.mobile ? "mobile" : "desktop");
      const res = entry[strat];
      if (!res) {
        // if the requested strategy isn't available, pick any available
        const available = entry.mobile ? "mobile" : "desktop";
        const r = entry[available];
        renderResults(resultsDiv, url, r.metrics, r.opportunities, available);
      } else {
        renderResults(resultsDiv, url, res.metrics, res.opportunities, strat);
      }
    });
  }
}
