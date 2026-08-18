import { allPatents } from "../src/data/patents";
import { PATENT_PHYSICS_REGISTRY } from "../src/physics/telemetryData";

console.log("=== Wright Flyer Quality Benchmark Audit Across All 54 Patents ===\n");

let warnings = 0;
let passes = 0;

for (const p of allPatents) {
  const issues: string[] = [];

  // Check overview and core mechanism depth
  if (!p.plainEnglishExplanation.overview || p.plainEnglishExplanation.overview.length < 100) {
    issues.push(`overview too brief (${p.plainEnglishExplanation.overview?.length ?? 0} chars)`);
  }
  if (
    !p.plainEnglishExplanation.coreMechanism ||
    p.plainEnglishExplanation.coreMechanism.length < 100
  ) {
    issues.push(
      `coreMechanism too brief (${p.plainEnglishExplanation.coreMechanism?.length ?? 0} chars)`,
    );
  }

  // Check breakdown cards
  if (p.plainEnglishExplanation.mechanicalBreakdown.length < 3) {
    issues.push(
      `fewer than 3 mechanical breakdown cards (${p.plainEnglishExplanation.mechanicalBreakdown.length})`,
    );
  }
  for (const b of p.plainEnglishExplanation.mechanicalBreakdown) {
    if (!b.technicalDetails || b.technicalDetails.length < 40) {
      issues.push(`mechanical breakdown "${b.title}" technical details too short`);
    }
  }

  // Check scientific principles
  if (p.plainEnglishExplanation.scientificPrinciples.length < 2) {
    issues.push(
      `fewer than 2 scientific principles (${p.plainEnglishExplanation.scientificPrinciples.length})`,
    );
  }
  for (const sp of p.plainEnglishExplanation.scientificPrinciples) {
    if (!sp.formula || sp.formula.length < 2) {
      issues.push(`scientific principle "${sp.principle}" missing formula`);
    }
  }

  // Check historical context
  if (!p.historicalContext.problemStatement || p.historicalContext.problemStatement.length < 80) {
    issues.push("problemStatement too brief");
  }
  const priorArtTotalLen = p.historicalContext.priorArtLimitations?.join(" ").length ?? 0;
  if (priorArtTotalLen < 80) {
    issues.push(`priorArtLimitations too brief (${priorArtTotalLen} chars)`);
  }
  if (
    !p.historicalContext.breakthroughInsight ||
    p.historicalContext.breakthroughInsight.length < 80
  ) {
    issues.push("breakthroughInsight too brief");
  }
  if (
    !p.historicalContext.civilizationalImpact ||
    p.historicalContext.civilizationalImpact.length < 80
  ) {
    issues.push("civilizationalImpact too brief");
  }

  // Check claims
  const noFormalClaims = p.archivalEdition?.claimStatus?.kind === "no-formal-claims-in-facsimile";
  if ((!p.claims || p.claims.length === 0) && !noFormalClaims) {
    issues.push("no claims registered");
  }
  for (const c of p.claims) {
    if (!c.plainEnglish || c.plainEnglish.length < 25) {
      issues.push(`claim ${c.number} plain English decoder too brief`);
    }
    if (!c.keyInnovations || c.keyInnovations.length === 0) {
      issues.push(`claim ${c.number} missing key innovations`);
    }
  }

  // Check drawings and callouts
  const noDrawingsInGrant =
    p.archivalEdition?.drawingStatus?.kind === "no-drawings-in-facsimile" ||
    ["us-3633-goodyear-rubber", "us-78317-nobel-dynamite", "us-105338-hyatt-celluloid"].includes(
      p.id,
    );
  if (!noDrawingsInGrant && (!p.drawings || p.drawings.length === 0)) {
    issues.push("no patent drawings registered");
  } else if (p.drawings && p.drawings.length > 0) {
    for (const d of p.drawings) {
      if (!d.callouts || d.callouts.length === 0) {
        issues.push(`drawing ${d.figureNumber} has 0 callouts`);
      }
    }
  }

  // Check physics registry
  const phys = PATENT_PHYSICS_REGISTRY[p.id];
  if (!phys) {
    issues.push("missing physics registry");
  } else {
    if (!phys.controls || phys.controls.length === 0) {
      issues.push("physics registry has no controls");
    }
    if (!phys.governingEquation || phys.governingEquation.length < 5) {
      issues.push("physics registry missing governing equation");
    }
  }

  if (issues.length > 0) {
    console.log(`⚠️  [${p.patentNumber} · ${p.shortTitle}]`);
    for (const issue of issues) {
      console.log(`    - ${issue}`);
    }
    warnings++;
  } else {
    console.log(`✓ [${p.patentNumber} · ${p.shortTitle}] — Perfect Wright-Flyer-grade depth.`);
    passes++;
  }
}

console.log(
  `\nAudit Summary: ${passes}/${allPatents.length} Patents meet the absolute highest Wright Flyer standard of excellence.`,
);
if (warnings > 0) {
  console.log(`${warnings} patents flagged with minor enhancement opportunities.`);
} else {
  console.log("ALL 54 PATENTS MEET THE HIGHEST UNIFORM STANDARD OF MUSEUM EXCELLENCE!");
}
