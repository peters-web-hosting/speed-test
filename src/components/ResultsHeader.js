// Header component - displays test info and export button
export function renderResultsHeader(url, strategy) {
  return `
    <div class="bg-white rounded-lg shadow-md p-8 mb-8 border border-orange-100">
      <div class="flex justify-between items-start gap-6">
        <div class="flex-1">
          <h2 class="text-3xl font-bold text-accent mb-2">Performance Report</h2>
          <div class="flex items-center gap-2 text-gray-600 mb-3">
            <span class="text-lg">🔗</span>
            <p class="font-mono text-sm break-all">${url}</p>
          </div>
          <div class="flex items-center gap-4 text-sm flex-wrap">
            <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full ${
              strategy === "mobile"
                ? "bg-blue-100 text-blue-700"
                : "bg-purple-100 text-purple-700"
            }">
              ${strategy === "mobile" ? "📱 Mobile Test" : "💻 Desktop Test"}
            </span>
            <span class="text-gray-600">📅 ${new Date().toLocaleString()}</span>
          </div>
        </div>
        <div class="flex flex-col gap-3">
          <div>
            <p class="text-sm font-medium text-gray-700 mb-2">Toggle device results</p>
            <div class="flex gap-2 items-center">
              <button id="switchMobileBtn" title="Show Mobile results (cached or fetched)" aria-label="Show Mobile results" class="px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                strategy === "mobile"
                  ? "bg-primary text-white shadow-sm"
                  : "border-2 border-primary text-primary hover:bg-orange-50"
              }" style="${
    strategy === "mobile" ? "background-color: #FF8C42;" : ""
  }">
                📱 Mobile
              </button>
              <button id="switchDesktopBtn" title="Show Desktop results (cached or fetched)" aria-label="Show Desktop results" class="px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                strategy === "desktop"
                  ? "bg-primary text-white shadow-sm"
                  : "border-2 border-primary text-primary hover:bg-orange-50"
              }" style="${
    strategy === "desktop" ? "background-color: #FF8C42;" : ""
  }">
                💻 Desktop
              </button>
            </div>
            <p class="text-xs text-gray-500 mt-2">Click a device to view its results — cached results show instantly; otherwise a new test will run.</p>
          </div>
          <button onclick="location.reload()" class="border-2 border-secondary text-secondary hover:bg-orange-50 px-6 py-2 rounded-lg text-sm font-semibold transition-all">
            ↻ New Test
          </button>
        </div>
      </div>
    </div>
  `;
}
