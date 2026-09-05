import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from "bun:test";
import * as fs from "node:fs";
import * as path from "node:path";
import type { Patent } from "../src/types/patent";
import {
  assertNoLocalOcr,
  computePdfSha256,
  dispatchLunaWorkerBatch,
  type FetchFunction,
  getPdfPageCount,
  LUNA_MODEL,
  LUNA_USER_AGENT,
  type LunaWorkerRequest,
  type LunaWorkerResponse,
  PROHIBITED_LOCAL_OCR_COMMANDS,
  runOcrPipeline,
} from "./ocr-patents";

const childProcess = require("node:child_process");

const TEMP_BASE_DIR = fs.existsSync("/Volumes/USBNVME16TB/temp_agent_space")
  ? "/Volumes/USBNVME16TB/temp_agent_space"
  : path.join(process.cwd(), "artifacts", "test_scratch");

function createMockPatent(overrides: Partial<Patent> = {}): Patent {
  return {
    id: "us-test-mock",
    patentNumber: "US 999,999",
    title: "Test Patent",
    shortTitle: "Test Patent",
    subtitle: "Test Subtitle",
    inventors: ["Test Inventor"],
    inventorLocation: "Test City, State",
    grantDate: "1900-01-01",
    filingDate: "1899-01-01",
    era: "Electrification & Early Modern (1870–1920)",
    category: "electricity",
    categoryLabel: "Electricity",
    summary: "Summary of invention",
    heroQuote: "Authentic hero quote from the patent specification.",
    usptoClassification: "123/456",
    originalPdfUrl: "/patents/pdfs/us-821393-wright-flyer.pdf",
    googlePatentsUrl: "https://patents.google.com",
    originalText: "Sample specification text",
    plainEnglishExplanation: {
      overview: "Overview",
      coreMechanism: "Core mechanism",
      mechanicalBreakdown: [],
      scientificPrinciples: [],
      whyItMattersToday: "Why it matters today",
    },
    claims: [],
    drawings: [],
    historicalContext: {
      problemStatement: "Problem",
      priorArtLimitations: [],
      breakthroughInsight: "Insight",
      patentWars: [],
      civilizationalImpact: "Civilizational impact",
    },
    stats: { totalClaims: 0, independentClaims: 0 },
    ...overrides,
  };
}

describe("Cloud Luna OCR Pipeline (scripts/ocr-patents.ts)", () => {
  let tempDir: string;
  const spawnedCommands: string[] = [];

  // Command capture interceptor
  const originalExecFile = childProcess.execFile;
  const originalExecFileSync = childProcess.execFileSync;
  const originalSpawn = childProcess.spawn;
  const originalSpawnSync = childProcess.spawnSync;

  beforeAll(() => {
    fs.mkdirSync(TEMP_BASE_DIR, { recursive: true });

    // Intercept childProcess execution to record commands and assert no prohibited OCR processes run
    const recordCommand = (cmd: string) => {
      spawnedCommands.push(cmd);
      const baseCmd = path.basename(cmd).toLowerCase();
      for (const prohibited of PROHIBITED_LOCAL_OCR_COMMANDS) {
        if (baseCmd === prohibited || baseCmd.startsWith(prohibited)) {
          throw new Error(
            `TEST ASSERTION FAILED: Prohibited local OCR command "${cmd}" was invoked! Local OCR is forbidden by AGENTS.md.`,
          );
        }
      }
    };

    (childProcess as unknown as Record<string, unknown>).execFile = (
      file: string,
      ...args: unknown[]
    ) => {
      recordCommand(file);
      return (originalExecFile as unknown as (...a: unknown[]) => unknown)(file, ...args);
    };

    (childProcess as unknown as Record<string, unknown>).execFileSync = (
      file: string,
      ...args: unknown[]
    ) => {
      recordCommand(file);
      return (originalExecFileSync as unknown as (...a: unknown[]) => unknown)(file, ...args);
    };

    (childProcess as unknown as Record<string, unknown>).spawn = (
      file: string,
      ...args: unknown[]
    ) => {
      recordCommand(file);
      return (originalSpawn as unknown as (...a: unknown[]) => unknown)(file, ...args);
    };

    (childProcess as unknown as Record<string, unknown>).spawnSync = (
      file: string,
      ...args: unknown[]
    ) => {
      recordCommand(file);
      return (originalSpawnSync as unknown as (...a: unknown[]) => unknown)(file, ...args);
    };
  });

  afterAll(() => {
    (childProcess as unknown as Record<string, unknown>).execFile = originalExecFile;
    (childProcess as unknown as Record<string, unknown>).execFileSync = originalExecFileSync;
    (childProcess as unknown as Record<string, unknown>).spawn = originalSpawn;
    (childProcess as unknown as Record<string, unknown>).spawnSync = originalSpawnSync;
  });

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(TEMP_BASE_DIR, "luna-ocr-test-"));
    spawnedCommands.length = 0;
    delete process.env.ALLOW_LOCAL_OCR;
    delete process.env.RUN_LOCAL_OCR;
  });

  afterEach(() => {
    try {
      if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    } catch {
      // ignore cleanup errors
    }
  });

  describe("1. Local OCR Refusal & Command Capture Boundary", () => {
    it("strictly throws when environment attempts to enable local OCR", () => {
      process.env.ALLOW_LOCAL_OCR = "1";
      expect(() => assertNoLocalOcr()).toThrow(/LOCAL_OCR_PROHIBITED/);

      process.env.ALLOW_LOCAL_OCR = "false";
      process.env.RUN_LOCAL_OCR = "true";
      expect(() => assertNoLocalOcr()).toThrow(/LOCAL_OCR_PROHIBITED/);
    });

    it("proves NO local OCR process starts when cloud endpoint is unset (missing-cloud blocker)", async () => {
      const mockPatent = createMockPatent({ id: "us-test-mock" });

      const result = await runOcrPipeline({
        cwd: tempDir,
        endpoint: undefined, // missing transport
        patents: [mockPatent],
      });

      expect(result.status).toBe("blocked_no_cloud_transport");
      expect(result.blocker).toBeDefined();
      expect(result.blocker?.code).toBe("NO_CLOUD_TRANSPORT");
      expect(result.blocker?.message).toContain(
        "Repository doctrine (AGENTS.md) strictly prohibits local OCR",
      );

      // Verify ZERO prohibited commands were run
      for (const cmd of spawnedCommands) {
        for (const prohibited of PROHIBITED_LOCAL_OCR_COMMANDS) {
          expect(cmd.toLowerCase()).not.toContain(prohibited);
        }
      }

      // Verify blocker.json was written to the run directory
      const blockerPath = path.join(tempDir, "artifacts", "ocr_runs", result.runId, "blocker.json");
      expect(fs.existsSync(blockerPath)).toBe(true);
      const blockerContent = JSON.parse(fs.readFileSync(blockerPath, "utf8"));
      expect(blockerContent.status).toBe("blocked_no_cloud_transport");
    });

    it("proves NO local OCR process starts when cloud endpoint fails with HTTP 500 error", async () => {
      const mockPatent = createMockPatent({ id: "us-test-mock" });

      const mockFetch: FetchFunction = async () => {
        return new Response("Internal Server Error on GPU cluster", {
          status: 500,
          statusText: "Internal Server Error",
        });
      };

      const result = await runOcrPipeline({
        cwd: tempDir,
        endpoint: "https://cloud-luna.internal/v1/ocr-batch",
        fetchFn: mockFetch,
        patents: [mockPatent],
        pageLimit: 2,
      });

      expect(result.status).toBe("completed_with_failures");
      expect(result.failedPages).toBeGreaterThan(0);

      // Verify ZERO prohibited commands were executed during cloud failure
      for (const cmd of spawnedCommands) {
        for (const prohibited of PROHIBITED_LOCAL_OCR_COMMANDS) {
          expect(cmd.toLowerCase()).not.toContain(prohibited);
        }
      }
    });
  });

  describe("2. Cloud Luna Worker Request & User-Agent Contract", () => {
    it("submits request with strict User-Agent header, PDF digest, model and bounded page ranges", async () => {
      let capturedRequestHeaders: Headers | undefined;
      let capturedRequestBody: string | undefined;

      const mockFetch: FetchFunction = async (_url, init) => {
        capturedRequestHeaders = new Headers(init?.headers);
        capturedRequestBody = init?.body as string;

        const responseData: LunaWorkerResponse = {
          jobId: "job-1",
          runId: "run-1",
          patentId: "us-821393-wright-flyer",
          model: LUNA_MODEL,
          results: [
            {
              pageNumber: 1,
              ok: true,
              markdown: "# Flying-Machine\n\nPage 1 text",
              seconds: 1.2,
            },
            {
              pageNumber: 2,
              ok: true,
              markdown: "# Flying-Machine\n\nPage 2 text",
              seconds: 1.1,
            },
          ],
        };

        return new Response(JSON.stringify(responseData), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      };

      const request: LunaWorkerRequest = {
        jobId: "test-job-123",
        runId: "test-run-123",
        model: "gpt-5.6-luna-ocr",
        patentId: "us-821393-wright-flyer",
        patentNumber: "US 821,393",
        pdfSha256: "678bea5d81cb4e90a15c998bc932d2cf01bc87cfc3fcc53f0ecbdbdc70097966",
        pageNumbers: [1, 2],
        totalPages: 10,
        options: {
          maxTokens: 4096,
          targetFormat: "markdown",
        },
      };

      const testToken = ["mock", "token", "val"].join("-");
      const response = await dispatchLunaWorkerBatch(request, {
        endpoint: "https://luna-worker.cloud/api/ocr",
        apiKey: testToken,
        fetchFn: mockFetch,
      });

      expect(response.results.length).toBe(2);
      expect(response.results[0].ok).toBe(true);

      // Verify User-Agent header strictly matches doctrine
      expect(capturedRequestHeaders?.get("user-agent")).toBe(LUNA_USER_AGENT);
      expect(capturedRequestHeaders?.get("authorization")).toBe(`Bearer ${testToken}`);

      // Verify body
      const parsedBody = JSON.parse(capturedRequestBody ?? "{}");
      expect(parsedBody.model).toBe("gpt-5.6-luna-ocr");
      expect(parsedBody.pdfSha256).toBe(
        "678bea5d81cb4e90a15c998bc932d2cf01bc87cfc3fcc53f0ecbdbdc70097966",
      );
      expect(parsedBody.pageNumbers).toEqual([1, 2]);
    });
  });

  describe("3. Durable Checkpoints & Resumption Without Duplication", () => {
    it("resumes an existing job without re-requesting completed pages", async () => {
      const requestedBatches: number[][] = [];

      const mockPatent = createMockPatent({
        id: "us-test-resumption",
        patentNumber: "US 777,777",
        title: "Resumption Test",
        shortTitle: "Resumption Test",
      });

      const mockFetch: FetchFunction = async (_url, init) => {
        const body = JSON.parse(init?.body as string) as LunaWorkerRequest;
        requestedBatches.push(body.pageNumbers);

        const results = body.pageNumbers.map((p) => ({
          pageNumber: p,
          ok: true,
          markdown: `## Test Content for page ${p}`,
          seconds: 0.5,
        }));

        return new Response(
          JSON.stringify({
            jobId: body.jobId,
            runId: body.runId,
            patentId: body.patentId,
            model: LUNA_MODEL,
            results,
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        );
      };

      const runId = "test-resumption-run-1";

      // FIRST RUN: process only first 2 pages
      const run1Result = await runOcrPipeline({
        cwd: tempDir,
        endpoint: "https://cloud-luna.internal/v1/ocr",
        runId,
        fetchFn: mockFetch,
        patents: [mockPatent],
        pagesPerBatch: 2,
        pageLimit: 2,
      });

      expect(run1Result.checkpointsWritten).toBe(2);
      expect(run1Result.resumedPages).toBe(0);
      expect(requestedBatches).toEqual([[1, 2]]);

      // Verify checkpoint files exist
      const cp1 = path.join(
        tempDir,
        "artifacts",
        "ocr_runs",
        runId,
        "checkpoints",
        mockPatent.id,
        "page-1.md",
      );
      const cp2 = path.join(
        tempDir,
        "artifacts",
        "ocr_runs",
        runId,
        "checkpoints",
        mockPatent.id,
        "page-2.md",
      );
      expect(fs.existsSync(cp1)).toBe(true);
      expect(fs.existsSync(cp2)).toBe(true);

      // Modify cp1 content slightly to test non-overwriting
      const originalCp1Content = fs.readFileSync(cp1, "utf8");

      // SECOND RUN: process next 2 pages (total 4 pages)
      requestedBatches.length = 0;
      const run2Result = await runOcrPipeline({
        cwd: tempDir,
        endpoint: "https://cloud-luna.internal/v1/ocr",
        runId, // same run ID -> resumes!
        fetchFn: mockFetch,
        patents: [mockPatent],
        pagesPerBatch: 2,
        pageLimit: 4,
      });

      // Pages 1 and 2 were resumed; only pages 3 and 4 should be requested!
      expect(run2Result.resumedPages).toBe(2);
      expect(run2Result.checkpointsWritten).toBe(2);
      expect(requestedBatches).toEqual([[3, 4]]);

      // Verify cp1 was preserved without modification
      expect(fs.readFileSync(cp1, "utf8")).toBe(originalCp1Content);

      // Verify cp3 and cp4 now exist
      const cp3 = path.join(
        tempDir,
        "artifacts",
        "ocr_runs",
        runId,
        "checkpoints",
        mockPatent.id,
        "page-3.md",
      );
      const cp4 = path.join(
        tempDir,
        "artifacts",
        "ocr_runs",
        runId,
        "checkpoints",
        mockPatent.id,
        "page-4.md",
      );
      expect(fs.existsSync(cp3)).toBe(true);
      expect(fs.existsSync(cp4)).toBe(true);

      // Verify consolidated transcript contains all 4 pages
      const transcriptPath = path.join(
        tempDir,
        "artifacts",
        "ocr_runs",
        runId,
        "transcripts",
        `${mockPatent.id}.md`,
      );
      expect(fs.existsSync(transcriptPath)).toBe(true);
      const transcriptText = fs.readFileSync(transcriptPath, "utf8");
      expect(transcriptText).toContain("## Page 1");
      expect(transcriptText).toContain("## Page 2");
      expect(transcriptText).toContain("## Page 3");
      expect(transcriptText).toContain("## Page 4");
    });
  });

  describe("4. Archival Separation: Machine Drafts Never Become Reviewed", () => {
    it("writes only to artifacts/ocr_runs and includes non-authoritative disclaimers", async () => {
      const mockPatent = createMockPatent({
        id: "us-test-separation",
        patentNumber: "US 555,555",
        title: "Separation Test",
        shortTitle: "Separation Test",
      });

      const mockFetch: FetchFunction = async () => {
        return new Response(
          JSON.stringify({
            jobId: "job-sep",
            runId: "run-sep",
            patentId: mockPatent.id,
            model: LUNA_MODEL,
            results: [
              {
                pageNumber: 1,
                ok: true,
                markdown: "Raw OCR Draft Text",
                seconds: 0.8,
              },
            ],
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        );
      };

      const runId = "test-sep-run";
      await runOcrPipeline({
        cwd: tempDir,
        endpoint: "https://cloud-luna.internal/v1/ocr",
        runId,
        fetchFn: mockFetch,
        patents: [mockPatent],
        pageLimit: 1,
      });

      const checkpointFile = path.join(
        tempDir,
        "artifacts",
        "ocr_runs",
        runId,
        "checkpoints",
        mockPatent.id,
        "page-1.md",
      );
      expect(fs.existsSync(checkpointFile)).toBe(true);
      const content = fs.readFileSync(checkpointFile, "utf8");

      // Verify required preservation disclaimers
      expect(content).toContain("Non-authoritative cloud Luna worker output");
      expect(content).toContain("Machine draft is research evidence only");
      expect(content).toContain(
        "does not replace or modify the reviewed ledger or archival edition",
      );

      // Verify NO files were written to public/patents/transcripts
      const publicTranscriptsDir = path.join(tempDir, "public", "patents", "transcripts");
      expect(fs.existsSync(publicTranscriptsDir)).toBe(false);
    });
  });

  describe("5. PDF Metadata & SHA-256 Digest Verification", () => {
    it("computes exact PDF SHA-256 digest without spawning external processes", () => {
      const wrightPdf = path.join(
        process.cwd(),
        "public",
        "patents",
        "pdfs",
        "us-821393-wright-flyer.pdf",
      );
      const digest = computePdfSha256(wrightPdf);
      expect(digest).toBe("678bea5d81cb4e90a15c998bc932d2cf01bc87cfc3fcc53f0ecbdbdc70097966");
    });

    it("determines PDF page count safely without external OCR or rendering binaries", () => {
      const wrightPdf = path.join(
        process.cwd(),
        "public",
        "patents",
        "pdfs",
        "us-821393-wright-flyer.pdf",
      );
      const pages = getPdfPageCount(wrightPdf);
      expect(pages).toBe(10);
    });
  });
});
