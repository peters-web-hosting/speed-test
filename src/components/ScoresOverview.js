// Score display component with visual score rings
import { getScoreHexColor, BG_COLOR } from "../utils/colors.js";

export function renderScoreRing(score, label) {
  const color = getScoreHexColor(score);
  const circumference = 2 * Math.PI * 36;
  const offset = circumference - (score / 100) * circumference;

  return `
    <div class="text-center">
      <div class="relative inline-block">
        <svg width="80" height="80">
          <circle cx="40" cy="40" r="36" stroke="${BG_COLOR}" stroke-width="6" fill="none"/>
          <circle cx="40" cy="40" r="36" stroke="${color}" stroke-width="6" fill="none"
                  stroke-dasharray="${circumference}" stroke-dashoffset="${offset}"
                  transform="rotate(-90 40 40)" style="transition: stroke-dashoffset 0.5s"/>
        </svg>
        <div class="absolute inset-0 flex items-center justify-center">
          <div>
            <p class="text-xl font-bold" style="color: #111827;">${score}</p>
            <p class="text-xs" style="color: #6b7280;">/100</p>
          </div>
        </div>
      </div>
      <p class="text-sm font-medium mt-2" style="color: #111827;">${label}</p>
    </div>
  `;
}

export function renderScoresOverview(metrics, categories) {
  categories =
    Array.isArray(categories) && categories.length
      ? categories
      : ["performance", "accessibility", "best-practices", "seo"];
  const rings = [];
  if (categories.includes("performance"))
    rings.push(renderScoreRing(metrics.performance, "Performance"));
  if (categories.includes("accessibility"))
    rings.push(renderScoreRing(metrics.accessibility, "Accessibility"));
  if (categories.includes("best-practices"))
    rings.push(renderScoreRing(metrics.bestPractices, "Best Practices"));
  if (categories.includes("seo"))
    rings.push(renderScoreRing(metrics.seo, "SEO"));
  return `
    <div class="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-100">
      <h3 class="text-lg font-bold text-accent mb-6">Overall Scores</h3>
      <div id="scoreRings" class="grid grid-cols-2 md:grid-cols-4 gap-6">
        ${rings.join("\n")}
      </div>
    </div>
  `;
}
