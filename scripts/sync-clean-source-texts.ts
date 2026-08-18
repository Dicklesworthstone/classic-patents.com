/**
 * sync-clean-source-texts.ts
 *
 * Synchronizes clean, de-interleaved, readable text into public/patents/source-text/*.txt
 * while preserving required page markers (--- SOURCE PDF PAGE X OF Y ---) so that
 * no raw OCR column-interleaving garbage exists anywhere in the repository.
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { allPatents } from "../src/data/patents";

/**
 * Retired safety guard. This script used to manufacture a page ledger by
 * redistributing transcript paragraphs and inventing a page-one title. Those
 * operations destroy the facsimile's real page and column order. The source
 * PDF, raw comparison layer, reviewed transcript, and manual React edition
 * are distinct editorial artifacts and must never be synthesized from one
 * another in bulk.
 */
async function refuseRetiredBulkMutation(): Promise<void> {
  throw new Error(
    "This bulk source-text synchronizer is retired. It may not rewrite public patent text from another transcript; prepare each patent against its facsimile and make an explicit per-patent editorial change.",
  );
}

await refuseRetiredBulkMutation();

const sourceTextDir = path.join(process.cwd(), "public", "patents", "source-text");
const transcriptsDir = path.join(process.cwd(), "public", "patents", "transcripts");

function main() {
  let updatedCount = 0;

  for (const patent of allPatents) {
    const transcriptPath = path.join(transcriptsDir, `${patent.id}.txt`);
    const sourceTextPath = path.join(sourceTextDir, `${patent.id}.txt`);

    if (!fs.existsSync(transcriptPath) || !fs.existsSync(sourceTextPath)) {
      continue;
    }

    const cleanTranscript = fs.readFileSync(transcriptPath, "utf8").trim();
    const sourceText = fs.readFileSync(sourceTextPath, "utf8");

    // Extract existing page markers
    const pageMarkers = sourceText.match(/^--- SOURCE PDF PAGE \d+ OF \d+ ---$/gm);
    if (!pageMarkers || pageMarkers.length === 0) continue;

    const pageCount = pageMarkers.length;
    const cleanParagraphs = cleanTranscript.split(/\n{2,}/).filter(Boolean);

    // Distribute clean paragraphs across the text pages (pages after drawing sheets)
    // Page 1 is typically title/drawing; pages 2..N are specification text
    const pages: string[] = [];

    if (pageCount === 1) {
      pages.push(`${pageMarkers[0]}\n\n${cleanTranscript}\n`);
    } else {
      // Page 1: Drawing Sheet / Formal Title Banner
      pages.push(
        `${pageMarkers[0]}\n\n${patent.title.toUpperCase()}\nSpecification of Letters Patent No. ${patent.patentNumber}\n`,
      );

      // Remaining pages: Distribute paragraphs evenly
      const textPagesCount = pageCount - 1;
      const parasPerPage = Math.ceil(cleanParagraphs.length / textPagesCount);

      for (let p = 0; p < textPagesCount; p++) {
        const marker = pageMarkers[p + 1];
        const pageParas = cleanParagraphs.slice(p * parasPerPage, (p + 1) * parasPerPage);
        pages.push(`${marker}\n\n${pageParas.join("\n\n")}\n`);
      }
    }

    const newSourceText = `${pages.join("\n")}\n`;
    fs.writeFileSync(sourceTextPath, newSourceText, "utf8");
    console.log(
      `✓ Cleaned source-text for ${patent.id} (${pageCount} pages, ${cleanParagraphs.length} paragraphs)`,
    );
    updatedCount++;
  }

  console.log(
    `\nComplete: ${updatedCount} source-text files updated with clean de-interleaved text.`,
  );
}

main();
