// Formatting utility functions

export function formatTime(ms) {
  if (ms < 1000) return Math.round(ms) + " ms";
  return (ms / 1000).toFixed(1) + " s";
}

export function formatBytes(bytes) {
  if (!bytes) return "0 B";
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export function scoreColor(value, good = 90, ok = 50) {
  if (value >= good) return "bg-green-100 text-green-700";
  if (value >= ok) return "bg-amber-100 text-amber-700";
  return "bg-red-100 text-red-700";
}

export function metricColor(value, good, ok) {
  if (value <= good) return "bg-green-100 text-green-700";
  if (value <= ok) return "bg-amber-100 text-amber-700";
  return "bg-red-100 text-red-700";
}

export function metricCard(title, value, explanation, colorClass, icon = "") {
  return `
    <div class="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div class="inline-block px-2 py-1 rounded-full text-xs font-medium mb-2 ${colorClass}">
        ${
          colorClass.includes("green")
            ? "Good"
            : colorClass.includes("amber")
            ? "Needs improvement"
            : "Poor"
        }
      </div>
      <p class="text-sm text-slate-500">${title}</p>
      <p class="text-2xl font-bold">${value}</p>
      <p class="text-xs text-slate-600 mt-1">${explanation}</p>
    </div>
  `;
}
