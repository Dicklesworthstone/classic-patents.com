export type GoddardKernelSource = "wasm" | "ts-fallback" | "unloaded";

type GoddardFn = (
  chamberPressurePsi: number,
  fuelFlowKgPerSec: number,
  throatAreaCm2: number,
  expansionRatio: number,
) => string;

export interface GoddardWasmStep {
  chamber_pressure_psi: number;
  chamber_pressure_pa: number;
  exhaust_velocity_mps: number;
  thrust_newtons: number;
  specific_impulse_sec: number;
  mach_exit: number;
}

let goddardFn: GoddardFn | null = null;
let loadPromise: Promise<GoddardKernelSource> | null = null;
let source: GoddardKernelSource = "unloaded";

export function goddardKernelSource(): GoddardKernelSource {
  return source;
}

export function decodeGoddardWasmStep(raw: string): GoddardWasmStep | null {
  try {
    const parsed = JSON.parse(raw) as { ok?: Partial<GoddardWasmStep> };
    const result = parsed.ok;
    if (!result) return null;
    const values = [
      result.chamber_pressure_psi,
      result.chamber_pressure_pa,
      result.exhaust_velocity_mps,
      result.thrust_newtons,
      result.specific_impulse_sec,
      result.mach_exit,
    ];
    if (!values.every((value) => typeof value === "number" && Number.isFinite(value))) {
      return null;
    }
    if (values.some((value) => (value as number) <= 0)) return null;
    return result as GoddardWasmStep;
  } catch {
    return null;
  }
}

export function ensureGoddardWasm(): Promise<GoddardKernelSource> {
  loadPromise ??= initializeGoddardWasm();
  return loadPromise;
}

async function initializeGoddardWasm(): Promise<GoddardKernelSource> {
  if (typeof window === "undefined") {
    source = "ts-fallback";
    return source;
  }
  try {
    const jsUrl = "/wasm/fs-goddard/fs_goddard_wasm.js";
    const wasmUrl = "/wasm/fs-goddard/fs_goddard_wasm_bg.wasm";
    const jsText = await fetch(jsUrl, { signal: AbortSignal.timeout(10_000) }).then((r) => {
      if (!r.ok) throw new Error(`goddard wasm glue ${r.status}`);
      return r.text();
    });
    const blobUrl = URL.createObjectURL(new Blob([jsText], { type: "text/javascript" }));
    try {
      const mod = (await import(/* webpackIgnore: true */ blobUrl)) as {
        default: (module_or_path?: unknown) => Promise<unknown>;
        goddard_rocket_step: GoddardFn;
      };
      await mod.default({ module_or_path: wasmUrl });
      if (typeof mod.goddard_rocket_step !== "function") {
        throw new Error("goddard_rocket_step missing from wasm module");
      }
      goddardFn = mod.goddard_rocket_step;
      source = "wasm";
    } finally {
      URL.revokeObjectURL(blobUrl);
    }
  } catch (err) {
    console.warn("Failed to load fs-goddard-wasm, using fallback", err);
    goddardFn = null;
    source = "ts-fallback";
  }
  return source;
}

export function tryGoddardWasmStep(
  chamberPressurePsi: number,
  fuelFlowKgPerSec: number,
  throatAreaCm2: number,
  expansionRatio: number,
): GoddardWasmStep | null {
  if (!goddardFn) return null;
  try {
    const raw = goddardFn(chamberPressurePsi, fuelFlowKgPerSec, throatAreaCm2, expansionRatio);
    return decodeGoddardWasmStep(raw);
  } catch {
    // fall back
  }
  return null;
}
