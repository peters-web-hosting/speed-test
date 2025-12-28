// Header component - displays test info and export button
export function renderResultsHeader(url, strategy, exportCallback) {
  return `
    <div class="bg-gradient-to-r from-white to-slate-50 rounded-2xl shadow-md p-8 mb-8 border border-gray-100">
      <div class="flex justify-between items-start gap-6">
        <div class="flex-1">
          <h2 class="text-3xl font-bold text-gray-900 mb-2">Performance Report</h2>
          <div class="flex items-center gap-2 text-gray-600 mb-3">
            <span class="text-lg">🔗</span>
            <p class="font-mono text-sm break-all">${url}</p>
          </div>
          <div class="flex items-center gap-4 text-sm">
            <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full ${
              strategy === "mobile"
                ? "bg-blue-100 text-blue-700"
                : "bg-purple-100 text-purple-700"
            }">
              ${strategy === "mobile" ? "📱 Mobile Test" : "💻 Desktop Test"}
            </span>
            <span class="text-gray-500">📅 ${new Date().toLocaleString()}</span>
          </div>
        </div>
        <div class="flex gap-3">
          <button id="exportBtn" onclick="${exportCallback}" 
                  class="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-emerald-700 text-sm font-semibold flex items-center gap-2 shadow-md hover:shadow-lg transition-all">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a1 1 0 00-1 1v6H6a1 1 0 100 2h3v6a1 1 0 102 0v-6h3a1 1 0 100-2h-3V3a1 1 0 00-1-1z"/>
              <path d="M3 8a1 1 0 011-1h2a1 1 0 110 2H5v8h10v-8h-1a1 1 0 110-2h2a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V8z"/>
            </svg>
            Download PDF
          </button>
          <button onclick="location.reload()" class="border-2 border-gray-300 text-gray-700 hover:border-gray-400 px-6 py-3 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-all">
            ↻ New Test
          </button>
        </div>
      </div>
    </div>
  `;
}
