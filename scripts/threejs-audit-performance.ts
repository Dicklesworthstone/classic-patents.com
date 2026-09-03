export type PerformanceCacheState = "context-cold" | "context-warm";
export type PerformanceMeasurementMode = "clean" | "trace-active-diagnostic";

export interface ThreePerformanceSample {
  patentId: string;
  viewport: string;
  cacheState: PerformanceCacheState;
  measurementMode: PerformanceMeasurementMode;
  commit: string;
  userAgent: string;
  devicePixelRatio: number;
  sampleIndex: number;
  navigationMs: number | null;
  canvasReadyMs: number | null;
  rendererSampleReadyMs: number | null;
  firstRenderMs: number | null;
  cpuSubmitMs: number | null;
  drawCalls: number | null;
  triangles: number | null;
  usedJsHeapBytes: number | null;
}

export interface NumericDistribution {
  n: number;
  invalidCount: number;
  min: number | null;
  max: number | null;
  mean: number | null;
  p50: number | null;
  p95: number | null;
}

export interface ThreePerformanceBudgetInput {
  enforceTiming: boolean;
  enforceDrawCalls: boolean;
  firstRenderMs: number | null;
  cpuSubmitMs: number | null;
  drawCalls: number | null;
  maxFirstRenderMs: number;
  maxCpuSubmitMs: number;
  maxDrawCalls: number;
}

/**
 * Timing is opt-in because it varies with host load. Draw calls are a stable
 * property of the rendered scene and can therefore be enforced on every run.
 * Enforced metrics fail closed when the renderer did not publish a finite
 * sample.
 */
export function validateThreePerformanceBudget(input: ThreePerformanceBudgetInput) {
  const timingValid =
    !input.enforceTiming ||
    (input.firstRenderMs !== null &&
      Number.isFinite(input.firstRenderMs) &&
      input.firstRenderMs <= input.maxFirstRenderMs &&
      input.cpuSubmitMs !== null &&
      Number.isFinite(input.cpuSubmitMs) &&
      input.cpuSubmitMs <= input.maxCpuSubmitMs);
  const drawCallsValid =
    !input.enforceDrawCalls ||
    (input.drawCalls !== null &&
      Number.isFinite(input.drawCalls) &&
      input.drawCalls <= input.maxDrawCalls);
  return { timingValid, drawCallsValid, valid: timingValid && drawCallsValid };
}

export function finiteNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

export function nearestRank(values: readonly number[], percentile: number): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const rank = Math.min(sorted.length, Math.max(1, Math.ceil(percentile * sorted.length)));
  return sorted[rank - 1];
}

export function summarizeNumbers(values: readonly (number | null)[]): NumericDistribution {
  const finite = values.filter(
    (value): value is number => value !== null && Number.isFinite(value),
  );
  if (finite.length === 0) {
    return {
      n: 0,
      invalidCount: values.length,
      min: null,
      max: null,
      mean: null,
      p50: null,
      p95: null,
    };
  }
  return {
    n: finite.length,
    invalidCount: values.length - finite.length,
    min: Math.min(...finite),
    max: Math.max(...finite),
    mean: finite.reduce((total, value) => total + value, 0) / finite.length,
    p50: nearestRank(finite, 0.5),
    p95: nearestRank(finite, 0.95),
  };
}

export function summarizeThreePerformanceSamples(samples: readonly ThreePerformanceSample[]) {
  const buckets = new Map<string, ThreePerformanceSample[]>();
  for (const sample of samples) {
    const key = [
      sample.patentId,
      sample.viewport,
      sample.cacheState,
      sample.measurementMode,
      sample.commit,
      sample.userAgent,
      sample.devicePixelRatio,
    ].join("|");
    const bucket = buckets.get(key) ?? [];
    bucket.push(sample);
    buckets.set(key, bucket);
  }

  return Array.from(buckets.entries()).map(([key, bucket]) => ({
    key,
    patentId: bucket[0].patentId,
    viewport: bucket[0].viewport,
    cacheState: bucket[0].cacheState,
    measurementMode: bucket[0].measurementMode,
    commit: bucket[0].commit,
    userAgent: bucket[0].userAgent,
    devicePixelRatio: bucket[0].devicePixelRatio,
    sampleCount: bucket.length,
    metrics: {
      navigationMs: summarizeNumbers(bucket.map((sample) => sample.navigationMs)),
      canvasReadyMs: summarizeNumbers(bucket.map((sample) => sample.canvasReadyMs)),
      rendererSampleReadyMs: summarizeNumbers(bucket.map((sample) => sample.rendererSampleReadyMs)),
      firstRenderMs: summarizeNumbers(bucket.map((sample) => sample.firstRenderMs)),
      cpuSubmitMs: summarizeNumbers(bucket.map((sample) => sample.cpuSubmitMs)),
      drawCalls: summarizeNumbers(bucket.map((sample) => sample.drawCalls)),
      triangles: summarizeNumbers(bucket.map((sample) => sample.triangles)),
      usedJsHeapBytes: summarizeNumbers(bucket.map((sample) => sample.usedJsHeapBytes)),
    },
  }));
}
