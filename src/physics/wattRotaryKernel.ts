/**
 * wattRotaryKernel.ts
 *
 * Physics kernel for James Watt's 1781 Rotary Motion & Sun-and-Planet Engine (GB 1306).
 * Computes one source-owned kinematic state for the beam, fixed-length connecting
 * rod, epicyclic gear pair, and flywheel. The display geometry is a normalized
 * engineering reconstruction: the surviving patent record does not supply a
 * dimensioned engine installation from which these lengths can be recovered.
 */

export interface WattRotaryControls {
  strokeRateSpm: number; // Engine beam cycles per minute (double-strokes/min, 10 - 30)
  boilerPressureKpa: number; // Effective steam pressure above condensation (40 - 120 kPa)
  gearRatioNpOverNs: number; // Ratio of Planet to Sun teeth (1.0 = equal gears -> 2:1 speed)
  flywheelMassKg: number; // Flywheel mass (1000 - 6000 kg)
  cylinderBoreM?: number; // Cylinder diameter (default 0.76 m / 30 inches)
  strokeLengthM?: number; // Piston stroke length (default 1.8 m / 6 feet)
}

export interface WattRotaryTelemetry {
  // Kinematics & Speeds
  beamAngleDeg: number; // Beam angular deflection from fixed-link closure
  beamAngleRad: number;
  pistonPositionM: number; // Piston travel (0 to strokeLengthM)
  pistonVelocityMps: number; // Piston instantaneous velocity (m/s)
  planetOrbitAngleDeg: number; // Planet center orbital angle (0 - 360 deg)
  planetOrbitAngleRad: number;
  planetBodyAngleDeg: number; // Planet is restrained from completing an axial revolution
  planetBodyAngleRad: number;
  planetPosX: number; // Planet center X coordinate (m)
  planetPosY: number; // Planet center Y coordinate (m)
  sunShaftAngleDeg: number; // Wrapped flywheel shaft angle (0 - 360 deg)
  sunShaftAngleRad: number;
  connectingRodAngleDeg: number;
  connectingRodAngleRad: number;
  rightBeamEndX: number;
  rightBeamEndY: number;
  leftBeamEndX: number;
  leftBeamEndY: number;
  sunPitchRadiusM: number;
  planetPitchRadiusM: number;
  gearCenterDistanceM: number;
  connectingRodLengthM: number;
  connectingRodConstraintResidualM: number;
  gearMeshConstraintResidualRad: number;
  sunTeeth: number;
  planetTeeth: number;
  gearRatioNpOverNs: number;
  shaftRpm: number; // Output driveshaft speed (RPM)
  shaftAngularVelocityRadS: number; // Driveshaft angular velocity (rad/s)
  cycleOmegaRadPerS: number; // Beam / planet-orbit angular velocity (rad/s)
  speedMultiplier: number; // 1 + Np/Ns (2.0 for equal gears)

  // Forces & Mechanics
  pistonForceN: number; // Piston driving force (N)
  connectingRodForceN: number; // Force through connecting spear (N)
  tangentialToothForceN: number; // Pitch line tooth contact force (N)
  instantaneousTorqueNm: number; // Output shaft torque (N*m)
  meanTorqueNm: number; // Cycle-averaged torque (N*m)

  // Energy & Power
  indicatedPowerKw: number; // Instantaneous indicated power (kW)
  meanPowerKw: number; // Cycle-averaged shaft power (kW)
  brakeHorsepower: number; // Imperial horse-power (hp)
  flywheelKineticEnergyJ: number; // Kinetic energy in flywheel (J)
  speedFluctuationCoeff: number; // Flywheel speed fluctuation coefficient delta
}

/**
 * Normalized presentation geometry shared by the SI kernel and both visual
 * faces. It establishes topology and closure constraints; it is not asserted
 * to be a measurement of a particular surviving Watt engine.
 */
export const WATT_ROTARY_KINEMATIC_GEOMETRY = Object.freeze({
  beamPivotX: 0,
  beamPivotY: 3.2,
  beamHalfLengthM: 2.2,
  sunCenterX: 2.2,
  sunCenterY: 0.9,
  gearCenterDistanceM: 0.9,
  connectingRodLengthM: 2.4,
  nominalSunTeeth: 20,
  ratioMin: 0.5,
  ratioMax: 2,
  ratioStep: 0.25,
});

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function canonicalWattGearRatio(value: number): number {
  const geometry = WATT_ROTARY_KINEMATIC_GEOMETRY;
  const finiteValue = Number.isFinite(value) ? value : 1;
  const clamped = clamp(finiteValue, geometry.ratioMin, geometry.ratioMax);
  return Number((Math.round(clamped / geometry.ratioStep) * geometry.ratioStep).toFixed(2));
}

function positiveModulo(value: number, modulus: number): number {
  return ((value % modulus) + modulus) % modulus;
}

function solveBeamAngleRad(planetX: number, planetY: number): number {
  const geometry = WATT_ROTARY_KINEMATIC_GEOMETRY;
  const qx = planetX - geometry.beamPivotX;
  const qy = planetY - geometry.beamPivotY;
  const qLength = Math.hypot(qx, qy);
  const numerator =
    qLength * qLength +
    geometry.beamHalfLengthM * geometry.beamHalfLengthM -
    geometry.connectingRodLengthM * geometry.connectingRodLengthM;
  const denominator = 2 * geometry.beamHalfLengthM * qLength;
  const closureCosine = clamp(numerator / denominator, -1, 1);

  // The upper/right assembly branch keeps the beam continuous for one full
  // carrier revolution. The other mathematical branch crosses the pillar.
  return Math.atan2(qy, qx) + Math.acos(closureCosine);
}

export function readWattRotaryControls(
  raw: Partial<WattRotaryControls> | Record<string, number | undefined>,
): WattRotaryControls {
  return {
    strokeRateSpm: Number(raw.strokeRateSpm ?? 20),
    boilerPressureKpa: Number(raw.boilerPressureKpa ?? 70),
    gearRatioNpOverNs: Number(raw.gearRatioNpOverNs ?? 1.0),
    flywheelMassKg: Number(raw.flywheelMassKg ?? 3500),
    cylinderBoreM: Number(raw.cylinderBoreM ?? 0.76),
    strokeLengthM: Number(raw.strokeLengthM ?? 1.8),
  };
}

export function stepWattRotaryEngine(
  controls: WattRotaryControls,
  timeSec = 0,
): WattRotaryTelemetry {
  const spm = Math.max(5, Math.min(40, controls.strokeRateSpm));
  const pEff = Math.max(20e3, Math.min(200e3, controls.boilerPressureKpa * 1e3));
  const ratio = canonicalWattGearRatio(controls.gearRatioNpOverNs);
  const mFlywheel = Math.max(500, Math.min(10000, controls.flywheelMassKg));
  const bore = controls.cylinderBoreM ?? 0.76;
  const stroke = controls.strokeLengthM ?? 1.8;

  // Geometry. The carrier radius remains fixed when the visitor changes the
  // tooth ratio; the paired pitch radii and tooth module change together.
  // This is a physically buildable replacement gear set and does not silently
  // alter the walking-beam stroke or stretch the connecting rod.
  const geometry = WATT_ROTARY_KINEMATIC_GEOMETRY;
  const rOrbit = geometry.gearCenterDistanceM;
  const rSun = rOrbit / (1 + ratio);
  const rPlanet = rOrbit - rSun;
  const sunTeeth = geometry.nominalSunTeeth;
  const planetTeeth = Math.round(sunTeeth * ratio);
  const rFlywheel = 2.4; // Flywheel outer rim radius (m)
  const iFlywheel = 0.5 * mFlywheel * (rFlywheel * rFlywheel); // Moment of inertia (kg*m^2)

  // Cycle Frequency
  const fCycle = spm / 60; // Hz (engine cycles per sec)
  const omegaCycle = 2 * Math.PI * fCycle; // rad/s
  const speedMultiplier = 1 + ratio; // 2.0 for equal gears

  // Angles & Motion
  const carrierAngleRad = timeSec * omegaCycle;
  const orbitPhase = positiveModulo(carrierAngleRad, 2 * Math.PI);
  const planetOrbitAngleDeg = ((orbitPhase * 180) / Math.PI) % 360;

  // Planet centre and exact four-bar closure. Unlike the former sinusoidal
  // approximation, this solves a fixed-length connecting rod against the
  // walking-beam endpoint on every step.
  const planetPosX = rOrbit * Math.sin(orbitPhase);
  const planetPosY = -rOrbit * Math.cos(orbitPhase);
  const planetWorldX = geometry.sunCenterX + planetPosX;
  const planetWorldY = geometry.sunCenterY + planetPosY;
  const beamAngleRad = solveBeamAngleRad(planetWorldX, planetWorldY);
  const beamAngleDeg = (beamAngleRad * 180) / Math.PI;

  const rightBeamEndX = geometry.beamPivotX + geometry.beamHalfLengthM * Math.cos(beamAngleRad);
  const rightBeamEndY = geometry.beamPivotY + geometry.beamHalfLengthM * Math.sin(beamAngleRad);
  const leftBeamEndX = geometry.beamPivotX - geometry.beamHalfLengthM * Math.cos(beamAngleRad);
  const leftBeamEndY = geometry.beamPivotY - geometry.beamHalfLengthM * Math.sin(beamAngleRad);
  const rodDx = planetWorldX - rightBeamEndX;
  const rodDy = planetWorldY - rightBeamEndY;
  const connectingRodLength = Math.hypot(rodDx, rodDy);
  const connectingRodAngleRad = Math.atan2(rodDx, -rodDy);

  // Watt's planet is restrained from making a full revolution on its own
  // axis. Willis' external epicyclic relation therefore gives
  // Ns(omega_s-omega_c)+Np(omega_p-omega_c)=0 with omega_p=0.
  const planetBodyAngleRad = 0;
  const shaftRpm = spm * speedMultiplier;
  const shaftAngularVelocityRadS = (shaftRpm * 2 * Math.PI) / 60;
  const sunShaftAngleRad = speedMultiplier * carrierAngleRad;
  const sunShaftAngleDeg = positiveModulo((sunShaftAngleRad * 180) / Math.PI, 360);
  const gearMeshConstraintResidualRad =
    sunTeeth * (sunShaftAngleRad - carrierAngleRad) +
    planetTeeth * (planetBodyAngleRad - carrierAngleRad);

  // The piston follows the left beam end. Differentiate the four-bar closure
  // analytically so velocity and rendered position remain the same mechanism.
  const pistonBottomReferenceY = geometry.beamHalfLengthM;
  const pistonPositionM = clamp(leftBeamEndY - pistonBottomReferenceY, 0, stroke);
  const planetVelocityX = rOrbit * omegaCycle * Math.cos(orbitPhase);
  const planetVelocityY = rOrbit * omegaCycle * Math.sin(orbitPhase);
  const rodUnitPerpX = -Math.sin(beamAngleRad);
  const rodUnitPerpY = Math.cos(beamAngleRad);
  const closureDenominator =
    geometry.beamHalfLengthM * (rodDx * rodUnitPerpX + rodDy * rodUnitPerpY);
  const beamAngularVelocity =
    Math.abs(closureDenominator) > 1e-9
      ? (rodDx * planetVelocityX + rodDy * planetVelocityY) / closureDenominator
      : 0;
  const pistonVelocityMps =
    -geometry.beamHalfLengthM * Math.cos(beamAngleRad) * beamAngularVelocity;

  // Forces
  const pistonArea = (Math.PI * bore * bore) / 4;
  const pistonForceN = pEff * pistonArea; // Max single-acting steam force ~31.7 kN
  const connectingRodForceN = Math.abs(pistonForceN * Math.cos(beamAngleRad));

  // Epicyclic Tangential Tooth Force & Torque
  // At orbit angle theta, tangential drive force on sun teeth:
  const sinTheta = Math.sin(orbitPhase);
  const tangentialToothForceN = Math.abs((connectingRodForceN * sinTheta) / speedMultiplier);
  const instantaneousTorqueNm = tangentialToothForceN * rSun;
  const meanTorqueNm = (pistonForceN * stroke) / (2 * Math.PI * speedMultiplier);

  // Energy & Power
  const indicatedPowerKw = (instantaneousTorqueNm * shaftAngularVelocityRadS) / 1000;
  const meanPowerKw = (meanTorqueNm * shaftAngularVelocityRadS) / 1000;
  const brakeHorsepower = meanPowerKw * 1.34102; // hp

  const flywheelKineticEnergyJ =
    0.5 * iFlywheel * shaftAngularVelocityRadS * shaftAngularVelocityRadS;
  const strokeEnergyJ = 0.5 * pistonForceN * stroke;
  const speedFluctuationCoeff =
    strokeEnergyJ / (iFlywheel * shaftAngularVelocityRadS * shaftAngularVelocityRadS + 1e-3);

  return {
    beamAngleDeg,
    beamAngleRad,
    pistonPositionM,
    pistonVelocityMps,
    planetOrbitAngleDeg,
    planetOrbitAngleRad: carrierAngleRad,
    planetBodyAngleDeg: 0,
    planetBodyAngleRad,
    planetPosX,
    planetPosY,
    sunShaftAngleDeg,
    sunShaftAngleRad,
    connectingRodAngleDeg: (connectingRodAngleRad * 180) / Math.PI,
    connectingRodAngleRad,
    rightBeamEndX,
    rightBeamEndY,
    leftBeamEndX,
    leftBeamEndY,
    sunPitchRadiusM: rSun,
    planetPitchRadiusM: rPlanet,
    gearCenterDistanceM: rOrbit,
    connectingRodLengthM: geometry.connectingRodLengthM,
    connectingRodConstraintResidualM: connectingRodLength - geometry.connectingRodLengthM,
    gearMeshConstraintResidualRad,
    sunTeeth,
    planetTeeth,
    gearRatioNpOverNs: ratio,
    shaftRpm,
    shaftAngularVelocityRadS,
    cycleOmegaRadPerS: omegaCycle,
    speedMultiplier,
    pistonForceN,
    connectingRodForceN,
    tangentialToothForceN,
    instantaneousTorqueNm,
    meanTorqueNm,
    indicatedPowerKw,
    meanPowerKw,
    brakeHorsepower,
    flywheelKineticEnergyJ,
    speedFluctuationCoeff,
  };
}
