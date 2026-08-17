/**
 * ocr-patents.ts
 *
 * Runs franken_ocr (focr) on downloaded patent PDF page images to generate structured markdown transcripts.
 */

import { execFileSync } from "node:child_process";
import * as fs from "node:fs";
import * as path from "node:path";
import { allPatents } from "../src/data/patents";

const MAX_COMMAND_BUFFER_BYTES = 32 * 1024 * 1024;

function getPageCount(inputFile: string): number {
  const pdfInfo = execFileSync("pdfinfo", [inputFile], {
    encoding: "utf8",
    maxBuffer: MAX_COMMAND_BUFFER_BYTES,
  });
  const match = /^Pages:\s+(\d+)$/m.exec(pdfInfo);
  const pageCount = match?.[1] ? Number.parseInt(match[1], 10) : Number.NaN;

  if (!Number.isSafeInteger(pageCount) || pageCount < 1) {
    throw new Error(`Could not determine a valid page count for ${inputFile}.`);
  }

  return pageCount;
}

function renderCompatibilityPdf(inputFile: string, rasterCacheDir: string): string {
  const pageCount = getPageCount(inputFile);
  fs.mkdirSync(rasterCacheDir, { recursive: true });

  const pagePattern = path.join(rasterCacheDir, "page-%d.png");
  console.log(`  Rendering ${pageCount} page(s) to a compatibility PDF for focr...`);
  execFileSync(
    "mutool",
    [
      "convert",
      "-F",
      "png",
      "-O",
      "resolution=300,colorspace=gray",
      "-o",
      pagePattern,
      inputFile,
    ],
    { stdio: "inherit" },
  );

  const pageImages = Array.from({ length: pageCount }, (_, index) =>
    path.join(rasterCacheDir, `page-${index + 1}.png`),
  );
  const missingImage = pageImages.find((pageImage) => !fs.existsSync(pageImage));
  if (missingImage) {
    throw new Error(`PDF renderer did not produce expected page image: ${missingImage}`);
  }

  const compatibilityPdf = path.join(rasterCacheDir, "focr-compatible.pdf");
  execFileSync("magick", [...pageImages, "-compress", "Zip", compatibilityPdf], {
    stdio: "inherit",
  });

  return compatibilityPdf;
}

function isUnsupportedCcittPdf(error: unknown): boolean {
  if (!(error instanceof Error)) return false;

  const commandError = error as Error & { stderr?: Buffer | string };
  const stderr = commandError.stderr;
  const diagnostic =
    typeof stderr === "string"
      ? stderr
      : Buffer.isBuffer(stderr)
        ? stderr.toString("utf8")
        : error.message;

  return diagnostic.includes("CCITTFaxDecode") && diagnostic.includes("not supported");
}

async function main() {
  console.log("=== Classic Patents OCR Pipeline (franken_ocr / focr) ===");

  // Check if focr binary exists
  let focrPath = "focr";
  try {
    const whichOut = execFileSync("which", ["focr"], { encoding: "utf8" }).trim();
    if (whichOut) focrPath = whichOut;
  } catch {
    console.warn("Could not resolve focr on PATH; attempting the configured command name.");
  }

  console.log(`Using focr binary at: ${focrPath}`);

  try {
    const version = execFileSync(focrPath, ["--version"], { encoding: "utf8" }).trim();
    console.log(`focr version: ${version}\n`);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`Could not execute focr at ${focrPath}: ${message}`);
  }

  const artifactsDir = path.join(process.cwd(), "artifacts", "ocr_transcripts");
  if (!fs.existsSync(artifactsDir)) {
    fs.mkdirSync(artifactsDir, { recursive: true });
  }
  const rasterCacheRoot = path.join(process.cwd(), "artifacts", "ocr_raster_cache");

  for (const patent of allPatents) {
    console.log(`Processing [${patent.patentNumber}] ${patent.shortTitle}...`);
    const outputFile = path.join(artifactsDir, `${patent.id}.md`);
    const inputFile = path.join(process.cwd(), "artifacts", "raw_pdfs", `${patent.id}.pdf`);

    if (!fs.existsSync(inputFile)) {
      throw new Error(`Missing input PDF: ${inputFile}. Run bun run pipeline:download first.`);
    }

    try {
      execFileSync(focrPath, ["ocr", inputFile, "--output", outputFile], {
        stdio: "pipe",
        maxBuffer: MAX_COMMAND_BUFFER_BYTES,
      });
    } catch (error: unknown) {
      if (!isUnsupportedCcittPdf(error)) throw error;

      console.warn("  focr cannot natively decode this Group 3 CCITT PDF; using raster fallback.");
      const compatibilityPdf = renderCompatibilityPdf(
        inputFile,
        path.join(rasterCacheRoot, patent.id),
      );
      execFileSync(focrPath, ["ocr", compatibilityPdf, "--output", outputFile], {
        stdio: "inherit",
        maxBuffer: MAX_COMMAND_BUFFER_BYTES,
      });
    }
    console.log(`  ✓ OCR transcript generated: ${outputFile}\n`);
  }

  console.log("=== OCR Pipeline Completed Successfully ===");
}

main().catch((err) => {
  console.error("OCR Pipeline error:", err);
  process.exit(1);
});
