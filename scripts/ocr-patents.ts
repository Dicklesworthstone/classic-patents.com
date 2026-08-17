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
const MAX_OCR_TOKENS = process.env.FOCR_MAX_NEW_TOKENS ?? "4096";

type RenderedPage = {
  inputPath: string;
  pageNumber: number;
  patentId: string;
};

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

function renderPatentPages(
  inputFile: string,
  rasterCacheDir: string,
  patentId: string,
): RenderedPage[] {
  const pageCount = getPageCount(inputFile);
  fs.mkdirSync(rasterCacheDir, { recursive: true });

  const pagePattern = path.join(rasterCacheDir, "page-%d.png");
  console.log(
    `  Rendering ${pageCount} page(s) to PNG because focr cannot decode Group 3 CCITT directly...`,
  );
  execFileSync(
    "mutool",
    ["convert", "-F", "png", "-O", "resolution=300,colorspace=gray", "-o", pagePattern, inputFile],
    { stdio: "inherit" },
  );

  const pageImages = Array.from({ length: pageCount }, (_, index) => ({
    inputPath: path.join(rasterCacheDir, `page-${index + 1}.png`),
    pageNumber: index + 1,
    patentId,
  }));
  const missingImage = pageImages.find((pageImage) => !fs.existsSync(pageImage.inputPath));
  if (missingImage) {
    throw new Error(`PDF renderer did not produce expected page image: ${missingImage.inputPath}`);
  }

  return pageImages;
}

function parseBatchResults(stdout: string): Map<string, string> {
  const parsedObjects = stdout
    .trim()
    .split("\n")
    .filter(Boolean)
    .flatMap((line) => {
      try {
        return [JSON.parse(line) as unknown];
      } catch {
        return [];
      }
    });
  const results = parsedObjects.flatMap((value) => {
    if (!value || typeof value !== "object") return [];
    const record = value as { results?: unknown };
    return Array.isArray(record.results) ? record.results : [record];
  });
  const markdownByImage = new Map<string, string>();

  for (const result of results) {
    if (!result || typeof result !== "object") continue;
    const record = result as { error?: unknown; image?: unknown; markdown?: unknown; ok?: unknown };
    if (typeof record.image !== "string" || record.ok !== true) {
      if (typeof record.error === "string") {
        throw new Error(`focr batch failed for ${String(record.image)}: ${record.error}`);
      }
      continue;
    }
    if (typeof record.markdown !== "string") {
      throw new Error(`focr batch returned no Markdown for ${record.image}.`);
    }
    markdownByImage.set(path.resolve(record.image), record.markdown);
  }

  return markdownByImage;
}

function runOcrBatch(focrPath: string, pages: RenderedPage[]): Map<string, string> {
  console.log(`\nRunning focr once across ${pages.length} rendered page(s)...`);
  const stdout = execFileSync(
    focrPath,
    ["ocr-batch", "--json", ...pages.map((page) => page.inputPath)],
    {
      encoding: "utf8",
      env: { ...process.env, FOCR_MAX_NEW_TOKENS: MAX_OCR_TOKENS },
      maxBuffer: MAX_COMMAND_BUFFER_BYTES,
    },
  );
  const markdownByImage = parseBatchResults(stdout);
  const missingResult = pages.find((page) => !markdownByImage.has(path.resolve(page.inputPath)));
  if (missingResult) {
    throw new Error(`focr batch returned no result for ${missingResult.inputPath}.`);
  }

  return markdownByImage;
}

function writePatentTranscript(
  patentId: string,
  outputFile: string,
  pages: RenderedPage[],
  markdownByImage: Map<string, string>,
): void {
  const transcript = pages
    .map((page) => {
      const markdown = markdownByImage.get(path.resolve(page.inputPath));
      if (!markdown) throw new Error(`Missing OCR text for ${page.inputPath}.`);
      return `## Page ${page.pageNumber}\n\n${markdown.trim()}`;
    })
    .join("\n\n");

  fs.writeFileSync(
    outputFile,
    `<!-- Generated from ${patentId}.pdf with focr; do not treat this as an authoritative transcription. -->\n\n${transcript}\n`,
  );
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
  const renderedPages: RenderedPage[] = [];

  for (const patent of allPatents) {
    console.log(`Processing [${patent.patentNumber}] ${patent.shortTitle}...`);
    const inputFile = path.join(process.cwd(), "artifacts", "raw_pdfs", `${patent.id}.pdf`);

    if (!fs.existsSync(inputFile)) {
      throw new Error(`Missing input PDF: ${inputFile}. Run bun run pipeline:download first.`);
    }

    const pages = renderPatentPages(inputFile, path.join(rasterCacheRoot, patent.id), patent.id);
    for (const p of pages) {
      renderedPages.push(p);
    }
  }

  const markdownByImage = runOcrBatch(focrPath, renderedPages);
  for (const patent of allPatents) {
    const outputFile = path.join(artifactsDir, `${patent.id}.md`);
    const patentPages = renderedPages.filter((page) => page.patentId === patent.id);
    writePatentTranscript(patent.id, outputFile, patentPages, markdownByImage);
    console.log(`  ✓ OCR transcript generated: ${outputFile}`);
  }

  console.log("=== OCR Pipeline Completed Successfully ===");
}

main().catch((err) => {
  console.error("OCR Pipeline error:", err);
  process.exit(1);
});
