const fs = require("fs");
const path = require("path");

const versionFile = path.join(__dirname, "../version.json");
const pkgFile = path.join(__dirname, "../package.json");

function getNewVersion(oldVersion) {
  // Simple patch bump: 1.2.3 -> 1.2.4
  const parts = oldVersion.split(".").map(Number);
  parts[2] = (parts[2] || 0) + 1;
  return parts.join(".");
}

function updateVersion() {
  let pkg = { version: "1.0.0" };
  let versionData = { version: "1.0.0", buildDate: new Date().toISOString() };

  if (fs.existsSync(pkgFile)) {
    pkg = JSON.parse(fs.readFileSync(pkgFile, "utf8"));
  }
  if (fs.existsSync(versionFile)) {
    versionData = JSON.parse(fs.readFileSync(versionFile, "utf8"));
  }

  const newVersion = getNewVersion(pkg.version || versionData.version);
  pkg.version = newVersion;
  versionData.version = newVersion;
  versionData.buildDate = new Date().toISOString();

  fs.writeFileSync(pkgFile, JSON.stringify(pkg, null, 2));
  fs.writeFileSync(versionFile, JSON.stringify(versionData, null, 2));
  console.log(`Updated to version ${newVersion}`);
}

updateVersion();
