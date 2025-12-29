// Third-party impact component - shows third-party resources and their performance impact
import { formatTime, formatBytes } from "../utils/formatters.js";

export function renderThirdPartyImpact(thirdPartyData) {
  if (!thirdPartyData || thirdPartyData.length === 0) {
    return "";
  }

  return `
    <div class="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-100">
      <h3 class="text-lg font-bold text-accent mb-4">Third-Party Impact</h3>
      <div class="space-y-2">
        ${thirdPartyData
          .slice(0, 5)
          .map(
            (tp) => `
          <div class="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
            <span class="text-sm font-medium text-gray-900">${tp.entity}</span>
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
  `;
}
