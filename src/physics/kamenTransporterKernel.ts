import type { TapeUpdater } from "./useFrankenSimPhysics";

/**
 * Source-bound topology reader for US 5,701,965 — Human Transporter.
 *
 * The checked grant establishes a motorized drive/control-loop relationship,
 * independently controlled cluster wheels, and the ordering of balance,
 * transfer, climb, and transition modes. It does not provide a controller
 * gain, torque, speed, mass, wheel radius, or recovery-margin datum. This
 * module therefore publishes only the state topology needed by the 2D and 3D
 * claim-reading instruments.
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
  /** Render-only normalized cluster pose; it is not a printed angle. */
  clusterDisplayPoseRad: number;
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
  "US 5,701,965 describes control relationships and state ordering, not numerical torque, speed, mass, wheel-radius, gain, force, or stability-margin values.";

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

const CLUSTER_DISPLAY_POSE_RADIANS: Readonly<Record<KamenTransporterTopologyState, number>> = {
  ground_support: 0,
  balance: 0,
  stair_start: Math.PI / 6,
  weight_transfer: Math.PI / 3,
  climb: Math.PI / 2,
  transition: 0,
};

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

  let wheelControlMode: KamenTransporterTelemetry["wheelControlMode"] =
    "independent-ground-wheel-control";
  let sourceClaimNumbers: readonly number[] = [16, 21];
  if (!controls.clusterTopologyEnabled && requiresCluster) {
    wheelControlMode = "topology-withheld";
    sourceClaimNumbers = [16, 21];
  } else if (topologyState === "balance") {
    wheelControlMode = balanceLoopActive ? "balance-mode" : "topology-withheld";
    sourceClaimNumbers = [21, 22];
  } else if (topologyState === "stair_start") {
    wheelControlMode = balanceLoopActive
      ? "balance-and-cluster-coordination"
      : "cluster-positioning";
    sourceClaimNumbers = [21, 22, 26];
  } else if (topologyState === "weight_transfer") {
    wheelControlMode = "weight-transfer-position-hold";
    sourceClaimNumbers = [21, 23, 26];
  } else if (topologyState === "climb") {
    wheelControlMode = balanceLoopActive
      ? "balance-and-cluster-coordination"
      : "cluster-positioning";
    sourceClaimNumbers = [21, 22, 26];
  } else if (topologyState === "transition") {
    wheelControlMode = "transition-gate";
    sourceClaimNumbers = [21, 24, 25];
  }

  return {
    topologyState,
    stateLabel: KAMEN_TRANSPORTER_TOPOLOGY_LABELS[topologyState],
    balanceLoopActive,
    clusterTopologyActive: controls.clusterTopologyEnabled,
    stairSequenceActive,
    wheelControlMode,
    clusterDisplayPoseRad: CLUSTER_DISPLAY_POSE_RADIANS[topologyState],
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
): KamenTransporterMotionState {
  return {
    controls,
    telemetry: stepKamenTransporterTopology(controls),
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
): TapeUpdater {
  return (_previousTelemetry, dt) => {
    const next = advanceKamenTransporterMotion(getControls(), kamenTransporterTapeState, dt);
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
