import { afterEach, describe, expect, test } from "bun:test";
import {
  BOYLE_SMITH_CCD_INPUT_PATTERN,
  BOYLE_SMITH_MIN_PULSE_WIDTH_RATIO,
  createBoyleSmithCcdTransportUpdater,
  DEFAULT_BOYLE_SMITH_CCD_SOURCE_CONTROLS,
  getBoyleSmithCcdTapeFrame,
  INITIAL_BOYLE_SMITH_CCD_SOURCE_STATE,
  readBoyleSmithCcdSourceControls,
  readBoyleSmithCcdTapeFrame,
  resetBoyleSmithCcdTape,
  stepBoyleSmithCcdSource,
} from "./boyleSmithCcdKernel";

afterEach(() => resetBoyleSmithCcdTape());

describe("Boyle-Smith US 3,858,232 source-bounded transfer kernel", () => {
  test("clamps only normalized display controls and defaults Claim 1's medium present", () => {
    expect(readBoyleSmithCcdSourceControls()).toEqual(DEFAULT_BOYLE_SMITH_CCD_SOURCE_CONTROLS);
    expect(
      readBoyleSmithCcdSourceControls({
        running: 0,
        clockStepRateHz: 99,
        pulseWidthToStepRatio: -4,
        pulseDepthNormalized: 8,
        claim1SingleConductivityPresent: 0,
      }),
    ).toEqual({
      running: false,
      clockStepRateHz: 2.5,
      pulseWidthToStepRatio: 0.2,
      pulseDepthNormalized: 1,
      claim1SingleConductivityPresent: false,
    });
  });

  test("replays the fixed-step three-phase sequence deterministically", () => {
    const first = stepBoyleSmithCcdSource(
      INITIAL_BOYLE_SMITH_CCD_SOURCE_STATE,
      DEFAULT_BOYLE_SMITH_CCD_SOURCE_CONTROLS,
      1 / 60,
    );
    const replay = stepBoyleSmithCcdSource(
      INITIAL_BOYLE_SMITH_CCD_SOURCE_STATE,
      DEFAULT_BOYLE_SMITH_CCD_SOURCE_CONTROLS,
      1 / 60,
    );
    expect(first).toEqual(replay);
    expect(first.state.timeSeconds).toBeCloseTo(1 / 60, 12);
    expect(first.state.clockCoordinateSteps).toBeCloseTo(0.02, 12);
    expect(first.state.packetCoordinateGates).toBeCloseTo(0.02, 12);
    expect(first.metrics.activePhase).toBe(1);
    expect(first.metrics.phaseDepths).toHaveLength(3);
  });

  test("represents the printed 1101 input as three positive-carrier packets", () => {
    const frame = stepBoyleSmithCcdSource(
      INITIAL_BOYLE_SMITH_CCD_SOURCE_STATE,
      DEFAULT_BOYLE_SMITH_CCD_SOURCE_CONTROLS,
      0,
    );
    expect(BOYLE_SMITH_CCD_INPUT_PATTERN).toEqual([1, 1, 0, 1]);
    expect(frame.metrics.inputPattern).toBe("1101");
    expect(frame.metrics.packetGatePositions).toEqual([0, 3, 9]);
    expect(frame.metrics.performanceQuantification).toBe("refused");
  });

  test("admits motion only above the exact Figure 3 pulse-overlap boundary", () => {
    const atBoundary = stepBoyleSmithCcdSource(
      INITIAL_BOYLE_SMITH_CCD_SOURCE_STATE,
      {
        ...DEFAULT_BOYLE_SMITH_CCD_SOURCE_CONTROLS,
        pulseWidthToStepRatio: BOYLE_SMITH_MIN_PULSE_WIDTH_RATIO,
      },
      0.1,
    );
    expect(atBoundary.metrics.pulseOverlapConditionMet).toBe(false);
    expect(atBoundary.metrics.packetMotionAllowed).toBe(false);
    expect(atBoundary.state.clockCoordinateSteps).toBeGreaterThan(0);
    expect(atBoundary.state.packetCoordinateGates).toBe(0);

    const aboveBoundary = stepBoyleSmithCcdSource(
      INITIAL_BOYLE_SMITH_CCD_SOURCE_STATE,
      {
        ...DEFAULT_BOYLE_SMITH_CCD_SOURCE_CONTROLS,
        pulseWidthToStepRatio: BOYLE_SMITH_MIN_PULSE_WIDTH_RATIO + 0.001,
      },
      0.1,
    );
    expect(aboveBoundary.metrics.pulseOverlapConditionMet).toBe(true);
    expect(aboveBoundary.metrics.packetMotionAllowed).toBe(true);
    expect(aboveBoundary.state.packetCoordinateGates).toBeGreaterThan(0);
  });

  test("withholds packet motion when Claim 1's single-conductivity medium is absent", () => {
    const frame = stepBoyleSmithCcdSource(
      INITIAL_BOYLE_SMITH_CCD_SOURCE_STATE,
      {
        ...DEFAULT_BOYLE_SMITH_CCD_SOURCE_CONTROLS,
        claim1SingleConductivityPresent: false,
      },
      0.1,
    );
    expect(frame.metrics.claim1TopologyComplete).toBe(false);
    expect(frame.metrics.packetMotionAllowed).toBe(false);
    expect(frame.state.packetCoordinateGates).toBe(0);
  });

  test("freezes both sequence and packets while paused but immediately reflects topology changes", () => {
    const seeded = stepBoyleSmithCcdSource(
      INITIAL_BOYLE_SMITH_CCD_SOURCE_STATE,
      DEFAULT_BOYLE_SMITH_CCD_SOURCE_CONTROLS,
      0.1,
    );
    const pausedControls = {
      ...DEFAULT_BOYLE_SMITH_CCD_SOURCE_CONTROLS,
      running: false,
      claim1SingleConductivityPresent: false,
    };
    const paused = stepBoyleSmithCcdSource(seeded.state, pausedControls, 1);
    expect(paused.state).toEqual(seeded.state);
    expect(paused.metrics.claim1TopologyComplete).toBe(false);
    expect(paused.metrics.packetMotionAllowed).toBe(false);
  });

  test("keeps one shared tape across visual owners and reconciles paused controls", () => {
    const firstOwner = createBoyleSmithCcdTransportUpdater(
      () => DEFAULT_BOYLE_SMITH_CCD_SOURCE_CONTROLS,
    );
    firstOwner({} as never, 1 / 60);
    const first = structuredClone(getBoyleSmithCcdTapeFrame());

    const secondOwner = createBoyleSmithCcdTransportUpdater(
      () => DEFAULT_BOYLE_SMITH_CCD_SOURCE_CONTROLS,
    );
    secondOwner({} as never, 1 / 60);
    expect(getBoyleSmithCcdTapeFrame()?.state.timeSeconds).toBeCloseTo(2 / 60, 12);
    expect(getBoyleSmithCcdTapeFrame()?.state.packetCoordinateGates).toBeGreaterThan(
      first?.state.packetCoordinateGates ?? 0,
    );

    const reconciled = readBoyleSmithCcdTapeFrame({
      ...DEFAULT_BOYLE_SMITH_CCD_SOURCE_CONTROLS,
      running: false,
      claim1SingleConductivityPresent: false,
    });
    const sharedFrame = getBoyleSmithCcdTapeFrame();
    if (!sharedFrame)
      throw new Error("Expected the shared CCD tape to be populated by its owners.");
    expect(reconciled.state).toEqual(sharedFrame.state);
    expect(reconciled.metrics.claim1TopologyComplete).toBe(false);
    expect(reconciled.metrics.packetMotionAllowed).toBe(false);
  });

  test("publishes refusal-bounded transport telemetry without fabricated semiconductor values", () => {
    const updater = createBoyleSmithCcdTransportUpdater(() => ({
      ...DEFAULT_BOYLE_SMITH_CCD_SOURCE_CONTROLS,
      pulseWidthToStepRatio: 0.2,
    }));
    const update = updater({} as never, 1 / 60);
    expect(update?.refusal).toMatchObject({
      isRefused: true,
      reason:
        "Figure 3 pulse overlap condition is not met; quantitative charge loss is not inferred.",
    });
    expect(update?.semi).toMatchObject({
      biasVoltageVolts: 0,
      chargeTransferEfficiencyPct: 0,
      clockPeriodNs: 0,
    });
    expect(update?.machine?.modeLabel).toBe("source transfer condition refused");
  });
});
