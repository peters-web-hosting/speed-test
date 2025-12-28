// Best practices details component - shows best practices score and guidelines
export function renderBestPracticesDetails(bestPracticesScore) {
  return `
    <div class="bg-white rounded-xl shadow-sm p-6 mb-6">
      <h3 class="text-lg font-semibold mb-4">⚙️ Best Practices</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-amber-50 p-4 rounded-lg">
          <p class="text-sm font-medium text-amber-900 mb-2">Best Practices Score</p>
          <p class="text-3xl font-bold text-amber-600">${bestPracticesScore}</p>
          <p class="text-xs text-amber-600 mt-1">/100</p>
        </div>
        <div class="bg-amber-50 p-4 rounded-lg">
          <p class="text-sm font-medium text-amber-900 mb-2">Key Areas</p>
          <ul class="text-xs text-amber-900 space-y-1">
            <li>• Use HTTPS everywhere</li>
            <li>• No unoptimized images</li>
            <li>• Modern JavaScript syntax</li>
            <li>• Avoid deprecated APIs</li>
          </ul>
        </div>
      </div>
    </div>
  `;
}
