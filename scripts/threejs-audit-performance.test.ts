import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  finiteNumber,
  nearestRank,
  summarizeNumbers,
  summarizeThreePerformanceSamples,
  type ThreePerformanceSample,
  validateThreePerformanceBudget,
} from "./threejs-audit-performance";

const sample = (
  cacheState: ThreePerformanceSample["cacheState"],
  sampleIndex: number,
  firstRenderMs: number | null,
): ThreePerformanceSample => ({
  patentId: "us-6120588-eink",
  viewport: "phone",
  cacheState,
  measurementMode: "clean",
  commit: "working-tree",
  userAgent: "test-browser",
  devicePixelRatio: 1,
  sampleIndex,
  navigationMs: 100 + sampleIndex,
  canvasReadyMs: 200 + sampleIndex,
  rendererSampleReadyMs: 220 + sampleIndex,
  firstRenderMs,
  cpuSubmitMs: 0.5,
  drawCalls: 30,
  triangles: 1000,
  usedJsHeapBytes: null,
});

describe("Three.js production benchmark statistics", () => {
  test("fails closed on misspelled selections and brings paused canvases into view", () => {
    const auditSource = readFileSync(
      join(process.cwd(), "scripts/e2e-threejs-visual-audit.ts"),
      "utf8",
    );
    expect(auditSource).toContain("contains unregistered catalogue ids");
    expect(auditSource).toContain("contains unsupported names");
    expect(auditSource).toContain("await canvas.scrollIntoViewIfNeeded()");
  });

  test("records actual viewport geometry after interactions without treating stitched component shots as overlap evidence", () => {
    const auditSource = readFileSync(
      join(process.cwd(), "scripts/e2e-threejs-visual-audit.ts"),
      "utf8",
    );
    expect(auditSource).toContain("captureActualViewportEvidence");
    expect(auditSource).toContain('"header.sticky.top-0"');
    expect(auditSource).toContain("actualIntersection");
    expect(auditSource).toContain("overlapWidthPx");
    expect(auditSource).toContain("overlapHeightPx");
    expect(auditSource).toContain("verticalClearancePx");
    expect(auditSource).toContain("STICKY_HEADER_CANVAS_CLEARANCE_PX");
    expect(auditSource).toContain("minimumCanvasTopPx");
    expect(auditSource).toContain("requestedScrollDeltaY");
    expect(auditSource).toContain("framing,");
    expect(auditSource).toContain("fullPage: false");
    expect(auditSource).toContain(".viewport.png");
    expect(auditSource).toContain('stage: "primary-control-max"');
    expect(auditSource).toContain('stage: "claim-inverted"');
    expect(auditSource).toContain("viewportGeometry: viewportEvidence.geometry");
    expect(auditSource).toContain(
      "!viewportEvidence.geometry.stickyHeaderCanvasOverlap.actualIntersection",
    );
    expect(auditSource).toContain("await dispatcher.screenshot({ path: changedScreenshotPath })");
    expect(auditSource).toContain("await dispatcher.screenshot({ path: claimScreenshotPath })");
  });

  test("normalizes missing and non-finite dataset values without serializing NaN", () => {
    expect(finiteNumber(undefined)).toBeNull();
    expect(finiteNumber("")).toBeNull();
    expect(finiteNumber("NaN")).toBeNull();
    expect(finiteNumber(Number.POSITIVE_INFINITY)).toBeNull();
    expect(finiteNumber("12.5")).toBe(12.5);
  });

  test("uses a deterministic nearest-rank percentile and reports invalid samples", () => {
    expect(nearestRank([5, 1, 4, 2, 3], 0.5)).toBe(3);
    expect(nearestRank([5, 1, 4, 2, 3], 0.95)).toBe(5);
    expect(summarizeNumbers([1, 2, null, 4])).toEqual({
      n: 3,
      invalidCount: 1,
      min: 1,
      max: 4,
      mean: 7 / 3,
      p50: 2,
      p95: 4,
    });
  });

  test("never merges context-cold and context-warm distributions", () => {
    const summaries = summarizeThreePerformanceSamples([
      sample("context-cold", 1, 210),
      sample("context-cold", 2, 190),
      sample("context-warm", 1, 90),
      sample("context-warm", 2, null),
    ]);
    expect(summaries).toHaveLength(2);
    const cold = summaries.find((summary) => summary.cacheState === "context-cold");
    const warm = summaries.find((summary) => summary.cacheState === "context-warm");
    expect(cold?.metrics.firstRenderMs.p50).toBe(190);
    expect(cold?.metrics.firstRenderMs.p95).toBe(210);
    expect(warm?.metrics.firstRenderMs.n).toBe(1);
    expect(warm?.metrics.firstRenderMs.invalidCount).toBe(1);
  });

  test("enforces stable draw-call limits independently from opt-in timing limits", () => {
    const baseline = {
      enforceTiming: false,
      enforceDrawCalls: true,
      firstRenderMs: 5_000,
      cpuSubmitMs: 100,
      drawCalls: 200,
      maxFirstRenderMs: 1_000,
      maxCpuSubmitMs: 16.7,
      maxDrawCalls: 250,
    };

    expect(validateThreePerformanceBudget(baseline)).toEqual({
      timingValid: true,
      drawCallsValid: true,
      valid: true,
    });
    expect(validateThreePerformanceBudget({ ...baseline, drawCalls: 251 }).valid).toBe(false);
    expect(validateThreePerformanceBudget({ ...baseline, drawCalls: null }).valid).toBe(false);
    expect(validateThreePerformanceBudget({ ...baseline, enforceTiming: true }).timingValid).toBe(
      false,
    );
  });

  test("keeps draw-call enforcement on by default while allowing an explicit diagnostic opt-out", () => {
    const auditSource = readFileSync(
      join(process.cwd(), "scripts/e2e-threejs-visual-audit.ts"),
      "utf8",
    );
    expect(auditSource).toContain(
      'const ENFORCE_DRAW_CALL_BUDGET = process.env.THREEJS_AUDIT_ENFORCE_DRAW_CALLS !== "0"',
    );
  });

  test("records source-bound visual refusals as performance-ineligible instead of false failures", () => {
    const auditSource = readFileSync(
      join(process.cwd(), "scripts/e2e-threejs-visual-audit.ts"),
      "utf8",
    );
    expect(auditSource).toContain('button[title$="(Shortcut: 3)"]');
    expect(auditSource).toContain('kind: "not-applicable" as const');
    expect(auditSource).toContain('action: "performance-not-applicable"');
    expect(auditSource).toContain(
      'if (outcome === "not-applicable") performanceApplicable = false',
    );
  });
});
