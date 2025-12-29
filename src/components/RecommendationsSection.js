// Recommendations component - provides actionable suggestions based on test results
import { formatBytes } from "../utils/formatters.js";

export function renderRecommendationsSection(metrics) {
  return `
    <div class="bg-orange-50 rounded-lg shadow-sm p-6 mb-6 border border-orange-100">
      <h3 class="text-lg font-bold text-accent mb-4">📋 Quick Recommendations</h3>
      <ul class="space-y-2 text-sm text-gray-700">
        ${
          metrics.lcp > 2500
            ? "<li>• <strong>Optimize LCP:</strong> Consider lazy loading, optimizing server response, and using a CDN</li>"
            : ""
        }
        ${
          metrics.cls > 0.1
            ? "<li>• <strong>Fix layout shifts:</strong> Set explicit dimensions for images and embeds</li>"
            : ""
        }
        ${
          metrics.tbt > 200
            ? "<li>• <strong>Reduce blocking time:</strong> Split large JavaScript bundles and defer non-critical JS</li>"
            : ""
        }
        ${
          metrics.unusedCSS > 50000
            ? "<li>• <strong>Remove unused CSS:</strong> Use tools like PurgeCSS to eliminate dead code</li>"
            : ""
        }
        ${
          metrics.totalSize > 3000000
            ? "<li>• <strong>Reduce page weight:</strong> Compress images and minify assets</li>"
            : ""
        }
        ${
          metrics.requestCount > 100
            ? "<li>• <strong>Reduce requests:</strong> Bundle assets and implement resource hints</li>"
            : ""
        }
      </ul>
    </div>
  `;
}
