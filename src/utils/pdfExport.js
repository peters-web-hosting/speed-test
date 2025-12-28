// PDF Export functionality
import jsPDF from "jspdf";
import { formatTime, formatBytes } from "./formatters.js";

export async function exportToPDF(url, strategy, metrics, opportunities) {
  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  let yPosition = 20;

  // Show loading indicator
  const exportBtn = document.getElementById("exportBtn");
  const originalText = exportBtn.innerHTML;
  exportBtn.innerHTML =
    '<span class="animate-spin inline-block">⏳</span> Generating PDF...';
  exportBtn.disabled = true;

  try {
    // Title and header
    pdf.setFontSize(20);
    pdf.text("Website Performance Report", 20, yPosition);
    yPosition += 10;

    pdf.setFontSize(10);
    pdf.setTextColor(100);
    pdf.text(url, 20, yPosition);
    yPosition += 5;
    pdf.text(
      `${
        strategy === "mobile" ? "Mobile" : "Desktop"
      } Test • ${new Date().toLocaleString()}`,
      20,
      yPosition
    );
    yPosition += 15;

    // Scores section
    pdf.setFontSize(14);
    pdf.setTextColor(0);
    pdf.text("Overall Scores", 20, yPosition);
    yPosition += 10;

    // Draw score boxes
    const scoreCategories = [
      { name: "Performance", score: metrics.performance },
      { name: "Accessibility", score: metrics.accessibility },
      { name: "Best Practices", score: metrics.bestPractices },
      { name: "SEO", score: metrics.seo },
    ];

    pdf.setFontSize(10);
    let xPos = 20;
    scoreCategories.forEach((cat) => {
      // Draw score box
      const color =
        cat.score >= 90
          ? [16, 185, 129]
          : cat.score >= 50
          ? [245, 158, 11]
          : [239, 68, 68];
      pdf.setDrawColor(...color);
      pdf.setFillColor(...color);
      pdf.rect(xPos, yPosition, 40, 15, "S");

      // Score text
      pdf.setTextColor(255);
      pdf.setFontSize(12);
      pdf.text(`${cat.score}/100`, xPos + 20, yPosition + 8, {
        align: "center",
      });

      // Category name
      pdf.setTextColor(0);
      pdf.setFontSize(9);
      pdf.text(cat.name, xPos + 20, yPosition + 20, { align: "center" });

      xPos += 45;
    });
    yPosition += 30;

    // Core Web Vitals section
    pdf.setFontSize(14);
    pdf.setTextColor(0);
    pdf.text("Core Web Vitals", 20, yPosition);
    yPosition += 8;

    pdf.setFontSize(10);

    // LCP
    pdf.setTextColor(0);
    pdf.text(`LCP: ${formatTime(metrics.lcp)}`, 20, yPosition);
    pdf.setTextColor(100);
    pdf.text(" (Target < 2.5s)", 50, yPosition);
    yPosition += 6;

    // CLS
    pdf.setTextColor(0);
    pdf.text(`CLS: ${metrics.cls.toFixed(3)}`, 20, yPosition);
    pdf.setTextColor(100);
    pdf.text(" (Target < 0.1)", 50, yPosition);
    yPosition += 6;

    // TBT
    pdf.setTextColor(0);
    pdf.text(`TBT: ${formatTime(metrics.tbt)}`, 20, yPosition);
    pdf.setTextColor(100);
    pdf.text(" (Target < 200ms)", 50, yPosition);
    yPosition += 12;

    // Performance Metrics
    pdf.setFontSize(14);
    pdf.setTextColor(0);
    pdf.text("Performance Metrics", 20, yPosition);
    yPosition += 8;

    pdf.setFontSize(9);

    const metricsToShow = [
      { label: "Time to First Byte", value: formatTime(metrics.ttfb) },
      { label: "First Contentful Paint", value: formatTime(metrics.fcp) },
      { label: "Speed Index", value: formatTime(metrics.speedIndex) },
      { label: "Time to Interactive", value: formatTime(metrics.tti) },
      { label: "Total Page Size", value: formatBytes(metrics.totalSize) },
      { label: "DOM Elements", value: metrics.domSize.toString() },
      { label: "Network Requests", value: metrics.requestCount.toString() },
      { label: "JS Execution Time", value: formatTime(metrics.jsTime) },
    ];

    let columnX = 20;
    let columnY = yPosition;
    metricsToShow.forEach((metric, index) => {
      if (index === 4) {
        columnX = 110;
        columnY = yPosition;
      }
      pdf.text(`${metric.label}: ${metric.value}`, columnX, columnY);
      columnY += 5;
    });
    yPosition = columnY + 10;

    // Check if we need a new page
    if (yPosition > pageHeight - 40) {
      pdf.addPage();
      yPosition = 20;
    }

    // Opportunities section if exists
    if (opportunities && opportunities.length > 0) {
      pdf.setFontSize(14);
      pdf.setTextColor(0);
      pdf.text("Improvement Opportunities", 20, yPosition);
      yPosition += 8;

      pdf.setFontSize(9);
      opportunities.slice(0, 5).forEach((opp) => {
        if (yPosition > pageHeight - 20) {
          pdf.addPage();
          yPosition = 20;
        }
        pdf.setTextColor(0);
        const titleLines = pdf.splitTextToSize(
          `• ${opp.title}`,
          pageWidth - 40
        );
        pdf.text(titleLines, 25, yPosition);
        yPosition += titleLines.length * 4;

        pdf.setTextColor(100);
        pdf.text(
          `  Potential savings: ${formatTime(opp.savings)}`,
          25,
          yPosition
        );
        yPosition += 6;
      });
    }

    // Screenshot if exists
    const screenshotImg = document.querySelector("#screenshot img");
    if (screenshotImg && screenshotImg.src) {
      if (yPosition > pageHeight - 100) {
        pdf.addPage();
        yPosition = 20;
      }

      pdf.setFontSize(14);
      pdf.setTextColor(0);
      pdf.text("Page Screenshot", 20, yPosition);
      yPosition += 10;

      try {
        pdf.addImage(screenshotImg.src, "PNG", 20, yPosition, 170, 100);
      } catch (e) {
        console.log("Could not add screenshot to PDF:", e);
      }
    }

    // Save the PDF
    const filename = `performance-report-${
      new URL(url).hostname
    }-${Date.now()}.pdf`;
    pdf.save(filename);
  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("Error generating PDF. Please try again.");
  } finally {
    exportBtn.innerHTML = originalText;
    exportBtn.disabled = false;
  }
}
