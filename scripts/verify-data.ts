/**
 * verify-data.ts
 *
 * Data verification, schema validation, and PDF existence check for Classic Patents.
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { allPatents, searchPatents } from "../src/data/patents";
import { patentSchema } from "../src/data/patents/schema";

function isValidIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

async function main() {
  console.log("=== Classic Patents Data Verification Gate ===");
  console.log(`Checking ${allPatents.length} curated historical patents...\n`);

  let errorCount = 0;
  let completeSourceTextCount = 0;
  const sourceTextGaps: string[] = [];

  for (const patent of allPatents) {
    const prefix = `[${patent.patentNumber} - ${patent.id}]`;
    let patentErrorCount = 0;
    const fail = (message: string) => {
      console.error(`❌ ${prefix} ${message}`);
      errorCount++;
      patentErrorCount++;
    };

    const schemaResult = patentSchema.safeParse(patent);
    if (!schemaResult.success) {
      const issue = schemaResult.error.issues[0];
      fail(`Zod ${issue?.path.join(".") || "(root)"}: ${issue?.message ?? "invalid record"}`);
    }

    // 1. Check basic identity
    if (!patent.id || !patent.patentNumber || !patent.title || !patent.shortTitle) {
      fail("Missing essential identification metadata.");
    }

    // 2. Check dates
    if (!isValidIsoDate(patent.grantDate) || !isValidIsoDate(patent.filingDate)) {
      fail(
        `Invalid date (expected a real YYYY-MM-DD). Grant: ${patent.grantDate}, Filing: ${patent.filingDate}`,
      );
    } else if (patent.filingDate > patent.grantDate) {
      fail(`Filing date ${patent.filingDate} is after grant date ${patent.grantDate}.`);
    }

    // 3. Check inventors
    if (!patent.inventors || patent.inventors.length === 0) {
      fail("No inventors specified.");
    }

    if (path.posix.basename(patent.originalPdfUrl) !== `${patent.id}.pdf`) {
      fail(`originalPdfUrl must name ${patent.id}.pdf; received ${patent.originalPdfUrl}.`);
    }

    // 4. Check PDF presence in public/
    const localPdfPath = path.join(
      process.cwd(),
      "public",
      patent.originalPdfUrl.replace(/^\//, ""),
    );
    let pdfSizeBytes: number | undefined;
    if (!fs.existsSync(localPdfPath)) {
      fail(`Local PDF not found at ${localPdfPath}`);
    } else {
      const stats = fs.statSync(localPdfPath);
      pdfSizeBytes = stats.size;
      if (stats.size < 1000) {
        fail(`Local PDF too small (${stats.size} bytes).`);
      }
    }

    // 5. Check claims
    if (!patent.claims || patent.claims.length === 0) {
      fail("No claims found.");
    } else {
      const independentClaims = patent.claims.filter((c) => c.isIndependent);
      if (independentClaims.length === 0) {
        fail("Patent has no independent claims.");
      }
      const claimNumbers = new Set(patent.claims.map((claim) => claim.number));
      if (claimNumbers.size !== patent.claims.length) fail("Duplicate claim numbers found.");
      for (const claim of patent.claims) {
        if (!claim.number || !claim.originalText || !claim.plainEnglish) {
          fail(`Claim #${claim.number} missing originalText or plainEnglish explanation.`);
        }
        for (const dependency of claim.dependsOn ?? []) {
          if (!claimNumbers.has(dependency)) {
            fail(`Claim #${claim.number} depends on missing claim #${dependency}.`);
          }
        }
      }
    }

    // 6. Check stats consistency with claims
    const indClaims = patent.claims.filter((c) => c.isIndependent);
    if (patent.stats) {
      if (patent.stats.totalClaims !== patent.claims.length) {
        fail(
          `stats.totalClaims (${patent.stats.totalClaims}) does not match claims.length (${patent.claims.length}).`,
        );
      }
      if (patent.stats.independentClaims !== indClaims.length) {
        fail(
          `stats.independentClaims (${patent.stats.independentClaims}) does not match independent claims count (${indClaims.length}).`,
        );
      }
    }

    // 7. Check complete source-text asset integrity. A page is never allowed
    // to imply that its editorial excerpt is a full specification.
    if (patent.originalTextAsset) {
      completeSourceTextCount++;
      const assetPath = path.join(
        process.cwd(),
        "public",
        patent.originalTextAsset.url.replace(/^\//, ""),
      );
      if (!fs.existsSync(assetPath)) {
        fail(`originalTextAsset file not found at ${assetPath}`);
      } else {
        const assetStat = fs.statSync(assetPath);
        if (assetStat.size === 0) {
          fail(`originalTextAsset file at ${assetPath} is empty.`);
        }
      }
      if (patent.originalTextAsset.pageCount <= 0) {
        fail(`originalTextAsset.pageCount must be > 0.`);
      }
      if (!patent.originalTextAsset.kind) {
        fail("originalTextAsset.kind is required before an asset may be shown as complete.");
      }
      if (patent.originalTextAsset.kind === "source-pdf-text-layer" && fs.existsSync(assetPath)) {
        const sourceText = fs.readFileSync(assetPath, "utf8");
        const pageMarkers = sourceText.match(/^--- SOURCE PDF PAGE \d+ OF \d+ ---$/gm) ?? [];
        if (pageMarkers.length !== patent.originalTextAsset.pageCount) {
          fail(
            `source-PDF text layer has ${pageMarkers.length} page marker(s), expected ${patent.originalTextAsset.pageCount}.`,
          );
        }
      }
    } else {
      sourceTextGaps.push(patent.id);
      console.warn(
        `⚠️  ${prefix} Complete source text is withheld: no asset has passed the completeness gate.`,
      );
    }

    // 8. Check drawing callout coordinate bounds
    for (const drawing of patent.drawings ?? []) {
      for (const callout of drawing.callouts ?? []) {
        if (callout.x < 0 || callout.x > 100 || callout.y < 0 || callout.y > 100) {
          fail(
            `Drawing ${drawing.figureNumber} callout ${callout.id} coordinates (${callout.x}, ${callout.y}) out of [0, 100] bounds.`,
          );
        }
      }
    }

    // 9. Check plain English explanations
    if (
      !patent.plainEnglishExplanation?.overview ||
      !patent.plainEnglishExplanation.coreMechanism ||
      patent.plainEnglishExplanation.mechanicalBreakdown.length === 0
    ) {
      fail("Incomplete plain English explanation.");
    }

    // 10. Check historical context & patent wars
    if (
      !patent.historicalContext?.problemStatement ||
      !patent.historicalContext.breakthroughInsight ||
      patent.historicalContext.patentWars.length === 0
    ) {
      fail("Incomplete historical context or patent wars record.");
    }

    if (patentErrorCount === 0 && pdfSizeBytes !== undefined) {
      console.log(
        `✓ ${prefix} Passed all verification gates (PDF verified: ${(pdfSizeBytes / 1024).toFixed(1)} KB).`,
      );
    } else {
      console.error(`✗ ${prefix} Failed ${patentErrorCount} verification gate(s).`);
    }
  }

  // 11. Check chronological ordering of allPatents
  for (let i = 1; i < allPatents.length; i++) {
    if (allPatents[i].grantDate < allPatents[i - 1].grantDate) {
      console.error(
        `❌ Chronological ordering error: ${allPatents[i].id} (${allPatents[i].grantDate}) precedes ${allPatents[i - 1].id} (${allPatents[i - 1].grantDate})`,
      );
      errorCount++;
    }
  }

  // 12. Test search queries
  const testQueries = ["Tesla", "Wright", "821,393", "Transistor", "Kevlar", "Noyce", "Wozniak"];
  for (const q of testQueries) {
    const results = searchPatents(q);
    if (results.length === 0) {
      console.error(`❌ Search query "${q}" returned 0 results.`);
      errorCount++;
    }
  }

  console.log(`\nComplete source-text coverage: ${completeSourceTextCount}/${allPatents.length}.`);
  if (sourceTextGaps.length > 0) {
    console.warn(`Withheld pending source correction or OCR: ${sourceTextGaps.join(", ")}.`);
  }
  console.log(
    `Verification Result: ${
      errorCount === 0
        ? `ALL SOFTWARE AND PUBLISHED-ASSET CHECKS PASSED; ${completeSourceTextCount}/${allPatents.length} COMPLETE SOURCE-TEXT ASSETS PUBLISHED`
        : `${errorCount} ERRORS FOUND`
    }`,
  );

  if (errorCount > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Verification failed with exception:", err);
  process.exit(1);
});
