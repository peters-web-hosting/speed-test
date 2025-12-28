// SEO metrics component - displays SEO score and checklist
export function renderSEOMetrics(seoScore) {
  return `
    <div class="bg-white rounded-xl shadow-sm p-6 mb-6">
      <h3 class="text-lg font-semibold mb-4">🔍 SEO Metrics</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-green-50 p-4 rounded-lg">
          <p class="text-sm font-medium text-green-900 mb-2">SEO Score</p>
          <p class="text-3xl font-bold text-green-600">${seoScore}</p>
          <p class="text-xs text-green-600 mt-1">/100</p>
        </div>
        <div class="bg-green-50 p-4 rounded-lg">
          <p class="text-sm font-medium text-green-900 mb-2">SEO Checklist</p>
          <ul class="text-xs text-green-900 space-y-1">
            <li>✓ Mobile-friendly design</li>
            <li>✓ Proper meta tags</li>
            <li>✓ Structured data markup</li>
            <li>✓ Valid robots.txt file</li>
          </ul>
        </div>
      </div>
    </div>
  `;
}
