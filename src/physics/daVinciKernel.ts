export interface DaVinciControls {
  motionScaleRatio: number; // e.g. 3:1 to 10:1 master-to-slave motion scaling
  tremorFilterEnabled: boolean; // 6-10 Hz low-pass filter flag
  masterInputSpeedMps: number; // Master input trajectory speed
  gripAngleDeg: number; // Tool jaws angle [0..60] deg
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
  tremorAttenuationPercent: number;
  tipVelocityMms: number;
}

export function stepDaVinci(
  c: DaVinciControls,
  timeSec: number,
  prevState?: DaVinciState,
): DaVinciState {
  const scale = Math.max(1.0, Math.min(10.0, c.motionScaleRatio || 3.0));
  const speed = c.masterInputSpeedMps || 0.5;

  const rawMasterX = 0.3 * Math.cos(timeSec * speed * 2.0);
  const rawMasterY = 0.2 * Math.sin(timeSec * speed * 4.0);
  const rawMasterZ = 0.1 * Math.sin(timeSec * speed * 1.5);

  const tremorFreq = 8.0 * 2.0 * Math.PI;
  const tremorAmp = 0.015;
  const masterTremorX = Math.sin(timeSec * tremorFreq) * tremorAmp;
  const masterTremorY = Math.cos(timeSec * tremorFreq * 1.1) * tremorAmp;
  const masterTremorZ = Math.sin(timeSec * tremorFreq * 0.9) * tremorAmp;

  const masterX = rawMasterX + masterTremorX;
  const masterY = rawMasterY + masterTremorY;
  const masterZ = rawMasterZ + masterTremorZ;

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
    tremorAttenuationPercent: c.tremorFilterEnabled ? 94.5 : 0.0,
    tipVelocityMms,
  };
}
