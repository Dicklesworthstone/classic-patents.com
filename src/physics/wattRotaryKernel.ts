/**
 * wattRotaryKernel.ts
 *
 * Physics kernel for James Watt's 1781 Rotary Motion & Sun-and-Planet Engine (GB 1306).
 * Computes one source-owned kinematic state for the beam, fixed-length connecting
 * rod, epicyclic gear pair, and flywheel. The display geometry is a normalized
 * engineering reconstruction: the surviving patent record does not supply a
 * dimensioned engine installation from which these lengths can be recovered.
 */

import type { TapeUpdater } from "./useFrankenSimPhysics";

export const WATT_ROTARY_KERNEL_SOURCE = "source-bounded-ts" as const;
export const WATT_ROTARY_FRANKENSIM_BOUNDARY =
  "fs-mbd::holonomic-gear-and-four-bar-constraints-unavailable" as const;
export const WATT_ROTARY_SOURCE_BOUNDARY =
  "The pinned artifact is a modern research reconstruction, not a primary 1781 Chancery facsimile. The shared kernel therefore owns only declared normalized linkage geometry, rigid planet-to-rod attachment, external-gear no-slip kinematics, and visitor-declared scenario inputs. Historical dimensions, pressure, force, power, efficiency, wear, and performance remain unavailable." as const;

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
  planetBodyAngleDeg: number; // Planet rocks with the rigidly attached connecting rod
  planetBodyAngleRad: number;
  planetAngularVelocityRadS: number;
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
  shaftRpm: number; // Instantaneous output driveshaft speed (RPM)
  meanShaftRpm: number; // Net revolutions per cycle expressed as mean RPM
  shaftAngularVelocityRadS: number; // Instantaneous driveshaft angular velocity (rad/s)
  meanShaftAngularVelocityRadS: number;
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

export interface WattRotaryRuntimeControls extends WattRotaryControls {
  isRunning: boolean;
  resetEpoch: number;
}

export interface WattRotaryTapeFrame {
  controls: WattRotaryRuntimeControls;
  timeSec: number;
  telemetry: WattRotaryTelemetry;
}

let latestWattRotaryTapeFrame: WattRotaryTapeFrame | null = null;

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

export function readWattRotaryRuntimeControls(
  raw: Partial<WattRotaryRuntimeControls> | Record<string, number | boolean | undefined>,
): WattRotaryRuntimeControls {
  const isRunning =
    typeof raw.isRunning === "boolean" ? raw.isRunning : Number(raw.isRunning ?? 1) > 0.5;
  return {
    ...readWattRotaryControls(raw as Partial<WattRotaryControls>),
    isRunning,
    resetEpoch: Number(raw.resetEpoch ?? 0),
  };
}

export function getWattRotaryTapeFrame(): WattRotaryTapeFrame | null {
  return latestWattRotaryTapeFrame;
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

  // The planet is not a freely spinning idler: it is rigidly part of the
  // connecting spear. A real finite-length spear rocks slightly as its upper
  // pin follows the beam arc, so the planet body must rock by that same angle.
  // Treating it as perfectly world-fixed is only the infinite-rod
  // approximation and produces an artificially uniform flywheel speed.
  const initialPlanetWorldX = geometry.sunCenterX;
  const initialPlanetWorldY = geometry.sunCenterY - rOrbit;
  const initialBeamAngleRad = solveBeamAngleRad(initialPlanetWorldX, initialPlanetWorldY);
  const initialRightBeamEndX =
    geometry.beamPivotX + geometry.beamHalfLengthM * Math.cos(initialBeamAngleRad);
  const initialRightBeamEndY =
    geometry.beamPivotY + geometry.beamHalfLengthM * Math.sin(initialBeamAngleRad);
  const initialConnectingRodAngleRad = Math.atan2(
    initialPlanetWorldX - initialRightBeamEndX,
    -(initialPlanetWorldY - initialRightBeamEndY),
  );
  const planetBodyAngleRad = connectingRodAngleRad - initialConnectingRodAngleRad;
  const planetBodyAngleDeg = (planetBodyAngleRad * 180) / Math.PI;

  const rightBeamVelocityX =
    -geometry.beamHalfLengthM * Math.sin(beamAngleRad) * beamAngularVelocity;
  const rightBeamVelocityY =
    geometry.beamHalfLengthM * Math.cos(beamAngleRad) * beamAngularVelocity;
  const rodVelocityX = planetVelocityX - rightBeamVelocityX;
  const rodVelocityY = planetVelocityY - rightBeamVelocityY;
  const planetAngularVelocityRadS =
    (-rodDy * rodVelocityX + rodDx * rodVelocityY) /
    (geometry.connectingRodLengthM * geometry.connectingRodLengthM);

  // External-gear pitch contact requires equal material-point velocity:
  // Ns(theta_s-theta_c) + Np(theta_p-theta_c) = 0. Because theta_p is the
  // rod's small rocking angle rather than zero, the shaft makes the same net
  // 1 + Np/Ns turns per cycle but speeds up and slows down within that cycle.
  const sunShaftAngleRad = speedMultiplier * carrierAngleRad - ratio * planetBodyAngleRad;
  const sunShaftAngleDeg = positiveModulo((sunShaftAngleRad * 180) / Math.PI, 360);
  const meanShaftRpm = spm * speedMultiplier;
  const meanShaftAngularVelocityRadS = (meanShaftRpm * 2 * Math.PI) / 60;
  const shaftAngularVelocityRadS = speedMultiplier * omegaCycle - ratio * planetAngularVelocityRadS;
  const shaftRpm = (shaftAngularVelocityRadS * 60) / (2 * Math.PI);
  const gearMeshConstraintResidualRad =
    sunTeeth * (sunShaftAngleRad - carrierAngleRad) +
    planetTeeth * (planetBodyAngleRad - carrierAngleRad);

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
  const meanPowerKw = (meanTorqueNm * meanShaftAngularVelocityRadS) / 1000;
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
    planetBodyAngleDeg,
    planetBodyAngleRad,
    planetAngularVelocityRadS,
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
    meanShaftRpm,
    shaftAngularVelocityRadS,
    meanShaftAngularVelocityRadS,
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

/**
 * One route-level owner for both the SVG and Three.js faces. The mechanism is
 * integrated at the transport bus's fixed step, while React receives a lower
 * frequency snapshot so the large SVG tree is not reconciled every frame.
 */
export function createWattRotaryTransportUpdater(
  readControls: () => WattRotaryRuntimeControls,
): TapeUpdater {
  let timeSec = 0;
  let lastResetEpoch: number | null = null;
  let ticksSincePublish = 4;

  return (_previous, dt) => {
    const controls = readControls();
    if (lastResetEpoch !== null && controls.resetEpoch !== lastResetEpoch) {
      timeSec = 0;
    }
    lastResetEpoch = controls.resetEpoch;
    if (controls.isRunning) timeSec += dt;

    const telemetry = stepWattRotaryEngine(controls, timeSec);
    latestWattRotaryTapeFrame = { controls, timeSec, telemetry };

    ticksSincePublish += 1;
    if (ticksSincePublish < 5) return null;
    ticksSincePublish = 0;
    return {
      machine: {
        poseXMeters: telemetry.planetPosX,
        poseYMeters: telemetry.planetPosY,
        headingRad: telemetry.sunShaftAngleRad,
        modeLabel: controls.isRunning ? "sun-and-planet running" : "sun-and-planet held",
        wheelSpeedMps: telemetry.pistonVelocityMps,
      },
    };
  };
}
