export type DaVinciTopologyKernelSource = "wasm" | "ts-fallback" | "unloaded";

type DaVinciTopologyFn = (
  baseYawRad: number,
  carriagePitchRad: number,
  distalPitchRad: number,
  distalYawRad: number,
  toolRollRad: number,
  insertionNormalized: number,
  compatibilityIdentifierPresent: boolean,
) => string;

export interface DaVinciTopologyWasmStep {
  joint_dofs: number;
  base_yaw_axis: [number, number, number];
  carriage_pitch_axis: [number, number, number];
  insertion_axis: [number, number, number];
  distal_pitch_axis: [number, number, number];
  distal_yaw_axis: [number, number, number];
  tool_roll_axis: [number, number, number];
  base_yaw_rad: number;
  carriage_pitch_rad: number;
  distal_pitch_rad: number;
  distal_yaw_rad: number;
  tool_roll_rad: number;
  insertion_normalized: number;
  compatibility_identifier_present: boolean;
}

let topologyFn: DaVinciTopologyFn | null = null;
let loadPromise: Promise<DaVinciTopologyKernelSource> | null = null;
let source: DaVinciTopologyKernelSource = "unloaded";

export function daVinciTopologyKernelSource(): DaVinciTopologyKernelSource {
  return source;
}

function isAxis(
  value: unknown,
  expected: readonly [number, number, number],
): value is [number, number, number] {
  return (
    Array.isArray(value) &&
    value.length === 3 &&
    value.every(
      (component, index) =>
        typeof component === "number" &&
        Number.isFinite(component) &&
        component === expected[index],
    )
  );
}

export function decodeDaVinciTopologyWasmStep(raw: string): DaVinciTopologyWasmStep | null {
  try {
    const parsed = JSON.parse(raw) as { ok?: Partial<DaVinciTopologyWasmStep> };
    const result = parsed.ok;
    if (result?.joint_dofs !== 6) return null;
    if (
      !isAxis(result.base_yaw_axis, [0, 1, 0]) ||
      !isAxis(result.carriage_pitch_axis, [1, 0, 0]) ||
      !isAxis(result.insertion_axis, [0, -1, 0]) ||
      !isAxis(result.distal_pitch_axis, [1, 0, 0]) ||
      !isAxis(result.distal_yaw_axis, [0, 0, 1]) ||
      !isAxis(result.tool_roll_axis, [0, 1, 0])
    ) {
      return null;
    }
    const coordinates = [
      result.base_yaw_rad,
      result.carriage_pitch_rad,
      result.distal_pitch_rad,
      result.distal_yaw_rad,
      result.tool_roll_rad,
      result.insertion_normalized,
    ];
    if (!coordinates.every((value) => typeof value === "number" && Number.isFinite(value))) {
      return null;
    }
    if (Math.abs(result.insertion_normalized as number) > 1) return null;
    if (typeof result.compatibility_identifier_present !== "boolean") return null;
    return result as DaVinciTopologyWasmStep;
  } catch {
    return null;
  }
}

export function ensureDaVinciTopologyWasm(): Promise<DaVinciTopologyKernelSource> {
  loadPromise ??= initializeDaVinciTopologyWasm();
  return loadPromise;
}

async function initializeDaVinciTopologyWasm(): Promise<DaVinciTopologyKernelSource> {
  if (typeof window === "undefined") {
    source = "ts-fallback";
    return source;
  }
  try {
    const jsUrl = "/wasm/fs-davinci/fs_davinci_wasm.js";
    const wasmUrl = "/wasm/fs-davinci/fs_davinci_wasm_bg.wasm";
    const jsText = await fetch(jsUrl, { signal: AbortSignal.timeout(10_000) }).then((response) => {
      if (!response.ok) throw new Error(`Da Vinci browser glue ${response.status}`);
      return response.text();
    });
    const blobUrl = URL.createObjectURL(new Blob([jsText], { type: "text/javascript" }));
    try {
      const module = (await import(/* webpackIgnore: true */ blobUrl)) as {
        default: (moduleOrPath?: unknown) => Promise<unknown>;
        davinci_topology_step: DaVinciTopologyFn;
      };
      await module.default({ module_or_path: wasmUrl });
      if (typeof module.davinci_topology_step !== "function") {
        throw new Error("davinci_topology_step missing from browser module");
      }
      topologyFn = module.davinci_topology_step;
      source = "wasm";
    } finally {
      URL.revokeObjectURL(blobUrl);
    }
  } catch (error) {
    console.warn("Failed to load fs-davinci-wasm; using typed topology fallback", error);
    topologyFn = null;
    source = "ts-fallback";
  }
  return source;
}

export function tryDaVinciTopologyWasmStep(
  baseYawRad: number,
  carriagePitchRad: number,
  distalPitchRad: number,
  distalYawRad: number,
  toolRollRad: number,
  insertionNormalized: number,
  compatibilityIdentifierPresent: boolean,
): DaVinciTopologyWasmStep | null {
  if (!topologyFn) return null;
  try {
    return decodeDaVinciTopologyWasmStep(
      topologyFn(
        baseYawRad,
        carriagePitchRad,
        distalPitchRad,
        distalYawRad,
        toolRollRad,
        insertionNormalized,
        compatibilityIdentifierPresent,
      ),
    );
  } catch {
    return null;
  }
}
