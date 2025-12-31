// src/formHandler.js
// Handles form submission and tip rotation
import {
  fetchPageSpeedData,
  extractMetrics,
  extractOpportunities,
} from "./utils/api.js";
import { renderResults } from "./render.js";

export function setupForm() {
  const form = document.getElementById("testForm");
  const loading = document.getElementById("loading");
  const resultsDiv = document.getElementById("results");
  let tipInterval = null;

  function startTipRotation(performanceTips) {
    let tipIndex = 0;
    const tipContainer = document.getElementById("tipContainer");
    if (!tipContainer) return;
    const tipInterval = setInterval(() => {
      tipContainer.style.opacity = "0";
      setTimeout(() => {
        tipIndex = (tipIndex + 1) % performanceTips.length;
        tipContainer.querySelector("p").textContent = performanceTips[tipIndex];
        tipContainer.style.opacity = "1";
      }, 150);
    }, 5000);
    return tipInterval;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const url = document.getElementById("url").value.trim();
    const strategy = document.getElementById("strategy").value;
    if (!url) return;
    form.classList.add("hidden");
    loading.classList.remove("hidden");
    resultsDiv.innerHTML = "";
    // Start rotating tips
    // You may want to import performanceTips from Form.js
    // tipInterval = startTipRotation(performanceTips);
    try {
      const data = await fetchPageSpeedData(url, strategy);
      const metrics = extractMetrics(data);
      const opportunities = extractOpportunities(data.lighthouseResult.audits);
      renderResults(url, metrics, opportunities, strategy);
      if (tipInterval) {
        clearInterval(tipInterval);
        tipInterval = null;
      }
    } catch (err) {
      alert("Error: " + err.message);
      form.classList.remove("hidden");
      loading.classList.add("hidden");
      if (tipInterval) {
        clearInterval(tipInterval);
        tipInterval = null;
      }
    }
  });
}
