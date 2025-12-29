// Page statistics component - displays page size, DOM size, requests, etc.
import { formatTime, formatBytes } from "../utils/formatters.js";

export function renderPageStatistics(metrics) {
  return `
    <div class="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-100">
      <h3 class="text-lg font-bold text-accent mb-4">Page Statistics</h3>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div class="bg-orange-50 p-3 rounded-lg">
          <p class="text-xs text-gray-600">Total Size</p>
          <p class="text-lg font-semibold text-accent">${formatBytes(
            metrics.totalSize
          )}</p>
        </div>
        <div class="bg-orange-50 p-3 rounded-lg">
          <p class="text-xs text-gray-600">DOM Elements</p>
          <p class="text-lg font-semibold text-accent">${metrics.domSize}</p>
        </div>
        <div class="bg-orange-50 p-3 rounded-lg">
          <p class="text-xs text-gray-600">Requests</p>
          <p class="text-lg font-semibold text-accent">${
            metrics.requestCount
          }</p>
        </div>
        <div class="bg-orange-50 p-3 rounded-lg">
          <p class="text-xs text-gray-600">JS Time</p>
          <p class="text-lg font-semibold text-accent">${formatTime(
            metrics.jsTime
          )}</p>
        </div>
        <div class="bg-orange-50 p-3 rounded-lg">
          <p class="text-xs text-gray-600">Unused CSS</p>
          <p class="text-lg font-semibold text-accent">${formatBytes(
            metrics.unusedCSS
          )}</p>
        </div>
        <div class="bg-orange-50 p-3 rounded-lg">
          <p class="text-xs text-gray-600">Unused JS</p>
          <p class="text-lg font-semibold text-accent">${formatBytes(
            metrics.unusedJS
          )}</p>
        </div>
        <div class="bg-orange-50 p-3 rounded-lg">
          <p class="text-xs text-gray-600">Image Savings</p>
          <p class="text-lg font-semibold text-accent">${formatBytes(
            metrics.imageSize
          )}</p>
        </div>
        <div class="bg-orange-50 p-3 rounded-lg">
          <p class="text-xs text-gray-600">Render Blocking</p>
          <p class="text-lg font-semibold text-accent">${
            metrics.renderBlocking
          }</p>
        </div>
      </div>
    </div>
  `;
}
