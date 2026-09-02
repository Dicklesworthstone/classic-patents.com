/**
 * Data-driven browser acceptance for one, changed, or every patent vertical slice.
 *
 * This runner does not start or stop a Next server. Point it at an existing,
 * unambiguous server with E2E_BASE_URL/--base-url. It preserves all evidence
 * under artifacts and emits both JSONL action events and a human summary.
 */

import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import * as fs from "node:fs";
import * as path from "node:path";
import {
  type BrowserContext,
  type ConsoleMessage,
  chromium,
  type Locator,
  type Page,
} from "playwright";
import { getColorizedEquationsForPatent } from "../src/data/colorizedEquations";
import {
  archivalEditionForPublication,
  evaluateArchivalPublicationState,
} from "../src/data/editions/publicationApproval";
import { allPatents } from "../src/data/patents";
import { CATALOG_CLAIM_CONSTRAINTS } from "../src/physics/claimConstraints";
import { energyChannelsFor } from "../src/physics/energyChannels";
import { PATENT_PHYSICS_REGISTRY } from "../src/physics/telemetryData";
import {
  buildPatentE2EScenarios,
  classifyPatentE2EDiagnostic,
  createPatentE2EEvent,
  createRunId,
  PATENT_E2E_VIEWPORTS,
  type PatentE2EEvent,
  PatentE2EHelpRequested,
  type PatentE2EOptions,
  type PatentE2EScenario,
  type PatentE2ESummary,
  type PatentE2EViewportName,
  parsePatentE2EArgs,
  patentE2EExitCode,
  patentE2EUsage,
  redactPatentE2ESecrets,
  resolveChangedPatentIds,
  selectPatentE2EScenarios,
  serializePatentE2EEvent,
  stableFailureStem,
  summarizePatentE2EEvents,
} from "./patent-e2e-contract";

const USER_AGENT = "OpenAI File Downloader, XaiImageApiFetch/1.0";
const ACTION_TIMEOUT_MS = 15_000;

interface ScenarioDiagnostics {
  consoleMessages: string[];
  consoleErrors: string[];
  pageErrors: string[];
  networkErrors: string[];
}

interface CheckContext {
  patent: PatentE2EScenario;
  viewport: PatentE2EViewportName;
  face: string;
  action: string;
}

class RunRecorder {
  readonly events: PatentE2EEvent[] = [];
  readonly runDirectory: string;
  readonly eventPath: string;
  private readonly diagnosticsByScenario = new Map<string, ScenarioDiagnostics>();

  constructor(
    readonly runId: string,
    outputRoot: string,
  ) {
    this.runDirectory = path.resolve(outputRoot, runId);
    this.eventPath = path.join(this.runDirectory, "events.jsonl");
    fs.mkdirSync(this.runDirectory, { recursive: true });
  }

  registerDiagnostics(
    patentId: string,
    viewport: PatentE2EViewportName,
    diagnostics: ScenarioDiagnostics,
  ) {
    this.diagnosticsByScenario.set(`${patentId}\u0000${viewport}`, diagnostics);
  }

  emit(event: Omit<PatentE2EEvent, "schemaVersion" | "sequence" | "timestamp">): PatentE2EEvent {
    const diagnostics = this.diagnosticsByScenario.get(`${event.patentId}\u0000${event.viewport}`);
    const complete = createPatentE2EEvent({
      ...event,
      sequence: this.events.length + 1,
      consoleErrors: event.consoleErrors ?? diagnostics?.consoleErrors ?? [],
      pageErrors: event.pageErrors ?? diagnostics?.pageErrors ?? [],
      networkErrors: event.networkErrors ?? diagnostics?.networkErrors ?? [],
    });
    this.events.push(complete);
    fs.appendFileSync(this.eventPath, `${serializePatentE2EEvent(complete)}\n`, "utf8");
    const marker =
      complete.status === "pass" ? "PASS" : complete.status === "fail" ? "FAIL" : "INFO";
    console.log(
      `[${marker}] ${complete.patentId} ${complete.viewport} ${complete.face}/${complete.action} (${complete.durationMs}ms)`,
    );
    return complete;
  }

  writeSummary(summary: PatentE2ESummary): string {
    const summaryPath = path.join(this.runDirectory, "summary.json");
    fs.writeFileSync(summaryPath, `${JSON.stringify(summary, null, 2)}\n`, "utf8");
    return summaryPath;
  }
}

async function main() {
  let options: PatentE2EOptions;
  try {
    options = parsePatentE2EArgs(process.argv.slice(2));
  } catch (error) {
    if (error instanceof PatentE2EHelpRequested) {
      console.log(patentE2EUsage());
      return;
    }
    console.error(error instanceof Error ? error.message : String(error));
    console.error(`\n${patentE2EUsage()}`);
    process.exitCode = 2;
    return;
  }

  const startedAt = new Date().toISOString();
  const recorder = new RunRecorder(createRunId(), options.outputRoot);
  let scenarios: PatentE2EScenario[] = [];
  try {
    scenarios = buildPatentE2EScenarios(allPatents, {
      isEditionPublished: (patent) => Boolean(archivalEditionForPublication(patent)),
      publicationDecision: evaluateArchivalPublicationState,
      assetExists: (publicUrl) =>
        fs.existsSync(path.join(process.cwd(), "public", publicUrl.replace(/^\/+/, ""))),
      equationIdsForPatent: (patent) =>
        getColorizedEquationsForPatent(patent.id).map((equation) => equation.id),
      claimProbeCountForPatent: (patent) => (CATALOG_CLAIM_CONSTRAINTS[patent.id] ?? []).length,
      hasEnergyChannelsForPatent: (patent) => {
        const physics = PATENT_PHYSICS_REGISTRY[patent.id];
        if (!physics) return false;
        const defaults = Object.fromEntries(
          physics.controls.map((control) => [control.id, control.defaultValue]),
        );
        return energyChannelsFor(patent.id, defaults).length > 0;
      },
      controlsForPatent: (patent) =>
        (PATENT_PHYSICS_REGISTRY[patent.id]?.controls ?? []).map((control) => ({
          id: control.id,
          label: control.label,
          min: control.min,
          max: control.max,
          step: control.step,
          defaultValue: control.defaultValue,
          unit: control.unit ?? "",
        })),
    });
  } catch (error) {
    recordRunConfigurationFailure(recorder, error);
    finishRun(recorder, {
      startedAt,
      baseUrl: options.baseUrl,
      patentIds: [],
      viewports: options.viewports,
    });
    return;
  }

  let selected: PatentE2EScenario[] = [];
  if (!options.selfTestFailure) {
    try {
      const selectedIds = options.all
        ? scenarios.map((scenario) => scenario.patentId)
        : options.changed
          ? resolveChangedPatentIds(scenarios, changedPathsFromGit(), readSmallTextFile)
          : options.patentIds;
      if (selectedIds.length === 0) {
        throw new Error("No patent ids resolved from the selected E2E mode.");
      }
      selected = selectPatentE2EScenarios(scenarios, selectedIds);
    } catch (error) {
      recordRunConfigurationFailure(recorder, error);
      finishRun(recorder, {
        startedAt,
        baseUrl: options.baseUrl,
        patentIds: [],
        viewports: options.viewports,
      });
      return;
    }
  }

  try {
    await preflightServer(options.baseUrl, recorder);
  } catch {
    finishRun(recorder, {
      startedAt,
      baseUrl: options.baseUrl,
      patentIds: selected.map((scenario) => scenario.patentId),
      viewports: options.viewports,
    });
    return;
  }

  console.log("=======================================================================");
  console.log("  Classic Patents vertical-slice E2E acceptance");
  console.log(`  Target: ${options.baseUrl}`);
  console.log(
    options.selfTestFailure
      ? "  Mode: intentional failure-evidence self-test"
      : `  Patents: ${selected.length}/${scenarios.length}`,
  );
  console.log(`  Viewports: ${options.viewports.join(", ")}`);
  console.log(`  Structured log: ${recorder.eventPath}`);
  console.log("=======================================================================");

  let browser: Awaited<ReturnType<typeof chromium.launch>>;
  try {
    browser = await chromium.launch({ headless: !options.headed });
  } catch (error) {
    recorder.emit({
      runId: recorder.runId,
      patentId: "__run__",
      route: "/",
      viewport: "run",
      face: "runtime",
      action: "browser-launch",
      status: "fail",
      durationMs: 0,
      expected: "a runnable Playwright Chromium installation",
      errors: [error instanceof Error ? error.message : String(error)],
    });
    finishRun(recorder, {
      startedAt,
      baseUrl: options.baseUrl,
      patentIds: selected.map((scenario) => scenario.patentId),
      viewports: options.viewports,
    });
    return;
  }
  try {
    if (options.selfTestFailure) {
      await runFailureEvidenceSelfTest({ browser, baseUrl: options.baseUrl, recorder });
    } else {
      for (const scenario of selected) {
        for (const viewport of options.viewports) {
          const passed = await runPatentViewport({
            browser,
            baseUrl: options.baseUrl,
            scenario,
            viewport,
            recorder,
          });
          if (!passed && options.failFast) break;
        }
        if (options.failFast && recorder.events.some((event) => event.status === "fail")) break;
      }
    }
  } finally {
    await browser.close();
  }

  finishRun(recorder, {
    startedAt,
    baseUrl: options.baseUrl,
    patentIds: selected.map((scenario) => scenario.patentId),
    viewports: options.viewports,
  });
}

async function runFailureEvidenceSelfTest(args: {
  browser: Awaited<ReturnType<typeof chromium.launch>>;
  baseUrl: string;
  recorder: RunRecorder;
}) {
  const scenario: PatentE2EScenario = {
    patentId: "__harness-self-test__",
    patentNumber: "HARNESS SELF-TEST",
    title: "Intentional failure evidence",
    route: "/",
    pdfUrl: "/patents/pdfs/__not-used__.pdf",
    sourceState: "withheld",
    sourcePublicationState: "held",
    sourceReasonCode: "SELF_TEST_FAILURE",
    sourceDecision: {
      completeFacsimileReviewed: false,
      ledgerKind: undefined,
      ledgerReviewer: null,
      ledgerReviewedAt: null,
      digestParity: "unavailable",
      requiredFigureCount: 0,
      acceptedFigureCount: 0,
      evidenceReferences: ["self-test"],
    },
    claimCount: 0,
    drawingCount: 0,
    hasReviewedLedger: false,
    hasStoredEdition: false,
    figurePreviewUrls: [],
    equationIds: [],
    claimProbeCount: 0,
    hasEnergyChannels: false,
    controls: [],
  };
  const viewport = "desktop" as const;
  const context = await args.browser.newContext({
    viewport: PATENT_E2E_VIEWPORTS[viewport],
    deviceScaleFactor: 1,
    reducedMotion: "no-preference",
    userAgent: USER_AGENT,
    extraHTTPHeaders: { "x-classic-patents-e2e": args.recorder.runId },
  });
  await context.tracing.start({ screenshots: true, snapshots: true, sources: true });
  const page = await context.newPage();
  page.setDefaultTimeout(ACTION_TIMEOUT_MS);
  const diagnostics: ScenarioDiagnostics = {
    consoleMessages: [],
    consoleErrors: [],
    pageErrors: [],
    networkErrors: [],
  };
  installDiagnostics(page, diagnostics);
  const started = performance.now();
  let traceStopped = false;

  try {
    const response = await page.goto(args.baseUrl, {
      waitUntil: "domcontentloaded",
      timeout: 30_000,
    });
    const responseStatus = response?.status() ?? 0;
    const artifactPaths = await captureFailureEvidence({
      page,
      context,
      recorder: args.recorder,
      scenario,
      viewport,
      diagnostics,
    });
    const evidenceIntegrity = inspectFailureEvidence(artifactPaths);
    traceStopped = true;
    args.recorder.emit({
      runId: args.recorder.runId,
      patentId: scenario.patentId,
      route: scenario.route,
      viewport,
      face: "self-test",
      action: "synthetic-failure",
      status: "fail",
      durationMs: performance.now() - started,
      expected: {
        result: "intentional nonzero exit",
        evidenceKinds: ["screenshot", "DOM", "diagnostics", "trace"],
      },
      actual: {
        responseStatus,
        url: page.url(),
        artifactCount: artifactPaths.length,
        evidenceIntegrity,
      },
      responseStatus,
      errors: ["Synthetic failure requested by --self-test-failure."],
      consoleErrors: diagnostics.consoleErrors,
      pageErrors: diagnostics.pageErrors,
      networkErrors: diagnostics.networkErrors,
      artifactPaths,
    });
    args.recorder.emit({
      runId: args.recorder.runId,
      patentId: scenario.patentId,
      route: scenario.route,
      viewport,
      face: "self-test",
      action: "failure-evidence-integrity",
      status: evidenceIntegrity.valid ? "info" : "fail",
      durationMs: 0,
      expected: "nonempty screenshot, DOM, diagnostics, and trace artifacts",
      actual: evidenceIntegrity,
      errors: evidenceIntegrity.valid ? undefined : evidenceIntegrity.problems,
      artifactPaths,
    });
  } finally {
    if (!traceStopped) await context.tracing.stop().catch(() => undefined);
    await page.close().catch(() => undefined);
    await context.close();
  }
}

async function runPatentViewport(args: {
  browser: Awaited<ReturnType<typeof chromium.launch>>;
  baseUrl: string;
  scenario: PatentE2EScenario;
  viewport: PatentE2EViewportName;
  recorder: RunRecorder;
}): Promise<boolean> {
  const dimensions = PATENT_E2E_VIEWPORTS[args.viewport];
  const context = await args.browser.newContext({
    viewport: dimensions,
    deviceScaleFactor: 1,
    hasTouch: args.viewport === "phone",
    isMobile: args.viewport === "phone",
    reducedMotion: args.viewport === "phone" ? "reduce" : "no-preference",
    userAgent: USER_AGENT,
    extraHTTPHeaders: { "x-classic-patents-e2e": args.recorder.runId },
  });
  await context.tracing.start({ screenshots: true, snapshots: true, sources: true });

  const page = await context.newPage();
  page.setDefaultTimeout(ACTION_TIMEOUT_MS);
  const diagnostics: ScenarioDiagnostics = {
    consoleMessages: [],
    consoleErrors: [],
    pageErrors: [],
    networkErrors: [],
  };
  installDiagnostics(page, diagnostics);
  args.recorder.registerDiagnostics(args.scenario.patentId, args.viewport, diagnostics);
  let traceStopped = false;

  try {
    const routeResponse = await checked(
      args.recorder,
      meta(args.scenario, args.viewport, "route", "http-200"),
      200,
      async () => {
        const response = await page.goto(`${args.baseUrl}${args.scenario.route}`, {
          waitUntil: "domcontentloaded",
          timeout: 30_000,
        });
        const status = response?.status() ?? 0;
        if (status !== 200) throw new Error(`Expected route HTTP 200, received ${status}.`);
        return status;
      },
    );

    await checked(
      args.recorder,
      meta(args.scenario, args.viewport, "route", "patent-identity"),
      { patentNumber: args.scenario.patentNumber, title: args.scenario.title },
      async () => {
        const body = await page.locator("body").innerText();
        const documentTitle = await page.title();
        const actual = {
          patentNumber: body.includes(args.scenario.patentNumber),
          title: body.includes(args.scenario.title),
          metadataPatentNumber: documentTitle.includes(args.scenario.patentNumber),
          metadataTitle: documentTitle.includes(args.scenario.title),
          documentTitle,
        };
        if (
          !actual.patentNumber ||
          !actual.title ||
          !actual.metadataPatentNumber ||
          !actual.metadataTitle
        ) {
          throw new Error(`Route identity mismatch: ${JSON.stringify(actual)}.`);
        }
        return actual;
      },
      routeResponse,
    );

    await checked(
      args.recorder,
      meta(args.scenario, args.viewport, "route", "client-hydration"),
      "dual projection controls are hydrated",
      async () => {
        await waitForPatentViewerHydration(page);
        return { hydrated: true };
      },
    );

    await verifyPinnedPdf(context, args.baseUrl, args.scenario, args.viewport, args.recorder);
    await verifyFigurePreviewAssets(
      context,
      args.baseUrl,
      args.scenario,
      args.viewport,
      args.recorder,
    );
    await verifySourceFace(page, args.scenario, args.viewport, args.recorder);
    await verifyClaimNavigation(page, args.scenario, args.viewport, args.recorder);
    await verifyVisualAndTelemetry(page, args.scenario, args.viewport, args.recorder);
    await verifyRemainingFaces(page, args.scenario, args.viewport, args.recorder);
    await verifyThemeAndResponsiveState(page, args.scenario, args.viewport, args.recorder);

    const unexpected = [
      ...diagnostics.consoleErrors,
      ...diagnostics.pageErrors,
      ...diagnostics.networkErrors,
    ].filter((message) => !classifyPatentE2EDiagnostic(message).allowed);
    await checked(
      args.recorder,
      meta(args.scenario, args.viewport, "route", "runtime-diagnostics"),
      [],
      async () => {
        if (unexpected.length > 0) throw new Error(unexpected.join("\n"));
        return [];
      },
    );

    await context.tracing.stop();
    traceStopped = true;
    return true;
  } catch (error) {
    const artifactPaths = await captureFailureEvidence({
      page,
      context,
      recorder: args.recorder,
      scenario: args.scenario,
      viewport: args.viewport,
      diagnostics,
    });
    traceStopped = true;
    args.recorder.emit({
      runId: args.recorder.runId,
      patentId: args.scenario.patentId,
      route: args.scenario.route,
      viewport: args.viewport,
      face: "run",
      action: "failure-evidence",
      status: "fail",
      durationMs: 0,
      errors: [formatError(error)],
      consoleErrors: diagnostics.consoleErrors,
      pageErrors: diagnostics.pageErrors,
      networkErrors: diagnostics.networkErrors,
      artifactPaths,
    });
    return false;
  } finally {
    if (!traceStopped) await context.tracing.stop().catch(() => undefined);
    await page.close().catch(() => undefined);
    await context.close();
  }
}

async function verifyPinnedPdf(
  context: BrowserContext,
  baseUrl: string,
  scenario: PatentE2EScenario,
  viewport: PatentE2EViewportName,
  recorder: RunRecorder,
) {
  await checked(
    recorder,
    meta(scenario, viewport, "pdf-facsimile", "pinned-pdf"),
    "%PDF",
    async () => {
      const response = await context.request.get(`${baseUrl}${scenario.pdfUrl}`, {
        headers: { Range: "bytes=0-7", "User-Agent": USER_AGENT },
        timeout: ACTION_TIMEOUT_MS,
      });
      const status = response.status();
      const contentType = response.headers()["content-type"] ?? "";
      const prefix = Buffer.from(await response.body())
        .subarray(0, 4)
        .toString("ascii");
      if (
        ![200, 206].includes(status) ||
        !contentType.toLowerCase().includes("pdf") ||
        prefix !== "%PDF"
      ) {
        throw new Error(
          `Pinned PDF check failed: status=${status}, content-type=${contentType}, prefix=${JSON.stringify(prefix)}.`,
        );
      }
      return { status, contentType, prefix, url: scenario.pdfUrl };
    },
  );
}

async function verifyFigurePreviewAssets(
  context: BrowserContext,
  baseUrl: string,
  scenario: PatentE2EScenario,
  viewport: PatentE2EViewportName,
  recorder: RunRecorder,
) {
  await checked(
    recorder,
    meta(scenario, viewport, "original-spec", "figure-preview-assets"),
    scenario.figurePreviewUrls,
    async () => {
      const assets = [];
      for (const previewUrl of scenario.figurePreviewUrls) {
        const response = await context.request.get(`${baseUrl}${previewUrl}`, {
          headers: { "User-Agent": USER_AGENT },
          timeout: ACTION_TIMEOUT_MS,
        });
        const contentType = response.headers()["content-type"] ?? "";
        const sizeBytes = (await response.body()).byteLength;
        if (response.status() !== 200 || !contentType.toLowerCase().startsWith("image/")) {
          throw new Error(
            `Figure preview ${previewUrl} is not a served image: status=${response.status()}, content-type=${contentType}.`,
          );
        }
        if (sizeBytes <= 100) {
          throw new Error(
            `Figure preview ${previewUrl} is implausibly small (${sizeBytes} bytes).`,
          );
        }
        assets.push({ previewUrl, contentType, sizeBytes });
      }
      return assets;
    },
  );
}

async function verifySourceFace(
  page: Page,
  scenario: PatentE2EScenario,
  viewport: PatentE2EViewportName,
  recorder: RunRecorder,
) {
  await openAndRestoreFace(page, scenario, viewport, recorder, {
    face: "original-spec",
    title: "Original Patent Text (Shortcut: 2)",
    expectedView: "original-spec",
  });
  await checked(
    recorder,
    meta(scenario, viewport, "original-spec", "publication-state"),
    {
      sourceState: scenario.sourceState,
      publicationState: scenario.sourcePublicationState,
      reasonCode: scenario.sourceReasonCode,
      decision: scenario.sourceDecision,
    },
    async () => {
      const root = page.locator("[data-archival-edition]").first();
      const archivalKind = await root.getAttribute("data-archival-edition");
      const publicationState = await root.getAttribute("data-archival-publication-state");
      const reasonCode = await root.getAttribute("data-archival-publication-reason");
      if (scenario.sourceState === "published" && archivalKind === "withheld") {
        throw new Error(
          "Expected a published manual edition, but the route rendered withheld state.",
        );
      }
      if (scenario.sourceState === "withheld") {
        if (archivalKind !== "withheld") {
          throw new Error(`Expected withheld source state, received ${archivalKind}.`);
        }
        await page
          .getByRole("heading", { name: "Complete archival edition is not published yet" })
          .waitFor({ state: "visible" });
      } else {
        await page
          .getByRole("heading", { name: /Specification of Letters Patent/ })
          .waitFor({ state: "visible" });
      }
      if (publicationState !== scenario.sourcePublicationState) {
        throw new Error(
          `Expected typed publication state ${scenario.sourcePublicationState}, received ${publicationState}.`,
        );
      }
      if (reasonCode !== scenario.sourceReasonCode) {
        throw new Error(
          `Expected typed publication reason ${scenario.sourceReasonCode}, received ${reasonCode}.`,
        );
      }
      return {
        sourceState: archivalKind === "withheld" ? "withheld" : "published",
        archivalKind,
        publicationState,
        reasonCode,
        decision: scenario.sourceDecision,
        hasStoredEdition: scenario.hasStoredEdition,
        hasReviewedLedger: scenario.hasReviewedLedger,
      };
    },
  );

  await checked(
    recorder,
    meta(scenario, viewport, "original-spec", "figure-preview-interaction"),
    { previewUrls: scenario.figurePreviewUrls, sourceState: scenario.sourceState },
    async () => {
      const references = page.getByTestId("source-figure-reference");
      const referenceCount = await references.count();
      if (scenario.sourceState === "withheld" || scenario.figurePreviewUrls.length === 0) {
        if (referenceCount !== 0) {
          throw new Error(
            `Rendered ${referenceCount} archival figure reference(s) without a published preview contract.`,
          );
        }
        return { referenceCount, interaction: "not-applicable" };
      }

      const trigger = references.first();
      const previewCount = Number(await trigger.getAttribute("data-figure-preview-count"));
      if (!Number.isInteger(previewCount) || previewCount < 1) {
        throw new Error("Published figure-reference trigger does not declare its preview count.");
      }
      await trigger.click();
      const tooltipId = await trigger.getAttribute("aria-controls");
      if (!tooltipId) throw new Error("Published figure-reference trigger has no tooltip target.");
      const tooltip = page.locator(`[id="${tooltipId}"]`);
      await tooltip.waitFor({ state: "visible" });
      const link = tooltip.locator("a[href]").first();
      const href = await link.getAttribute("href");
      if (!href || !scenario.figurePreviewUrls.includes(new URL(href, page.url()).pathname)) {
        throw new Error(`Figure preview tooltip points outside its authored asset set: ${href}.`);
      }
      return { referenceCount, previewCount, tooltipId, href };
    },
  );
}

async function verifyClaimNavigation(
  page: Page,
  scenario: PatentE2EScenario,
  viewport: PatentE2EViewportName,
  recorder: RunRecorder,
) {
  await openAndRestoreFace(page, scenario, viewport, recorder, {
    face: "plain-english",
    title: "Plain English Face (Shortcut: 1)",
    expectedView: "plain-english",
  });
  await checked(
    recorder,
    meta(scenario, viewport, "plain-english", "claim-navigation"),
    { claimCount: scenario.claimCount },
    async () => {
      if (scenario.claimCount === 0) {
        return { claimCount: 0, navigation: "not-applicable" };
      }
      await page
        .getByText(/Claims Decoder|Claim Decoder/)
        .first()
        .waitFor({ state: "visible" });
      if (scenario.claimCount > 1) {
        const claimSelector = page.getByRole("button", { name: /^Claim #\d+/ });
        const before = await selectedClaimNumber(claimSelector);
        const next = page.getByRole("button", { name: "Next Claim" });
        await next.waitFor({ state: "visible" });
        await next.click();
        await page.waitForFunction((previous) => {
          const selected = [...document.querySelectorAll('button[aria-pressed="true"]')].find(
            (button) => /^Claim #\d+/.test(button.textContent?.trim() ?? ""),
          );
          return selected?.textContent?.match(/^Claim #(\d+)/)?.[1] !== previous;
        }, before);
        const after = await selectedClaimNumber(claimSelector);
        if (after === before) throw new Error(`Next Claim left Claim #${before} selected.`);
        await page
          .getByText(`Claim #${after}`, { exact: true })
          .last()
          .waitFor({ state: "visible" });
        return {
          claimCount: scenario.claimCount,
          navigation: "advanced",
          selectedBefore: before,
          selectedAfter: after,
          decodedClaimVisible: after,
        };
      }
      return {
        claimCount: scenario.claimCount,
        navigation: "single",
      };
    },
  );
}

async function verifyVisualAndTelemetry(
  page: Page,
  scenario: PatentE2EScenario,
  viewport: PatentE2EViewportName,
  recorder: RunRecorder,
) {
  await openAndRestoreFace(page, scenario, viewport, recorder, {
    face: "interactive-sim",
    title: "Interactive 3D Simulator (Shortcut: 3)",
    expectedView: "interactive-sim",
  });

  const dispatcher = page.getByTestId("patent-visual-dispatcher").first();
  await checked(
    recorder,
    meta(scenario, viewport, "interactive-sim", "exact-visual-dispatch"),
    scenario.patentId,
    async () => {
      await dispatcher.waitFor({ state: "visible" });
      const actualId = await dispatcher.getAttribute("data-patent-id");
      if (actualId !== scenario.patentId) {
        throw new Error(`Expected visual ${scenario.patentId}, received ${actualId}.`);
      }
      return actualId;
    },
  );

  await checked(
    recorder,
    meta(scenario, viewport, "interactive-sim", "three-dimensional-mode"),
    "3d-physics",
    async () => {
      await dispatcher.getByRole("button", { name: "3D Physics Simulation" }).click();
      await page.waitForFunction(
        (id) =>
          document
            .querySelector(`[data-testid="patent-visual-dispatcher"][data-patent-id="${id}"]`)
            ?.getAttribute("data-render-mode") === "3d-physics",
        scenario.patentId,
      );
      await waitForVisualSurface(dispatcher, "3d-physics");
      const surface = dispatcher.getByTestId("patent-visual-surface");
      const canvasCount = await surface.locator("canvas").count();
      const statusCount = await surface.locator('[role="status"]').count();
      if (canvasCount === 0 && statusCount === 0) {
        throw new Error(
          "3D mode rendered neither a WebGL canvas nor an honest unavailable status.",
        );
      }
      return { mode: "3d-physics", canvasCount, honestUnavailableStatus: statusCount > 0 };
    },
  );

  await checked(
    recorder,
    meta(scenario, viewport, "interactive-sim", "two-dimensional-mode"),
    "vector-diagram",
    async () => {
      await dispatcher.getByRole("button", { name: "2D Technical Diagram" }).click();
      await page.waitForFunction(
        (id) =>
          document
            .querySelector(`[data-testid="patent-visual-dispatcher"][data-patent-id="${id}"]`)
            ?.getAttribute("data-render-mode") === "vector-diagram",
        scenario.patentId,
      );
      await waitForVisualSurface(dispatcher, "vector-diagram");
      const surfaceCount = await dispatcher
        .getByTestId("patent-visual-surface")
        .locator("svg, canvas, [role=status]")
        .count();
      if (surfaceCount === 0)
        throw new Error("2D mode rendered no vector, canvas, or honest status surface.");
      return { mode: "vector-diagram", surfaceCount };
    },
  );

  const telemetry = page.getByTestId("physics-telemetry-badge").first();
  await checked(
    recorder,
    meta(scenario, viewport, "interactive-sim", "shared-control-telemetry"),
    {
      contract: "one declared control changes the shared bus and persists across both visual modes",
      declaredControls: scenario.controls.map((control) => control.id),
    },
    async () => {
      await telemetry.waitFor({ state: "visible" });
      const declaredControl = scenario.controls.find((candidate) => candidate.max > candidate.min);
      const control = declaredControl
        ? telemetry.locator(`[data-physics-control-id="${declaredControl.id}"]:not([disabled])`)
        : telemetry
            .locator('input[type="range"]:not([disabled]), input[type="checkbox"]:not([disabled])')
            .first();
      if ((await control.count()) === 0) {
        throw new Error(
          declaredControl
            ? `Telemetry badge does not expose the scenario control '${declaredControl.id}'.`
            : "Telemetry badge exposes no enabled accessible control.",
        );
      }
      const label =
        (await control.getAttribute("aria-label")) ?? (await control.evaluate(labelForControl));
      if (!label) throw new Error("The selected shared telemetry control has no accessible name.");
      if (declaredControl && label !== declaredControl.label) {
        throw new Error(
          `Scenario control '${declaredControl.id}' should be labelled '${declaredControl.label}', received '${label}'.`,
        );
      }
      const before = await controlState(control);
      const envelopeBeforeKeyboard =
        (await telemetry.getAttribute("data-telemetry-envelope")) ?? "";
      const dispatcherTickBeforeKeyboard = Number(
        (await dispatcher.getAttribute("data-physics-tick")) ?? "0",
      );
      await control.focus();
      const keyboardAction = await keyboardActionForControl(control);
      await control.press(keyboardAction);
      await page.waitForFunction((patentId) => {
        const badge = document.querySelector(
          `[data-testid="physics-telemetry-badge"][data-patent-id="${patentId}"]`,
        );
        return Boolean(badge?.getAttribute("data-last-change"));
      }, scenario.patentId);
      const afterKeyboard = await controlState(control);
      if (afterKeyboard === before)
        throw new Error("Keyboard input did not change the shared control.");
      const envelopeAfterKeyboard = (await telemetry.getAttribute("data-telemetry-envelope")) ?? "";
      if (envelopeAfterKeyboard === envelopeBeforeKeyboard) {
        throw new Error(
          `Shared control '${label}' changed from ${before} to ${afterKeyboard}, but its telemetry envelope did not change.`,
        );
      }
      await page.waitForFunction(
        ({ patentId, priorTick, controlId }) => {
          const visual = document.querySelector(
            `[data-testid="patent-visual-dispatcher"][data-patent-id="${patentId}"]`,
          );
          return (
            Number(visual?.getAttribute("data-physics-tick")) > priorTick &&
            visual?.getAttribute("data-physics-last-change") === controlId
          );
        },
        {
          patentId: scenario.patentId,
          priorTick: dispatcherTickBeforeKeyboard,
          controlId:
            declaredControl?.id ?? (await control.getAttribute("data-physics-control-id")) ?? "",
        },
      );
      const dispatcherTickAfterKeyboard = Number(
        (await dispatcher.getAttribute("data-physics-tick")) ?? "0",
      );

      const envelopeBeforePointer = (await telemetry.getAttribute("data-telemetry-envelope")) ?? "";
      const dispatcherTickBeforePointer = Number(
        (await dispatcher.getAttribute("data-physics-tick")) ?? "0",
      );
      await operateControlByPointer(control, viewport);
      const afterPointer = await controlState(control);
      if (afterPointer === afterKeyboard)
        throw new Error("Pointer/touch input did not change the shared control.");
      await page.waitForFunction(
        ([patentId, previous]) =>
          (document
            .querySelector(`[data-testid="physics-telemetry-badge"][data-patent-id="${patentId}"]`)
            ?.getAttribute("data-telemetry-envelope") ?? "") !== previous,
        [scenario.patentId, envelopeBeforePointer],
      );
      await page.waitForFunction(
        ({ patentId, priorTick }) =>
          Number(
            document
              .querySelector(
                `[data-testid="patent-visual-dispatcher"][data-patent-id="${patentId}"]`,
              )
              ?.getAttribute("data-physics-tick"),
          ) > priorTick,
        { patentId: scenario.patentId, priorTick: dispatcherTickBeforePointer },
      );
      const dispatcherTickAfterPointer = Number(
        (await dispatcher.getAttribute("data-physics-tick")) ?? "0",
      );

      await dispatcher.getByRole("button", { name: "3D Physics Simulation" }).click();
      await page.waitForFunction(
        (id) =>
          document
            .querySelector(`[data-testid="patent-visual-dispatcher"][data-patent-id="${id}"]`)
            ?.getAttribute("data-render-mode") === "3d-physics",
        scenario.patentId,
      );
      const persisted = await controlState(control);
      if (persisted !== afterPointer)
        throw new Error("Shared control changed when switching visual modes.");
      const threeDimensionalTick = Number(
        (await dispatcher.getAttribute("data-physics-tick")) ?? "0",
      );
      if (threeDimensionalTick !== dispatcherTickAfterPointer) {
        throw new Error(
          `3D visual boundary observed tick ${threeDimensionalTick}, expected shared tick ${dispatcherTickAfterPointer}.`,
        );
      }

      const envelope = (await telemetry.getAttribute("data-telemetry-envelope")) ?? "";
      if (!envelope || /\b(?:NaN|Infinity|-Infinity)\b/.test(envelope)) {
        throw new Error(`Telemetry envelope is empty or non-finite: ${envelope}`);
      }
      const telemetryText = await telemetry.innerText();
      const refusal = telemetryText.match(
        /[^.\n]*(?:refus|unavailable|not quantified)[^.\n]*/i,
      )?.[0];
      const digest = telemetryText.match(/\b[a-f0-9]{64}\b/i)?.[0];
      return {
        keyboardAction,
        label,
        before,
        afterKeyboard,
        afterPointer,
        persisted,
        controlId: declaredControl?.id ?? (await control.getAttribute("data-physics-control-id")),
        dispatcherTickBeforeKeyboard,
        dispatcherTickAfterKeyboard,
        dispatcherTickAfterPointer,
        threeDimensionalTick,
        kernelSource: await telemetry.getAttribute("data-kernel-method"),
        telemetry: envelope,
        refusal,
        digest,
      };
    },
  ).then((actual) => {
    if (!actual || typeof actual !== "object") return;
    const value = actual as Record<string, unknown>;
    recorder.emit({
      runId: recorder.runId,
      patentId: scenario.patentId,
      route: scenario.route,
      viewport,
      face: "interactive-sim",
      action: "telemetry-snapshot",
      status: "info",
      durationMs: 0,
      controls: {
        label: String(value.label ?? "unknown"),
        value: String(value.persisted ?? "unknown"),
      },
      kernelSource: String(value.kernelSource ?? "unknown"),
      telemetry: String(value.telemetry ?? ""),
      refusal: value.refusal ? String(value.refusal) : undefined,
      digest: value.digest ? String(value.digest) : undefined,
    });
  });

  await verifyPhysicsExplanationSurfaces(page, dispatcher, telemetry, scenario, viewport, recorder);

  await checked(
    recorder,
    meta(scenario, viewport, "interactive-sim", "mute-default"),
    "muted or no audio transducer",
    async () => {
      const activeMute = dispatcher.getByRole("button", { name: /^Mute\b/i });
      const unmute = dispatcher.getByRole("button", { name: /^Unmute\b/i });
      const muteCount = await activeMute.count();
      const unmuteCount = await unmute.count();
      if (muteCount > 0)
        throw new Error("An audio control is active by default; expected a muted state.");
      return { unmuteControls: unmuteCount, audioAbsent: unmuteCount === 0 };
    },
  );
}

async function verifyPhysicsExplanationSurfaces(
  page: Page,
  dispatcher: Locator,
  telemetry: Locator,
  scenario: PatentE2EScenario,
  viewport: PatentE2EViewportName,
  recorder: RunRecorder,
) {
  await checked(
    recorder,
    meta(scenario, viewport, "interactive-sim", "governing-equation"),
    scenario.equationIds.length > 0
      ? { authoredEquationIds: scenario.equationIds }
      : "registry governing equation",
    async () => {
      const theoryButton = telemetry.getByRole("button", { name: "Governing Law" });
      await theoryButton.waitFor({ state: "visible" });
      await theoryButton.click();
      if (scenario.equationIds.length === 0) {
        const fallback = telemetry.getByText(/Governing Equation:/).first();
        await fallback.waitFor({ state: "visible" });
        return { surface: "registry-fallback", equationIds: [] };
      }

      const equation = telemetry.getByTestId("colorized-equation").first();
      await equation.waitFor({ state: "visible" });
      const equationId = await equation.getAttribute("data-equation-id");
      const patentId = await equation.getAttribute("data-patent-id");
      if (!equationId || !scenario.equationIds.includes(equationId)) {
        throw new Error(`Rendered an unauthored governing equation: ${equationId}.`);
      }
      if (patentId !== scenario.patentId) {
        throw new Error(`Governing equation belongs to ${patentId}, not ${scenario.patentId}.`);
      }
      return { surface: "colorized-equation", equationId, patentId };
    },
  );

  await checked(
    recorder,
    meta(scenario, viewport, "interactive-sim", "energy-flow"),
    { hasEnergyChannels: scenario.hasEnergyChannels },
    async () => {
      const strip = telemetry.getByTestId("energy-flow-strip");
      const stripCount = await strip.count();
      if (scenario.hasEnergyChannels && stripCount !== 1) {
        throw new Error(`Expected one SI energy-flow strip, rendered ${stripCount}.`);
      }
      if (!scenario.hasEnergyChannels && stripCount !== 0) {
        throw new Error(`Rendered ${stripCount} uncontracted energy-flow strip(s).`);
      }
      const channelCount =
        stripCount === 1 ? Number(await strip.getAttribute("data-energy-channel-count")) : 0;
      if (stripCount === 1 && (!Number.isInteger(channelCount) || channelCount < 1)) {
        throw new Error("Energy-flow strip declares no finite positive channel count.");
      }
      return { stripCount, channelCount };
    },
  );

  await checked(
    recorder,
    meta(scenario, viewport, "interactive-sim", "claim-constraint-probe"),
    { registeredProbeCount: scenario.claimProbeCount },
    async () => {
      const root = dispatcher.getByTestId("claim-constraint-toggle");
      const rootCount = await root.count();
      if (scenario.claimProbeCount === 0) {
        if (rootCount !== 0) {
          throw new Error(`Rendered ${rootCount} unregistered claim-probe surface(s).`);
        }
        return { rootCount, interaction: "not-applicable" };
      }
      if (rootCount < 1) {
        throw new Error(`Registered ${scenario.claimProbeCount} claim probes, but rendered none.`);
      }
      const renderedCounts = await root.evaluateAll((elements) =>
        elements.map((element) => Number(element.getAttribute("data-claim-constraint-count"))),
      );
      if (renderedCounts.some((count) => count !== scenario.claimProbeCount)) {
        throw new Error(
          `Claim-probe surfaces declare [${renderedCounts.join(", ")}]; registry contains ${scenario.claimProbeCount}.`,
        );
      }
      const allProbeButtons = root.getByRole("button");
      const buttonCount = await allProbeButtons.count();
      if (buttonCount !== rootCount * scenario.claimProbeCount) {
        throw new Error(
          `Expected ${rootCount * scenario.claimProbeCount} synchronized probe controls, rendered ${buttonCount}.`,
        );
      }
      const firstProbe = allProbeButtons.first();
      const claimNumber = await firstProbe.getAttribute("data-claim-number");
      if (!claimNumber) throw new Error("Claim-probe control does not identify its claim number.");
      const matchingProbeCount = await root
        .locator(`button[data-claim-number="${claimNumber}"]`)
        .count();
      if (matchingProbeCount !== rootCount) {
        throw new Error(
          `Claim ${claimNumber} appears on ${matchingProbeCount}/${rootCount} synchronized probe surfaces.`,
        );
      }
      await firstProbe.evaluate((element) =>
        element.scrollIntoView({ block: "center", inline: "center" }),
      );
      await firstProbe.focus();
      await page.keyboard.press("Enter");
      await waitForClaimProbeState(page, claimNumber, false, rootCount);
      await page.keyboard.press("Enter");
      await waitForClaimProbeState(page, claimNumber, true, rootCount);
      return {
        rootCount,
        renderedCounts,
        buttonCount,
        claimNumber,
        interaction: "keyboard-invert-synchronize-and-restore",
      };
    },
  );

  // The governing-law expansion intentionally stays open so the later
  // responsive-overflow pass also covers the equation surface at 320 px.
}

async function waitForClaimProbeState(
  page: Page,
  claimNumber: string,
  active: boolean,
  expectedCount: number,
) {
  await page.waitForFunction(
    ({ number, expectedActive, expected }) => {
      const matchingButtons = document.querySelectorAll(
        `[data-testid="claim-constraint-toggle"] button[data-claim-number="${number}"]`,
      );
      return (
        matchingButtons.length === expected &&
        [...matchingButtons].every(
          (button) => button.getAttribute("data-claim-active") === String(expectedActive),
        )
      );
    },
    { number: claimNumber, expectedActive: active, expected: expectedCount },
  );
}

async function verifyRemainingFaces(
  page: Page,
  scenario: PatentE2EScenario,
  viewport: PatentE2EViewportName,
  recorder: RunRecorder,
) {
  await openAndRestoreFace(page, scenario, viewport, recorder, {
    face: "schematic-sheet",
    title: "Schematic & Pins (Shortcut: 4)",
    expectedView: "schematic-sheet",
  });
  await checked(
    recorder,
    meta(scenario, viewport, "schematic-sheet", "source-schematic"),
    scenario.drawingCount > 0 ? "drawing or explicit source status" : "text-only source status",
    async () => {
      const main = page.locator("main");
      const sourceSurfaceCount = await main.locator("svg, [role=status]").count();
      if (sourceSurfaceCount === 0)
        throw new Error("Schematic face has no source surface or status.");
      return { drawingCount: scenario.drawingCount, sourceSurfaceCount };
    },
  );

  await openAndRestoreFace(page, scenario, viewport, recorder, {
    face: "pdf-facsimile",
    title: "Full Original PDF (Shortcut: 5)",
    expectedView: "pdf-facsimile",
  });
  await checked(
    recorder,
    meta(scenario, viewport, "pdf-facsimile", "embedded-or-linked-pdf"),
    scenario.pdfUrl,
    async () => {
      const object = page.locator(`object[data^="${scenario.pdfUrl}"]`);
      const link = page.locator(`a[href="${scenario.pdfUrl}"]`);
      if ((await object.count()) === 0 && (await link.count()) === 0) {
        throw new Error("PDF face contains neither the pinned embed nor its accessible link.");
      }
      return { objectCount: await object.count(), linkCount: await link.count() };
    },
  );

  await openAndRestoreFace(page, scenario, viewport, recorder, {
    face: "split-view",
    title: "Toggle Dual Split-Screen (Shortcut: 6)",
    expectedView: "split-view",
  });
  await checked(
    recorder,
    meta(scenario, viewport, "split-view", "dual-projection"),
    ["Face 1: Plain English Breakdown", "Face 2: Complete Archival Source Text"],
    async () => {
      await page.getByRole("heading", { name: "Face 1: Plain English Breakdown" }).waitFor();
      await page.getByRole("heading", { name: "Face 2: Complete Archival Source Text" }).waitFor();
      return "both projections visible";
    },
  );
}

async function verifyThemeAndResponsiveState(
  page: Page,
  scenario: PatentE2EScenario,
  viewport: PatentE2EViewportName,
  recorder: RunRecorder,
) {
  await checked(
    recorder,
    meta(scenario, viewport, "route", "theme-toggle"),
    "theme changes",
    async () => {
      const toggle = page.getByRole("button", { name: /^Switch to (?:Light|Dark) Mode$/ });
      await toggle.waitFor({ state: "visible" });
      const before = await page.locator("html").getAttribute("class");
      await toggle.click();
      await page.waitForFunction(
        (prior) => document.documentElement.className !== prior,
        before ?? "",
      );
      const after = await page.locator("html").getAttribute("class");
      await toggle.click();
      await page.waitForFunction(
        (prior) => document.documentElement.className === prior,
        before ?? "",
      );
      return { before, after };
    },
  );

  await checked(
    recorder,
    meta(scenario, viewport, "route", "responsive-accessibility"),
    { overflow: false, reducedMotion: viewport === "phone" },
    async () => {
      const state = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > window.innerWidth,
        reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
        activeElement: document.activeElement?.tagName ?? null,
      }));
      if (state.overflow) throw new Error("Patent route has horizontal overflow.");
      if (viewport === "phone" && !state.reducedMotion) {
        throw new Error("Phone reduced-motion context was not honored.");
      }
      const focusableCount = await page
        .locator(
          "button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled])",
        )
        .count();
      if (focusableCount === 0) throw new Error("Route exposes no keyboard-focusable controls.");
      const focusable = page
        .locator(
          "button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled])",
        )
        .first();
      await focusable.focus();
      await page.keyboard.press("Tab");
      const keyboardFocus = await page.evaluate(() => {
        const active = document.activeElement;
        if (!(active instanceof HTMLElement)) return { tagName: null, focusVisible: false };
        return { tagName: active.tagName, focusVisible: active.matches(":focus-visible") };
      });
      if (!keyboardFocus.focusVisible) {
        throw new Error("Keyboard navigation did not expose a :focus-visible element.");
      }
      return { ...state, focusableCount, keyboardFocus };
    },
  );
}

async function openAndRestoreFace(
  page: Page,
  scenario: PatentE2EScenario,
  viewport: PatentE2EViewportName,
  recorder: RunRecorder,
  face: { face: string; title: string; expectedView: string },
) {
  await checked(
    recorder,
    meta(scenario, viewport, face.face, "url-state-and-reload"),
    face.expectedView,
    async () => {
      await waitForPatentViewerHydration(page);
      const button = page.locator(`button[title="${face.title}"]`);
      await button.waitFor({ state: "visible" });
      await button.click();
      await page.waitForFunction(
        (expected) => new URL(window.location.href).searchParams.get("view") === expected,
        face.expectedView,
      );
      await page.reload({ waitUntil: "domcontentloaded" });
      await waitForPatentViewerHydration(page);
      const restored = page.locator(`button[title="${face.title}"]`);
      await restored.waitFor({ state: "visible" });
      const pressed = await restored.getAttribute("aria-pressed");
      const view = new URL(page.url()).searchParams.get("view");
      if (pressed !== "true" || view !== face.expectedView) {
        throw new Error(`Face restore failed: view=${view}, aria-pressed=${pressed}.`);
      }
      return { view, pressed };
    },
  );
}

async function waitForPatentViewerHydration(page: Page) {
  await page
    .getByTestId("dual-projection-viewer")
    .waitFor({ state: "visible", timeout: ACTION_TIMEOUT_MS });
  await page.waitForFunction(
    () =>
      document
        .querySelector('[data-testid="dual-projection-viewer"]')
        ?.getAttribute("data-hydrated") === "true",
    undefined,
    { timeout: ACTION_TIMEOUT_MS },
  );
}

async function checked<T>(
  recorder: RunRecorder,
  check: CheckContext,
  expected: unknown,
  operation: () => Promise<T>,
  responseStatus?: number,
): Promise<T> {
  const started = performance.now();
  try {
    const actual = await operation();
    recorder.emit({
      runId: recorder.runId,
      patentId: check.patent.patentId,
      route: check.patent.route,
      viewport: check.viewport,
      face: check.face,
      action: check.action,
      status: "pass",
      durationMs: performance.now() - started,
      expected,
      actual,
      responseStatus,
    });
    return actual;
  } catch (error) {
    recorder.emit({
      runId: recorder.runId,
      patentId: check.patent.patentId,
      route: check.patent.route,
      viewport: check.viewport,
      face: check.face,
      action: check.action,
      status: "fail",
      durationMs: performance.now() - started,
      expected,
      errors: [error instanceof Error ? error.message : String(error)],
      responseStatus,
    });
    throw error;
  }
}

function meta(
  patent: PatentE2EScenario,
  viewport: PatentE2EViewportName,
  face: string,
  action: string,
): CheckContext {
  return { patent, viewport, face, action };
}

function installDiagnostics(page: Page, diagnostics: ScenarioDiagnostics) {
  page.on("console", (message: ConsoleMessage) => {
    diagnostics.consoleMessages.push(`[${message.type()}] ${message.text()}`);
    if (message.type() === "error") diagnostics.consoleErrors.push(`[console] ${message.text()}`);
  });
  page.on("pageerror", (error) => diagnostics.pageErrors.push(`[pageerror] ${error.message}`));
  page.on("response", (response) => {
    if (response.status() >= 400) {
      diagnostics.networkErrors.push(`[http ${response.status()}] ${response.url()}`);
    }
  });
  page.on("requestfailed", (request) => {
    diagnostics.networkErrors.push(
      `[requestfailed] ${request.method()} ${request.url()} ${request.failure()?.errorText ?? "unknown"}`,
    );
  });
}

async function waitForVisualSurface(
  dispatcher: Locator,
  expectedMode: "3d-physics" | "vector-diagram",
) {
  const surface = dispatcher.getByTestId("patent-visual-surface");
  await surface.waitFor({ state: "visible" });
  const actualMode = await surface.getAttribute("data-render-mode");
  if (actualMode !== expectedMode) {
    throw new Error(`Expected ${expectedMode} visual surface, received ${actualMode}.`);
  }
  const readyContent =
    expectedMode === "3d-physics"
      ? surface.locator('canvas, [role="status"]')
      : surface.locator('canvas, svg, [role="status"]');
  await readyContent.first().waitFor({ state: "visible" });
  const canvasOrVectorCount = await surface.locator("canvas, svg").count();
  if (canvasOrVectorCount === 0) {
    const fallback = surface.locator('[role="status"]').first();
    const text = (await fallback.innerText()).trim();
    if (text.length < 24) {
      throw new Error(
        `${expectedMode} rendered no visual surface and its fallback is not an explanatory text alternative.`,
      );
    }
  }
}

async function controlState(control: Locator): Promise<string> {
  return (await control.getAttribute("type")) === "checkbox"
    ? String(await control.isChecked())
    : await control.inputValue();
}

async function selectedClaimNumber(claimSelector: Locator): Promise<string> {
  const selected = await claimSelector.evaluateAll((buttons) =>
    buttons.find((button) => button.getAttribute("aria-pressed") === "true")?.textContent?.trim(),
  );
  const number = selected?.match(/^Claim #(\d+)/)?.[1];
  if (!number)
    throw new Error(`Could not identify the selected claim from '${selected ?? "none"}'.`);
  return number;
}

async function keyboardActionForControl(
  control: Locator,
): Promise<"Space" | "ArrowLeft" | "ArrowRight"> {
  if ((await control.getAttribute("type")) === "checkbox") return "Space";
  const max = Number(await control.getAttribute("max")) || 100;
  const value = Number(await control.inputValue());
  return value >= max ? "ArrowLeft" : "ArrowRight";
}

async function operateControlByPointer(control: Locator, viewport: PatentE2EViewportName) {
  const box = await control.boundingBox();
  if (!box) throw new Error("Shared control has no pointer-operable bounding box.");
  const type = await control.getAttribute("type");
  if (type === "checkbox") {
    if (viewport === "phone") await control.tap();
    else await control.click();
    return;
  }

  const min = Number(await control.getAttribute("min")) || 0;
  const max = Number(await control.getAttribute("max")) || 100;
  const value = Number(await control.inputValue());
  const currentRatio = Math.max(
    0,
    Math.min(1, (value - min) / Math.max(Number.EPSILON, max - min)),
  );
  const targetRatio = currentRatio <= 0.5 ? 0.8 : 0.2;
  const position = {
    x: Math.max(2, Math.min(box.width - 2, box.width * targetRatio)),
    y: box.height / 2,
  };
  if (viewport === "phone") {
    await control.tap({ position });
    return;
  }
  await control.click({ position });
}

function labelForControl(element: Element): string {
  if (!(element instanceof HTMLInputElement)) return "";
  return element.labels?.[0]?.textContent?.trim() ?? "";
}

async function captureFailureEvidence(args: {
  page: Page;
  context: BrowserContext;
  recorder: RunRecorder;
  scenario: PatentE2EScenario;
  viewport: PatentE2EViewportName;
  diagnostics: ScenarioDiagnostics;
}): Promise<string[]> {
  const stem = stableFailureStem(args.scenario.patentId, args.viewport, "run", "failure");
  const base = path.join(args.recorder.runDirectory, stem);
  const screenshotPath = `${base}.png`;
  const domPath = `${base}.html`;
  const diagnosticsPath = `${base}.diagnostics.json`;
  const tracePath = `${base}.trace.zip`;
  const paths: string[] = [];

  if (
    await args.page
      .screenshot({ path: screenshotPath, fullPage: true })
      .then(() => true)
      .catch(() => false)
  ) {
    paths.push(screenshotPath);
  }
  const dom = await args.page.content().catch(() => undefined);
  if (dom !== undefined) {
    fs.writeFileSync(domPath, redactPatentE2ESecrets(dom), "utf8");
    paths.push(domPath);
  }
  const redactedDiagnostics = {
    url: redactPatentE2ESecrets(args.page.url()),
    consoleMessages: args.diagnostics.consoleMessages.map(redactPatentE2ESecrets),
    consoleErrors: args.diagnostics.consoleErrors.map(redactPatentE2ESecrets),
    pageErrors: args.diagnostics.pageErrors.map(redactPatentE2ESecrets),
    networkErrors: args.diagnostics.networkErrors.map(redactPatentE2ESecrets),
  };
  fs.writeFileSync(diagnosticsPath, `${JSON.stringify(redactedDiagnostics, null, 2)}\n`, "utf8");
  paths.push(diagnosticsPath);
  if (
    await args.context.tracing
      .stop({ path: tracePath })
      .then(() => true)
      .catch(() => false)
  ) {
    paths.push(tracePath);
  }
  return paths;
}

function inspectFailureEvidence(paths: readonly string[]) {
  const expected = {
    screenshot: /\.png$/,
    domSnapshot: /\.html$/,
    diagnostics: /\.diagnostics\.json$/,
    trace: /\.trace\.zip$/,
  } as const;
  const artifacts = Object.fromEntries(
    Object.entries(expected).map(([kind, matcher]) => {
      const artifactPath = paths.find((candidate) => matcher.test(candidate));
      let bytes = 0;
      if (artifactPath) {
        try {
          bytes = fs.statSync(artifactPath).size;
        } catch {
          bytes = 0;
        }
      }
      return [kind, { path: artifactPath ?? null, bytes, nonempty: bytes > 0 }];
    }),
  );
  const problems = Object.entries(artifacts)
    .filter(([, artifact]) => !artifact.nonempty)
    .map(([kind]) => `Missing or empty ${kind} failure artifact.`);
  return { valid: problems.length === 0, artifacts, problems };
}

async function preflightServer(baseUrl: string, recorder: RunRecorder) {
  const started = performance.now();
  try {
    const response = await fetch(baseUrl, {
      headers: { "User-Agent": USER_AGENT },
      signal: AbortSignal.timeout(ACTION_TIMEOUT_MS),
    });
    const text = await response.text();
    const requestedUrl = new URL(baseUrl);
    const finalUrl = new URL(response.url);
    const contentType = response.headers.get("content-type");
    const hasProductIdentity = text.includes("Classic Patents");
    const hasNextAssetIdentity = text.includes("/_next/");
    if (
      response.status !== 200 ||
      finalUrl.origin !== requestedUrl.origin ||
      !contentType?.includes("text/html") ||
      !hasProductIdentity ||
      !hasNextAssetIdentity
    ) {
      throw new Error(
        `E2E target is not an unambiguous Classic Patents Next server: status=${response.status}, requestedOrigin=${requestedUrl.origin}, finalOrigin=${finalUrl.origin}, contentType=${contentType ?? "missing"}, productIdentity=${String(hasProductIdentity)}, nextAssetIdentity=${String(hasNextAssetIdentity)}.`,
      );
    }
    const htmlSha256 = createHash("sha256").update(text).digest("hex");
    recorder.emit({
      runId: recorder.runId,
      patentId: "__run__",
      route: "/",
      viewport: "run",
      face: "preflight",
      action: "target-identity",
      status: "pass",
      durationMs: performance.now() - started,
      expected: "same-origin Classic Patents Next HTML with HTTP 200 and recorded build identity",
      actual: {
        status: response.status,
        finalUrl: response.url,
        server: response.headers.get("server"),
        contentType,
        etag: response.headers.get("etag"),
        lastModified: response.headers.get("last-modified"),
        htmlBytes: Buffer.byteLength(text),
        htmlSha256,
      },
      responseStatus: response.status,
    });
  } catch (error) {
    recorder.emit({
      runId: recorder.runId,
      patentId: "__run__",
      route: "/",
      viewport: "run",
      face: "preflight",
      action: "target-identity",
      status: "fail",
      durationMs: performance.now() - started,
      expected: "same-origin Classic Patents Next HTML with HTTP 200 and recorded build identity",
      errors: [error instanceof Error ? error.message : String(error)],
    });
    throw error;
  }
}

function recordRunConfigurationFailure(recorder: RunRecorder, error: unknown) {
  recorder.emit({
    runId: recorder.runId,
    patentId: "__run__",
    route: "/",
    viewport: "run",
    face: "configuration",
    action: "scenario-selection",
    status: "fail",
    durationMs: 0,
    expected: "a valid non-empty scenario selection backed by pinned assets",
    errors: [error instanceof Error ? error.message : String(error)],
  });
}

function finishRun(
  recorder: RunRecorder,
  args: {
    startedAt: string;
    baseUrl: string;
    patentIds: readonly string[];
    viewports: readonly PatentE2EViewportName[];
  },
) {
  const summary = summarizePatentE2EEvents({
    runId: recorder.runId,
    startedAt: args.startedAt,
    finishedAt: new Date().toISOString(),
    baseUrl: args.baseUrl,
    selectedPatents: args.patentIds,
    selectedViewports: args.viewports,
    artifactDirectory: recorder.runDirectory,
    events: recorder.events,
  });
  const summaryPath = recorder.writeSummary(summary);
  console.log("=======================================================================");
  console.log(
    `  Completed: ${summary.passedActions} passed actions, ${summary.failedActions} failed actions`,
  );
  console.log(`  Failed patents: ${summary.failedPatents.join(", ") || "none"}`);
  for (const group of summary.actionGroups.filter((entry) => entry.failedActions > 0)) {
    console.log(
      `  Failure group: ${group.patentId} ${group.viewport} ${group.face}/${group.action} (${group.failedActions}/${group.eventCount})`,
    );
    if (group.artifactPaths.length > 0) {
      console.log(`    Evidence: ${group.artifactPaths.join(", ")}`);
    }
  }
  console.log(`  JSONL events: ${recorder.eventPath}`);
  console.log(`  Summary: ${summaryPath}`);
  console.log("=======================================================================");
  process.exitCode = patentE2EExitCode(summary);
}

function changedPathsFromGit(): string[] {
  const commands = [
    ["diff", "--name-only"],
    ["diff", "--cached", "--name-only"],
    ["ls-files", "--others", "--exclude-standard"],
  ];
  const paths = new Set<string>();
  for (const args of commands) {
    const output = execFileSync("git", args, { encoding: "utf8" });
    for (const line of output.split("\n")) if (line.trim()) paths.add(line.trim());
  }
  return [...paths].sort();
}

function readSmallTextFile(relativePath: string): string | undefined {
  try {
    const absolute = path.resolve(relativePath);
    const stat = fs.statSync(absolute);
    if (!stat.isFile() || stat.size > 2_000_000) return undefined;
    return fs.readFileSync(absolute, "utf8");
  } catch {
    return undefined;
  }
}

function formatError(error: unknown): string {
  if (!(error instanceof Error)) return String(error);
  if (!error.stack) return error.message;
  return error.stack.includes(error.message) ? error.stack : `${error.message}\n${error.stack}`;
}

main().catch((error) => {
  console.error("Patent vertical-slice E2E failed:", error);
  process.exitCode = 1;
});
