export type TeslaKernelSource = "wasm" | "ts-fallback" | "unloaded";

type TeslaFn = (
  resonantFreqKhz: number,
  inputKv: number,
  sparkGapMm: number,
  qFactor: number,
) => string;

export interface TeslaWasmStep {
  resonant_freq_khz: number;
  secondary_potential_mv: number;
  streamer_length_inches: number;
  streamer_length_meters: number;
}

let teslaFn: TeslaFn | null = null;
let loadPromise: Promise<TeslaKernelSource> | null = null;
let source: TeslaKernelSource = "unloaded";

export function teslaKernelSource(): TeslaKernelSource {
  return source;
}

export function decodeTeslaWasmStep(raw: string): TeslaWasmStep | null {
  try {
    const parsed = JSON.parse(raw) as { ok?: Partial<TeslaWasmStep> };
    const result = parsed.ok;
    if (!result) return null;
    const values = [
      result.resonant_freq_khz,
      result.secondary_potential_mv,
      result.streamer_length_inches,
      result.streamer_length_meters,
    ];
    if (!values.every((value) => typeof value === "number" && Number.isFinite(value))) {
      return null;
    }
    if (values.some((value) => (value as number) <= 0)) return null;
    return result as TeslaWasmStep;
  } catch {
    return null;
  }
}

export function ensureTeslaWasm(): Promise<TeslaKernelSource> {
  loadPromise ??= initializeTeslaWasm();
  return loadPromise;
}

async function initializeTeslaWasm(): Promise<TeslaKernelSource> {
  if (typeof window === "undefined") {
    source = "ts-fallback";
    return source;
  }
  try {
    const jsUrl = "/wasm/fs-tesla/fs_tesla_wasm.js";
    const wasmUrl = "/wasm/fs-tesla/fs_tesla_wasm_bg.wasm";
    const jsText = await fetch(jsUrl, { signal: AbortSignal.timeout(10_000) }).then((r) => {
      if (!r.ok) throw new Error(`tesla wasm glue ${r.status}`);
      return r.text();
    });
    const blobUrl = URL.createObjectURL(new Blob([jsText], { type: "text/javascript" }));
    try {
      const mod = (await import(/* webpackIgnore: true */ blobUrl)) as {
        default: (module_or_path?: unknown) => Promise<unknown>;
        tesla_coil_step: TeslaFn;
      };
      await mod.default({ module_or_path: wasmUrl });
      if (typeof mod.tesla_coil_step !== "function") {
        throw new Error("tesla_coil_step missing from wasm module");
      }
      teslaFn = mod.tesla_coil_step;
      source = "wasm";
    } finally {
      URL.revokeObjectURL(blobUrl);
    }
  } catch (err) {
    console.warn("Failed to load fs-tesla-wasm, using fallback", err);
    teslaFn = null;
    source = "ts-fallback";
  }
  return source;
}

export function tryTeslaWasmStep(
  resonantFreqKhz: number,
  inputKv: number,
  sparkGapMm: number,
  qFactor: number,
): TeslaWasmStep | null {
  if (!teslaFn) return null;
  try {
    const raw = teslaFn(resonantFreqKhz, inputKv, sparkGapMm, qFactor);
    return decodeTeslaWasmStep(raw);
  } catch {
    // fall back
  }
  return null;
}
