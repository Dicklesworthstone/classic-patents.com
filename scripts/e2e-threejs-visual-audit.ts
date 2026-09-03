/**
 * Production-browser evidence capture for every dispatched Three.js patent face.
 *
 * This complements the semantic vertical-slice runner with image evidence for
 * human/vision review. It never starts a server and never removes prior runs.
 *
 * Examples:
 *   E2E_BASE_URL=http://127.0.0.1:3391 bun scripts/e2e-threejs-visual-audit.ts
 *   THREEJS_AUDIT_PATENTS=gb-1306-watt-rotary-engine THREEJS_AUDIT_VIEWPORTS=desktop,phone \
 *     bun scripts/e2e-threejs-visual-audit.ts
 *
 * Draw calls are enforced by default because they are scene-deterministic.
 * Use THREEJS_AUDIT_ENFORCE_DRAW_CALLS=0 only for diagnostic capture. Host-
 * sensitive first-render and CPU-submit timing remain opt-in through
 * THREEJS_AUDIT_ENFORCE_BUDGETS=1.
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { type Browser, chromium, type Page } from "playwright";
import { allPatents } from "../src/data/patents";
import { EXTERNAL_RUNTIME_OWNER_PATENT_IDS } from "../src/physics/coverageManifest";
import {
  finiteNumber,
  type PerformanceCacheState,
  summarizeThreePerformanceSamples,
  type ThreePerformanceSample,
  validateThreePerformanceBudget,
} from "./threejs-audit-performance";

const BASE_URL = process.env.E2E_BASE_URL ?? "http://127.0.0.1:3088";
const OUTPUT_ROOT = path.resolve(
  process.env.THREEJS_AUDIT_OUTPUT ?? "artifacts/e2e-threejs-visual-audit",
);
const RUN_ID = `${new Date().toISOString().replaceAll(":", "-")}__${process.pid}`;
const RUN_DIRECTORY = path.join(OUTPUT_ROOT, RUN_ID);
const SCREENSHOT_DIRECTORY = path.join(RUN_DIRECTORY, "screenshots");
const TRACE_DIRECTORY = path.join(RUN_DIRECTORY, "traces");
const EVENT_PATH = path.join(RUN_DIRECTORY, "events.jsonl");
const COMMIT =
  process.env.THREEJS_AUDIT_COMMIT ?? process.env.VERCEL_GIT_COMMIT_SHA ?? "working-tree";
const FORCE_LIFECYCLE = process.env.THREEJS_AUDIT_LIFECYCLE === "1";
const TRACE_ENABLED = process.env.THREEJS_AUDIT_TRACE === "1";
const ENFORCE_TIMING_BUDGETS = process.env.THREEJS_AUDIT_ENFORCE_BUDGETS === "1";
const ENFORCE_DRAW_CALL_BUDGET = process.env.THREEJS_AUDIT_ENFORCE_DRAW_CALLS !== "0";
const MAX_FIRST_RENDER_MS = Number(process.env.THREEJS_AUDIT_MAX_FIRST_RENDER_MS ?? 1_000);
const MAX_CPU_SUBMIT_MS = Number(process.env.THREEJS_AUDIT_MAX_CPU_SUBMIT_MS ?? 16.7);
const MAX_DRAW_CALLS = Number(process.env.THREEJS_AUDIT_MAX_DRAW_CALLS ?? 250);
const PERFORMANCE_SAMPLE_COUNT = Math.max(
  0,
  Math.floor(Number(process.env.THREEJS_AUDIT_PERF_SAMPLES ?? 0)),
);
const PERFORMANCE_SUMMARY_PATH = path.join(RUN_DIRECTORY, "performance-summary.json");
const OWNER_MANAGED_PATENT_IDS = new Set<string>(EXTERNAL_RUNTIME_OWNER_PATENT_IDS);

const VIEWPORTS = {
  desktop: { width: 1440, height: 900 },
  tablet: { width: 768, height: 1024 },
  phone375: { width: 375, height: 812 },
  phone: { width: 320, height: 800 },
} as const;

type ViewportName = keyof typeof VIEWPORTS;
type AuditStatus = "pass" | "fail" | "info";

interface RuntimeDiagnostics {
  consoleErrors: string[];
  pageErrors: string[];
  networkErrors: string[];
}

interface AuditEvent {
  schemaVersion: 1;
  runId: string;
  sequence: number;
  timestamp: string;
  patentId: string;
  route: string;
  viewport: ViewportName;
  action: string;
  status: AuditStatus;
  durationMs: number;
  expected: unknown;
  actual: unknown;
  screenshotPath: string | null;
  diagnostics: RuntimeDiagnostics;
}

fs.mkdirSync(SCREENSHOT_DIRECTORY, { recursive: true });
fs.mkdirSync(TRACE_DIRECTORY, { recursive: true });
let sequence = 0;
let failureCount = 0;
const performanceSamples: ThreePerformanceSample[] = [];

function csvSet(value: string | undefined): Set<string> | null {
  if (!value?.trim()) return null;
  return new Set(
    value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
  );
}

const requestedPatentIds = csvSet(process.env.THREEJS_AUDIT_PATENTS);
const requestedViewportNames = csvSet(process.env.THREEJS_AUDIT_VIEWPORTS);
const registeredPatentIds = new Set(allPatents.map((patent) => patent.id));
const supportedViewportNames = new Set(Object.keys(VIEWPORTS));
const missingRequestedPatentIds = requestedPatentIds
  ? [...requestedPatentIds].filter((id) => !registeredPatentIds.has(id))
  : [];
const missingRequestedViewportNames = requestedViewportNames
  ? [...requestedViewportNames].filter((name) => !supportedViewportNames.has(name))
  : [];
const patents = requestedPatentIds
  ? allPatents.filter((patent) => requestedPatentIds.has(patent.id))
  : allPatents;
const viewportNames = (Object.keys(VIEWPORTS) as ViewportName[]).filter(
  (name) => !requestedViewportNames || requestedViewportNames.has(name),
);

function emit(
  event: Omit<AuditEvent, "schemaVersion" | "runId" | "sequence" | "timestamp">,
): AuditEvent {
  const complete: AuditEvent = {
    schemaVersion: 1,
    runId: RUN_ID,
    sequence: ++sequence,
    timestamp: new Date().toISOString(),
    ...event,
  };
  fs.appendFileSync(EVENT_PATH, `${JSON.stringify(complete)}\n`, "utf8");
  if (complete.status === "fail") failureCount += 1;
  console.log(
    `[${complete.status.toUpperCase()}] ${complete.patentId} ${complete.viewport} ${complete.action} (${complete.durationMs}ms)`,
  );
  return complete;
}

function diagnosticsFor(page: Page): RuntimeDiagnostics {
  const diagnostics: RuntimeDiagnostics = {
    consoleErrors: [],
    pageErrors: [],
    networkErrors: [],
  };
  page.on("console", (message) => {
    if (message.type() === "error" && !message.text().includes("favicon")) {
      diagnostics.consoleErrors.push(message.text());
    }
  });
  page.on("pageerror", (error) => diagnostics.pageErrors.push(error.message));
  page.on("requestfailed", (request) => {
    diagnostics.networkErrors.push(
      `${request.method()} ${request.url()} :: ${request.failure()?.errorText ?? "unknown failure"}`,
    );
  });
  page.on("response", (response) => {
    if (response.status() >= 400) {
      diagnostics.networkErrors.push(`${response.status()} ${response.url()}`);
    }
  });
  return diagnostics;
}

async function captureFailure(page: Page, patentId: string, viewport: ViewportName) {
  const screenshotPath = path.join(SCREENSHOT_DIRECTORY, `${patentId}.${viewport}.failure.png`);
  await page.screenshot({ path: screenshotPath, fullPage: true }).catch(() => undefined);
  return screenshotPath;
}

async function runtimeOwnerSnapshot(page: Page, patentId: string) {
  return page.evaluate((id) => {
    const owner = document.querySelector(
      `[data-testid="patent-physics-runtime-owner"][data-patent-id="${id}"]`,
    );
    if (!(owner instanceof HTMLElement)) return null;
    return Object.fromEntries(
      Array.from(owner.attributes)
        .filter((attribute) => attribute.name.startsWith("data-"))
        .map((attribute) => [attribute.name, attribute.value]),
    );
  }, patentId);
}

async function browserPerformanceSnapshot(page: Page, patentId: string) {
  return page.evaluate(
    ({ id, commit }) => {
      const root = document.querySelector(
        `[data-testid="patent-visual-dispatcher"][data-patent-id="${id}"]`,
      );
      const canvas = root?.querySelector("canvas");
      const canvasBounds = canvas?.getBoundingClientRect();
      const navigation = performance.getEntriesByType("navigation")[0] as
        | PerformanceNavigationTiming
        | undefined;
      const memory = (
        performance as Performance & {
          memory?: { usedJSHeapSize: number; totalJSHeapSize: number; jsHeapSizeLimit: number };
        }
      ).memory;
      const renderer = canvas instanceof HTMLCanvasElement ? { ...canvas.dataset } : null;
      return {
        commit,
        userAgent: navigator.userAgent,
        devicePixelRatio: window.devicePixelRatio,
        navigation: navigation
          ? {
              responseEndMs: navigation.responseEnd,
              domInteractiveMs: navigation.domInteractive,
              domContentLoadedMs: navigation.domContentLoadedEventEnd,
              loadEventMs: navigation.loadEventEnd,
            }
          : null,
        heap: memory
          ? {
              usedJSHeapSize: memory.usedJSHeapSize,
              totalJSHeapSize: memory.totalJSHeapSize,
              jsHeapSizeLimit: memory.jsHeapSizeLimit,
            }
          : null,
        renderer,
        canvasBounds: canvasBounds
          ? {
              x: canvasBounds.x,
              y: canvasBounds.y,
              width: canvasBounds.width,
              height: canvasBounds.height,
            }
          : null,
      };
    },
    { id: patentId, commit: COMMIT },
  );
}

async function prepareThreePerformancePage(page: Page, patentId: string) {
  const route = `/patents/${patentId}`;
  const startedAt = performance.now();
  const response = await page.goto(`${BASE_URL}${route}`, {
    waitUntil: "domcontentloaded",
    timeout: 30_000,
  });
  if (response?.status() !== 200) {
    throw new Error(`Expected HTTP 200, received ${response?.status() ?? "no response"}.`);
  }
  const navigationMs = Math.round(performance.now() - startedAt);
  const threeDimensionalButton = page.locator(
    'button[title="Interactive 3D Simulator (Shortcut: 3)"]',
  );
  await threeDimensionalButton.waitFor({ state: "visible", timeout: 20_000 });
  await threeDimensionalButton.click();

  const dispatcher = page
    .locator(`[data-testid="patent-visual-dispatcher"][data-patent-id="${patentId}"]`)
    .first();
  await dispatcher.waitFor({ state: "visible", timeout: 20_000 });
  await dispatcher.scrollIntoViewIfNeeded();
  const surface = dispatcher.getByTestId("patent-visual-surface");
  await surface.waitFor({ state: "visible", timeout: 20_000 });
  const mode = await surface.getAttribute("data-render-mode");
  if (mode !== "3d-physics") throw new Error(`Expected 3d-physics surface, received ${mode}.`);
  await page.waitForFunction(
    ({ id }) => {
      const selectedSurface = document.querySelector(
        `[data-testid="patent-visual-dispatcher"][data-patent-id="${id}"] [data-testid="patent-visual-surface"]`,
      );
      return Boolean(
        selectedSurface?.querySelector('[data-testid="three-d-source-boundary"], canvas'),
      );
    },
    { id: patentId },
    { timeout: 20_000 },
  );
  if ((await surface.getByTestId("three-d-source-boundary").count()) > 0) {
    throw new Error("Performance sampling requires a rendered Three.js surface.");
  }

  const canvas = surface.locator("canvas").first();
  await canvas.waitFor({ state: "visible", timeout: 20_000 });
  await page.waitForFunction(
    ({ id }) => {
      const candidate = document.querySelector(
        `[data-testid="patent-visual-dispatcher"][data-patent-id="${id}"] canvas`,
      );
      return Boolean(
        candidate instanceof HTMLCanvasElement && candidate.width > 1 && candidate.height > 1,
      );
    },
    { id: patentId },
    { timeout: 20_000 },
  );
  const canvasReadyMs = Math.round(performance.now() - startedAt);
  await page.waitForFunction(
    ({ id }) => {
      const candidate = document.querySelector(
        `[data-testid="patent-visual-dispatcher"][data-patent-id="${id}"] canvas`,
      );
      return Number((candidate as HTMLCanvasElement | null)?.dataset.threeFrameCount ?? 0) >= 5;
    },
    { id: patentId },
    // A loaded catalogue page can briefly contend with font/layout and shader
    // work on CI. Requiring five distinct renderer receipts still proves a
    // live loop; ten seconds avoids misclassifying a fully rendered scene as
    // dead merely because those receipts arrived slowly.
    { timeout: 10_000 },
  );
  const rendererSampleReadyMs = Math.round(performance.now() - startedAt);
  return {
    route,
    navigationMs,
    canvasReadyMs,
    rendererSampleReadyMs,
    receipt: await browserPerformanceSnapshot(page, patentId),
  };
}

async function collectPerformanceSample(
  page: Page,
  patentId: string,
  viewport: ViewportName,
  cacheState: PerformanceCacheState,
  sampleIndex: number,
  tracePath: string | null,
) {
  const diagnostics = diagnosticsFor(page);
  const startedAt = performance.now();
  try {
    const prepared = await prepareThreePerformancePage(page, patentId);
    const renderer = prepared.receipt.renderer as Record<string, string> | null;
    const sample: ThreePerformanceSample = {
      patentId,
      viewport,
      cacheState,
      measurementMode: TRACE_ENABLED ? "trace-active-diagnostic" : "clean",
      commit: prepared.receipt.commit,
      userAgent: prepared.receipt.userAgent,
      devicePixelRatio: prepared.receipt.devicePixelRatio,
      sampleIndex,
      navigationMs: finiteNumber(prepared.navigationMs),
      canvasReadyMs: finiteNumber(prepared.canvasReadyMs),
      rendererSampleReadyMs: finiteNumber(prepared.rendererSampleReadyMs),
      firstRenderMs: finiteNumber(renderer?.threeFirstRenderMs),
      cpuSubmitMs: finiteNumber(renderer?.threeCpuSubmitMs),
      drawCalls: finiteNumber(renderer?.threeDrawCalls),
      triangles: finiteNumber(renderer?.threeTriangles),
      usedJsHeapBytes: finiteNumber(prepared.receipt.heap?.usedJSHeapSize),
    };
    performanceSamples.push(sample);
    const requiredMetricsValid =
      sample.firstRenderMs !== null && sample.cpuSubmitMs !== null && sample.drawCalls !== null;
    const runtimeErrors =
      diagnostics.consoleErrors.length +
      diagnostics.pageErrors.length +
      diagnostics.networkErrors.length;
    emit({
      patentId,
      route: prepared.route,
      viewport,
      action: "performance-sample",
      status: requiredMetricsValid && runtimeErrors === 0 ? "pass" : "fail",
      durationMs: Math.round(performance.now() - startedAt),
      expected: {
        cacheState,
        sampleIndex,
        measurementMode: sample.measurementMode,
        rendererSampleAtOrAfterFrame: 5,
        finiteFirstRenderCpuSubmitAndDrawCalls: true,
        runtimeErrors: 0,
      },
      actual: { sample, receipt: prepared.receipt, tracePath },
      screenshotPath: null,
      diagnostics,
    });
  } catch (error) {
    emit({
      patentId,
      route: `/patents/${patentId}`,
      viewport,
      action: "performance-sample",
      status: "fail",
      durationMs: Math.round(performance.now() - startedAt),
      expected: { cacheState, sampleIndex, finiteRendererReceipt: true },
      actual: error instanceof Error ? error.message : String(error),
      screenshotPath: null,
      diagnostics,
    });
  }
}

function contextOptions(viewportName: ViewportName) {
  return {
    viewport: VIEWPORTS[viewportName],
    deviceScaleFactor: 1,
    reducedMotion:
      viewportName === "phone" || viewportName === "phone375"
        ? ("reduce" as const)
        : ("no-preference" as const),
  };
}

async function withOptionalTrace<T>(
  context: Awaited<ReturnType<Browser["newContext"]>>,
  tracePath: string | null,
  operation: () => Promise<T>,
): Promise<T> {
  if (tracePath) {
    await context.tracing.start({ screenshots: true, snapshots: true, sources: false });
  }
  try {
    return await operation();
  } finally {
    if (tracePath) await context.tracing.stop({ path: tracePath }).catch(() => undefined);
  }
}

async function collectPerformanceDistributions(browser: Browser) {
  if (PERFORMANCE_SAMPLE_COUNT === 0) return;
  for (const viewportName of viewportNames) {
    for (const patent of patents) {
      for (let sampleIndex = 1; sampleIndex <= PERFORMANCE_SAMPLE_COUNT; sampleIndex += 1) {
        const context = await browser.newContext(contextOptions(viewportName));
        const page = await context.newPage();
        const tracePath = TRACE_ENABLED
          ? path.join(
              TRACE_DIRECTORY,
              `${patent.id}.${viewportName}.context-cold.${sampleIndex}.zip`,
            )
          : null;
        try {
          await withOptionalTrace(context, tracePath, () =>
            collectPerformanceSample(
              page,
              patent.id,
              viewportName,
              "context-cold",
              sampleIndex,
              tracePath,
            ),
          );
        } finally {
          await page.close().catch(() => undefined);
          await context.close().catch(() => undefined);
        }
      }

      const warmContext = await browser.newContext(contextOptions(viewportName));
      try {
        const primingPage = await warmContext.newPage();
        try {
          await prepareThreePerformancePage(primingPage, patent.id);
        } finally {
          await primingPage.close().catch(() => undefined);
        }
        for (let sampleIndex = 1; sampleIndex <= PERFORMANCE_SAMPLE_COUNT; sampleIndex += 1) {
          const page = await warmContext.newPage();
          const tracePath = TRACE_ENABLED
            ? path.join(
                TRACE_DIRECTORY,
                `${patent.id}.${viewportName}.context-warm.${sampleIndex}.zip`,
              )
            : null;
          try {
            await withOptionalTrace(warmContext, tracePath, () =>
              collectPerformanceSample(
                page,
                patent.id,
                viewportName,
                "context-warm",
                sampleIndex,
                tracePath,
              ),
            );
          } finally {
            await page.close().catch(() => undefined);
          }
        }
      } finally {
        await warmContext.close().catch(() => undefined);
      }
    }
  }
}

async function auditPatent(
  page: Page,
  patentId: string,
  viewport: ViewportName,
  tracePath: string | null,
) {
  const route = `/patents/${patentId}`;
  const diagnostics = diagnosticsFor(page);
  const startedAt = performance.now();
  const milestones: Record<string, number> = {};
  let screenshotPath: string | null = null;

  try {
    const response = await page.goto(`${BASE_URL}${route}`, {
      waitUntil: "domcontentloaded",
      timeout: 30_000,
    });
    if (response?.status() !== 200) {
      throw new Error(`Expected HTTP 200, received ${response?.status() ?? "no response"}.`);
    }
    milestones.navigationMs = Math.round(performance.now() - startedAt);

    // Do not screenshot or interrogate dynamically selected faces while React
    // is still reconciling the server tree. Playwright temporarily hides text
    // carets during screenshots; capturing before this receipt can itself
    // create a misleading hydration warning on otherwise valid markup.
    await page.waitForFunction(
      () =>
        document
          .querySelector('[data-testid="dual-projection-viewer"]')
          ?.getAttribute("data-hydrated") === "true",
      undefined,
      { timeout: 20_000 },
    );

    // A source-integrity hold is an intentional public refusal, not a failed
    // Three.js load. It must be verified before looking for the 3D face
    // selector: an honest held record deliberately offers no simulator mode.
    const sourceIntegrityHold = page.locator('[aria-labelledby="source-visual-unavailable-title"]');
    if ((await sourceIntegrityHold.count()) > 0) {
      await sourceIntegrityHold.waitFor({ state: "visible", timeout: 20_000 });
      const dispatcher = page
        .locator(`[data-testid="patent-visual-dispatcher"][data-patent-id="${patentId}"]`)
        .first();
      await dispatcher.waitFor({ state: "visible", timeout: 20_000 });
      await dispatcher.scrollIntoViewIfNeeded();

      const holdScreenshotPath = path.join(
        SCREENSHOT_DIRECTORY,
        `${patentId}.${viewport}.source-integrity-hold.png`,
      );
      await dispatcher.screenshot({ path: holdScreenshotPath });
      screenshotPath = holdScreenshotPath;

      const heading = await sourceIntegrityHold
        .locator("#source-visual-unavailable-title")
        .textContent();
      const holdText = await sourceIntegrityHold.innerText();
      const canvasCount = await dispatcher.locator("canvas").count();
      const simulatorSelectorCount = await page
        .locator('button[title="Interactive 3D Simulator (Shortcut: 3)"]')
        .count();
      const errors =
        diagnostics.consoleErrors.length +
        diagnostics.pageErrors.length +
        diagnostics.networkErrors.length;
      const valid =
        canvasCount === 0 &&
        simulatorSelectorCount === 0 &&
        Boolean(heading?.trim().length) &&
        holdText.toLowerCase().includes("source-integrity hold") &&
        errors === 0;

      emit({
        patentId,
        route,
        viewport,
        action: "source-integrity-hold",
        status: valid ? "pass" : "fail",
        durationMs: Math.round(performance.now() - startedAt),
        expected: {
          explicitSourceIntegrityHold: true,
          inventedCanvas: false,
          simulatorSelector: false,
          runtimeErrors: 0,
        },
        actual: {
          heading,
          canvasCount,
          simulatorSelectorCount,
          holdText,
        },
        screenshotPath,
        diagnostics,
      });
      return;
    }

    const threeDimensionalButton = page.locator(
      'button[title="Interactive 3D Simulator (Shortcut: 3)"]',
    );
    await threeDimensionalButton.waitFor({ state: "visible", timeout: 20_000 });
    await threeDimensionalButton.click();
    milestones.interactiveFaceSelectedMs = Math.round(performance.now() - startedAt);

    const dispatcher = page
      .locator(`[data-testid="patent-visual-dispatcher"][data-patent-id="${patentId}"]`)
      .first();
    await dispatcher.waitFor({ state: "visible", timeout: 20_000 });
    await dispatcher.scrollIntoViewIfNeeded();
    const surface = dispatcher.getByTestId("patent-visual-surface");
    await surface.waitFor({ state: "visible", timeout: 20_000 });
    const mode = await surface.getAttribute("data-render-mode");
    if (mode !== "3d-physics") {
      throw new Error(`Expected 3d-physics surface, received ${mode}.`);
    }

    // The selected face is dynamically imported. Wait for either accepted
    // terminal state before deciding whether this route owns a canvas; a
    // synchronous count here races Haber's intentional no-drawing boundary.
    await page.waitForFunction(
      ({ id }) => {
        const selectedSurface = document.querySelector(
          `[data-testid="patent-visual-dispatcher"][data-patent-id="${id}"] [data-testid="patent-visual-surface"]`,
        );
        return Boolean(
          selectedSurface?.querySelector('[data-testid="three-d-source-boundary"], canvas'),
        );
      },
      { id: patentId },
      { timeout: 20_000 },
    );

    const sourceBoundary = surface.getByTestId("three-d-source-boundary");
    if ((await sourceBoundary.count()) > 0) {
      const boundaryScreenshotPath = path.join(
        SCREENSHOT_DIRECTORY,
        `${patentId}.${viewport}.source-boundary.png`,
      );
      await dispatcher.screenshot({ path: boundaryScreenshotPath });
      screenshotPath = boundaryScreenshotPath;

      const beforeTick = Number((await dispatcher.getAttribute("data-physics-tick")) ?? 0);
      const claimToggle = sourceBoundary.locator("button[aria-pressed]").first();
      const beforePressed = await claimToggle.getAttribute("aria-pressed");
      await claimToggle.click();
      const invertedPressed = await claimToggle.getAttribute("aria-pressed");
      await claimToggle.click();
      const restoredPressed = await claimToggle.getAttribute("aria-pressed");
      const afterTick = Number((await dispatcher.getAttribute("data-physics-tick")) ?? 0);
      const canvasCount = await surface.locator("canvas").count();
      const heading = await sourceBoundary
        .locator("#haber-3d-source-boundary-heading")
        .textContent();
      const errors =
        diagnostics.consoleErrors.length +
        diagnostics.pageErrors.length +
        diagnostics.networkErrors.length;
      const valid =
        canvasCount === 0 &&
        heading?.includes("no drawing") === true &&
        invertedPressed !== beforePressed &&
        restoredPressed === beforePressed &&
        afterTick > beforeTick &&
        errors === 0;
      const performanceReceipt = await browserPerformanceSnapshot(page, patentId);
      emit({
        patentId,
        route,
        viewport,
        action: "source-bounded-refusal",
        status: valid ? "pass" : "fail",
        durationMs: Math.round(performance.now() - startedAt),
        expected: {
          explicitSourceBoundary: true,
          inventedCanvas: false,
          claimToggleRestores: true,
          sharedPhysicsTickAdvances: true,
          runtimeErrors: 0,
        },
        actual: {
          heading,
          canvasCount,
          beforePressed,
          invertedPressed,
          restoredPressed,
          beforeTick,
          afterTick,
          performance: {
            measurementMode: TRACE_ENABLED ? "trace-active-diagnostic" : "clean",
            comparableProductionTiming: !TRACE_ENABLED,
            baseline: performanceReceipt,
          },
          tracePath,
        },
        screenshotPath,
        diagnostics,
      });
      return;
    }

    const canvas = surface.locator("canvas").first();
    await canvas.waitFor({ state: "visible", timeout: 20_000 });
    // Tall dispatchers can put a perfectly valid canvas below the viewport.
    // Several studios pause their rAF loop offscreen, so make the measured
    // surface intersect the viewport before waiting for sampled frames.
    await canvas.scrollIntoViewIfNeeded();
    await page.waitForFunction(
      ({ id }) => {
        const root = document.querySelector(
          `[data-testid="patent-visual-dispatcher"][data-patent-id="${id}"]`,
        );
        const candidate = root?.querySelector("canvas");
        return Boolean(candidate && candidate.width > 1 && candidate.height > 1);
      },
      { id: patentId },
      { timeout: 20_000 },
    );
    milestones.canvasReadyMs = Math.round(performance.now() - startedAt);
    await page.waitForFunction(
      ({ id }) => {
        const canvas = document.querySelector(
          `[data-testid="patent-visual-dispatcher"][data-patent-id="${id}"] canvas`,
        );
        return Number((canvas as HTMLCanvasElement | null)?.dataset.threeFrameCount ?? 0) >= 5;
      },
      { id: patentId },
      // Keep the same five-frame proof as the performance path, with enough
      // wall time for slower production-browser and software-WebGL runners.
      { timeout: 10_000 },
    );
    milestones.rendererSampleReadyMs = Math.round(performance.now() - startedAt);
    const baselinePerformance = await browserPerformanceSnapshot(page, patentId);

    const defaultScreenshotPath = path.join(
      SCREENSHOT_DIRECTORY,
      `${patentId}.${viewport}.default.png`,
    );
    await dispatcher.screenshot({ path: defaultScreenshotPath });
    screenshotPath = defaultScreenshotPath;
    milestones.defaultScreenshotMs = Math.round(performance.now() - startedAt);
    const baselineRenderer = baselinePerformance.renderer as Record<string, string> | null;
    const performanceBudget = {
      enforced: ENFORCE_TIMING_BUDGETS || ENFORCE_DRAW_CALL_BUDGET,
      timingEnforced: ENFORCE_TIMING_BUDGETS,
      drawCallsEnforced: ENFORCE_DRAW_CALL_BUDGET,
      maxFirstRenderMs: MAX_FIRST_RENDER_MS,
      maxCpuSubmitMs: MAX_CPU_SUBMIT_MS,
      maxDrawCalls: MAX_DRAW_CALLS,
      firstRenderMs: Number(baselineRenderer?.threeFirstRenderMs ?? Number.NaN),
      cpuSubmitMs: Number(baselineRenderer?.threeCpuSubmitMs ?? Number.NaN),
      drawCalls: Number(baselineRenderer?.threeDrawCalls ?? Number.NaN),
    };
    const performanceBudgetValid = validateThreePerformanceBudget({
      enforceTiming: ENFORCE_TIMING_BUDGETS,
      enforceDrawCalls: ENFORCE_DRAW_CALL_BUDGET,
      firstRenderMs: finiteNumber(performanceBudget.firstRenderMs),
      cpuSubmitMs: finiteNumber(performanceBudget.cpuSubmitMs),
      drawCalls: finiteNumber(performanceBudget.drawCalls),
      maxFirstRenderMs: MAX_FIRST_RENDER_MS,
      maxCpuSubmitMs: MAX_CPU_SUBMIT_MS,
      maxDrawCalls: MAX_DRAW_CALLS,
    }).valid;

    const before = await page.evaluate((id) => {
      const root = document.querySelector(
        `[data-testid="patent-visual-dispatcher"][data-patent-id="${id}"]`,
      );
      const candidate = root?.querySelector("canvas");
      const canvasElement = candidate instanceof HTMLCanvasElement ? candidate : null;
      const rectangle = canvasElement?.getBoundingClientRect();
      return {
        dispatcherTick: Number(root?.getAttribute("data-physics-tick") ?? 0),
        lastChange: root?.getAttribute("data-physics-last-change"),
        canvasCount: root?.querySelectorAll("canvas").length ?? 0,
        canvasCssWidth: rectangle?.width ?? 0,
        canvasCssHeight: rectangle?.height ?? 0,
        canvasBufferWidth: canvasElement?.width ?? 0,
        canvasBufferHeight: canvasElement?.height ?? 0,
        horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth,
      };
    }, patentId);

    const preferredRange = surface
      .locator('input[type="range"][data-audit-primary-control="true"]:not([disabled])')
      .first();
    const range =
      (await preferredRange.count()) > 0
        ? preferredRange
        : surface.locator('input[type="range"]:not([disabled])').first();
    let interaction: Record<string, unknown> = { available: false };
    let interactionValid = true;
    if ((await range.count()) > 0) {
      const priorValue = await range.inputValue();
      const accessibleName = await range.getAttribute("aria-label");
      const maxValue = await range.getAttribute("max");
      const minValue = await range.getAttribute("min");
      const moveToMinimum = maxValue !== null && Number(priorValue) === Number(maxValue);
      const requestedValue = moveToMinimum ? minValue : maxValue;
      await range.focus();
      await range.press(moveToMinimum ? "Home" : "End");
      const tickAdvanced = await page
        .waitForFunction(
          ({ id, priorTick }) => {
            const root = document.querySelector(
              `[data-testid="patent-visual-dispatcher"][data-patent-id="${id}"]`,
            );
            return Number(root?.getAttribute("data-physics-tick") ?? 0) > priorTick;
          },
          { id: patentId, priorTick: before.dispatcherTick },
          { timeout: 3_000 },
        )
        .then(() => true)
        .catch(() => false);
      // Controlled inputs may be replaced during React reconciliation. Query
      // the live element again so the audit does not read a detached handle's
      // stale pre-interaction value.
      const changedPreferredRange = surface
        .locator('input[type="range"][data-audit-primary-control="true"]:not([disabled])')
        .first();
      const changedRange =
        (await changedPreferredRange.count()) > 0
          ? changedPreferredRange
          : surface.locator('input[type="range"]:not([disabled])').first();
      const changedValue = await changedRange.inputValue();
      const changedTick = Number((await dispatcher.getAttribute("data-physics-tick")) ?? 0);
      const changedLastControl = await dispatcher.getAttribute("data-physics-last-change");
      const changedScreenshotPath = path.join(
        SCREENSHOT_DIRECTORY,
        `${patentId}.${viewport}.primary-control-max.png`,
      );
      await dispatcher.screenshot({ path: changedScreenshotPath });
      interaction = {
        available: true,
        accessibleName,
        priorValue,
        requestedValue,
        changedValue,
        priorTick: before.dispatcherTick,
        changedTick,
        changedLastControl,
        tickAdvanced,
        screenshotPath: changedScreenshotPath,
      };
      interactionValid = requestedValue !== null && changedValue !== priorValue && tickAdvanced;
    }

    const claimToggle = dispatcher.getByTestId("claim-constraint-toggle").locator("button").first();
    let claimInteraction: Record<string, unknown> = { available: false };
    let claimInteractionValid = true;
    if ((await claimToggle.count()) > 0) {
      const beforePressed = await claimToggle.getAttribute("aria-pressed");
      await claimToggle.click();
      const invertedPressed = await claimToggle.getAttribute("aria-pressed");
      const claimScreenshotPath = path.join(
        SCREENSHOT_DIRECTORY,
        `${patentId}.${viewport}.claim-inverted.png`,
      );
      await dispatcher.screenshot({ path: claimScreenshotPath });
      await claimToggle.click();
      const restoredPressed = await claimToggle.getAttribute("aria-pressed");
      claimInteraction = {
        available: true,
        beforePressed,
        invertedPressed,
        restoredPressed,
        screenshotPath: claimScreenshotPath,
      };
      claimInteractionValid =
        invertedPressed !== beforePressed && restoredPressed === beforePressed;
    }

    let mechanismInteraction: Record<string, unknown> = { available: false };
    let mechanismInteractionValid = true;
    if (patentId === "us-4063220-metcalfe-ethernet") {
      const beforeCollision = await runtimeOwnerSnapshot(page, patentId);
      const beforeCollisionCount = Number(beforeCollision?.["data-collision-count"] ?? 0);
      const collisionButton = surface.getByRole("button", { name: "Inject Packet Collision" });
      await collisionButton.click();
      const collisionObserved = await page
        .waitForFunction(
          ({ id, priorCount }) => {
            const owner = document.querySelector(
              `[data-testid="patent-physics-runtime-owner"][data-patent-id="${id}"]`,
            );
            return Number(owner?.getAttribute("data-collision-count") ?? 0) > priorCount;
          },
          { id: patentId, priorCount: beforeCollisionCount },
          { timeout: 3_000 },
        )
        .then(() => true)
        .catch(() => false);
      const collisionOwner = await runtimeOwnerSnapshot(page, patentId);
      const collisionScreenshotPath = path.join(
        SCREENSHOT_DIRECTORY,
        `${patentId}.${viewport}.collision-event.png`,
      );
      await dispatcher.screenshot({ path: collisionScreenshotPath });
      await surface.getByRole("button", { name: "Collision Active (Jamming)" }).click();
      const afterCollisionCount = Number(collisionOwner?.["data-collision-count"] ?? 0);
      mechanismInteraction = {
        available: true,
        kind: "collision-jam-backoff",
        beforeCollisionCount,
        afterCollisionCount,
        collisionObserved,
        owner: collisionOwner,
        screenshotPath: collisionScreenshotPath,
      };
      mechanismInteractionValid = collisionObserved && afterCollisionCount > beforeCollisionCount;
    }

    if (patentId === "us-586193-marconi-radio") {
      const receiverPreset = surface.getByRole("button", { name: "Receiver & Reset" });
      const receiverFocusApplied =
        (await receiverPreset.count()) > 0 && (await receiverPreset.isVisible())
          ? await receiverPreset
              .click()
              .then(() => true)
              .catch(() => false)
          : false;
      const beforePulse = await runtimeOwnerSnapshot(page, patentId);
      const beforePulseSequence = Number(beforePulse?.["data-pulse-sequence"] ?? 0);
      await surface.getByRole("button", { name: "Fire Spark" }).click();
      const pulseObserved = await page
        .waitForFunction(
          ({ id, priorSequence }) => {
            const owner = document.querySelector(
              `[data-testid="patent-physics-runtime-owner"][data-patent-id="${id}"]`,
            );
            return Number(owner?.getAttribute("data-pulse-sequence") ?? 0) > priorSequence;
          },
          { id: patentId, priorSequence: beforePulseSequence },
          { timeout: 3_000 },
        )
        .then(() => true)
        .catch(() => false);
      const receiverObserved = await page
        .waitForFunction(
          (id) =>
            document
              .querySelector(`[data-testid="patent-physics-runtime-owner"][data-patent-id="${id}"]`)
              ?.getAttribute("data-receiver-stage") === "receiver-conducting",
          patentId,
          { timeout: 3_000 },
        )
        .then(() => true)
        .catch(() => false);
      const receiverOwner = await runtimeOwnerSnapshot(page, patentId);
      // Start observing the fixed-step reset before the screenshot. On a
      // software-rendered phone profile, capture itself can take long enough
      // to consume the otherwise-visible automatic-reset interval.
      const resetObservedPromise = page
        .waitForFunction(
          (id) =>
            document
              .querySelector(`[data-testid="patent-physics-runtime-owner"][data-patent-id="${id}"]`)
              ?.getAttribute("data-receiver-stage") === "automatic-reset",
          patentId,
          // This stage is driven by fixed simulation ticks, not wall-clock
          // jumps. Under software WebGL the tape deliberately slows instead
          // of skipping causal states, so allow the reset ticks to arrive.
          { timeout: 12_000 },
        )
        .then(() => true)
        .catch(() => false);
      const receiverScreenshotPath = path.join(
        SCREENSHOT_DIRECTORY,
        `${patentId}.${viewport}.receiver-conducting.png`,
      );
      await dispatcher.screenshot({ path: receiverScreenshotPath });
      const resetObserved = await resetObservedPromise;
      const resetOwner = await runtimeOwnerSnapshot(page, patentId);
      const resetScreenshotPath = path.join(
        SCREENSHOT_DIRECTORY,
        `${patentId}.${viewport}.automatic-reset.png`,
      );
      await dispatcher.screenshot({ path: resetScreenshotPath });
      const returnedIdle = await page
        .waitForFunction(
          (id) =>
            document
              .querySelector(`[data-testid="patent-physics-runtime-owner"][data-patent-id="${id}"]`)
              ?.getAttribute("data-receiver-stage") === "idle",
          patentId,
          // Screenshot capture can stall rendering; retain a generous
          // wall-time envelope while still requiring the exact idle state.
          { timeout: 12_000 },
        )
        .then(() => true)
        .catch(() => false);
      mechanismInteraction = {
        available: true,
        kind: "spark-contact-relay-automatic-reset",
        receiverFocusApplied,
        beforePulseSequence,
        pulseObserved,
        receiverObserved,
        receiverOwner,
        receiverScreenshotPath,
        resetObserved,
        resetOwner,
        resetScreenshotPath,
        returnedIdle,
      };
      mechanismInteractionValid =
        pulseObserved &&
        receiverObserved &&
        receiverOwner?.["data-relay-active"] === "true" &&
        resetObserved &&
        resetOwner?.["data-reset-active"] === "true" &&
        returnedIdle;
    }

    if (patentId === "us-1773980-farnsworth-tv" || patentId === "us-6120588-eink") {
      const twoDimensionalButton = dispatcher.getByRole("button", {
        name: "2D Technical Diagram",
      });
      await twoDimensionalButton.click();
      await page.waitForFunction(
        ({ id }) =>
          document
            .querySelector(
              `[data-testid="patent-visual-dispatcher"][data-patent-id="${id}"] [data-testid="patent-visual-surface"]`,
            )
            ?.getAttribute("data-render-mode") === "vector-diagram",
        { id: patentId },
      );
      const beforePause = await runtimeOwnerSnapshot(page, patentId);
      const pauseLabel =
        patentId === "us-1773980-farnsworth-tv" ? "Pause Beam" : "Pause Simulation";
      const resumeLabel =
        patentId === "us-1773980-farnsworth-tv" ? "Resume Scan" : "Play Simulation";
      await surface.getByRole("button", { name: pauseLabel }).click();
      await page.waitForFunction(
        ({ id }) => {
          const owner = document.querySelector(
            `[data-testid="patent-physics-runtime-owner"][data-patent-id="${id}"]`,
          );
          return owner?.getAttribute("data-running") === "false";
        },
        { id: patentId },
        { timeout: 3_000 },
      );
      const pausedStart = await runtimeOwnerSnapshot(page, patentId);
      await page.evaluate(
        () =>
          new Promise<void>((resolve) => {
            let frames = 0;
            const observe = () => {
              frames += 1;
              if (frames >= 12) resolve();
              else requestAnimationFrame(observe);
            };
            requestAnimationFrame(observe);
          }),
      );
      const pausedEnd = await runtimeOwnerSnapshot(page, patentId);
      const pausedScreenshotPath = path.join(
        SCREENSHOT_DIRECTORY,
        `${patentId}.${viewport}.paused-2d.png`,
      );
      await dispatcher.screenshot({ path: pausedScreenshotPath });
      const pausedStable =
        pausedStart?.["data-runtime-tick"] === pausedEnd?.["data-runtime-tick"] &&
        pausedStart?.["data-runtime-digest"] === pausedEnd?.["data-runtime-digest"];
      await surface.getByRole("button", { name: resumeLabel }).click();
      const resumed = await page
        .waitForFunction(
          ({ id, priorTick }) => {
            const owner = document.querySelector(
              `[data-testid="patent-physics-runtime-owner"][data-patent-id="${id}"]`,
            );
            return Number(owner?.getAttribute("data-runtime-tick") ?? 0) > priorTick;
          },
          { id: patentId, priorTick: Number(pausedEnd?.["data-runtime-tick"] ?? 0) },
          { timeout: 3_000 },
        )
        .then(() => true)
        .catch(() => false);
      await dispatcher.getByRole("button", { name: "3D Physics Simulation" }).click();
      await page.waitForFunction(
        ({ id }) => {
          const root = document.querySelector(
            `[data-testid="patent-visual-dispatcher"][data-patent-id="${id}"]`,
          );
          const candidate = root?.querySelector("canvas");
          return Boolean(candidate && candidate.width > 1 && candidate.height > 1);
        },
        { id: patentId },
        { timeout: 20_000 },
      );
      mechanismInteraction = {
        available: true,
        kind: "pause-resume-shared-tape",
        beforePause,
        pausedStart,
        pausedEnd,
        pausedStable,
        resumed,
        screenshotPath: pausedScreenshotPath,
      };
      mechanismInteractionValid = pausedStable && resumed;
    }

    const ownerLocator = dispatcher.locator('[data-testid="patent-physics-runtime-owner"]');
    const expectsRuntimeOwner = OWNER_MANAGED_PATENT_IDS.has(patentId);
    if (expectsRuntimeOwner) {
      await ownerLocator
        .first()
        .waitFor({ state: "attached", timeout: 3_000 })
        .catch(() => undefined);
    }
    const ownerCount = await ownerLocator.count();
    const shouldExerciseLifecycle = ownerCount > 0 || FORCE_LIFECYCLE;
    let lifecycle: Record<string, unknown> = { exercised: false, ownerCount };
    let lifecycleValid = !expectsRuntimeOwner || ownerCount === 1;
    if (shouldExerciseLifecycle) {
      const beforeOwner = await runtimeOwnerSnapshot(page, patentId);
      const twoDimensionalButton = dispatcher.getByRole("button", {
        name: "2D Technical Diagram",
      });
      await twoDimensionalButton.click();
      await page.waitForFunction(
        ({ id }) =>
          document
            .querySelector(
              `[data-testid="patent-visual-dispatcher"][data-patent-id="${id}"] [data-testid="patent-visual-surface"]`,
            )
            ?.getAttribute("data-render-mode") === "vector-diagram",
        { id: patentId },
      );
      const vectorOwner = await runtimeOwnerSnapshot(page, patentId);

      const threeDimensionalModeButton = dispatcher.getByRole("button", {
        name: "3D Physics Simulation",
      });
      await threeDimensionalModeButton.click();
      await page.waitForFunction(
        ({ id }) => {
          const root = document.querySelector(
            `[data-testid="patent-visual-dispatcher"][data-patent-id="${id}"]`,
          );
          const candidate = root?.querySelector("canvas");
          return Boolean(candidate && candidate.width > 1 && candidate.height > 1);
        },
        { id: patentId },
        { timeout: 20_000 },
      );
      const afterOwner = await runtimeOwnerSnapshot(page, patentId);
      const liveOwnerCount = await dispatcher
        .locator('[data-testid="patent-physics-runtime-owner"]')
        .count();
      const liveCanvasCount = await surface.locator("canvas").count();
      const beforeTick = Number(beforeOwner?.["data-runtime-tick"] ?? 0);
      const vectorTick = Number(vectorOwner?.["data-runtime-tick"] ?? beforeTick);
      const afterTick = Number(afterOwner?.["data-runtime-tick"] ?? vectorTick);
      const sameMount =
        !beforeOwner ||
        (beforeOwner["data-runtime-owner-mount"] === vectorOwner?.["data-runtime-owner-mount"] &&
          vectorOwner?.["data-runtime-owner-mount"] === afterOwner?.["data-runtime-owner-mount"]);
      lifecycleValid =
        (!expectsRuntimeOwner || (ownerCount === 1 && Boolean(beforeOwner))) &&
        liveOwnerCount === ownerCount &&
        liveCanvasCount === 1 &&
        (!beforeOwner ||
          (vectorTick >= beforeTick &&
            afterTick >= vectorTick &&
            sameMount &&
            Boolean(afterOwner?.["data-runtime-digest"])));
      lifecycle = {
        exercised: true,
        expectsRuntimeOwner,
        ownerCount,
        liveOwnerCount,
        liveCanvasCount,
        beforeOwner,
        vectorOwner,
        afterOwner,
        sameMount,
      };
      milestones.lifecycleRoundTripMs = Math.round(performance.now() - startedAt);
    }

    const postLifecyclePerformance = shouldExerciseLifecycle
      ? await browserPerformanceSnapshot(page, patentId)
      : null;

    const after = await page.evaluate((id) => {
      const root = document.querySelector(
        `[data-testid="patent-visual-dispatcher"][data-patent-id="${id}"]`,
      );
      return {
        dispatcherTick: Number(root?.getAttribute("data-physics-tick") ?? 0),
        lastChange: root?.getAttribute("data-physics-last-change"),
        canvasCount: root?.querySelectorAll("canvas").length ?? 0,
        horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth,
      };
    }, patentId);

    const errors =
      diagnostics.consoleErrors.length +
      diagnostics.pageErrors.length +
      diagnostics.networkErrors.length;
    const valid =
      before.canvasCount === 1 &&
      before.canvasCssWidth > 0 &&
      before.canvasCssHeight > 0 &&
      before.canvasBufferWidth > 1 &&
      before.canvasBufferHeight > 1 &&
      !before.horizontalOverflow &&
      !after.horizontalOverflow &&
      interactionValid &&
      claimInteractionValid &&
      mechanismInteractionValid &&
      lifecycleValid &&
      performanceBudgetValid &&
      errors === 0;
    emit({
      patentId,
      route,
      viewport,
      action: "render-and-interact",
      status: valid ? "pass" : "fail",
      durationMs: Math.round(performance.now() - startedAt),
      expected: {
        mode: "3d-physics",
        canvasCount: 1,
        nonzeroCanvas: true,
        horizontalOverflow: false,
        runtimeErrors: 0,
        primaryControlChangesTickWhenAvailable: true,
        claimToggleRestoresWhenAvailable: true,
        patentMechanismInteractionPassesWhenAvailable: true,
        lifecycleRoundTripPreservesOwnerWhenAvailable: true,
        performanceBudgetsWhenEnforced: performanceBudget,
      },
      actual: {
        mode,
        milestones,
        before,
        interaction,
        claimInteraction,
        mechanismInteraction,
        lifecycle,
        after,
        performance: {
          measurementMode: TRACE_ENABLED ? "trace-active-diagnostic" : "clean",
          comparableProductionTiming: !TRACE_ENABLED,
          budget: performanceBudget,
          baseline: baselinePerformance,
          postLifecycle: postLifecyclePerformance,
        },
        tracePath,
      },
      screenshotPath,
      diagnostics,
    });
  } catch (error) {
    screenshotPath = await captureFailure(page, patentId, viewport);
    emit({
      patentId,
      route,
      viewport,
      action: "render-and-interact",
      status: "fail",
      durationMs: Math.round(performance.now() - startedAt),
      expected: "visible, interactive Three.js surface with one finite canvas",
      actual: error instanceof Error ? error.message : String(error),
      screenshotPath,
      diagnostics,
    });
  }
}

async function main() {
  if (missingRequestedPatentIds.length > 0) {
    throw new Error(
      `THREEJS_AUDIT_PATENTS contains unregistered catalogue ids: ${missingRequestedPatentIds.join(", ")}`,
    );
  }
  if (missingRequestedViewportNames.length > 0) {
    throw new Error(
      `THREEJS_AUDIT_VIEWPORTS contains unsupported names: ${missingRequestedViewportNames.join(", ")}`,
    );
  }
  if (patents.length === 0) {
    throw new Error("THREEJS_AUDIT_PATENTS selected no registered catalogue ids.");
  }
  if (viewportNames.length === 0) {
    throw new Error("THREEJS_AUDIT_VIEWPORTS selected no supported viewports.");
  }

  console.log(`Three.js production visual audit ${RUN_ID}`);
  console.log(`Target: ${BASE_URL}`);
  console.log(`Patents: ${patents.length}/${allPatents.length}`);
  console.log(`Viewports: ${viewportNames.join(", ")}`);
  console.log(`Evidence: ${RUN_DIRECTORY}`);
  console.log(`Measurement: ${TRACE_ENABLED ? "trace-active diagnostic" : "clean"}`);
  console.log(
    `Budgets: draw calls ${ENFORCE_DRAW_CALL_BUDGET ? `enforced (≤${MAX_DRAW_CALLS})` : "diagnostic only"}; timing ${ENFORCE_TIMING_BUDGETS ? "enforced" : "diagnostic only"}`,
  );
  console.log(
    `Performance distributions: ${PERFORMANCE_SAMPLE_COUNT > 0 ? `${PERFORMANCE_SAMPLE_COUNT} context-cold + ${PERFORMANCE_SAMPLE_COUNT} context-warm sample(s)` : "disabled"}`,
  );

  const browser = await chromium.launch({ headless: true });
  for (const viewportName of viewportNames) {
    const context = await browser.newContext(contextOptions(viewportName));
    for (const patent of patents) {
      const page = await context.newPage();
      const tracePath = TRACE_ENABLED
        ? path.join(TRACE_DIRECTORY, `${patent.id}.${viewportName}.zip`)
        : null;
      try {
        if (tracePath) {
          await context.tracing.start({ screenshots: true, snapshots: true, sources: false });
        }
        await auditPatent(page, patent.id, viewportName, tracePath);
      } finally {
        if (tracePath) await context.tracing.stop({ path: tracePath }).catch(() => undefined);
        await page.close().catch(() => undefined);
      }
    }
    await context.close();
  }
  await collectPerformanceDistributions(browser);
  await browser.close();

  const performanceSummaries = summarizeThreePerformanceSamples(performanceSamples);
  if (PERFORMANCE_SAMPLE_COUNT > 0) {
    for (const distribution of performanceSummaries) {
      if (distribution.measurementMode !== "clean") continue;
      const firstRenderMs =
        distribution.metrics.firstRenderMs.invalidCount === 0
          ? distribution.metrics.firstRenderMs.p95
          : null;
      const cpuSubmitMs =
        distribution.metrics.cpuSubmitMs.invalidCount === 0
          ? distribution.metrics.cpuSubmitMs.p95
          : null;
      const drawCalls =
        distribution.metrics.drawCalls.invalidCount === 0
          ? distribution.metrics.drawCalls.p95
          : null;
      const valid = validateThreePerformanceBudget({
        enforceTiming: ENFORCE_TIMING_BUDGETS,
        enforceDrawCalls: ENFORCE_DRAW_CALL_BUDGET,
        firstRenderMs,
        cpuSubmitMs,
        drawCalls,
        maxFirstRenderMs: MAX_FIRST_RENDER_MS,
        maxCpuSubmitMs: MAX_CPU_SUBMIT_MS,
        maxDrawCalls: MAX_DRAW_CALLS,
      }).valid;
      if (ENFORCE_TIMING_BUDGETS || ENFORCE_DRAW_CALL_BUDGET) {
        emit({
          patentId: distribution.patentId,
          route: `/patents/${distribution.patentId}`,
          viewport: distribution.viewport as ViewportName,
          action: "performance-budget-summary",
          status: valid ? "pass" : "fail",
          durationMs: 0,
          expected: {
            cacheState: distribution.cacheState,
            timingEnforced: ENFORCE_TIMING_BUDGETS,
            drawCallsEnforced: ENFORCE_DRAW_CALL_BUDGET,
            p95FirstRenderMsAtMost: MAX_FIRST_RENDER_MS,
            p95CpuSubmitMsAtMost: MAX_CPU_SUBMIT_MS,
            p95DrawCallsAtMost: MAX_DRAW_CALLS,
            invalidSamples: 0,
          },
          actual: distribution,
          screenshotPath: null,
          diagnostics: { consoleErrors: [], pageErrors: [], networkErrors: [] },
        });
      }
    }
    fs.writeFileSync(
      PERFORMANCE_SUMMARY_PATH,
      `${JSON.stringify(
        {
          schemaVersion: 1,
          runId: RUN_ID,
          commit: COMMIT,
          measurementMode: TRACE_ENABLED ? "trace-active-diagnostic" : "clean",
          sampleDefinition: {
            cold: "Fresh BrowserContext and page for each measured navigation; browser process remains shared.",
            warm: "Fresh BrowserContext primed once, then a new page per measured navigation in that context.",
            readiness:
              "3D surface selected, finite canvas, and Three.js sampled frame count at least 5.",
            cpuTiming: "Renderer CPU submission sample only; not GPU frame time.",
          },
          samples: performanceSamples,
          distributions: performanceSummaries,
        },
        null,
        2,
      )}\n`,
    );
  }

  const summary = {
    schemaVersion: 1,
    runId: RUN_ID,
    baseUrl: BASE_URL,
    patentCount: patents.length,
    viewportCount: viewportNames.length,
    eventCount: sequence,
    failureCount,
    eventPath: EVENT_PATH,
    screenshotDirectory: SCREENSHOT_DIRECTORY,
    performanceSampleCount: performanceSamples.length,
    performanceSummaryPath: PERFORMANCE_SAMPLE_COUNT > 0 ? PERFORMANCE_SUMMARY_PATH : null,
  };
  fs.writeFileSync(
    path.join(RUN_DIRECTORY, "summary.json"),
    `${JSON.stringify(summary, null, 2)}\n`,
  );
  console.log(JSON.stringify(summary, null, 2));
  if (failureCount > 0) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
