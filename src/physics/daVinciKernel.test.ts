import { describe, expect, test } from "bun:test";
import {
  DA_VINCI_CUP_HEIGHT_M,
  DA_VINCI_CUP_RADIUS_M,
  DA_VINCI_END_EFFECTOR_RADIUS_M,
  DA_VINCI_TABLE_SURFACE_Y_M,
  readDaVinciControls,
  stepDaVinci,
} from "./daVinciKernel";
import { FrankenSimEngine } from "./engine";

describe("US 6,331,181 robotic surgical tool interface contact model", () => {
  test("clamps the shared parameter bus while preserving an explicit disabled flag", () => {
    expect(
      readDaVinciControls({
        motionScaleRatio: 20,
        tremorFilterEnabled: 0,
        masterInputSpeedMps: 0,
        gripAngleDeg: -5,
      }),
    ).toEqual({
      motionScaleRatio: 10,
      tremorFilterEnabled: false,
      masterInputSpeedMps: 0.2,
      gripAngleDeg: 0,
    });
    expect(
      readDaVinciControls({
        motionScaleRatio: Number.NaN,
        masterInputSpeedMps: Number.POSITIVE_INFINITY,
        gripAngleDeg: Number.NEGATIVE_INFINITY,
      }),
    ).toEqual({
      motionScaleRatio: 3,
      tremorFilterEnabled: true,
      masterInputSpeedMps: 0.5,
      gripAngleDeg: 30,
    });
  });

  test("computes baseline kinematic teleoperation and tremor filtering", () => {
    const stateFiltered = stepDaVinci(
      {
        motionScaleRatio: 3.0,
        tremorFilterEnabled: true,
        masterInputSpeedMps: 0.5,
        gripAngleDeg: 30,
      },
      1.0,
    );
    const stateUnfiltered = stepDaVinci(
      {
        motionScaleRatio: 3.0,
        tremorFilterEnabled: false,
        masterInputSpeedMps: 0.5,
        gripAngleDeg: 30,
      },
      1.0,
    );

    expect(stateFiltered.compatibilitySignalPercent).toBe(100.0);
    expect(stateUnfiltered.compatibilitySignalPercent).toBe(0.0);
    expect(stateFiltered.tipX).toBeDefined();
    expect(stateFiltered.tipY).toBeDefined();
    expect(stateFiltered.tipZ).toBeDefined();
    expect(stateFiltered.tipVelocityMms).toBeGreaterThanOrEqual(0);
  });

  test("detects collision with coffee cup obstacle and strictly prevents clipping through it", () => {
    // Position coffee cup directly along the robotic arm workspace trajectory
    const cupPos: [number, number, number] = [0.35, -0.15, 0.25];

    let state = stepDaVinci(
      {
        motionScaleRatio: 1.0,
        tremorFilterEnabled: true,
        masterInputSpeedMps: 1.0,
        gripAngleDeg: 30,
        cupInitialPos: cupPos,
      },
      0,
    );

    let collisionOccurred = state.isCupContact;
    let maxForce = state.contactForceN;

    // Step through trajectory
    for (let i = 1; i <= 120; i++) {
      state = stepDaVinci(
        {
          motionScaleRatio: 1.0,
          tremorFilterEnabled: true,
          masterInputSpeedMps: 1.0,
          gripAngleDeg: 30,
        },
        i * (1 / 60),
        state,
        1 / 60,
      );

      if (state.isCupContact) {
        collisionOccurred = true;
        maxForce = Math.max(maxForce, state.contactForceN);

        // The resolved tip center stays outside the Minkowski-expanded cup.
        const dx = state.tipX - state.cupX;
        const dz = state.tipZ - state.cupZ;
        const distHoriz = Math.sqrt(dx * dx + dz * dz);
        expect(distHoriz).toBeGreaterThanOrEqual(
          DA_VINCI_CUP_RADIUS_M + DA_VINCI_END_EFFECTOR_RADIUS_M - 1e-4,
        );
        expect(state.contactForceN).toBeGreaterThan(0);
        expect(state.penetrationDepthMm).toBeGreaterThan(0);
      }
    }

    expect(collisionOccurred).toBe(true);
    expect(maxForce).toBeGreaterThan(0);
  });

  test("applies Newtonian push force and slides the coffee cup when collision occurs", () => {
    const cupInitialPos: [number, number, number] = [0.4, -0.15, 0.27];

    let state = stepDaVinci(
      {
        motionScaleRatio: 1.0,
        tremorFilterEnabled: true,
        masterInputSpeedMps: 1.0,
        gripAngleDeg: 30,
        cupInitialPos,
      },
      0,
    );

    for (let i = 1; i <= 180; i++) {
      state = stepDaVinci(
        {
          motionScaleRatio: 1.0,
          tremorFilterEnabled: true,
          masterInputSpeedMps: 1.0,
          gripAngleDeg: 30,
        },
        i * (1 / 60),
        state,
        1 / 60,
      );
    }

    // The cup must have been displaced from its initial position due to Newtonian contact force
    const totalDisplacement = Math.sqrt(
      (state.cupX - cupInitialPos[0]) ** 2 + (state.cupZ - cupInitialPos[2]) ** 2,
    );
    expect(totalDisplacement).toBeGreaterThan(0);
  });

  test("strictly prevents end-effector from penetrating below the sterile table drape", () => {
    let state = stepDaVinci(
      {
        motionScaleRatio: 1.0,
        tremorFilterEnabled: true,
        masterInputSpeedMps: 2.0,
        gripAngleDeg: 30,
      },
      0,
    );

    for (let i = 1; i <= 120; i++) {
      state = stepDaVinci(
        {
          motionScaleRatio: 1.0,
          tremorFilterEnabled: true,
          masterInputSpeedMps: 2.0,
          gripAngleDeg: 30,
        },
        i * (1 / 60),
        state,
        1 / 60,
      );

      expect(state.tipY).toBeGreaterThanOrEqual(
        DA_VINCI_TABLE_SURFACE_Y_M + DA_VINCI_END_EFFECTOR_RADIUS_M - 1e-4,
      );
    }
  });

  test("keeps the grasped tool and carried cup above the table", () => {
    const grasped = stepDaVinci(
      {
        motionScaleRatio: 1,
        tremorFilterEnabled: true,
        masterInputSpeedMps: 0.5,
        gripAngleDeg: 10,
        cupInitialPos: [0.00382127505236541, -0.15, 0.43226054442228073],
      },
      1.5,
    );

    expect(grasped.isGrasped).toBe(true);
    expect(grasped.tipY).toBeGreaterThanOrEqual(
      DA_VINCI_TABLE_SURFACE_Y_M + DA_VINCI_CUP_HEIGHT_M * 0.85,
    );
    expect(grasped.cupY).toBeGreaterThanOrEqual(DA_VINCI_TABLE_SURFACE_Y_M);
    expect(grasped.cupY).toBeCloseTo(grasped.tipY - DA_VINCI_CUP_HEIGHT_M * 0.85, 10);
  });

  test("uses time-step-invariant smoothing for the slave trajectory", () => {
    const controls = {
      motionScaleRatio: 3,
      tremorFilterEnabled: true,
      masterInputSpeedMps: 0.5,
      gripAngleDeg: 30,
    };
    const initial = stepDaVinci(controls, 0);
    const oneSixtieth = stepDaVinci(controls, 1 / 60, initial, 1 / 60);
    const oneOneTwentieth = stepDaVinci(controls, 1 / 120, initial, 1 / 120);
    const twoOneTwentieth = stepDaVinci(controls, 1 / 60, oneOneTwentieth, 1 / 120);

    expect(twoOneTwentieth.slaveX).toBeCloseTo(oneSixtieth.slaveX, 3);
    expect(twoOneTwentieth.slaveY).toBeCloseTo(oneSixtieth.slaveY, 3);
    expect(twoOneTwentieth.slaveZ).toBeCloseTo(oneSixtieth.slaveZ, 3);
  });

  test("locks a cup at the rim and releases it when the jaws reopen", () => {
    const grasped = stepDaVinci(
      {
        motionScaleRatio: 1.0,
        tremorFilterEnabled: true,
        masterInputSpeedMps: 0.5,
        gripAngleDeg: 10,
        cupInitialPos: [0.00382127505236541, -0.15, 0.43226054442228073],
      },
      1.5,
    );

    expect(grasped.isGrasped).toBe(true);
    expect(Math.abs(grasped.cupX - grasped.tipX)).toBeLessThan(DA_VINCI_CUP_RADIUS_M);
    expect(Math.abs(grasped.cupZ - grasped.tipZ)).toBeLessThan(DA_VINCI_CUP_RADIUS_M);

    const released = stepDaVinci(
      {
        motionScaleRatio: 1.0,
        tremorFilterEnabled: true,
        masterInputSpeedMps: 0.5,
        gripAngleDeg: 30,
      },
      1.5 + 1 / 60,
      grasped,
      1 / 60,
    );
    expect(released.isGrasped).toBe(false);
  });

  test("FrankenSimEngine.stepDaVinci is the same kernel boundary", () => {
    const controls = readDaVinciControls({
      motionScaleRatio: 4,
      tremorFilterEnabled: 1,
      masterInputSpeedMps: 0.75,
      gripAngleDeg: 20,
    });
    expect(FrankenSimEngine.stepDaVinci(controls, 1.25)).toEqual(stepDaVinci(controls, 1.25));
  });
});
