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
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { chromium, type Page } from "playwright";
import { allPatents } from "../src/data/patents";

const BASE_URL = process.env.E2E_BASE_URL ?? "http://127.0.0.1:3088";
const OUTPUT_ROOT = path.resolve(
  process.env.THREEJS_AUDIT_OUTPUT ?? "artifacts/e2e-threejs-visual-audit",
);
const RUN_ID = `${new Date().toISOString().replaceAll(":", "-")}__${process.pid}`;
const RUN_DIRECTORY = path.join(OUTPUT_ROOT, RUN_ID);
const SCREENSHOT_DIRECTORY = path.join(RUN_DIRECTORY, "screenshots");
const EVENT_PATH = path.join(RUN_DIRECTORY, "events.jsonl");

const VIEWPORTS = {
  desktop: { width: 1440, height: 900 },
  tablet: { width: 768, height: 1024 },
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
let sequence = 0;
let failureCount = 0;

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

async function auditPatent(page: Page, patentId: string, viewport: ViewportName) {
  const route = `/patents/${patentId}`;
  const diagnostics = diagnosticsFor(page);
  const startedAt = performance.now();
  let screenshotPath: string | null = null;

  try {
    const response = await page.goto(`${BASE_URL}${route}`, {
      waitUntil: "domcontentloaded",
      timeout: 30_000,
    });
    if (response?.status() !== 200) {
      throw new Error(`Expected HTTP 200, received ${response?.status() ?? "no response"}.`);
    }

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
    if (mode !== "3d-physics") {
      throw new Error(`Expected 3d-physics surface, received ${mode}.`);
    }

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
        },
        screenshotPath,
        diagnostics,
      });
      return;
    }

    const canvas = surface.locator("canvas").first();
    await canvas.waitFor({ state: "visible", timeout: 20_000 });
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

    const defaultScreenshotPath = path.join(
      SCREENSHOT_DIRECTORY,
      `${patentId}.${viewport}.default.png`,
    );
    await dispatcher.screenshot({ path: defaultScreenshotPath });
    screenshotPath = defaultScreenshotPath;

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

    const range = surface.locator('input[type="range"]:not([disabled])').first();
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
      const changedValue = await surface
        .locator('input[type="range"]:not([disabled])')
        .first()
        .inputValue();
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
      },
      actual: { mode, before, interaction, claimInteraction, after },
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

  const browser = await chromium.launch({ headless: true });
  for (const viewportName of viewportNames) {
    const context = await browser.newContext({
      viewport: VIEWPORTS[viewportName],
      deviceScaleFactor: 1,
      reducedMotion: viewportName === "phone" ? "reduce" : "no-preference",
    });
    for (const patent of patents) {
      const page = await context.newPage();
      await auditPatent(page, patent.id, viewportName);
      await page.close();
    }
    await context.close();
  }
  await browser.close();

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
