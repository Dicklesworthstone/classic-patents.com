import type { MachineState, SemiconductorState } from "./types";
import type { TapeUpdater } from "./useFrankenSimPhysics";

export const BOYLE_SMITH_CCD_ID = "us-3858232-boyle-smith-ccd";
export const BOYLE_SMITH_CCD_GATE_COUNT = 12;
export const BOYLE_SMITH_CCD_INPUT_PATTERN = [1, 1, 0, 1] as const;
export const BOYLE_SMITH_MIN_PULSE_WIDTH_RATIO = 1 / 3;

export interface BoyleSmithCcdSourceControls {
  /** Shared transport run state. */
  running: boolean;
  /** Deliberately slowed visible phase initiations per second. */
  clockStepRateHz: number;
  /** Source timing relation t_p / delta-t; transfer requires a value above one third. */
  pulseWidthToStepRatio: number;
  /** Normalized visualization depth because the grant prints no operating voltage. */
  pulseDepthNormalized: number;
  /** Claim 1's continuous single-conductivity charge-storage medium. */
  claim1SingleConductivityPresent: boolean;
}

export interface BoyleSmithCcdSourceState {
  timeSeconds: number;
  clockCoordinateSteps: number;
  packetCoordinateGates: number;
}

export interface BoyleSmithCcdSourceMetrics {
  activePhase: 1 | 2 | 3;
  phaseFraction: number;
  phaseDepths: readonly [number, number, number];
  pulseOverlapConditionMet: boolean;
  claim1TopologyComplete: boolean;
  packetMotionAllowed: boolean;
  packetGatePositions: readonly number[];
  inputPattern: "1101";
  performanceQuantification: "refused";
}

export interface BoyleSmithCcdTapeFrame {
  controls: BoyleSmithCcdSourceControls;
  state: BoyleSmithCcdSourceState;
  metrics: BoyleSmithCcdSourceMetrics;
}

export const DEFAULT_BOYLE_SMITH_CCD_SOURCE_CONTROLS: BoyleSmithCcdSourceControls = {
  running: true,
  clockStepRateHz: 1.2,
  pulseWidthToStepRatio: 0.5,
  pulseDepthNormalized: 0.78,
  claim1SingleConductivityPresent: true,
};

export const INITIAL_BOYLE_SMITH_CCD_SOURCE_STATE: BoyleSmithCcdSourceState = {
  timeSeconds: 0,
  clockCoordinateSteps: 0,
  packetCoordinateGates: 0,
};

function finiteOr(value: number | undefined, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

export function readBoyleSmithCcdSourceControls(
  raw?: Partial<BoyleSmithCcdSourceControls> | Readonly<Record<string, number>>,
): BoyleSmithCcdSourceControls {
  return {
    running:
      raw?.running === undefined
        ? DEFAULT_BOYLE_SMITH_CCD_SOURCE_CONTROLS.running
        : Boolean(raw.running),
    clockStepRateHz: Math.max(
      0.2,
      Math.min(
        2.5,
        finiteOr(raw?.clockStepRateHz, DEFAULT_BOYLE_SMITH_CCD_SOURCE_CONTROLS.clockStepRateHz),
      ),
    ),
    pulseWidthToStepRatio: Math.max(
      0.2,
      Math.min(
        0.8,
        finiteOr(
          raw?.pulseWidthToStepRatio,
          DEFAULT_BOYLE_SMITH_CCD_SOURCE_CONTROLS.pulseWidthToStepRatio,
        ),
      ),
    ),
    pulseDepthNormalized: Math.max(
      0.25,
      Math.min(
        1,
        finiteOr(
          raw?.pulseDepthNormalized,
          DEFAULT_BOYLE_SMITH_CCD_SOURCE_CONTROLS.pulseDepthNormalized,
        ),
      ),
    ),
    claim1SingleConductivityPresent:
      raw?.claim1SingleConductivityPresent === undefined
        ? DEFAULT_BOYLE_SMITH_CCD_SOURCE_CONTROLS.claim1SingleConductivityPresent
        : Boolean(raw.claim1SingleConductivityPresent),
  };
}

function phaseDepth(clockCoordinateSteps: number, phaseIndex: number, depth: number): number {
  const theta = ((clockCoordinateSteps - phaseIndex) / 3) * Math.PI * 2;
  return Number((0.12 + depth * 0.88 * (0.5 + 0.5 * Math.cos(theta))).toFixed(6));
}

function wrapGatePosition(position: number): number {
  return (
    ((position % BOYLE_SMITH_CCD_GATE_COUNT) + BOYLE_SMITH_CCD_GATE_COUNT) %
    BOYLE_SMITH_CCD_GATE_COUNT
  );
}

export function stepBoyleSmithCcdSource(
  state: BoyleSmithCcdSourceState,
  controls: BoyleSmithCcdSourceControls,
  dtSeconds: number,
): BoyleSmithCcdTapeFrame {
  const dt = controls.running ? Math.max(0, Math.min(0.1, finiteOr(dtSeconds, 0))) : 0;
  const clockAdvance = controls.clockStepRateHz * dt;
  const pulseOverlapConditionMet =
    controls.pulseWidthToStepRatio > BOYLE_SMITH_MIN_PULSE_WIDTH_RATIO;
  const claim1TopologyComplete = controls.claim1SingleConductivityPresent;
  const packetMotionAllowed = pulseOverlapConditionMet && claim1TopologyComplete;
  const clockCoordinateSteps = state.clockCoordinateSteps + clockAdvance;
  const packetCoordinateGates =
    state.packetCoordinateGates + (packetMotionAllowed ? clockAdvance : 0);
  const wrappedClockStep = ((Math.floor(clockCoordinateSteps) % 3) + 3) % 3;
  const activePhase = (wrappedClockStep + 1) as 1 | 2 | 3;
  const phaseFraction = ((clockCoordinateSteps % 1) + 1) % 1;

  const packetGatePositions = BOYLE_SMITH_CCD_INPUT_PATTERN.flatMap((bit, index) => {
    if (bit === 0) return [];
    return [wrapGatePosition(index * 3 + packetCoordinateGates)];
  });

  return {
    controls,
    state: {
      timeSeconds: state.timeSeconds + dt,
      clockCoordinateSteps,
      packetCoordinateGates,
    },
    metrics: {
      activePhase,
      phaseFraction,
      phaseDepths: [
        phaseDepth(clockCoordinateSteps, 0, controls.pulseDepthNormalized),
        phaseDepth(clockCoordinateSteps, 1, controls.pulseDepthNormalized),
        phaseDepth(clockCoordinateSteps, 2, controls.pulseDepthNormalized),
      ],
      pulseOverlapConditionMet,
      claim1TopologyComplete,
      packetMotionAllowed,
      packetGatePositions,
      inputPattern: "1101",
      performanceQuantification: "refused",
    },
  };
}

let tapeFrame: BoyleSmithCcdTapeFrame | undefined;

export function getBoyleSmithCcdTapeFrame(): BoyleSmithCcdTapeFrame | undefined {
  return tapeFrame;
}

export function readBoyleSmithCcdTapeFrame(
  controls: BoyleSmithCcdSourceControls,
): BoyleSmithCcdTapeFrame {
  return stepBoyleSmithCcdSource(
    tapeFrame?.state ?? INITIAL_BOYLE_SMITH_CCD_SOURCE_STATE,
    controls,
    0,
  );
}

export function resetBoyleSmithCcdTape(): void {
  tapeFrame = undefined;
}

export function createBoyleSmithCcdTransportUpdater(
  getControls: () => BoyleSmithCcdSourceControls,
): TapeUpdater {
  return (_previous, dt) => {
    const controls = getControls();
    tapeFrame = stepBoyleSmithCcdSource(
      tapeFrame?.state ?? INITIAL_BOYLE_SMITH_CCD_SOURCE_STATE,
      controls,
      dt,
    );
    if (!controls.running) return null;

    const semi: SemiconductorState = {
      biasVoltageVolts: 0,
      currentGainAlpha: 0,
      holeDiffusionCoefficientCm2ps: 0,
      chargeTransferEfficiencyPct: 0,
      clockPeriodNs: 0,
      busBandwidthMbps: 0,
      electronVelocityMps: 0,
      relativisticFractionC: 0,
      voltageGain: 0,
      powerGainDb: 0,
      collectorCurrentMa: 0,
    };
    const machine: MachineState = {
      poseXMeters: 0,
      poseYMeters: 0,
      headingRad: (tapeFrame.state.clockCoordinateSteps / 3) * Math.PI * 2,
      modeLabel: tapeFrame.metrics.packetMotionAllowed
        ? `Figure 3 phase ${tapeFrame.metrics.activePhase}`
        : "source transfer condition refused",
      wheelSpeedMps: 0,
    };

    return {
      refusal: tapeFrame.metrics.packetMotionAllowed
        ? { isRefused: false }
        : {
            isRefused: true,
            reason: !tapeFrame.metrics.claim1TopologyComplete
              ? "Claim 1's single-conductivity storage medium is withheld."
              : "Figure 3 pulse overlap condition is not met; quantitative charge loss is not inferred.",
          },
      semi,
      machine,
    };
  };
}
