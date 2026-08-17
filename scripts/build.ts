import { execSync } from "node:child_process";

// Run clean production Next.js build
execSync("npx next build", {
  stdio: "inherit",
  env: {
    ...process.env,
    NEXT_TELEMETRY_DISABLED: "1",
  },
});

