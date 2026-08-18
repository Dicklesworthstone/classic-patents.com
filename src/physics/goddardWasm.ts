export type GoddardKernelSource = "wasm" | "ts-fallback" | "unloaded";

type GoddardFn = (
  chamberPressurePsi: number,
  fuelFlowKgPerSec: number,
  throatAreaCm2: number,
  expansionRatio: number,
) => string;

let goddardFn: GoddardFn | null = null;
let loadAttempted = false;
let source: GoddardKernelSource = "unloaded";

export function goddardKernelSource(): GoddardKernelSource {
  return source;
}

export async function ensureGoddardWasm(): Promise<GoddardKernelSource> {
  if (loadAttempted) return source;
  loadAttempted = true;
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
): {
  chamber_pressure_psi: number;
  expansion_ratio: number;
  exhaust_velocity_mps: number;
  mach_exit: number;
  exit_pressure_psi: number;
  thrust_newtons: number;
} | null {
  if (!goddardFn) return null;
  try {
    const raw = goddardFn(chamberPressurePsi, fuelFlowKgPerSec, throatAreaCm2, expansionRatio);
    const parsed = JSON.parse(raw);
    if (parsed.ok) return parsed.ok;
  } catch {
    // fall back
  }
  return null;
}
