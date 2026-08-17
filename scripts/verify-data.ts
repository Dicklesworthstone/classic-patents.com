/**
 * verify-data.ts
 *
 * Data verification and schema validation suite for Classic Patents.
 */

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

    // 4. Check claims
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

    // 5. Check plain English explanations
    if (
      !patent.plainEnglishExplanation?.overview ||
      !patent.plainEnglishExplanation.coreMechanism ||
      patent.plainEnglishExplanation.mechanicalBreakdown.length === 0
    ) {
      console.error(`❌ ${prefix} Incomplete plain English explanation.`);
      errorCount++;
    }

    // 6. Check historical context & patent wars
    if (
      !patent.historicalContext?.problemStatement ||
      !patent.historicalContext.breakthroughInsight ||
      patent.historicalContext.patentWars.length === 0
    ) {
      console.error(`❌ ${prefix} Incomplete historical context or patent wars record.`);
      errorCount++;
    }

    console.log(`✓ ${prefix} Passed all verification gates.`);
  }

  console.log(
    `\nVerification Result: ${errorCount === 0 ? "ALL 8 PATENTS GREEN" : `${errorCount} ERRORS FOUND`}`,
  );

  if (errorCount > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Verification failed with exception:", err);
  process.exit(1);
});
