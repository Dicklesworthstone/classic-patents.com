/**
 * wattRotaryKernel.ts
 *
 * Physics kernel for James Watt's 1781 Rotary Motion & Sun-and-Planet Engine (GB 1306).
 * Computes exact SI kinematics, epicyclic 2:1 gear multiplication, connecting rod
 * constraint, tangential tooth load, flywheel kinetic storage, and indicated shaft power.
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
  beamAngleDeg: number; // Beam angular deflection (-18 to +18 deg)
  pistonPositionM: number; // Piston travel (0 to strokeLengthM)
  pistonVelocityMps: number; // Piston instantaneous velocity (m/s)
  planetOrbitAngleDeg: number; // Planet center orbital angle (0 - 360 deg)
  planetPosX: number; // Planet center X coordinate (m)
  planetPosY: number; // Planet center Y coordinate (m)
  sunShaftAngleDeg: number; // Flywheel shaft angle (0 - 720 deg per cycle)
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
  const ratio = Math.max(0.5, Math.min(2.0, controls.gearRatioNpOverNs));
  const mFlywheel = Math.max(500, Math.min(10000, controls.flywheelMassKg));
  const bore = controls.cylinderBoreM ?? 0.76;
  const stroke = controls.strokeLengthM ?? 1.8;

  // Geometry
  const rSun = 0.45; // Sun pitch radius (m)
  const rPlanet = rSun * ratio; // Planet pitch radius (m)
  const rOrbit = rSun + rPlanet; // Orbit center distance (m)
  const rFlywheel = 2.4; // Flywheel outer rim radius (m)
  const iFlywheel = 0.5 * mFlywheel * (rFlywheel * rFlywheel); // Moment of inertia (kg*m^2)

  // Cycle Frequency
  const fCycle = spm / 60; // Hz (engine cycles per sec)
  const omegaCycle = 2 * Math.PI * fCycle; // rad/s
  const speedMultiplier = 1 + ratio; // 2.0 for equal gears

  // Angles & Motion
  const orbitPhase = (timeSec * omegaCycle) % (2 * Math.PI);
  const planetOrbitAngleDeg = ((orbitPhase * 180) / Math.PI) % 360;

  // Beam Kinematics (driven by planet orbit at beam right arm length 2.2 m)
  const sinBeta = Math.max(-1, Math.min(1, -(rOrbit / 2.2) * Math.cos(orbitPhase)));
  const beamAngleRad = Math.asin(sinBeta);
  const beamAngleDeg = (beamAngleRad * 180) / Math.PI;

  const rightBeamEndX = 2.2 * Math.cos(beamAngleRad);
  const rightBeamEndY = 3.2 + 2.2 * Math.sin(beamAngleRad);
  const planetPosX = rOrbit * Math.sin(orbitPhase);
  const planetPosY = -rOrbit * Math.cos(orbitPhase);

  const rodDx = 2.2 + planetPosX - rightBeamEndX;
  const rodDy = rightBeamEndY - (0.9 + planetPosY);
  const rodAngle = Math.atan2(rodDx, rodDy);

  // Shaft Rotational Speed (exact 2:1 epicyclic multiplication with rod sway conjugate)
  const shaftRpm = spm * speedMultiplier;
  const shaftAngularVelocityRadS = (shaftRpm * 2 * Math.PI) / 60;
  const sunShaftAngleRad = speedMultiplier * orbitPhase - ratio * rodAngle;
  const sunShaftAngleDeg = ((((sunShaftAngleRad * 180) / Math.PI) % 360) + 360) % 360;

  // Piston Kinematics (left beam end)
  const pistonPositionM = (stroke / 2) * (1 + Math.cos(orbitPhase));
  const pistonVelocityMps = -(stroke / 2) * omegaCycle * Math.sin(orbitPhase);

  // Forces
  const pistonArea = (Math.PI * bore * bore) / 4;
  const pistonForceN = pEff * pistonArea; // Max single-acting steam force ~31.7 kN
  const _rodAngle = Math.asin(planetPosX / 3.2); // Connecting rod sway angle
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
    pistonPositionM,
    pistonVelocityMps,
    planetOrbitAngleDeg,
    planetPosX,
    planetPosY,
    sunShaftAngleDeg,
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
