// Page statistics component - displays page size, DOM size, requests, etc.
import { formatTime, formatBytes } from "../utils/formatters.js";

export function renderPageStatistics(metrics) {
  return `
    <div class="bg-white rounded-xl shadow-sm p-6 mb-6">
      <h3 class="text-lg font-semibold mb-4">Page Statistics</h3>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div class="bg-slate-50 p-3 rounded-lg">
          <p class="text-xs text-slate-600">Total Size</p>
          <p class="text-lg font-semibold">${formatBytes(metrics.totalSize)}</p>
        </div>
        <div class="bg-slate-50 p-3 rounded-lg">
          <p class="text-xs text-slate-600">DOM Elements</p>
          <p class="text-lg font-semibold">${metrics.domSize}</p>
        </div>
        <div class="bg-slate-50 p-3 rounded-lg">
          <p class="text-xs text-slate-600">Requests</p>
          <p class="text-lg font-semibold">${metrics.requestCount}</p>
        </div>
        <div class="bg-slate-50 p-3 rounded-lg">
          <p class="text-xs text-slate-600">JS Time</p>
          <p class="text-lg font-semibold">${formatTime(metrics.jsTime)}</p>
        </div>
        <div class="bg-slate-50 p-3 rounded-lg">
          <p class="text-xs text-slate-600">Unused CSS</p>
          <p class="text-lg font-semibold">${formatBytes(metrics.unusedCSS)}</p>
        </div>
        <div class="bg-slate-50 p-3 rounded-lg">
          <p class="text-xs text-slate-600">Unused JS</p>
          <p class="text-lg font-semibold">${formatBytes(metrics.unusedJS)}</p>
        </div>
        <div class="bg-slate-50 p-3 rounded-lg">
          <p class="text-xs text-slate-600">Image Savings</p>
          <p class="text-lg font-semibold">${formatBytes(metrics.imageSize)}</p>
        </div>
        <div class="bg-slate-50 p-3 rounded-lg">
          <p class="text-xs text-slate-600">Render Blocking</p>
          <p class="text-lg font-semibold">${metrics.renderBlocking}</p>
        </div>
      </div>
    </div>
  `;
}
