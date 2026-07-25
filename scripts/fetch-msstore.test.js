const test = require("node:test");
const assert = require("node:assert/strict");

const { findPackageByArchitecture, withRetry } = require("./fetch-msstore");

test("retries transient failures and returns the eventual result", async () => {
  let attempts = 0;
  const result = await withRetry(
    async () => {
      attempts++;
      if (attempts < 3) throw new Error("Request timeout");
      return "ok";
    },
    { maxAttempts: 3, retryDelayMs: 0 },
  );

  assert.equal(result, "ok");
  assert.equal(attempts, 3);
});

test("throws the final error when all retry attempts fail", async () => {
  let attempts = 0;
  await assert.rejects(
    withRetry(
      async () => {
        attempts++;
        throw new Error(`failure-${attempts}`);
      },
      { maxAttempts: 3, retryDelayMs: 0 },
    ),
    /failure-3/,
  );
  assert.equal(attempts, 3);
});

test("matches package architecture as a complete name segment", () => {
  const packages = [
    { name: "OpenAI.Codex_1.0.0.0_arm64__publisher.msix" },
    { name: "OpenAI.Codex_1.0.0.0_x64__publisher.msix" },
  ];
  assert.equal(findPackageByArchitecture(packages, "x64"), packages[1]);
  assert.equal(findPackageByArchitecture(packages, "ia32"), undefined);
});
