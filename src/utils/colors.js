// Color utility functions for metric scoring

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

export function getScoreHexColor(score) {
  if (score >= 90) return "#10b981";
  if (score >= 50) return "#f59e0b";
  return "#ef4444";
}

export const BG_COLOR = "#e5e7eb";
