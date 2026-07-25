#!/usr/bin/env node
const { spawnSync } = require("child_process");

function getBuildScript(platform, architecture) {
  if (platform === "win32") return "build:win-x64";
  if (platform === "darwin") {
    if (architecture === "arm64") return "build:mac-arm64";
    if (architecture === "x64") return "build:mac-x64";
    return null;
  }
  if (platform === "linux") {
    if (architecture === "arm64") return "build:linux-arm64";
    if (architecture === "x64") return "build:linux-x64";
  }
  return null;
}

function main() {
  const targetScript = getBuildScript(process.platform, process.arch);
  if (!targetScript) {
    console.error(`[x] Unsupported platform: ${process.platform}-${process.arch}`);
    process.exit(1);
  }

  console.log(`[build] ${process.platform}-${process.arch} -> npm run ${targetScript}`);
  const npmBin = process.platform === "win32" ? "npm.cmd" : "npm";
  const result = spawnSync(npmBin, ["run", targetScript], {
    stdio: "inherit",
    shell: false,
  });

  if (result.error) {
    console.error(`[x] Failed to run npm: ${result.error.message}`);
    process.exit(1);
  }
  process.exit(result.status ?? 1);
}

if (require.main === module) main();

module.exports = { getBuildScript };
