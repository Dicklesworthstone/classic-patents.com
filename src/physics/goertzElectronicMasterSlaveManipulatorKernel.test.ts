import { describe, expect, test } from "bun:test";
import {
  GOERTZ_MASTER_SLAVE_DEFAULT_CONTROLS,
  GOERTZ_MOTION_CHANNELS,
  readGoertzMasterSlaveControls,
  stepGoertzMasterSlaveTopology,
} from "./goertzElectronicMasterSlaveManipulatorKernel";

describe("US 2,846,084 source-bounded master–slave topology", () => {
  test("keeps all seven source-described motions as separate correspondence channels", () => {
    const state = stepGoertzMasterSlaveTopology({
      horizontalArmPivot: 0.31,
      horizontalArmRoll: -0.24,
      verticalArmPivot: 0.42,
      verticalArmRoll: -0.17,
      toolAxis171: 0.13,
      toolAxis172: -0.37,
      gripperClosure: 0.81,
      contactResistance: 0,
    });

    expect(GOERTZ_MOTION_CHANNELS).toHaveLength(7);
    expect(state.masterChannels).toEqual([0.31, -0.24, 0.42, -0.17, 0.13, -0.37, 0.81]);
    expect(state.slaveChannels).toEqual(state.masterChannels);
    expect(state.positionErrors).toEqual([0, 0, 0, 0, 0, 0, 0]);
    expect(state.state).toBe("correspondence");
  });

  test("makes illustrative remote contact visible as normalized position mismatch and Claim 9 reflection", () => {
    const state = stepGoertzMasterSlaveTopology({
      horizontalArmPivot: 0.4,
      contactResistance: 1,
      tachometerDampingEnabled: 0,
      limiterEnabled: 0,
      forceReflectionEnabled: 1,
    });

    expect(state.positionErrors[0]).toBeCloseTo(0.4, 12);
    expect(state.slaveChannels[0]).toBeCloseTo(0, 12);
    expect(state.reflectedResistance).toBeCloseTo(state.errorMagnitude, 12);
    expect(state.forceReflectionEnabled).toBe(true);
    expect(state.activeClaim).toBe(9);
    expect(state.state).toBe("force-reflecting remote contact");
  });

  test("exposes the limiter and tachometer branch without inventing a physical speed", () => {
    const limited = stepGoertzMasterSlaveTopology({
      gripperClosure: 1,
      contactResistance: 1,
      tachometerDampingEnabled: 1,
      limiterEnabled: 1,
    });
    const unreflected = stepGoertzMasterSlaveTopology({
      horizontalArmPivot: 0.7,
      contactResistance: 1,
      tachometerDampingEnabled: 0,
      limiterEnabled: 0,
      forceReflectionEnabled: 0,
    });

    expect(limited.limiterActive).toBe(true);
    expect(limited.positionErrors[6]).toBeCloseTo(0.55, 12);
    expect(limited.activeClaim).toBe(12);
    expect(unreflected.reflectedResistance).toBe(0);
    expect(unreflected.state).toBe("remote contact without reflection");
    expect(unreflected.activeClaim).toBe(13);
  });

  test("clamps public controls and continually reports its SI refusal", () => {
    expect(
      readGoertzMasterSlaveControls({
        horizontalArmPivot: 3,
        horizontalArmRoll: -3,
        gripperClosure: -1,
        contactResistance: 4,
        forceReflectionEnabled: 0.49,
        tachometerDampingEnabled: 0.5,
        limiterEnabled: Number.NaN,
      }),
    ).toEqual({
      ...GOERTZ_MASTER_SLAVE_DEFAULT_CONTROLS,
      horizontalArmPivot: 1,
      horizontalArmRoll: -1,
      gripperClosure: 0,
      contactResistance: 1,
      forceReflectionEnabled: 0,
      tachometerDampingEnabled: 1,
    });

    const state = stepGoertzMasterSlaveTopology({});
    expect(state.refusal.refused).toBe(true);
    expect(state.refusal.reason).toContain("arm dimensions");
    expect(state.refusal.reason).toContain("force calibration");
    expect(state.positionLaw).toContain("normalized");
  });
});
