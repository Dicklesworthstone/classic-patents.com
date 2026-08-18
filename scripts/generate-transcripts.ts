import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { allPatents } from "../src/data/patents";

/**
 * Retired safety guard. `pdftotext` is useful private comparison evidence,
 * but a new public transcript filename can later be mistaken for a reviewed
 * complete edition. OCR and extraction output belong under artifacts until a
 * patent-specific human review creates the ledgered reviewed asset.
 */
async function refuseRetiredBulkMutation(): Promise<void> {
  throw new Error(
    "This public transcript generator is retired. Keep PDF extraction and OCR in artifacts; publish a transcript only after page-by-page facsimile review and an explicit per-patent catalogue change.",
  );
}

await refuseRetiredBulkMutation();

const transcriptsDir = path.join(process.cwd(), "public", "patents", "transcripts");
const publicDir = path.join(process.cwd(), "public");

function resolveWithin(directory: string, candidate: string): string {
  const resolved = path.resolve(directory, candidate);
  const relative = path.relative(directory, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`Transcript path escapes ${directory}: ${candidate}`);
  }
  return resolved;
}

let created = 0;
let skipped = 0;

for (const patent of allPatents) {
  const transcriptPath = resolveWithin(transcriptsDir, `${patent.id}.txt`);
  if (fs.existsSync(transcriptPath)) {
    console.log(
      `Skipped existing transcript for ${patent.id}; canonical files are never overwritten.`,
    );
    skipped++;
    continue;
  }

  const pdfPath = resolveWithin(publicDir, `patents/pdfs/${patent.id}.pdf`);
  if (!fs.existsSync(pdfPath)) {
    console.warn(`Withheld ${patent.id}: local PDF is missing.`);
    skipped++;
    continue;
  }

  let text: string;
  try {
    text = execFileSync("pdftotext", [pdfPath, "-"], { encoding: "utf8" }).trim();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`Withheld ${patent.id}: pdftotext failed (${message}).`);
    skipped++;
    continue;
  }

  if (text.replace(/\s/g, "").length < 200) {
    console.warn(`Withheld ${patent.id}: PDF has no usable text layer.`);
    skipped++;
    continue;
  }

  fs.mkdirSync(transcriptsDir, { recursive: true });
  fs.writeFileSync(transcriptPath, text, "utf8");
  console.log(`Created non-editorial PDF text transcript for ${patent.id} (${text.length} chars).`);
  created++;
}

console.log(
  `Transcript generation complete: ${created} created, ${skipped} withheld or unchanged.`,
);
