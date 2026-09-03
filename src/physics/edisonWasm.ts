export type EdisonKernelSource = "wasm" | "ts-fallback" | "unloaded";

type EdisonRadiativeFn = (
  voltageV: number,
  hotResistanceOhm: number,
  radiatingAreaM2: number,
  emissivity: number,
  ambientTemperatureK: number,
) => string;
type EdisonKernelSourceListener = () => void;

export interface EdisonRadiativeState {
  voltage_v: number;
  current_a: number;
  joule_power_w: number;
  filament_temperature_k: number;
  radiative_power_w: number;
  relative_energy_closure: number;
  runtimeSource: Exclude<EdisonKernelSource, "unloaded">;
}

export interface EdisonRadiativeInput {
  voltageV: number;
  hotResistanceOhm: number;
  filamentLengthCm: number;
  /** Declared gray-body emissivity; the patent does not print this value. */
  emissivity?: number;
  ambientTemperatureK?: number;
}

/** Fig. 2 states wire as small as seven one-thousandths of an inch. */
export const EDISON_SOURCE_FILAMENT_DIAMETER_M = 0.007 * 0.0254;
export const EDISON_SOURCE_MIN_RESISTANCE_OHM = 100;
export const EDISON_SOURCE_MAX_RESISTANCE_OHM = 500;
export const EDISON_DECLARED_FILAMENT_LENGTH_CM = 22;
export const EDISON_DECLARED_HOT_RESISTANCE_OHM = 145;
export const EDISON_DECLARED_EMISSIVITY = 0.8;
export const EDISON_DECLARED_AMBIENT_TEMPERATURE_K = 293.15;
const STEFAN_BOLTZMANN_W_M2_K4 = 5.670374419e-8;

let radiativeFn: EdisonRadiativeFn | null = null;
let loadPromise: Promise<EdisonKernelSource> | null = null;
let source: EdisonKernelSource = "unloaded";
const sourceListeners = new Set<EdisonKernelSourceListener>();

export function edisonKernelSource(): EdisonKernelSource {
  return source;
}

export function subscribeEdisonKernelSource(listener: EdisonKernelSourceListener): () => void {
  sourceListeners.add(listener);
  return () => sourceListeners.delete(listener);
}

function setEdisonKernelSource(next: EdisonKernelSource): void {
  if (source === next) return;
  source = next;
  for (const listener of [...sourceListeners]) listener();
}

export function edisonFilamentAreaM2(filamentLengthCm: number): number {
  return Math.PI * EDISON_SOURCE_FILAMENT_DIAMETER_M * filamentLengthCm * 0.01;
}

function finiteNonNegative(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

export function decodeEdisonRadiativeWasmStep(raw: string): EdisonRadiativeState | null {
  try {
    const parsed = JSON.parse(raw) as { ok?: Partial<EdisonRadiativeState> };
    const result = parsed.ok;
    if (!result) return null;
    const values = [
      result.voltage_v,
      result.current_a,
      result.joule_power_w,
      result.filament_temperature_k,
      result.radiative_power_w,
      result.relative_energy_closure,
    ];
    if (!values.every(finiteNonNegative)) return null;
    if ((result.filament_temperature_k as number) <= 0) return null;
    if ((result.relative_energy_closure as number) > 1e-8) return null;
    const expectedJoule = (result.voltage_v as number) * (result.current_a as number);
    const scale = Math.max(1, expectedJoule);
    if (Math.abs(expectedJoule - (result.joule_power_w as number)) / scale > 1e-10) return null;
    if (
      Math.abs((result.joule_power_w as number) - (result.radiative_power_w as number)) / scale >
      1e-8
    ) {
      return null;
    }
    return { ...(result as Omit<EdisonRadiativeState, "runtimeSource">), runtimeSource: "wasm" };
  } catch {
    return null;
  }
}

export function ensureEdisonWasm(): Promise<EdisonKernelSource> {
  loadPromise ??= initializeEdisonWasm();
  return loadPromise;
}

async function initializeEdisonWasm(): Promise<EdisonKernelSource> {
  if (typeof window === "undefined") {
    setEdisonKernelSource("ts-fallback");
    return source;
  }
  try {
    const jsUrl = "/wasm/fs-edison/fs_edison_wasm.js";
    const wasmUrl = "/wasm/fs-edison/fs_edison_wasm_bg.wasm";
    const jsText = await fetch(jsUrl, { signal: AbortSignal.timeout(10_000) }).then((response) => {
      if (!response.ok) throw new Error(`Edison browser glue ${response.status}`);
      return response.text();
    });
    const blobUrl = URL.createObjectURL(new Blob([jsText], { type: "text/javascript" }));
    try {
      const module = (await import(/* webpackIgnore: true */ blobUrl)) as {
        default: (moduleOrPath?: unknown) => Promise<unknown>;
        edison_radiative_step: EdisonRadiativeFn;
      };
      await module.default({ module_or_path: wasmUrl });
      if (typeof module.edison_radiative_step !== "function") {
        throw new Error("edison_radiative_step missing from browser module");
      }
      radiativeFn = module.edison_radiative_step;
      setEdisonKernelSource("wasm");
    } finally {
      URL.revokeObjectURL(blobUrl);
    }
  } catch (error) {
    console.warn("Failed to load fs-edison-wasm; using typed radiative fallback", error);
    radiativeFn = null;
    setEdisonKernelSource("ts-fallback");
  }
  return source;
}

function fallbackRadiativeStep(
  voltageV: number,
  hotResistanceOhm: number,
  radiatingAreaM2: number,
  emissivity: number,
  ambientTemperatureK: number,
): EdisonRadiativeState {
  const currentA = voltageV / hotResistanceOhm;
  const joulePowerW = voltageV * currentA;
  const coefficient = emissivity * STEFAN_BOLTZMANN_W_M2_K4 * radiatingAreaM2;
  const filamentTemperatureK = (ambientTemperatureK ** 4 + joulePowerW / coefficient) ** 0.25;
  const radiativePowerW = coefficient * (filamentTemperatureK ** 4 - ambientTemperatureK ** 4);
  return {
    voltage_v: voltageV,
    current_a: currentA,
    joule_power_w: joulePowerW,
    filament_temperature_k: filamentTemperatureK,
    radiative_power_w: radiativePowerW,
    relative_energy_closure: Math.abs(joulePowerW - radiativePowerW) / Math.max(1, joulePowerW),
    runtimeSource: "ts-fallback",
  };
}

/**
 * Execute the compiled fs-conduction owner when available; otherwise execute
 * the equation-identical typed fallback. Invalid calls refuse with `null`.
 */
export function stepEdisonRadiativeBalance(
  input: EdisonRadiativeInput,
): EdisonRadiativeState | null {
  const emissivity = input.emissivity ?? EDISON_DECLARED_EMISSIVITY;
  const ambientTemperatureK = input.ambientTemperatureK ?? EDISON_DECLARED_AMBIENT_TEMPERATURE_K;
  const radiatingAreaM2 = edisonFilamentAreaM2(input.filamentLengthCm);
  if (
    !Number.isFinite(input.voltageV) ||
    input.voltageV < 0 ||
    !Number.isFinite(input.hotResistanceOhm) ||
    input.hotResistanceOhm <= 0 ||
    !Number.isFinite(radiatingAreaM2) ||
    radiatingAreaM2 <= 0 ||
    !Number.isFinite(emissivity) ||
    emissivity <= 0 ||
    emissivity > 1 ||
    !Number.isFinite(ambientTemperatureK) ||
    ambientTemperatureK <= 0
  ) {
    return null;
  }
  if (radiativeFn) {
    try {
      const compiled = decodeEdisonRadiativeWasmStep(
        radiativeFn(
          input.voltageV,
          input.hotResistanceOhm,
          radiatingAreaM2,
          emissivity,
          ambientTemperatureK,
        ),
      );
      if (compiled) return compiled;
    } catch {
      // Fall through to the equation-identical typed owner.
    }
  }
  return fallbackRadiativeStep(
    input.voltageV,
    input.hotResistanceOhm,
    radiatingAreaM2,
    emissivity,
    ambientTemperatureK,
  );
}
