import {
  KAMEN_TRANSPORTER_CONTACT_BOUNDARY,
  KAMEN_TRANSPORTER_GENERIC_OWNER,
  KAMEN_TRANSPORTER_GEOMETRY_RECEIPT,
  KAMEN_TRANSPORTER_SOURCE_GEOMETRY_M,
  KAMEN_TRANSPORTER_TOPOLOGY_STATES,
  type KamenTransporterControls,
  type KamenTransporterTelemetry,
  type KamenTransporterWheelContact,
  kamenHorizontalSupportHeightM,
  stepKamenTransporterTopology,
} from "./kamenTransporterKernel";

export type KamenTransporterKernelSource = "wasm" | "ts-fallback" | "unloaded";

type KamenTransporterStepFn = (stateIndex: number) => string;

const KAMEN_WASM_BOUNDARY =
  "rigid-planar-three-equal-wheels-horizontal-support-and-finite-riser-clearance-no-force-friction-compliance-impact-motor-controller-or-sensor";
const KAMEN_WASM_SOURCE_RECEIPT = "us-5701965-table-1-figures-39-through-42";

export interface KamenTransporterWasmStep {
  owner: typeof KAMEN_TRANSPORTER_GENERIC_OWNER;
  boundary: typeof KAMEN_WASM_BOUNDARY;
  source_receipt: typeof KAMEN_WASM_SOURCE_RECEIPT;
  state: (typeof KAMEN_TRANSPORTER_TOPOLOGY_STATES)[number];
  source_figure: string;
  system_centre_offset_m: number;
  cluster_radius_m: number;
  adjacent_wheel_centre_distance_m: number;
  wheel_radius_m: number;
  stair_rise_m: number;
  stair_tread_m: number;
  riser_to_upper_contact_m: number;
  axle_x_m: number;
  axle_y_m: number;
  carrier_rotation_rad: number;
  chassis_pitch_rad: number;
  stair_active: boolean;
  wheel_centres_m: [[number, number], [number, number], [number, number]];
  signed_vertical_gaps_m: [number, number, number];
  contact_mask: [boolean, boolean, boolean];
  contact_count: number;
  minimum_gap_m: number;
  signed_riser_clearances_m: [number | null, number | null, number | null];
  riser_contact_mask: [boolean, boolean, boolean];
  riser_contact_count: number;
  minimum_riser_clearance_m: number | null;
}

export interface KamenTransporterRuntimeTelemetry extends KamenTransporterTelemetry {
  runtimeSource: Exclude<KamenTransporterKernelSource, "unloaded">;
  runtimeBoundary: string;
}

let stepFn: KamenTransporterStepFn | null = null;
let loadPromise: Promise<KamenTransporterKernelSource> | null = null;
let source: KamenTransporterKernelSource = "unloaded";

export function kamenTransporterKernelSource(): KamenTransporterKernelSource {
  return source;
}

export function kamenTransporterRuntimeLabel(
  runtimeSource: Exclude<KamenTransporterKernelSource, "unloaded">,
): string {
  return runtimeSource === "wasm"
    ? "fs-mbd tri-wheel WASM step"
    : "typed equation-identical tri-wheel fallback";
}

function closeEnough(actual: number, expected: number): boolean {
  return Math.abs(actual - expected) <= 1e-9 * Math.max(1, Math.abs(expected));
}

function finiteTuple2(value: unknown): value is [number, number] {
  return (
    Array.isArray(value) &&
    value.length === 2 &&
    value.every((candidate) => typeof candidate === "number" && Number.isFinite(candidate))
  );
}

function finiteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function nullableFiniteNumber(value: unknown): value is number | null {
  return value === null || finiteNumber(value);
}

/** Validate the complete generic rigid-contact receipt before admitting WASM provenance. */
export function decodeKamenTransporterWasmStep(raw: string): KamenTransporterWasmStep | null {
  try {
    const parsed = JSON.parse(raw) as { ok?: Partial<KamenTransporterWasmStep> };
    const result = parsed.ok;
    if (!result) return null;
    if (
      result.owner !== KAMEN_TRANSPORTER_GENERIC_OWNER ||
      result.boundary !== KAMEN_WASM_BOUNDARY ||
      result.source_receipt !== KAMEN_WASM_SOURCE_RECEIPT ||
      !KAMEN_TRANSPORTER_TOPOLOGY_STATES.includes(result.state as never) ||
      typeof result.source_figure !== "string" ||
      result.source_figure.length < 8 ||
      typeof result.stair_active !== "boolean"
    ) {
      return null;
    }
    if (
      !finiteNumber(result.system_centre_offset_m) ||
      !finiteNumber(result.cluster_radius_m) ||
      !finiteNumber(result.adjacent_wheel_centre_distance_m) ||
      !finiteNumber(result.wheel_radius_m) ||
      !finiteNumber(result.stair_rise_m) ||
      !finiteNumber(result.stair_tread_m) ||
      !finiteNumber(result.riser_to_upper_contact_m) ||
      !finiteNumber(result.axle_x_m) ||
      !finiteNumber(result.axle_y_m) ||
      !finiteNumber(result.carrier_rotation_rad) ||
      !finiteNumber(result.chassis_pitch_rad) ||
      !finiteNumber(result.contact_count) ||
      !finiteNumber(result.minimum_gap_m) ||
      !finiteNumber(result.riser_contact_count) ||
      !nullableFiniteNumber(result.minimum_riser_clearance_m)
    ) {
      return null;
    }
    if (
      !Array.isArray(result.wheel_centres_m) ||
      result.wheel_centres_m.length !== 3 ||
      !result.wheel_centres_m.every(finiteTuple2) ||
      !Array.isArray(result.signed_vertical_gaps_m) ||
      result.signed_vertical_gaps_m.length !== 3 ||
      !result.signed_vertical_gaps_m.every(finiteNumber) ||
      !Array.isArray(result.contact_mask) ||
      result.contact_mask.length !== 3 ||
      !result.contact_mask.every((candidate) => typeof candidate === "boolean") ||
      result.contact_count !== result.contact_mask.filter(Boolean).length ||
      result.contact_count < 1 ||
      result.minimum_gap_m < -1e-8 ||
      !Array.isArray(result.signed_riser_clearances_m) ||
      result.signed_riser_clearances_m.length !== 3 ||
      !result.signed_riser_clearances_m.every(nullableFiniteNumber) ||
      !Array.isArray(result.riser_contact_mask) ||
      result.riser_contact_mask.length !== 3 ||
      !result.riser_contact_mask.every((candidate) => typeof candidate === "boolean") ||
      result.riser_contact_count !== result.riser_contact_mask.filter(Boolean).length
    ) {
      return null;
    }

    const geometry = KAMEN_TRANSPORTER_SOURCE_GEOMETRY_M;
    if (
      !closeEnough(result.system_centre_offset_m, geometry.systemCentreOffsetM) ||
      !closeEnough(result.cluster_radius_m, geometry.clusterRadiusM) ||
      !closeEnough(
        result.adjacent_wheel_centre_distance_m,
        geometry.adjacentWheelCentreDistanceM,
      ) ||
      !closeEnough(result.wheel_radius_m, geometry.wheelRadiusM) ||
      !closeEnough(result.stair_rise_m, geometry.stairRiseM) ||
      !closeEnough(result.stair_tread_m, geometry.stairTreadM) ||
      !closeEnough(result.riser_to_upper_contact_m, geometry.riserToUpperContactM)
    ) {
      return null;
    }
    if (result.stair_active) {
      if (
        result.signed_riser_clearances_m.some((clearance) => clearance === null) ||
        result.minimum_riser_clearance_m === null ||
        result.minimum_riser_clearance_m < -1e-8
      ) {
        return null;
      }
    } else if (
      result.signed_riser_clearances_m.some((clearance) => clearance !== null) ||
      result.minimum_riser_clearance_m !== null ||
      result.riser_contact_count !== 0
    ) {
      return null;
    }
    return result as KamenTransporterWasmStep;
  } catch {
    return null;
  }
}

export function ensureKamenTransporterWasm(): Promise<KamenTransporterKernelSource> {
  loadPromise ??= initializeKamenTransporterWasm();
  return loadPromise;
}

async function initializeKamenTransporterWasm(): Promise<KamenTransporterKernelSource> {
  if (typeof window === "undefined") {
    source = "ts-fallback";
    return source;
  }
  try {
    const jsUrl = "/wasm/fs-kamen/fs_kamen_wasm.js";
    const wasmUrl = "/wasm/fs-kamen/fs_kamen_wasm_bg.wasm";
    const jsText = await fetch(jsUrl, { signal: AbortSignal.timeout(10_000) }).then((response) => {
      if (!response.ok) throw new Error(`Kamen browser glue ${response.status}`);
      return response.text();
    });
    const blobUrl = URL.createObjectURL(new Blob([jsText], { type: "text/javascript" }));
    try {
      const module = (await import(/* webpackIgnore: true */ blobUrl)) as {
        default: (moduleOrPath?: unknown) => Promise<unknown>;
        kamen_cluster_step: KamenTransporterStepFn;
      };
      await module.default({ module_or_path: wasmUrl });
      if (typeof module.kamen_cluster_step !== "function") {
        throw new Error("kamen_cluster_step missing from browser module");
      }
      stepFn = module.kamen_cluster_step;
      source = "wasm";
    } finally {
      URL.revokeObjectURL(blobUrl);
    }
  } catch (error) {
    console.warn("Failed to load fs-kamen-wasm; using typed rigid-contact fallback", error);
    stepFn = null;
    source = "ts-fallback";
  }
  return source;
}

function fallbackState(controls: KamenTransporterControls): KamenTransporterRuntimeTelemetry {
  return {
    ...stepKamenTransporterTopology(controls),
    runtimeSource: "ts-fallback",
    runtimeBoundary: KAMEN_TRANSPORTER_CONTACT_BOUNDARY,
  };
}

/** Step the source pose through the generic FrankenSim owner when loaded. */
export function stepKamenTransporterPhysics(
  controls: KamenTransporterControls,
  sourceHint: KamenTransporterKernelSource = source,
): KamenTransporterRuntimeTelemetry {
  const fallback = fallbackState(controls);
  if (sourceHint !== "wasm" || !stepFn || !fallback.clusterTopologyActive) return fallback;

  try {
    const stateIndex = KAMEN_TRANSPORTER_TOPOLOGY_STATES.indexOf(fallback.topologyState);
    const decoded = decodeKamenTransporterWasmStep(stepFn(stateIndex));
    if (!decoded || decoded.state !== fallback.topologyState) return fallback;
    const pose = fallback.displayPose;
    if (
      !closeEnough(decoded.axle_x_m, pose.axleXM) ||
      !closeEnough(decoded.axle_y_m, pose.axleYM) ||
      !closeEnough(decoded.carrier_rotation_rad, pose.carrierRotationRad) ||
      !closeEnough(decoded.chassis_pitch_rad, pose.chassisPitchRad) ||
      decoded.stair_active !== pose.stairActive ||
      decoded.contact_count !== pose.contactCount
    ) {
      return fallback;
    }
    for (let index = 0; index < 3; index += 1) {
      const wasmCenter = decoded.wheel_centres_m[index];
      const wasmGap = decoded.signed_vertical_gaps_m[index];
      const hostWheel = pose.wheelContacts[index];
      if (
        !wasmCenter ||
        wasmGap === undefined ||
        !hostWheel ||
        !closeEnough(wasmCenter[0], hostWheel.centerXM) ||
        !closeEnough(wasmCenter[1], hostWheel.centerYM) ||
        !closeEnough(wasmGap, hostWheel.signedVerticalGapM) ||
        decoded.contact_mask[index] !== hostWheel.touching ||
        decoded.riser_contact_mask[index] !== hostWheel.touchingRiser ||
        (decoded.signed_riser_clearances_m[index] === null) !==
          (hostWheel.signedRiserClearanceM === null) ||
        (decoded.signed_riser_clearances_m[index] !== null &&
          hostWheel.signedRiserClearanceM !== null &&
          !closeEnough(decoded.signed_riser_clearances_m[index], hostWheel.signedRiserClearanceM))
      ) {
        return fallback;
      }
    }

    const wheelContacts = decoded.wheel_centres_m.map(([centerXM, centerYM], index) => {
      const signedVerticalGapM = decoded.signed_vertical_gaps_m[index];
      const signedRiserClearanceM = decoded.signed_riser_clearances_m[index];
      if (signedVerticalGapM === undefined) throw new Error("missing Kamen WASM gap");
      return {
        id: (["a", "b", "c"] as const)[index],
        centerXM,
        centerYM,
        supportHeightM: kamenHorizontalSupportHeightM(centerXM, decoded.stair_active),
        signedVerticalGapM,
        touching: decoded.contact_mask[index] ?? false,
        signedRiserClearanceM: signedRiserClearanceM ?? null,
        touchingRiser: decoded.riser_contact_mask[index] ?? false,
      } satisfies KamenTransporterWheelContact;
    });
    const contactWheelIds = wheelContacts
      .filter((wheel) => wheel.touching)
      .map((wheel) => wheel.id);
    const riserContactWheelIds = wheelContacts
      .filter((wheel) => wheel.touchingRiser)
      .map((wheel) => wheel.id);

    return {
      ...fallback,
      clusterDisplayPoseRad: decoded.carrier_rotation_rad,
      displayPose: {
        ...pose,
        axleXM: decoded.axle_x_m,
        axleYM: decoded.axle_y_m,
        carrierRotationRad: decoded.carrier_rotation_rad,
        chassisPitchRad: decoded.chassis_pitch_rad,
        stairActive: decoded.stair_active,
        wheelContacts,
        contactWheelIds,
        contactCount: decoded.contact_count,
        minimumGapM: decoded.minimum_gap_m,
        riserContactWheelIds,
        riserContactCount: decoded.riser_contact_count,
        minimumRiserClearanceM: decoded.minimum_riser_clearance_m,
      },
      sourceGeometryReceipt: KAMEN_TRANSPORTER_GEOMETRY_RECEIPT,
      genericOwner: decoded.owner,
      runtimeSource: "wasm",
      runtimeBoundary: decoded.boundary,
    };
  } catch {
    return fallback;
  }
}
