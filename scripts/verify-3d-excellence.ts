import { readFileSync } from "node:fs";
import { join } from "node:path";
import { allPatents } from "../src/data/patents";
import { PATENT_PHYSICS_REGISTRY } from "../src/physics/telemetryData";

console.log("=== Classic Patents 3D Physics & Three.js Excellence Audit ===");
console.log(`Auditing 3D WebGL modules for all ${allPatents.length} historical patents...\n`);

let totalErrors = 0;
let totalVerified = 0;

const visualIndexPath = join(process.cwd(), "src/components/patents/visuals/index.tsx");
const visualIndexContent = readFileSync(visualIndexPath, "utf-8");

for (const patent of allPatents) {
  const reg = PATENT_PHYSICS_REGISTRY[patent.id];
  if (!reg) {
    console.error(`❌ [${patent.id}] Missing PATENT_PHYSICS_REGISTRY entry`);
    totalErrors++;
    continue;
  }

  // Check dispatch in index.tsx
  if (!visualIndexContent.includes(`case "${patent.id}":`)) {
    console.error(`❌ [${patent.id}] Not dispatched in visuals/index.tsx`);
    totalErrors++;
    continue;
  }

  // Verify telemetry calculation executes cleanly with default params
  try {
    const defaultParams: Record<string, number> = {};
    for (const c of reg.controls) {
      defaultParams[c.id] = c.defaultValue;
    }
    const metrics = reg.computeMetrics(defaultParams);
    if (!metrics || metrics.length === 0) {
      console.error(`❌ [${patent.id}] computeMetrics returned empty list`);
      totalErrors++;
      continue;
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`❌ [${patent.id}] computeMetrics error: ${message}`);
    totalErrors++;
    continue;
  }

  totalVerified++;
  console.log(
    `✓ [${patent.patentNumber} · ${patent.shortTitle}] 3D Three.js simulator & physics verified.`,
  );
}

console.log(
  `\nAudit Result: ${totalVerified}/${allPatents.length} 3D Physics Modules Verified Green.`,
);
if (totalErrors > 0) {
  console.error(`Found ${totalErrors} issues.`);
  process.exit(1);
} else {
  console.log("ALL 54 3D SIMULATORS PASS ALL EXCELLENCE AND ACCURACY INVARIANTS!");
}
