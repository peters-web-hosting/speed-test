// Performance metrics component - displays all performance timing metrics
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

export function renderPerformanceMetrics(metrics) {
  return `
    <div class="bg-white rounded-xl shadow-sm p-6 mb-6">
      <h3 class="text-lg font-semibold mb-4">Performance Metrics</h3>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
        ${renderMetricCard(
          "Time to First Byte",
          formatTime(metrics.ttfb),
          "Server response time",
          metricColor(metrics.ttfb, 800, 1800)
        )}
        ${renderMetricCard(
          "First Contentful Paint",
          formatTime(metrics.fcp),
          "First visual response",
          metricColor(metrics.fcp, 1800, 3000)
        )}
        ${renderMetricCard(
          "Speed Index",
          formatTime(metrics.speedIndex),
          "Content visibility speed",
          metricColor(metrics.speedIndex, 3400, 5800)
        )}
        ${renderMetricCard(
          "Time to Interactive",
          formatTime(metrics.tti),
          "Full interactivity",
          metricColor(metrics.tti, 3800, 7300)
        )}
        ${renderMetricCard(
          "First Meaningful Paint",
          formatTime(metrics.fmp || metrics.fcp),
          "Primary content visible",
          metricColor(metrics.fmp || metrics.fcp, 2000, 4000)
        )}
        ${renderMetricCard(
          "Max Potential FID",
          formatTime(metrics.fid),
          "Worst-case input delay",
          metricColor(metrics.fid, 100, 300)
        )}
      </div>
    </div>
  `;
}
