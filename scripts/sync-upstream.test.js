const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");

const { decodePercentNames } = require("./sync-upstream");

test("decodes percent-encoded scoped package directories", (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "codex-percent-name-test-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));

  const encoded = path.join(root, "node_modules", "%40worklouder");
  fs.mkdirSync(encoded, { recursive: true });
  fs.writeFileSync(path.join(encoded, "binding.node"), "native");

  decodePercentNames(root);

  const decoded = path.join(root, "node_modules", "@worklouder", "binding.node");
  assert.equal(fs.existsSync(decoded), true);
  assert.equal(fs.existsSync(encoded), false);
});

test("does not decode names into path separators", (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "codex-percent-name-test-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));

  const encoded = path.join(root, "unsafe%2Fname");
  fs.mkdirSync(encoded);
  decodePercentNames(root);
  assert.equal(fs.existsSync(encoded), true);
});
