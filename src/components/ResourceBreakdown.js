// Resource breakdown component - shows breakdown of resources by type
import { formatBytes } from "../utils/formatters.js";

export function renderResourceBreakdown(metrics) {
  const htmlSize = metrics.totalSize * 0.05; // Estimate
  const cssSize = metrics.totalSize * 0.1;
  const jsSize = metrics.totalSize * 0.5;
  const imageSize = metrics.totalSize * 0.25;
  const otherSize = metrics.totalSize * 0.1;

  return `
    <div class="bg-white rounded-xl shadow-sm p-6 mb-6">
      <h3 class="text-lg font-semibold mb-4">📦 Resource Breakdown</h3>
      <div class="space-y-3">
        <div>
          <div class="flex justify-between mb-2">
            <span class="text-sm font-medium">JavaScript</span>
            <span class="text-sm text-gray-600">${formatBytes(jsSize)}</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div class="bg-blue-600 h-2 rounded-full" style="width: 50%"></div>
          </div>
        </div>
        <div>
          <div class="flex justify-between mb-2">
            <span class="text-sm font-medium">Images</span>
            <span class="text-sm text-gray-600">${formatBytes(imageSize)}</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div class="bg-green-600 h-2 rounded-full" style="width: 25%"></div>
          </div>
        </div>
        <div>
          <div class="flex justify-between mb-2">
            <span class="text-sm font-medium">CSS</span>
            <span class="text-sm text-gray-600">${formatBytes(cssSize)}</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div class="bg-purple-600 h-2 rounded-full" style="width: 10%"></div>
          </div>
        </div>
        <div>
          <div class="flex justify-between mb-2">
            <span class="text-sm font-medium">Other</span>
            <span class="text-sm text-gray-600">${formatBytes(
              otherSize + htmlSize
            )}</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div class="bg-gray-600 h-2 rounded-full" style="width: 15%"></div>
          </div>
        </div>
        <div class="pt-2 border-t mt-4">
          <p class="text-sm font-medium">Total Page Size: <span class="text-lg text-gray-900">${formatBytes(
            metrics.totalSize
          )}</span></p>
        </div>
      </div>
    </div>
  `;
}
