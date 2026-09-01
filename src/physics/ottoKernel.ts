import {
  ensureOttoWasm,
  type OttoCyclePhase,
  type OttoKernelSource,
  type OttoTopologyInputs,
  type OttoTopologyStep,
  ottoKernelSource,
  ottoTapeProvenance,
  tryOttoWasmStep,
} from "./ottoWasm";
import type { TapeUpdater } from "./useFrankenSimPhysics";
import { globalTransportBus } from "./useFrankenSimPhysics";

/** Display-scale reconstruction; the grant prints no build dimensions. */
export const OTTO_MODEL_CRANK_RADIUS = 0.65;
/** Display-scale reconstruction; kept in one owner for 2D and 3D closure. */
export const OTTO_MODEL_CONNECTING_ROD_LENGTH = 2.4;
export const OTTO_CYCLE_RADIANS = 4 * Math.PI;
const OTTO_MAX_RPM = 600;

export interface OttoMechanismPose extends OttoTopologyStep {
  runtimeSource: Exclude<OttoKernelSource, "unloaded">;
}

export interface OttoTransportControls {
  engineRpm: number;
  running: boolean;
  claim1ChargeGradingPresent?: boolean;
}

function wrappedCycleAngle(angle: number): number {
  return ((angle % OTTO_CYCLE_RADIANS) + OTTO_CYCLE_RADIANS) % OTTO_CYCLE_RADIANS;
}

function cyclePhase(angle: number): OttoCyclePhase {
  if (angle < Math.PI) return "intake";
  if (angle < 2 * Math.PI) return "compression";
  if (angle < 3 * Math.PI) return "power";
  return "exhaust";
}

function assertAdmittedInputs(inputs: OttoTopologyInputs): void {
  if (
    ![inputs.crankAngleRad, inputs.crankRadius, inputs.connectingRodLength, inputs.engineRpm].every(
      Number.isFinite,
    ) ||
    inputs.crankRadius <= 0 ||
    inputs.connectingRodLength <= inputs.crankRadius ||
    inputs.engineRpm < 0 ||
    inputs.engineRpm > OTTO_MAX_RPM
  ) {
    throw new RangeError("Otto mechanism inputs are outside the admitted display domain");
  }
}

export function stepOttoMechanismFallback(inputs: OttoTopologyInputs): OttoMechanismPose {
  assertAdmittedInputs(inputs);
  const cycleAngleRad = wrappedCycleAngle(inputs.crankAngleRad);
  // The public cycle coordinate starts the intake stroke at TDC. The geometric
  // crank therefore begins half a revolution from its +x reference direction.
  const crankAngle = (cycleAngleRad + Math.PI) % (2 * Math.PI);
  const crankPinX = inputs.crankRadius * Math.cos(crankAngle);
  const crankPinY = inputs.crankRadius * Math.sin(crankAngle);
  const closure =
    inputs.connectingRodLength ** 2 - (inputs.crankRadius * Math.sin(crankAngle)) ** 2;
  const pistonPinX = crankPinX - Math.sqrt(closure);
  const pistonPinY = 0;
  const connectingRodAngleRad = Math.atan2(crankPinY, crankPinX - pistonPinX);
  const sideShaftAngleRad = cycleAngleRad * 0.5;
  const exhaustStart = 3 * Math.PI;
  return {
    runtimeSource: "ts-fallback",
    scalarJointCoordinates: 8,
    independentDriveDofs: 1,
    crankAxis: [0, 0, 1],
    pistonAxis: [1, 0, 0],
    sideShaftAxis: [1, 0, 0],
    slideValveAxis: [1, 0, 0],
    exhaustValveAxis: [0, 1, 0],
    governorAxis: [0, 1, 0],
    cycleAngleRad,
    crankPinX,
    crankPinY,
    pistonPinX,
    pistonPinY,
    connectingRodAngleRad,
    connectingRodSpan: Math.hypot(crankPinX - pistonPinX, crankPinY - pistonPinY),
    sideShaftAngleRad,
    slideValveNormalized: Math.sin(sideShaftAngleRad),
    exhaustLiftNormalized:
      cycleAngleRad >= exhaustStart ? Math.max(0, Math.sin(cycleAngleRad - exhaustStart)) : 0,
    governorSpreadNormalized: Math.max(0, Math.min(1, inputs.engineRpm / 300)),
    cyclePhase: cyclePhase(cycleAngleRad),
  };
}

export function stepOttoMechanism(inputs: OttoTopologyInputs): OttoMechanismPose {
  assertAdmittedInputs(inputs);
  const wasm = tryOttoWasmStep(inputs);
  return wasm ? { ...wasm, runtimeSource: "wasm" } : stepOttoMechanismFallback(inputs);
}

let tapePose: OttoMechanismPose | undefined;

export function getOttoTapePose(): OttoMechanismPose | undefined {
  return tapePose;
}

/** Read-only runtime receipt for route-level integration diagnostics. */
export function readOttoKernelStatus(): {
  loaderSource: OttoKernelSource;
  poseSource: OttoMechanismPose["runtimeSource"] | "unstepped";
} {
  return {
    loaderSource: ottoKernelSource(),
    poseSource: tapePose?.runtimeSource ?? "unstepped",
  };
}

export function resetOttoTapePose(): void {
  tapePose = undefined;
}

/** One fixed-step owner for the 2D instrument, 3D studio, and telemetry tape. */
export function createOttoTransportUpdater(getControls: () => OttoTransportControls): TapeUpdater {
  void ensureOttoWasm();
  return (_previous, dt) => {
    const controls = getControls();
    if (!controls.running) return null;
    const priorAngle = tapePose?.cycleAngleRad ?? 0;
    const nextAngle = wrappedCycleAngle(priorAngle + (controls.engineRpm * 2 * Math.PI * dt) / 60);
    tapePose = stepOttoMechanism({
      crankAngleRad: nextAngle,
      crankRadius: OTTO_MODEL_CRANK_RADIUS,
      connectingRodLength: OTTO_MODEL_CONNECTING_ROD_LENGTH,
      engineRpm: controls.engineRpm,
    });
    globalTransportBus.setUpdaterProvenance(
      "us-194047-otto-engine",
      ottoTapeProvenance(tapePose.runtimeSource),
    );
    return {
      refusal:
        controls.claim1ChargeGradingPresent === false
          ? {
              isRefused: true,
              reason:
                "Claim 1 charge grading is absent; the source does not determine a replacement pressure or performance trace.",
            }
          : { isRefused: false },
      machine: {
        poseXMeters: tapePose.pistonPinX,
        poseYMeters: tapePose.crankPinY,
        headingRad: tapePose.cycleAngleRad,
        modeLabel: tapePose.cyclePhase,
        wheelSpeedMps: 0,
      },
    };
  };
}
