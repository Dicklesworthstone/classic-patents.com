export type TeslaKernelSource = "wasm" | "ts-fallback" | "unloaded";

type TeslaTransformerFn = (
  frequencyHz: number,
  propagationSpeedMps: number,
  conductorLengthM: number,
) => string;

export interface TeslaTransformerWasmStep {
  wavelength_m: number;
  quarter_wave_length_m: number;
  electrical_length_rad: number;
  quarter_wave_error_rad: number;
  length_error_m: number;
  length_ratio: number;
  remote_terminal_profile_fraction: number;
}

export interface TeslaTransformerWasmInputs {
  frequencyHz: number;
  propagationSpeedMps: number;
  conductorLengthM: number;
}

export const TESLA_TRANSFORMER_MAX_FREQUENCY_HZ = 1_000_000_000;
export const TESLA_TRANSFORMER_MAX_PROPAGATION_SPEED_MPS = 400_000_000;
export const TESLA_TRANSFORMER_MAX_CONDUCTOR_LENGTH_M = 1_000_000_000;

let teslaTransformerFn: TeslaTransformerFn | null = null;
let loadPromise: Promise<TeslaKernelSource> | null = null;
let source: TeslaKernelSource = "unloaded";

export function teslaKernelSource(): TeslaKernelSource {
  return source;
}

function finite(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function closeEnough(actual: number, expected: number, tolerance = 1e-10): boolean {
  return (
    Math.abs(actual - expected) <= tolerance * Math.max(1, Math.abs(actual), Math.abs(expected))
  );
}

/**
 * Decode and audit the owner-crate envelope. Signed error fields may be zero
 * or negative; physical lengths and electrical length must remain positive.
 */
export function decodeTeslaTransformerWasmStep(
  raw: string,
  expectedInputs?: TeslaTransformerWasmInputs,
): TeslaTransformerWasmStep | null {
  try {
    const parsed = JSON.parse(raw) as {
      ok?: Partial<TeslaTransformerWasmStep>;
      refusal?: unknown;
    };
    if (parsed.refusal !== undefined) return null;
    const result = parsed.ok;
    if (!result) return null;
    const values = [
      result.wavelength_m,
      result.quarter_wave_length_m,
      result.electrical_length_rad,
      result.quarter_wave_error_rad,
      result.length_error_m,
      result.length_ratio,
      result.remote_terminal_profile_fraction,
    ];
    if (!values.every(finite)) return null;

    const decoded = result as TeslaTransformerWasmStep;
    if (
      decoded.wavelength_m <= 0 ||
      decoded.quarter_wave_length_m <= 0 ||
      decoded.electrical_length_rad <= 0 ||
      decoded.length_ratio <= 0 ||
      decoded.remote_terminal_profile_fraction < 0 ||
      decoded.remote_terminal_profile_fraction > 1
    ) {
      return null;
    }

    const conductorLengthM = decoded.length_ratio * decoded.quarter_wave_length_m;
    if (
      !closeEnough(decoded.quarter_wave_length_m, decoded.wavelength_m / 4) ||
      !closeEnough(decoded.electrical_length_rad, (Math.PI / 2) * decoded.length_ratio) ||
      !closeEnough(decoded.quarter_wave_error_rad, decoded.electrical_length_rad - Math.PI / 2) ||
      !closeEnough(decoded.length_error_m, conductorLengthM - decoded.quarter_wave_length_m) ||
      !closeEnough(
        decoded.remote_terminal_profile_fraction,
        Math.abs(Math.sin(decoded.electrical_length_rad)),
      )
    ) {
      return null;
    }
    if (expectedInputs) {
      const {
        frequencyHz,
        propagationSpeedMps,
        conductorLengthM: expectedLengthM,
      } = expectedInputs;
      if (
        !finite(frequencyHz) ||
        !finite(propagationSpeedMps) ||
        !finite(expectedLengthM) ||
        frequencyHz <= 0 ||
        frequencyHz > TESLA_TRANSFORMER_MAX_FREQUENCY_HZ ||
        propagationSpeedMps <= 0 ||
        propagationSpeedMps > TESLA_TRANSFORMER_MAX_PROPAGATION_SPEED_MPS ||
        expectedLengthM <= 0 ||
        expectedLengthM > TESLA_TRANSFORMER_MAX_CONDUCTOR_LENGTH_M ||
        !closeEnough(decoded.wavelength_m, propagationSpeedMps / frequencyHz) ||
        !closeEnough(conductorLengthM, expectedLengthM)
      ) {
        return null;
      }
    }
    return decoded;
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
        tesla_transformer_step: TeslaTransformerFn;
      };
      await mod.default({ module_or_path: wasmUrl });
      if (typeof mod.tesla_transformer_step !== "function") {
        throw new Error("tesla_transformer_step missing from wasm module");
      }
      teslaTransformerFn = mod.tesla_transformer_step;
      source = "wasm";
    } finally {
      URL.revokeObjectURL(blobUrl);
    }
  } catch (err) {
    console.warn("Failed to load fs-tesla-wasm, using fallback", err);
    teslaTransformerFn = null;
    source = "ts-fallback";
  }
  return source;
}

export function tryTeslaTransformerWasmStep(
  frequencyHz: number,
  propagationSpeedMps: number,
  conductorLengthM: number,
): TeslaTransformerWasmStep | null {
  if (!teslaTransformerFn) return null;
  try {
    return decodeTeslaTransformerWasmStep(
      teslaTransformerFn(frequencyHz, propagationSpeedMps, conductorLengthM),
      { frequencyHz, propagationSpeedMps, conductorLengthM },
    );
  } catch {
    return null;
  }
}
