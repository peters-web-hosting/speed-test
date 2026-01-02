// This script copies version.json to the public directory after version update
const fs = require("fs");
const path = require("path");

const src = path.join(__dirname, "../version.json");
const dest = path.join(__dirname, "../public/version.json");

fs.copyFileSync(src, dest);
console.log("Copied version.json to public/");
