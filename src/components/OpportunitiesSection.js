// Opportunities component - displays improvement suggestions from PageSpeed Insights
import { formatTime } from "../utils/formatters.js";

export function renderOpportunitiesSection(opportunities) {
  if (!opportunities || opportunities.length === 0) {
    return "";
  }

  return `
    <div class="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-100">
      <h3 class="text-lg font-bold text-accent mb-4">💡 Improvement Opportunities</h3>
      <div class="space-y-3">
        ${opportunities
          .slice(0, 5)
          .map(
            (opp) => `
          <div class="border-l-4 border-primary pl-4 py-2">
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <p class="font-medium text-sm text-gray-900">${opp.title}</p>
                <p class="text-xs text-gray-600 mt-1">${opp.description}</p>
              </div>
              <span class="text-xs font-semibold text-primary ml-4">Save ${formatTime(
                opp.savings
              )}</span>
            </div>
          </div>
        `
          )
          .join("")}
      </div>
    </div>
  `;
}
