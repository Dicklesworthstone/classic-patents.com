export type GoddardKernelSource = "wasm" | "ts-fallback" | "unloaded";

type GoddardFn = (
  chamberPressurePsi: number,
  fuelFlowKgPerSec: number,
  throatAreaCm2: number,
  expansionRatio: number,
) => string;

type GoddardApparatusFn = (
  elapsedSeconds: number,
  primarySpinRpm: number,
  gyroSpinRpm: number,
  tubeLengthRatio: number,
  auxiliaryReleaseFraction: number,
  primaryChargeSubstantiallyConsumed: boolean,
  gyroEnabled: boolean,
) => string;

export interface GoddardWasmStep {
  chamber_pressure_psi: number;
  chamber_pressure_pa: number;
  exhaust_velocity_mps: number;
  thrust_newtons: number;
  specific_impulse_sec: number;
  mach_exit: number;
}

export interface GoddardApparatusWasmStep {
  primary_quaternion: [number, number, number, number];
  gyro_quaternion: [number, number, number, number];
  primary_angular_velocity_rad_per_sec: number;
  gyro_angular_velocity_rad_per_sec: number;
  camera_support_angular_velocity_rad_per_sec: number;
  primary_rim_speed_per_radius_mps_per_m: number;
  tube_length_ratio: number;
  claim_2_ratio_margin: number;
  claim_2_satisfied: boolean;
  claim_1_sequence_satisfied: boolean;
  auxiliary_nested: boolean;
  gyro_enabled: boolean;
}

let goddardFn: GoddardFn | null = null;
let goddardApparatusFn: GoddardApparatusFn | null = null;
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

function isUnitQuaternion(value: unknown): value is [number, number, number, number] {
  if (
    !Array.isArray(value) ||
    value.length !== 4 ||
    !value.every((component) => typeof component === "number" && Number.isFinite(component))
  ) {
    return false;
  }
  const normSquared = value.reduce((sum, component) => sum + component * component, 0);
  return Math.abs(normSquared - 1) <= 1e-9;
}

export function decodeGoddardApparatusWasmStep(raw: string): GoddardApparatusWasmStep | null {
  try {
    const parsed = JSON.parse(raw) as { ok?: Partial<GoddardApparatusWasmStep> };
    const result = parsed.ok;
    if (!result) return null;
    if (!isUnitQuaternion(result.primary_quaternion)) return null;
    if (!isUnitQuaternion(result.gyro_quaternion)) return null;

    const finiteScalars = [
      result.primary_angular_velocity_rad_per_sec,
      result.gyro_angular_velocity_rad_per_sec,
      result.camera_support_angular_velocity_rad_per_sec,
      result.primary_rim_speed_per_radius_mps_per_m,
      result.tube_length_ratio,
      result.claim_2_ratio_margin,
    ];
    if (!finiteScalars.every((value) => typeof value === "number" && Number.isFinite(value))) {
      return null;
    }
    if (
      typeof result.claim_2_satisfied !== "boolean" ||
      typeof result.claim_1_sequence_satisfied !== "boolean" ||
      typeof result.auxiliary_nested !== "boolean" ||
      typeof result.gyro_enabled !== "boolean"
    ) {
      return null;
    }
    if (
      (result.primary_angular_velocity_rad_per_sec ?? -1) < 0 ||
      (result.gyro_angular_velocity_rad_per_sec ?? -1) < 0 ||
      (result.camera_support_angular_velocity_rad_per_sec ?? -1) < 0 ||
      (result.primary_rim_speed_per_radius_mps_per_m ?? -1) < 0 ||
      (result.tube_length_ratio ?? 0) < 1
    ) {
      return null;
    }
    return result as GoddardApparatusWasmStep;
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
        goddard_apparatus_step: GoddardApparatusFn;
        goddard_rocket_step: GoddardFn;
      };
      await mod.default({ module_or_path: wasmUrl });
      if (typeof mod.goddard_apparatus_step !== "function") {
        throw new Error("goddard_apparatus_step missing from wasm module");
      }
      if (typeof mod.goddard_rocket_step !== "function") {
        throw new Error("goddard_rocket_step missing from wasm module");
      }
      goddardApparatusFn = mod.goddard_apparatus_step;
      goddardFn = mod.goddard_rocket_step;
      source = "wasm";
    } finally {
      URL.revokeObjectURL(blobUrl);
    }
  } catch (err) {
    console.warn("Failed to load fs-goddard-wasm, using fallback", err);
    goddardApparatusFn = null;
    goddardFn = null;
    source = "ts-fallback";
  }
  return source;
}

export function tryGoddardApparatusWasmStep(
  elapsedSeconds: number,
  primarySpinRpm: number,
  gyroSpinRpm: number,
  tubeLengthRatio: number,
  auxiliaryReleaseFraction: number,
  primaryChargeSubstantiallyConsumed: boolean,
  gyroEnabled: boolean,
): GoddardApparatusWasmStep | null {
  if (!goddardApparatusFn) return null;
  try {
    const raw = goddardApparatusFn(
      elapsedSeconds,
      primarySpinRpm,
      gyroSpinRpm,
      tubeLengthRatio,
      auxiliaryReleaseFraction,
      primaryChargeSubstantiallyConsumed,
      gyroEnabled,
    );
    return decodeGoddardApparatusWasmStep(raw);
  } catch {
    return null;
  }
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
