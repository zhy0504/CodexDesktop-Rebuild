const test = require("node:test");
const assert = require("node:assert/strict");

const { shouldSkipForeignLinuxBinary } = require("./package-filters");

test("skips only the foreign Linux Sky binary", () => {
  assert.equal(shouldSkipForeignLinuxBinary("linux", "x64", "sky_linux_arm64"), true);
  assert.equal(shouldSkipForeignLinuxBinary("linux", "arm64", "sky_linux_x64"), true);
  assert.equal(shouldSkipForeignLinuxBinary("linux", "x64", "sky_linux_x64"), false);
  assert.equal(shouldSkipForeignLinuxBinary("linux", "arm64", "sky_linux_arm64"), false);
  assert.equal(shouldSkipForeignLinuxBinary("darwin", "x64", "sky_linux_arm64"), false);
});
