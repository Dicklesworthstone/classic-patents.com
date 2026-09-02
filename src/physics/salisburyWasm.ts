import {
  type SalisburyRobotHandControls,
  type SalisburyRobotHandTelemetry,
  stepSalisburyRobotHandSi,
} from "./salisburyRobotHandKernel";

export type SalisburyKernelSource = "wasm" | "ts-fallback" | "unloaded";

type SalisburyStepFn = (
  tensionT1N: number,
  tensionT2N: number,
  tensionT3N: number,
  tensionT4N: number,
  radiusScaleM: number,
  firstIdlerFixed: boolean,
) => string;

export interface SalisburyWasmStep {
  scalar_joint_coordinates: 9;
  digit_count: 3;
  palm_root_present: true;
  joint_parent_coordinates: [-1, 0, 1, -1, 3, 4, -1, 6, 7];
  cable_end_count: 12;
  axis_1: [0, 1, 0];
  axis_2: [1, 0, 0];
  axis_3: [1, 0, 0];
  /** One digit's four admitted tensions; the topology receipt still owns 12 cable ends. */
  tendon_tensions_n: [number, number, number, number];
  pulley_radii_m: [number, number, number];
  joint_torques_nm: [number, number, number];
  claim_1_routing_present: true;
  claim_2_first_idler_fixed: boolean;
  historical_dynamics_available: false;
}

export interface SalisburyMechanismState extends SalisburyRobotHandTelemetry {
  runtimeSource: Exclude<SalisburyKernelSource, "unloaded">;
  scalarJointCoordinates: 9;
  digitCount: 3;
  palmRootPresent: true;
  jointParentCoordinates: [-1, 0, 1, -1, 3, 4, -1, 6, 7];
  cableEndCount: 12;
  axis1: [0, 1, 0];
  axis2: [1, 0, 0];
  axis3: [1, 0, 0];
}

let stepFn: SalisburyStepFn | null = null;
let loadPromise: Promise<SalisburyKernelSource> | null = null;
let source: SalisburyKernelSource = "unloaded";

export function salisburyKernelSource(): SalisburyKernelSource {
  return source;
}

/** UI label that cannot claim a WASM step until the validated module actually supplied it. */
export function salisburyRuntimeLabel(
  runtimeSource: Exclude<SalisburyKernelSource, "unloaded">,
): string {
  return runtimeSource === "wasm" ? "fs-mbd WASM" : "typed source-law fallback";
}

function isExactAxis(
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

function isFiniteTuple(value: unknown, length: number, minimum = -Infinity): value is number[] {
  return (
    Array.isArray(value) &&
    value.length === length &&
    value.every(
      (component) =>
        typeof component === "number" && Number.isFinite(component) && component >= minimum,
    )
  );
}

function isExactParentGraph(value: unknown): value is [-1, 0, 1, -1, 3, 4, -1, 6, 7] {
  const expected = [-1, 0, 1, -1, 3, 4, -1, 6, 7] as const;
  return (
    Array.isArray(value) &&
    value.length === expected.length &&
    value.every((parent, index) => parent === expected[index])
  );
}

function closeEnough(actual: number, expected: number): boolean {
  return Math.abs(actual - expected) <= 1e-11 * Math.max(1, Math.abs(expected));
}

/** Validate the entire Rust receipt, including the three source-printed equations. */
export function decodeSalisburyWasmStep(raw: string): SalisburyWasmStep | null {
  try {
    const parsed = JSON.parse(raw) as { ok?: Partial<SalisburyWasmStep> };
    const result = parsed.ok;
    if (!result) return null;
    if (
      result.scalar_joint_coordinates !== 9 ||
      result.digit_count !== 3 ||
      result.palm_root_present !== true ||
      !isExactParentGraph(result.joint_parent_coordinates) ||
      result.cable_end_count !== 12
    ) {
      return null;
    }
    if (
      !isExactAxis(result.axis_1, [0, 1, 0]) ||
      !isExactAxis(result.axis_2, [1, 0, 0]) ||
      !isExactAxis(result.axis_3, [1, 0, 0])
    ) {
      return null;
    }
    if (
      !isFiniteTuple(result.tendon_tensions_n, 4, 0) ||
      !isFiniteTuple(result.pulley_radii_m, 3, Number.MIN_VALUE) ||
      !isFiniteTuple(result.joint_torques_nm, 3)
    ) {
      return null;
    }
    if (
      result.claim_1_routing_present !== true ||
      typeof result.claim_2_first_idler_fixed !== "boolean" ||
      result.historical_dynamics_available !== false
    ) {
      return null;
    }

    const [t1, t2, t3, t4] = result.tendon_tensions_n;
    const [r1, r2, r3] = result.pulley_radii_m;
    const [torque1, torque2, torque3] = result.joint_torques_nm;
    if (!closeEnough(r1, 1.2 * r2) || !closeEnough(r3, 1.4 * r2)) return null;
    if (
      !closeEnough(torque1, -t1 * r1 + t2 * r2 + t3 * r2 - t4 * r1) ||
      !closeEnough(torque2, t1 * r3 + t2 * r2 - t3 * r2 - t4 * r3) ||
      !closeEnough(torque3, t2 * r2 - t3 * r2)
    ) {
      return null;
    }
    return result as SalisburyWasmStep;
  } catch {
    return null;
  }
}

export function ensureSalisburyWasm(): Promise<SalisburyKernelSource> {
  loadPromise ??= initializeSalisburyWasm();
  return loadPromise;
}

async function initializeSalisburyWasm(): Promise<SalisburyKernelSource> {
  if (typeof window === "undefined") {
    source = "ts-fallback";
    return source;
  }
  try {
    const jsUrl = "/wasm/fs-salisbury/fs_salisbury_wasm.js";
    const wasmUrl = "/wasm/fs-salisbury/fs_salisbury_wasm_bg.wasm";
    const jsText = await fetch(jsUrl, { signal: AbortSignal.timeout(10_000) }).then((response) => {
      if (!response.ok) throw new Error(`Salisbury browser glue ${response.status}`);
      return response.text();
    });
    const blobUrl = URL.createObjectURL(new Blob([jsText], { type: "text/javascript" }));
    try {
      const module = (await import(/* webpackIgnore: true */ blobUrl)) as {
        default: (moduleOrPath?: unknown) => Promise<unknown>;
        salisbury_hand_step: SalisburyStepFn;
      };
      await module.default({ module_or_path: wasmUrl });
      if (typeof module.salisbury_hand_step !== "function") {
        throw new Error("salisbury_hand_step missing from browser module");
      }
      stepFn = module.salisbury_hand_step;
      source = "wasm";
    } finally {
      URL.revokeObjectURL(blobUrl);
    }
  } catch (error) {
    console.warn("Failed to load fs-salisbury-wasm; using typed source-law fallback", error);
    stepFn = null;
    source = "ts-fallback";
  }
  return source;
}

function fallbackState(controls: SalisburyRobotHandControls): SalisburyMechanismState {
  return {
    ...stepSalisburyRobotHandSi(controls),
    runtimeSource: "ts-fallback",
    scalarJointCoordinates: 9,
    digitCount: 3,
    palmRootPresent: true,
    jointParentCoordinates: [-1, 0, 1, -1, 3, 4, -1, 6, 7],
    cableEndCount: 12,
    axis1: [0, 1, 0],
    axis2: [1, 0, 0],
    axis3: [1, 0, 0],
  };
}

/** Step the validated Rust law when loaded, otherwise its equation-identical TS mirror. */
export function stepSalisburyTopology(
  controls: SalisburyRobotHandControls,
): SalisburyMechanismState {
  const fallback = fallbackState(controls);
  if (!stepFn || fallback.refused) return fallback;
  try {
    const decoded = decodeSalisburyWasmStep(
      stepFn(
        controls.tensionT1N,
        controls.tensionT2N,
        controls.tensionT3N,
        controls.tensionT4N,
        controls.radiusScaleMm / 1000,
        controls.firstIdlerFixed,
      ),
    );
    if (!decoded) return fallback;
    const requestedTensions: [number, number, number, number] = [
      controls.tensionT1N,
      controls.tensionT2N,
      controls.tensionT3N,
      controls.tensionT4N,
    ];
    if (
      decoded.tendon_tensions_n.some(
        (tension, index) => !closeEnough(tension, requestedTensions[index]),
      ) ||
      !closeEnough(decoded.pulley_radii_m[1], controls.radiusScaleMm / 1000) ||
      decoded.claim_2_first_idler_fixed !== controls.firstIdlerFixed
    ) {
      return fallback;
    }
    return {
      ...fallback,
      tendonTensionsN: decoded.tendon_tensions_n,
      pulleyRadiiM: decoded.pulley_radii_m,
      jointTorquesNm: decoded.joint_torques_nm,
      firstIdlerFixed: decoded.claim_2_first_idler_fixed,
      claim1RoutingProbe: decoded.claim_1_routing_present,
      claim2IdlerProbe: decoded.claim_2_first_idler_fixed,
      historicalDynamicsAvailable: decoded.historical_dynamics_available,
      provenance: "WASM_SOURCE_LAW",
      runtimeSource: "wasm",
      scalarJointCoordinates: decoded.scalar_joint_coordinates,
      digitCount: decoded.digit_count,
      palmRootPresent: decoded.palm_root_present,
      jointParentCoordinates: decoded.joint_parent_coordinates,
      cableEndCount: decoded.cable_end_count,
      axis1: decoded.axis_1,
      axis2: decoded.axis_2,
      axis3: decoded.axis_3,
    };
  } catch {
    return fallback;
  }
}
