// Performance score insights component - provides detailed interpretation
export function renderPerformanceInsights(performanceScore) {
  let description, tips;

  if (performanceScore >= 90) {
    description = "Excellent Performance";
    tips =
      "Your site is highly optimized. Continue monitoring and maintain best practices.";
  } else if (performanceScore >= 75) {
    description = "Good Performance";
    tips =
      "Your site performs well. Focus on the improvement opportunities highlighted below.";
  } else if (performanceScore >= 50) {
    description = "Moderate Performance";
    tips =
      "There's room for improvement. Prioritize the high-impact opportunities.";
  } else {
    description = "Poor Performance";
    tips =
      "Significant optimization needed. Start with the critical opportunities.";
  }

  return `
    <div class="bg-orange-50 rounded-lg shadow-sm p-6 mb-6 border border-orange-100">
      <h3 class="text-lg font-bold text-accent mb-2">📊 Performance Analysis</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p class="text-sm text-gray-600 mb-2">Overall Performance Rating</p>
          <p class="text-2xl font-bold text-primary">${description}</p>
          <p class="text-xs text-gray-600 mt-2">Score: ${performanceScore}/100</p>
        </div>
        <div>
          <p class="text-sm text-gray-600 mb-2">Recommendation</p>
          <p class="text-sm text-gray-700">${tips}</p>
        </div>
      </div>
    </div>
  `;
}
