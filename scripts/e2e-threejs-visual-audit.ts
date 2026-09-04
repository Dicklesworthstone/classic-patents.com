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
import { type Browser, chromium, type Locator, type Page } from "playwright";
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
const STICKY_HEADER_CANVAS_CLEARANCE_PX = 8;
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
    const failureText = request.failure()?.errorText ?? "unknown failure";
    // Next's App Router may cancel a superseded React Server Component
    // navigation after the destination is already committed. Chromium reports
    // that intentional cancellation as ERR_ABORTED; treating it as a product
    // network failure makes an otherwise complete visual audit nondeterministic.
    const isSupersededRscNavigation =
      request.method() === "GET" &&
      request.url().includes("_rsc=") &&
      failureText === "net::ERR_ABORTED";
    if (isSupersededRscNavigation) return;
    diagnostics.networkErrors.push(`${request.method()} ${request.url()} :: ${failureText}`);
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

/**
 * Component screenshots are useful for inspecting a visual's full control
 * surface, but Playwright may compose a sticky header into that element image
 * while the real browser viewport has clear geometry. Capture the actual
 * viewport separately and make overlap verdicts from DOM rectangles only.
 */
async function captureActualViewportEvidence(args: {
  page: Page;
  canvas: Locator;
  patentId: string;
  viewport: ViewportName;
  stage: "primary-control-max" | "claim-inverted";
}) {
  await args.canvas.scrollIntoViewIfNeeded();
  await args.page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      }),
  );

  // A canvas taller than the viewport can be only partially visible after a
  // control click. `scrollIntoViewIfNeeded()` legitimately leaves that state
  // alone, but the canvas top can then sit behind the sticky header. Reframe
  // the screenshot at its top edge when the document can scroll there. The
  // post-scroll rectangle below remains authoritative, so a canvas that
  // cannot be cleared still produces a real overlap failure.
  const framing = await args.page.evaluate(
    ({ id, clearancePx }) => {
      const root = document.querySelector(
        `[data-testid="patent-visual-dispatcher"][data-patent-id="${id}"]`,
      );
      const candidate = root?.querySelector("canvas");
      const canvas = candidate instanceof HTMLCanvasElement ? candidate : null;
      const header = document.querySelector<HTMLElement>("header.sticky.top-0");
      const canvasTopPx = canvas?.getBoundingClientRect().top ?? null;
      const headerBottomPx = header?.getBoundingClientRect().bottom ?? null;
      const minimumCanvasTopPx =
        headerBottomPx === null ? 0 : Math.max(0, headerBottomPx + clearancePx);
      const requestedScrollDeltaY =
        canvasTopPx !== null && canvasTopPx < minimumCanvasTopPx
          ? canvasTopPx - minimumCanvasTopPx
          : 0;
      const scrollYBefore = window.scrollY;

      if (requestedScrollDeltaY !== 0) {
        // The application normally uses smooth scrolling. Audit framing must
        // settle synchronously so the following receipt describes this exact
        // viewport rather than an intermediate scroll animation frame.
        const inlineScrollBehavior = document.documentElement.style.scrollBehavior;
        document.documentElement.style.scrollBehavior = "auto";
        window.scrollBy(0, requestedScrollDeltaY);
        document.documentElement.style.scrollBehavior = inlineScrollBehavior;
      }

      return {
        canvasTopPx,
        headerBottomPx,
        minimumCanvasTopPx,
        requestedScrollDeltaY,
        scrollYBefore,
        scrollYAfterRequest: window.scrollY,
        reframed: requestedScrollDeltaY !== 0,
      };
    },
    { id: args.patentId, clearancePx: STICKY_HEADER_CANVAS_CLEARANCE_PX },
  );
  await args.page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      }),
  );

  const geometry = await args.page.evaluate(
    ({ id, framing }) => {
      const root = document.querySelector(
        `[data-testid="patent-visual-dispatcher"][data-patent-id="${id}"]`,
      );
      const candidate = root?.querySelector("canvas");
      const canvas = candidate instanceof HTMLCanvasElement ? candidate : null;
      const header = document.querySelector<HTMLElement>("header.sticky.top-0");
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight,
        scrollX: window.scrollX,
        scrollY: window.scrollY,
      };
      const toRect = (element: Element) => {
        const rect = element.getBoundingClientRect();
        return {
          top: rect.top,
          right: rect.right,
          bottom: rect.bottom,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        };
      };

      if (!canvas) {
        return {
          capture: "actual-viewport" as const,
          framing,
          viewport,
          canvas: null,
          siteStickyHeader: header
            ? {
                position: getComputedStyle(header).position,
                rect: toRect(header),
              }
            : null,
          stickyHeaderCanvasOverlap: {
            actualIntersection: false,
            overlapWidthPx: 0,
            overlapHeightPx: 0,
            verticalClearancePx: null,
          },
        };
      }

      const canvasRect = toRect(canvas);
      const visibleCanvasWidth = Math.max(
        0,
        Math.min(canvasRect.right, viewport.width) - Math.max(canvasRect.left, 0),
      );
      const visibleCanvasHeight = Math.max(
        0,
        Math.min(canvasRect.bottom, viewport.height) - Math.max(canvasRect.top, 0),
      );
      const headerRect = header ? toRect(header) : null;
      const overlapWidthPx = headerRect
        ? Math.max(
            0,
            Math.min(canvasRect.right, headerRect.right) -
              Math.max(canvasRect.left, headerRect.left),
          )
        : 0;
      const overlapHeightPx = headerRect
        ? Math.max(
            0,
            Math.min(canvasRect.bottom, headerRect.bottom) -
              Math.max(canvasRect.top, headerRect.top),
          )
        : 0;

      return {
        capture: "actual-viewport" as const,
        framing,
        viewport,
        canvas: {
          rect: canvasRect,
          visibleInViewport: visibleCanvasWidth > 0 && visibleCanvasHeight > 0,
        },
        siteStickyHeader: header
          ? {
              position: getComputedStyle(header).position,
              rect: headerRect,
            }
          : null,
        stickyHeaderCanvasOverlap: {
          actualIntersection: overlapWidthPx > 0 && overlapHeightPx > 0,
          overlapWidthPx,
          overlapHeightPx,
          verticalClearancePx: headerRect ? canvasRect.top - headerRect.bottom : null,
        },
      };
    },
    { id: args.patentId, framing },
  );

  const screenshotPath = path.join(
    SCREENSHOT_DIRECTORY,
    `${args.patentId}.${args.viewport}.${args.stage}.viewport.png`,
  );
  await args.page.screenshot({ path: screenshotPath, fullPage: false });
  return { screenshotPath, geometry };
}

/**
 * A visual-model boundary is never evidence that the patent itself is hidden.
 * Exercise the Original Patent Text face before every Three.js audit so the
 * visual report cannot accidentally certify an empty source reader.
 */
async function verifyOriginalPatentTextFace(args: {
  page: Page;
  patentId: string;
  route: string;
  viewport: ViewportName;
  startedAt: number;
  diagnostics: RuntimeDiagnostics;
}) {
  const originalTextButton = args.page.locator(
    'button[title="Original Patent Text (Shortcut: 2)"]',
  );
  await originalTextButton.waitFor({ state: "visible", timeout: 20_000 });
  await originalTextButton.click();
  await args.page.waitForFunction(
    () =>
      document
        .querySelector('button[title="Original Patent Text (Shortcut: 2)"]')
        ?.getAttribute("aria-pressed") === "true",
    undefined,
    { timeout: 20_000 },
  );

  const viewer = args.page.getByTestId("dual-projection-viewer");
  await args.page.waitForFunction(
    () => {
      const sourceViewer = document.querySelector('[data-testid="dual-projection-viewer"]');
      return Boolean(
        sourceViewer?.querySelector(
          'article[data-edition-kind], [data-testid="reviewed-transcript-fallback"], [data-testid="source-facsimile-fallback"]',
        ),
      );
    },
    undefined,
    { timeout: 20_000 },
  );

  const edition = viewer.locator("article[data-edition-kind]");
  const transcript = viewer.getByTestId("reviewed-transcript-fallback");
  const facsimileFallback = viewer.getByTestId("source-facsimile-fallback");
  const transcriptCount = await transcript.count();
  const editionCount = await edition.count();
  const facsimileFallbackCount = await facsimileFallback.count();
  const pdfEmbedCount = await viewer.locator('object[type="application/pdf"]').count();
  const transcriptText = transcriptCount > 0 ? await transcript.locator("pre").textContent() : null;
  const editionText = editionCount > 0 ? await edition.first().textContent() : null;
  const sourceDelivery =
    transcriptCount > 0
      ? "page-marked-transcript"
      : editionCount > 0
        ? "archival-edition"
        : facsimileFallbackCount > 0
          ? "pinned-facsimile"
          : "none";
  const errors =
    args.diagnostics.consoleErrors.length +
    args.diagnostics.pageErrors.length +
    args.diagnostics.networkErrors.length;
  const valid =
    sourceDelivery !== "none" &&
    (sourceDelivery !== "pinned-facsimile" || pdfEmbedCount >= 1) &&
    (sourceDelivery === "page-marked-transcript"
      ? /^--- REVIEWED TRANSCRIPTION PAGE 1 OF \d+ ---/.test(transcriptText ?? "")
      : sourceDelivery === "pinned-facsimile"
        ? facsimileFallbackCount === 1
        : Boolean(editionText?.trim().length)) &&
    errors === 0;

  emit({
    patentId: args.patentId,
    route: args.route,
    viewport: args.viewport,
    action: "original-patent-text",
    status: valid ? "pass" : "fail",
    durationMs: Math.round(performance.now() - args.startedAt),
    expected: {
      completeSourceDelivery: "archival edition, page-marked transcript, or pinned facsimile",
      runtimeErrors: 0,
    },
    actual: {
      sourceDelivery,
      editionKind: await edition
        .first()
        .getAttribute("data-edition-kind")
        .catch(() => null),
      transcriptStartsWithPageOne: /^--- REVIEWED TRANSCRIPTION PAGE 1 OF \d+ ---/.test(
        transcriptText ?? "",
      ),
      facsimileFallbackCount,
      pdfEmbedCount,
    },
    screenshotPath: null,
    diagnostics: args.diagnostics,
  });

  if (!valid) {
    throw new Error(
      `Original Patent Text did not render complete source text for ${args.patentId}: ${sourceDelivery}.`,
    );
  }
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
  const visualFaceButton = page.locator('button[title$="(Shortcut: 3)"]');
  await visualFaceButton.waitFor({ state: "visible", timeout: 20_000 });
  await visualFaceButton.click();

  const dispatcher = page
    .locator(`[data-testid="patent-visual-dispatcher"][data-patent-id="${patentId}"]`)
    .first();
  await dispatcher.waitFor({ state: "visible", timeout: 20_000 });
  await dispatcher.scrollIntoViewIfNeeded();
  await page.waitForFunction(
    ({ id }) => {
      const selectedDispatcher = document.querySelector(
        `[data-testid="patent-visual-dispatcher"][data-patent-id="${id}"]`,
      );
      return Boolean(
        selectedDispatcher?.querySelector(
          '[aria-labelledby="source-visual-unavailable-title"], [data-testid="three-d-source-boundary"], canvas',
        ),
      );
    },
    { id: patentId },
    { timeout: 20_000 },
  );

  const sourceIntegrityHold = dispatcher.locator(
    '[aria-labelledby="source-visual-unavailable-title"]',
  );
  if ((await sourceIntegrityHold.count()) > 0) {
    return {
      kind: "not-applicable" as const,
      route,
      navigationMs,
      reason: "The public exhibit intentionally provides a visual-model source boundary.",
    };
  }

  const surface = dispatcher.getByTestId("patent-visual-surface");
  await surface.waitFor({ state: "visible", timeout: 20_000 });
  const mode = await surface.getAttribute("data-render-mode");
  if (mode !== "3d-physics") throw new Error(`Expected 3d-physics surface, received ${mode}.`);
  if ((await surface.getByTestId("three-d-source-boundary").count()) > 0) {
    return {
      kind: "not-applicable" as const,
      route,
      navigationMs,
      reason: "The selected 3D face intentionally withholds a source-unsupported model.",
    };
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
    kind: "three" as const,
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
    if (prepared.kind === "not-applicable") {
      emit({
        patentId,
        route: prepared.route,
        viewport,
        action: "performance-not-applicable",
        status: "info",
        durationMs: Math.round(performance.now() - startedAt),
        expected: {
          cacheState,
          sampleIndex,
          renderedThreeJsSurface: false,
          performanceBudget: "not applicable",
        },
        actual: { reason: prepared.reason, navigationMs: prepared.navigationMs },
        screenshotPath: null,
        diagnostics,
      });
      return "not-applicable" as const;
    }
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
    return "sampled" as const;
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
    return "failed" as const;
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
      let performanceApplicable = true;
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
          const outcome = await withOptionalTrace(context, tracePath, () =>
            collectPerformanceSample(
              page,
              patent.id,
              viewportName,
              "context-cold",
              sampleIndex,
              tracePath,
            ),
          );
          if (outcome === "not-applicable") performanceApplicable = false;
        } finally {
          await page.close().catch(() => undefined);
          await context.close().catch(() => undefined);
        }
        if (!performanceApplicable) break;
      }

      if (!performanceApplicable) continue;

      const warmContext = await browser.newContext(contextOptions(viewportName));
      try {
        const primingPage = await warmContext.newPage();
        let warmPerformanceApplicable = true;
        try {
          const prepared = await prepareThreePerformancePage(primingPage, patent.id);
          warmPerformanceApplicable = prepared.kind === "three";
        } finally {
          await primingPage.close().catch(() => undefined);
        }
        if (!warmPerformanceApplicable) continue;
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

    await verifyOriginalPatentTextFace({
      page,
      patentId,
      route,
      viewport,
      startedAt,
      diagnostics,
    });

    const visualFaceButton = page.locator('button[title$="(Shortcut: 3)"]');
    await visualFaceButton.waitFor({ state: "visible", timeout: 20_000 });
    await visualFaceButton.click();
    milestones.interactiveFaceSelectedMs = Math.round(performance.now() - startedAt);

    // Kwolek has a visual-only boundary: it avoids inheriting a misleading
    // material-performance scene, while the preceding receipt proves the
    // complete patent text remains visible to visitors.
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
        `${patentId}.${viewport}.visual-model-boundary.png`,
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
        holdText.toLowerCase().includes("visual-model boundary") &&
        errors === 0;

      emit({
        patentId,
        route,
        viewport,
        action: "visual-model-boundary",
        status: valid ? "pass" : "fail",
        durationMs: Math.round(performance.now() - startedAt),
        expected: {
          explicitVisualModelBoundary: true,
          originalPatentTextChecked: true,
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
      if (requestedValue !== null) {
        await page
          .waitForFunction(
            ({ id, label, expectedValue }) => {
              const root = document.querySelector(
                `[data-testid="patent-visual-dispatcher"][data-patent-id="${id}"]`,
              );
              return [...(root?.querySelectorAll('input[type="range"]') ?? [])].some(
                (candidate) =>
                  candidate.getAttribute("aria-label") === label &&
                  (candidate as HTMLInputElement).value === expectedValue,
              );
            },
            { id: patentId, label: accessibleName, expectedValue: requestedValue },
            { timeout: 1_000 },
          )
          .catch(() => undefined);
      }
      // Controlled inputs may be replaced during React reconciliation. Query
      // the live element again so the audit does not read a detached handle's
      // stale pre-interaction value.
      // Preserve control identity as interlocks change. Re-selecting merely
      // the first enabled range can jump to a different input after this
      // interaction enables it (Milacron's registration control is one such
      // causal sequence).
      const changedNamedRange = accessibleName
        ? surface.getByLabel(accessibleName, { exact: true }).first()
        : null;
      const changedPreferredRange = surface
        .locator('input[type="range"][data-audit-primary-control="true"]:not([disabled])')
        .first();
      const changedRange =
        changedNamedRange && (await changedNamedRange.count()) > 0
          ? changedNamedRange
          : (await changedPreferredRange.count()) > 0
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
      const viewportEvidence = await captureActualViewportEvidence({
        page,
        canvas,
        patentId,
        viewport,
        stage: "primary-control-max",
      });
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
        viewportScreenshotPath: viewportEvidence.screenshotPath,
        viewportGeometry: viewportEvidence.geometry,
      };
      interactionValid =
        requestedValue !== null &&
        changedValue !== priorValue &&
        tickAdvanced &&
        viewportEvidence.geometry.canvas?.visibleInViewport === true &&
        !viewportEvidence.geometry.stickyHeaderCanvasOverlap.actualIntersection;
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
      const viewportEvidence = await captureActualViewportEvidence({
        page,
        canvas,
        patentId,
        viewport,
        stage: "claim-inverted",
      });
      await claimToggle.click();
      const restoredPressed = await claimToggle.getAttribute("aria-pressed");
      claimInteraction = {
        available: true,
        beforePressed,
        invertedPressed,
        restoredPressed,
        screenshotPath: claimScreenshotPath,
        viewportScreenshotPath: viewportEvidence.screenshotPath,
        viewportGeometry: viewportEvidence.geometry,
      };
      claimInteractionValid =
        invertedPressed !== beforePressed &&
        restoredPressed === beforePressed &&
        viewportEvidence.geometry.canvas?.visibleInViewport === true &&
        !viewportEvidence.geometry.stickyHeaderCanvasOverlap.actualIntersection;
    }

    let mechanismInteraction: Record<string, unknown> = { available: false };
    let mechanismInteractionValid = true;
    if (patentId === "gb-1306-watt-rotary-engine") {
      const readWattOwner = async () => {
        const snapshot = await runtimeOwnerSnapshot(page, patentId);
        return {
          raw: snapshot,
          running: snapshot?.["data-watt-running"],
          timeSec: Number(snapshot?.["data-watt-time-sec"]),
          carrierAngleRad: Number(snapshot?.["data-watt-carrier-angle-rad"]),
          rodAngleRad: Number(snapshot?.["data-watt-rod-angle-rad"]),
          planetAngleRad: Number(snapshot?.["data-watt-planet-angle-rad"]),
          sunAngleRad: Number(snapshot?.["data-watt-sun-angle-rad"]),
          meshResidualRad: Number(snapshot?.["data-watt-mesh-residual-rad"]),
          rodResidualM: Number(snapshot?.["data-watt-rod-residual-m"]),
          sunTeeth: Number(snapshot?.["data-watt-sun-teeth"]),
          planetTeeth: Number(snapshot?.["data-watt-planet-teeth"]),
          provenance: snapshot?.["data-runtime-provenance"],
          kernelSource: snapshot?.["data-watt-kernel-source"],
          frankenSimBoundary: snapshot?.["data-watt-frankensim-boundary"],
        };
      };
      const readWattFace = (face: "two" | "three") =>
        dispatcher.locator(`[data-watt-face="${face}"]`).evaluate((element) => ({
          carrierAngleRad: Number(element.getAttribute("data-watt-carrier-angle-rad")),
          rodAngleRad: Number(element.getAttribute("data-watt-rod-angle-rad")),
          planetAngleRad: Number(element.getAttribute("data-watt-planet-angle-rad")),
          sunAngleRad: Number(element.getAttribute("data-watt-sun-angle-rad")),
          meshResidualRad: Number(element.getAttribute("data-watt-mesh-residual-rad")),
          rodResidualM: Number(element.getAttribute("data-watt-rod-residual-m")),
          sunTeeth: Number(element.getAttribute("data-watt-sun-teeth")),
          planetTeeth: Number(element.getAttribute("data-watt-planet-teeth")),
        }));

      await page.waitForFunction(
        (id) => {
          const owner = document.querySelector(
            `[data-testid="patent-physics-runtime-owner"][data-patent-id="${id}"]`,
          );
          const time = owner?.getAttribute("data-watt-time-sec");
          return time !== null && time !== "" && Number.isFinite(Number(time));
        },
        patentId,
        { timeout: 3_000 },
      );
      const movingStart = await readWattOwner();
      await page.waitForTimeout(250);
      const movingEnd = await readWattOwner();
      const rodDelta = movingEnd.rodAngleRad - movingStart.rodAngleRad;
      const planetDelta = movingEnd.planetAngleRad - movingStart.planetAngleRad;
      const planetRigidToRod =
        Math.abs(planetDelta) > 1e-4 && Math.abs(planetDelta - rodDelta) < 1e-9;
      const constraintsClosed =
        Math.abs(movingStart.meshResidualRad) < 1e-9 &&
        Math.abs(movingEnd.meshResidualRad) < 1e-9 &&
        Math.abs(movingStart.rodResidualM) < 1e-9 &&
        Math.abs(movingEnd.rodResidualM) < 1e-9;
      const sourceBoundaryHonest =
        movingEnd.provenance === "TS_FALLBACK" &&
        movingEnd.kernelSource === "source-bounded-ts" &&
        movingEnd.frankenSimBoundary ===
          "fs-mbd::holonomic-gear-and-four-bar-constraints-unavailable";

      const mobileCameraSelect = surface.getByLabel("Watt engine camera view");
      if ((await mobileCameraSelect.count()) > 0 && (await mobileCameraSelect.isVisible())) {
        await mobileCameraSelect.selectOption("gear-mesh");
      } else {
        await surface.getByRole("button", { name: "Gear Mesh" }).click();
      }
      await page.waitForTimeout(100);
      const gearMeshScreenshotPath = path.join(
        SCREENSHOT_DIRECTORY,
        `${patentId}.${viewport}.gear-mesh.png`,
      );
      await dispatcher.screenshot({ path: gearMeshScreenshotPath });

      await surface.getByRole("button", { name: "Pause Motion" }).click();
      await page.waitForFunction(
        (id) =>
          document
            .querySelector(`[data-testid="patent-physics-runtime-owner"][data-patent-id="${id}"]`)
            ?.getAttribute("data-watt-running") === "false",
        patentId,
        { timeout: 3_000 },
      );
      const pausedStart = await readWattOwner();
      const pausedThreeFace = await readWattFace("three");
      await page.waitForTimeout(200);
      const pausedEnd = await readWattOwner();
      const pauseHeld = Math.abs(pausedEnd.timeSec - pausedStart.timeSec) < 1e-12;

      await dispatcher.getByRole("button", { name: "2D Technical Diagram" }).click();
      await dispatcher
        .locator('[data-watt-face="two"]')
        .waitFor({ state: "visible", timeout: 20_000 });
      const pausedTwoFace = await readWattFace("two");
      const faceTolerance = 1e-9;
      const pausedCrossFaceParity =
        Math.abs(pausedTwoFace.carrierAngleRad - pausedThreeFace.carrierAngleRad) < faceTolerance &&
        Math.abs(pausedTwoFace.rodAngleRad - pausedThreeFace.rodAngleRad) < faceTolerance &&
        Math.abs(pausedTwoFace.planetAngleRad - pausedThreeFace.planetAngleRad) < faceTolerance &&
        Math.abs(pausedTwoFace.sunAngleRad - pausedThreeFace.sunAngleRad) < faceTolerance;

      const ratioControl = surface.getByLabel("Planet-to-sun gear tooth ratio");
      await ratioControl.focus();
      await ratioControl.press("End");
      await page.waitForFunction(
        (id) => {
          const owner = document.querySelector(
            `[data-testid="patent-physics-runtime-owner"][data-patent-id="${id}"]`,
          );
          return (
            owner?.getAttribute("data-watt-sun-teeth") === "20" &&
            owner?.getAttribute("data-watt-planet-teeth") === "40"
          );
        },
        patentId,
        { timeout: 3_000 },
      );
      const ratioTwoFace = await readWattFace("two");
      const twoDimensionalScreenshotPath = path.join(
        SCREENSHOT_DIRECTORY,
        `${patentId}.${viewport}.ratio-two-to-one-two-dimensional.png`,
      );
      await dispatcher.screenshot({ path: twoDimensionalScreenshotPath });

      await dispatcher.getByRole("button", { name: "3D Physics Simulation" }).click();
      await dispatcher
        .locator('[data-watt-face="three"]')
        .waitFor({ state: "visible", timeout: 20_000 });
      const ratioThreeFace = await readWattFace("three");
      const ratioCrossFaceParity =
        ratioTwoFace.sunTeeth === 20 &&
        ratioTwoFace.planetTeeth === 40 &&
        ratioThreeFace.sunTeeth === ratioTwoFace.sunTeeth &&
        ratioThreeFace.planetTeeth === ratioTwoFace.planetTeeth &&
        Math.abs(ratioThreeFace.sunAngleRad - ratioTwoFace.sunAngleRad) < faceTolerance &&
        Math.abs(ratioThreeFace.planetAngleRad - ratioTwoFace.planetAngleRad) < faceTolerance;
      await surface.getByRole("button", { name: "Resume Motion" }).click();
      const resumed = await page
        .waitForFunction(
          ({ id, heldTime }) => {
            const owner = document.querySelector(
              `[data-testid="patent-physics-runtime-owner"][data-patent-id="${id}"]`,
            );
            return (
              owner?.getAttribute("data-watt-running") === "true" &&
              Number(owner?.getAttribute("data-watt-time-sec")) > heldTime
            );
          },
          { id: patentId, heldTime: pausedEnd.timeSec },
          { timeout: 3_000 },
        )
        .then(() => true)
        .catch(() => false);

      mechanismInteraction = {
        available: true,
        kind: "rigid-planet-rocking-no-slip-mesh-pause-and-cross-face-parity",
        movingStart,
        movingEnd,
        planetRigidToRod,
        constraintsClosed,
        sourceBoundaryHonest,
        pausedStart,
        pausedEnd,
        pauseHeld,
        pausedThreeFace,
        pausedTwoFace,
        pausedCrossFaceParity,
        ratioTwoFace,
        ratioThreeFace,
        ratioCrossFaceParity,
        resumed,
        gearMeshScreenshotPath,
        twoDimensionalScreenshotPath,
      };
      mechanismInteractionValid =
        planetRigidToRod &&
        constraintsClosed &&
        sourceBoundaryHonest &&
        pauseHeld &&
        pausedCrossFaceParity &&
        ratioCrossFaceParity &&
        resumed;
    }

    if (patentId === "gb-931-arkwright-water-frame") {
      const readArkwrightOwner = async () => {
        const snapshot = await runtimeOwnerSnapshot(page, patentId);
        return {
          raw: snapshot,
          running: snapshot?.["data-arkwright-running"],
          totalDraftRatio: Number(snapshot?.["data-arkwright-total-draft-ratio"]),
          timeSec: Number(snapshot?.["data-arkwright-time-sec"]),
          wheelRad: Number(snapshot?.["data-arkwright-wheel-phase-rad"]),
          feedRad: Number(snapshot?.["data-arkwright-feed-phase-rad"]),
          intermediateOneRad: Number(snapshot?.["data-arkwright-intermediate-one-phase-rad"]),
          intermediateTwoRad: Number(snapshot?.["data-arkwright-intermediate-two-phase-rad"]),
          deliveryRad: Number(snapshot?.["data-arkwright-delivery-phase-rad"]),
          spindleLayshaftRad: Number(snapshot?.["data-arkwright-spindle-layshaft-phase-rad"]),
          spindleRad: Number(snapshot?.["data-arkwright-spindle-phase-rad"]),
          bobbinRad: Number(snapshot?.["data-arkwright-bobbin-phase-rad"]),
          traverseRad: Number(snapshot?.["data-arkwright-traverse-phase-rad"]),
          provenance: snapshot?.["data-runtime-provenance"],
          kernelSource: snapshot?.["data-arkwright-kernel-source"],
          frankenSimBoundary: snapshot?.["data-arkwright-frankensim-boundary"],
        };
      };
      const readArkwrightFace = (face: "two" | "three") =>
        dispatcher.locator(`[data-arkwright-face="${face}"]`).evaluate((element) => ({
          running: element.getAttribute("data-arkwright-running"),
          wheelRad: Number(element.getAttribute("data-arkwright-wheel-phase-rad")),
          feedRad: Number(element.getAttribute("data-arkwright-feed-phase-rad")),
          intermediateOneRad: Number(
            element.getAttribute("data-arkwright-intermediate-one-phase-rad"),
          ),
          intermediateTwoRad: Number(
            element.getAttribute("data-arkwright-intermediate-two-phase-rad"),
          ),
          deliveryRad: Number(element.getAttribute("data-arkwright-delivery-phase-rad")),
          spindleLayshaftRad: Number(
            element.getAttribute("data-arkwright-spindle-layshaft-phase-rad"),
          ),
          spindleRad: Number(element.getAttribute("data-arkwright-spindle-phase-rad")),
          traverseRad: Number(element.getAttribute("data-arkwright-traverse-phase-rad")),
        }));

      await page.waitForFunction(
        (id) => {
          const owner = document.querySelector(
            `[data-testid="patent-physics-runtime-owner"][data-patent-id="${id}"]`,
          );
          const time = owner?.getAttribute("data-arkwright-time-sec");
          return time !== null && time !== "" && Number.isFinite(Number(time));
        },
        patentId,
        { timeout: 3_000 },
      );
      const movingStart = await readArkwrightOwner();
      await page.waitForFunction(
        ({ id, startTime }) => {
          const owner = document.querySelector(
            `[data-testid="patent-physics-runtime-owner"][data-patent-id="${id}"]`,
          );
          return Number(owner?.getAttribute("data-arkwright-time-sec")) > startTime + 1 / 30;
        },
        { id: patentId, startTime: movingStart.timeSec },
        { timeout: 5_000 },
      );
      const movingEnd = await readArkwrightOwner();
      const deltas = {
        wheel: movingEnd.wheelRad - movingStart.wheelRad,
        feed: movingEnd.feedRad - movingStart.feedRad,
        intermediateOne: movingEnd.intermediateOneRad - movingStart.intermediateOneRad,
        intermediateTwo: movingEnd.intermediateTwoRad - movingStart.intermediateTwoRad,
        delivery: movingEnd.deliveryRad - movingStart.deliveryRad,
        spindleLayshaft: movingEnd.spindleLayshaftRad - movingStart.spindleLayshaftRad,
        spindle: movingEnd.spindleRad - movingStart.spindleRad,
        bobbin: movingEnd.bobbinRad - movingStart.bobbinRad,
      };
      const expectedStageRatio = movingEnd.totalDraftRatio ** (1 / 3);
      const stageRatioTolerance = 1e-8;
      const fourStageDraftLawClosed =
        deltas.feed > 1e-4 &&
        deltas.intermediateOne > deltas.feed &&
        deltas.intermediateTwo > deltas.intermediateOne &&
        deltas.delivery > deltas.intermediateTwo &&
        Math.abs(deltas.intermediateOne / deltas.feed - expectedStageRatio) < stageRatioTolerance &&
        Math.abs(deltas.intermediateTwo / deltas.intermediateOne - expectedStageRatio) <
          stageRatioTolerance &&
        Math.abs(deltas.delivery / deltas.intermediateTwo - expectedStageRatio) <
          stageRatioTolerance;
      const twoStageSpindleDriveClosed =
        Math.abs(Math.abs(deltas.spindleLayshaft / deltas.wheel) - 3.7) < stageRatioTolerance &&
        Math.abs(Math.abs(deltas.spindle / deltas.spindleLayshaft) - 5) < stageRatioTolerance;
      const allDrivenCoordinatesAdvance =
        deltas.wheel > 1e-4 &&
        Math.abs(deltas.spindleLayshaft) > 1e-4 &&
        deltas.spindle > 1e-4 &&
        deltas.bobbin > 1e-4;
      const sourceBoundaryHonest =
        movingEnd.provenance === "TS_FALLBACK" &&
        movingEnd.kernelSource === "source-bounded-ts" &&
        movingEnd.frankenSimBoundary ===
          "fs-mbd::articulated-revolute-and-prismatic-browser-step-unavailable";

      await surface.getByRole("button", { name: "Hide Transmission Cover" }).click();
      await surface
        .getByRole("button", { name: "Show Transmission Cover" })
        .waitFor({ state: "visible", timeout: 3_000 });
      const openTransmissionScreenshotPath = path.join(
        SCREENSHOT_DIRECTORY,
        `${patentId}.${viewport}.transmission-open.png`,
      );
      await dispatcher.screenshot({ path: openTransmissionScreenshotPath });
      await surface.getByRole("button", { name: "Show Transmission Cover" }).click();

      await surface.getByRole("button", { name: "Pause Motion" }).click();
      await page.waitForFunction(
        (id) =>
          document
            .querySelector(`[data-testid="patent-physics-runtime-owner"][data-patent-id="${id}"]`)
            ?.getAttribute("data-arkwright-running") === "false",
        patentId,
        { timeout: 3_000 },
      );
      const pausedStart = await readArkwrightOwner();
      const pausedThreeFace = await readArkwrightFace("three");
      await page.waitForTimeout(200);
      const pausedEnd = await readArkwrightOwner();
      const pauseHeld =
        Math.abs(pausedEnd.timeSec - pausedStart.timeSec) < 1e-12 &&
        Math.abs(pausedEnd.wheelRad - pausedStart.wheelRad) < 1e-12 &&
        Math.abs(pausedEnd.feedRad - pausedStart.feedRad) < 1e-12 &&
        Math.abs(pausedEnd.intermediateOneRad - pausedStart.intermediateOneRad) < 1e-12 &&
        Math.abs(pausedEnd.intermediateTwoRad - pausedStart.intermediateTwoRad) < 1e-12 &&
        Math.abs(pausedEnd.deliveryRad - pausedStart.deliveryRad) < 1e-12 &&
        Math.abs(pausedEnd.spindleLayshaftRad - pausedStart.spindleLayshaftRad) < 1e-12 &&
        Math.abs(pausedEnd.spindleRad - pausedStart.spindleRad) < 1e-12;

      await dispatcher.getByRole("button", { name: "2D Technical Diagram" }).click();
      await dispatcher
        .locator('[data-arkwright-face="two"]')
        .waitFor({ state: "visible", timeout: 20_000 });
      const pausedTwoFace = await readArkwrightFace("two");
      const faceTolerance = 1e-9;
      const pausedCrossFaceParity =
        pausedThreeFace.running === "false" &&
        pausedTwoFace.running === "false" &&
        Math.abs(pausedTwoFace.wheelRad - pausedThreeFace.wheelRad) < faceTolerance &&
        Math.abs(pausedTwoFace.feedRad - pausedThreeFace.feedRad) < faceTolerance &&
        Math.abs(pausedTwoFace.intermediateOneRad - pausedThreeFace.intermediateOneRad) <
          faceTolerance &&
        Math.abs(pausedTwoFace.intermediateTwoRad - pausedThreeFace.intermediateTwoRad) <
          faceTolerance &&
        Math.abs(pausedTwoFace.deliveryRad - pausedThreeFace.deliveryRad) < faceTolerance &&
        Math.abs(pausedTwoFace.spindleLayshaftRad - pausedThreeFace.spindleLayshaftRad) <
          faceTolerance &&
        Math.abs(pausedTwoFace.spindleRad - pausedThreeFace.spindleRad) < faceTolerance;
      const twoDimensionalScreenshotPath = path.join(
        SCREENSHOT_DIRECTORY,
        `${patentId}.${viewport}.shared-tape-two-dimensional.png`,
      );
      await dispatcher.screenshot({ path: twoDimensionalScreenshotPath });

      await surface.getByRole("button", { name: "Resume Motion" }).click();
      const resumed = await page
        .waitForFunction(
          ({ id, heldTime }) => {
            const owner = document.querySelector(
              `[data-testid="patent-physics-runtime-owner"][data-patent-id="${id}"]`,
            );
            return (
              owner?.getAttribute("data-arkwright-running") === "true" &&
              Number(owner?.getAttribute("data-arkwright-time-sec")) > heldTime
            );
          },
          { id: patentId, heldTime: pausedEnd.timeSec },
          { timeout: 3_000 },
        )
        .then(() => true)
        .catch(() => false);
      await dispatcher.getByRole("button", { name: "3D Physics Simulation" }).click();
      await dispatcher
        .locator('[data-arkwright-face="three"]')
        .waitFor({ state: "visible", timeout: 20_000 });

      mechanismInteraction = {
        available: true,
        kind: "four-stage-draft-law-pause-and-cross-face-parity",
        movingStart,
        movingEnd,
        deltas,
        expectedStageRatio,
        fourStageDraftLawClosed,
        twoStageSpindleDriveClosed,
        allDrivenCoordinatesAdvance,
        sourceBoundaryHonest,
        openTransmissionScreenshotPath,
        pausedStart,
        pausedEnd,
        pauseHeld,
        pausedThreeFace,
        pausedTwoFace,
        pausedCrossFaceParity,
        resumed,
        twoDimensionalScreenshotPath,
      };
      mechanismInteractionValid =
        fourStageDraftLawClosed &&
        twoStageSpindleDriveClosed &&
        allDrivenCoordinatesAdvance &&
        sourceBoundaryHonest &&
        pauseHeld &&
        pausedCrossFaceParity &&
        resumed;
    }

    if (patentId === "gb-1420-cort-puddling-rolling") {
      const readCortOwner = async () => {
        const snapshot = await runtimeOwnerSnapshot(page, patentId);
        return {
          raw: snapshot,
          running: snapshot?.["data-cort-running"],
          timeSec: Number(snapshot?.["data-cort-time-sec"]),
          topRollRad: Number(snapshot?.["data-cort-top-roll-phase-rad"]),
          bottomRollRad: Number(snapshot?.["data-cort-bottom-roll-phase-rad"]),
          rabbleRad: Number(snapshot?.["data-cort-rabble-phase-rad"]),
          billetTravelM: Number(snapshot?.["data-cort-billet-travel-m"]),
          workingRollRadiusMm: Number(snapshot?.["data-cort-working-roll-radius-mm"]),
          nipGapMm: Number(snapshot?.["data-cort-roll-nip-gap-mm"]),
          billetHeightMm: Number(snapshot?.["data-cort-billet-height-mm"]),
          nipInterferenceMm: Number(snapshot?.["data-cort-nip-interference-mm"]),
          provenance: snapshot?.["data-runtime-provenance"],
          ownerMount: snapshot?.["data-runtime-owner-mount"],
          kernelSource: snapshot?.["data-cort-kernel-source"],
          frankenSimBoundary: snapshot?.["data-cort-frankensim-boundary"],
        };
      };
      const readCortFace = (face: "two" | "three") =>
        dispatcher.locator(`[data-cort-face="${face}"]`).evaluate((element) => ({
          running: element.getAttribute("data-cort-running"),
          topRollRad: Number(element.getAttribute("data-cort-top-roll-phase-rad")),
          bottomRollRad: Number(element.getAttribute("data-cort-bottom-roll-phase-rad")),
          rabbleRad: Number(element.getAttribute("data-cort-rabble-phase-rad")),
          billetTravelM: Number(element.getAttribute("data-cort-billet-travel-m")),
          nipInterferenceMm: Number(element.getAttribute("data-cort-nip-interference-mm")),
        }));

      await page.waitForFunction(
        (id) => {
          const owner = document.querySelector(
            `[data-testid="patent-physics-runtime-owner"][data-patent-id="${id}"]`,
          );
          const time = owner?.getAttribute("data-cort-time-sec");
          return time !== null && time !== "" && Number.isFinite(Number(time));
        },
        patentId,
        { timeout: 3_000 },
      );
      const movingStart = await readCortOwner();
      await page.waitForFunction(
        ({ id, startTime }) => {
          const owner = document.querySelector(
            `[data-testid="patent-physics-runtime-owner"][data-patent-id="${id}"]`,
          );
          return Number(owner?.getAttribute("data-cort-time-sec")) > startTime + 1 / 30;
        },
        { id: patentId, startTime: movingStart.timeSec },
        { timeout: 5_000 },
      );
      const movingEnd = await readCortOwner();
      const deltas = {
        topRollRad: movingEnd.topRollRad - movingStart.topRollRad,
        bottomRollRad: movingEnd.bottomRollRad - movingStart.bottomRollRad,
        rabbleRad: movingEnd.rabbleRad - movingStart.rabbleRad,
        billetTravelM: (movingEnd.billetTravelM - movingStart.billetTravelM + 1.2) % 1.2,
      };
      const phaseTolerance = 1e-8;
      const counterRotationClosed =
        deltas.topRollRad < -1e-4 &&
        deltas.bottomRollRad > 1e-4 &&
        Math.abs(deltas.topRollRad + deltas.bottomRollRad) < phaseTolerance;
      const noSlipBilletTravelClosed =
        deltas.billetTravelM > 1e-5 &&
        Math.abs(
          deltas.billetTravelM - deltas.bottomRollRad * (movingEnd.workingRollRadiusMm / 1000),
        ) < phaseTolerance;
      const nipGeometryClosed =
        Math.abs(movingEnd.nipGapMm - movingEnd.billetHeightMm) < phaseTolerance &&
        Math.abs(movingEnd.nipInterferenceMm) < phaseTolerance;
      const sourceBoundaryHonest =
        movingEnd.provenance === "TS_FALLBACK" &&
        movingEnd.kernelSource === "source-bounded-ts" &&
        movingEnd.frankenSimBoundary ===
          "fs-mbd::revolute+fs-solid::contact+fs-conduction::transient-browser-composition-unavailable";

      const mobileCameraSelect = surface.getByLabel("Cort process camera view");
      if (viewport === "phone" || viewport === "phone375") {
        await mobileCameraSelect.selectOption("grooves", { force: true });
      } else {
        await surface.getByRole("button", { name: "Groove Passes" }).click();
      }
      await page.waitForTimeout(100);
      const groovePassScreenshotPath = path.join(
        SCREENSHOT_DIRECTORY,
        `${patentId}.${viewport}.physical-groove-passes.png`,
      );
      await dispatcher.screenshot({ path: groovePassScreenshotPath });

      if (viewport === "phone" || viewport === "phone375") {
        await mobileCameraSelect.selectOption("drive", { force: true });
      } else {
        await surface.getByRole("button", { name: "Roll Drive" }).click();
      }
      await page.waitForTimeout(100);
      const rollDriveScreenshotPath = path.join(
        SCREENSHOT_DIRECTORY,
        `${patentId}.${viewport}.physical-roll-drive.png`,
      );
      await dispatcher.screenshot({ path: rollDriveScreenshotPath });

      await surface.getByRole("button", { name: "Pause Process Motion" }).click();
      await page.waitForFunction(
        (id) =>
          document
            .querySelector(`[data-testid="patent-physics-runtime-owner"][data-patent-id="${id}"]`)
            ?.getAttribute("data-cort-running") === "false",
        patentId,
        { timeout: 3_000 },
      );
      const pausedStart = await readCortOwner();
      const pausedThreeFace = await readCortFace("three");
      await page.waitForTimeout(200);
      const pausedEnd = await readCortOwner();
      const pauseHeld =
        Math.abs(pausedEnd.timeSec - pausedStart.timeSec) < 1e-12 &&
        Math.abs(pausedEnd.topRollRad - pausedStart.topRollRad) < 1e-12 &&
        Math.abs(pausedEnd.bottomRollRad - pausedStart.bottomRollRad) < 1e-12 &&
        Math.abs(pausedEnd.rabbleRad - pausedStart.rabbleRad) < 1e-12 &&
        Math.abs(pausedEnd.billetTravelM - pausedStart.billetTravelM) < 1e-12;

      await dispatcher.getByRole("button", { name: "2D Technical Diagram" }).click();
      await dispatcher.locator('[data-cort-face="two"]').waitFor({
        state: "visible",
        timeout: 20_000,
      });
      const pausedTwoFace = await readCortFace("two");
      const ownerAfterFaceSwitch = await readCortOwner();
      const faceTolerance = 1e-9;
      const pausedCrossFaceParity =
        pausedThreeFace.running === "false" &&
        pausedTwoFace.running === "false" &&
        Math.abs(pausedTwoFace.topRollRad - pausedThreeFace.topRollRad) < faceTolerance &&
        Math.abs(pausedTwoFace.bottomRollRad - pausedThreeFace.bottomRollRad) < faceTolerance &&
        Math.abs(pausedTwoFace.rabbleRad - pausedThreeFace.rabbleRad) < faceTolerance &&
        Math.abs(pausedTwoFace.billetTravelM - pausedThreeFace.billetTravelM) < faceTolerance &&
        Math.abs(pausedTwoFace.nipInterferenceMm - pausedThreeFace.nipInterferenceMm) <
          faceTolerance;
      const singleOwnerLifecycle = ownerAfterFaceSwitch.ownerMount === movingEnd.ownerMount;

      await surface.getByRole("button", { name: "Rolling Mill" }).click();
      const twoDimensionalScreenshotPath = path.join(
        SCREENSHOT_DIRECTORY,
        `${patentId}.${viewport}.shared-tape-two-dimensional.png`,
      );
      await dispatcher.screenshot({ path: twoDimensionalScreenshotPath });

      await surface.getByRole("button", { name: "Resume Process Motion" }).click();
      const resumed = await page
        .waitForFunction(
          ({ id, heldTime }) => {
            const owner = document.querySelector(
              `[data-testid="patent-physics-runtime-owner"][data-patent-id="${id}"]`,
            );
            return (
              owner?.getAttribute("data-cort-running") === "true" &&
              Number(owner?.getAttribute("data-cort-time-sec")) > heldTime
            );
          },
          { id: patentId, heldTime: pausedEnd.timeSec },
          { timeout: 3_000 },
        )
        .then(() => true)
        .catch(() => false);
      await dispatcher.getByRole("button", { name: "3D Physics Simulation" }).click();
      await dispatcher.locator('[data-cort-face="three"]').waitFor({
        state: "visible",
        timeout: 20_000,
      });

      mechanismInteraction = {
        available: true,
        kind: "counter-rotating-no-slip-roll-bite-pause-and-cross-face-parity",
        movingStart,
        movingEnd,
        deltas,
        counterRotationClosed,
        noSlipBilletTravelClosed,
        nipGeometryClosed,
        sourceBoundaryHonest,
        pausedStart,
        pausedEnd,
        pauseHeld,
        pausedThreeFace,
        pausedTwoFace,
        pausedCrossFaceParity,
        singleOwnerLifecycle,
        resumed,
        groovePassScreenshotPath,
        rollDriveScreenshotPath,
        twoDimensionalScreenshotPath,
      };
      mechanismInteractionValid =
        counterRotationClosed &&
        noSlipBilletTravelClosed &&
        nipGeometryClosed &&
        sourceBoundaryHonest &&
        pauseHeld &&
        pausedCrossFaceParity &&
        singleOwnerLifecycle &&
        resumed;
    }

    if (patentId === "us-x1-hopkins-potash") {
      const readHopkinsOwner = async () =>
        page.evaluate((id) => {
          const node = document.querySelector(
            `[data-testid="patent-physics-runtime-owner"][data-patent-id="${id}"]`,
          );
          const attributes = Object.fromEntries(
            [...(node?.attributes ?? [])].map((attribute) => [attribute.name, attribute.value]),
          );
          return {
            attributes,
            running: attributes["data-hopkins-running"],
            timeSec: Number(attributes["data-hopkins-time-sec"]),
            processCycle: Number(attributes["data-hopkins-process-cycle"]),
            flamePhaseRad: Number(attributes["data-hopkins-flame-phase-rad"]),
            boilPhaseRad: Number(attributes["data-hopkins-boil-phase-rad"]),
            provenance: attributes["data-runtime-provenance"],
            ownerMount: attributes["data-runtime-owner-mount"],
            kernelSource: attributes["data-hopkins-kernel-source"],
            frankenSimBoundary: attributes["data-hopkins-frankensim-boundary"],
          };
        }, patentId);
      const readHopkinsFace = async (face: "two" | "three") =>
        dispatcher.locator(`[data-hopkins-face="${face}"]`).evaluate((node) => ({
          running: node.getAttribute("data-hopkins-running"),
          processCycle: Number(node.getAttribute("data-hopkins-process-cycle")),
          flamePhaseRad: Number(node.getAttribute("data-hopkins-flame-phase-rad")),
          boilPhaseRad: Number(node.getAttribute("data-hopkins-boil-phase-rad")),
          provenance: node.getAttribute("data-hopkins-runtime-provenance"),
          kernelSource: node.getAttribute("data-hopkins-kernel-source"),
          frankenSimBoundary: node.getAttribute("data-hopkins-frankensim-boundary"),
        }));

      await page.waitForFunction(
        (id) => {
          const owner = document.querySelector(
            `[data-testid="patent-physics-runtime-owner"][data-patent-id="${id}"]`,
          );
          return Number.isFinite(Number(owner?.getAttribute("data-hopkins-time-sec")));
        },
        patentId,
        { timeout: 3_000 },
      );
      const movingStart = await readHopkinsOwner();
      await page.waitForFunction(
        ({ id, startTime }) => {
          const owner = document.querySelector(
            `[data-testid="patent-physics-runtime-owner"][data-patent-id="${id}"]`,
          );
          return Number(owner?.getAttribute("data-hopkins-time-sec")) > startTime + 1 / 30;
        },
        { id: patentId, startTime: movingStart.timeSec },
        { timeout: 5_000 },
      );
      const movingEnd = await readHopkinsOwner();
      const processCycleDelta = (movingEnd.processCycle - movingStart.processCycle + 1) % 1;
      const sharedTapeAdvanced =
        processCycleDelta > 1e-6 &&
        movingEnd.flamePhaseRad > movingStart.flamePhaseRad &&
        movingEnd.boilPhaseRad > movingStart.boilPhaseRad;
      const sourceBoundaryHonest =
        movingEnd.provenance === "TS_FALLBACK" &&
        movingEnd.kernelSource === "source-bounded-ts" &&
        movingEnd.frankenSimBoundary ===
          "fs-conduction::transient+reactive-transport-browser-composition-unavailable";

      const mobileCameraSelect = surface.getByLabel("Hopkins process camera view");
      if (viewport === "phone" || viewport === "phone375") {
        await mobileCameraSelect.selectOption("settling", { force: true });
      } else {
        await surface.getByRole("button", { name: "3 Settle Ley" }).click();
      }
      await page.waitForTimeout(100);
      const settlingScreenshotPath = path.join(
        SCREENSHOT_DIRECTORY,
        `${patentId}.${viewport}.physical-five-operation-settling.png`,
      );
      await dispatcher.screenshot({ path: settlingScreenshotPath });

      await surface.getByRole("button", { name: "Pause Process Reader" }).click();
      await page.waitForFunction(
        (id) =>
          document
            .querySelector(`[data-testid="patent-physics-runtime-owner"][data-patent-id="${id}"]`)
            ?.getAttribute("data-hopkins-running") === "false",
        patentId,
        { timeout: 3_000 },
      );
      const pausedStart = await readHopkinsOwner();
      const pausedThreeFace = await readHopkinsFace("three");
      await page.waitForTimeout(200);
      const pausedEnd = await readHopkinsOwner();
      const pauseHeld =
        Math.abs(pausedEnd.timeSec - pausedStart.timeSec) < 1e-12 &&
        Math.abs(pausedEnd.processCycle - pausedStart.processCycle) < 1e-12 &&
        Math.abs(pausedEnd.flamePhaseRad - pausedStart.flamePhaseRad) < 1e-12 &&
        Math.abs(pausedEnd.boilPhaseRad - pausedStart.boilPhaseRad) < 1e-12;

      await dispatcher.getByRole("button", { name: "2D Technical Diagram" }).click();
      await dispatcher.locator('[data-hopkins-face="two"]').waitFor({
        state: "visible",
        timeout: 20_000,
      });
      const pausedTwoFace = await readHopkinsFace("two");
      const ownerAfterFaceSwitch = await readHopkinsOwner();
      const processTopologyComplete =
        (viewport === "phone" || viewport === "phone375"
          ? await dispatcher.locator("[data-hopkins-mobile-operation]").count()
          : await dispatcher.locator('svg [id^="operation-"]').count()) === 5;
      const faceTolerance = 1e-9;
      const pausedCrossFaceParity =
        pausedThreeFace.running === "false" &&
        pausedTwoFace.running === "false" &&
        Math.abs(pausedTwoFace.processCycle - pausedThreeFace.processCycle) < faceTolerance &&
        Math.abs(pausedTwoFace.flamePhaseRad - pausedThreeFace.flamePhaseRad) < faceTolerance &&
        Math.abs(pausedTwoFace.boilPhaseRad - pausedThreeFace.boilPhaseRad) < faceTolerance &&
        pausedTwoFace.provenance === "TS_FALLBACK" &&
        pausedTwoFace.kernelSource === "source-bounded-ts";
      const singleOwnerLifecycle = ownerAfterFaceSwitch.ownerMount === movingEnd.ownerMount;
      const twoDimensionalScreenshotPath = path.join(
        SCREENSHOT_DIRECTORY,
        `${patentId}.${viewport}.shared-tape-five-operation-two-dimensional.png`,
      );
      await dispatcher.screenshot({ path: twoDimensionalScreenshotPath });

      await surface.getByRole("button", { name: "Play Simulation" }).click();
      const resumed = await page
        .waitForFunction(
          ({ id, heldTime }) => {
            const owner = document.querySelector(
              `[data-testid="patent-physics-runtime-owner"][data-patent-id="${id}"]`,
            );
            return (
              owner?.getAttribute("data-hopkins-running") === "true" &&
              Number(owner?.getAttribute("data-hopkins-time-sec")) > heldTime
            );
          },
          { id: patentId, heldTime: pausedEnd.timeSec },
          { timeout: 3_000 },
        )
        .then(() => true)
        .catch(() => false);
      await dispatcher.getByRole("button", { name: "3D Physics Simulation" }).click();
      await dispatcher.locator('[data-hopkins-face="three"]').waitFor({
        state: "visible",
        timeout: 20_000,
      });

      mechanismInteraction = {
        available: true,
        kind: "source-bounded-five-operation-shared-tape-pause-and-cross-face-parity",
        movingStart,
        movingEnd,
        processCycleDelta,
        sharedTapeAdvanced,
        sourceBoundaryHonest,
        pausedStart,
        pausedEnd,
        pauseHeld,
        pausedThreeFace,
        pausedTwoFace,
        pausedCrossFaceParity,
        processTopologyComplete,
        singleOwnerLifecycle,
        resumed,
        settlingScreenshotPath,
        twoDimensionalScreenshotPath,
      };
      mechanismInteractionValid =
        sharedTapeAdvanced &&
        sourceBoundaryHonest &&
        pauseHeld &&
        pausedCrossFaceParity &&
        processTopologyComplete &&
        singleOwnerLifecycle &&
        resumed;
    }

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

    if (patentId === "us-3858581-kamen-medication-injection-device") {
      const clutchSelect = surface.getByLabel("Clutch engagement");
      const engagedOwner = await runtimeOwnerSnapshot(page, patentId);
      const leadScrewTurnsBefore = Number(engagedOwner?.["data-lead-screw-turns"] ?? 0);
      const motorRotorTurnsBefore = Number(engagedOwner?.["data-motor-rotor-turns"] ?? 0);
      await clutchSelect.selectOption("0");
      await page.waitForTimeout(80);
      const releasedStartOwner = await runtimeOwnerSnapshot(page, patentId);
      const leadScrewTurnsReleaseStart = Number(releasedStartOwner?.["data-lead-screw-turns"] ?? 0);
      const motorRotorTurnsReleaseStart = Number(
        releasedStartOwner?.["data-motor-rotor-turns"] ?? 0,
      );
      await page.waitForTimeout(300);
      const releasedOwner = await runtimeOwnerSnapshot(page, patentId);
      const leadScrewTurnsReleased = Number(releasedOwner?.["data-lead-screw-turns"] ?? 0);
      const motorRotorTurnsReleased = Number(releasedOwner?.["data-motor-rotor-turns"] ?? 0);
      const releasedScreenshotPath = path.join(
        SCREENSHOT_DIRECTORY,
        `${patentId}.${viewport}.clutch-released.png`,
      );
      await dispatcher.screenshot({ path: releasedScreenshotPath });
      await clutchSelect.selectOption("1");
      const screwResumed = await page
        .waitForFunction(
          ({ id, heldTurns }) => {
            const owner = document.querySelector(
              `[data-testid="patent-physics-runtime-owner"][data-patent-id="${id}"]`,
            );
            return Number(owner?.getAttribute("data-lead-screw-turns") ?? 0) > heldTurns;
          },
          { id: patentId, heldTurns: leadScrewTurnsReleased },
          { timeout: 3_000 },
        )
        .then(() => true)
        .catch(() => false);
      const resumedOwner = await runtimeOwnerSnapshot(page, patentId);
      const leadScrewHeld = Math.abs(leadScrewTurnsReleased - leadScrewTurnsReleaseStart) < 1e-9;
      const rotorContinued = motorRotorTurnsReleased > motorRotorTurnsReleaseStart;
      mechanismInteraction = {
        available: true,
        kind: "claim-3-clutch-release",
        leadScrewTurnsBefore,
        leadScrewTurnsReleased,
        motorRotorTurnsBefore,
        leadScrewTurnsReleaseStart,
        motorRotorTurnsReleaseStart,
        motorRotorTurnsReleased,
        leadScrewHeld,
        rotorContinued,
        screwResumed,
        releasedOwner,
        resumedOwner,
        screenshotPath: releasedScreenshotPath,
      };
      mechanismInteractionValid = leadScrewHeld && rotorContinued && screwResumed;
    }

    if (patentId === "us-4068536-stackhouse-manipulator") {
      const stackhouseSurface = surface.getByTestId("stackhouse-source-three");
      const readStackhouseState = () =>
        stackhouseSurface.evaluate((element) => ({
          axisIntersection: element.getAttribute("data-axis-intersection"),
          toolDirection: element.getAttribute("data-tool-direction"),
          rotationDeterminant: Number(element.getAttribute("data-rotation-determinant")),
          rotationOrthonormalityError: Number(
            element.getAttribute("data-rotation-orthonormality-error"),
          ),
          jointOwner: element.getAttribute("data-joint-owner"),
        }));
      // The generic primary-control probe above leaves q_A at its maximum.
      // Return to the source-default pose so the offset comparison remains a
      // legible one-variable experiment on narrow as well as wide canvases.
      await surface.getByRole("button", { name: "Reset Baseline" }).click();
      await page.waitForTimeout(100);
      const preferredState = await readStackhouseState();
      const intersectionToggle = surface.getByTestId("stackhouse-intersection-toggle");
      await intersectionToggle.click();
      const offsetObserved = await page
        .waitForFunction(
          () =>
            document
              .querySelector('[data-testid="stackhouse-source-three"]')
              ?.getAttribute("data-axis-intersection") === "offset-contrast",
          undefined,
          { timeout: 3_000 },
        )
        .then(() => true)
        .catch(() => false);
      const offsetState = await readStackhouseState();
      const offsetScreenshotPath = path.join(
        SCREENSHOT_DIRECTORY,
        `${patentId}.${viewport}.offset-axis-contrast.png`,
      );
      await dispatcher.screenshot({ path: offsetScreenshotPath });
      await intersectionToggle.click();
      const restoredState = await readStackhouseState();
      const frameInvariant =
        Math.abs(offsetState.rotationDeterminant - 1) < 1e-10 &&
        offsetState.rotationOrthonormalityError < 1e-10;
      const orientationPreserved = offsetState.toolDirection === preferredState.toolDirection;
      const restored =
        restoredState.axisIntersection === "point-p" &&
        restoredState.toolDirection === preferredState.toolDirection;
      mechanismInteraction = {
        available: true,
        kind: "point-p-offset-contrast",
        preferredState,
        offsetState,
        restoredState,
        offsetObserved,
        frameInvariant,
        orientationPreserved,
        restored,
        screenshotPath: offsetScreenshotPath,
      };
      mechanismInteractionValid =
        preferredState.axisIntersection === "point-p" &&
        offsetObserved &&
        offsetState.axisIntersection === "offset-contrast" &&
        frameInvariant &&
        orientationPreserved &&
        restored;
    }

    if (patentId === "us-4098001-watson-rcc") {
      const watsonSurface = surface.getByTestId("watson-rcc-three");
      const watsonCanvas = watsonSurface.locator("canvas").first();
      const settleWatsonCanvasForScreenshot = async () => {
        await watsonCanvas.scrollIntoViewIfNeeded();
        await page.evaluate(
          () =>
            new Promise<void>((resolve) => {
              requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
            }),
        );
      };
      const readWatsonState = () =>
        watsonSurface.evaluate((element) => ({
          tipContactGap: Number(element.getAttribute("data-tip-contact-gap")),
          remoteCenterTipGap: Number(element.getAttribute("data-remote-center-tip-gap")),
          toolAxisError: Number(element.getAttribute("data-tool-axis-error")),
          translationPhase: Number(element.getAttribute("data-translation-phase")),
          rotationPhase: Number(element.getAttribute("data-rotation-phase")),
          lawOwner: element.getAttribute("data-law-owner"),
        }));

      // The generic probe leaves the contact-sequence control at one: the
      // remote-center tool must be both at the fixed chamfer and axis-aligned.
      const alignedState = await readWatsonState();
      await surface.getByRole("button", { name: "Reset" }).click();
      await page.waitForTimeout(100);
      const defaultRemoteState = await readWatsonState();

      const topologySelect = surface.getByLabel("Remote-center topology");
      await topologySelect.selectOption("0");
      const localStateObserved = await page
        .waitForFunction(
          () =>
            Number(
              document
                .querySelector('[data-testid="watson-rcc-three"]')
                ?.getAttribute("data-remote-center-tip-gap"),
            ) > 1,
          undefined,
          { timeout: 3_000 },
        )
        .then(() => true)
        .catch(() => false);
      const localWristState = await readWatsonState();
      const localScreenshotPath = path.join(
        SCREENSHOT_DIRECTORY,
        `${patentId}.${viewport}.local-wrist-contrast.png`,
      );
      await settleWatsonCanvasForScreenshot();
      await dispatcher.screenshot({ path: localScreenshotPath });

      await topologySelect.selectOption("1");
      const restoredRemoteState = await readWatsonState();
      const sequence = surface.getByLabel("Contact-guided alignment sequence");
      await sequence.focus();
      await sequence.press("Home");
      const approachState = await readWatsonState();
      const approachScreenshotPath = path.join(
        SCREENSHOT_DIRECTORY,
        `${patentId}.${viewport}.figure-4-approach.png`,
      );
      await settleWatsonCanvasForScreenshot();
      await dispatcher.screenshot({ path: approachScreenshotPath });
      await surface.getByRole("button", { name: "Reset" }).click();

      const aligned =
        alignedState.translationPhase === 1 &&
        alignedState.rotationPhase === 1 &&
        alignedState.tipContactGap < 1e-6 &&
        alignedState.remoteCenterTipGap < 1e-6 &&
        alignedState.toolAxisError < 1e-6;
      const remotePivotHeld =
        defaultRemoteState.tipContactGap < 1e-6 &&
        defaultRemoteState.remoteCenterTipGap < 1e-6 &&
        defaultRemoteState.toolAxisError > 0;
      const localPivotSweepsTip =
        localStateObserved &&
        localWristState.tipContactGap > 0.05 &&
        localWristState.remoteCenterTipGap > 1;
      const remoteRestored =
        restoredRemoteState.tipContactGap < 1e-6 && restoredRemoteState.remoteCenterTipGap < 1e-6;
      const approachSeparated =
        approachState.translationPhase === 0 &&
        approachState.rotationPhase === 0 &&
        approachState.tipContactGap > 0.5;
      const lawOwnerHonest =
        alignedState.lawOwner?.includes("fs-solid::Rod") === true &&
        alignedState.lawOwner?.includes("topology-only") === true;
      mechanismInteraction = {
        available: true,
        kind: "remote-center-contact-and-local-wrist-contrast",
        alignedState,
        defaultRemoteState,
        localWristState,
        restoredRemoteState,
        approachState,
        aligned,
        remotePivotHeld,
        localStateObserved,
        localPivotSweepsTip,
        remoteRestored,
        approachSeparated,
        lawOwnerHonest,
        localScreenshotPath,
        approachScreenshotPath,
      };
      mechanismInteractionValid =
        aligned &&
        remotePivotHeld &&
        localPivotSweepsTip &&
        remoteRestored &&
        approachSeparated &&
        lawOwnerHonest;
    }

    if (patentId === "us-4341502-makino-scara") {
      const makinoSurface = surface.getByTestId("makino-scara-three");
      const readMakinoState = () =>
        makinoSurface.evaluate((element) => ({
          topology: element.getAttribute("data-topology"),
          baseAxisGap: Number(element.getAttribute("data-base-axis-gap")),
          firstLinkLength: Number(element.getAttribute("data-first-link-length")),
          fourthLinkLength: Number(element.getAttribute("data-fourth-link-length")),
          secondLinkLength: Number(element.getAttribute("data-second-link-length")),
          thirdLinkLength: Number(element.getAttribute("data-third-link-length")),
          toolPivotGap: Number(element.getAttribute("data-tool-pivot-gap")),
          fixedMemberError: Number(element.getAttribute("data-fixed-member-error")),
          toolAttitudeDeg: Number(element.getAttribute("data-tool-attitude-deg")),
          beltTransmission: element.getAttribute("data-belt-transmission"),
          baseFloorGap: Number(element.getAttribute("data-base-floor-gap")),
          lawOwner: element.getAttribute("data-law-owner"),
        }));

      // Restore the source-default configuration after the generic θ₁ probe,
      // then exercise the dependent belt coordinate and both independent
      // nonconcentric claim forms without changing any hidden model state.
      await surface.getByRole("button", { name: "Reset" }).click();
      await page.waitForTimeout(100);
      const concentricState = await readMakinoState();

      const attitude = surface.getByLabel("Tool attitude");
      await attitude.focus();
      await attitude.press("End");
      const attitudeObserved = await page
        .waitForFunction(
          () =>
            Number(
              document
                .querySelector('[data-testid="makino-scara-three"]')
                ?.getAttribute("data-tool-attitude-deg"),
            ) === 180,
          undefined,
          { timeout: 3_000 },
        )
        .then(() => true)
        .catch(() => false);
      const beltState = await readMakinoState();
      const beltScreenshotPath = path.join(
        SCREENSHOT_DIRECTORY,
        `${patentId}.${viewport}.claim-2-belt-attitude.png`,
      );
      await dispatcher.screenshot({ path: beltScreenshotPath });

      const topologySelect = surface.getByLabel("Claim topology");
      await topologySelect.selectOption("2");
      await page.waitForFunction(
        () =>
          document
            .querySelector('[data-testid="makino-scara-three"]')
            ?.getAttribute("data-topology") === "claim-3-offset",
      );
      const offsetState = await readMakinoState();
      const offsetScreenshotPath = path.join(
        SCREENSHOT_DIRECTORY,
        `${patentId}.${viewport}.claim-3-offset.png`,
      );
      await dispatcher.screenshot({ path: offsetScreenshotPath });

      await topologySelect.selectOption("3");
      await page.waitForFunction(
        () =>
          document
            .querySelector('[data-testid="makino-scara-three"]')
            ?.getAttribute("data-topology") === "claim-6-y-link",
      );
      const yLinkState = await readMakinoState();
      const yLinkScreenshotPath = path.join(
        SCREENSHOT_DIRECTORY,
        `${patentId}.${viewport}.claim-6-y-link.png`,
      );
      await dispatcher.screenshot({ path: yLinkScreenshotPath });
      await surface.getByRole("button", { name: "Reset" }).click();
      const restoredState = await readMakinoState();

      const near = (value: number, target: number) => Math.abs(value - target) < 1e-9;
      const memberClosureHolds = (...states: Awaited<ReturnType<typeof readMakinoState>>[]) =>
        states.every(
          (state) =>
            state.fixedMemberError < 1e-9 &&
            near(state.firstLinkLength, 1) &&
            near(state.fourthLinkLength, 1),
        );
      const concentricConnected =
        concentricState.topology === "claim-1-concentric" &&
        near(concentricState.baseAxisGap, 0) &&
        near(concentricState.secondLinkLength, 1) &&
        near(concentricState.thirdLinkLength, 1) &&
        near(concentricState.toolPivotGap, 0) &&
        near(concentricState.baseFloorGap, 0) &&
        concentricState.beltTransmission === "connected";
      const beltCoordinateIndependent =
        attitudeObserved &&
        near(beltState.toolAttitudeDeg, 180) &&
        beltState.beltTransmission === "connected" &&
        near(beltState.fixedMemberError, concentricState.fixedMemberError);
      const offsetConnected =
        offsetState.topology === "claim-3-offset" &&
        near(offsetState.baseAxisGap, 0.72) &&
        near(offsetState.secondLinkLength, 1.4) &&
        near(offsetState.thirdLinkLength, 1.4) &&
        near(offsetState.toolPivotGap, 0) &&
        offsetState.beltTransmission === "connected";
      const yLinkConnected =
        yLinkState.topology === "claim-6-y-link" &&
        near(yLinkState.baseAxisGap, 0.72) &&
        near(yLinkState.secondLinkLength, 1) &&
        near(yLinkState.thirdLinkLength, 1) &&
        near(yLinkState.toolPivotGap, 0.72) &&
        near(yLinkState.toolAttitudeDeg, 0) &&
        yLinkState.beltTransmission === "claim-6-fixed";
      const lawOwnerHonest =
        concentricState.lawOwner?.includes("fs-mbd::JointModel::revolute") === true &&
        concentricState.lawOwner?.includes("closed-chain SI dynamics refused") === true;
      const restored =
        restoredState.topology === "claim-1-concentric" && near(restoredState.toolAttitudeDeg, 0);
      mechanismInteraction = {
        available: true,
        kind: "connected-four-link-belt-and-y-link-topologies",
        concentricState,
        beltState,
        offsetState,
        yLinkState,
        restoredState,
        memberClosureHolds: memberClosureHolds(concentricState, beltState, offsetState, yLinkState),
        concentricConnected,
        beltCoordinateIndependent,
        offsetConnected,
        yLinkConnected,
        lawOwnerHonest,
        restored,
        beltScreenshotPath,
        offsetScreenshotPath,
        yLinkScreenshotPath,
      };
      mechanismInteractionValid =
        memberClosureHolds(concentricState, beltState, offsetState, yLinkState) &&
        concentricConnected &&
        beltCoordinateIndependent &&
        offsetConnected &&
        yLinkConnected &&
        lawOwnerHonest &&
        restored;
    }

    if (patentId === "us-4512709-milacron-robot-toolchanger") {
      const milacronSurface = surface.getByTestId("milacron-toolchanger-three");
      const registration = surface.getByLabel("Tool-base registration fraction");
      const slide = surface.getByLabel("Locking slide fraction");
      const toolPresent = surface.getByLabel("Tool base present");
      const readMilacronState = () =>
        milacronSurface.evaluate((element) => ({
          sequenceValid: element.getAttribute("data-milacron-sequence-valid"),
          registrationBlocked: element.getAttribute("data-milacron-registration-blocked"),
          registration: Number(element.getAttribute("data-milacron-registration-effective")),
          slide: Number(element.getAttribute("data-milacron-slide-effective")),
          retained: element.getAttribute("data-milacron-tool-retained"),
          wristFloorGap: Number(element.getAttribute("data-milacron-wrist-floor-gap")),
          rackFloorGap: Number(element.getAttribute("data-milacron-rack-floor-gap")),
          jointOwner: element.getAttribute("data-milacron-frankensim-joint-owner"),
          contactOwner: element.getAttribute("data-milacron-frankensim-contact-owner"),
          boundary: element.getAttribute("data-milacron-frankensim-boundary"),
        }));

      // Restore the source-default captured state after the generic range
      // probe, then execute the only physically admissible release/exchange
      // order. Disabled-control assertions prove the UI cannot ask a retained
      // head to pass through a non-aligned aperture.
      await surface.getByRole("button", { name: "Reset" }).click();
      await page.waitForTimeout(100);
      const lockedState = await readMilacronState();
      const lockedInterlocks =
        (await registration.isDisabled()) &&
        (await toolPresent.isDisabled()) &&
        !(await slide.isDisabled());

      await slide.focus();
      await slide.press("Home");
      await page.waitForFunction(
        () =>
          document
            .querySelector('[data-testid="milacron-toolchanger-three"]')
            ?.getAttribute("data-milacron-slide-effective") === "0.000",
      );
      const releasedState = await readMilacronState();
      const releasedScreenshotPath = path.join(
        SCREENSHOT_DIRECTORY,
        `${patentId}.${viewport}.aperture-aligned-release.png`,
      );
      await dispatcher.screenshot({ path: releasedScreenshotPath });

      await registration.focus();
      await registration.press("Home");
      await page.waitForFunction(
        () =>
          document
            .querySelector('[data-testid="milacron-toolchanger-three"]')
            ?.getAttribute("data-milacron-registration-effective") === "0.000",
      );
      const withdrawnState = await readMilacronState();
      const withdrawnInterlocks = !(await toolPresent.isDisabled()) && (await slide.isDisabled());
      const withdrawnScreenshotPath = path.join(
        SCREENSHOT_DIRECTORY,
        `${patentId}.${viewport}.tool-withdrawn.png`,
      );
      await dispatcher.screenshot({ path: withdrawnScreenshotPath });

      await toolPresent.uncheck();
      const absentState = await readMilacronState();
      await toolPresent.check();
      await registration.focus();
      await registration.press("End");
      const reseatedState = await readMilacronState();
      await slide.focus();
      await slide.press("End");
      const relockedState = await readMilacronState();

      await surface.getByRole("button", { name: "Lock" }).click();
      const lockCutawayScreenshotPath = path.join(
        SCREENSHOT_DIRECTORY,
        `${patentId}.${viewport}.lock-cutaway.png`,
      );
      await dispatcher.screenshot({ path: lockCutawayScreenshotPath });
      await surface.getByRole("button", { name: "Rack" }).click();
      const rackScreenshotPath = path.join(
        SCREENSHOT_DIRECTORY,
        `${patentId}.${viewport}.supported-rack-tools.png`,
      );
      await dispatcher.screenshot({ path: rackScreenshotPath });
      await surface.getByRole("button", { name: "Reset" }).click();

      const nearZero = (value: number) => Math.abs(value) < 1e-9;
      const sourceOwnersHonest =
        lockedState.jointOwner?.includes("fs-mbd::JointModel::prismatic") === true &&
        lockedState.contactOwner?.includes("fs-contact::normal_patch") === true &&
        lockedState.boundary?.includes("SI actuation and wedge retention refused") === true;
      const supportChainClosed =
        nearZero(lockedState.wristFloorGap) && nearZero(lockedState.rackFloorGap);
      const sequenceCompleted =
        lockedState.registration === 1 &&
        lockedState.slide === 1 &&
        lockedState.retained === "true" &&
        releasedState.registration === 1 &&
        releasedState.slide === 0 &&
        releasedState.retained === "false" &&
        withdrawnState.registration === 0 &&
        withdrawnState.slide === 0 &&
        absentState.registration === 0 &&
        reseatedState.registration === 1 &&
        reseatedState.slide === 0 &&
        relockedState.registration === 1 &&
        relockedState.slide === 1 &&
        relockedState.retained === "true";
      mechanismInteraction = {
        available: true,
        kind: "interlocked-release-withdraw-insert-and-ramp-capture",
        lockedState,
        releasedState,
        withdrawnState,
        absentState,
        reseatedState,
        relockedState,
        lockedInterlocks,
        withdrawnInterlocks,
        sourceOwnersHonest,
        supportChainClosed,
        sequenceCompleted,
        releasedScreenshotPath,
        withdrawnScreenshotPath,
        lockCutawayScreenshotPath,
        rackScreenshotPath,
      };
      mechanismInteractionValid =
        lockedInterlocks &&
        withdrawnInterlocks &&
        sourceOwnersHonest &&
        supportChainClosed &&
        sequenceCompleted;
    }

    if (patentId === "us-4575330-hull-stereolithography") {
      const hullSurface = surface.getByTestId("hull-stereolithography-three");
      const scanX = surface.getByLabel(/^Scan spot X/);
      const scanZ = surface.getByLabel(/^Scan spot Z/);
      const recoat = surface.getByLabel(/^Recoating excursion/);
      const laminae = surface.getByLabel(/^Illustrative laminae/);
      const readHullState = () =>
        hullSurface.evaluate((element) => ({
          apparatusState: element.getAttribute("data-hull-apparatus-state"),
          shutterRequested: element.getAttribute("data-hull-shutter-requested"),
          shutterEffective: element.getAttribute("data-hull-shutter-effective"),
          shutterInterlock: element.getAttribute("data-hull-shutter-interlock"),
          scanX: Number(element.getAttribute("data-hull-scan-x")),
          scanZ: Number(element.getAttribute("data-hull-scan-z")),
          platformDepth: Number(element.getAttribute("data-hull-platform-depth")),
          laminaCount: Number(element.getAttribute("data-hull-lamina-count")),
          platformCarriageGap: Number(element.getAttribute("data-hull-platform-carriage-gap")),
          laminaStackGap: Number(element.getAttribute("data-hull-lamina-stack-gap")),
          vatFloorGap: Number(element.getAttribute("data-hull-vat-floor-gap")),
          lightPathContinuous: element.getAttribute("data-hull-light-path-continuous"),
          elevatorOwner: element.getAttribute("data-hull-frankensim-elevator-owner"),
          opticalOwner: element.getAttribute("data-hull-frankensim-optical-owner"),
          boundary: element.getAttribute("data-hull-frankensim-boundary"),
        }));

      await surface.getByRole("button", { name: "Reset" }).click();
      await page.waitForTimeout(100);
      const defaultState = await readHullState();

      await surface.getByRole("button", { name: "Close shutter" }).click();
      await page.waitForFunction(
        () =>
          document
            .querySelector('[data-testid="hull-stereolithography-three"]')
            ?.getAttribute("data-hull-shutter-effective") === "closed",
      );
      const shutterClosedState = await readHullState();

      await scanX.focus();
      await scanX.press("End");
      await scanZ.focus();
      await scanZ.press("Home");
      await page.waitForFunction(() => {
        const element = document.querySelector('[data-testid="hull-stereolithography-three"]');
        return (
          element?.getAttribute("data-hull-scan-x") === "1.000" &&
          element.getAttribute("data-hull-scan-z") === "-1.000"
        );
      });
      const scannedState = await readHullState();
      const scannedScreenshotPath = path.join(
        SCREENSHOT_DIRECTORY,
        `${patentId}.${viewport}.plotter-corner.png`,
      );
      await dispatcher.screenshot({ path: scannedScreenshotPath });

      await surface.getByRole("button", { name: "Open shutter" }).click();
      await recoat.focus();
      await recoat.press("End");
      await page.waitForFunction(() => {
        const element = document.querySelector('[data-testid="hull-stereolithography-three"]');
        return (
          element?.getAttribute("data-hull-platform-depth") === "1.000" &&
          element.getAttribute("data-hull-shutter-interlock") === "active" &&
          element.getAttribute("data-hull-shutter-effective") === "closed"
        );
      });
      const recoatState = await readHullState();
      const recoatScreenshotPath = path.join(
        SCREENSHOT_DIRECTORY,
        `${patentId}.${viewport}.supported-recoat-interlock.png`,
      );
      await dispatcher.screenshot({ path: recoatScreenshotPath });

      await laminae.focus();
      await laminae.press("End");
      await recoat.focus();
      await recoat.press("Home");
      await page.waitForFunction(() => {
        const element = document.querySelector('[data-testid="hull-stereolithography-three"]');
        return (
          element?.getAttribute("data-hull-platform-depth") === "0.000" &&
          element.getAttribute("data-hull-lamina-count") === "12" &&
          element.getAttribute("data-hull-shutter-effective") === "open"
        );
      });
      const returnedState = await readHullState();
      const returnedScreenshotPath = path.join(
        SCREENSHOT_DIRECTORY,
        `${patentId}.${viewport}.twelve-supported-laminae.png`,
      );
      await dispatcher.screenshot({ path: returnedScreenshotPath });

      await surface.getByRole("button", { name: "Lamp & fiber" }).click();
      const opticsScreenshotPath = path.join(
        SCREENSHOT_DIRECTORY,
        `${patentId}.${viewport}.mercury-lamp-fiber-path.png`,
      );
      await dispatcher.screenshot({ path: opticsScreenshotPath });
      await surface.getByRole("button", { name: "Reset" }).click();
      const restoredState = await readHullState();

      await dispatcher.getByRole("button", { name: "2D Technical Diagram" }).click();
      const hullDiagram = dispatcher.getByTestId("hull-stereolithography-two");
      await hullDiagram.waitFor({ state: "visible", timeout: 20_000 });
      await hullDiagram.getByRole("button", { name: "Figs. 1–2 sequence" }).click();
      const sequenceText = (await hullDiagram.textContent()) ?? "";
      const sequenceScreenshotPath = path.join(
        SCREENSHOT_DIRECTORY,
        `${patentId}.${viewport}.source-flow-sequence.png`,
      );
      await dispatcher.screenshot({ path: sequenceScreenshotPath });
      await hullDiagram.getByRole("button", { name: "1986 source card" }).click();
      const sourceCardText = (await hullDiagram.textContent()) ?? "";
      const sourceCardScreenshotPath = path.join(
        SCREENSHOT_DIRECTORY,
        `${patentId}.${viewport}.preferred-source-card.png`,
      );
      await dispatcher.screenshot({ path: sourceCardScreenshotPath });
      await dispatcher.getByRole("button", { name: "3D Physics Simulation" }).click();
      await page.waitForFunction(
        () => {
          const candidate = document.querySelector(
            '[data-testid="hull-stereolithography-three"] canvas',
          );
          return Boolean(
            candidate && candidate instanceof HTMLCanvasElement && candidate.width > 1,
          );
        },
        undefined,
        { timeout: 20_000 },
      );

      const nearZero = (value: number) => Math.abs(value) < 1e-9;
      const supportChainClosed = [
        defaultState,
        shutterClosedState,
        scannedState,
        recoatState,
        returnedState,
      ].every(
        (state) =>
          nearZero(state.platformCarriageGap) &&
          nearZero(state.laminaStackGap) &&
          nearZero(state.vatFloorGap) &&
          state.lightPathContinuous === "true",
      );
      const sourceOwnersHonest =
        defaultState.elevatorOwner === "fs-mbd::JointModel::prismatic" &&
        defaultState.opticalOwner === "fs-render::volumes::beer_lambert" &&
        defaultState.boundary === "refused-unparameterized";
      const sourceSequenceCompleted =
        defaultState.shutterRequested === "open" &&
        defaultState.shutterEffective === "open" &&
        defaultState.shutterInterlock === "clear" &&
        defaultState.platformDepth === 0 &&
        shutterClosedState.shutterRequested === "closed" &&
        shutterClosedState.shutterEffective === "closed" &&
        scannedState.scanX === 1 &&
        scannedState.scanZ === -1 &&
        recoatState.shutterRequested === "open" &&
        recoatState.shutterEffective === "closed" &&
        recoatState.shutterInterlock === "active" &&
        recoatState.platformDepth === 1 &&
        returnedState.shutterEffective === "open" &&
        returnedState.shutterInterlock === "clear" &&
        returnedState.platformDepth === 0 &&
        returnedState.laminaCount === 12 &&
        restoredState.scanX === 0 &&
        restoredState.scanZ === 0 &&
        restoredState.platformDepth === 0 &&
        restoredState.laminaCount === 7;
      const sourceFlowComplete =
        sequenceText.includes("10") &&
        sequenceText.includes("Form one cross-sectional lamina") &&
        sequenceText.includes("11") &&
        sequenceText.includes("Integrate it with the previous lamina") &&
        sequenceText.includes("12") &&
        sequenceText.includes("Contain the responsive fluid") &&
        sequenceText.includes("13") &&
        sequenceText.includes("Apply stimulation as a graphic pattern") &&
        sequenceText.includes("14") &&
        sequenceText.includes("Superimpose successive adjacent laminae");
      const preferredSourceComplete =
        sourceCardText.includes("350 W mercury short-arc lamp") &&
        sourceCardText.includes("1 mm diameter") &&
        sourceCardText.includes("1 m long") &&
        sourceCardText.includes("UV transmitting") &&
        sourceCardText.includes("about 1 W/cm²") &&
        sourceCardText.includes("HP 9872 plotter") &&
        sourceCardText.includes("HP 3497A controller");
      mechanismInteraction = {
        available: true,
        kind: "source-bounded-shutter-plotter-recoat-and-supported-lamina-sequence",
        defaultState,
        shutterClosedState,
        scannedState,
        recoatState,
        returnedState,
        restoredState,
        supportChainClosed,
        sourceOwnersHonest,
        sourceSequenceCompleted,
        sourceFlowComplete,
        preferredSourceComplete,
        scannedScreenshotPath,
        recoatScreenshotPath,
        returnedScreenshotPath,
        opticsScreenshotPath,
        sequenceScreenshotPath,
        sourceCardScreenshotPath,
      };
      mechanismInteractionValid =
        supportChainClosed &&
        sourceOwnersHonest &&
        sourceSequenceCompleted &&
        sourceFlowComplete &&
        preferredSourceComplete;
    }

    if (patentId === "us-4765668-robot-end-effector") {
      const endEffector = surface.getByTestId("robot-end-effector-three");
      const jaw = surface.getByLabel("Jaw opening fraction", { exact: true });
      const fingers = surface.getByLabel("Finger-change sequence", { exact: true });
      const transverse = surface.getByLabel(
        "Source-described transverse stage normalized position",
        { exact: true },
      );
      const roll = surface.getByLabel("Longitudinal-axis frame rotation", { exact: true });
      const readEndEffectorState = () =>
        endEffector.evaluate((element) => ({
          topology: element.getAttribute("data-robot-end-effector-topology"),
          jawGapMm: Number(element.getAttribute("data-robot-end-effector-jaw-gap-mm")),
          midpointMm: Number(element.getAttribute("data-robot-end-effector-midpoint-mm")),
          fingerRetained: Number(element.getAttribute("data-robot-end-effector-finger-retained")),
          fingerWithdrawal: element.getAttribute("data-robot-end-effector-finger-withdrawal"),
          transverse: Number(element.getAttribute("data-robot-end-effector-transverse")),
          rollDeg: Number(element.getAttribute("data-robot-end-effector-roll-deg")),
          helicalOwner: element.getAttribute("data-robot-end-effector-helical-owner"),
          rollOwner: element.getAttribute("data-robot-end-effector-roll-owner"),
          transverseOwner: element.getAttribute("data-robot-end-effector-transverse-owner"),
          contactOwner: element.getAttribute("data-robot-end-effector-contact-owner"),
          boundary: element.getAttribute("data-robot-end-effector-boundary"),
          support: element.getAttribute("data-robot-end-effector-support"),
        }));

      await surface.getByRole("button", { name: "Reset", exact: true }).click();
      const defaultState = await readEndEffectorState();

      await jaw.focus();
      await jaw.press("Home");
      await page.waitForFunction(
        () =>
          document
            .querySelector('[data-testid="robot-end-effector-three"]')
            ?.getAttribute("data-robot-end-effector-jaw-gap-mm") === "0.0",
      );
      const closedState = await readEndEffectorState();
      const closedScreenshotPath = path.join(
        SCREENSHOT_DIRECTORY,
        `${patentId}.${viewport}.zero-gap-no-interpenetration.png`,
      );
      await dispatcher.screenshot({ path: closedScreenshotPath });

      await fingers.focus();
      await fingers.press("End");
      await page.waitForFunction(
        () =>
          document
            .querySelector('[data-testid="robot-end-effector-three"]')
            ?.getAttribute("data-robot-end-effector-finger-retained") === "0.000",
      );
      await surface.getByRole("button", { name: "finger", exact: true }).click();
      const withdrawnState = await readEndEffectorState();
      const withdrawnScreenshotPath = path.join(
        SCREENSHOT_DIRECTORY,
        `${patentId}.${viewport}.inward-dovetail-withdrawal.png`,
      );
      await dispatcher.screenshot({ path: withdrawnScreenshotPath });

      await surface.getByRole("button", { name: "Reset", exact: true }).click();
      await transverse.focus();
      await transverse.press("End");
      await roll.focus();
      await roll.press("End");
      await page.waitForFunction(() => {
        const element = document.querySelector('[data-testid="robot-end-effector-three"]');
        return (
          element?.getAttribute("data-robot-end-effector-transverse") === "1.000" &&
          element.getAttribute("data-robot-end-effector-roll-deg") === "180"
        );
      });
      const translatedAndRolledState = await readEndEffectorState();
      const translatedAndRolledScreenshotPath = path.join(
        SCREENSHOT_DIRECTORY,
        `${patentId}.${viewport}.guided-transverse-and-roll.png`,
      );
      await dispatcher.screenshot({ path: translatedAndRolledScreenshotPath });

      await dispatcher.getByRole("button", { name: "2D Technical Diagram" }).click();
      const twoDimensional = dispatcher.getByTestId("robot-end-effector-two");
      await twoDimensional.waitFor({ state: "visible", timeout: 20_000 });
      const twoDimensionalState = await twoDimensional.evaluate((element) => ({
        topology: element.getAttribute("data-robot-end-effector-topology"),
        jawGapMm: Number(element.getAttribute("data-robot-end-effector-jaw-gap-mm")),
        midpointMm: Number(element.getAttribute("data-robot-end-effector-midpoint-mm")),
        transverse: Number(element.getAttribute("data-robot-end-effector-transverse")),
        rollDeg: Number(element.getAttribute("data-robot-end-effector-roll-deg")),
        helicalOwner: element.getAttribute("data-robot-end-effector-helical-owner"),
        contactOwner: element.getAttribute("data-robot-end-effector-contact-owner"),
        support: element.getAttribute("data-robot-end-effector-support"),
      }));
      const twoDimensionalScreenshotPath = path.join(
        SCREENSHOT_DIRECTORY,
        `${patentId}.${viewport}.shared-two-dimensional-state.png`,
      );
      await dispatcher.screenshot({ path: twoDimensionalScreenshotPath });
      await dispatcher.getByRole("button", { name: "3D Physics Simulation" }).click();
      await endEffector.waitFor({ state: "visible", timeout: 20_000 });

      const mechanismClaimToggle = dispatcher
        .getByTestId("claim-constraint-toggle")
        .locator("button")
        .first();
      await mechanismClaimToggle.click();
      await page.waitForFunction(
        () =>
          document
            .querySelector('[data-testid="robot-end-effector-three"]')
            ?.getAttribute("data-robot-end-effector-topology") === "withheld",
      );
      const invertedState = await readEndEffectorState();
      const invertedScreenshotPath = path.join(
        SCREENSHOT_DIRECTORY,
        `${patentId}.${viewport}.claim-one-topology-withheld.png`,
      );
      await dispatcher.screenshot({ path: invertedScreenshotPath });
      await mechanismClaimToggle.click();
      await page.waitForFunction(
        () =>
          document
            .querySelector('[data-testid="robot-end-effector-three"]')
            ?.getAttribute("data-robot-end-effector-topology") === "present",
      );
      const restoredState = await readEndEffectorState();

      const sourceOwnersHonest =
        defaultState.helicalOwner === "fs-mbd::JointModel::helical" &&
        defaultState.rollOwner === "fs-mbd::JointModel::revolute" &&
        defaultState.transverseOwner === "fs-mbd::JointModel::prismatic" &&
        defaultState.contactOwner === "fs-contact::normal_patch" &&
        defaultState.boundary === "refused-unparameterized";
      const physicalSequenceCompleted =
        defaultState.topology === "present" &&
        defaultState.jawGapMm === 79.2 &&
        defaultState.midpointMm === 0 &&
        defaultState.fingerRetained === 1 &&
        defaultState.fingerWithdrawal === "inward" &&
        defaultState.support === "two-guides-engaged" &&
        closedState.jawGapMm === 0 &&
        closedState.topology === "present" &&
        withdrawnState.jawGapMm === 0 &&
        withdrawnState.fingerRetained === 0 &&
        translatedAndRolledState.transverse === 1 &&
        translatedAndRolledState.rollDeg === 180 &&
        invertedState.topology === "withheld" &&
        restoredState.topology === "present";
      const crossFaceParity =
        twoDimensionalState.topology === translatedAndRolledState.topology &&
        twoDimensionalState.jawGapMm === translatedAndRolledState.jawGapMm &&
        twoDimensionalState.midpointMm === translatedAndRolledState.midpointMm &&
        twoDimensionalState.transverse === translatedAndRolledState.transverse &&
        twoDimensionalState.rollDeg === translatedAndRolledState.rollDeg &&
        twoDimensionalState.helicalOwner === translatedAndRolledState.helicalOwner &&
        twoDimensionalState.contactOwner === translatedAndRolledState.contactOwner &&
        twoDimensionalState.support === translatedAndRolledState.support;
      mechanismInteraction = {
        available: true,
        kind: "opposed-helical-gap-inward-finger-release-guided-translation-roll-and-claim-withholding",
        defaultState,
        closedState,
        withdrawnState,
        translatedAndRolledState,
        twoDimensionalState,
        invertedState,
        restoredState,
        sourceOwnersHonest,
        physicalSequenceCompleted,
        crossFaceParity,
        closedScreenshotPath,
        withdrawnScreenshotPath,
        translatedAndRolledScreenshotPath,
        twoDimensionalScreenshotPath,
        invertedScreenshotPath,
      };
      mechanismInteractionValid =
        sourceOwnersHonest && physicalSequenceCompleted && crossFaceParity;
    }

    if (patentId === "us-4921293-salisbury-robot-hand") {
      const readSalisburyState = (testId: string) =>
        dispatcher.getByTestId(testId).evaluate((element) => ({
          routing: element.getAttribute("data-salisbury-routing"),
          idler: element.getAttribute("data-salisbury-idler"),
          activeJoints: Number(element.getAttribute("data-salisbury-active-joints")),
          activeCableEnds: Number(element.getAttribute("data-salisbury-active-cable-ends")),
          sourceLaw: element.getAttribute("data-salisbury-source-law"),
          runtimeSource: element.getAttribute("data-salisbury-runtime-source"),
          tensionT1N: Number(element.getAttribute("data-salisbury-t1")),
          torques: element.getAttribute("data-salisbury-torques"),
          topologyOwner: element.getAttribute("data-salisbury-topology-owner"),
          revoluteOwner: element.getAttribute("data-salisbury-revolute-owner"),
          contactOwner: element.getAttribute("data-salisbury-contact-owner"),
          contactBoundary: element.getAttribute("data-salisbury-contact-boundary"),
        }));
      const threeDimensional = dispatcher.getByTestId("salisbury-robot-hand-three");
      await page.waitForFunction(
        () =>
          document
            .querySelector('[data-testid="salisbury-robot-hand-three"]')
            ?.getAttribute("data-salisbury-runtime-source") === "wasm",
        undefined,
        { timeout: 10_000 },
      );
      await surface.getByRole("button", { name: "Reset Baseline", exact: true }).click();
      const defaultState = await readSalisburyState("salisbury-robot-hand-three");

      const tensionT1 = surface.getByLabel("Cable tension T1", { exact: true });
      await tensionT1.focus();
      await tensionT1.press("End");
      await page.waitForFunction(
        () =>
          document
            .querySelector('[data-testid="salisbury-robot-hand-three"]')
            ?.getAttribute("data-salisbury-t1") === "40.0",
      );
      const tensionedState = await readSalisburyState("salisbury-robot-hand-three");

      const claimToggle = dispatcher.getByTestId("claim-constraint-toggle");
      const claimTwoToggle = claimToggle.locator('[data-claim-number="2"]');
      await claimTwoToggle.click();
      await page.waitForFunction(
        () =>
          document
            .querySelector('[data-testid="salisbury-robot-hand-three"]')
            ?.getAttribute("data-salisbury-idler") === "released",
      );
      const releasedIdlerState = await readSalisburyState("salisbury-robot-hand-three");
      const releasedIdlerScreenshotPath = path.join(
        SCREENSHOT_DIRECTORY,
        `${patentId}.${viewport}.claim-two-idler-released.png`,
      );
      await dispatcher.screenshot({ path: releasedIdlerScreenshotPath });

      await dispatcher.getByRole("button", { name: "2D Technical Diagram" }).click();
      const twoDimensional = dispatcher.getByTestId("salisbury-robot-hand-two");
      await twoDimensional.waitFor({ state: "visible", timeout: 20_000 });
      const twoDimensionalReleasedState = await readSalisburyState("salisbury-robot-hand-two");
      const twoDimensionalReleasedScreenshotPath = path.join(
        SCREENSHOT_DIRECTORY,
        `${patentId}.${viewport}.shared-two-dimensional-idler-release.png`,
      );
      await dispatcher.screenshot({ path: twoDimensionalReleasedScreenshotPath });

      await dispatcher.getByRole("button", { name: "3D Physics Simulation" }).click();
      await threeDimensional.waitFor({ state: "visible", timeout: 20_000 });
      await claimTwoToggle.click();
      await page.waitForFunction(
        () =>
          document
            .querySelector('[data-testid="salisbury-robot-hand-three"]')
            ?.getAttribute("data-salisbury-idler") === "fixed",
      );

      const claimOneToggle = claimToggle.locator('[data-claim-number="1"]');
      await claimOneToggle.click();
      await page.waitForFunction(
        () =>
          document
            .querySelector('[data-testid="salisbury-robot-hand-three"]')
            ?.getAttribute("data-salisbury-routing") === "withheld",
      );
      const withheldRoutingState = await readSalisburyState("salisbury-robot-hand-three");
      const withheldRoutingScreenshotPath = path.join(
        SCREENSHOT_DIRECTORY,
        `${patentId}.${viewport}.claim-one-routing-withheld.png`,
      );
      await dispatcher.screenshot({ path: withheldRoutingScreenshotPath });

      await dispatcher.getByRole("button", { name: "2D Technical Diagram" }).click();
      await twoDimensional.waitFor({ state: "visible", timeout: 20_000 });
      const twoDimensionalWithheldState = await readSalisburyState("salisbury-robot-hand-two");
      const twoDimensionalWithheldScreenshotPath = path.join(
        SCREENSHOT_DIRECTORY,
        `${patentId}.${viewport}.shared-two-dimensional-routing-withheld.png`,
      );
      await dispatcher.screenshot({ path: twoDimensionalWithheldScreenshotPath });

      await dispatcher.getByRole("button", { name: "3D Physics Simulation" }).click();
      await threeDimensional.waitFor({ state: "visible", timeout: 20_000 });
      await claimOneToggle.click();
      await page.waitForFunction(
        () =>
          document
            .querySelector('[data-testid="salisbury-robot-hand-three"]')
            ?.getAttribute("data-salisbury-routing") === "present",
      );
      const restoredState = await readSalisburyState("salisbury-robot-hand-three");

      const sourceOwnersHonest =
        defaultState.topologyOwner === "fs-mbd::salisbury::step_salisbury_hand" &&
        defaultState.revoluteOwner === "fs-mbd::articulated::JointModel::revolute" &&
        defaultState.contactOwner === "fs-contact::normal_patch" &&
        defaultState.contactBoundary === "refused-unparameterized";
      const claimSequenceCompleted =
        defaultState.routing === "present" &&
        defaultState.idler === "fixed" &&
        defaultState.activeJoints === 9 &&
        defaultState.activeCableEnds === 12 &&
        defaultState.sourceLaw === "applicable" &&
        defaultState.runtimeSource === "wasm" &&
        tensionedState.tensionT1N === 40 &&
        releasedIdlerState.idler === "released" &&
        releasedIdlerState.routing === "present" &&
        releasedIdlerState.sourceLaw === "applicable" &&
        releasedIdlerState.torques === tensionedState.torques &&
        withheldRoutingState.routing === "withheld" &&
        withheldRoutingState.sourceLaw === "withheld" &&
        withheldRoutingState.activeJoints === 0 &&
        withheldRoutingState.activeCableEnds === 0 &&
        withheldRoutingState.idler === "withheld" &&
        withheldRoutingState.tensionT1N === 40 &&
        restoredState.routing === "present" &&
        restoredState.idler === "fixed" &&
        restoredState.tensionT1N === 40;
      const crossFaceParity =
        twoDimensionalReleasedState.routing === releasedIdlerState.routing &&
        twoDimensionalReleasedState.idler === releasedIdlerState.idler &&
        twoDimensionalReleasedState.tensionT1N === releasedIdlerState.tensionT1N &&
        twoDimensionalReleasedState.torques === releasedIdlerState.torques &&
        twoDimensionalReleasedState.runtimeSource === "wasm" &&
        twoDimensionalWithheldState.routing === withheldRoutingState.routing &&
        twoDimensionalWithheldState.sourceLaw === withheldRoutingState.sourceLaw &&
        twoDimensionalWithheldState.activeJoints === withheldRoutingState.activeJoints &&
        twoDimensionalWithheldState.activeCableEnds === withheldRoutingState.activeCableEnds &&
        twoDimensionalWithheldState.idler === withheldRoutingState.idler &&
        twoDimensionalWithheldState.runtimeSource === "ts-fallback" &&
        twoDimensionalWithheldState.tensionT1N === withheldRoutingState.tensionT1N;
      mechanismInteraction = {
        available: true,
        kind: "source-owned-tendon-map-visible-idler-predicate-and-cross-face-claim-withholding",
        defaultState,
        tensionedState,
        releasedIdlerState,
        twoDimensionalReleasedState,
        withheldRoutingState,
        twoDimensionalWithheldState,
        restoredState,
        sourceOwnersHonest,
        claimSequenceCompleted,
        crossFaceParity,
        releasedIdlerScreenshotPath,
        twoDimensionalReleasedScreenshotPath,
        withheldRoutingScreenshotPath,
        twoDimensionalWithheldScreenshotPath,
      };
      mechanismInteractionValid = sourceOwnersHonest && claimSequenceCompleted && crossFaceParity;
    }

    if (patentId === "us-4976582-clavel-delta-robot") {
      const readClavelState = (testId: string) =>
        dispatcher.getByTestId(testId).evaluate((element) => ({
          topology: element.getAttribute("data-clavel-topology"),
          pairedBars: element.getAttribute("data-clavel-paired-bars"),
          toolDrive: element.getAttribute("data-clavel-tool-drive"),
          barLength: Number(element.getAttribute("data-clavel-bar-length")),
          closureResidual: Number(element.getAttribute("data-clavel-closure-residual")),
          platformCenter: element.getAttribute("data-clavel-platform-center"),
          toolAngleRad: Number(element.getAttribute("data-clavel-tool-angle-rad")),
          runtimeSource: element.getAttribute("data-clavel-runtime-source"),
          topologyOwner: element.getAttribute("data-clavel-topology-owner"),
          frankenSimBoundary: element.getAttribute("data-clavel-frankensim-boundary"),
          worldSupport: element.getAttribute("data-clavel-world-support"),
        }));
      const threeDimensional = dispatcher.getByTestId("clavel-delta-robot-three");
      await threeDimensional.waitFor({ state: "visible", timeout: 20_000 });
      const ensureThreeControlsVisible = async () => {
        const controlDeck = dispatcher.locator('[data-clavel-delta-robot-control-deck="true"]');
        if (!(await controlDeck.isVisible())) {
          await dispatcher
            .getByRole("button", { name: "Show studio controls and notices", exact: true })
            .click();
          await controlDeck.waitFor({ state: "visible", timeout: 5_000 });
        }
      };
      const reset = dispatcher.getByRole("button", { name: "Reset", exact: true });
      await ensureThreeControlsVisible();
      await reset.click();
      const defaultState = await readClavelState("clavel-delta-robot-three");

      const armOne = dispatcher.getByLabel("Arm 1 normalized input", { exact: true });
      await armOne.focus();
      await armOne.press("End");
      await page.waitForFunction(
        (previousCenter) =>
          document
            .querySelector('[data-testid="clavel-delta-robot-three"]')
            ?.getAttribute("data-clavel-platform-center") !== previousCenter,
        defaultState.platformCenter,
      );
      const movedState = await readClavelState("clavel-delta-robot-three");

      const toolAxis = dispatcher.getByLabel("Tool-axis normalized input", { exact: true });
      await toolAxis.focus();
      await toolAxis.press("End");
      await page.waitForFunction(
        () =>
          document
            .querySelector('[data-testid="clavel-delta-robot-three"]')
            ?.getAttribute("data-clavel-tool-angle-rad") === "3.141593",
      );
      const toolRotatedState = await readClavelState("clavel-delta-robot-three");
      const toolRotationScreenshotPath = path.join(
        SCREENSHOT_DIRECTORY,
        `${patentId}.${viewport}.visible-working-member-axis-rotation.png`,
      );
      await dispatcher.screenshot({ path: toolRotationScreenshotPath });

      await ensureThreeControlsVisible();
      const claimToggle = dispatcher.getByTestId("claim-constraint-toggle");
      const claimTwoToggle = claimToggle.locator('[data-claim-number="2"]');
      await claimTwoToggle.click();
      await page.waitForFunction(
        () =>
          document
            .querySelector('[data-testid="clavel-delta-robot-three"]')
            ?.getAttribute("data-clavel-paired-bars") === "withheld",
      );
      const claimTwoWithheldState = await readClavelState("clavel-delta-robot-three");
      const claimTwoScreenshotPath = path.join(
        SCREENSHOT_DIRECTORY,
        `${patentId}.${viewport}.claim-two-second-bars-withheld.png`,
      );
      await dispatcher.screenshot({ path: claimTwoScreenshotPath });

      await dispatcher.getByRole("button", { name: "2D Technical Diagram" }).click();
      const twoDimensional = dispatcher.getByTestId("clavel-delta-robot-two");
      await twoDimensional.waitFor({ state: "visible", timeout: 20_000 });
      const twoDimensionalClaimTwoState = await readClavelState("clavel-delta-robot-two");
      const twoDimensionalScreenshotPath = path.join(
        SCREENSHOT_DIRECTORY,
        `${patentId}.${viewport}.shared-two-dimensional-closed-chain.png`,
      );
      await dispatcher.screenshot({ path: twoDimensionalScreenshotPath });

      await dispatcher.getByRole("button", { name: "3D Physics Simulation" }).click();
      await threeDimensional.waitFor({ state: "visible", timeout: 20_000 });
      await ensureThreeControlsVisible();
      await claimTwoToggle.click();
      await page.waitForFunction(
        () =>
          document
            .querySelector('[data-testid="clavel-delta-robot-three"]')
            ?.getAttribute("data-clavel-paired-bars") === "two-per-leg",
      );

      const claimEightToggle = claimToggle.locator('[data-claim-number="8"]');
      await claimEightToggle.click();
      await page.waitForFunction(
        () =>
          document
            .querySelector('[data-testid="clavel-delta-robot-three"]')
            ?.getAttribute("data-clavel-tool-drive") === "withheld",
      );
      const claimEightWithheldState = await readClavelState("clavel-delta-robot-three");
      const claimEightScreenshotPath = path.join(
        SCREENSHOT_DIRECTORY,
        `${patentId}.${viewport}.claim-eight-tool-drive-withheld.png`,
      );
      await dispatcher.screenshot({ path: claimEightScreenshotPath });
      await ensureThreeControlsVisible();
      await claimEightToggle.click();
      await page.waitForFunction(
        () =>
          document
            .querySelector('[data-testid="clavel-delta-robot-three"]')
            ?.getAttribute("data-clavel-tool-drive") === "present",
      );

      const claimOneToggle = claimToggle.locator('[data-claim-number="1"]');
      await claimOneToggle.click();
      await page.waitForFunction(() => {
        const element = document.querySelector('[data-testid="clavel-delta-robot-three"]');
        return (
          element?.getAttribute("data-clavel-topology") === "withheld" &&
          element.getAttribute("data-clavel-paired-bars") === "withheld" &&
          element.getAttribute("data-clavel-tool-drive") === "withheld"
        );
      });
      const claimOneWithheldState = await readClavelState("clavel-delta-robot-three");
      const claimOneScreenshotPath = path.join(
        SCREENSHOT_DIRECTORY,
        `${patentId}.${viewport}.claim-one-topology-withheld-fixed-base-supported.png`,
      );
      await dispatcher.screenshot({ path: claimOneScreenshotPath });

      await dispatcher.getByRole("button", { name: "2D Technical Diagram" }).click();
      await twoDimensional.waitFor({ state: "visible", timeout: 20_000 });
      const twoDimensionalClaimOneState = await readClavelState("clavel-delta-robot-two");
      await dispatcher.getByRole("button", { name: "3D Physics Simulation" }).click();
      await threeDimensional.waitFor({ state: "visible", timeout: 20_000 });
      await ensureThreeControlsVisible();
      await claimOneToggle.click();
      await page.waitForFunction(
        () =>
          document
            .querySelector('[data-testid="clavel-delta-robot-three"]')
            ?.getAttribute("data-clavel-topology") === "present",
      );
      const restoredState = await readClavelState("clavel-delta-robot-three");

      const sourceOwnersHonest =
        defaultState.topologyOwner === "classic-patents::stepClavelDeltaRobotTopology" &&
        defaultState.runtimeSource === "ts-normalized-closed-chain" &&
        defaultState.frankenSimBoundary === "fs-mbd::holonomic-loop-constraints-unavailable";
      const physicalSequenceCompleted =
        defaultState.topology === "present" &&
        defaultState.pairedBars === "two-per-leg" &&
        defaultState.toolDrive === "present" &&
        defaultState.worldSupport === "fixed-floor-gantry" &&
        defaultState.barLength > 1.6 &&
        defaultState.closureResidual <= 1e-9 &&
        movedState.platformCenter !== defaultState.platformCenter &&
        movedState.closureResidual <= 1e-9 &&
        Math.abs(toolRotatedState.toolAngleRad - Math.PI) < 1e-6 &&
        claimTwoWithheldState.topology === "present" &&
        claimTwoWithheldState.pairedBars === "withheld" &&
        claimTwoWithheldState.toolDrive === "present" &&
        claimEightWithheldState.topology === "present" &&
        claimEightWithheldState.pairedBars === "two-per-leg" &&
        claimEightWithheldState.toolDrive === "withheld" &&
        claimOneWithheldState.topology === "withheld" &&
        claimOneWithheldState.pairedBars === "withheld" &&
        claimOneWithheldState.toolDrive === "withheld" &&
        claimOneWithheldState.worldSupport === "fixed-floor-gantry" &&
        restoredState.topology === "present" &&
        restoredState.pairedBars === "two-per-leg" &&
        restoredState.toolDrive === "present";
      const crossFaceParity =
        twoDimensionalClaimTwoState.topology === claimTwoWithheldState.topology &&
        twoDimensionalClaimTwoState.pairedBars === claimTwoWithheldState.pairedBars &&
        twoDimensionalClaimTwoState.toolDrive === claimTwoWithheldState.toolDrive &&
        twoDimensionalClaimTwoState.barLength === claimTwoWithheldState.barLength &&
        twoDimensionalClaimTwoState.closureResidual === claimTwoWithheldState.closureResidual &&
        twoDimensionalClaimTwoState.platformCenter === claimTwoWithheldState.platformCenter &&
        twoDimensionalClaimTwoState.toolAngleRad === claimTwoWithheldState.toolAngleRad &&
        twoDimensionalClaimTwoState.runtimeSource === claimTwoWithheldState.runtimeSource &&
        twoDimensionalClaimTwoState.topologyOwner === claimTwoWithheldState.topologyOwner &&
        twoDimensionalClaimTwoState.frankenSimBoundary ===
          claimTwoWithheldState.frankenSimBoundary &&
        twoDimensionalClaimTwoState.worldSupport === "fixed-boundary-symbol" &&
        twoDimensionalClaimOneState.topology === claimOneWithheldState.topology &&
        twoDimensionalClaimOneState.pairedBars === claimOneWithheldState.pairedBars &&
        twoDimensionalClaimOneState.toolDrive === claimOneWithheldState.toolDrive;
      mechanismInteraction = {
        available: true,
        kind: "rigid-normalized-closed-chain-visible-tool-axis-fixed-world-support-and-claim-withholding",
        defaultState,
        movedState,
        toolRotatedState,
        claimTwoWithheldState,
        twoDimensionalClaimTwoState,
        claimEightWithheldState,
        claimOneWithheldState,
        twoDimensionalClaimOneState,
        restoredState,
        sourceOwnersHonest,
        physicalSequenceCompleted,
        crossFaceParity,
        toolRotationScreenshotPath,
        claimTwoScreenshotPath,
        twoDimensionalScreenshotPath,
        claimEightScreenshotPath,
        claimOneScreenshotPath,
      };
      mechanismInteractionValid =
        sourceOwnersHonest && physicalSequenceCompleted && crossFaceParity;
    }

    if (patentId === "us-5121329-crump-fdm") {
      const readCrumpState = (testId: string) =>
        dispatcher.getByTestId(testId).evaluate((element) => ({
          topology: element.getAttribute("data-crump-claim1-topology"),
          heating: element.getAttribute("data-crump-claim2-heating"),
          tip: element.getAttribute("data-crump-claim39-tip"),
          extruding: element.getAttribute("data-crump-extruding"),
          layerGapMm: Number(element.getAttribute("data-crump-layer-gap-mm")),
          flowMm3S: Number(element.getAttribute("data-crump-flow-mm3-s")),
          pressureMPa: Number(element.getAttribute("data-crump-pressure-mpa")),
          runtimeSource: element.getAttribute("data-crump-runtime-source"),
          capillaryOwner: element.getAttribute("data-crump-capillary-owner"),
          thermalOwner: element.getAttribute("data-crump-thermal-owner"),
          capillaryBoundary: element.getAttribute("data-crump-capillary-boundary"),
          thermalBoundary: element.getAttribute("data-crump-thermal-boundary"),
          worldSupport: element.getAttribute("data-crump-world-support"),
        }));
      const threeDimensional = dispatcher.getByTestId("crump-fdm-three");
      await threeDimensional.waitFor({ state: "visible", timeout: 20_000 });
      const claimToggle = dispatcher.getByTestId("claim-constraint-toggle");
      for (const claimNumber of [1, 2, 39]) {
        const toggle = claimToggle.locator(`[data-claim-number="${claimNumber}"]`);
        if ((await toggle.getAttribute("data-claim-active")) !== "true") await toggle.click();
      }
      await page
        .waitForFunction(
          () =>
            document
              .querySelector('[data-testid="crump-fdm-three"]')
              ?.getAttribute("data-crump-runtime-source") === "wasm",
          undefined,
          { timeout: 15_000 },
        )
        .catch(() => undefined);
      const defaultState = await readCrumpState("crump-fdm-three");

      const printSpeed = dispatcher.getByLabel(/Print Speed \(/);
      await printSpeed.focus();
      await printSpeed.press("End");
      await page.waitForFunction(
        (previousFlow) =>
          Number(
            document
              .querySelector('[data-testid="crump-fdm-three"]')
              ?.getAttribute("data-crump-flow-mm3-s"),
          ) > previousFlow,
        defaultState.flowMm3S,
      );
      const highSpeedState = await readCrumpState("crump-fdm-three");

      const claim39Toggle = claimToggle.locator('[data-claim-number="39"]');
      await claim39Toggle.click();
      await page.waitForFunction(
        () =>
          document
            .querySelector('[data-testid="crump-fdm-three"]')
            ?.getAttribute("data-crump-claim39-tip") === "rounded",
      );
      const roundedTipState = await readCrumpState("crump-fdm-three");
      const roundedTipScreenshotPath = path.join(
        SCREENSHOT_DIRECTORY,
        `${patentId}.${viewport}.claim-39-rounded-unsheared-comparison.png`,
      );
      await dispatcher.screenshot({ path: roundedTipScreenshotPath });

      await dispatcher.getByRole("button", { name: "2D Technical Diagram" }).click();
      const twoDimensional = dispatcher.getByTestId("crump-fdm-two");
      await twoDimensional.waitFor({ state: "visible", timeout: 20_000 });
      const twoDimensionalRoundedState = await readCrumpState("crump-fdm-two");
      const twoDimensionalScreenshotPath = path.join(
        SCREENSHOT_DIRECTORY,
        `${patentId}.${viewport}.shared-two-dimensional-rounded-outlet.png`,
      );
      await dispatcher.screenshot({ path: twoDimensionalScreenshotPath });

      await dispatcher.getByRole("button", { name: "3D Physics Simulation" }).click();
      await threeDimensional.waitFor({ state: "visible", timeout: 20_000 });
      await claim39Toggle.click();
      await page.waitForFunction(
        () =>
          document
            .querySelector('[data-testid="crump-fdm-three"]')
            ?.getAttribute("data-crump-claim39-tip") === "planar",
      );

      const claim2Toggle = claimToggle.locator('[data-claim-number="2"]');
      await claim2Toggle.click();
      await page.waitForFunction(() => {
        const element = document.querySelector('[data-testid="crump-fdm-three"]');
        return (
          element?.getAttribute("data-crump-claim2-heating") === "withheld" &&
          element.getAttribute("data-crump-extruding") === "false"
        );
      });
      const heatingWithheldState = await readCrumpState("crump-fdm-three");
      const heatingWithheldScreenshotPath = path.join(
        SCREENSHOT_DIRECTORY,
        `${patentId}.${viewport}.claim-2-heating-means-withheld.png`,
      );
      await dispatcher.screenshot({ path: heatingWithheldScreenshotPath });
      await claim2Toggle.click();

      const claim1Toggle = claimToggle.locator('[data-claim-number="1"]');
      await claim1Toggle.click();
      await page.waitForFunction(() => {
        const element = document.querySelector('[data-testid="crump-fdm-three"]');
        return (
          element?.getAttribute("data-crump-claim1-topology") === "withheld" &&
          element.getAttribute("data-crump-claim2-heating") === "withheld" &&
          element.getAttribute("data-crump-claim39-tip") === "rounded" &&
          element.getAttribute("data-crump-extruding") === "false"
        );
      });
      const topologyWithheldState = await readCrumpState("crump-fdm-three");
      const topologyWithheldScreenshotPath = path.join(
        SCREENSHOT_DIRECTORY,
        `${patentId}.${viewport}.claim-1-apparatus-topology-withheld.png`,
      );
      await dispatcher.screenshot({ path: topologyWithheldScreenshotPath });

      await dispatcher.getByRole("button", { name: "2D Technical Diagram" }).click();
      await twoDimensional.waitFor({ state: "visible", timeout: 20_000 });
      const twoDimensionalWithheldState = await readCrumpState("crump-fdm-two");
      await dispatcher.getByRole("button", { name: "3D Physics Simulation" }).click();
      await threeDimensional.waitFor({ state: "visible", timeout: 20_000 });
      await claim1Toggle.click();
      await page.waitForFunction(
        () =>
          document
            .querySelector('[data-testid="crump-fdm-three"]')
            ?.getAttribute("data-crump-claim1-topology") === "present",
      );
      const restoredState = await readCrumpState("crump-fdm-three");

      const sourceOwnersHonest =
        defaultState.capillaryOwner === "fs-flux::capillary::step_newtonian_circular_capillary" &&
        defaultState.thermalOwner === "fs-conduction::reduced_slab::step_first_mode_slab_cooling" &&
        defaultState.capillaryBoundary ===
          "newtonian-incompressible-fully-developed-laminar-no-slip-circular-land" &&
        defaultState.thermalBoundary ===
          "one-dimensional-fixed-boundary-first-mode-screen-no-phase-change" &&
        ["wasm", "ts-fallback"].includes(defaultState.runtimeSource ?? "");
      const physicalSequenceCompleted =
        defaultState.topology === "present" &&
        defaultState.heating === "present" &&
        defaultState.tip === "planar" &&
        defaultState.extruding === "true" &&
        defaultState.layerGapMm > 0 &&
        defaultState.flowMm3S > 0 &&
        defaultState.pressureMPa > 0 &&
        defaultState.worldSupport === "chassis-base-posts-crown" &&
        highSpeedState.flowMm3S > defaultState.flowMm3S &&
        roundedTipState.topology === "present" &&
        roundedTipState.heating === "present" &&
        roundedTipState.tip === "rounded" &&
        roundedTipState.extruding === "true" &&
        heatingWithheldState.topology === "present" &&
        heatingWithheldState.heating === "withheld" &&
        heatingWithheldState.extruding === "false" &&
        topologyWithheldState.topology === "withheld" &&
        topologyWithheldState.heating === "withheld" &&
        topologyWithheldState.tip === "rounded" &&
        topologyWithheldState.extruding === "false" &&
        restoredState.topology === "present" &&
        restoredState.heating === "present" &&
        restoredState.tip === "planar";
      const crossFaceParity =
        twoDimensionalRoundedState.topology === roundedTipState.topology &&
        twoDimensionalRoundedState.heating === roundedTipState.heating &&
        twoDimensionalRoundedState.tip === roundedTipState.tip &&
        twoDimensionalRoundedState.extruding === roundedTipState.extruding &&
        twoDimensionalRoundedState.layerGapMm === roundedTipState.layerGapMm &&
        twoDimensionalRoundedState.flowMm3S === roundedTipState.flowMm3S &&
        twoDimensionalRoundedState.pressureMPa === roundedTipState.pressureMPa &&
        twoDimensionalWithheldState.topology === topologyWithheldState.topology &&
        twoDimensionalWithheldState.heating === topologyWithheldState.heating &&
        twoDimensionalWithheldState.tip === topologyWithheldState.tip &&
        twoDimensionalWithheldState.extruding === topologyWithheldState.extruding;
      mechanismInteraction = {
        available: true,
        kind: "generic-capillary-and-thermal-wasm-close-gap-claim-topology-and-cross-face-parity",
        defaultState,
        highSpeedState,
        roundedTipState,
        twoDimensionalRoundedState,
        heatingWithheldState,
        topologyWithheldState,
        twoDimensionalWithheldState,
        restoredState,
        sourceOwnersHonest,
        physicalSequenceCompleted,
        crossFaceParity,
        roundedTipScreenshotPath,
        twoDimensionalScreenshotPath,
        heatingWithheldScreenshotPath,
        topologyWithheldScreenshotPath,
      };
      mechanismInteractionValid =
        sourceOwnersHonest && physicalSequenceCompleted && crossFaceParity;
    }

    if (patentId === "us-5701965-kamen-transporter") {
      const readKamenState = (testId: string) =>
        dispatcher.getByTestId(testId).evaluate((element) => ({
          state: element.getAttribute("data-kamen-state"),
          contactWheels: element.getAttribute("data-kamen-contact-wheels"),
          contactCount: Number(element.getAttribute("data-kamen-contact-count")),
          minimumGapM: Number(element.getAttribute("data-kamen-minimum-gap-m")),
          riserContactWheels: element.getAttribute("data-kamen-riser-contact-wheels"),
          riserContactCount: Number(element.getAttribute("data-kamen-riser-contact-count")),
          minimumRiserClearanceM:
            element.getAttribute("data-kamen-minimum-riser-clearance-m") === "not-applicable"
              ? null
              : Number(element.getAttribute("data-kamen-minimum-riser-clearance-m")),
          runtimeSource: element.getAttribute("data-kamen-runtime-source"),
          owner: element.getAttribute("data-kamen-owner"),
          boundary: element.getAttribute("data-kamen-boundary"),
          sourceFigure: element.getAttribute("data-kamen-source-figure"),
          axleXM: Number(element.getAttribute("data-kamen-axle-x-m")),
          axleYM: Number(element.getAttribute("data-kamen-axle-y-m")),
          carrierRotationRad: Number(element.getAttribute("data-kamen-carrier-rotation-rad")),
          chassisPitchRad: Number(element.getAttribute("data-kamen-chassis-pitch-rad")),
          stairActive: element.getAttribute("data-kamen-stair-active"),
          clusterTopology: element.getAttribute("data-kamen-cluster-topology"),
          balanceLoop: element.getAttribute("data-kamen-balance-loop"),
          wheelCount: element.getAttribute("data-kamen-wheel-count"),
          wheelRadiusM: Number(element.getAttribute("data-kamen-wheel-radius-m")),
          clusterRadiusM: Number(element.getAttribute("data-kamen-cluster-radius-m")),
          stairRiseM: Number(element.getAttribute("data-kamen-stair-rise-m")),
          stairTreadM: Number(element.getAttribute("data-kamen-stair-tread-m")),
        }));
      const threeDimensional = dispatcher.getByTestId("kamen-transporter-three");
      await threeDimensional.waitFor({ state: "visible", timeout: 20_000 });
      let claimToggle = dispatcher.getByTestId("claim-constraint-toggle");
      for (const claimNumber of [1, 16]) {
        const toggle = claimToggle.locator(`[data-claim-number="${claimNumber}"]`);
        if ((await toggle.getAttribute("data-claim-active")) !== "true") await toggle.click();
      }
      await page.waitForFunction(
        () =>
          document
            .querySelector('[data-testid="kamen-transporter-three"]')
            ?.getAttribute("data-kamen-runtime-source") === "wasm",
        undefined,
        { timeout: 15_000 },
      );

      const stateNames = [
        "ground_support",
        "balance",
        "stair_start",
        "weight_transfer",
        "climb",
        "transition",
      ] as const;
      const expectedContacts = ["a,b", "a", "a,b", "a,b", "b,c", "c"] as const;
      const expectedRiserContacts = ["", "", "a", "a", "b", ""] as const;
      const stateSnapshots: Awaited<ReturnType<typeof readKamenState>>[] = [];
      const stateScreenshotPaths: string[] = [];
      const kamenCanvas = threeDimensional.locator("canvas").first();
      const settleKamenCanvasForScreenshot = async () => {
        await kamenCanvas.scrollIntoViewIfNeeded();
        await page.evaluate(
          () =>
            new Promise<void>((resolve) => {
              requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
            }),
        );
      };
      for (const [index, stateName] of stateNames.entries()) {
        await dispatcher.locator("#kamen-3d-topology-state button").nth(index).click();
        await page.waitForFunction(
          ({ state }) =>
            document
              .querySelector('[data-testid="kamen-transporter-three"]')
              ?.getAttribute("data-kamen-state") === state,
          { state: stateName },
          { timeout: 3_000 },
        );
        const stateSnapshot = await readKamenState("kamen-transporter-three");
        stateSnapshots.push(stateSnapshot);
        if (index >= 2) {
          const stateScreenshotPath = path.join(
            SCREENSHOT_DIRECTORY,
            `${patentId}.${viewport}.${stateName.replaceAll("_", "-")}.png`,
          );
          // The shared Three.js studio intentionally skips rendering while it
          // is offscreen. Buttons below the canvas scroll it away, so put the
          // canvas back in view and allow two frames before preserving visual
          // evidence; otherwise Playwright can capture an unpainted buffer.
          await settleKamenCanvasForScreenshot();
          await dispatcher.screenshot({ path: stateScreenshotPath });
          stateScreenshotPaths.push(stateScreenshotPath);
        }
      }

      await dispatcher.locator("#kamen-3d-topology-state button").nth(4).click();
      await page.waitForFunction(
        () =>
          document
            .querySelector('[data-testid="kamen-transporter-three"]')
            ?.getAttribute("data-kamen-state") === "climb",
        undefined,
        { timeout: 3_000 },
      );
      await dispatcher.getByRole("button", { name: "2D Technical Diagram" }).click();
      const twoDimensional = dispatcher.getByTestId("kamen-transporter-two");
      await twoDimensional.waitFor({ state: "visible", timeout: 20_000 });
      await page.waitForFunction(
        () =>
          document
            .querySelector('[data-testid="kamen-transporter-two"]')
            ?.getAttribute("data-kamen-runtime-source") === "wasm",
        undefined,
        { timeout: 15_000 },
      );
      const twoDimensionalClimbState = await readKamenState("kamen-transporter-two");
      const twoDimensionalScreenshotPath = path.join(
        SCREENSHOT_DIRECTORY,
        `${patentId}.${viewport}.shared-two-dimensional-climb.png`,
      );
      await dispatcher.screenshot({ path: twoDimensionalScreenshotPath });

      await dispatcher.getByRole("button", { name: "3D Physics Simulation" }).click();
      await threeDimensional.waitFor({ state: "visible", timeout: 20_000 });
      claimToggle = dispatcher.getByTestId("claim-constraint-toggle");
      const claim16Toggle = claimToggle.locator('[data-claim-number="16"]');
      await claim16Toggle.click();
      await page.waitForFunction(
        () => {
          const element = document.querySelector('[data-testid="kamen-transporter-three"]');
          return (
            element?.getAttribute("data-kamen-cluster-topology") === "withheld" &&
            element.getAttribute("data-kamen-contact-wheels") === "direct"
          );
        },
        undefined,
        { timeout: 3_000 },
      );
      const clusterWithheldState = await readKamenState("kamen-transporter-three");
      const clusterWithheldScreenshotPath = path.join(
        SCREENSHOT_DIRECTORY,
        `${patentId}.${viewport}.claim-16-cluster-withheld-direct-support.png`,
      );
      await settleKamenCanvasForScreenshot();
      await dispatcher.screenshot({ path: clusterWithheldScreenshotPath });
      await claim16Toggle.click();

      await dispatcher.locator("#kamen-3d-topology-state button").nth(1).click();
      const claim1Toggle = claimToggle.locator('[data-claim-number="1"]');
      await claim1Toggle.click();
      await page.waitForFunction(
        () =>
          document
            .querySelector('[data-testid="kamen-transporter-three"]')
            ?.getAttribute("data-kamen-balance-loop") === "withheld",
        undefined,
        { timeout: 3_000 },
      );
      const balanceWithheldState = await readKamenState("kamen-transporter-three");
      const balanceWithheldScreenshotPath = path.join(
        SCREENSHOT_DIRECTORY,
        `${patentId}.${viewport}.claim-1-balance-loop-withheld.png`,
      );
      await settleKamenCanvasForScreenshot();
      await dispatcher.screenshot({ path: balanceWithheldScreenshotPath });
      await claim1Toggle.click();
      await page.waitForFunction(
        () =>
          document
            .querySelector('[data-testid="kamen-transporter-three"]')
            ?.getAttribute("data-kamen-balance-loop") === "active",
        undefined,
        { timeout: 3_000 },
      );
      const restoredState = await readKamenState("kamen-transporter-three");

      const sourceOwner = "fs-mbd::tri_wheel_cluster::step_tri_wheel_stair_contact";
      const sourceBoundary =
        "rigid-planar-three-equal-wheels-horizontal-support-and-finite-riser-clearance-no-force-friction-compliance-impact-motor-controller-or-sensor";
      const near = (value: number, target: number, tolerance = 1e-9) =>
        Math.abs(value - target) <= tolerance;
      const sourceOwnersHonest = stateSnapshots.every(
        (state) =>
          state.runtimeSource === "wasm" &&
          state.owner === sourceOwner &&
          state.boundary === sourceBoundary,
      );
      const physicalSequenceCompleted = stateSnapshots.every(
        (state, index) =>
          state.state === stateNames[index] &&
          state.contactWheels === expectedContacts[index] &&
          state.contactCount === expectedContacts[index]?.split(",").length &&
          state.minimumGapM >= -1e-8 &&
          state.riserContactWheels === expectedRiserContacts[index] &&
          state.riserContactCount ===
            (expectedRiserContacts[index] ? expectedRiserContacts[index]?.split(",").length : 0) &&
          (index >= 2
            ? state.minimumRiserClearanceM !== null && state.minimumRiserClearanceM >= -1e-8
            : state.minimumRiserClearanceM === null) &&
          state.clusterTopology === "present" &&
          state.wheelCount === "three-per-lateral-cluster" &&
          state.stairActive === (index >= 2 ? "true" : "false") &&
          near(state.wheelRadiusM, 0.096774, 1e-12) &&
          near(state.clusterRadiusM, 0.1417574, 1e-12) &&
          near(state.stairRiseM, 0.17399, 1e-12) &&
          near(state.stairTreadM, 0.27686, 1e-12),
      );
      const startState = stateSnapshots[2];
      const transferState = stateSnapshots[3];
      const transferChangesOnlyChassisPitch = Boolean(
        startState &&
          transferState &&
          near(startState.axleXM, transferState.axleXM) &&
          near(startState.axleYM, transferState.axleYM) &&
          near(startState.carrierRotationRad, transferState.carrierRotationRad) &&
          Math.abs(startState.chassisPitchRad - transferState.chassisPitchRad) > 1e-3,
      );
      const climbState = stateSnapshots[4];
      const crossFaceParity = Boolean(
        climbState &&
          twoDimensionalClimbState.state === climbState.state &&
          twoDimensionalClimbState.contactWheels === climbState.contactWheels &&
          twoDimensionalClimbState.contactCount === climbState.contactCount &&
          near(twoDimensionalClimbState.minimumGapM, climbState.minimumGapM) &&
          twoDimensionalClimbState.riserContactWheels === climbState.riserContactWheels &&
          twoDimensionalClimbState.riserContactCount === climbState.riserContactCount &&
          twoDimensionalClimbState.minimumRiserClearanceM !== null &&
          climbState.minimumRiserClearanceM !== null &&
          near(
            twoDimensionalClimbState.minimumRiserClearanceM,
            climbState.minimumRiserClearanceM,
          ) &&
          near(twoDimensionalClimbState.axleXM, climbState.axleXM) &&
          near(twoDimensionalClimbState.axleYM, climbState.axleYM) &&
          near(twoDimensionalClimbState.carrierRotationRad, climbState.carrierRotationRad) &&
          near(twoDimensionalClimbState.chassisPitchRad, climbState.chassisPitchRad) &&
          twoDimensionalClimbState.owner === climbState.owner &&
          twoDimensionalClimbState.boundary === climbState.boundary &&
          twoDimensionalClimbState.runtimeSource === "wasm",
      );
      const claimRefusalsRemainSupported =
        clusterWithheldState.clusterTopology === "withheld" &&
        clusterWithheldState.contactWheels === "direct" &&
        clusterWithheldState.contactCount === 1 &&
        clusterWithheldState.minimumGapM >= -1e-8 &&
        clusterWithheldState.minimumRiserClearanceM === null &&
        clusterWithheldState.riserContactCount === 0 &&
        clusterWithheldState.runtimeSource === "ts-fallback" &&
        balanceWithheldState.state === "balance" &&
        balanceWithheldState.clusterTopology === "present" &&
        balanceWithheldState.balanceLoop === "withheld" &&
        balanceWithheldState.contactWheels === "a" &&
        balanceWithheldState.minimumGapM >= -1e-8 &&
        balanceWithheldState.minimumRiserClearanceM === null &&
        balanceWithheldState.riserContactCount === 0 &&
        restoredState.balanceLoop === "active" &&
        restoredState.contactWheels === "a";
      mechanismInteraction = {
        available: true,
        kind: "source-dimensioned-three-wheel-fs-mbd-tread-and-riser-contact-sequence-claim-refusals-and-cross-face-parity",
        stateSnapshots,
        twoDimensionalClimbState,
        clusterWithheldState,
        balanceWithheldState,
        restoredState,
        sourceOwnersHonest,
        physicalSequenceCompleted,
        transferChangesOnlyChassisPitch,
        crossFaceParity,
        claimRefusalsRemainSupported,
        stateScreenshotPaths,
        twoDimensionalScreenshotPath,
        clusterWithheldScreenshotPath,
        balanceWithheldScreenshotPath,
      };
      mechanismInteractionValid =
        sourceOwnersHonest &&
        physicalSequenceCompleted &&
        transferChangesOnlyChassisPitch &&
        crossFaceParity &&
        claimRefusalsRemainSupported;
    }

    if (patentId === "us-2495429-spencer-microwave") {
      const readSpencerState = (testId: string) =>
        dispatcher.getByTestId(testId).evaluate((element) => ({
          sourcePath: element.getAttribute("data-source-path"),
          sourcePathContinuous: element.getAttribute("data-source-path-continuous"),
          wavelengthReferenceM: Number(element.getAttribute("data-source-wavelength-reference-m")),
          vacuumFrequencyHz: Number(
            element.getAttribute("data-vacuum-frequency-at-ten-centimeters-hz"),
          ),
          kernelSource: element.getAttribute("data-kernel-source"),
          quantitativeTubeModel: element.getAttribute("data-quantitative-tube-model"),
          quantitativeCookingModel: element.getAttribute("data-quantitative-cooking-model"),
          displayRateKind: element.getAttribute("data-display-rate-kind"),
        }));
      const threeDimensional = dispatcher.getByTestId("spencer-microwave-three");
      await threeDimensional.waitFor({ state: "visible", timeout: 20_000 });
      const defaultState = await readSpencerState("spencer-microwave-three");
      const energyToggle = threeDimensional.getByRole("button", {
        name: "Energy path enabled",
      });
      await energyToggle.click();
      await page.waitForFunction(
        () =>
          document
            .querySelector('[data-testid="spencer-microwave-three"]')
            ?.getAttribute("data-source-path") === "disabled",
        undefined,
        { timeout: 3_000 },
      );
      const disabledState = await readSpencerState("spencer-microwave-three");
      const disabledScreenshotPath = path.join(
        SCREENSHOT_DIRECTORY,
        `${patentId}.${viewport}.source-path-disabled.png`,
      );
      const spencerCanvas = threeDimensional.locator("canvas").first();
      await spencerCanvas.scrollIntoViewIfNeeded();
      await page.evaluate(
        () =>
          new Promise<void>((resolve) => {
            requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
          }),
      );
      await dispatcher.screenshot({ path: disabledScreenshotPath });

      await threeDimensional.getByRole("button", { name: "Energy path disabled" }).click();
      await page.waitForFunction(
        () =>
          document
            .querySelector('[data-testid="spencer-microwave-three"]')
            ?.getAttribute("data-source-path") === "active",
        undefined,
        { timeout: 3_000 },
      );
      const restoredState = await readSpencerState("spencer-microwave-three");

      await dispatcher.getByRole("button", { name: "2D Technical Diagram" }).click();
      const twoDimensional = dispatcher.getByTestId("spencer-microwave-two");
      await twoDimensional.waitFor({ state: "visible", timeout: 20_000 });
      const twoDimensionalState = await readSpencerState("spencer-microwave-two");
      const twoDimensionalScreenshotPath = path.join(
        SCREENSHOT_DIRECTORY,
        `${patentId}.${viewport}.source-bounded-two-dimensional.png`,
      );
      await dispatcher.screenshot({ path: twoDimensionalScreenshotPath });

      await dispatcher.getByRole("button", { name: "3D Physics Simulation" }).click();
      await threeDimensional.waitFor({ state: "visible", timeout: 20_000 });
      await spencerCanvas.scrollIntoViewIfNeeded();
      await page.evaluate(
        () =>
          new Promise<void>((resolve) => {
            requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
          }),
      );
      const restoredScreenshotPath = path.join(
        SCREENSHOT_DIRECTORY,
        `${patentId}.${viewport}.source-path-restored.png`,
      );
      await dispatcher.screenshot({ path: restoredScreenshotPath });

      const near = (value: number, target: number, tolerance = 1e-9) =>
        Math.abs(value - target) <= tolerance;
      const sourceBoundaryHonest =
        defaultState.sourcePath === "active" &&
        defaultState.sourcePathContinuous === "true" &&
        near(defaultState.wavelengthReferenceM, 0.1) &&
        near(defaultState.vacuumFrequencyHz, 2_997_924_580, 1e-3) &&
        defaultState.kernelSource === "source-bounded-ts" &&
        defaultState.quantitativeTubeModel === "refused" &&
        defaultState.quantitativeCookingModel === "refused" &&
        defaultState.displayRateKind === "normalized";
      const toggleSequenceCompleted =
        disabledState.sourcePath === "disabled" && restoredState.sourcePath === "active";
      const crossFaceParity =
        twoDimensionalState.sourcePath === restoredState.sourcePath &&
        twoDimensionalState.sourcePathContinuous === restoredState.sourcePathContinuous &&
        near(twoDimensionalState.wavelengthReferenceM, restoredState.wavelengthReferenceM) &&
        near(twoDimensionalState.vacuumFrequencyHz, restoredState.vacuumFrequencyHz, 1e-3) &&
        twoDimensionalState.kernelSource === restoredState.kernelSource &&
        twoDimensionalState.quantitativeTubeModel === restoredState.quantitativeTubeModel &&
        twoDimensionalState.quantitativeCookingModel === restoredState.quantitativeCookingModel;
      mechanismInteraction = {
        available: true,
        kind: "source-bounded-push-pull-guide-path-refusal-toggle-and-cross-face-parity",
        defaultState,
        disabledState,
        restoredState,
        twoDimensionalState,
        sourceBoundaryHonest,
        toggleSequenceCompleted,
        crossFaceParity,
        disabledScreenshotPath,
        twoDimensionalScreenshotPath,
        restoredScreenshotPath,
      };
      mechanismInteractionValid =
        sourceBoundaryHonest && toggleSequenceCompleted && crossFaceParity;
    }

    if (patentId === "us-6331181-davinci") {
      const readDaVinciInterfaceState = (testId: string) =>
        dispatcher.getByTestId(testId).evaluate((element) => ({
          status: element.getAttribute("data-interface-status"),
          compatibilitySignal: element.getAttribute("data-compatibility-signal"),
          calibrationRecord: element.getAttribute("data-calibration-record"),
          engagementSignal: element.getAttribute("data-engagement-signal"),
          processorCanConfigure: element.getAttribute("data-processor-can-configure"),
          kernelSource: element.getAttribute("data-kernel-source"),
          quantitativeMechanics: element.getAttribute("data-quantitative-mechanics"),
          connectedTopology: element.getAttribute("data-connected-topology"),
        }));
      const threeDimensional = dispatcher.getByTestId("davinci-interface-three");
      await threeDimensional.waitFor({ state: "visible", timeout: 20_000 });
      const defaultState = await readDaVinciInterfaceState("davinci-interface-three");
      const engagementToggle = threeDimensional
        .getByRole("button")
        .filter({ hasText: "Engagement confirmation" });
      await engagementToggle.click();
      await page.waitForFunction(
        () =>
          document
            .querySelector('[data-testid="davinci-interface-three"]')
            ?.getAttribute("data-interface-status") === "engagement-unconfirmed",
        undefined,
        { timeout: 3_000 },
      );
      const unconfirmedState = await readDaVinciInterfaceState("davinci-interface-three");
      const unconfirmedScreenshotPath = path.join(
        SCREENSHOT_DIRECTORY,
        `${patentId}.${viewport}.engagement-unconfirmed.png`,
      );
      const daVinciCanvas = threeDimensional.locator("canvas").first();
      await daVinciCanvas.scrollIntoViewIfNeeded();
      await page.evaluate(
        () =>
          new Promise<void>((resolve) => {
            requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
          }),
      );
      await dispatcher.screenshot({ path: unconfirmedScreenshotPath });

      await dispatcher.getByRole("button", { name: "2D Technical Diagram" }).click();
      const twoDimensional = dispatcher.getByTestId("davinci-interface-two");
      await twoDimensional.waitFor({ state: "visible", timeout: 20_000 });
      const twoDimensionalUnconfirmedState =
        await readDaVinciInterfaceState("davinci-interface-two");
      const twoDimensionalScreenshotPath = path.join(
        SCREENSHOT_DIRECTORY,
        `${patentId}.${viewport}.engagement-unconfirmed-two-dimensional.png`,
      );
      await dispatcher.screenshot({ path: twoDimensionalScreenshotPath });

      await twoDimensional
        .getByRole("button")
        .filter({ hasText: "Engagement confirmation" })
        .click();
      await page.waitForFunction(
        () =>
          document
            .querySelector('[data-testid="davinci-interface-two"]')
            ?.getAttribute("data-interface-status") === "ready",
        undefined,
        { timeout: 3_000 },
      );
      const twoDimensionalRestoredState = await readDaVinciInterfaceState("davinci-interface-two");
      await dispatcher.getByRole("button", { name: "3D Physics Simulation" }).click();
      await threeDimensional.waitFor({ state: "visible", timeout: 20_000 });
      const restoredState = await readDaVinciInterfaceState("davinci-interface-three");

      const defaultBoundaryHonest =
        defaultState.status === "ready" &&
        defaultState.compatibilitySignal === "true" &&
        defaultState.calibrationRecord === "true" &&
        defaultState.engagementSignal === "true" &&
        defaultState.processorCanConfigure === "true" &&
        defaultState.kernelSource === "source-bounded-ts" &&
        defaultState.quantitativeMechanics === "refused" &&
        defaultState.connectedTopology === "processor-data-path-holder-engagement-tool";
      const missingSignalRefused =
        unconfirmedState.status === "engagement-unconfirmed" &&
        unconfirmedState.engagementSignal === "false" &&
        unconfirmedState.processorCanConfigure === "false" &&
        unconfirmedState.connectedTopology === defaultState.connectedTopology;
      const crossFaceParity =
        twoDimensionalUnconfirmedState.status === unconfirmedState.status &&
        twoDimensionalUnconfirmedState.compatibilitySignal ===
          unconfirmedState.compatibilitySignal &&
        twoDimensionalUnconfirmedState.calibrationRecord === unconfirmedState.calibrationRecord &&
        twoDimensionalUnconfirmedState.engagementSignal === unconfirmedState.engagementSignal &&
        twoDimensionalUnconfirmedState.processorCanConfigure ===
          unconfirmedState.processorCanConfigure &&
        twoDimensionalUnconfirmedState.kernelSource === unconfirmedState.kernelSource &&
        twoDimensionalUnconfirmedState.quantitativeMechanics ===
          unconfirmedState.quantitativeMechanics &&
        twoDimensionalUnconfirmedState.connectedTopology === unconfirmedState.connectedTopology;
      const restoredAcrossFaces =
        twoDimensionalRestoredState.status === "ready" &&
        twoDimensionalRestoredState.engagementSignal === "true" &&
        twoDimensionalRestoredState.processorCanConfigure === "true" &&
        restoredState.status === twoDimensionalRestoredState.status &&
        restoredState.engagementSignal === twoDimensionalRestoredState.engagementSignal &&
        restoredState.processorCanConfigure === twoDimensionalRestoredState.processorCanConfigure;
      mechanismInteraction = {
        available: true,
        kind: "source-bounded-connected-tool-interface-missing-signal-refusal-and-cross-face-parity",
        defaultState,
        unconfirmedState,
        twoDimensionalUnconfirmedState,
        twoDimensionalRestoredState,
        restoredState,
        defaultBoundaryHonest,
        missingSignalRefused,
        crossFaceParity,
        restoredAcrossFaces,
        unconfirmedScreenshotPath,
        twoDimensionalScreenshotPath,
      };
      mechanismInteractionValid =
        defaultBoundaryHonest && missingSignalRefused && crossFaceParity && restoredAcrossFaces;
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
        actualViewportCanvasClearOfStickyHeaderAfterInteractions: true,
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
