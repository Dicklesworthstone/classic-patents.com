import {
  HOWE_BASTER_POINT_PITCH_IN,
  HOWE_NEEDLE_EYE_OFFSET_IN,
  type HoweLockstitchState,
  stepHoweLockstitch,
} from "./machineKernels";

export type HoweKernelSource = "wasm" | "ts-fallback" | "unloaded";

type HoweTopologyFn = (
  crankAngleRad: number,
  loopSlackNormalized: number,
  claim1InterlockEnabled: boolean,
) => string;

type HowePhase = "penetrate" | "retract-and-open-loop" | "shuttle-pass" | "feed";

export interface HoweTopologyWasmStep {
  scalar_joint_coordinates: number;
  independent_drive_dofs: number;
  main_shaft_axis: [number, number, number];
  needle_arm_axis: [number, number, number];
  shuttle_axis: [number, number, number];
  lifting_rod_axis: [number, number, number];
  baster_feed_axis: [number, number, number];
  crank_angle_rad: number;
  needle_penetration_normalized: number;
  needle_arm_angle_rad: number;
  needle_retracting: boolean;
  shuttle_travel_normalized: number;
  loop_open_fraction: number;
  loop_open: boolean;
  shuttle_passes_loop: boolean;
  shuttle_track_offset_normalized: number;
  picker_left_normalized: number;
  picker_right_normalized: number;
  lifting_rod_normalized: number;
  feed_advance_fraction: number;
  thread_clamp_engaged: boolean;
  claim_1_interlock_satisfied: boolean;
  cycle_phase: HowePhase;
  needle_eye_offset_in: number;
  baster_point_pitch_in: number;
}

export interface HoweMechanismState extends HoweLockstitchState {
  runtimeSource: Exclude<HoweKernelSource, "unloaded">;
  scalarJointCoordinates: number;
  independentDriveDofs: number;
  mainShaftAxis: [number, number, number];
  needleArmAxis: [number, number, number];
  shuttleAxis: [number, number, number];
  liftingRodAxis: [number, number, number];
  basterFeedAxis: [number, number, number];
}

let topologyFn: HoweTopologyFn | null = null;
let loadPromise: Promise<HoweKernelSource> | null = null;
let source: HoweKernelSource = "unloaded";

export function howeKernelSource(): HoweKernelSource {
  return source;
}

function isAxis(
  value: unknown,
  expected: readonly [number, number, number],
): value is [number, number, number] {
  return (
    Array.isArray(value) &&
    value.length === expected.length &&
    value.every(
      (component, index) =>
        typeof component === "number" &&
        Number.isFinite(component) &&
        component === expected[index],
    )
  );
}

function isFiniteIn(value: unknown, minimum: number, maximum: number): value is number {
  return (
    typeof value === "number" && Number.isFinite(value) && value >= minimum && value <= maximum
  );
}

export function decodeHoweTopologyWasmStep(raw: string): HoweTopologyWasmStep | null {
  try {
    const parsed = JSON.parse(raw) as { ok?: Partial<HoweTopologyWasmStep> };
    const result = parsed.ok;
    if (!result) return null;
    if (result.scalar_joint_coordinates !== 7 || result.independent_drive_dofs !== 1) return null;
    if (
      !isAxis(result.main_shaft_axis, [0, 0, 1]) ||
      !isAxis(result.needle_arm_axis, [0, 0, 1]) ||
      !isAxis(result.shuttle_axis, [1, 0, 0]) ||
      !isAxis(result.lifting_rod_axis, [0, 1, 0]) ||
      !isAxis(result.baster_feed_axis, [1, 0, 0])
    ) {
      return null;
    }
    if (
      !isFiniteIn(result.crank_angle_rad, 0, 2 * Math.PI) ||
      !isFiniteIn(result.needle_penetration_normalized, 0, 1) ||
      !isFiniteIn(result.needle_arm_angle_rad, -0.13, 0.13) ||
      !isFiniteIn(result.shuttle_travel_normalized, -1, 1) ||
      !isFiniteIn(result.loop_open_fraction, 0, 1) ||
      !isFiniteIn(result.shuttle_track_offset_normalized, 0, 0.55) ||
      !isFiniteIn(result.picker_left_normalized, 0, 1) ||
      !isFiniteIn(result.picker_right_normalized, 0, 1) ||
      !isFiniteIn(result.lifting_rod_normalized, 0, 1) ||
      !isFiniteIn(result.feed_advance_fraction, 0, 1)
    ) {
      return null;
    }
    const booleans = [
      result.needle_retracting,
      result.loop_open,
      result.shuttle_passes_loop,
      result.thread_clamp_engaged,
      result.claim_1_interlock_satisfied,
    ];
    if (!booleans.every((value) => typeof value === "boolean")) return null;
    if (result.shuttle_passes_loop && !result.loop_open) return null;
    if (
      !["penetrate", "retract-and-open-loop", "shuttle-pass", "feed"].includes(
        result.cycle_phase ?? "",
      )
    ) {
      return null;
    }
    if (
      result.needle_eye_offset_in !== HOWE_NEEDLE_EYE_OFFSET_IN ||
      result.baster_point_pitch_in !== HOWE_BASTER_POINT_PITCH_IN
    ) {
      return null;
    }
    return result as HoweTopologyWasmStep;
  } catch {
    return null;
  }
}

export function ensureHoweWasm(): Promise<HoweKernelSource> {
  loadPromise ??= initializeHoweWasm();
  return loadPromise;
}

async function initializeHoweWasm(): Promise<HoweKernelSource> {
  if (typeof window === "undefined") {
    source = "ts-fallback";
    return source;
  }
  try {
    const jsUrl = "/wasm/fs-howe/fs_howe_wasm.js";
    const wasmUrl = "/wasm/fs-howe/fs_howe_wasm_bg.wasm";
    const jsText = await fetch(jsUrl, { signal: AbortSignal.timeout(10_000) }).then((response) => {
      if (!response.ok) throw new Error(`Howe browser glue ${response.status}`);
      return response.text();
    });
    const blobUrl = URL.createObjectURL(new Blob([jsText], { type: "text/javascript" }));
    try {
      const module = (await import(/* webpackIgnore: true */ blobUrl)) as {
        default: (moduleOrPath?: unknown) => Promise<unknown>;
        howe_topology_step: HoweTopologyFn;
      };
      await module.default({ module_or_path: wasmUrl });
      if (typeof module.howe_topology_step !== "function") {
        throw new Error("howe_topology_step missing from browser module");
      }
      topologyFn = module.howe_topology_step;
      source = "wasm";
    } finally {
      URL.revokeObjectURL(blobUrl);
    }
  } catch (error) {
    console.warn("Failed to load fs-howe-wasm; using typed topology fallback", error);
    topologyFn = null;
    source = "ts-fallback";
  }
  return source;
}

function fallbackHoweState(
  crankDeg: number,
  loopSlackPct: number,
  claim1InterlockEnabled: boolean,
): HoweMechanismState {
  return {
    ...stepHoweLockstitch(crankDeg, loopSlackPct, claim1InterlockEnabled),
    runtimeSource: "ts-fallback",
    scalarJointCoordinates: 7,
    independentDriveDofs: 1,
    mainShaftAxis: [0, 0, 1],
    needleArmAxis: [0, 0, 1],
    shuttleAxis: [1, 0, 0],
    liftingRodAxis: [0, 1, 0],
    basterFeedAxis: [1, 0, 0],
  };
}

function stateFromWasm(result: HoweTopologyWasmStep): HoweMechanismState {
  const crankAngleDeg = (result.crank_angle_rad * 180) / Math.PI;
  const loopWidth = result.loop_open_fraction * 40;
  return {
    crankAngleDeg,
    crankAngleRad: result.crank_angle_rad,
    needleY: result.needle_penetration_normalized * 45,
    shuttleX: result.shuttle_travel_normalized * 60,
    loopOpen: result.loop_open,
    loopWidth,
    loopSvgControlX: loopWidth * 1.5,
    needleStudioRotZ: result.needle_arm_angle_rad,
    needleStudioY: result.needle_penetration_normalized,
    needleArmAngleRad: result.needle_arm_angle_rad,
    needlePenetrationNormalized: result.needle_penetration_normalized,
    needleRetracting: result.needle_retracting,
    shuttleTravelNormalized: result.shuttle_travel_normalized,
    shuttlePassesLoop: result.shuttle_passes_loop,
    shuttleTrackOffsetZ: result.shuttle_track_offset_normalized,
    pickerLeftNormalized: result.picker_left_normalized,
    pickerRightNormalized: result.picker_right_normalized,
    liftingRodNormalized: result.lifting_rod_normalized,
    feedAdvanceFraction: result.feed_advance_fraction,
    threadClampEngaged: result.thread_clamp_engaged,
    claim1InterlockSatisfied: result.claim_1_interlock_satisfied,
    cyclePhaseLabel: result.cycle_phase,
    shuttleStudioZ: result.shuttle_travel_normalized * 1.2,
    runtimeSource: "wasm",
    scalarJointCoordinates: result.scalar_joint_coordinates,
    independentDriveDofs: result.independent_drive_dofs,
    mainShaftAxis: result.main_shaft_axis,
    needleArmAxis: result.needle_arm_axis,
    shuttleAxis: result.shuttle_axis,
    liftingRodAxis: result.lifting_rod_axis,
    basterFeedAxis: result.baster_feed_axis,
  };
}

/** Execute fs-mbd WASM when loaded, otherwise its typed equation-identical mirror. */
export function stepHoweTopology(
  crankDeg: number,
  loopSlackPct = 65,
  claim1InterlockEnabled = true,
): HoweMechanismState {
  if (!topologyFn) return fallbackHoweState(crankDeg, loopSlackPct, claim1InterlockEnabled);
  try {
    const decoded = decodeHoweTopologyWasmStep(
      topologyFn((crankDeg * Math.PI) / 180, loopSlackPct / 100, claim1InterlockEnabled),
    );
    return decoded
      ? stateFromWasm(decoded)
      : fallbackHoweState(crankDeg, loopSlackPct, claim1InterlockEnabled);
  } catch {
    return fallbackHoweState(crankDeg, loopSlackPct, claim1InterlockEnabled);
  }
}
