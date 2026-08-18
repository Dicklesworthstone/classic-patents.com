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
      .replace(/ ([,.;:?!])/g, "$1")
      .trim();

    if (joined) {
      cleanBlocks.push(joined);
    }
  }

  return cleanBlocks.join("\n\n");
}

const transcriptsDir = path.join(process.cwd(), "public", "patents", "transcripts");
const previewDir = path.join(process.cwd(), "artifacts", "transcript_format_previews");

console.log("=== Formatting Noncanonical Transcript Previews ===");
console.log("Published transcripts and source-text assets are never modified by this script.");

for (const patent of allPatents) {
  const transcriptPath = path.join(transcriptsDir, `${patent.id}.txt`);
  if (!fs.existsSync(transcriptPath)) {
    console.warn(`Skipped ${patent.id}: no transcript is available to format.`);
    continue;
  }
  const previewPath = path.join(previewDir, `${patent.id}.txt`);
  const formatted = `${normalizePatentProse(fs.readFileSync(transcriptPath, "utf8"))}\n`;

  fs.mkdirSync(previewDir, { recursive: true });
  fs.writeFileSync(previewPath, formatted, "utf8");
  console.log(`Previewed ${patent.id} (${formatted.length} chars).`);
}

console.log(
  `\nReview candidates in ${path.relative(process.cwd(), previewDir)} before any editorial action.`,
);
