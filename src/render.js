// src/render.js
// Handles all rendering logic for results and initial UI
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

export function renderInitialUI() {
  const root = document.querySelector("#app");
  root.innerHTML = `
    <main role="main" aria-labelledby="pageTitle" class="min-h-screen bg-white">
      <div class="max-w-6xl mx-auto px-6 py-12">
        <div class="text-center mb-12">
          <div class="inline-block bg-orange-50 px-4 py-2 rounded-full text-sm font-semibold text-primary mb-4">
            ⚡ Website Performance Analyzer
          </div>
          <h1 id="pageTitle" class="text-5xl md:text-6xl font-bold text-accent mb-4">
            Speed Test & Performance Insights
          </h1>
          <p class="text-xl text-gray-700 max-w-3xl mx-auto">
            Analyze your website performance with detailed metrics and actionable recommendations powered by Google PageSpeed Insights.
          </p>
        </div>
        ${renderForm()}
        ${renderLoadingState()}
        <div id="results" class="mt-16" aria-live="polite"></div>
      </div>
    </main>
  `;
}

export function renderResults(url, metrics, opportunities, strategy) {
  // ...copy the renderResults logic from main.jsx here...
}
