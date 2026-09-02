import {
  type OtisDriveCommand,
  type OtisMechanismMode,
  type OtisTopologyControls,
  type OtisTopologyState,
  stepOtis1861Topology,
} from "./otisKernel";

export type OtisKernelSource = "wasm" | "ts-fallback" | "unloaded";

type OtisTopologyFn = (
  platformPositionNormalized: number,
  drivePhaseRad: number,
  driveCommand: number,
  ropeGIntact: boolean,
  stopRopePulled: boolean,
  claim1HookLockEnabled: boolean,
  claim3BrakeInterlockEnabled: boolean,
  claim4CounterpoiseEnabled: boolean,
) => string;

export interface OtisTopologyWasmStep {
  scalar_joint_coordinates: number;
  independent_drive_dofs: number;
  platform_axis: [0, 1, 0];
  safety_bar_axis: [0, 1, 0];
  safety_lever_axis: [0, 0, 1];
  winding_drum_axis: [0, 0, 1];
  shipper_axis: [1, 0, 0];
  brake_axis: [0, 0, 1];
  counterpoise_axis: [0, 1, 0];
  platform_position_normalized: number;
  counterpoise_position_normalized: number;
  drive_phase_rad: number;
  requested_drive_direction: OtisDriveCommand;
  platform_motion_direction: OtisDriveCommand;
  shipper_position_normalized: -1 | 0 | 1;
  straight_belt_o_working: boolean;
  cross_belt_p_working: boolean;
  both_belts_idle: boolean;
  brake_z_engaged: boolean;
  stop_rope_geometry_active: boolean;
  lower_limit_stop_active: boolean;
  rope_g_taut: boolean;
  safety_bar_release_normalized: 0 | 1;
  safety_lever_rotation_normalized: 0 | 1;
  pawls_f_engaged: boolean;
  claim_1_hook_lock_satisfied: boolean;
  free_fall_counterfactual: boolean;
  claim_3_stop_interlock_satisfied: boolean;
  claim_4_counterpoise_topology_satisfied: boolean;
  mechanism_mode: OtisMechanismMode;
}

export interface OtisMechanismState extends OtisTopologyState {
  runtimeSource: Exclude<OtisKernelSource, "unloaded">;
}

let topologyFn: OtisTopologyFn | null = null;
let loadPromise: Promise<OtisKernelSource> | null = null;
let source: OtisKernelSource = "unloaded";

export function otisKernelSource(): OtisKernelSource {
  return source;
}

function isAxis<const T extends readonly [number, number, number]>(
  value: unknown,
  expected: T,
): value is T {
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

function finiteIn(value: unknown, minimum: number, maximum: number): value is number {
  return (
    typeof value === "number" && Number.isFinite(value) && value >= minimum && value <= maximum
  );
}

function isDirection(value: unknown): value is OtisDriveCommand {
  return value === -1 || value === 0 || value === 1;
}

export function decodeOtisTopologyWasmStep(raw: string): OtisTopologyWasmStep | null {
  try {
    const parsed = JSON.parse(raw) as { ok?: Partial<OtisTopologyWasmStep> };
    const result = parsed.ok;
    if (!result) return null;
    if (result.scalar_joint_coordinates !== 12 || result.independent_drive_dofs !== 1) return null;
    if (
      !isAxis(result.platform_axis, [0, 1, 0]) ||
      !isAxis(result.safety_bar_axis, [0, 1, 0]) ||
      !isAxis(result.safety_lever_axis, [0, 0, 1]) ||
      !isAxis(result.winding_drum_axis, [0, 0, 1]) ||
      !isAxis(result.shipper_axis, [1, 0, 0]) ||
      !isAxis(result.brake_axis, [0, 0, 1]) ||
      !isAxis(result.counterpoise_axis, [0, 1, 0])
    ) {
      return null;
    }
    if (
      !finiteIn(result.platform_position_normalized, 0, 1) ||
      !finiteIn(result.counterpoise_position_normalized, 0, 1) ||
      !finiteIn(result.drive_phase_rad, 0, 2 * Math.PI) ||
      !isDirection(result.requested_drive_direction) ||
      !isDirection(result.platform_motion_direction) ||
      !isDirection(result.shipper_position_normalized) ||
      !finiteIn(result.safety_bar_release_normalized, 0, 1) ||
      !finiteIn(result.safety_lever_rotation_normalized, 0, 1)
    ) {
      return null;
    }
    const booleans = [
      result.straight_belt_o_working,
      result.cross_belt_p_working,
      result.both_belts_idle,
      result.brake_z_engaged,
      result.stop_rope_geometry_active,
      result.lower_limit_stop_active,
      result.rope_g_taut,
      result.pawls_f_engaged,
      result.claim_1_hook_lock_satisfied,
      result.free_fall_counterfactual,
      result.claim_3_stop_interlock_satisfied,
      result.claim_4_counterpoise_topology_satisfied,
    ];
    if (!booleans.every((value) => typeof value === "boolean")) return null;
    if (result.straight_belt_o_working && result.cross_belt_p_working) return null;
    const transmissionStates = [
      result.straight_belt_o_working,
      result.cross_belt_p_working,
      result.both_belts_idle,
    ].filter(Boolean).length;
    if (transmissionStates !== 1) return null;
    const expectedShipper = result.straight_belt_o_working
      ? -1
      : result.cross_belt_p_working
        ? 1
        : 0;
    if (result.shipper_position_normalized !== expectedShipper) return null;
    if (result.straight_belt_o_working && result.requested_drive_direction !== 1) return null;
    if (result.cross_belt_p_working && result.requested_drive_direction !== -1) return null;
    if (result.stop_rope_geometry_active !== result.both_belts_idle) return null;
    if (result.brake_z_engaged && !result.stop_rope_geometry_active) return null;
    if (
      result.claim_3_stop_interlock_satisfied !==
      (!result.stop_rope_geometry_active || (result.both_belts_idle && result.brake_z_engaged))
    ) {
      return null;
    }
    if (result.pawls_f_engaged !== result.claim_1_hook_lock_satisfied) return null;
    if (result.free_fall_counterfactual && result.pawls_f_engaged) return null;
    if (result.rope_g_taut) {
      if (
        result.safety_bar_release_normalized !== 0 ||
        result.safety_lever_rotation_normalized !== 0 ||
        result.pawls_f_engaged ||
        result.free_fall_counterfactual
      ) {
        return null;
      }
    } else if (
      result.safety_bar_release_normalized !== 1 ||
      result.safety_lever_rotation_normalized !== (result.pawls_f_engaged ? 1 : 0) ||
      result.pawls_f_engaged === result.free_fall_counterfactual
    ) {
      return null;
    }
    const expectedCounterpoise = result.claim_4_counterpoise_topology_satisfied
      ? 1 - result.platform_position_normalized
      : result.platform_position_normalized;
    if (Math.abs(result.counterpoise_position_normalized - expectedCounterpoise) > 1e-12) {
      return null;
    }
    if (
      result.lower_limit_stop_active !==
      (result.requested_drive_direction === -1 && result.platform_position_normalized <= 0.03)
    ) {
      return null;
    }
    const expectedMode: OtisMechanismMode = result.pawls_f_engaged
      ? "rope-failure-hook-lock"
      : result.free_fall_counterfactual
        ? "claim-1-free-fall-counterfactual"
        : result.lower_limit_stop_active
          ? "lower-limit-stop"
          : result.stop_rope_geometry_active
            ? "service-stop"
            : result.platform_motion_direction > 0
              ? "raise"
              : "lower";
    if (
      ![
        "raise",
        "lower",
        "service-stop",
        "lower-limit-stop",
        "rope-failure-hook-lock",
        "claim-1-free-fall-counterfactual",
      ].includes(result.mechanism_mode ?? "") ||
      result.mechanism_mode !== expectedMode
    ) {
      return null;
    }
    return result as OtisTopologyWasmStep;
  } catch {
    return null;
  }
}

export function ensureOtisWasm(): Promise<OtisKernelSource> {
  loadPromise ??= initializeOtisWasm();
  return loadPromise;
}

async function initializeOtisWasm(): Promise<OtisKernelSource> {
  if (typeof window === "undefined") {
    source = "ts-fallback";
    return source;
  }
  try {
    const jsUrl = "/wasm/fs-otis/fs_otis_wasm.js";
    const wasmUrl = "/wasm/fs-otis/fs_otis_wasm_bg.wasm";
    const jsText = await fetch(jsUrl, { signal: AbortSignal.timeout(10_000) }).then((response) => {
      if (!response.ok) throw new Error(`Otis browser glue ${response.status}`);
      return response.text();
    });
    const blobUrl = URL.createObjectURL(new Blob([jsText], { type: "text/javascript" }));
    try {
      const module = (await import(/* webpackIgnore: true */ blobUrl)) as {
        default: (moduleOrPath?: unknown) => Promise<unknown>;
        otis_topology_step: OtisTopologyFn;
      };
      await module.default({ module_or_path: wasmUrl });
      if (typeof module.otis_topology_step !== "function") {
        throw new Error("otis_topology_step missing from browser module");
      }
      topologyFn = module.otis_topology_step;
      source = "wasm";
    } finally {
      URL.revokeObjectURL(blobUrl);
    }
  } catch (error) {
    console.warn("Failed to load fs-otis-wasm; using typed topology fallback", error);
    topologyFn = null;
    source = "ts-fallback";
  }
  return source;
}

function fallbackState(controls: OtisTopologyControls): OtisMechanismState {
  return { ...stepOtis1861Topology(controls), runtimeSource: "ts-fallback" };
}

function stateFromWasm(result: OtisTopologyWasmStep): OtisMechanismState {
  return {
    scalarJointCoordinates: 12,
    independentDriveDofs: 1,
    platformAxis: result.platform_axis,
    safetyBarAxis: result.safety_bar_axis,
    safetyLeverAxis: result.safety_lever_axis,
    windingDrumAxis: result.winding_drum_axis,
    shipperAxis: result.shipper_axis,
    brakeAxis: result.brake_axis,
    counterpoiseAxis: result.counterpoise_axis,
    platformPositionNormalized: result.platform_position_normalized,
    counterpoisePositionNormalized: result.counterpoise_position_normalized,
    drivePhaseRad: result.drive_phase_rad,
    requestedDriveDirection: result.requested_drive_direction,
    platformMotionDirection: result.platform_motion_direction,
    shipperPositionNormalized: result.shipper_position_normalized,
    straightBeltOWorking: result.straight_belt_o_working,
    crossBeltPWorking: result.cross_belt_p_working,
    bothBeltsIdle: result.both_belts_idle,
    brakeZEngaged: result.brake_z_engaged,
    stopRopeGeometryActive: result.stop_rope_geometry_active,
    lowerLimitStopActive: result.lower_limit_stop_active,
    ropeGTaut: result.rope_g_taut,
    safetyBarReleaseNormalized: result.safety_bar_release_normalized,
    safetyLeverRotationNormalized: result.safety_lever_rotation_normalized,
    pawlsFEngaged: result.pawls_f_engaged,
    claim1HookLockSatisfied: result.claim_1_hook_lock_satisfied,
    freeFallCounterfactual: result.free_fall_counterfactual,
    claim3StopInterlockSatisfied: result.claim_3_stop_interlock_satisfied,
    claim4CounterpoiseTopologySatisfied: result.claim_4_counterpoise_topology_satisfied,
    mechanismMode: result.mechanism_mode,
    runtimeSource: "wasm",
  };
}

/** Execute fs-mbd WASM when loaded, otherwise its equation-identical typed mirror. */
export function stepOtisTopology(controls: OtisTopologyControls): OtisMechanismState {
  if (!topologyFn) return fallbackState(controls);
  try {
    const decoded = decodeOtisTopologyWasmStep(
      topologyFn(
        controls.platformPositionNormalized,
        controls.drivePhaseRad,
        controls.driveCommand,
        controls.ropeGIntact,
        controls.stopRopePulled,
        controls.claim1HookLockEnabled,
        controls.claim3BrakeInterlockEnabled,
        controls.claim4CounterpoiseEnabled,
      ),
    );
    return decoded ? stateFromWasm(decoded) : fallbackState(controls);
  } catch {
    return fallbackState(controls);
  }
}
