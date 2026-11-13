import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { chmodSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";

const projectRoot = process.cwd();

test("browser QA recognizes Playwright's platform-specific Chromium path", () => {
  const temporaryRoot = mkdtempSync(join(tmpdir(), "gibs-chromium-path-"));
  const browserCache = join(temporaryRoot, "browsers");
  const dist = join(temporaryRoot, "dist");

  try {
    const executable = execFileSync(
      process.execPath,
      ["--input-type=module", "-e", "import { chromium } from 'playwright-core'; console.log(chromium.executablePath());"],
      {
        cwd: projectRoot,
        env: { ...process.env, PLAYWRIGHT_BROWSERS_PATH: browserCache },
        encoding: "utf8",
      }
    ).trim();

    mkdirSync(dirname(executable), { recursive: true });
    writeFileSync(executable, "#!/bin/sh\nexit 1\n");
    chmodSync(executable, 0o755);
    mkdirSync(dist);
    writeFileSync(join(dist, "index.html"), "<!doctype html><title>QA test</title>");

    const result = spawnSync(process.execPath, [join(projectRoot, "scripts/qa/regression.mjs")], {
      cwd: projectRoot,
      env: {
        ...process.env,
        CHROMIUM_PATH: "",
        PLAYWRIGHT_BROWSERS_PATH: browserCache,
        DIST_DIR: dist,
      },
      encoding: "utf8",
      timeout: 10_000,
    });
    const output = `${result.stdout}\n${result.stderr}`;

    assert.doesNotMatch(output, /No Chromium found/);
    assert.match(output, /browserType\.launch|Failed to launch|Target page|browser.*closed/i);
  } finally {
    rmSync(temporaryRoot, { recursive: true, force: true });
  }
});
