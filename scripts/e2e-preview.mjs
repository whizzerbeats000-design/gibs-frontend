import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { preview } from "vite";

const temporaryRoot = mkdtempSync(join(tmpdir(), "gibs-e2e-"));
process.env.GIBS_DIST_DIR = join(temporaryRoot, "dist");
const environment = { ...process.env };
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";

const build = spawnSync(npmCommand, ["run", "build"], {
  cwd: process.cwd(),
  env: environment,
  stdio: "inherit",
  shell: process.platform === "win32",
});

if (build.error || build.status !== 0) {
  if (build.error) console.error("E2E production build failed:", build.error);
  rmSync(temporaryRoot, { recursive: true, force: true });
  process.exit(build.status ?? 1);
}

let server;
let stopping = false;

async function stop(exitCode = 0) {
  if (stopping) return;
  stopping = true;

  if (server?.httpServer.listening) {
    await new Promise((resolve) => server.httpServer.close(resolve));
  }
  rmSync(temporaryRoot, { recursive: true, force: true });
  process.exit(exitCode);
}

process.once("SIGINT", () => void stop(0));
process.once("SIGTERM", () => void stop(0));

try {
  server = await preview({
    preview: {
      host: "127.0.0.1",
      port: 4173,
      strictPort: true,
    },
  });
} catch (error) {
  console.error("E2E preview failed:", error);
  await stop(1);
}
