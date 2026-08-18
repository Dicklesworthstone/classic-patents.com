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
}

export function coupledRudderDeg(wingWarpDeg: number): number {
  return Math.round(wingWarpDeg * WRIGHT_COUPLING);
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
    leftBayTension: Number(
      Math.max(0, liftNewtons / 2200 + controls.wingWarpDeg / 15).toFixed(4),
    ),
    rightBayTension: Number(
      Math.max(0, liftNewtons / 2200 - controls.wingWarpDeg / 15).toFixed(4),
    ),
  };
}
