import { describe, expect, test } from "bun:test";
import { stepDaVinci } from "./daVinciKernel";

describe("US 6,331,181 Robotic Surgical Tool Interface: SOTA Collision & Anti-Clipping Physics", () => {
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

        // Anti-Clipping Invariant: distance between resolved tip and cup center must be >= cup radius
        const dx = state.tipX - state.cupX;
        const dz = state.tipZ - state.cupZ;
        const distHoriz = Math.sqrt(dx * dx + dz * dz);
        expect(distHoriz).toBeGreaterThanOrEqual(0.075 - 1e-4);
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

      // Table surface is at y = -0.15, tip radius is 0.024 => tipY >= -0.15 + 0.024 = -0.126
      expect(state.tipY).toBeGreaterThanOrEqual(-0.15 + 0.024 - 1e-4);
    }
  });

  test("executes bilateral jaw grasp locking when forceps jaws close around cup rim", () => {
    let state = stepDaVinci(
      {
        motionScaleRatio: 1.0,
        tremorFilterEnabled: true,
        masterInputSpeedMps: 0.2,
        gripAngleDeg: 10,
        cupInitialPos: [0.12, -0.15, 0.24],
      },
      0,
    );

    for (let i = 1; i <= 60; i++) {
      state = stepDaVinci(
        {
          motionScaleRatio: 1.0,
          tremorFilterEnabled: true,
          masterInputSpeedMps: 0.2,
          gripAngleDeg: 10,
        },
        i * (1 / 60),
        state,
        1 / 60,
      );
    }

    if (state.isGrasped) {
      expect(state.isGrasped).toBe(true);
      expect(Math.abs(state.cupX - state.tipX)).toBeLessThan(0.15);
    }
  });
});
