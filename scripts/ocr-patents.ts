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
const PAGES_PER_BATCH = parsePositiveIntegerEnv("OCR_PAGES_PER_BATCH", 8);
const PAGE_LIMIT = parseOptionalPositiveIntegerEnv("OCR_PAGE_LIMIT");
const RUN_ID = getRunId();

type RenderedPage = {
  inputPath: string;
  pageNumber: number;
  patentId: string;
};

type OcrPageResult = {
  error?: string;
  image: string;
  markdown?: string;
  ok: boolean;
  seconds?: number;
};

type RunPageStatus = {
  checkpoint?: string;
  error?: string;
  inputPath: string;
  pageNumber: number;
  patentId: string;
  seconds?: number;
  status: "checkpointed" | "failed" | "pending";
};

function parsePositiveIntegerEnv(name: string, fallback: number): number {
  const value = process.env[name];
  if (value === undefined) return fallback;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isSafeInteger(parsed) || parsed < 1) {
    throw new Error(`${name} must be a positive integer; received ${JSON.stringify(value)}.`);
  }
  return parsed;
}

function parseOptionalPositiveIntegerEnv(name: string): number | undefined {
  return process.env[name] === undefined ? undefined : parsePositiveIntegerEnv(name, 1);
}

function getRunId(): string {
  const configured = process.env.OCR_RUN_ID;
  const runId = configured ?? `focr-${new Date().toISOString().replace(/[:.]/g, "-")}`;
  if (!/^[a-zA-Z0-9][a-zA-Z0-9_-]*$/.test(runId)) {
    throw new Error("OCR_RUN_ID may contain only letters, numbers, underscores, and hyphens.");
  }
  return runId;
}

function pageKey(page: RenderedPage): string {
  return `${page.patentId}:${page.pageNumber}`;
}

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
  const pageImages = Array.from({ length: pageCount }, (_, index) => ({
    inputPath: path.join(rasterCacheDir, `page-${index + 1}.png`),
    pageNumber: index + 1,
    patentId,
  }));
  if (pageImages.every((pageImage) => fs.existsSync(pageImage.inputPath))) {
    console.log(`  Reusing ${pageCount} cached 300-DPI page image(s).`);
    return pageImages;
  }

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

  const missingImage = pageImages.find((pageImage) => !fs.existsSync(pageImage.inputPath));
  if (missingImage) {
    throw new Error(`PDF renderer did not produce expected page image: ${missingImage.inputPath}`);
  }

  return pageImages;
}

function parseBatchResults(stdout: string): OcrPageResult[] {
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
  const resultsByImage = new Map<string, OcrPageResult>();

  for (const result of results) {
    if (!result || typeof result !== "object") continue;
    const record = result as {
      error?: unknown;
      image?: unknown;
      markdown?: unknown;
      ok?: unknown;
      seconds?: unknown;
    };
    if (typeof record.image !== "string" || typeof record.ok !== "boolean") continue;
    const outcome: OcrPageResult = {
      image: path.resolve(record.image),
      ok: record.ok,
      ...(typeof record.seconds === "number" ? { seconds: record.seconds } : {}),
    };
    if (record.ok) {
      if (typeof record.markdown !== "string") {
        throw new Error(`focr batch returned no Markdown for ${record.image}.`);
      }
      outcome.markdown = record.markdown;
    } else {
      outcome.error =
        typeof record.error === "string"
          ? record.error
          : "focr reported an unspecified page error.";
    }
    resultsByImage.set(outcome.image, outcome);
  }

  return [...resultsByImage.values()];
}

function runOcrBatch(focrPath: string, pages: RenderedPage[]): OcrPageResult[] {
  console.log(`\nRunning focr on the next ${pages.length} rendered page(s)...`);
  const stdout = execFileSync(
    focrPath,
    ["ocr-batch", "--json", ...pages.map((page) => page.inputPath)],
    {
      encoding: "utf8",
      env: { ...process.env, FOCR_MAX_NEW_TOKENS: MAX_OCR_TOKENS },
      maxBuffer: MAX_COMMAND_BUFFER_BYTES,
    },
  );
  const results = parseBatchResults(stdout);
  const resultsByImage = new Map(results.map((result) => [result.image, result]));
  for (const page of pages) {
    const inputPath = path.resolve(page.inputPath);
    if (!resultsByImage.has(inputPath)) {
      resultsByImage.set(inputPath, {
        error: "focr batch returned no result for this page.",
        image: inputPath,
        ok: false,
      });
    }
  }

  return pages.map((page) => resultsByImage.get(path.resolve(page.inputPath)) as OcrPageResult);
}

function checkpointPath(checkpointRoot: string, page: RenderedPage): string {
  return path.join(checkpointRoot, page.patentId, `page-${page.pageNumber}.md`);
}

function writePageCheckpoint(checkpointRoot: string, page: RenderedPage, markdown: string): string {
  const outputFile = checkpointPath(checkpointRoot, page);
  fs.mkdirSync(path.dirname(outputFile), { recursive: true });
  fs.writeFileSync(
    outputFile,
    `<!-- Non-authoritative focr output from ${path.basename(page.inputPath)}. -->\n\n${markdown.trim()}\n`,
  );
  return outputFile;
}

function writePatentRunTranscript(
  runId: string,
  _patentId: string,
  outputFile: string,
  pages: RenderedPage[],
  checkpointRoot: string,
): void {
  const completedPages = pages.flatMap((page) => {
    const pageCheckpoint = checkpointPath(checkpointRoot, page);
    if (!fs.existsSync(pageCheckpoint)) return [];
    return [`## Page ${page.pageNumber}\n\n${fs.readFileSync(pageCheckpoint, "utf8").trim()}`];
  });

  fs.mkdirSync(path.dirname(outputFile), { recursive: true });
  fs.writeFileSync(
    outputFile,
    `<!-- OCR run ${runId}: ${completedPages.length}/${pages.length} page checkpoints are available. ` +
      "This is non-authoritative machine output and does not replace the curated transcript. -->\n\n" +
      `${completedPages.join("\n\n")}\n`,
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

  const runRoot = path.join(process.cwd(), "artifacts", "ocr_runs", RUN_ID);
  const checkpointRoot = path.join(runRoot, "checkpoints");
  const transcriptRoot = path.join(runRoot, "transcripts");
  const progressFile = path.join(runRoot, "progress.json");
  fs.mkdirSync(runRoot, { recursive: true });
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

  const selectedPages = PAGE_LIMIT ? renderedPages.slice(0, PAGE_LIMIT) : renderedPages;
  const completedKeys = new Set(
    selectedPages
      .filter((page) => fs.existsSync(checkpointPath(checkpointRoot, page)))
      .map(pageKey),
  );
  const failedPages = new Map<string, RunPageStatus>();
  const startedAt = new Date();

  const writeProgress = () => {
    const elapsedSeconds = (Date.now() - startedAt.getTime()) / 1000;
    const completedPages = selectedPages.filter((page) => completedKeys.has(pageKey(page)));
    const pagesPerHour = elapsedSeconds > 0 ? (completedPages.length * 3600) / elapsedSeconds : 0;
    const remainingPages = selectedPages.length - completedPages.length;
    const estimatedSecondsRemaining =
      pagesPerHour > 0 ? (remainingPages / pagesPerHour) * 3600 : null;
    const pages: RunPageStatus[] = selectedPages.map((page) => {
      const key = pageKey(page);
      const failed = failedPages.get(key);
      if (completedKeys.has(key)) {
        return {
          checkpoint: path.relative(runRoot, checkpointPath(checkpointRoot, page)),
          inputPath: path.relative(process.cwd(), page.inputPath),
          pageNumber: page.pageNumber,
          patentId: page.patentId,
          status: "checkpointed",
        };
      }
      if (failed) return failed;
      return {
        inputPath: path.relative(process.cwd(), page.inputPath),
        pageNumber: page.pageNumber,
        patentId: page.patentId,
        status: "pending",
      };
    });
    fs.writeFileSync(
      progressFile,
      `${JSON.stringify(
        {
          schemaVersion: 1,
          runId: RUN_ID,
          startedAt: startedAt.toISOString(),
          updatedAt: new Date().toISOString(),
          focr: { binary: focrPath, maxNewTokens: MAX_OCR_TOKENS },
          scope: { pagesPerBatch: PAGES_PER_BATCH, pageLimit: PAGE_LIMIT ?? null },
          progress: {
            completedPages: completedPages.length,
            failedPages: failedPages.size,
            totalPages: selectedPages.length,
            elapsedSeconds,
            observedPagesPerHour: pagesPerHour,
            estimatedSecondsRemaining,
          },
          pages,
        },
        null,
        2,
      )}\n`,
    );
  };

  const pendingPages = selectedPages.filter((page) => !completedKeys.has(pageKey(page)));
  console.log(
    `OCR run: ${RUN_ID}. ${completedKeys.size}/${selectedPages.length} page checkpoint(s) already exist.`,
  );
  console.log(
    `Checkpoint outputs: ${path.relative(process.cwd(), runRoot)} (canonical transcripts remain untouched).`,
  );
  if (PAGE_LIMIT) {
    console.log(`Pilot limit active: processing only the first ${PAGE_LIMIT} registered page(s).`);
  }
  writeProgress();

  for (let offset = 0; offset < pendingPages.length; offset += PAGES_PER_BATCH) {
    const batch = pendingPages.slice(offset, offset + PAGES_PER_BATCH);
    console.log(
      `\nCheckpoint batch ${Math.floor(offset / PAGES_PER_BATCH) + 1}: pages ${offset + 1}-${offset + batch.length} of ${pendingPages.length} remaining.`,
    );
    const results = runOcrBatch(focrPath, batch);
    const affectedPatentIds = new Set<string>();

    for (const [index, page] of batch.entries()) {
      const result = results[index];
      const key = pageKey(page);
      affectedPatentIds.add(page.patentId);
      if (result.ok && result.markdown) {
        const pageCheckpoint = writePageCheckpoint(checkpointRoot, page, result.markdown);
        completedKeys.add(key);
        failedPages.delete(key);
        console.log(
          `  ✓ ${completedKeys.size}/${selectedPages.length}: ${page.patentId} page ${page.pageNumber} ` +
            `(${result.seconds?.toFixed(1) ?? "unknown"} s; ${path.relative(process.cwd(), pageCheckpoint)})`,
        );
      } else {
        const failure: RunPageStatus = {
          error: result.error ?? "focr reported an unspecified page error.",
          inputPath: path.relative(process.cwd(), page.inputPath),
          pageNumber: page.pageNumber,
          patentId: page.patentId,
          seconds: result.seconds,
          status: "failed",
        };
        failedPages.set(key, failure);
        console.error(`  ✗ ${page.patentId} page ${page.pageNumber}: ${failure.error}`);
      }
    }

    for (const patentId of affectedPatentIds) {
      const patentPages = selectedPages.filter((page) => page.patentId === patentId);
      writePatentRunTranscript(
        RUN_ID,
        patentId,
        path.join(transcriptRoot, `${patentId}.md`),
        patentPages,
        checkpointRoot,
      );
    }
    writeProgress();
    const elapsedSeconds = (Date.now() - startedAt.getTime()) / 1000;
    const pagesPerHour = elapsedSeconds > 0 ? (completedKeys.size * 3600) / elapsedSeconds : 0;
    const pendingCount = selectedPages.length - completedKeys.size;
    const estimatedMinutes = pagesPerHour > 0 ? (pendingCount / pagesPerHour) * 60 : null;
    console.log(
      `  Observed rate: ${pagesPerHour.toFixed(1)} pages/hour; ` +
        (estimatedMinutes === null
          ? "ETA unavailable."
          : `estimated remaining time: ${estimatedMinutes.toFixed(0)} min.`),
    );
  }

  writeProgress();
  const status = failedPages.size === 0 ? "Completed" : "Completed with page failures";
  console.log(`=== OCR Pipeline ${status}: ${RUN_ID} ===`);
  console.log(
    `Review quality in ${path.relative(process.cwd(), checkpointRoot)} before promoting any OCR.`,
  );
}

main().catch((err) => {
  console.error("OCR Pipeline error:", err);
  process.exit(1);
});
