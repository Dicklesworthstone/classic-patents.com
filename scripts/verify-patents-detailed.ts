import { allPatents } from "../src/data/patents";

console.log(
  `Auditing detailed depth and invariants across all ${allPatents.length} registered patents...\n`,
);

let errors = 0;
let warnings = 0;

for (const patent of allPatents) {
  const pId = patent.id;
  const claims = patent.claims;
  const totalClaims = patent.stats?.totalClaims ?? claims.length;
  const independentClaims =
    patent.stats?.independentClaims ?? claims.filter((c) => c.isIndependent).length;
  const actualIndependent = claims.filter((c) => c.isIndependent).length;

  if (patent.stats && claims.length !== totalClaims) {
    console.error(
      `❌ [${pId}] stats.totalClaims (${totalClaims}) does not match claims.length (${claims.length})`,
    );
    errors++;
  }

  if (independentClaims !== undefined && actualIndependent !== independentClaims) {
    console.error(
      `❌ [${pId}] stats.independentClaims (${independentClaims}) does not match actual independent claims (${actualIndependent})`,
    );
    errors++;
  }

  const claimNumbers = new Set(claims.map((c) => c.number));
  for (const c of claims) {
    if (c.dependsOn) {
      for (const dep of c.dependsOn) {
        if (!claimNumbers.has(dep)) {
          console.error(`❌ [${pId}] Claim ${c.number} dependsOn non-existent claim ${dep}`);
          errors++;
        }
      }
    }
    if (!c.originalText || c.originalText.length < 15) {
      console.error(`❌ [${pId}] Claim ${c.number} originalText too short`);
      errors++;
    }
    if (!c.plainEnglish || c.plainEnglish.length < 15) {
      console.error(`❌ [${pId}] Claim ${c.number} plainEnglish too short`);
      errors++;
    }
  }

  for (const d of patent.drawings) {
    for (const callout of d.callouts) {
      if (callout.x < 0 || callout.x > 100 || callout.y < 0 || callout.y > 100) {
        console.error(
          `❌ [${pId}] Drawing callout "${callout.label}" out of bounds: (${callout.x}, ${callout.y})`,
        );
        errors++;
      }
    }
  }

  if (patent.plainEnglishExplanation.mechanicalBreakdown.length < 3) {
    console.warn(
      `⚠️ [${pId}] mechanicalBreakdown has fewer than 3 cards (${patent.plainEnglishExplanation.mechanicalBreakdown.length})`,
    );
    warnings++;
  }

  if (patent.plainEnglishExplanation.scientificPrinciples.length < 2) {
    console.warn(
      `⚠️ [${pId}] scientificPrinciples has fewer than 2 principles (${patent.plainEnglishExplanation.scientificPrinciples.length})`,
    );
    warnings++;
  }
}

console.log(
  `\nAudit Complete: ${errors} errors, ${warnings} warnings across ${allPatents.length} patents.`,
);
if (errors > 0) {
  process.exit(1);
} else {
  console.log("ALL DATA INVARIANTS PERFECTLY SATISFIED!");
}
