import { allPatents } from "../src/data/patents";

console.log("=== COMPREHENSIVE PATENT DEPTH & PEDAGOGY AUDIT ===\n");

const scored = allPatents.map((p) => {
  const breakdownCount = p.plainEnglishExplanation.mechanicalBreakdown.length;
  const principlesCount = p.plainEnglishExplanation.scientificPrinciples.length;
  const claimsCount = p.claims.length;
  const drawingsCount = p.drawings.length;
  const hasFormulas = p.plainEnglishExplanation.scientificPrinciples.every((s) => !!s.formula);
  const overviewLen = p.plainEnglishExplanation.overview.length;
  const coreMechLen = p.plainEnglishExplanation.coreMechanism.length;
  const _hasPatentWars = p.historicalContext.patentWars.length > 0;

  // Calculate a depth score
  let score = 0;
  score += Math.min(25, breakdownCount * 5);
  score += Math.min(25, principlesCount * 8);
  score += Math.min(20, Math.round(overviewLen / 40));
  score += Math.min(20, Math.round(coreMechLen / 40));
  score += hasFormulas ? 10 : 0;

  return {
    id: p.id,
    patentNumber: p.patentNumber,
    shortTitle: p.shortTitle,
    breakdownCount,
    principlesCount,
    claimsCount,
    drawingsCount,
    hasFormulas,
    score,
  };
});

scored.sort((a, b) => a.score - b.score);

console.log("Patents ranked by editorial & physical explanation depth:\n");
for (const s of scored) {
  console.log(
    `[Score: ${s.score.toString().padStart(3, " ")}] ${s.patentNumber.padEnd(12, " ")} ${s.id.padEnd(38, " ")} | Breakdowns: ${s.breakdownCount}, Principles: ${s.principlesCount}, Claims: ${s.claimsCount}`,
  );
}
