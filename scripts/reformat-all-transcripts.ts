/**
 * reformat-all-transcripts.ts
 *
 * Systematic Data Quality & Archival Typography Formatter for all Patent Transcripts.
 * Formats full reviewed text into clean, well-spaced paragraphs of reasonable reading length,
 * separating preambles, claims, and numbered items into distinct structured blocks.
 */

import * as fs from "node:fs";
import * as path from "node:path";

const transcriptsDir = path.join(process.cwd(), "public", "patents", "transcripts");

function formatTranscript(content: string): string {
  let text = content.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();

  // 1. Separate UNITED STATES PATENT OFFICE banner
  text = text.replace(/(UNITED STATES PATENT OFFICE\.)\s*([A-Z])/i, "$1\n\n$2");

  // 2. Separate Preamble "To all whom it may concern:"
  text = text.replace(/([^\n])\s*(To all whom it may concern:?)\s*([^\n])/i, "$1\n\n$2\n\n$3");
  text = text.replace(/^(To all whom it may concern:?)\s*([^\n])/im, "$1\n\n$2");

  // 3. Separate Specification / Application notices
  text = text.replace(
    /(Specification forming part of[^\n]+)\s*(Application filed[^\n]+)/i,
    "$1\n$2",
  );
  text = text.replace(/(Application filed[^\n]+)\s*(To all whom)/i, "$1\n\n$2");

  // 4. Separate "I claim as my invention:" or "What I claim as my invention is:" or "What I claim is:"
  text = text.replace(
    /([^\n])\s*(I claim(?: as my invention)?:?|What (?:I|we) claim(?: as (?:my|our) invention)?(?: is)?:?|CLAIMS:?)\s*([^\n])/i,
    "$1\n\n$2\n\n$3",
  );

  // 5. Separate inline numbered claims or numbered items (" 1. ", " 2. ", " 3. ", etc.)
  text = text.replace(/([.!?])\s+(\d+\.\s+[A-Z])/g, "$1\n\n$2");

  // 6. Normalize paragraph spacing
  const paragraphs = text
    .split(/\n{2,}/)
    .map((p) => p.replace(/[ \t]+/g, " ").trim())
    .filter(Boolean);

  // 7. For very long paragraphs (> 1000 characters and > 4 sentences), break into reasonable chunks
  const balancedParagraphs: string[] = [];
  for (const para of paragraphs) {
    // If it's a claim, header, or short paragraph, preserve it directly
    if (
      para.length < 800 ||
      /^\d+\.\s/.test(para) ||
      para === para.toUpperCase() ||
      para.startsWith("To all whom")
    ) {
      balancedParagraphs.push(para);
      continue;
    }

    // Split long paragraphs at sentence boundaries
    const sentences = para.match(/[^.!?]+[.!?]+(?:["'”’)]+)?|[^.!?]+$/g) || [para];
    let currentChunk = "";
    for (const sent of sentences) {
      const trimmed = sent.trim();
      if (!trimmed) continue;
      if (currentChunk.length + trimmed.length > 700 && currentChunk.length > 300) {
        balancedParagraphs.push(currentChunk.trim());
        currentChunk = `${trimmed} `;
      } else {
        currentChunk += `${trimmed} `;
      }
    }
    if (currentChunk.trim()) {
      balancedParagraphs.push(currentChunk.trim());
    }
  }

  return `${balancedParagraphs.join("\n\n")}\n`;
}

function main() {
  const files = fs.readdirSync(transcriptsDir).filter((f) => f.endsWith(".txt"));
  console.log(`Processing ${files.length} transcript files...`);

  let modifiedCount = 0;
  for (const file of files) {
    const filePath = path.join(transcriptsDir, file);
    const original = fs.readFileSync(filePath, "utf8");
    const formatted = formatTranscript(original);

    if (original !== formatted) {
      fs.writeFileSync(filePath, formatted, "utf8");
      console.log(`✓ Formatted ${file} (${formatted.split("\n\n").length} paragraphs)`);
      modifiedCount++;
    }
  }

  console.log(
    `\nReformatting complete. ${modifiedCount} transcript files updated with museum-quality typography.`,
  );
}

main();
