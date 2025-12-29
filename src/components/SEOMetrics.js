// SEO metrics component - displays SEO score and checklist
export function renderSEOMetrics(seoScore, seoDetails = {}) {
  const passed = (s) => (typeof s === "number" ? s >= 0.9 : s === true);

  const statusIcon = (ok) => (ok ? "✅" : "⚠️");

  const imageAltMissing = seoDetails.imageAlt?.missing || 0;
  const linkTextMissing = seoDetails.linkText?.missing || 0;

  return `
    <div class="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-100">
      <h3 class="text-lg font-bold text-accent mb-4">🔍 SEO Metrics</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-primary/10 p-4 rounded-lg border border-primary/20">
          <p class="text-sm font-medium text-accent mb-2">SEO Score</p>
          <p class="text-3xl font-bold text-primary">${
            seoDetails.summary?.score ?? seoScore
          }</p>
          <p class="text-xs text-primary mt-1">/100</p>
        </div>
        <div class="bg-primary/10 p-4 rounded-lg border border-primary/20">
          <p class="text-sm font-medium text-accent mb-2">SEO Checklist</p>
          <ul class="text-xs text-gray-700 space-y-2">
            <li>${statusIcon(
              passed(seoDetails.documentTitle?.score)
            )} Document title: ${
    seoDetails.documentTitle?.description || "Present and descriptive"
  }</li>
            <li>${statusIcon(
              passed(seoDetails.metaDescription?.score)
            )} Meta description: ${
    seoDetails.metaDescription?.description || "Present"
  }</li>
            <li>${statusIcon(
              passed(seoDetails.viewport?.score)
            )} Viewport meta: ${
    seoDetails.viewport?.description || "Responsive viewport configured"
  }</li>
            <li>${statusIcon(
              passed(seoDetails.robotsTxt?.score)
            )} robots.txt: ${
    seoDetails.robotsTxt?.description || "Accessible"
  }</li>
            <li>${statusIcon(
              passed(seoDetails.canonical?.score)
            )} Canonical link: ${
    seoDetails.canonical?.description || "Canonical set"
  }</li>
            <li>${statusIcon(passed(seoDetails.hreflang?.score))} Hreflang: ${
    seoDetails.hreflang?.description || "Not required / OK"
  }</li>
            <li>${
              imageAltMissing === 0 ? "✅" : "⚠️"
            } Images missing alt text: ${imageAltMissing}</li>
            <li>${
              linkTextMissing === 0 ? "✅" : "⚠️"
            } Links missing descriptive text: ${linkTextMissing}</li>
            <li>${statusIcon(
              passed(seoDetails.structuredData?.score)
            )} Structured data: ${
    seoDetails.structuredData?.description || "None detected"
  }</li>
          </ul>
        </div>
      </div>
    </div>
  `;
}
