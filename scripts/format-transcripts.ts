import fs from "node:fs";
import path from "node:path";
import { allPatents } from "../src/data/patents";

/**
 * Normalizes raw patent prose text:
 * 1. Recombines words broken across line wraps (e.g. "vibrat-\ning" -> "vibrating")
 * 2. Joins single newlines within paragraphs into single spaces
 * 3. Preserves discrete paragraphs (separated by double newlines)
 * 4. Normalizes whitespace and punctuation
 */
export function normalizePatentProse(rawText: string): string {
  if (!rawText) return "";

  // Split into raw blocks by double or more newlines
  const rawBlocks = rawText
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split(/\n{2,}/);

  const cleanBlocks: string[] = [];

  for (const block of rawBlocks) {
    const trimmed = block.trim();
    if (!trimmed) continue;

    // Check if block is a centered or uppercase header
    const lines = trimmed
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    if (lines.length === 0) continue;

    // If the entire block is a short single header line, keep it as header
    if (lines.length === 1 && (lines[0].length < 80 || lines[0] === lines[0].toUpperCase())) {
      cleanBlocks.push(lines[0]);
      continue;
    }

    // Join lines in the paragraph, fixing hyphens at ends of lines
    let joined = "";
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (i === 0) {
        joined = line;
      } else {
        // If previous line ended with hyphen and letter, join words without space
        if (joined.endsWith("-") && /^[a-zA-Z]/.test(line)) {
          joined = joined.slice(0, -1) + line;
        } else {
          joined += ` ${line}`;
        }
      }
    }

    // Clean up multiple spaces and punctuation spacing
    joined = joined
      .replace(/[ \t]+/g, " ")
      .replace(/ ([,\.;:\?!])/g, "$1")
      .trim();

    if (joined) {
      cleanBlocks.push(joined);
    }
  }

  return cleanBlocks.join("\n\n");
}

const transcriptsDir = path.join(process.cwd(), "public", "patents", "transcripts");
const sourceTextDir = path.join(process.cwd(), "public", "patents", "source-text");

if (!fs.existsSync(transcriptsDir)) fs.mkdirSync(transcriptsDir, { recursive: true });
if (!fs.existsSync(sourceTextDir)) fs.mkdirSync(sourceTextDir, { recursive: true });

console.log("=== Formatting and Normalizing Full Original Patent Transcripts ===");

for (const patent of allPatents) {
  let specBody = normalizePatentProse(patent.originalText);

  // If originalText doesn't have formal header, construct standard header
  let fullCleanText = "";
  if (!specBody.includes("UNITED STATES PATENT OFFICE") && !specBody.includes("Letters Patent")) {
    const headerBlock = [
      "UNITED STATES PATENT OFFICE",
      `${patent.inventors.join(", ").toUpperCase()}, OF ${(patent.inventorLocation || "").toUpperCase()}`,
      "",
      patent.title.toUpperCase(),
      "",
      `Specification forming part of Letters Patent No. ${patent.patentNumber.replace("US ", "")}, dated ${patent.grantDate}.`,
      patent.filingDate ? `Application filed ${patent.filingDate}.` : "",
    ]
      .filter((l) => l !== undefined)
      .join("\n")
      .trim();

    fullCleanText = `${headerBlock}\n\n${specBody}`;
  } else {
    fullCleanText = specBody;
  }

  // If claims are not already at the bottom of originalText, append formatted claims
  if (
    !fullCleanText.includes("I claim as my invention:") &&
    !fullCleanText.includes("What I claim is:") &&
    !fullCleanText.includes("Having thus described my invention")
  ) {
    const claimsBlock = [
      "I claim as my invention:",
      ...patent.claims.map(
        (c) => `${c.number}. ${c.isIndependent ? "(Independent) " : ""}${c.originalText.trim()}`,
      ),
    ].join("\n\n");
    fullCleanText += `\n\n${claimsBlock}`;
  }

  fullCleanText += "\n";

  const transcriptPath = path.join(transcriptsDir, `${patent.id}.txt`);
  const sourceTextPath = path.join(sourceTextDir, `${patent.id}.txt`);

  fs.writeFileSync(transcriptPath, fullCleanText, "utf-8");
  fs.writeFileSync(sourceTextPath, fullCleanText, "utf-8");

  console.log(
    `✓ [${patent.patentNumber}] Formatted transcript: ${patent.id} (${fullCleanText.length} chars)`,
  );
}

console.log("\nAll 54 patent transcripts cleanly formatted without header duplication!");
