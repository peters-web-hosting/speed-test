// Screenshot component - displays the page screenshot from PageSpeed Insights
export function renderPageScreenshot(screenshotData) {
  if (!screenshotData) {
    return "";
  }

  return `
    <div id="screenshot" class="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-100">
      <h3 class="text-lg font-bold text-accent mb-4">Page Screenshot</h3>
      <div class="overflow-auto bg-gray-100 rounded-lg">
        <img src="${screenshotData}" alt="Page screenshot" class="w-full h-auto rounded-lg border shadow-md" style="image-rendering: crisp-edges; min-height: 400px; object-fit: contain;"/>
      </div>
      <p class="text-xs text-gray-600 mt-3">Screenshot of the page as captured during the performance test</p>
    </div>
  `;
}
