import { execFileSync } from "node:child_process";
import * as fs from "node:fs";
import * as path from "node:path";
import { allPatents } from "../src/data/patents";

const MAX_PDF_TEXT_BUFFER_BYTES = 64 * 1024 * 1024;

function exactSourceTextForPdf(pdfPath: string, expectedPageCount: number): string {
  const extracted = execFileSync("pdftotext", ["-layout", pdfPath, "-"], {
    encoding: "utf8",
    maxBuffer: MAX_PDF_TEXT_BUFFER_BYTES,
  }).replace(/\r\n?/g, "\n");
  const pages = extracted.split("\f");
  if (pages.at(-1) === "") pages.pop();

  if (pages.length !== expectedPageCount) {
    throw new Error(
      `${pdfPath}: pdftotext produced ${pages.length} page(s), expected ${expectedPageCount}.`,
    );
  }

  return pages
    .map((page, index) => `--- SOURCE PDF PAGE ${index + 1} OF ${expectedPageCount} ---\n\n${page}`)
    .join("\n\n");
}

function main() {
  const sourceTextDir = path.join(process.cwd(), "public", "patents", "source-text");
  let restored = 0;

  for (const patent of allPatents) {
    const asset = patent.originalTextAsset;
    if (asset?.kind !== "source-pdf-text-layer") continue;

    const pdfPath = path.join(process.cwd(), "public", patent.originalPdfUrl.replace(/^\//, ""));
    if (!fs.existsSync(pdfPath)) continue;

    const expectedText = exactSourceTextForPdf(pdfPath, asset.pageCount);
    const targetFile = path.join(sourceTextDir, `${patent.id}.txt`);
    fs.writeFileSync(targetFile, expectedText, "utf8");
    console.log(`✓ Restored exact source text for ${patent.id}`);
    restored++;
  }

  console.log(`\nRestored ${restored} source-text files.`);
}

main();
