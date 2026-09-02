import { describe, expect, test } from "bun:test";
import {
  LEMELSON_AUTOMATIC_PRODUCTION_DEFAULT_CONTROLS,
  readLemelsonAutomaticProductionControls,
  stepLemelsonAutomaticProductionTopology,
} from "./lemelsonAutomaticProductionKernel";

describe("US 3,313,014 automatic-production source-bounded topology", () => {
  test("authorizes the claimed station operation only after marker, retention, and coupling", () => {
    const state = stepLemelsonAutomaticProductionTopology({
      ...LEMELSON_AUTOMATIC_PRODUCTION_DEFAULT_CONTROLS,
      cycleProgress: 0.56,
      stationDetected: 1,
      stationCoupled: 1,
    });

    expect(state.phase).toBe("coupled station operation");
    expect(state.carrierLocked).toBe(true);
    expect(state.controllerCoupled).toBe(true);
    expect(state.machineCommandAuthorized).toBe(true);
    expect(state.activeClaimProbe).toBe("Claim 7 station coupling");
  });

  test("refuses a machine-command state when the carrier has not coupled to the station", () => {
    const state = stepLemelsonAutomaticProductionTopology({
      stationDetected: 1,
      stationCoupled: 0,
      cycleProgress: 0.6,
    });

    expect(state.phase).toBe("awaiting station coupling");
    expect(state.carrierLocked).toBe(true);
    expect(state.controllerCoupled).toBe(false);
    expect(state.machineCommandAuthorized).toBe(false);
  });

  test("requires a sensed station before retaining the carrier", () => {
    const state = stepLemelsonAutomaticProductionTopology({
      stationDetected: 0,
      stationCoupled: 1,
      cycleProgress: 0.6,
    });

    expect(state.phase).toBe("travel");
    expect(state.carrierLocked).toBe(false);
    expect(state.machineCommandAuthorized).toBe(false);
  });

  test("moves to the source-described release and departure stage without inventing a time", () => {
    const state = stepLemelsonAutomaticProductionTopology({
      stationDetected: 1,
      stationCoupled: 1,
      cycleProgress: 0.86,
    });

    expect(state.phase).toBe("release and depart");
    expect(state.releaseAuthorized).toBe(true);
    expect(state.activeClaimProbe).toBe("Claim 20 release");
    expect(state.sourceBoundary.isRefused).toBe(true);
    expect(state.sourceBoundary.reason).toContain("no dimensions");
  });

  test("bounds every normalized input at the source-bounded control boundary", () => {
    const controls = readLemelsonAutomaticProductionControls({
      carrierAddressFraction: -4,
      liftFraction: 8,
      reachFraction: Number.NaN,
      stationDetected: 2,
      stationCoupled: -1,
      cycleProgress: 0.25,
    });

    expect(controls).toEqual({
      carrierAddressFraction: 0,
      liftFraction: 1,
      reachFraction: LEMELSON_AUTOMATIC_PRODUCTION_DEFAULT_CONTROLS.reachFraction,
      stationDetected: 1,
      stationCoupled: 0,
      cycleProgress: 0.25,
    });
  });
});
