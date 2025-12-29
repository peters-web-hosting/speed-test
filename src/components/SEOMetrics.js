// SEO metrics component - displays SEO score and checklist
export function renderSEOMetrics(seoScore) {
  return `
    <div class="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-100">
      <h3 class="text-lg font-bold text-accent mb-4">🔍 SEO Metrics</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-primary/10 p-4 rounded-lg border border-primary/20">
          <p class="text-sm font-medium text-accent mb-2">SEO Score</p>
          <p class="text-3xl font-bold text-primary">${seoScore}</p>
          <p class="text-xs text-primary mt-1">/100</p>
        </div>
        <div class="bg-primary/10 p-4 rounded-lg border border-primary/20">
          <p class="text-sm font-medium text-accent mb-2">SEO Checklist</p>
          <ul class="text-xs text-gray-700 space-y-1">
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
