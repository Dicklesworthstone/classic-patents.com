export interface DaVinciControls {
  motionScaleRatio: number; // illustrative calibration-offset control
  tremorFilterEnabled: boolean; // compatibility signal presence probe
  masterInputSpeedMps: number; // illustrative drive trajectory speed
  gripAngleDeg: number; // illustrative end-effector angle [0..60] deg
}

export interface DaVinciState {
  masterX: number;
  masterY: number;
  masterZ: number;
  slaveX: number;
  slaveY: number;
  slaveZ: number;
  baseYawRad: number;
  shoulderPitchRad: number;
  elbowPitchRad: number;
  wristPitchRad: number;
  wristYawRad: number;
  wristRollRad: number;
  gripRad: number;
  compatibilitySignalPercent: number;
  /** Legacy visual-test alias; not a source claim or telemetry label. */
  tremorAttenuationPercent: number;
  tipVelocityMms: number;
}

export function stepDaVinci(
  c: DaVinciControls,
  timeSec: number,
  prevState?: DaVinciState,
): DaVinciState {
  // The grant claims tool-boundary compatibility and calibration data, not a
  // universal commercial motion scale or tremor-filter specification. The
  // moving pose below is an explanatory presentation state only.
  const scale = Math.max(1.0, Math.min(10.0, c.motionScaleRatio || 3.0));
  const speed = c.masterInputSpeedMps || 0.5;

  const rawMasterX = 0.3 * Math.cos(timeSec * speed * 2.0);
  const rawMasterY = 0.2 * Math.sin(timeSec * speed * 4.0);
  const rawMasterZ = 0.1 * Math.sin(timeSec * speed * 1.5);

  // Deterministic presentation noise keeps the two poses visibly distinct;
  // it is not a physiological tremor claim from this patent.
  const interfaceNoiseFreq = 3.0 * 2.0 * Math.PI;
  const interfaceNoiseAmp = 0.015;
  const masterNoiseX = Math.sin(timeSec * interfaceNoiseFreq) * interfaceNoiseAmp;
  const masterNoiseY = Math.cos(timeSec * interfaceNoiseFreq * 1.1) * interfaceNoiseAmp;
  const masterNoiseZ = Math.sin(timeSec * interfaceNoiseFreq * 0.9) * interfaceNoiseAmp;

  const masterX = rawMasterX + masterNoiseX;
  const masterY = rawMasterY + masterNoiseY;
  const masterZ = rawMasterZ + masterNoiseZ;

  const targetX = c.tremorFilterEnabled ? rawMasterX / scale : masterX / scale;
  const targetY = c.tremorFilterEnabled ? rawMasterY / scale : masterY / scale;
  const targetZ = c.tremorFilterEnabled ? rawMasterZ / scale : masterZ / scale;

  const smoothing = c.tremorFilterEnabled ? 0.2 : 0.8;
  const prevX = prevState ? prevState.slaveX : targetX;
  const prevY = prevState ? prevState.slaveY : targetY;
  const prevZ = prevState ? prevState.slaveZ : targetZ;

  const slaveX = prevX + (targetX - prevX) * smoothing;
  const slaveY = prevY + (targetY - prevY) * smoothing;
  const slaveZ = prevZ + (targetZ - prevZ) * smoothing;

  const baseYawRad = Math.atan2(slaveX, slaveZ + 1.5);
  const r = Math.sqrt(slaveX * slaveX + (slaveZ + 1.5) * (slaveZ + 1.5));
  const shoulderPitchRad = -0.3 + slaveY * 0.8;
  const elbowPitchRad = 0.4 + r * 0.2;

  const wristPitchRad = Math.sin(timeSec * 1.5) * 0.5;
  const wristYawRad = Math.cos(timeSec * 1.2) * 0.4;
  const wristRollRad = (timeSec * 2.0) % (Math.PI * 2);
  const gripRad = ((c.gripAngleDeg ?? 30) * Math.PI) / 180;

  const tipVelocityMms = Math.sqrt(
    ((slaveX - prevX) * 60 * 1000) ** 2 +
      ((slaveY - prevY) * 60 * 1000) ** 2 +
      ((slaveZ - prevZ) * 60 * 1000) ** 2,
  );

  return {
    masterX,
    masterY,
    masterZ,
    slaveX,
    slaveY,
    slaveZ,
    baseYawRad,
    shoulderPitchRad,
    elbowPitchRad,
    wristPitchRad,
    wristYawRad,
    wristRollRad,
    gripRad,
    compatibilitySignalPercent: c.tremorFilterEnabled ? 100.0 : 0.0,
    tremorAttenuationPercent: c.tremorFilterEnabled ? 94.5 : 0.0,
    tipVelocityMms,
  };
}
