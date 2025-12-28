// Diagnostics summary component - displays key diagnostic information
export function renderDiagnosticsSummary(metrics) {
  return `
    <div class="bg-white rounded-xl shadow-sm p-6 mb-6">
      <h3 class="text-lg font-semibold mb-4">🔧 Diagnostics Summary</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="border-l-4 border-blue-500 pl-4 py-2">
          <p class="text-xs text-gray-600">Main Thread Work Breakdown</p>
          <p class="text-lg font-semibold">${(metrics.jsTime / 1000).toFixed(
            1
          )}s</p>
          <p class="text-xs text-gray-500 mt-1">Time spent on main thread</p>
        </div>
        <div class="border-l-4 border-purple-500 pl-4 py-2">
          <p class="text-xs text-gray-600">Render-Blocking Resources</p>
          <p class="text-lg font-semibold">${metrics.renderBlocking}</p>
          <p class="text-xs text-gray-500 mt-1">Resources blocking rendering</p>
        </div>
        <div class="border-l-4 border-orange-500 pl-4 py-2">
          <p class="text-xs text-gray-600">Network Requests</p>
          <p class="text-lg font-semibold">${metrics.requestCount}</p>
          <p class="text-xs text-gray-500 mt-1">Total HTTP requests made</p>
        </div>
        <div class="border-l-4 border-red-500 pl-4 py-2">
          <p class="text-xs text-gray-600">DOM Size</p>
          <p class="text-lg font-semibold">${metrics.domSize}</p>
          <p class="text-xs text-gray-500 mt-1">Elements in the DOM</p>
        </div>
      </div>
    </div>
  `;
}
