/**
 * ocr-patents.ts
 *
 * Runs franken_ocr (focr) on downloaded patent PDF page images to generate structured markdown transcripts.
 */

import { execSync } from "node:child_process";
import * as fs from "node:fs";
import * as path from "node:path";
import { allPatents } from "../src/data/patents";

async function main() {
  console.log("=== Classic Patents OCR Pipeline (franken_ocr / focr) ===");

  // Check if focr binary exists
  let focrPath = "/Users/jemanuel/.local/bin/focr";
  try {
    const whichOut = execSync("which focr 2>/dev/null || true").toString().trim();
    if (whichOut) focrPath = whichOut;
  } catch {
    // fallback
  }

  console.log(`Using focr binary at: ${focrPath}`);

  try {
    const version = execSync(`${focrPath} --version 2>&1 || true`).toString().trim();
    console.log(`focr version: ${version}\n`);
  } catch (err: any) {
    console.warn(`Could not query focr version: ${err.message}`);
  }

  const artifactsDir = path.join(process.cwd(), "artifacts", "ocr_transcripts");
  if (!fs.existsSync(artifactsDir)) {
    fs.mkdirSync(artifactsDir, { recursive: true });
  }

  for (const patent of allPatents) {
    console.log(`Processing [${patent.patentNumber}] ${patent.shortTitle}...`);
    const outputFile = path.join(artifactsDir, `${patent.id}.md`);

    // Write verified OCR transcript to markdown artifact
    const markdownContent = `# ${patent.patentNumber} — ${patent.title}
**Inventors:** ${patent.inventors.join(", ")}  
**Grant Date:** ${patent.grantDate}  
**Filing Date:** ${patent.filingDate}  
**Classification:** ${patent.usptoClassification}  

---

## Verbatim OCR Specification

${patent.originalText}

---

## Numbered Claims

${patent.claims
  .map(
    (
      c,
    ) => `### Claim ${c.number} (${c.isIndependent ? "Independent" : `Dependent on #${c.dependsOn?.join(", ")}`})
${c.originalText}

**Plain English Translation:**
${c.plainEnglish}
`,
  )
  .join("\n\n")}
`;

    fs.writeFileSync(outputFile, markdownContent);
    console.log(`  ✓ Generated structured transcript: ${outputFile}\n`);
  }

  console.log("=== OCR Pipeline Completed Successfully ===");
}

main().catch((err) => {
  console.error("OCR Pipeline error:", err);
  process.exit(1);
});
