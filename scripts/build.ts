import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

// Clean any previous stale build cache
const nextDir = path.join(process.cwd(), ".next");
if (fs.existsSync(nextDir)) {
  fs.rmSync(nextDir, { recursive: true, force: true });
}

// Run clean production Next.js build
execSync("npx next build", {
  stdio: "inherit",
  env: {
    ...process.env,
    NEXT_TELEMETRY_DISABLED: "1",
  },
});
