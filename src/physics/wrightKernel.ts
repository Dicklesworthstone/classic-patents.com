/**
 * Shared Wright Flyer SI step used by 2D, 3D, schematic, and the telemetry badge.
 * Airspeed control stays in mph (historical); forces and moments are SI.
 */

import { wrightStayWireTruss, wrightStreamCavity } from "./deepWasm";

export const WRIGHT_PATENT_ID = "us-821393-wright-flyer";
/** Claim 18 rudder linkage: rudder degrees per degree of wing warp. */
export const WRIGHT_COUPLING = 0.45;
/** 750 lbf Kitty Hawk flying weight. Shared by the SI step, host 6-DoF integrator, and fidelity. */
export const WRIGHT_GROSS_WEIGHT_N = 3336;
/** Host 6-DoF yaw inertia. dω_yaw = netYawNm / I_zz. Not a 1903 measurement. */
export const WRIGHT_YAW_INERTIA_KG_M2 = 36;
/** Host 6-DoF pitch inertia. dω_pitch = pitchNm / I_yy. */
export const WRIGHT_PITCH_INERTIA_KG_M2 = 24;
/** Host altitude integrator: dh = (L − W) × this × dt. Named leftover from the old 6-DoF path. */
export const WRIGHT_ALTITUDE_LIFT_COUPLING = 0.0005;
/** Pitch couple per degree of canard, scaled by airspeed/30 mph. */
export const WRIGHT_PITCH_ELEVATOR_NM_PER_DEG = 2.2;

export interface WrightControls {
  airspeedMph: number;
  wingWarpDeg: number;
  rudderDeg: number;
  elevatorDeg: number;
  coupled: boolean;
}

export interface WrightSiState {
  airspeedMps: number;
  dynamicPressurePa: number;
  liftNewtons: number;
  inducedDragNewtons: number;
  parasiticDragNewtons: number;
  totalDragNewtons: number;
  liftToDrag: number;
  adverseYawNm: number;
  rudderYawNm: number;
  netYawNm: number;
  coordinated: boolean;
  adverseYawDominant: boolean;
  cl: number;
  propDisplayOmegaRadPerS: number;
  streamFlowSpeed: number;
  downwashSpeed: number;
  cradleStudioX: number;
  leftBayTension: number;
  rightBayTension: number;
  trussCertificate: "Certified" | "Estimated";
  trussRefused: boolean;
  trussMaxAbsForce: number;
  cavityMeanSpeed: number;
  liftVectorLength: number;
  dragVectorLength: number;
  warpLiftN: number;
  leftLiftN: number;
  rightLiftN: number;
  leftWingLiftPct: number;
  rightWingLiftPct: number;
  leftInducedDragNewtons: number;
  rightInducedDragNewtons: number;
  airframeRollDeg: number;
  canardSvgY: number;
  leftLiftSvgY: number;
  rightLiftSvgY: number;
  leftDragSvgX: number;
  rightDragSvgX: number;
  rudderSvgScale: number;
  hoverOmegaRadPerS: number;
  hoverAmpM: number;
  pitchNm: number;
  yawAlphaRadPerS2: number;
  pitchAlphaRadPerS2: number;
  altitudeRateMps: number;
}

export function coupledRudderDeg(wingWarpDeg: number): number {
  return Math.round(wingWarpDeg * WRIGHT_COUPLING);
}

/** USPTO Fig. 4 schematic pose. Idle warp is 8° when the bus has not set wingWarp. */
export function wrightSchematicPose(params: Record<string, number> = {}) {
  const wingWarpDeg = params.wingWarp ?? 8;
  const rudderDeg = params.rudder ?? params.rudderAngle ?? 4;
  const coupled = (params.coupled ?? 1) >= 0.5;
  const warpPx = Number(((wingWarpDeg / 15) * 12).toFixed(3));
  return {
    wingWarpDeg,
    rudderDeg,
    coupled,
    adverse: !coupled && Math.abs(wingWarpDeg) > 6,
    warpPx,
    rasterSkew: Number(((wingWarpDeg / 15) * 8).toFixed(3)),
    rudderAngle: Number((rudderDeg * 0.7).toFixed(3)),
    strutDelta: Number((warpPx * 0.7).toFixed(3)),
    schematicRasterX: 24,
    schematicRasterY: 28,
    schematicRasterW: 352,
    schematicRasterH: 250,
    schematicAdverseX: 250,
    schematicAdverseY: 70,
    schematicAdverseW: 120,
    schematicAdverseH: 140,
    schematicWingX0: 40,
    schematicWingX1: 360,
    schematicWingMidX: 200,
    schematicUpperBaseY: 100,
    schematicUpperQ0: 80,
    schematicUpperQ1: 90,
    schematicLowerBaseY: 190,
    schematicLowerQ0: 170,
    schematicLowerQ1: 180,
    schematicStrutXs: [80, 160, 240, 320],
    schematicInnerStrutY0: 90,
    schematicInnerStrutY1: 180,
    schematicEdgeStrutY0: 95,
    schematicEdgeStrutY1: 185,
    schematicCanardX: 140,
    schematicCanardY: 35,
    schematicCanardW: 120,
    schematicCanardH: 24,
    schematicCanardBraceY0: 59,
    schematicCanardBraceY1: 90,
    schematicCanardBraceX0: 150,
    schematicCanardBraceX1: 180,
    schematicCanardBraceX2: 250,
    schematicCanardBraceX3: 220,
    schematicRudderPivotX: 200,
    schematicRudderPivotY: 225,
    schematicRudderX: 185,
    schematicRudderY: 225,
    schematicRudderW: 30,
    schematicRudderH: 55,
    schematicRudderPostX0: 190,
    schematicRudderPostX1: 210,
    schematicRudderPostY0: 185,
    schematicCradleX: 180,
    schematicCradleY: 172,
    schematicCradleW: 40,
    schematicCradleH: 15,
  };
}

/** Map a 0–1 pointer x to wing-warp degrees. Shared by the schematic. */
export function wrightWarpFromPointerNx(nx: number, spanDeg = 30) {
  const half = spanDeg / 2;
  return Number(Math.max(-half, Math.min(half, (nx - 0.5) * spanDeg)).toFixed(3));
}

export function readWrightControls(params: Record<string, number>): WrightControls {
  const wingWarpDeg = params.wingWarp ?? 0;
  const coupled = (params.coupled ?? 1) >= 0.5;
  return {
    airspeedMph: params.airspeed ?? 28,
    wingWarpDeg,
    rudderDeg: coupled ? coupledRudderDeg(wingWarpDeg) : (params.rudder ?? 0),
    elevatorDeg: params.elevator ?? 0,
    coupled,
  };
}

export function stepWrightFlyerSi(controls: WrightControls): WrightSiState {
  const airspeedMps = controls.airspeedMph * 0.44704;
  const rho = 1.225;
  const wingAreaM2 = 47.4;
  const q = 0.5 * rho * airspeedMps * airspeedMps;
  const cl = 0.45 + controls.elevatorDeg * 0.04;
  const liftNewtons = Math.max(
    0,
    q * wingAreaM2 * Math.max(0.08, cl) + controls.wingWarpDeg * 18.5,
  );
  const aspect = 6.4;
  const e = 0.85;
  const inducedDragNewtons = liftNewtons ** 2 / (Math.PI * aspect * e * q * wingAreaM2 + 1e-4);
  const parasiticDragNewtons = q * 4.2;
  const totalDragNewtons = inducedDragNewtons + parasiticDragNewtons;
  const speedRatio = controls.airspeedMph / 30;
  const warpLiftN = controls.wingWarpDeg * 18.5;
  const leftLiftN = Math.max(0, liftNewtons / 2 - warpLiftN / 2);
  const rightLiftN = Math.max(0, liftNewtons / 2 + warpLiftN / 2);
  const liftSpan = Math.max(1, liftNewtons);
  const adverseYawNm = -controls.wingWarpDeg * 1.7 * speedRatio;
  const rudderYawNm = controls.rudderDeg * 3.8 * speedRatio;
  const netYawNm = adverseYawNm + rudderYawNm;
  const pitchNm = -controls.elevatorDeg * WRIGHT_PITCH_ELEVATOR_NM_PER_DEG * speedRatio;
  const yawAlphaRadPerS2 = Number((netYawNm / WRIGHT_YAW_INERTIA_KG_M2).toFixed(5));
  const pitchAlphaRadPerS2 = Number((pitchNm / WRIGHT_PITCH_INERTIA_KG_M2).toFixed(5));
  const altitudeRateMps = Number(
    ((liftNewtons - WRIGHT_GROSS_WEIGHT_N) * WRIGHT_ALTITUDE_LIFT_COUPLING).toFixed(6),
  );
  return {
    airspeedMps,
    dynamicPressurePa: q,
    liftNewtons,
    inducedDragNewtons,
    parasiticDragNewtons,
    totalDragNewtons,
    liftToDrag: totalDragNewtons > 0 ? liftNewtons / totalDragNewtons : 0,
    adverseYawNm,
    rudderYawNm,
    netYawNm,
    coordinated: Math.abs(netYawNm) < 8 && Math.abs(controls.wingWarpDeg) > 6,
    adverseYawDominant:
      !controls.coupled && Math.abs(controls.wingWarpDeg) > 8 && Math.abs(netYawNm) > 10,
    cl,
    propDisplayOmegaRadPerS: Number(((controls.airspeedMph / 25) * 45).toFixed(3)),
    streamFlowSpeed: Number(((controls.airspeedMph / 30) * 18).toFixed(3)),
    downwashSpeed: Number((cl * 0.08).toFixed(4)),
    cradleStudioX: Number((-0.35 + (controls.wingWarpDeg / 15) * 0.12).toFixed(4)),
    ...wrightStayWireTruss(liftNewtons, controls.wingWarpDeg),
    ...wrightStreamCavity(controls.airspeedMph),
    liftVectorLength: Number(Math.max(0.5, liftNewtons / 1100).toFixed(4)),
    dragVectorLength: Number(Math.max(0.3, totalDragNewtons / 400).toFixed(4)),
    warpLiftN,
    leftLiftN,
    rightLiftN,
    leftWingLiftPct: Number(((leftLiftN / liftSpan) * 100).toFixed(2)),
    rightWingLiftPct: Number(((rightLiftN / liftSpan) * 100).toFixed(2)),
    leftInducedDragNewtons: Number(
      ((leftLiftN / Math.max(1, liftNewtons)) ** 2 * inducedDragNewtons).toFixed(3),
    ),
    rightInducedDragNewtons: Number(
      ((rightLiftN / Math.max(1, liftNewtons)) ** 2 * inducedDragNewtons).toFixed(3),
    ),
    airframeRollDeg: Number((controls.wingWarpDeg * 0.9).toFixed(3)),
    canardSvgY: Number((controls.elevatorDeg * -1.2).toFixed(3)),
    leftLiftSvgY: Number(((leftLiftN / liftSpan) * 100 * 0.4).toFixed(2)),
    rightLiftSvgY: Number(((rightLiftN / liftSpan) * 100 * 0.4).toFixed(2)),
    leftDragSvgX: Number(
      ((leftLiftN / Math.max(1, liftNewtons)) ** 2 * inducedDragNewtons * 2).toFixed(2),
    ),
    rightDragSvgX: Number(
      ((rightLiftN / Math.max(1, liftNewtons)) ** 2 * inducedDragNewtons * 2).toFixed(2),
    ),
    rudderSvgScale: 1.2,
    hoverOmegaRadPerS: 1.4,
    hoverAmpM: 0.04,
    pitchNm,
    yawAlphaRadPerS2,
    pitchAlphaRadPerS2,
    altitudeRateMps,
  };
}

/** Studio hover bob on the live-flight 3D airframe. Shared by 3D. */
export function wrightHoverY(elapsedS: number, omegaRadPerS = 1.4, ampM = 0.04) {
  return Number((Math.sin(elapsedS * omegaRadPerS) * ampM).toFixed(4));
}
