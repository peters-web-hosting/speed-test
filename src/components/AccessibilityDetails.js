// Accessibility details component - shows accessibility issues and improvements
export function renderAccessibilityDetails(accessibilityScore) {
  return `
    <div class="bg-white rounded-xl shadow-sm p-6 mb-6">
      <h3 class="text-lg font-semibold mb-4">♿ Accessibility Details</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-blue-50 p-4 rounded-lg">
          <p class="text-sm font-medium text-blue-900 mb-2">Score</p>
          <p class="text-3xl font-bold text-blue-600">${accessibilityScore}</p>
          <p class="text-xs text-blue-600 mt-1">/100</p>
        </div>
        <div class="bg-blue-50 p-4 rounded-lg">
          <p class="text-sm font-medium text-blue-900 mb-2">Recommendations</p>
          <ul class="text-xs text-blue-900 space-y-1">
            <li>• Ensure proper heading hierarchy</li>
            <li>• Use alt text for all images</li>
            <li>• Maintain sufficient color contrast</li>
            <li>• Add ARIA labels where needed</li>
          </ul>
        </div>
      </div>
    </div>
  `;
}
