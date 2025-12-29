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
    domSize: (() => {
      const domAudit = audits["dom-size"];
      if (domAudit) {
        if (typeof domAudit.numericValue === "number")
          return domAudit.numericValue;
        if (domAudit.details?.overallDomCount)
          return domAudit.details.overallDomCount;
        if (Array.isArray(domAudit.details?.items)) {
          for (const it of domAudit.details.items) {
            const candidateKeys = ["value", "count", "nodes", "total", "size"];
            for (const k of candidateKeys) {
              if (typeof it[k] === "number" && !Number.isNaN(it[k]))
                return it[k];
            }
            if (
              it.statistic &&
              typeof it.statistic === "object" &&
              typeof it.statistic.value === "number"
            )
              return it.statistic.value;
            if (
              typeof it.statistic === "string" &&
              !Number.isNaN(Number(it.statistic))
            )
              return Number(it.statistic);
          }
        }
      }

      // Fallback: many PSI responses include a fullPageScreenshot with nodes
      const fps =
        data.lighthouseResult?.fullPageScreenshot ||
        data.lighthouseResult?.full_page_screenshot ||
        data.fullPageScreenshot;
      if (fps) {
        const nodes = fps.nodes || fps.screenshot?.nodes || null;
        if (Array.isArray(nodes)) return nodes.length;
        if (nodes && typeof nodes === "object")
          return Object.keys(nodes).length;
        if (typeof fps.total === "number") return fps.total;
        if (typeof fps.nodeCount === "number") return fps.nodeCount;
      }

      // Another fallback: check for nodes in a 'full-page-screenshot' audit details
      const fpsAudit = audits["full-page-screenshot"];
      if (fpsAudit?.details?.nodes && Array.isArray(fpsAudit.details.nodes))
        return fpsAudit.details.nodes.length;
      if (fpsAudit?.details?.items && Array.isArray(fpsAudit.details.items))
        return fpsAudit.details.items.length;

      try {
        console.log(
          "dom-size not found; domAudit:",
          domAudit,
          "fullPageScreenshot:",
          fps
        );
      } catch (e) {}
      return 0;
    })(),
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
    // SEO details: extract common SEO audit results for a concise checklist
    seoDetails: (function () {
      const get = (key) => audits[key];
      const present = (k) => !!get(k);

      const documentTitle = get("document-title");
      const metaDescription = get("meta-description");
      const viewport = get("viewport");
      const robotsTxt = get("robots-txt");
      const canonical = get("canonical");
      const hreflang = get("hreflang");
      const imageAlt = get("image-alt");
      const linkText = get("link-text");
      const structuredData = get("structured-data");

      return {
        documentTitle: {
          score: documentTitle?.score ?? null,
          description: documentTitle?.description ?? "",
        },
        metaDescription: {
          score: metaDescription?.score ?? null,
          description: metaDescription?.description ?? "",
        },
        viewport: {
          score: viewport?.score ?? null,
          description: viewport?.description ?? "",
        },
        robotsTxt: {
          score: robotsTxt?.score ?? null,
          description: robotsTxt?.description ?? "",
        },
        canonical: {
          score: canonical?.score ?? null,
          description: canonical?.description ?? "",
        },
        hreflang: {
          score: hreflang?.score ?? null,
          description: hreflang?.description ?? "",
        },
        imageAlt: {
          score: imageAlt?.score ?? null,
          missing: imageAlt?.details?.items ? imageAlt.details.items.length : 0,
          description: imageAlt?.description ?? "",
        },
        linkText: {
          score: linkText?.score ?? null,
          missing: linkText?.details?.items ? linkText.details.items.length : 0,
          description: linkText?.description ?? "",
        },
        structuredData: {
          score: structuredData?.score ?? null,
          description: structuredData?.description ?? "",
        },
        // A quick summary flag to indicate if SEO category is mostly healthy
        summary: {
          score: Math.round(categories.seo?.score * 100) || 0,
        },
      };
    })(),
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
