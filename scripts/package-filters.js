function shouldSkipForeignLinuxBinary(platform, architecture, name) {
  if (platform !== "linux") return false;
  if (architecture === "x64" && name === "sky_linux_arm64") return true;
  if (architecture === "arm64" && name === "sky_linux_x64") return true;
  return false;
}

module.exports = { shouldSkipForeignLinuxBinary };
