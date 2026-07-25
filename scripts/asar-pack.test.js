const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");
const asar = require("@electron/asar");

const {
  clearExistingAsarUnpacked,
  getAsarPackArgs,
  packAsar,
} = require("./build-from-upstream");

function writeFixture(root, relativePath) {
  const target = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, relativePath);
}

function isUnpacked(archive, relativePath) {
  return Boolean(asar.statFile(archive, relativePath).unpacked);
}

test("repackages native modules outside the ASAR payload", (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "codex-asar-pack-test-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));

  const source = path.join(root, "source");
  const archive = path.join(root, "app.asar");
  const sqlite = path.join("node_modules", "better-sqlite3", "build", "addon.node");
  const nodePty = path.join("node_modules", "node-pty", "build", "Release", "pty.node");
  const worklouder = path.join("node_modules", "@worklouder", "native", "binding.node");

  writeFixture(source, "main.js");
  writeFixture(source, sqlite);
  writeFixture(source, nodePty);
  writeFixture(source, worklouder);

  fs.mkdirSync(`${archive}.unpacked`, { recursive: true });
  fs.writeFileSync(path.join(`${archive}.unpacked`, "stale.txt"), "stale");
  clearExistingAsarUnpacked(archive);
  packAsar(source, archive, getAsarPackArgs("win"));

  assert.equal(isUnpacked(archive, sqlite), true);
  assert.equal(isUnpacked(archive, nodePty), true);
  assert.equal(isUnpacked(archive, worklouder), true);
  assert.equal(isUnpacked(archive, "main.js"), false);
  assert.equal(fs.existsSync(path.join(`${archive}.unpacked`, "stale.txt")), false);
});
