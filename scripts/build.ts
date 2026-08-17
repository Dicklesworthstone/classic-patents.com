import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const nextExportDir = path.join(process.cwd(), ".next", "export");
const nextExport500 = path.join(nextExportDir, "500.html");
const nextServerPages = path.join(process.cwd(), ".next", "server", "pages");

// Keep .next/server/pages directory and export/500.html available for App Router export rename
const interval = setInterval(() => {
  try {
    if (!fs.existsSync(nextServerPages)) {
      fs.mkdirSync(nextServerPages, { recursive: true });
    }
    if (!fs.existsSync(nextExportDir)) {
      fs.mkdirSync(nextExportDir, { recursive: true });
    }
    if (!fs.existsSync(nextExport500)) {
      fs.writeFileSync(nextExport500, "<!DOCTYPE html><html><body>500</body></html>", "utf-8");
    }
  } catch {}
}, 100);

try {
  // Run clean production Next.js build
  execSync("npx next build", {
    stdio: "inherit",
    env: {
      ...process.env,
      NEXT_TELEMETRY_DISABLED: "1",
    },
  });
} finally {
  clearInterval(interval);
}
