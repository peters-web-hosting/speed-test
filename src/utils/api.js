// PageSpeed Insights API handler

const API_KEY = import.meta.env.VITE_PAGESPEED_API_KEY;

export function validateApiKey() {
  if (!API_KEY) {
    console.error(
      "PageSpeed API key not configured. Please set VITE_PAGESPEED_API_KEY environment variable."
    );
    return false;
  }
  return true;
}

export async function fetchPageSpeedData(url, strategy) {
  if (!API_KEY) {
    throw new Error(
      "API key not configured. Please set up the VITE_PAGESPEED_API_KEY environment variable."
    );
  }

  const psiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(
    url
  )}&strategy=${strategy}&category=performance&category=accessibility&category=best-practices&category=seo&key=${API_KEY}`;

  const res = await fetch(psiUrl);
  const data = await res.json();

  if (data.error) {
    if (data.error.code === 403 || data.error.code === 400) {
      throw new Error(
        "Invalid or missing API key. Please check your PageSpeed Insights API key configuration."
      );
    }
    throw new Error(data.error.message);
  }

  return data;
}

export function extractMetrics(data) {
  const audits = data.lighthouseResult.audits;
  const categories = data.lighthouseResult.categories;

  return {
    // Category scores
    performance: Math.round(categories.performance.score * 100),
    accessibility: Math.round(categories.accessibility?.score * 100) || 0,
    bestPractices: Math.round(categories["best-practices"]?.score * 100) || 0,
    seo: Math.round(categories.seo?.score * 100) || 0,

    // Core Web Vitals
    lcp: audits["largest-contentful-paint"].numericValue,
    cls: audits["cumulative-layout-shift"].numericValue,
    fid: audits["max-potential-fid"]?.numericValue || 0,

    // Other performance metrics
    ttfb: audits["server-response-time"]?.numericValue || 0,
    fcp: audits["first-contentful-paint"].numericValue,
    speedIndex: audits["speed-index"].numericValue,
    tti: audits["interactive"]?.numericValue || 0,
    tbt: audits["total-blocking-time"]?.numericValue || 0,
    fmp: audits["first-meaningful-paint"]?.numericValue || 0,

    // Page stats
    totalSize: audits["total-byte-weight"]?.numericValue || 0,
    domSize: audits["dom-size"]?.numericValue || 0,
    requestCount: audits["network-requests"]?.details?.items?.length || 0,
    jsTime: audits["mainthread-work-breakdown"]?.numericValue || 0,
    unusedCSS: audits["unused-css-rules"]?.details?.overallSavingsBytes || 0,
    unusedJS: audits["unused-javascript"]?.details?.overallSavingsBytes || 0,

    // Resources breakdown
    imageSize:
      audits["uses-optimized-images"]?.details?.overallSavingsBytes || 0,
    renderBlocking:
      audits["render-blocking-resources"]?.details?.items?.length || 0,
    thirdParty: audits["third-party-summary"]?.details?.items || [],

    // Screenshot
    screenshot: audits["final-screenshot"]?.details?.data || null,
  };
}

export function extractOpportunities(audits) {
  const opportunities = [];
  Object.entries(audits).forEach(([key, audit]) => {
    if (audit.details?.type === "opportunity" && audit.numericValue > 100) {
      opportunities.push({
        title: audit.title,
        description: audit.description,
        savings: audit.numericValue,
      });
    }
  });
  return opportunities.sort((a, b) => b.savings - a.savings);
}
