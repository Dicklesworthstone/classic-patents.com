import {
  type CrumpFdmControls,
  type CrumpFdmTelemetry,
  CRUMP_FDM_GLASS_TRANSITION_TEMP_C,
  CRUMP_FDM_ILLUSTRATIVE_NOZZLE_LAND_LENGTH_MM,
  stepCrumpFdmSi,
} from "./crumpFdmKernel";

export type CrumpFdmKernelSource = "wasm" | "ts-fallback" | "unloaded";

type CrumpFdmStepFn = (
  dynamicViscosityPaS: number,
  capillaryLengthM: number,
  capillaryRadiusM: number,
  volumetricFlowM3S: number,
  layerThicknessM: number,
  thermalDiffusivityM2S: number,
  initialTemperatureK: number,
  boundaryTemperatureK: number,
  thresholdTemperatureK: number,
) => string;

export interface CrumpFdmWasmStep {
  capillary_owner: "fs-flux::capillary::step_newtonian_circular_capillary";
  thermal_owner: "fs-conduction::reduced_slab::step_first_mode_slab_cooling";
  pressure_drop_pa: number;
  wall_shear_rate_per_s: number;
  hydraulic_power_w: number;
  cooling_time_constant_s: number;
  time_to_threshold_s: number;
  threshold_temperature_check_k: number;
  capillary_boundary: "newtonian-incompressible-fully-developed-laminar-no-slip-circular-land";
  thermal_boundary: "one-dimensional-fixed-boundary-first-mode-screen-no-phase-change";
}

export interface CrumpFdmRuntimeTelemetry extends CrumpFdmTelemetry {
  runtimeSource: Exclude<CrumpFdmKernelSource, "unloaded">;
}

let stepFn: CrumpFdmStepFn | null = null;
let loadPromise: Promise<CrumpFdmKernelSource> | null = null;
let source: CrumpFdmKernelSource = "unloaded";

export function crumpFdmKernelSource(): CrumpFdmKernelSource {
  return source;
}

export function crumpFdmRuntimeLabel(
  runtimeSource: Exclude<CrumpFdmKernelSource, "unloaded">,
): string {
  return runtimeSource === "wasm"
    ? "fs-flux + fs-conduction WASM"
    : "typed equation-identical fallback";
}

function finiteNonNegative(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

function closeEnough(actual: number, expected: number): boolean {
  return Math.abs(actual - expected) <= 1e-10 * Math.max(1, Math.abs(expected));
}

/** Validate the complete generic-owner receipt before admitting WASM provenance. */
export function decodeCrumpFdmWasmStep(raw: string): CrumpFdmWasmStep | null {
  try {
    const parsed = JSON.parse(raw) as { ok?: Partial<CrumpFdmWasmStep> };
    const result = parsed.ok;
    if (!result) return null;
    if (
      result.capillary_owner !== "fs-flux::capillary::step_newtonian_circular_capillary" ||
      result.thermal_owner !==
        "fs-conduction::reduced_slab::step_first_mode_slab_cooling" ||
      result.capillary_boundary !==
        "newtonian-incompressible-fully-developed-laminar-no-slip-circular-land" ||
      result.thermal_boundary !==
        "one-dimensional-fixed-boundary-first-mode-screen-no-phase-change"
    ) {
      return null;
    }
    for (const value of [
      result.pressure_drop_pa,
      result.wall_shear_rate_per_s,
      result.hydraulic_power_w,
      result.cooling_time_constant_s,
      result.time_to_threshold_s,
      result.threshold_temperature_check_k,
    ]) {
      if (!finiteNonNegative(value)) return null;
    }
    if (!closeEnough(result.threshold_temperature_check_k, CRUMP_FDM_GLASS_TRANSITION_TEMP_C + 273.15)) {
      return null;
    }
    return result as CrumpFdmWasmStep;
  } catch {
    return null;
  }
}

export function ensureCrumpFdmWasm(): Promise<CrumpFdmKernelSource> {
  loadPromise ??= initializeCrumpFdmWasm();
  return loadPromise;
}

async function initializeCrumpFdmWasm(): Promise<CrumpFdmKernelSource> {
  if (typeof window === "undefined") {
    source = "ts-fallback";
    return source;
  }
  try {
    const jsUrl = "/wasm/fs-crump/fs_crump_wasm.js";
    const wasmUrl = "/wasm/fs-crump/fs_crump_wasm_bg.wasm";
    const jsText = await fetch(jsUrl, { signal: AbortSignal.timeout(10_000) }).then((response) => {
      if (!response.ok) throw new Error(`Crump browser glue ${response.status}`);
      return response.text();
    });
    const blobUrl = URL.createObjectURL(new Blob([jsText], { type: "text/javascript" }));
    try {
      const module = (await import(/* webpackIgnore: true */ blobUrl)) as {
        default: (moduleOrPath?: unknown) => Promise<unknown>;
        crump_fdm_step: CrumpFdmStepFn;
      };
      await module.default({ module_or_path: wasmUrl });
      if (typeof module.crump_fdm_step !== "function") {
        throw new Error("crump_fdm_step missing from browser module");
      }
      stepFn = module.crump_fdm_step;
      source = "wasm";
    } finally {
      URL.revokeObjectURL(blobUrl);
    }
  } catch (error) {
    console.warn("Failed to load fs-crump-wasm; using typed reduced-law fallback", error);
    stepFn = null;
    source = "ts-fallback";
  }
  return source;
}

function fallbackState(controls: CrumpFdmControls): CrumpFdmRuntimeTelemetry {
  return { ...stepCrumpFdmSi(controls), runtimeSource: "ts-fallback" };
}

/** Step validated generic FrankenSim owners when loaded, otherwise their TS mirror. */
export function stepCrumpFdmPhysics(controls: CrumpFdmControls): CrumpFdmRuntimeTelemetry {
  const fallback = fallbackState(controls);
  if (!stepFn || !fallback.claim1ApparatusPresent || !fallback.claim2HeatingMeansPresent) {
    return fallback;
  }
  try {
    const decoded = decodeCrumpFdmWasmStep(
      stepFn(
        fallback.apparentViscosityPaS,
        CRUMP_FDM_ILLUSTRATIVE_NOZZLE_LAND_LENGTH_MM / 1000,
        controls.nozzleDiameterMm / 2000,
        fallback.volumetricFlowRateMm3S * 1e-9,
        controls.layerHeightMm / 1000,
        0.082e-6,
        controls.nozzleTempC + 273.15,
        controls.ambientTempC + 273.15,
        CRUMP_FDM_GLASS_TRANSITION_TEMP_C + 273.15,
      ),
    );
    if (!decoded) return fallback;
    if (
      !closeEnough(decoded.pressure_drop_pa * 1e-6, fallback.nozzlePressureDropMPa) ||
      !closeEnough(decoded.wall_shear_rate_per_s, fallback.wallShearRatePerS) ||
      !closeEnough(decoded.hydraulic_power_w, fallback.hydraulicPowerW) ||
      !closeEnough(decoded.cooling_time_constant_s, fallback.coolingTimeConstantSec) ||
      !closeEnough(decoded.time_to_threshold_s, fallback.timeToGlassTransitionSec)
    ) {
      return fallback;
    }
    return {
      ...fallback,
      nozzlePressureDropMPa: decoded.pressure_drop_pa * 1e-6,
      wallShearRatePerS: decoded.wall_shear_rate_per_s,
      hydraulicPowerW: decoded.hydraulic_power_w,
      coolingTimeConstantSec: decoded.cooling_time_constant_s,
      timeToGlassTransitionSec: decoded.time_to_threshold_s,
      capillaryOwner: decoded.capillary_owner,
      thermalOwner: decoded.thermal_owner,
      capillaryBoundary: decoded.capillary_boundary,
      thermalBoundary: decoded.thermal_boundary,
      runtimeSource: "wasm",
    };
  } catch {
    return fallback;
  }
}
