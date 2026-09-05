/**
 * US 3,081,379 — Automatic Measurement Apparatus.
 *
 * Claim 1 establishes a relationship among an electron-beam scan path, a
 * synchronized programming/gating path, and an analyzing circuit. The
 * reviewed grant does not publish a calibration packet for a particular
 * scanner, pickup tube, comparator, or output actuator.
 *
 * This reader deliberately exposes normalized signal topology only. It is not
 * an SI model and returns no beam velocity, field dimension, optical
 * responsivity, signal voltage, coil force, or actuator response estimate.
 */

export interface LemelsonMachineVisionControls {
  /** Unitless availability states (0 = withheld, 1 = shown). */
  readonly scanPathEnabled: number;
  readonly synchronizedGateEnabled: number;
  readonly analyzingCircuitEnabled: number;
  readonly inspectionSignalPresent: number;
  readonly referenceSignalMatches: number;
}

export const LEMELSON_MACHINE_VISION_DEFAULT_CONTROLS: LemelsonMachineVisionControls = {
  scanPathEnabled: 1,
  synchronizedGateEnabled: 1,
  analyzingCircuitEnabled: 1,
  inspectionSignalPresent: 1,
  referenceSignalMatches: 1,
};

export type LemelsonMachineVisionReferenceComparison = "withheld" | "match" | "difference";

export interface LemelsonMachineVisionState {
  readonly controls: LemelsonMachineVisionControls;
  readonly scanPathActive: boolean;
  readonly synchronizedGateActive: boolean;
  readonly inspectionSignalPresent: boolean;
  readonly gatedPictureSignal: boolean;
  readonly analyzingCircuitActive: boolean;
  readonly referenceComparison: LemelsonMachineVisionReferenceComparison;
  readonly controlOutputReady: boolean;
  readonly claimOnePathEstablished: boolean;
  readonly signalPath: readonly string[];
  readonly sourceBoundary: {
    readonly isRefused: boolean;
    readonly reason: string;
  };
}

export type LemelsonMachineVisionTopologyState = LemelsonMachineVisionState;

type RawLemelsonMachineVisionControls =
  | Partial<LemelsonMachineVisionControls>
  | Readonly<Record<string, number | undefined>>;

function normalizedSignal(value: number | undefined, fallback: number): number {
  return (value ?? fallback) >= 0.5 ? 1 : 0;
}

export function stepLemelsonMachineVisionTopology(
  raw: RawLemelsonMachineVisionControls = {},
): LemelsonMachineVisionState {
  const controls = readLemelsonMachineVisionControls(raw);
  const scanPathActive = controls.scanPathEnabled === 1;
  const synchronizedGateActive = controls.synchronizedGateEnabled === 1;
  const inspectionSignalPresent = controls.inspectionSignalPresent === 1;
  const gatedPictureSignal = scanPathActive && synchronizedGateActive && inspectionSignalPresent;
  const analyzingCircuitActive = gatedPictureSignal && controls.analyzingCircuitEnabled === 1;
  const referenceComparison: LemelsonMachineVisionReferenceComparison = !inspectionSignalPresent
    ? "withheld"
    : controls.referenceSignalMatches === 1
      ? "match"
      : "difference";
  const controlOutputReady = analyzingCircuitActive;

  return {
    controls,
    scanPathActive,
    synchronizedGateActive,
    inspectionSignalPresent,
    gatedPictureSignal,
    analyzingCircuitActive,
    referenceComparison,
    controlOutputReady,
    claimOnePathEstablished: scanPathActive && synchronizedGateActive && analyzingCircuitActive,
    signalPath: [
      scanPathActive ? "scan path" : "scan withheld",
      gatedPictureSignal ? "gated picture signal" : "picture signal held",
      analyzingCircuitActive ? "analyzing circuit" : "analysis held",
      referenceComparison === "withheld"
        ? "reference comparison withheld"
        : `reference ${referenceComparison}`,
      controlOutputReady ? "control path ready" : "control path held",
    ],
    sourceBoundary: {
      isRefused: true,
      reason:
        "US 3,081,379 establishes a scan, synchronized gate, and analyzing-circuit relationship, but the reviewed public record does not calibrate beam velocity, image-field dimensions, optical responsivity, signal voltage, coil geometry, force, or actuator response. This exhibit shows normalized signal topology only.",
    },
  };
}

export function readLemelsonMachineVisionControls(
  raw: RawLemelsonMachineVisionControls = {},
): LemelsonMachineVisionControls {
  const rawDict = raw as Record<string, number | undefined>;
  const scan =
    rawDict.scanPathEnabled ??
    rawDict.scanPath ??
    rawDict.scan ??
    rawDict.scanEnabled ??
    rawDict.beamScan;
  const gate =
    rawDict.synchronizedGateEnabled ??
    rawDict.synchronizedGate ??
    rawDict.gate ??
    rawDict.gateEnabled ??
    rawDict.syncGate;
  const circuit =
    rawDict.analyzingCircuitEnabled ??
    rawDict.analyzingCircuit ??
    rawDict.circuit ??
    rawDict.analysis ??
    rawDict.analyzerEnabled;
  const inspection =
    rawDict.inspectionSignalPresent ??
    rawDict.inspectionSignal ??
    rawDict.pictureSignal ??
    rawDict.signalPresent;
  const reference =
    rawDict.referenceSignalMatches ??
    rawDict.referenceSignal ??
    rawDict.referenceMatch ??
    rawDict.referenceMatches ??
    rawDict.reference;

  return {
    scanPathEnabled: normalizedSignal(
      scan,
      LEMELSON_MACHINE_VISION_DEFAULT_CONTROLS.scanPathEnabled,
    ),
    synchronizedGateEnabled: normalizedSignal(
      gate,
      LEMELSON_MACHINE_VISION_DEFAULT_CONTROLS.synchronizedGateEnabled,
    ),
    analyzingCircuitEnabled: normalizedSignal(
      circuit,
      LEMELSON_MACHINE_VISION_DEFAULT_CONTROLS.analyzingCircuitEnabled,
    ),
    inspectionSignalPresent: normalizedSignal(
      inspection,
      LEMELSON_MACHINE_VISION_DEFAULT_CONTROLS.inspectionSignalPresent,
    ),
    referenceSignalMatches: normalizedSignal(
      reference,
      LEMELSON_MACHINE_VISION_DEFAULT_CONTROLS.referenceSignalMatches,
    ),
  };
}

/**
 * Compatibility entry point for callers that need the catalogue state.
 * It intentionally returns the same source-bounded topology rather than an
 * undocumented numerical fallback.
 */
export function stepLemelsonMachineVision(
  rawControls: RawLemelsonMachineVisionControls = {},
): LemelsonMachineVisionState {
  return stepLemelsonMachineVisionTopology(rawControls);
}
