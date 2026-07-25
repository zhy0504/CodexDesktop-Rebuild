const test = require("node:test");
const assert = require("node:assert/strict");

const { getBuildScript } = require("./build-current");

test("maps supported host platforms to their native build scripts", () => {
  assert.equal(getBuildScript("win32", "x64"), "build:win-x64");
  assert.equal(getBuildScript("win32", "arm64"), "build:win-x64");
  assert.equal(getBuildScript("darwin", "arm64"), "build:mac-arm64");
  assert.equal(getBuildScript("darwin", "x64"), "build:mac-x64");
  assert.equal(getBuildScript("linux", "arm64"), "build:linux-arm64");
  assert.equal(getBuildScript("linux", "x64"), "build:linux-x64");
});

test("rejects unsupported platform and architecture combinations", () => {
  assert.equal(getBuildScript("linux", "ia32"), null);
  assert.equal(getBuildScript("freebsd", "x64"), null);
});
