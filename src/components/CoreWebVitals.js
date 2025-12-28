// Core Web Vitals component - displays Google's key performance metrics
import { formatTime } from "../utils/formatters.js";
import { metricColor } from "../utils/colors.js";

function renderMetricCard(title, value, explanation, colorClass) {
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

export function renderCoreWebVitals(metrics) {
  return `
    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm p-6 mb-6">
      <h3 class="text-lg font-semibold mb-1">Core Web Vitals</h3>
      <p class="text-sm text-gray-600 mb-4">Google's key metrics for user experience</p>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        ${renderMetricCard(
          "Largest Contentful Paint (LCP)",
          formatTime(metrics.lcp),
          "Main content load time • Target < 2.5s",
          metricColor(metrics.lcp, 2500, 4000)
        )}
        ${renderMetricCard(
          "Cumulative Layout Shift (CLS)",
          metrics.cls.toFixed(3),
          "Visual stability score • Target < 0.1",
          metricColor(metrics.cls, 0.1, 0.25)
        )}
        ${renderMetricCard(
          "Total Blocking Time (TBT)",
          formatTime(metrics.tbt),
          "Input responsiveness • Target < 200ms",
          metricColor(metrics.tbt, 200, 600)
        )}
      </div>
    </div>
  `;
}
