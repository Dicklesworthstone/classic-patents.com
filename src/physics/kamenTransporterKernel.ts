import type { TapeUpdater } from "./useFrankenSimPhysics";

/**
 * Source-bound topology reader for US 5,701,965 — Human Transporter.
 *
 * The checked grant establishes a motorized drive/control-loop relationship,
 * independently controlled cluster wheels, nominal Table 1 wheel/carrier/stair
 * geometry, and the ordering of balance, transfer, climb, and transition
 * modes. It does not provide the mass/inertia, contact, motor, sensor, or
 * controller constants needed for quantitative dynamics.
 */

export const KAMEN_TRANSPORTER_TOPOLOGY_STATES = [
  "ground_support",
  "balance",
  "stair_start",
  "weight_transfer",
  "climb",
  "transition",
] as const;

export type KamenTransporterTopologyState = (typeof KAMEN_TRANSPORTER_TOPOLOGY_STATES)[number];

export const KAMEN_TRANSPORTER_TOPOLOGY_LABELS: Readonly<
  Record<KamenTransporterTopologyState, string>
> = {
  ground_support: "Ground-support cluster",
  balance: "Fore-aft balance mode",
  stair_start: "Stair start: next pair placed",
  weight_transfer: "Weight-transfer state",
  climb: "Climb: balance and next-pair placement",
  transition: "Transition gate before balance",
};

const INCH_M = 0.0254;

/**
 * Nominal implemented geometry printed in US 5,701,965 Table 1 (PDF p. 42,
 * patent columns 11–12). These are source values, not inferred Segway data.
 */
export const KAMEN_TRANSPORTER_SOURCE_GEOMETRY_M = Object.freeze({
  systemCentreOffsetM: 21.0 * INCH_M,
  clusterRadiusM: 5.581 * INCH_M,
  adjacentWheelCentreDistanceM: 9.667 * INCH_M,
  stairTreadM: 10.9 * INCH_M,
  stairRiseM: 6.85 * INCH_M,
  riserToLowerContactM: 3.011 * INCH_M,
  wheelRadiusM: 3.81 * INCH_M,
});

export const KAMEN_TRANSPORTER_SOURCE_CONTROL_CYCLE_HZ = Object.freeze({
  minimum: 200,
  maximum: 400,
});

export const KAMEN_TRANSPORTER_GEOMETRY_RECEIPT =
  "US 5,701,965 Table 1 and Figures 38–42: three equal wheels per lateral cluster, nominal wheel/cluster/stair dimensions, and source-ordered support poses.";

export const KAMEN_TRANSPORTER_GENERIC_OWNER =
  "fs-mbd::tri_wheel_cluster::step_tri_wheel_stair_contact";

export const KAMEN_TRANSPORTER_CONTACT_BOUNDARY =
  "Rigid planar three-equal-wheel kinematics with horizontal ground/tread gap checks; no force, friction, tire compliance, impact, motor, controller, sensor, or riser-side contact result.";

export type KamenTransporterWheelId = "a" | "b" | "c" | "direct";

export interface KamenTransporterWheelContact {
  id: KamenTransporterWheelId;
  centerXM: number;
  centerYM: number;
  supportHeightM: number;
  signedVerticalGapM: number;
  touching: boolean;
}

export interface KamenTransporterDisplayPose {
  /** Source-dimensioned carrier-axis coordinate in the side-elevation frame [m]. */
  axleXM: number;
  /** Source-dimensioned carrier-axis height above level ground [m]. */
  axleYM: number;
  /** Three.js/SVG counter-clockwise carrier rotation [rad]. */
  carrierRotationRad: number;
  /** Post/chassis pitch from vertical, positive counter-clockwise [rad]. */
  chassisPitchRad: number;
  stairActive: boolean;
  sourceFigure: string;
  wheelContacts: readonly KamenTransporterWheelContact[];
  contactWheelIds: readonly KamenTransporterWheelId[];
  contactCount: number;
  minimumGapM: number;
}

export interface KamenTransporterControls {
  /** Reader-selected claim topology state, not a timed or dimensional input. */
  topologyState: KamenTransporterTopologyState;
  /** Claim 1 comparison probe: false withdraws the balance-loop relation. */
  balanceTopologyEnabled: boolean;
  /** Claim 16 comparison probe: false withdraws the paired cluster topology. */
  clusterTopologyEnabled: boolean;
  /**
   * Legacy modern-scenario controls retained for migration compatibility only.
   * The public US 5,701,965 route must use topologyState, never these values.
   */
  riderPitchLeanDeg: number;
  velocityCommandMs: number;
  yawSteering: number;
  operatingMode: "balance_2wheel" | "standard_4wheel" | "stair_climb" | "lean_mode";
  stairStepHeightM: number;
  riderMassKg: number;
}

export interface KamenTransporterTelemetry {
  topologyState: KamenTransporterTopologyState;
  stateLabel: string;
  /** Claim 22 / Claim 26 balance relationship is represented, not measured. */
  balanceLoopActive: boolean;
  /** Claims 16–21 paired cluster-wheel topology is represented. */
  clusterTopologyActive: boolean;
  stairSequenceActive: boolean;
  wheelControlMode:
    | "independent-ground-wheel-control"
    | "balance-mode"
    | "cluster-positioning"
    | "weight-transfer-position-hold"
    | "balance-and-cluster-coordination"
    | "transition-gate"
    | "topology-withheld";
  /** Source-dimensioned carrier pose derived from Table 1 and Figures 39–42 [rad]. */
  clusterDisplayPoseRad: number;
  /** Source-dimensioned, contact-checked pose shared by the 2D and 3D faces. */
  displayPose: KamenTransporterDisplayPose;
  sourceGeometryReceipt: string;
  genericOwner: string;
  contactBoundary: string;
  sourceClaimNumbers: readonly number[];
  sourceBoundary: string;
  /** Legacy modern-scenario fields. Never present them as grant values. */
  pitchAngleRad: number;
  pitchAngleDeg: number;
  pitchRateRadS: number;
  forwardVelocityMs: number;
  forwardAccelerationMs2: number;
  balanceTorqueNm: number;
  leftWheelTorqueNm: number;
  rightWheelTorqueNm: number;
  clusterAngleDeg: number;
  centerOfGravityHeightM: number;
  groundTractionForceN: number;
  naturalFrequencyRadS: number;
  stabilityMargin: number;
  gyroSensorRateRadS: number;
  accelForeAftMs2: number;
  isBalancing: boolean;
  isClimbing: boolean;
  pitchRefusal: boolean;
  refusalReason?: string;
}

/**
 * Render state owned by the fixed-step transport tape. The fields retain the
 * shared machine-tape shape, but no wheel speed or travel quantity is inferred
 * from the patent: both remain display-neutral at zero.
 */
export interface KamenTransporterMotionState {
  controls: KamenTransporterControls;
  telemetry: KamenTransporterTelemetry;
  wheelRollAngleRad: number;
  travelMeters: number;
}

export type KamenTransporterTelemetryStepper = (
  controls: KamenTransporterControls,
) => KamenTransporterTelemetry;

export const KAMEN_TRANSPORTER_DEFAULT_CONTROLS: KamenTransporterControls = {
  topologyState: "balance",
  balanceTopologyEnabled: true,
  clusterTopologyEnabled: true,
  riderPitchLeanDeg: 0,
  velocityCommandMs: 0,
  yawSteering: 0,
  operatingMode: "balance_2wheel",
  stairStepHeightM: 0.18,
  riderMassKg: 75,
};

export const KAMEN_TRANSPORTER_DEFAULT_TOPOLOGY_STATE_INDEX = 1;

export const KAMEN_TOPOLOGY_SOURCE_BOUNDARY =
  "US 5,701,965 prints nominal wheel, cluster, stair, centre-offset, pose, and 200–400 Hz control-cycle data, but not vehicle mass/inertia, motor curves, controller gains, sensor calibration, tire/contact parameters, or a quantitative stability margin.";

// Legacy modern-scenario constants are preserved below so older saved local
// sessions still deserialize. They are intentionally quarantined from the
// public source-bound topology path.
const TRANSPORTER_UNLADEN_MASS_KG = 65.0;
const GRAVITY_M_S2 = 9.80665;
export const KAMEN_TRANSPORTER_SCENARIO_WHEEL_RADIUS_M = 0.15;
const MAX_MOTOR_TORQUE_NM = 120.0;
const MAX_SAFE_PITCH_RAD = 0.436;
const K_PITCH_KP = 240.0;
const K_PITCH_KD = 42.0;
const K_VEL_KV = 35.0;

/**
 * Legacy modern illustrative calculation. It is preserved for migration only
 * and is not evidence of a US 5,701,965 operating value. Public exhibits must
 * use stepKamenTransporterTopology instead.
 */
export function stepKamenTransporterSi(
  controls: KamenTransporterControls,
  _dt: number = 1 / 60,
): KamenTransporterTelemetry {
  const riderMass = Math.max(40, Math.min(130, controls.riderMassKg));
  const totalMassKg = TRANSPORTER_UNLADEN_MASS_KG + riderMass;

  // Center of mass height based on mode
  let cgHeightM = 0.85;
  let clusterAngleDeg = 0;
  let isBalancing = false;
  let isClimbing = false;

  if (controls.operatingMode === "standard_4wheel") {
    cgHeightM = 0.48;
    clusterAngleDeg = 0;
    isBalancing = false;
  } else if (controls.operatingMode === "balance_2wheel") {
    cgHeightM = 0.92;
    clusterAngleDeg = 90; // Elevated on lower wheel pair
    isBalancing = true;
  } else if (controls.operatingMode === "stair_climb") {
    cgHeightM = 0.75;
    clusterAngleDeg = (Math.abs(controls.velocityCommandMs) * 120) % 360;
    isBalancing = true;
    isClimbing = true;
  } else {
    // Lean mode
    cgHeightM = 0.82;
    clusterAngleDeg = controls.riderPitchLeanDeg * 4.0;
    isBalancing = true;
  }

  // Inverted pendulum natural frequency: omega_n = sqrt(g / h)
  const naturalFrequencyRadS = Math.sqrt(GRAVITY_M_S2 / cgHeightM);

  // Inverted pendulum dynamics
  const riderLeanRad = (controls.riderPitchLeanDeg * Math.PI) / 180;
  const pitchAngleRad = riderLeanRad * (isBalancing ? 0.85 : 0.2);
  const pitchAngleDeg = (pitchAngleRad * 180) / Math.PI;
  const pitchRateRadS = isBalancing ? controls.velocityCommandMs * 0.4 : 0;

  // Sensor signals (Gyroscopic rate and Accelerometer tilt projection)
  const gyroSensorRateRadS = pitchRateRadS;
  const accelForeAftMs2 = GRAVITY_M_S2 * Math.sin(pitchAngleRad) + controls.velocityCommandMs * 0.5;

  // Safety Refusal check
  const pitchRefusal = Math.abs(pitchAngleRad) > MAX_SAFE_PITCH_RAD;

  // Balancing Torque calculation: tau = Kp * theta + Kd * dtheta/dt + Kv * (v_cmd - v)
  let balanceTorqueNm = 0;
  let forwardVelocityMs = 0;
  let forwardAccelerationMs2 = 0;
  let groundTractionForceN = 0;

  if (isBalancing && !pitchRefusal) {
    const gravTorque = totalMassKg * GRAVITY_M_S2 * cgHeightM * Math.sin(pitchAngleRad);
    const restorativeTorque = K_PITCH_KP * pitchAngleRad + K_PITCH_KD * pitchRateRadS;
    const velocityTorque = K_VEL_KV * controls.velocityCommandMs;

    balanceTorqueNm = Math.max(
      -MAX_MOTOR_TORQUE_NM,
      Math.min(MAX_MOTOR_TORQUE_NM, gravTorque + restorativeTorque + velocityTorque),
    );

    forwardAccelerationMs2 =
      balanceTorqueNm / (totalMassKg * KAMEN_TRANSPORTER_SCENARIO_WHEEL_RADIUS_M);
    forwardVelocityMs =
      controls.velocityCommandMs + pitchAngleRad * naturalFrequencyRadS * cgHeightM;
    groundTractionForceN = balanceTorqueNm / KAMEN_TRANSPORTER_SCENARIO_WHEEL_RADIUS_M;
  } else if (!pitchRefusal) {
    // 4-wheel mode: direct drive
    forwardVelocityMs = controls.velocityCommandMs;
    forwardAccelerationMs2 = 0;
    groundTractionForceN = totalMassKg * 0.1 * forwardVelocityMs;
    balanceTorqueNm = groundTractionForceN * KAMEN_TRANSPORTER_SCENARIO_WHEEL_RADIUS_M;
  }

  // Differential drive for yaw turning
  const yawOffsetTorque = controls.yawSteering * MAX_MOTOR_TORQUE_NM * 0.35;
  const leftWheelTorqueNm = balanceTorqueNm * 0.5 + yawOffsetTorque;
  const rightWheelTorqueNm = balanceTorqueNm * 0.5 - yawOffsetTorque;

  // Dynamic stability margin (1.0 = optimal balance, 0.0 = at refusal limit)
  const stabilityMargin = pitchRefusal
    ? 0.0
    : Math.max(0.0, 1.0 - Math.abs(pitchAngleRad) / MAX_SAFE_PITCH_RAD);

  const topology = stepKamenTransporterTopology(controls);

  return {
    ...topology,
    pitchAngleRad,
    pitchAngleDeg,
    pitchRateRadS,
    forwardVelocityMs,
    forwardAccelerationMs2,
    balanceTorqueNm,
    leftWheelTorqueNm,
    rightWheelTorqueNm,
    clusterAngleDeg,
    centerOfGravityHeightM: cgHeightM,
    groundTractionForceN,
    naturalFrequencyRadS,
    stabilityMargin,
    gyroSensorRateRadS,
    accelForeAftMs2,
    isBalancing,
    isClimbing,
    pitchRefusal,
    refusalReason: pitchRefusal
      ? `Pitch angle (${pitchAngleDeg.toFixed(1)}°) exceeds maximum dynamic recovery limit (25.0°)`
      : undefined,
  };
}

export function readKamenTransporterControls(
  params: Record<string, number | boolean | string>,
): KamenTransporterControls {
  const modeVal = String(params.operatingMode ?? "balance_2wheel");
  const operatingMode: KamenTransporterControls["operatingMode"] =
    modeVal === "standard_4wheel" || modeVal === "stair_climb" || modeVal === "lean_mode"
      ? modeVal
      : "balance_2wheel";
  const topologyState = topologyStateFromParams(params, operatingMode);

  return {
    topologyState,
    balanceTopologyEnabled: readTopologyBoolean(
      params.claim1BalanceEnabled ?? params.balanceTopologyEnabled,
      KAMEN_TRANSPORTER_DEFAULT_CONTROLS.balanceTopologyEnabled,
    ),
    clusterTopologyEnabled: readTopologyBoolean(
      params.claim16ClusterEnabled ?? params.clusterTopologyEnabled,
      KAMEN_TRANSPORTER_DEFAULT_CONTROLS.clusterTopologyEnabled,
    ),
    riderPitchLeanDeg:
      typeof params.riderPitchLeanDeg === "number"
        ? params.riderPitchLeanDeg
        : ((params.pitchLean as number) ?? KAMEN_TRANSPORTER_DEFAULT_CONTROLS.riderPitchLeanDeg),
    velocityCommandMs:
      typeof params.velocityCommandMs === "number"
        ? params.velocityCommandMs
        : ((params.velocityCommand as number) ??
          KAMEN_TRANSPORTER_DEFAULT_CONTROLS.velocityCommandMs),
    yawSteering:
      typeof params.yawSteering === "number"
        ? params.yawSteering
        : ((params.steering as number) ?? KAMEN_TRANSPORTER_DEFAULT_CONTROLS.yawSteering),
    operatingMode,
    stairStepHeightM:
      typeof params.stairStepHeightM === "number"
        ? params.stairStepHeightM
        : ((params.stepHeight as number) ?? KAMEN_TRANSPORTER_DEFAULT_CONTROLS.stairStepHeightM),
    riderMassKg:
      typeof params.riderMassKg === "number"
        ? params.riderMassKg
        : ((params.riderMass as number) ?? KAMEN_TRANSPORTER_DEFAULT_CONTROLS.riderMassKg),
  };
}

function readTopologyBoolean(
  value: number | boolean | string | undefined,
  fallback: boolean,
): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "number" && Number.isFinite(value)) return value >= 0.5;
  return fallback;
}

function topologyStateFromParams(
  params: Record<string, number | boolean | string>,
  legacyMode: KamenTransporterControls["operatingMode"],
): KamenTransporterTopologyState {
  const candidate = params.topologyState;
  if (
    typeof candidate === "string" &&
    KAMEN_TRANSPORTER_TOPOLOGY_STATES.includes(candidate as never)
  ) {
    return candidate as KamenTransporterTopologyState;
  }
  if (typeof candidate === "number" && Number.isFinite(candidate)) {
    return KAMEN_TRANSPORTER_TOPOLOGY_STATES[
      Math.max(0, Math.min(KAMEN_TRANSPORTER_TOPOLOGY_STATES.length - 1, Math.round(candidate)))
    ];
  }

  // Existing saved controls are mapped to their nearest source topology only.
  switch (legacyMode) {
    case "standard_4wheel":
      return "ground_support";
    case "stair_climb":
      return "climb";
    case "lean_mode":
      return "weight_transfer";
    default:
      return KAMEN_TRANSPORTER_DEFAULT_CONTROLS.topologyState;
  }
}

const KAMEN_CONTACT_TOLERANCE_M = 1e-8;
const KAMEN_WHEEL_PHASES_RAD = [-Math.PI / 2, Math.PI / 6, (5 * Math.PI) / 6] as const;
const KAMEN_WHEEL_IDS = ["a", "b", "c"] as const;

/** Horizontal support height for the Table 1 two-riser teaching profile [m]. */
export function kamenHorizontalSupportHeightM(xM: number, stairActive: boolean): number {
  if (!stairActive || xM < 0) return 0;
  if (xM < KAMEN_TRANSPORTER_SOURCE_GEOMETRY_M.stairTreadM) {
    return KAMEN_TRANSPORTER_SOURCE_GEOMETRY_M.stairRiseM;
  }
  return 2 * KAMEN_TRANSPORTER_SOURCE_GEOMETRY_M.stairRiseM;
}

/**
 * Resolve one source-dimensioned side-elevation pose. Figures 39A/39B,
 * 41A/41B, and 42A–42C provide the state geometry; the exact carrier angle
 * used here closes the rounded Table 1 dimensions without wheel penetration.
 */
export function resolveKamenTransporterDisplayPose(
  topologyState: KamenTransporterTopologyState,
  clusterTopologyActive = true,
): KamenTransporterDisplayPose {
  const geometry = KAMEN_TRANSPORTER_SOURCE_GEOMETRY_M;
  if (!clusterTopologyActive) {
    const directContact: KamenTransporterWheelContact = {
      id: "direct",
      centerXM: 0,
      centerYM: geometry.wheelRadiusM,
      supportHeightM: 0,
      signedVerticalGapM: 0,
      touching: true,
    };
    return {
      axleXM: 0,
      axleYM: geometry.wheelRadiusM,
      carrierRotationRad: 0,
      chassisPitchRad: 0,
      stairActive: false,
      sourceFigure: "Claim 1 direct ground-contact comparison; Claim 16 cluster withheld",
      wheelContacts: [directContact],
      contactWheelIds: ["direct"],
      contactCount: 1,
      minimumGapM: 0,
    };
  }

  const adjacentDistanceFromRadiusM = Math.sqrt(3) * geometry.clusterRadiusM;
  const sourceStartRotationRad = -(
    Math.PI / 3 -
    Math.asin(geometry.stairRiseM / adjacentDistanceFromRadiusM)
  );
  const startWheelAAngleRad = KAMEN_WHEEL_PHASES_RAD[0] + sourceStartRotationRad;
  const startAxleXM =
    -geometry.riserToLowerContactM - geometry.clusterRadiusM * Math.cos(startWheelAAngleRad);
  const startAxleYM =
    geometry.wheelRadiusM - geometry.clusterRadiusM * Math.sin(startWheelAAngleRad);
  const startPitchRad = startWheelAAngleRad + (2 * Math.PI - 2.814) - Math.PI / 2;
  const transferWheelBAngleRad = KAMEN_WHEEL_PHASES_RAD[1] + sourceStartRotationRad;
  const transferPitchRad = transferWheelBAngleRad + (2 * Math.PI - 5.236) - Math.PI / 2;

  const climbRotationRad = sourceStartRotationRad - (2 * Math.PI) / 3;
  const climbWheelBAngleRad = KAMEN_WHEEL_PHASES_RAD[1] + climbRotationRad;
  const climbAxleXM =
    geometry.stairTreadM -
    geometry.riserToLowerContactM -
    geometry.clusterRadiusM * Math.cos(climbWheelBAngleRad);
  const climbAxleYM =
    geometry.stairRiseM +
    geometry.wheelRadiusM -
    geometry.clusterRadiusM * Math.sin(climbWheelBAngleRad);
  const climbPitchRad = climbWheelBAngleRad + (2 * Math.PI - 2.814) - Math.PI / 2;

  let pose: Omit<
    KamenTransporterDisplayPose,
    "wheelContacts" | "contactWheelIds" | "contactCount" | "minimumGapM"
  >;
  switch (topologyState) {
    case "ground_support":
      pose = {
        axleXM: 0,
        axleYM: geometry.wheelRadiusM + geometry.clusterRadiusM / 2,
        carrierRotationRad: -Math.PI / 3,
        chassisPitchRad: 0,
        stairActive: false,
        sourceFigure: "Claim 16 / Claim 20 four-ground-wheel comparison",
      };
      break;
    case "balance":
      pose = {
        axleXM: 0,
        axleYM: geometry.wheelRadiusM + geometry.clusterRadiusM,
        carrierRotationRad: 0,
        chassisPitchRad: 0,
        stairActive: false,
        sourceFigure: "Figure 39A normal balance pose",
      };
      break;
    case "stair_start":
      pose = {
        axleXM: startAxleXM,
        axleYM: startAxleYM,
        carrierRotationRad: sourceStartRotationRad,
        chassisPitchRad: startPitchRad,
        stairActive: true,
        sourceFigure: "Figure 39B start pose",
      };
      break;
    case "weight_transfer":
      pose = {
        axleXM: startAxleXM,
        axleYM: startAxleYM,
        carrierRotationRad: sourceStartRotationRad,
        chassisPitchRad: transferPitchRad,
        stairActive: true,
        sourceFigure: "Figure 41B weight transferred to upper wheel pair",
      };
      break;
    case "climb":
      pose = {
        axleXM: climbAxleXM,
        axleYM: climbAxleYM,
        carrierRotationRad: climbRotationRad,
        chassisPitchRad: climbPitchRad,
        stairActive: true,
        sourceFigure: "Figure 42C next wheel pair placed on succeeding tread",
      };
      break;
    case "transition":
      pose = {
        axleXM: 1.5 * geometry.stairTreadM,
        axleYM: 2 * geometry.stairRiseM + geometry.wheelRadiusM + geometry.clusterRadiusM,
        carrierRotationRad: (-4 * Math.PI) / 3,
        chassisPitchRad: 0,
        stairActive: true,
        sourceFigure: "Figure 38 zero-crossing gate after the Figure 42 sequence",
      };
      break;
  }

  const wheelContacts = KAMEN_WHEEL_PHASES_RAD.map((phaseRad, index) => {
    const angleRad = phaseRad + pose.carrierRotationRad;
    const centerXM = pose.axleXM + geometry.clusterRadiusM * Math.cos(angleRad);
    const centerYM = pose.axleYM + geometry.clusterRadiusM * Math.sin(angleRad);
    const supportHeightM = kamenHorizontalSupportHeightM(centerXM, pose.stairActive);
    const signedVerticalGapM = centerYM - geometry.wheelRadiusM - supportHeightM;
    if (signedVerticalGapM < -KAMEN_CONTACT_TOLERANCE_M) {
      throw new Error(
        `Kamen ${topologyState} wheel ${KAMEN_WHEEL_IDS[index]} penetrates its support by ${signedVerticalGapM} m.`,
      );
    }
    return {
      id: KAMEN_WHEEL_IDS[index],
      centerXM,
      centerYM,
      supportHeightM,
      signedVerticalGapM,
      touching: Math.abs(signedVerticalGapM) <= KAMEN_CONTACT_TOLERANCE_M,
    } satisfies KamenTransporterWheelContact;
  });
  const contactWheelIds = wheelContacts.filter((wheel) => wheel.touching).map((wheel) => wheel.id);
  if (contactWheelIds.length === 0) {
    throw new Error(`Kamen ${topologyState} source pose has no horizontal support contact.`);
  }

  return {
    ...pose,
    wheelContacts,
    contactWheelIds,
    contactCount: contactWheelIds.length,
    minimumGapM: Math.min(...wheelContacts.map((wheel) => wheel.signedVerticalGapM)),
  };
}

/**
 * Resolve only the relations the checked claims describe. The angle is a
 * normalized illustration pose used to separate the six states; it is never a
 * claimed cluster angle or a dynamic calculation.
 */
export function stepKamenTransporterTopology(
  controls: KamenTransporterControls,
): KamenTransporterTelemetry {
  const requestedState = controls.topologyState;
  const requiresCluster = !["ground_support", "balance"].includes(requestedState);
  const topologyState =
    !controls.clusterTopologyEnabled && requiresCluster ? "ground_support" : requestedState;
  const balanceState =
    topologyState === "balance" || topologyState === "stair_start" || topologyState === "climb";
  const balanceLoopActive = controls.balanceTopologyEnabled && balanceState;
  const stairSequenceActive = ["stair_start", "weight_transfer", "climb", "transition"].includes(
    topologyState,
  );
  const displayPose = resolveKamenTransporterDisplayPose(
    topologyState,
    controls.clusterTopologyEnabled,
  );

  let wheelControlMode: KamenTransporterTelemetry["wheelControlMode"] =
    "independent-ground-wheel-control";
  let sourceClaimNumbers: readonly number[] = [16, 20, 21];
  if (!controls.clusterTopologyEnabled) {
    wheelControlMode =
      requiresCluster || (topologyState === "balance" && !balanceLoopActive)
        ? "topology-withheld"
        : topologyState === "balance"
          ? "balance-mode"
          : "independent-ground-wheel-control";
    sourceClaimNumbers = [1, 16];
  } else if (topologyState === "balance") {
    wheelControlMode = balanceLoopActive ? "balance-mode" : "topology-withheld";
    sourceClaimNumbers = [20, 21, 22];
  } else if (topologyState === "stair_start") {
    wheelControlMode = balanceLoopActive
      ? "balance-and-cluster-coordination"
      : "cluster-positioning";
    sourceClaimNumbers = [20, 21, 22, 26];
  } else if (topologyState === "weight_transfer") {
    wheelControlMode = "weight-transfer-position-hold";
    sourceClaimNumbers = [20, 21, 23, 26];
  } else if (topologyState === "climb") {
    wheelControlMode = balanceLoopActive
      ? "balance-and-cluster-coordination"
      : "cluster-positioning";
    sourceClaimNumbers = [20, 21, 22, 26];
  } else if (topologyState === "transition") {
    wheelControlMode = "transition-gate";
    sourceClaimNumbers = [20, 21, 24, 25];
  }

  return {
    topologyState,
    stateLabel: KAMEN_TRANSPORTER_TOPOLOGY_LABELS[topologyState],
    balanceLoopActive,
    clusterTopologyActive: controls.clusterTopologyEnabled,
    stairSequenceActive,
    wheelControlMode,
    clusterDisplayPoseRad: displayPose.carrierRotationRad,
    displayPose,
    sourceGeometryReceipt: KAMEN_TRANSPORTER_GEOMETRY_RECEIPT,
    genericOwner: KAMEN_TRANSPORTER_GENERIC_OWNER,
    contactBoundary: KAMEN_TRANSPORTER_CONTACT_BOUNDARY,
    sourceClaimNumbers,
    sourceBoundary: KAMEN_TOPOLOGY_SOURCE_BOUNDARY,
    // Compatibility-only values for legacy callers. Public components and
    // registry entries must not read or label them.
    pitchAngleRad: 0,
    pitchAngleDeg: 0,
    pitchRateRadS: 0,
    forwardVelocityMs: 0,
    forwardAccelerationMs2: 0,
    balanceTorqueNm: 0,
    leftWheelTorqueNm: 0,
    rightWheelTorqueNm: 0,
    clusterAngleDeg: 0,
    centerOfGravityHeightM: 0,
    groundTractionForceN: 0,
    naturalFrequencyRadS: 0,
    stabilityMargin: 0,
    gyroSensorRateRadS: 0,
    accelForeAftMs2: 0,
    isBalancing: balanceLoopActive,
    isClimbing: topologyState === "climb",
    pitchRefusal: false,
  };
}

export function createKamenTransporterMotionState(
  controls: KamenTransporterControls = KAMEN_TRANSPORTER_DEFAULT_CONTROLS,
): KamenTransporterMotionState {
  return {
    controls,
    telemetry: stepKamenTransporterTopology(controls),
    wheelRollAngleRad: 0,
    travelMeters: 0,
  };
}

/**
 * Advance the source-reading tape by one fixed bus tick. The grant supplies a
 * state sequence, not timing, travel, or wheel-speed values, so this updater
 * deliberately carries a stable display pose rather than inventing motion.
 */
export function advanceKamenTransporterMotion(
  controls: KamenTransporterControls,
  _previous: KamenTransporterMotionState = createKamenTransporterMotionState(controls),
  _dt: number = 1 / 60,
  stepTelemetry: KamenTransporterTelemetryStepper = stepKamenTransporterTopology,
): KamenTransporterMotionState {
  return {
    controls,
    telemetry: stepTelemetry(controls),
    wheelRollAngleRad: 0,
    travelMeters: 0,
  };
}

let kamenTransporterTapeState: KamenTransporterMotionState | undefined;

export function getKamenTransporterTapeState(): KamenTransporterMotionState | undefined {
  return kamenTransporterTapeState;
}

export function resetKamenTransporterTapeState(): void {
  kamenTransporterTapeState = undefined;
}

/** One shared fixed-step source-reading tape for the transporter teaching faces. */
export function createKamenTransporterTransportUpdater(
  getControls: () => KamenTransporterControls,
  stepTelemetry: KamenTransporterTelemetryStepper = stepKamenTransporterTopology,
): TapeUpdater {
  return (_previousTelemetry, dt) => {
    const next = advanceKamenTransporterMotion(
      getControls(),
      kamenTransporterTapeState,
      dt,
      stepTelemetry,
    );
    kamenTransporterTapeState = next;

    return {
      refusal: {
        isRefused: false,
      },
      machine: {
        poseXMeters: 0,
        poseYMeters: 0,
        headingRad: 0,
        modeLabel: next.telemetry.stateLabel,
        wheelSpeedMps: 0,
        wheelRollAngleRad: next.wheelRollAngleRad,
        travelMeters: next.travelMeters,
      },
    };
  };
}
