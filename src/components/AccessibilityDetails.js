// Accessibility details component - shows accessibility issues and improvements
export function renderAccessibilityDetails(accessibilityScore) {
  return `
    <div class="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-100">
      <h3 class="text-lg font-bold text-accent mb-4">♿ Accessibility Details</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-secondary/10 p-4 rounded-lg border border-secondary/20">
          <p class="text-sm font-medium text-accent mb-2">Score</p>
          <p class="text-3xl font-bold text-secondary">${accessibilityScore}</p>
          <p class="text-xs text-secondary mt-1">/100</p>
        </div>
        <div class="bg-secondary/10 p-4 rounded-lg border border-secondary/20">
          <p class="text-sm font-medium text-accent mb-2">Recommendations</p>
          <ul class="text-xs text-gray-700 space-y-1">
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
