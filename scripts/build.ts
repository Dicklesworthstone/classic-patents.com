import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

// Clean stale .next cache directory if present
if (fs.existsSync(".next")) {
  fs.rmSync(".next", { recursive: true, force: true });
}

// Pre-create server directory with pages-manifest.json to prevent App Router race condition
fs.mkdirSync(path.join(".next", "server"), { recursive: true });
fs.writeFileSync(path.join(".next", "server", "pages-manifest.json"), "{}", "utf-8");

// Run clean production Next.js build
execSync("npx next build", {
  stdio: "inherit",
  env: {
    ...process.env,
    NEXT_TELEMETRY_DISABLED: "1",
  },
});
