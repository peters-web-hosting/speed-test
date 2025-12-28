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
