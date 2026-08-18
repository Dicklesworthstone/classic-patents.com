/**
 * Display-scale Flyer attitude from the same SI wrenches the badge uses.
 * Principal inertia is reduced so a 20 N·m yaw is visible at 60 Hz; the HUD
 * must not claim Smithsonian mass moments.
 */

import { stepFlyerAero } from "./flyerWasm";
import type { Quat, Vec3 } from "./lie";
import type { WrightControls, WrightSiState } from "./wrightKernel";

const DAMPING = 3.2;

export interface AeroBodyState {
  quaternion: Quat;
  omega: Vec3;
}

/** Body axes: x roll, y yaw, z pitch — matches Three.js Y-up after quat remap. */
export function wrightAeroTorque(
  state: AeroBodyState,
  si: WrightSiState,
  controls: WrightControls,
): Vec3 {
  const q = state.quaternion;
  const qw = q[0];
  const qx = q[1];
  const qy = q[2];
  const qz = q[3];

  // Current body Euler angles (radians)
  const currentRoll = Math.atan2(2 * (qw * qx + qy * qz), 1 - 2 * (qx * qx + qy * qy));
  const currentYaw = Math.atan2(2 * (qw * qy - qz * qx), 1 - 2 * (qy * qy + qz * qz));
  const currentPitch = Math.asin(Math.max(-1, Math.min(1, 2 * (qw * qz + qx * qy))));

  const speed = Math.max(0.25, controls.airspeedMph / 28);

  // Commanded target equilibrium attitudes from control surfaces
  // Wing warp produces roll bank (e.g. ±10° warp -> ±15° bank)
  const targetRoll = controls.wingWarpDeg * (Math.PI / 180) * 1.5;
  // Elevator produces pitch angle (e.g. ±5° canard -> ∓6° pitch)
  const targetPitch = -controls.elevatorDeg * (Math.PI / 180) * 1.2;
  // Rudder / net yaw moment produces sideslip / heading drift angle
  const targetYaw = si.netYawNm * 0.015 * speed;

  // Aerodynamic restoring spring stiffness (k)
  const K_ROLL = 8.5 * speed;
  const K_YAW = 6.0 * speed;
  const K_PITCH = 9.0 * speed;

  const rollTorque = K_ROLL * (targetRoll - currentRoll);
  const yawTorque = K_YAW * (targetYaw - currentYaw);
  const pitchTorque = K_PITCH * (targetPitch - currentPitch);

  return [rollTorque, yawTorque, pitchTorque];
}

export function stepWrightAeroBody(
  state: AeroBodyState,
  si: WrightSiState,
  controls: WrightControls,
  dtS: number,
): AeroBodyState {
  const torque = wrightAeroTorque(state, si, controls);
  const damped: Vec3 = [
    torque[0] - DAMPING * state.omega[0],
    torque[1] - DAMPING * state.omega[1],
    torque[2] - DAMPING * state.omega[2],
  ];
  const next = stepFlyerAero(state, damped, dtS);
  return { quaternion: next.quaternion, omega: next.omega };
}

export function identityAeroBody(): AeroBodyState {
  return { quaternion: [1, 0, 0, 0], omega: [0, 0, 0] };
}
