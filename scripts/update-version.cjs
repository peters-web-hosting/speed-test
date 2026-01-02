const fs = require("fs");
const path = require("path");

const versionFile = path.join(__dirname, "../version.json");
const pkgFile = path.join(__dirname, "../package.json");

function getNewVersion(oldVersion) {
  const num = parseInt(oldVersion, 10);
  if (isNaN(num) || num < 1) {
    return "1";
  }
  return String(num + 1);
}

function updateVersion() {
  let pkg = { version: "1" };
  let versionData = {
    version: "1",
    buildDate: new Date().toISOString().slice(0, 10),
  };

  if (fs.existsSync(pkgFile)) {
    pkg = JSON.parse(fs.readFileSync(pkgFile, "utf8"));
  }
  if (fs.existsSync(versionFile)) {
    versionData = JSON.parse(fs.readFileSync(versionFile, "utf8"));
  }

  const newVersion = getNewVersion(pkg.version || versionData.version);
  pkg.version = newVersion;
  versionData.version = newVersion;
  versionData.buildDate = new Date().toISOString().slice(0, 10);

  fs.writeFileSync(pkgFile, JSON.stringify(pkg, null, 2));
  fs.writeFileSync(versionFile, JSON.stringify(versionData, null, 2));
  console.log(`Updated to version ${newVersion}`);
}

updateVersion();
