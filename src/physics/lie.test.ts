import { describe, expect, test } from "bun:test";
import { type Quat, quatExp, quatExpStep, quatMul, rigidBodyStep, type Vec3 } from "./lie";

describe("Lie-Group SO(3) Rigid Body Kinematics & Exp-Map Fallback", () => {
  test("quatMul identity property", () => {
    const identity: Quat = [1, 0, 0, 0];
    const q: Quat = [Math.SQRT1_2, Math.SQRT1_2, 0, 0];

    const res1 = quatMul(q, identity);
    expect(res1[0]).toBeCloseTo(q[0], 4);
    expect(res1[1]).toBeCloseTo(q[1], 4);
    expect(res1[2]).toBeCloseTo(q[2], 4);
    expect(res1[3]).toBeCloseTo(q[3], 4);

    const res2 = quatMul(identity, q);
    expect(res2[0]).toBeCloseTo(q[0], 4);
    expect(res2[1]).toBeCloseTo(q[1], 4);
  });

  test("quatExp maps zero rotation vector to identity quaternion", () => {
    const zero: Vec3 = [0, 0, 0];
    const q = quatExp(zero);
    expect(q[0]).toBeCloseTo(1, 4);
    expect(q[1]).toBeCloseTo(0, 4);
    expect(q[2]).toBeCloseTo(0, 4);
    expect(q[3]).toBeCloseTo(0, 4);
  });

  test("quatExpStep integrates angular velocity over time delta", () => {
    const q0: Quat = [1, 0, 0, 0];
    const omega: Vec3 = [0, Math.PI, 0]; // 180 deg/s around Y
    const dt = 0.5; // 0.5s -> 90 deg rotation around Y

    const q1 = quatExpStep(q0, omega, dt);
    // 90 deg around Y: w = cos(45) = 0.7071, y = sin(45) = 0.7071
    expect(q1[0]).toBeCloseTo(Math.SQRT1_2, 4);
    expect(q1[1]).toBeCloseTo(0, 4);
    expect(q1[2]).toBeCloseTo(Math.SQRT1_2, 4);
    expect(q1[3]).toBeCloseTo(0, 4);
  });

  test("rigidBodyStep advances attitude quaternion and angular velocity with torque", () => {
    const q0: Quat = [1, 0, 0, 0];
    const omega0: Vec3 = [0, 0, 0];
    const inertia: Vec3 = [10, 10, 10];
    const torque: Vec3 = [20, 0, 0]; // 20 N*m torque around X
    const dt = 0.1; // 0.1s

    const { q, omega } = rigidBodyStep(q0, omega0, inertia, dt, torque);
    // Angular acceleration alpha = torque / inertia = 20 / 10 = 2 rad/s^2
    // omegaNew = omega0 + alpha * dt = 0.2 rad/s
    expect(omega[0]).toBeCloseTo(0.2, 4);
    expect(omega[1]).toBeCloseTo(0, 4);
    expect(omega[2]).toBeCloseTo(0, 4);

    // Attitude moved slightly around X
    expect(q[0]).toBeLessThan(1.0);
    expect(q[1]).toBeGreaterThan(0);
  });
});
