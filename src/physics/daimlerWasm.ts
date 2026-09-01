export type DaimlerKernelSource = "wasm" | "ts-fallback" | "unloaded";

type DaimlerMarineFn = (shaftSelection: number, coolingPumpEnabled: boolean) => string;

export interface DaimlerMarineWasmStep {
  shaft_translation_along_axis_normalized: number;
  shaft_axis: [number, number, number];
  shaft_joint_dofs: number;
  motor_rotation_sign: number;
  propeller_rotation_sign: number;
  ahead_coupling_engaged: boolean;
  astern_gearing_engaged: boolean;
  neutral: boolean;
  thrust_can_maintain_ahead_contact: boolean;
  passive_fore_aft_cooling_path_present: boolean;
  cooling_pump_active: boolean;
}

let daimlerMarineFn: DaimlerMarineFn | null = null;
let loadPromise: Promise<DaimlerKernelSource> | null = null;
let source: DaimlerKernelSource = "unloaded";

export function daimlerKernelSource(): DaimlerKernelSource {
  return source;
}

export function decodeDaimlerMarineWasmStep(raw: string): DaimlerMarineWasmStep | null {
  try {
    const parsed = JSON.parse(raw) as { ok?: Partial<DaimlerMarineWasmStep> };
    const result = parsed.ok;
    if (!result) return null;
    if (
      !Array.isArray(result.shaft_axis) ||
      result.shaft_axis.length !== 3 ||
      !result.shaft_axis.every((component) =>
        typeof component === "number" ? Number.isFinite(component) : false,
      )
    ) {
      return null;
    }
    const scalars = [
      result.shaft_translation_along_axis_normalized,
      result.shaft_joint_dofs,
      result.motor_rotation_sign,
      result.propeller_rotation_sign,
    ];
    if (!scalars.every((value) => typeof value === "number" && Number.isFinite(value))) {
      return null;
    }
    const booleans = [
      result.ahead_coupling_engaged,
      result.astern_gearing_engaged,
      result.neutral,
      result.thrust_can_maintain_ahead_contact,
      result.passive_fore_aft_cooling_path_present,
      result.cooling_pump_active,
    ];
    if (!booleans.every((value) => typeof value === "boolean")) return null;
    if (
      ![-1, 0, 1].includes(result.shaft_translation_along_axis_normalized as number) ||
      result.shaft_joint_dofs !== 1 ||
      result.motor_rotation_sign !== 1 ||
      ![-1, 0, 1].includes(result.propeller_rotation_sign as number) ||
      result.passive_fore_aft_cooling_path_present !== true
    ) {
      return null;
    }
    const activeDrivePaths =
      Number(result.ahead_coupling_engaged) +
      Number(result.astern_gearing_engaged) +
      Number(result.neutral);
    if (activeDrivePaths !== 1) return null;
    return result as DaimlerMarineWasmStep;
  } catch {
    return null;
  }
}

export function ensureDaimlerWasm(): Promise<DaimlerKernelSource> {
  loadPromise ??= initializeDaimlerWasm();
  return loadPromise;
}

async function initializeDaimlerWasm(): Promise<DaimlerKernelSource> {
  if (typeof window === "undefined") {
    source = "ts-fallback";
    return source;
  }
  try {
    const jsUrl = "/wasm/fs-daimler/fs_daimler_wasm.js";
    const wasmUrl = "/wasm/fs-daimler/fs_daimler_wasm_bg.wasm";
    const jsText = await fetch(jsUrl, { signal: AbortSignal.timeout(10_000) }).then((response) => {
      if (!response.ok) throw new Error(`Daimler browser glue ${response.status}`);
      return response.text();
    });
    const blobUrl = URL.createObjectURL(new Blob([jsText], { type: "text/javascript" }));
    try {
      const module = (await import(/* webpackIgnore: true */ blobUrl)) as {
        default: (moduleOrPath?: unknown) => Promise<unknown>;
        daimler_marine_step: DaimlerMarineFn;
      };
      await module.default({ module_or_path: wasmUrl });
      if (typeof module.daimler_marine_step !== "function") {
        throw new Error("daimler_marine_step missing from browser module");
      }
      daimlerMarineFn = module.daimler_marine_step;
      source = "wasm";
    } finally {
      URL.revokeObjectURL(blobUrl);
    }
  } catch (error) {
    console.warn("Failed to load fs-daimler-wasm; using typed fallback", error);
    daimlerMarineFn = null;
    source = "ts-fallback";
  }
  return source;
}

export function tryDaimlerMarineWasmStep(
  shaftSelection: number,
  coolingPumpEnabled: boolean,
): DaimlerMarineWasmStep | null {
  if (!daimlerMarineFn) return null;
  try {
    return decodeDaimlerMarineWasmStep(daimlerMarineFn(shaftSelection, coolingPumpEnabled));
  } catch {
    return null;
  }
}
