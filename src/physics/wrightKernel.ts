/**
 * Shared Wright Flyer SI step used by 2D, 3D, schematic, and the telemetry badge.
 * Airspeed control stays in mph (historical); forces and moments are SI.
 */

export const WRIGHT_PATENT_ID = "us-821393-wright-flyer";
/** Claim 18 rudder linkage: rudder degrees per degree of wing warp. */
export const WRIGHT_COUPLING = 0.45;

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
  };
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
    leftBayTension: Number(Math.max(0, liftNewtons / 2200 + controls.wingWarpDeg / 15).toFixed(4)),
    rightBayTension: Number(Math.max(0, liftNewtons / 2200 - controls.wingWarpDeg / 15).toFixed(4)),
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
  };
}
