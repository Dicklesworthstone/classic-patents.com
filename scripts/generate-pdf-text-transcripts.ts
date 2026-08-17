/**
 * Creates immutable, page-delimited text layers from the exact PDFs served by
 * the site. These files are deliberately separate from reviewed focr output:
 * they provide complete machine-readable coverage without misrepresenting
 * their OCR quality as editorially verified.
 *
 * The command never overwrites an existing asset. A changed source PDF must be
 * reviewed and handled deliberately rather than silently replacing published
 * text.
 */

import { execFileSync } from "node:child_process";
import * as fs from "node:fs";
import * as path from "node:path";
import { allPatents } from "../src/data/patents";

const MAX_BUFFER_BYTES = 64 * 1024 * 1024;

function pageCountForPdf(pdfPath: string): number {
  const info = execFileSync("pdfinfo", [pdfPath], {
    encoding: "utf8",
    maxBuffer: MAX_BUFFER_BYTES,
  });
  const match = /^Pages:\s+(\d+)$/m.exec(info);
  const pageCount = Number.parseInt(match?.[1] ?? "", 10);
  if (!Number.isSafeInteger(pageCount) || pageCount < 1) {
    throw new Error(`Could not determine a valid page count for ${pdfPath}.`);
  }
  return pageCount;
}

function sourceTextForPdf(pdfPath: string, pageCount: number): string {
  const extracted = execFileSync("pdftotext", ["-layout", pdfPath, "-"], {
    encoding: "utf8",
    maxBuffer: MAX_BUFFER_BYTES,
  }).replace(/\r\n?/g, "\n");
  const pages = extracted.split("\f");
  if (pages.at(-1) === "") pages.pop();

  if (pages.length !== pageCount) {
    throw new Error(
      `${pdfPath}: pdftotext produced ${pages.length} text page(s), expected ${pageCount} source page(s).`,
    );
  }

  const textCharacterCount = extracted.replace(/\s/g, "").length;
  if (textCharacterCount < 200) {
    throw new Error(
      `${pdfPath}: source PDF has no usable text layer (${textCharacterCount} characters).`,
    );
  }

  return pages
    .map((page, index) => `--- SOURCE PDF PAGE ${index + 1} OF ${pageCount} ---\n\n${page}`)
    .join("\n\n");
}

function writeNewAsset(outputPath: string, content: string): "created" | "unchanged" {
  if (fs.existsSync(outputPath)) {
    const existing = fs.readFileSync(outputPath, "utf8");
    if (existing === content) return "unchanged";
    throw new Error(
      `${outputPath} already exists with different content; refusing to overwrite a published transcript.`,
    );
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, content, { encoding: "utf8", flag: "wx" });
  return "created";
}

function main() {
  const outputDirectory = path.join(process.cwd(), "public", "patents", "source-text");
  let created = 0;
  let unchanged = 0;

  for (const patent of allPatents) {
    const asset = patent.originalTextAsset;
    if (asset?.kind !== "source-pdf-text-layer") continue;

    const pdfPath = path.join(process.cwd(), "public", patent.originalPdfUrl);
    const pageCount = pageCountForPdf(pdfPath);
    if (pageCount !== asset.pageCount) {
      throw new Error(
        `${patent.id}: registry records ${asset.pageCount} source pages, but ${pdfPath} has ${pageCount}.`,
      );
    }

    const content = sourceTextForPdf(pdfPath, pageCount);
    const outputPath = path.join(outputDirectory, `${patent.id}.txt`);
    const result = writeNewAsset(outputPath, content);
    if (result === "created") created++;
    else unchanged++;
    console.log(
      `${result === "created" ? "Created" : "Verified"} ${path.relative(process.cwd(), outputPath)}`,
    );
  }

  console.log(`Complete source-PDF text assets: ${created} created, ${unchanged} unchanged.`);
}

main();
