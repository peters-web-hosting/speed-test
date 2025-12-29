// Form component for URL input and test strategy selection
export const performanceTips = [
  "💡 Lazy load images below the fold to improve initial page load time.",
  "💡 Use a CDN to serve static assets from locations closer to your users.",
  "💡 Minify CSS and JavaScript files to reduce their file sizes.",
  "💡 Enable gzip compression on your server to reduce transfer sizes.",
  '💡 Preload critical resources using <link rel="preload"> tags.',
  "💡 Remove unused CSS and JavaScript to reduce page bloat.",
  "💡 Optimize images with modern formats like WebP and AVIF.",
  "💡 Implement code splitting to load only necessary code for each page.",
  "💡 Use font-display: swap to prevent invisible text while fonts load.",
  "💡 Enable browser caching with proper Cache-Control headers.",
  "💡 Move non-critical JavaScript to the end of the document body.",
  "💡 Use async or defer attributes on script tags when possible.",
  "💡 Optimize your server response time (target < 200ms).",
  "💡 Use responsive images with srcset to serve appropriate sizes.",
  "💡 Eliminate render-blocking resources where possible.",
  "💡 Keep your DOM size manageable (aim for < 1500 elements).",
  "💡 Use Web Fonts carefully - they can impact performance.",
  "💡 Monitor Core Web Vitals regularly to catch regressions early.",
  "💡 Use a performance budgeting tool to prevent performance debt.",
  "💡 Test on real devices and networks, not just fast connections.",
];

function getRandomTip() {
  return performanceTips[Math.floor(Math.random() * performanceTips.length)];
}

export function renderForm() {
  return `
    <form id="testForm" class="bg-white rounded-xl shadow-lg p-8 space-y-6 border border-orange-100">
      <div class="mb-2">
        <h2 class="text-2xl font-bold text-accent">Test Your Website Performance</h2>
        <p class="text-gray-600 text-sm mt-1">Enter your website URL and select a device type to analyze</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <label class="block">
          <span class="text-sm font-semibold text-accent">Website URL</span>
          <input id="url" type="url" required placeholder="https://example.com"
                 class="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition-all"/>
        </label>
        <label class="block">
          <span class="text-sm font-semibold text-accent">Test Device</span>
          <select id="strategy" class="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition-all bg-white cursor-pointer">
            <option value="mobile">📱 Mobile</option>
            <option value="desktop">💻 Desktop</option>
          </select>
        </label>
      </div>
      <button type="submit" class="w-full bg-primary hover:bg-orange-500 text-black px-8 py-4 rounded-lg transition-all font-semibold text-lg shadow-md hover:shadow-lg">
        🚀 Run Performance Test
      </button>
      <div class="flex items-center justify-around pt-4 border-t border-gray-200 text-xs text-gray-600">
        <div class="flex items-center gap-2">✔️ <span>Instant Results</span></div>
        <div class="flex items-center gap-2">✔️ <span>Comprehensive Analysis</span></div>
        <div class="flex items-center gap-2">✔️ <span>Free & Fast</span></div>
      </div>
    </form>
  `;
}

export function renderLoadingState() {
  const tip = getRandomTip();
  return `
    <div id="loading" class="hidden mt-16 text-center">
      <div class="flex justify-center mb-6">
        <div class="relative inline-block h-20 w-20">
          <div class="absolute inset-0 animate-spin rounded-full border-4 border-orange-100 border-t-primary"></div>
          <div class="absolute inset-2 animate-pulse rounded-full bg-orange-50"></div>
        </div>
      </div>
      <p class="mt-6 text-xl font-semibold text-accent">Running comprehensive audit...</p>
      <p class="text-sm text-gray-600 mt-2">This may take 15-30 seconds • Analyzing performance metrics...</p>
      <div id="tipContainer" class="mt-8 bg-orange-50 border border-orange-200 rounded-lg p-6 max-w-md mx-auto transition-opacity duration-300 shadow-sm">
        <p class="text-sm text-gray-700 leading-relaxed">${tip}</p>
      </div>
    </div>
  `;
}
