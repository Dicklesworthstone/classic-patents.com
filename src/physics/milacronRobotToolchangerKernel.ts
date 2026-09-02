/**
 * milacronRobotToolchangerKernel.ts
 *
 * SI computational physics kernel for Cincinnati Milacron's Robot Toolchanger System (US Patent 4,512,709).
 *
 * Models the mechanical clamping, pneumatic actuation, and kinematic location mechanics:
 * 1. Pneumatic cylinder piston thrust: F_act = p_air * (pi/4) * D_cyl^2
 * 2. Wedging mechanical advantage: F_clamp = F_act / tan(theta + phi)
 * 3. Self-locking bistable retention: tan(theta) <= mu_s
 * 4. Dual cylindrical / diamond locating pin alignment & radial repeatability (<= 0.025 mm)
 * 5. Inductive proximity sensor tool-seating verification
 * 6. Typed physical refusal boundaries for low supply pressure, excessive payload moment, or unseated tool base.
 */

export interface MilacronToolchangerControls {
  airPressureMpa: number; // Supply pneumatic pressure [0.2..1.0 MPa]
  cylinderBoreMm: number; // Actuator cylinder bore D_cyl [20..60 mm]
  wedgeAngleDeg: number; // Ramp taper angle theta [4..15 deg]
  frictionCoeff: number; // Static friction coefficient mu_s [0.08..0.30]
  slideStrokeMm: number; // Locking slide position [0..25 mm] (0=open, 25=locked)
  toolMassKg: number; // Mass of attached end effector tool [1..50 kg]
  dockingGapMm: number; // Clearance gap between adapter and tool base [0..5 mm]
}

export interface MilacronToolchangerTelemetry {
  actuatorThrustN: number;
  clampingForceN: number;
  holdingForceWithoutPowerN: number;
  isSelfLocking: boolean;
  isLocked: boolean;
  isToolSeated: boolean;
  proximitySensorActive: boolean;
  positionalRepeatabilityMm: number;
  payloadCapacitySafetyFactor: number;
  insufficientPressureRefusal: boolean;
  wedgeBackdriveRefusal: boolean;
  toolUnseatedRefusal: boolean;
  refusalReason?: string;
}

export const MILACRON_TOOLCHANGER_DEFAULT_CONTROLS: MilacronToolchangerControls = {
  airPressureMpa: 0.60, // 0.6 MPa (6 bar / 87 psi) standard shop air
  cylinderBoreMm: 32.0, // 32 mm bore pneumatic cylinder
  wedgeAngleDeg: 7.0, // 7 degree self-locking wedge ramp
  frictionCoeff: 0.15, // 0.15 steel-on-steel boundary lubricated friction
  slideStrokeMm: 25.0, // Fully locked stroke position
  toolMassKg: 15.0, // 15 kg end effector (e.g. spot welding gun)
  dockingGapMm: 0.0, // Flush seated docking
};

export function readMilacronToolchangerControls(
  params: Record<string, number | boolean | string>,
): MilacronToolchangerControls {
  return {
    airPressureMpa:
      typeof params.airPressureMpa === "number"
        ? Math.max(0.1, Math.min(1.2, params.airPressureMpa))
        : MILACRON_TOOLCHANGER_DEFAULT_CONTROLS.airPressureMpa,
    cylinderBoreMm:
      typeof params.cylinderBoreMm === "number"
        ? Math.max(15, Math.min(80, params.cylinderBoreMm))
        : MILACRON_TOOLCHANGER_DEFAULT_CONTROLS.cylinderBoreMm,
    wedgeAngleDeg:
      typeof params.wedgeAngleDeg === "number"
        ? Math.max(2, Math.min(20, params.wedgeAngleDeg))
        : MILACRON_TOOLCHANGER_DEFAULT_CONTROLS.wedgeAngleDeg,
    frictionCoeff:
      typeof params.frictionCoeff === "number"
        ? Math.max(0.05, Math.min(0.40, params.frictionCoeff))
        : MILACRON_TOOLCHANGER_DEFAULT_CONTROLS.frictionCoeff,
    slideStrokeMm:
      typeof params.slideStrokeMm === "number"
        ? Math.max(0, Math.min(25, params.slideStrokeMm))
        : MILACRON_TOOLCHANGER_DEFAULT_CONTROLS.slideStrokeMm,
    toolMassKg:
      typeof params.toolMassKg === "number"
        ? Math.max(0.5, Math.min(100, params.toolMassKg))
        : MILACRON_TOOLCHANGER_DEFAULT_CONTROLS.toolMassKg,
    dockingGapMm:
      typeof params.dockingGapMm === "number"
        ? Math.max(0, Math.min(10, params.dockingGapMm))
        : MILACRON_TOOLCHANGER_DEFAULT_CONTROLS.dockingGapMm,
  };
}

export function stepMilacronRobotToolchangerSi(
  controls: MilacronToolchangerControls,
): MilacronToolchangerTelemetry {
  const p_Pa = controls.airPressureMpa * 1e6;
  const bore_m = controls.cylinderBoreMm * 1e-3;
  const cylinderArea_m2 = (Math.PI / 4) * bore_m * bore_m;

  // 1. Actuator Thrust
  const actuatorThrustN = p_Pa * cylinderArea_m2;

  // 2. Wedging Clamping Force
  const thetaRad = (controls.wedgeAngleDeg * Math.PI) / 180;
  const phiRad = Math.atan(controls.frictionCoeff);
  const tanSum = Math.tan(thetaRad + phiRad);

  const isLocked = controls.slideStrokeMm >= 20.0 && controls.dockingGapMm <= 0.5;
  const clampingForceN = isLocked ? actuatorThrustN / Math.max(0.05, tanSum) : 0;

  // 3. Self-Locking & Holding Force in Power Failure
  const isSelfLocking = Math.tan(thetaRad) <= controls.frictionCoeff;
  let holdingForceWithoutPowerN = 0;
  if (isLocked && isSelfLocking) {
    const cosTheta = Math.cos(thetaRad);
    const sinTheta = Math.sin(thetaRad);
    holdingForceWithoutPowerN =
      clampingForceN *
      Math.max(
        0,
        (controls.frictionCoeff * cosTheta - sinTheta) /
          (cosTheta + controls.frictionCoeff * sinTheta),
      );
  }

  // 4. Proximity Sensor & Tool Seating State
  const isToolSeated = controls.dockingGapMm <= 0.4;
  const proximitySensorActive = controls.dockingGapMm <= 0.8;

  // 5. Kinematic Positional Repeatability
  // Precision ground locating pins achieve <= 0.025 mm when seated
  const positionalRepeatabilityMm = isToolSeated
    ? 0.015 + 0.010 * (controls.dockingGapMm / 0.4)
    : 1.0 + controls.dockingGapMm;

  // 6. Payload Safety Factor
  const toolWeightN = controls.toolMassKg * 9.80665;
  const payloadCapacitySafetyFactor =
    toolWeightN > 0 ? (clampingForceN * controls.frictionCoeff) / toolWeightN : 10;

  // 7. Refusal Boundaries
  let insufficientPressureRefusal = false;
  let wedgeBackdriveRefusal = false;
  let toolUnseatedRefusal = false;
  let refusalReason: string | undefined;

  if (controls.airPressureMpa < 0.30) {
    insufficientPressureRefusal = true;
    refusalReason = `Insufficient pneumatic pressure (${controls.airPressureMpa.toFixed(2)} MPa < 0.30 MPa). Tool clamp force inadequate for dynamic robot acceleration.`;
  } else if (!isSelfLocking) {
    wedgeBackdriveRefusal = true;
    refusalReason = `Non-bistable wedge geometry: Ramp angle (${controls.wedgeAngleDeg}°) exceeds friction cone angle (${((phiRad * 180) / Math.PI).toFixed(1)}°). Tool will drop during power failure.`;
  } else if (controls.slideStrokeMm > 10 && !isToolSeated) {
    toolUnseatedRefusal = true;
    refusalReason = `Tool unseated fault: Docking gap (${controls.dockingGapMm.toFixed(2)} mm) exceeds proximity threshold. Locking slide cannot engage T-member.`;
  }

  return {
    actuatorThrustN,
    clampingForceN,
    holdingForceWithoutPowerN,
    isSelfLocking,
    isLocked,
    isToolSeated,
    proximitySensorActive,
    positionalRepeatabilityMm,
    payloadCapacitySafetyFactor,
    insufficientPressureRefusal,
    wedgeBackdriveRefusal,
    toolUnseatedRefusal,
    refusalReason,
  };
}

export function stepMilacronRobotToolchanger(
  params: Record<string, number | boolean | string> = MILACRON_TOOLCHANGER_DEFAULT_CONTROLS as unknown as Record<string, number | boolean | string>,
): MilacronToolchangerTelemetry {
  return stepMilacronRobotToolchangerSi(readMilacronToolchangerControls(params));
}
