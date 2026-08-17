import { execSync } from "node:child_process";
import fs from "node:fs";

// Clean stale .next cache directory if present
if (fs.existsSync(".next")) {
  fs.rmSync(".next", { recursive: true, force: true });
}

// Run clean production Next.js build
execSync("npx next build", {
  stdio: "inherit",
  env: {
    ...process.env,
    NEXT_TELEMETRY_DISABLED: "1",
  },
});

