// Diagnostics summary component - displays key diagnostic information
export function renderDiagnosticsSummary(metrics) {
  return `
    <div class="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-100">
      <h3 class="text-lg font-bold text-accent mb-4">🔧 Diagnostics Summary</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="border-l-4 border-primary pl-4 py-2">
          <p class="text-xs text-gray-600">Main Thread Work Breakdown</p>
          <p class="text-lg font-semibold text-accent">${(
            metrics.jsTime / 1000
          ).toFixed(1)}s</p>
          <p class="text-xs text-gray-600 mt-1">Time spent on main thread</p>
        </div>
        <div class="border-l-4 border-secondary pl-4 py-2">
          <p class="text-xs text-gray-600">Render-Blocking Resources</p>
          <p class="text-lg font-semibold text-accent">${
            metrics.renderBlocking
          }</p>
          <p class="text-xs text-gray-600 mt-1">Resources blocking rendering</p>
        </div>
        <div class="border-l-4 border-primary pl-4 py-2">
          <p class="text-xs text-gray-600">Network Requests</p>
          <p class="text-lg font-semibold text-accent">${
            metrics.requestCount
          }</p>
          <p class="text-xs text-gray-600 mt-1">Total HTTP requests made</p>
        </div>
        <div class="border-l-4 border-secondary pl-4 py-2">
          <p class="text-xs text-gray-600">DOM Size</p>
          <p class="text-lg font-semibold text-accent">${metrics.domSize}</p>
          <p class="text-xs text-gray-600 mt-1">Elements in the DOM</p>
        </div>
      </div>
    </div>
  `;
}
