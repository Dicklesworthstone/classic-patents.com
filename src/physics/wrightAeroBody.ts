/**
 * Display-scale Flyer attitude from the same SI wrenches the badge uses.
 * Principal inertia is reduced so a 20 N·m yaw is visible at 60 Hz; the HUD
 * must not claim Smithsonian mass moments.
 */

import { type Quat, rigidBodyStep, type Vec3 } from "./lie";
import { FLYER_INERTIA } from "./flyerWasm";
import type { WrightControls, WrightSiState } from "./wrightKernel";

const DAMPING = 1.8;

export interface AeroBodyState {
  quaternion: Quat;
  omega: Vec3;
}

/** Body axes: x roll, y yaw, z pitch — matches Three.js Y-up after quat remap. */
export function wrightAeroTorque(si: WrightSiState, controls: WrightControls): Vec3 {
  const speed = Math.max(0.25, controls.airspeedMph / 28);
  const rollNm = controls.wingWarpDeg * 2.4 * speed;
  const pitchNm = -controls.elevatorDeg * 1.9 * speed;
  return [rollNm, si.netYawNm, pitchNm];
}

export function stepWrightAeroBody(
  state: AeroBodyState,
  si: WrightSiState,
  controls: WrightControls,
  dtS: number,
): AeroBodyState {
  const torque = wrightAeroTorque(si, controls);
  const damped: Vec3 = [
    torque[0] - DAMPING * state.omega[0],
    torque[1] - DAMPING * state.omega[1],
    torque[2] - DAMPING * state.omega[2],
  ];
  const next = rigidBodyStep(state.quaternion, state.omega, FLYER_INERTIA, dtS, damped);
  return { quaternion: next.q, omega: next.omega };
}

export function identityAeroBody(): AeroBodyState {
  return { quaternion: [1, 0, 0, 0], omega: [0, 0, 0] };
}
