// Utility to fetch version info from version.json
export async function getVersionInfo() {
  try {
    const response = await fetch("/version.json");
    if (!response.ok) throw new Error("Failed to fetch version info");
    return await response.json();
  } catch (e) {
    return { version: "unknown", buildDate: "unknown" };
  }
}
