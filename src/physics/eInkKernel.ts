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
  /** Bounded illustrative response for the exhibit; not a patent-reported measurement. */
  surfaceReflectancePercent: number; // Pedagogical optical response [5% to 75%]
  contrastRatio: string;
  /** Stokes-Einstein thermal jitter ω. Leftover 2.3 / 1.7 at 2.0 cP; scales as 1/η. */
  brownianJitterOmegaYRadPerS: number;
  brownianJitterOmegaXRadPerS: number;
}

export function stepEInk(c: EInkControls, dtSec: number, prevState?: EInkState): EInkState {
  const voltage = Math.max(-15, Math.min(15, c.electrodeVoltageVolts ?? 15));
  const viscosityCp = Math.max(0.5, c.fluidViscosityCp ?? 2.0);
  const viscosity = viscosityCp * 1e-3;
  const chargeMult = Math.max(0.2, c.particleChargeCoupled ?? 1.0);
  const brownianJitterOmegaYRadPerS = Number(((2.0 / viscosityCp) * 2.3).toFixed(4));
  const brownianJitterOmegaXRadPerS = Number(((2.0 / viscosityCp) * 1.7).toFixed(4));

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
    brownianJitterOmegaYRadPerS,
    brownianJitterOmegaXRadPerS,
  };
}
