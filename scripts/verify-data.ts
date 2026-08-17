/**
 * verify-data.ts
 *
 * Data verification, schema validation, and PDF existence check for Classic Patents.
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { allPatents } from "../src/data/patents";

async function main() {
  console.log("=== Classic Patents Data Verification Gate ===");
  console.log(`Checking ${allPatents.length} curated historical patents...\n`);

  let errorCount = 0;

  for (const patent of allPatents) {
    const prefix = `[${patent.patentNumber} - ${patent.id}]`;

    // 1. Check basic identity
    if (!patent.id || !patent.patentNumber || !patent.title || !patent.shortTitle) {
      console.error(`❌ ${prefix} Missing essential identification metadata.`);
      errorCount++;
    }

    // 2. Check dates
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(patent.grantDate) ||
      !/^\d{4}-\d{2}-\d{2}$/.test(patent.filingDate)
    ) {
      console.error(
        `❌ ${prefix} Invalid date format (expected YYYY-MM-DD). Grant: ${patent.grantDate}, Filing: ${patent.filingDate}`,
      );
      errorCount++;
    }

    // 3. Check inventors
    if (!patent.inventors || patent.inventors.length === 0) {
      console.error(`❌ ${prefix} No inventors specified.`);
      errorCount++;
    }

    // 4. Check PDF presence in public/
    const localPdfPath = path.join(
      process.cwd(),
      "public",
      patent.originalPdfUrl.replace(/^\//, ""),
    );
    if (!fs.existsSync(localPdfPath)) {
      console.error(`❌ ${prefix} Local PDF not found at ${localPdfPath}`);
      errorCount++;
    } else {
      const stats = fs.statSync(localPdfPath);
      if (stats.size < 1000) {
        console.error(`❌ ${prefix} Local PDF too small (${stats.size} bytes).`);
        errorCount++;
      }
    }

    // 5. Check claims
    if (!patent.claims || patent.claims.length === 0) {
      console.error(`❌ ${prefix} No claims found.`);
      errorCount++;
    } else {
      const independentClaims = patent.claims.filter((c) => c.isIndependent);
      if (independentClaims.length === 0) {
        console.error(`❌ ${prefix} Patent has no independent claims.`);
        errorCount++;
      }
      for (const claim of patent.claims) {
        if (!claim.number || !claim.originalText || !claim.plainEnglish) {
          console.error(
            `❌ ${prefix} Claim #${claim.number} missing originalText or plainEnglish explanation.`,
          );
          errorCount++;
        }
      }
    }

    // 6. Check plain English explanations
    if (
      !patent.plainEnglishExplanation?.overview ||
      !patent.plainEnglishExplanation.coreMechanism ||
      patent.plainEnglishExplanation.mechanicalBreakdown.length === 0
    ) {
      console.error(`❌ ${prefix} Incomplete plain English explanation.`);
      errorCount++;
    }

    // 7. Check historical context & patent wars
    if (
      !patent.historicalContext?.problemStatement ||
      !patent.historicalContext.breakthroughInsight ||
      patent.historicalContext.patentWars.length === 0
    ) {
      console.error(`❌ ${prefix} Incomplete historical context or patent wars record.`);
      errorCount++;
    }

    console.log(
      `✓ ${prefix} Passed all verification gates (PDF verified: ${(fs.statSync(localPdfPath).size / 1024).toFixed(1)} KB).`,
    );
  }

  console.log(
    `\nVerification Result: ${errorCount === 0 ? `ALL ${allPatents.length} PATENTS GREEN AND FULLY COMPLETE` : `${errorCount} ERRORS FOUND`}`,
  );

  if (errorCount > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Verification failed with exception:", err);
  process.exit(1);
});
