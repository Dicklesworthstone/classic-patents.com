import { describe, expect, test } from "bun:test";
import {
  advanceOtisPlatformPosition,
  OTIS_LOWER_LIMIT_NORMALIZED,
  type OtisTopologyControls,
  stepOtis1861Topology,
} from "./otisKernel";

const baseline: OtisTopologyControls = {
  platformPositionNormalized: 0.55,
  drivePhaseRad: 0,
  driveCommand: 1,
  ropeGIntact: true,
  stopRopePulled: false,
  claim1HookLockEnabled: true,
  claim3BrakeInterlockEnabled: true,
  claim4CounterpoiseEnabled: true,
};

describe("US 31,128 source-bounded hoisting topology", () => {
  test("composes raise/lower/stop from one drive and the printed belts", () => {
    const raise = stepOtis1861Topology(baseline);
    expect(raise.scalarJointCoordinates).toBe(12);
    expect(raise.independentDriveDofs).toBe(1);
    expect(raise.straightBeltOWorking).toBe(true);
    expect(raise.crossBeltPWorking).toBe(false);
    expect(raise.platformMotionDirection).toBe(1);

    const lower = stepOtis1861Topology({ ...baseline, driveCommand: -1 });
    expect(lower.crossBeltPWorking).toBe(true);
    expect(lower.platformMotionDirection).toBe(-1);

    const stopped = stepOtis1861Topology({ ...baseline, stopRopePulled: true });
    expect(stopped.bothBeltsIdle).toBe(true);
    expect(stopped.brakeZEngaged).toBe(true);
    expect(stopped.claim3StopInterlockSatisfied).toBe(true);
  });

  test("locks Claim 1 on rope failure and exposes a guided failure when removed", () => {
    const caught = stepOtis1861Topology({ ...baseline, ropeGIntact: false });
    expect(caught.pawlsFEngaged).toBe(true);
    expect(caught.claim1HookLockSatisfied).toBe(true);
    expect(caught.platformMotionDirection).toBe(0);

    const removed = stepOtis1861Topology({
      ...baseline,
      ropeGIntact: false,
      claim1HookLockEnabled: false,
    });
    expect(removed.pawlsFEngaged).toBe(false);
    expect(removed.freeFallCounterfactual).toBe(true);
    expect(removed.platformMotionDirection).toBe(-1);
  });

  test("trips the declared lower-limit boundary and opposes the counterpoise", () => {
    const lowerStop = stepOtis1861Topology({
      ...baseline,
      platformPositionNormalized: OTIS_LOWER_LIMIT_NORMALIZED - 0.001,
      driveCommand: -1,
    });
    expect(lowerStop.lowerLimitStopActive).toBe(true);
    expect(lowerStop.brakeZEngaged).toBe(true);
    expect(lowerStop.counterpoisePositionNormalized).toBeCloseTo(0.971, 6);
  });

  test("advances only a normalized declared display coordinate and refuses bad inputs", () => {
    expect(advanceOtisPlatformPosition(0.5, 1, 50, 1)).toBeCloseTo(0.56, 6);
    expect(advanceOtisPlatformPosition(0.02, -1, 100, 1)).toBe(0);
    expect(() => stepOtis1861Topology({ ...baseline, platformPositionNormalized: 1.1 })).toThrow();
    expect(() => advanceOtisPlatformPosition(0.5, 1, 101, 1)).toThrow();
  });
});
