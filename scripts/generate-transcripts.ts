import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { allPatents } from "../src/data/patents";

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
