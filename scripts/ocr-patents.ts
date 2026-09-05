/**
 * ocr-patents.ts
 *
 * Orchestrates cloud GPT-5.6 Luna worker transcription drafts for patent PDF page ranges.
 *
 * REPOSITORY DOCTRINE & MANDATORY INVARIANT:
 * Local OCR execution (focr, Tesseract, OCRmyPDF, vision transcription loops) is permanently
 * prohibited on this machine (AGENTS.md). All OCR must run on cloud GPT-5.6 Luna workers.
 * Cloud OCR drafts are research evidence only and are never promoted automatically to reviewed status.
 */

import * as crypto from "node:crypto";
import * as fs from "node:fs";
import * as path from "node:path";
import { allPatents } from "../src/data/patents";
import type { Patent } from "../src/types/patent";

export type FetchFunction = (
  input: string | URL | Request,
  init?: RequestInit,
) => Promise<Response>;

export const PROHIBITED_LOCAL_OCR_COMMANDS = [
  "focr",
  "tesseract",
  "ocrmypdf",
  "easyocr",
  "paddleocr",
  "gocr",
  "cuneiform",
] as const;

export const LUNA_USER_AGENT = "OpenAI File Downloader, XaiImageApiFetch/1.0";
export const LUNA_MODEL = "gpt-5.6-luna-ocr";

export function assertNoLocalOcr(): void {
  if (
    process.env.ALLOW_LOCAL_OCR === "1" ||
    process.env.ALLOW_LOCAL_OCR === "true" ||
    process.env.RUN_LOCAL_OCR === "1" ||
    process.env.RUN_LOCAL_OCR === "true"
  ) {
    throw new Error(
      "LOCAL_OCR_PROHIBITED: Local OCR execution on this host is strictly prohibited by repository doctrine (AGENTS.md). All OCR must run on cloud GPT-5.6 Luna workers.",
    );
  }
}

export interface LunaWorkerRequest {
  jobId: string;
  runId: string;
  model: "gpt-5.6-luna-ocr";
  patentId: string;
  patentNumber: string;
  pdfSha256: string;
  pageNumbers: number[];
  totalPages: number;
  options?: {
    maxTokens?: number;
    targetFormat?: "markdown";
  };
}

export interface LunaPageResult {
  error?: string;
  markdown?: string;
  ok: boolean;
  pageNumber: number;
  seconds?: number;
  tokenCount?: number;
}

export interface LunaWorkerResponse {
  jobId: string;
  model: string;
  patentId: string;
  results: LunaPageResult[];
  runId: string;
}

export interface OcrPipelineConfig {
  apiKey?: string;
  concurrency?: number;
  cwd?: string;
  endpoint?: string;
  fetchFn?: FetchFunction;
  pageLimit?: number;
  pagesPerBatch?: number;
  patents?: Patent[];
  runId?: string;
  timeoutMs?: number;
}

export interface OcrPipelineResult {
  blocker?: {
    code: string;
    endpoint?: string;
    message: string;
  };
  checkpointsWritten: number;
  completedPages: number;
  failedPages: number;
  resumedPages: number;
  runId: string;
  status: "completed" | "completed_with_failures" | "blocked_no_cloud_transport";
  totalPages: number;
}

export function computePdfSha256(filePath: string): string {
  const fileBuffer = fs.readFileSync(filePath);
  return crypto.createHash("sha256").update(fileBuffer).digest("hex").toLowerCase();
}

export function getPdfPageCount(filePath: string): number {
  const fileBuffer = fs.readFileSync(filePath);
  const content = fileBuffer.toString("latin1");

  // Search for /Type /Pages ... /Count N in PDF dictionary
  const countMatches = [...content.matchAll(/\/Type\s*\/Pages\b[\s\S]*?\/Count\s+(\d+)/g)];
  if (countMatches.length > 0) {
    const highestCount = Math.max(...countMatches.map((m) => Number.parseInt(m[1], 10)));
    if (Number.isSafeInteger(highestCount) && highestCount > 0) {
      return highestCount;
    }
  }

  // Fallback: count individual /Type /Page objects (not /Pages)
  const pageMatches = [...content.matchAll(/\/Type\s*\/Page\b(?!\s*s)/g)];
  if (pageMatches.length > 0) {
    return pageMatches.length;
  }

  throw new Error(`Could not determine page count from PDF buffer for ${filePath}.`);
}

export function resolvePatentPdfPath(patent: Patent, baseDir = process.cwd()): string {
  const rawPath = path.join(baseDir, "artifacts", "raw_pdfs", `${patent.id}.pdf`);
  if (fs.existsSync(rawPath)) return rawPath;

  const publicPath = path.join(baseDir, "public", "patents", "pdfs", `${patent.id}.pdf`);
  if (fs.existsSync(publicPath)) return publicPath;

  if (patent.originalPdfUrl.startsWith("/")) {
    const directPublicPath = path.join(baseDir, "public", patent.originalPdfUrl.replace(/^\//, ""));
    if (fs.existsSync(directPublicPath)) return directPublicPath;
  }

  // Fallback to process.cwd() if custom baseDir was used (e.g. in tests)
  if (baseDir !== process.cwd()) {
    const repoRawPath = path.join(process.cwd(), "artifacts", "raw_pdfs", `${patent.id}.pdf`);
    if (fs.existsSync(repoRawPath)) return repoRawPath;

    const repoPublicPath = path.join(
      process.cwd(),
      "public",
      "patents",
      "pdfs",
      `${patent.id}.pdf`,
    );
    if (fs.existsSync(repoPublicPath)) return repoPublicPath;

    if (patent.originalPdfUrl.startsWith("/")) {
      const repoDirectPath = path.join(
        process.cwd(),
        "public",
        patent.originalPdfUrl.replace(/^\//, ""),
      );
      if (fs.existsSync(repoDirectPath)) return repoDirectPath;
    }
  }

  throw new Error(
    `Missing PDF asset for patent ${patent.id}. Checked ${rawPath} and ${publicPath}.`,
  );
}

export async function dispatchLunaWorkerBatch(
  request: LunaWorkerRequest,
  options: {
    apiKey?: string;
    endpoint: string;
    fetchFn?: FetchFunction;
    timeoutMs?: number;
  },
): Promise<LunaWorkerResponse> {
  assertNoLocalOcr();
  const fetchImpl = options.fetchFn ?? fetch;
  const timeoutMs = options.timeoutMs ?? 60_000;
  const controller = new AbortController();
  const timeoutTimer = setTimeout(() => controller.abort(), timeoutMs);

  const headers: Record<string, string> = {
    "User-Agent": LUNA_USER_AGENT,
    "Content-Type": "application/json",
  };
  if (options.apiKey) {
    headers.Authorization = `Bearer ${options.apiKey}`;
  }

  try {
    const response = await fetchImpl(options.endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(request),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      throw new Error(
        `Cloud Luna worker returned HTTP ${response.status} ${response.statusText}${errorText ? `: ${errorText}` : ""}`,
      );
    }

    const data = (await response.json()) as LunaWorkerResponse;
    if (!data || !Array.isArray(data.results)) {
      throw new Error("Invalid response format from Cloud Luna worker: missing results array.");
    }
    return data;
  } finally {
    clearTimeout(timeoutTimer);
  }
}

export function getCheckpointPath(
  checkpointRoot: string,
  patentId: string,
  pageNumber: number,
): string {
  return path.join(checkpointRoot, patentId, `page-${pageNumber}.md`);
}

export function writePageCheckpoint(
  checkpointRoot: string,
  patentId: string,
  pageNumber: number,
  markdown: string,
): string {
  const outputFile = getCheckpointPath(checkpointRoot, patentId, pageNumber);
  fs.mkdirSync(path.dirname(outputFile), { recursive: true });
  fs.writeFileSync(
    outputFile,
    `<!-- Non-authoritative cloud Luna worker output (model: ${LUNA_MODEL}) from ${patentId} page ${pageNumber}. -->\n` +
      `<!-- Machine draft is research evidence only; it does not replace or modify the reviewed ledger or archival edition. -->\n\n` +
      `${markdown.trim()}\n`,
    "utf8",
  );
  return outputFile;
}

export function writePatentRunTranscript(
  runId: string,
  patentId: string,
  outputFile: string,
  pageNumbers: number[],
  checkpointRoot: string,
): void {
  const completedPages = pageNumbers.flatMap((pageNumber) => {
    const pageCheckpoint = getCheckpointPath(checkpointRoot, patentId, pageNumber);
    if (!fs.existsSync(pageCheckpoint)) return [];
    return [`## Page ${pageNumber}\n\n${fs.readFileSync(pageCheckpoint, "utf8").trim()}`];
  });

  fs.mkdirSync(path.dirname(outputFile), { recursive: true });
  fs.writeFileSync(
    outputFile,
    `<!-- Cloud Luna OCR run ${runId}: ${completedPages.length}/${pageNumbers.length} page checkpoints are available. -->\n` +
      `<!-- This is non-authoritative machine output (model: ${LUNA_MODEL}) and does NOT replace the reviewed ledger or archival edition. -->\n\n` +
      `${completedPages.join("\n\n")}\n`,
    "utf8",
  );
}

export async function runOcrPipeline(config: OcrPipelineConfig = {}): Promise<OcrPipelineResult> {
  assertNoLocalOcr();

  const baseDir = config.cwd ?? process.cwd();
  const runId =
    config.runId ??
    process.env.OCR_RUN_ID ??
    `luna-${new Date().toISOString().replace(/[:.]/g, "-")}`;
  if (!/^[a-zA-Z0-9][a-zA-Z0-9_-]*$/.test(runId)) {
    throw new Error("OCR_RUN_ID may contain only letters, numbers, underscores, and hyphens.");
  }

  const endpoint = config.endpoint ?? process.env.LUNA_WORKER_ENDPOINT ?? process.env.LUNA_OCR_URL;
  const apiKey = config.apiKey ?? process.env.LUNA_API_KEY;
  const pagesPerBatch =
    config.pagesPerBatch ??
    (process.env.OCR_PAGES_PER_BATCH ? Number.parseInt(process.env.OCR_PAGES_PER_BATCH, 10) : 4);
  const pageLimit =
    config.pageLimit ??
    (process.env.OCR_PAGE_LIMIT ? Number.parseInt(process.env.OCR_PAGE_LIMIT, 10) : undefined);
  const timeoutMs =
    config.timeoutMs ??
    (process.env.LUNA_TIMEOUT_MS ? Number.parseInt(process.env.LUNA_TIMEOUT_MS, 10) : 60_000);

  const runRoot = path.join(baseDir, "artifacts", "ocr_runs", runId);
  const checkpointRoot = path.join(runRoot, "checkpoints");
  const transcriptRoot = path.join(runRoot, "transcripts");
  const progressFile = path.join(runRoot, "progress.json");
  const blockerFile = path.join(runRoot, "blocker.json");

  fs.mkdirSync(runRoot, { recursive: true });

  const patents = config.patents ?? allPatents;
  const patentTasks: {
    patent: Patent;
    pdfPath: string;
    pdfSha256: string;
    totalPages: number;
    pages: number[];
  }[] = [];

  let globalTotalPages = 0;

  for (const patent of patents) {
    try {
      const pdfPath = resolvePatentPdfPath(patent, baseDir);
      const pdfSha256 = computePdfSha256(pdfPath);
      const totalPages = getPdfPageCount(pdfPath);
      const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
      patentTasks.push({ patent, pdfPath, pdfSha256, totalPages, pages });
      globalTotalPages += totalPages;
    } catch (err) {
      console.warn(
        `[OCR Pipeline] Warning: Could not resolve PDF for ${patent.id}: ${(err as Error).message}`,
      );
    }
  }

  type PageItem = {
    pageNumber: number;
    patent: Patent;
    pdfSha256: string;
    totalPages: number;
  };

  const allPages: PageItem[] = [];
  for (const task of patentTasks) {
    for (const pageNumber of task.pages) {
      allPages.push({
        patent: task.patent,
        pageNumber,
        totalPages: task.totalPages,
        pdfSha256: task.pdfSha256,
      });
    }
  }

  const scopedPages = pageLimit ? allPages.slice(0, pageLimit) : allPages;
  const inScopeTotalPages = scopedPages.length;

  const completedKeys = new Set(
    scopedPages
      .filter((p) => fs.existsSync(getCheckpointPath(checkpointRoot, p.patent.id, p.pageNumber)))
      .map((p) => `${p.patent.id}:${p.pageNumber}`),
  );
  const resumedPagesCount = completedKeys.size;

  // Handle missing cloud transport
  if (!endpoint) {
    const blockerInfo = {
      code: "NO_CLOUD_TRANSPORT",
      message:
        "Cloud GPT-5.6 Luna worker endpoint is not configured (LUNA_WORKER_ENDPOINT is unset). " +
        "Repository doctrine (AGENTS.md) strictly prohibits local OCR on this machine. " +
        "Existing partial work and checkpoints are preserved intact.",
    };

    console.warn(`\n[OCR Pipeline Blocked]: ${blockerInfo.message}\n`);

    fs.writeFileSync(
      blockerFile,
      JSON.stringify(
        {
          schemaVersion: 2,
          runId,
          status: "blocked_no_cloud_transport",
          blocker: blockerInfo,
          resumedPages: resumedPagesCount,
          totalPages: inScopeTotalPages,
          updatedAt: new Date().toISOString(),
        },
        null,
        2,
      ),
      "utf8",
    );

    return {
      runId,
      status: "blocked_no_cloud_transport",
      blocker: blockerInfo,
      totalPages: inScopeTotalPages,
      completedPages: resumedPagesCount,
      failedPages: 0,
      checkpointsWritten: 0,
      resumedPages: resumedPagesCount,
    };
  }

  // Cloud worker is configured; proceed with bounded batches of pending pages
  let checkpointsWritten = 0;
  let failedPagesCount = 0;
  const startedAt = new Date();

  // Group pending scoped pages by patent
  const pendingByPatent = new Map<string, PageItem[]>();
  for (const item of scopedPages) {
    if (!completedKeys.has(`${item.patent.id}:${item.pageNumber}`)) {
      const list = pendingByPatent.get(item.patent.id) ?? [];
      list.push(item);
      pendingByPatent.set(item.patent.id, list);
    }
  }

  const affectedPatentIds = new Set<string>();

  for (const [patentId, items] of pendingByPatent.entries()) {
    affectedPatentIds.add(patentId);
    const patent = items[0].patent;
    const pdfSha256 = items[0].pdfSha256;
    const totalPages = items[0].totalPages;

    for (let offset = 0; offset < items.length; offset += pagesPerBatch) {
      const batchItems = items.slice(offset, offset + pagesPerBatch);
      const pageBatch = batchItems.map((b) => b.pageNumber);
      const jobId = `luna-${patentId}-p${pageBatch[0]}-${pageBatch[pageBatch.length - 1]}`;

      const request: LunaWorkerRequest = {
        jobId,
        runId,
        model: "gpt-5.6-luna-ocr",
        patentId,
        patentNumber: patent.patentNumber,
        pdfSha256,
        pageNumbers: pageBatch,
        totalPages,
        options: {
          maxTokens: 4096,
          targetFormat: "markdown",
        },
      };

      try {
        const response = await dispatchLunaWorkerBatch(request, {
          endpoint,
          apiKey,
          timeoutMs,
          fetchFn: config.fetchFn,
        });

        for (const res of response.results) {
          if (res.ok && res.markdown) {
            writePageCheckpoint(checkpointRoot, patentId, res.pageNumber, res.markdown);
            checkpointsWritten++;
            completedKeys.add(`${patentId}:${res.pageNumber}`);
          } else {
            failedPagesCount++;
            console.error(
              `[OCR Pipeline] Failed page ${res.pageNumber} of ${patentId}: ${res.error ?? "Unknown error"}`,
            );
          }
        }
      } catch (err) {
        failedPagesCount += pageBatch.length;
        console.error(
          `[OCR Pipeline] Batch failed for ${patentId} pages ${pageBatch.join(",")}: ${(err as Error).message}`,
        );
      }
    }
  }

  // Write consolidated transcripts for all patents that had pages in scope
  const patentsInScope = new Set(scopedPages.map((p) => p.patent.id));
  for (const patentId of patentsInScope) {
    const task = patentTasks.find((t) => t.patent.id === patentId);
    if (task) {
      writePatentRunTranscript(
        runId,
        patentId,
        path.join(transcriptRoot, `${patentId}.md`),
        task.pages,
        checkpointRoot,
      );
    }
  }

  const elapsedSeconds = (Date.now() - startedAt.getTime()) / 1000;
  const completedPages = resumedPagesCount + checkpointsWritten;

  const progressData = {
    schemaVersion: 2,
    runId,
    model: LUNA_MODEL,
    startedAt: startedAt.toISOString(),
    updatedAt: new Date().toISOString(),
    status: failedPagesCount === 0 ? "completed" : "completed_with_failures",
    scope: {
      pagesPerBatch,
      pageLimit: pageLimit ?? null,
    },
    progress: {
      completedPages,
      failedPages: failedPagesCount,
      checkpointsWritten,
      resumedPages: resumedPagesCount,
      totalPages: inScopeTotalPages,
      elapsedSeconds,
    },
  };

  fs.writeFileSync(progressFile, JSON.stringify(progressData, null, 2), "utf8");

  return {
    runId,
    status: failedPagesCount === 0 ? "completed" : "completed_with_failures",
    totalPages: globalTotalPages,
    completedPages,
    failedPages: failedPagesCount,
    checkpointsWritten,
    resumedPages: resumedPagesCount,
  };
}

async function main() {
  console.log("=== Classic Patents OCR Pipeline (Cloud GPT-5.6 Luna Worker) ===");
  assertNoLocalOcr();

  const result = await runOcrPipeline();
  console.log(`Pipeline finished with status: ${result.status}`);
  if (result.blocker) {
    console.log(`Blocker: ${result.blocker.message}`);
  } else {
    console.log(
      `Pages summary: ${result.completedPages}/${result.totalPages} completed ` +
        `(${result.resumedPages} resumed, ${result.checkpointsWritten} newly checkpointed, ${result.failedPages} failed).`,
    );
  }
}

if (import.meta.main) {
  main().catch((err) => {
    console.error("OCR Pipeline fatal error:", err);
    process.exit(1);
  });
}
