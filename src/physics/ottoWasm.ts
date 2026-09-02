export type OttoKernelSource = "wasm" | "ts-fallback" | "unloaded";

type OttoTopologyFn = (
  crankAngleRad: number,
  crankRadius: number,
  connectingRodLength: number,
  engineRpm: number,
) => string;

export type OttoCyclePhase = "intake" | "compression" | "power" | "exhaust";

export interface OttoTopologyStep {
  scalarJointCoordinates: number;
  independentDriveDofs: number;
  crankAxis: readonly [number, number, number];
  pistonAxis: readonly [number, number, number];
  sideShaftAxis: readonly [number, number, number];
  slideValveAxis: readonly [number, number, number];
  exhaustValveAxis: readonly [number, number, number];
  governorAxis: readonly [number, number, number];
  cycleAngleRad: number;
  crankPinX: number;
  crankPinY: number;
  pistonPinX: number;
  pistonPinY: number;
  connectingRodAngleRad: number;
  connectingRodSpan: number;
  sideShaftAngleRad: number;
  slideValveNormalized: number;
  exhaustLiftNormalized: number;
  governorSpreadNormalized: number;
  cyclePhase: OttoCyclePhase;
}

interface RawOttoTopologyStep {
  scalar_joint_coordinates: number;
  independent_drive_dofs: number;
  crank_axis: [number, number, number];
  piston_axis: [number, number, number];
  side_shaft_axis: [number, number, number];
  slide_valve_axis: [number, number, number];
  exhaust_valve_axis: [number, number, number];
  governor_axis: [number, number, number];
  cycle_angle_rad: number;
  crank_pin_x: number;
  crank_pin_y: number;
  piston_pin_x: number;
  piston_pin_y: number;
  connecting_rod_angle_rad: number;
  connecting_rod_span: number;
  side_shaft_angle_rad: number;
  slide_valve_normalized: number;
  exhaust_lift_normalized: number;
  governor_spread_normalized: number;
  cycle_phase: OttoCyclePhase;
}

export interface OttoTopologyInputs {
  crankAngleRad: number;
  crankRadius: number;
  connectingRodLength: number;
  engineRpm: number;
}

let topologyFn: OttoTopologyFn | null = null;
let loadPromise: Promise<OttoKernelSource> | null = null;
let source: OttoKernelSource = "unloaded";

const FOUR_PI = 4 * Math.PI;
const closeEnough = (actual: number, expected: number, tolerance = 1e-9) =>
  Math.abs(actual - expected) <= tolerance;

function finiteVector(value: unknown): value is [number, number, number] {
  return Array.isArray(value) && value.length === 3 && value.every(Number.isFinite);
}

function sameVector(
  actual: readonly [number, number, number],
  expected: readonly [number, number, number],
): boolean {
  return actual.every((component, index) => closeEnough(component, expected[index]));
}

function isCyclePhase(value: unknown): value is OttoCyclePhase {
  return value === "intake" || value === "compression" || value === "power" || value === "exhaust";
}

function expectedPhase(angle: number): OttoCyclePhase {
  if (angle < Math.PI) return "intake";
  if (angle < 2 * Math.PI) return "compression";
  if (angle < 3 * Math.PI) return "power";
  return "exhaust";
}

function wrappedCycleAngle(angle: number): number {
  return ((angle % FOUR_PI) + FOUR_PI) % FOUR_PI;
}

export function ottoKernelSource(): OttoKernelSource {
  return source;
}

/** Shared-tape label admitted only by this module's probed runtime source. */
export function ottoTapeProvenance(
  runtimeSource: Exclude<OttoKernelSource, "unloaded">,
): "WASM" | "TS_FALLBACK" {
  return runtimeSource === "wasm" ? "WASM" : "TS_FALLBACK";
}

/** HUD receipt owned beside the exact export probe that earns the WASM claim. */
export function ottoPoseHudPresentation(
  provenance: "WASM" | "TS_FALLBACK" | "HONEST_PLACEHOLDER",
): { value: string; tone: "ok" | "warn" } {
  if (provenance === "WASM") return { value: "fs-mbd WASM", tone: "ok" };
  if (provenance === "TS_FALLBACK") return { value: "TS fallback", tone: "warn" };
  return { value: "awaiting step", tone: "warn" };
}

export function decodeOttoTopologyStep(
  raw: string,
  expected: OttoTopologyInputs,
): OttoTopologyStep | null {
  try {
    const parsed = JSON.parse(raw) as {
      ok?: Partial<RawOttoTopologyStep>;
      refusal?: unknown;
    };
    if (parsed.refusal !== undefined) return null;
    const result = parsed.ok;
    if (!result) return null;
    const numeric = [
      result.scalar_joint_coordinates,
      result.independent_drive_dofs,
      result.cycle_angle_rad,
      result.crank_pin_x,
      result.crank_pin_y,
      result.piston_pin_x,
      result.piston_pin_y,
      result.connecting_rod_angle_rad,
      result.connecting_rod_span,
      result.side_shaft_angle_rad,
      result.slide_valve_normalized,
      result.exhaust_lift_normalized,
      result.governor_spread_normalized,
    ];
    if (
      numeric.some((value) => !Number.isFinite(value)) ||
      result.scalar_joint_coordinates !== 8 ||
      result.independent_drive_dofs !== 1 ||
      !finiteVector(result.crank_axis) ||
      !finiteVector(result.piston_axis) ||
      !finiteVector(result.side_shaft_axis) ||
      !finiteVector(result.slide_valve_axis) ||
      !finiteVector(result.exhaust_valve_axis) ||
      !finiteVector(result.governor_axis) ||
      !isCyclePhase(result.cycle_phase)
    ) {
      return null;
    }
    const valid = result as RawOttoTopologyStep;
    const cycleAngle = wrappedCycleAngle(expected.crankAngleRad);
    // Cycle zero is intake TDC, half a revolution from the geometric +x axis.
    const crankAngle = (cycleAngle + Math.PI) % (2 * Math.PI);
    const expectedCrankPinX = expected.crankRadius * Math.cos(crankAngle);
    const expectedCrankPinY = expected.crankRadius * Math.sin(crankAngle);
    const closure =
      expected.connectingRodLength ** 2 - (expected.crankRadius * Math.sin(crankAngle)) ** 2;
    if (!Number.isFinite(closure) || closure < 0) return null;
    const expectedPistonPinX = expectedCrankPinX - Math.sqrt(closure);
    const rodDx = valid.crank_pin_x - valid.piston_pin_x;
    const rodDy = valid.crank_pin_y - valid.piston_pin_y;
    const expectedRodAngle = Math.atan2(expectedCrankPinY, expectedCrankPinX - expectedPistonPinX);
    const expectedSideShaftAngle = cycleAngle * 0.5;
    const expectedExhaustLift =
      cycleAngle >= 3 * Math.PI ? Math.max(0, Math.sin(cycleAngle - 3 * Math.PI)) : 0;
    if (
      !sameVector(valid.crank_axis, [0, 0, 1]) ||
      !sameVector(valid.piston_axis, [1, 0, 0]) ||
      !sameVector(valid.side_shaft_axis, [1, 0, 0]) ||
      !sameVector(valid.slide_valve_axis, [1, 0, 0]) ||
      !sameVector(valid.exhaust_valve_axis, [0, 1, 0]) ||
      !sameVector(valid.governor_axis, [0, 1, 0]) ||
      !closeEnough(valid.cycle_angle_rad, cycleAngle) ||
      !closeEnough(valid.crank_pin_x, expectedCrankPinX) ||
      !closeEnough(valid.crank_pin_y, expectedCrankPinY) ||
      !closeEnough(valid.piston_pin_x, expectedPistonPinX) ||
      !closeEnough(valid.connecting_rod_span, expected.connectingRodLength) ||
      !closeEnough(Math.hypot(rodDx, rodDy), expected.connectingRodLength) ||
      !closeEnough(valid.piston_pin_y, 0) ||
      !closeEnough(valid.connecting_rod_angle_rad, expectedRodAngle) ||
      !closeEnough(valid.side_shaft_angle_rad, expectedSideShaftAngle) ||
      !closeEnough(valid.slide_valve_normalized, Math.sin(expectedSideShaftAngle)) ||
      !closeEnough(valid.exhaust_lift_normalized, expectedExhaustLift) ||
      !closeEnough(
        valid.governor_spread_normalized,
        Math.max(0, Math.min(1, expected.engineRpm / 300)),
      ) ||
      valid.slide_valve_normalized < -1 ||
      valid.slide_valve_normalized > 1 ||
      valid.exhaust_lift_normalized < 0 ||
      valid.exhaust_lift_normalized > 1 ||
      valid.governor_spread_normalized < 0 ||
      valid.governor_spread_normalized > 1 ||
      valid.cycle_phase !== expectedPhase(cycleAngle)
    ) {
      return null;
    }
    return {
      scalarJointCoordinates: valid.scalar_joint_coordinates,
      independentDriveDofs: valid.independent_drive_dofs,
      crankAxis: valid.crank_axis,
      pistonAxis: valid.piston_axis,
      sideShaftAxis: valid.side_shaft_axis,
      slideValveAxis: valid.slide_valve_axis,
      exhaustValveAxis: valid.exhaust_valve_axis,
      governorAxis: valid.governor_axis,
      cycleAngleRad: valid.cycle_angle_rad,
      crankPinX: valid.crank_pin_x,
      crankPinY: valid.crank_pin_y,
      pistonPinX: valid.piston_pin_x,
      pistonPinY: valid.piston_pin_y,
      connectingRodAngleRad: valid.connecting_rod_angle_rad,
      connectingRodSpan: valid.connecting_rod_span,
      sideShaftAngleRad: valid.side_shaft_angle_rad,
      slideValveNormalized: valid.slide_valve_normalized,
      exhaustLiftNormalized: valid.exhaust_lift_normalized,
      governorSpreadNormalized: valid.governor_spread_normalized,
      cyclePhase: valid.cycle_phase,
    };
  } catch {
    return null;
  }
}

export function ensureOttoWasm(): Promise<OttoKernelSource> {
  loadPromise ??= initializeOttoWasm();
  return loadPromise;
}

async function initializeOttoWasm(): Promise<OttoKernelSource> {
  if (typeof window === "undefined") {
    source = "ts-fallback";
    return source;
  }
  try {
    const jsUrl = "/wasm/fs-otto/fs_otto_wasm.js";
    const wasmUrl = "/wasm/fs-otto/fs_otto_wasm_bg.wasm";
    const jsText = await fetch(jsUrl, { signal: AbortSignal.timeout(10_000) }).then((response) => {
      if (!response.ok) throw new Error(`Otto browser glue ${response.status}`);
      return response.text();
    });
    const blobUrl = URL.createObjectURL(new Blob([jsText], { type: "text/javascript" }));
    try {
      const module = (await import(/* webpackIgnore: true */ blobUrl)) as {
        default: (moduleOrPath?: unknown) => Promise<unknown>;
        otto_topology_step?: OttoTopologyFn;
      };
      await module.default({ module_or_path: wasmUrl });
      if (typeof module.otto_topology_step !== "function") {
        throw new Error("otto_topology_step missing from browser module");
      }
      topologyFn = module.otto_topology_step;
      source = "wasm";
    } finally {
      URL.revokeObjectURL(blobUrl);
    }
  } catch (error) {
    console.warn("Failed to load fs-otto-wasm; using the typed slider-crank fallback", error);
    topologyFn = null;
    source = "ts-fallback";
  }
  return source;
}

export function tryOttoWasmStep(inputs: OttoTopologyInputs): OttoTopologyStep | null {
  if (!topologyFn) return null;
  try {
    return decodeOttoTopologyStep(
      topologyFn(
        inputs.crankAngleRad,
        inputs.crankRadius,
        inputs.connectingRodLength,
        inputs.engineRpm,
      ),
      inputs,
    );
  } catch {
    return null;
  }
}
