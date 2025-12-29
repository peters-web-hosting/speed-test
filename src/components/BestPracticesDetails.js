// Best practices details component - shows best practices score and guidelines
export function renderBestPracticesDetails(bestPracticesScore) {
  return `
    <div class="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-100">
      <h3 class="text-lg font-bold text-accent mb-4">⚙️ Best Practices</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-primary/10 p-4 rounded-lg border border-primary/20">
          <p class="text-sm font-medium text-accent mb-2">Best Practices Score</p>
          <p class="text-3xl font-bold text-primary">${bestPracticesScore}</p>
          <p class="text-xs text-primary mt-1">/100</p>
        </div>
        <div class="bg-primary/10 p-4 rounded-lg border border-primary/20">
          <p class="text-sm font-medium text-accent mb-2">Key Areas</p>
          <ul class="text-xs text-gray-700 space-y-1">
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
