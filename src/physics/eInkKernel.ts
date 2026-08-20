export interface EInkControls {
  electrodeVoltageVolts: number; // Applied driving voltage [-15V .. +15V]
  fluidViscosityCp: number; // Fluid dynamic viscosity in cP (mPa·s) [1.0 .. 5.0]
  particleChargeCoupled?: number; // Zeta potential / effective charge multiplier [0.5 .. 2.0]
}

export interface EInkState {
  whiteParticleNormY: number; // Top = 1.0 (viewing face), Bottom = -1.0
  blackParticleNormY: number; // Top = 1.0 (viewing face), Bottom = -1.0
  electricFieldVperUm: number; // V/μm across 50μm capsule gap
  driftVelocityMms: number; // Particle drift speed in mm/s
  surfaceReflectancePercent: number; // Optical contrast [5% to 75%]
  contrastRatio: string;
}

export function stepEInk(c: EInkControls, dtSec: number, prevState?: EInkState): EInkState {
  const voltage = Math.max(-15, Math.min(15, c.electrodeVoltageVolts ?? 15));
  const viscosity = Math.max(0.5, c.fluidViscosityCp ?? 2.0) * 1e-3;
  const chargeMult = Math.max(0.2, c.particleChargeCoupled ?? 1.0);

  const gapM = 50e-6;
  const electricFieldVperM = voltage / gapM;
  const electricFieldVperUm = voltage / 50.0;

  const baseMobility = 1.6e-8 * (1e-3 / viscosity) * chargeMult;
  const velocityMps = baseMobility * electricFieldVperM;
  const velocityNormalizedPerSec = (velocityMps / gapM) * 2.0;

  let whiteY = prevState ? prevState.whiteParticleNormY : 0.8;
  let blackY = prevState ? prevState.blackParticleNormY : -0.8;

  whiteY += velocityNormalizedPerSec * dtSec;
  blackY -= velocityNormalizedPerSec * dtSec;

  whiteY = Math.max(-0.92, Math.min(0.92, whiteY));
  blackY = Math.max(-0.92, Math.min(0.92, blackY));

  const whiteWeight = (whiteY + 1.0) / 2.0;
  const blackWeight = (blackY + 1.0) / 2.0;
  const surfaceReflectance = Math.max(
    6.0,
    Math.min(75.0, 6.0 + whiteWeight * 69.0 - blackWeight * 30.0),
  );
  const contrast = `${(surfaceReflectance / 6.0).toFixed(1)}:1`;

  return {
    whiteParticleNormY: whiteY,
    blackParticleNormY: blackY,
    electricFieldVperUm,
    driftVelocityMms: Math.abs(velocityMps) * 1000,
    surfaceReflectancePercent: Number(surfaceReflectance.toFixed(1)),
    contrastRatio: contrast,
  };
}
