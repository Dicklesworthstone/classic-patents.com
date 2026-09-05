/**
 * US 4,976,582 — Clavel Delta positioning device.
 *
 * The patent supplies an architectural claim: three base-side actuator
 * portions, articulated linking means, and a movable member whose attitude is
 * held fixed. Its illustrated embodiment gives three rotary arms and paired
 * parallel bars. It does not supply dimensions, masses, payload, stiffness,
 * actuator torque, speeds, controller gains, calibration, or a trajectory
 * law. This file therefore owns one deterministic, normalized *topology
 * exhibit*, not a dynamic-body or SI-performance model.
 */

export type ClavelDeltaVec3 = readonly [number, number, number];

export interface ClavelDeltaRobotControls {
  [key: string]: number | undefined;
  /** Unitless display input for Figure 1 control arm 4 at rotary axis 2. */
  armOneInput: number;
  /** Unitless display input for the second Figure 1 control arm. */
  armTwoInput: number;
  /** Unitless display input for the third Figure 1 control arm. */
  armThreeInput: number;
  /** Unitless display rotation for working-member axis 10. */
  toolAxisInput: number;
  /** Claim 1's general three-actuator, attitude-preserving topology. */
  claim1TopologyEnabled: number;
  /** Claim 2's visible paired parallel bars. */
  claim2PairedBarsEnabled: number;
  /** Claim 8's base-mounted supplementary tool-axis motor form. */
  claim8BaseMotorEnabled: number;
}

export type ClavelDeltaRobotParams = Partial<ClavelDeltaRobotControls> &
  Record<string, number | undefined>;

export const CLAVEL_DELTA_ROBOT_DEFAULT_CONTROLS: ClavelDeltaRobotControls = {
  armOneInput: 0.12,
  armTwoInput: -0.18,
  armThreeInput: 0.06,
  toolAxisInput: 0,
  claim1TopologyEnabled: 1,
  claim2PairedBarsEnabled: 1,
  claim8BaseMotorEnabled: 1,
};

export const CLAVEL_DELTA_ROBOT_CLAIM_PROBE_PARAMS = {
  1: "claim1TopologyEnabled",
  2: "claim2PairedBarsEnabled",
  8: "claim8BaseMotorEnabled",
} as const;

export const CLAVEL_DELTA_ROBOT_TOPOLOGY_OWNER =
  "classic-patents::stepClavelDeltaRobotTopology" as const;
export const CLAVEL_DELTA_ROBOT_RUNTIME_SOURCE = "ts-normalized-closed-chain" as const;
export const CLAVEL_DELTA_ROBOT_FRANKENSIM_BOUNDARY =
  "fs-mbd::holonomic-loop-constraints-unavailable" as const;

export type ClavelDeltaClaimStates = Readonly<Record<1 | 2 | 8, boolean>>;

export interface ClavelDeltaLeg {
  readonly index: 0 | 1 | 2;
  /** Fixed base-side axis/actuator anchor in normalized display space. */
  readonly basePivot: ClavelDeltaVec3;
  /** End of source-labelled control arm 4. */
  readonly controlArmEnd: ClavelDeltaVec3;
  /** Center of the paired upper cardan/ball-joint locations. */
  readonly upperPairCenter: ClavelDeltaVec3;
  /** Center of the paired lower platform-joint locations. */
  readonly lowerPairCenter: ClavelDeltaVec3;
  /** First Figure 1-style lower bar 5a. */
  readonly upperJointA: ClavelDeltaVec3;
  readonly lowerJointA: ClavelDeltaVec3;
  /** Second Figure 1-style lower bar 5b. */
  readonly upperJointB: ClavelDeltaVec3;
  readonly lowerJointB: ClavelDeltaVec3;
  /** Unitless distance of either paired lower bar in this display pose. */
  readonly pairedBarLength: number;
  /** Error from the declared rigid normalized lower-bar length. */
  readonly pairedBarLengthError: number;
  /** Error between the two parallel lower-bar translation vectors. */
  readonly pairedBarVectorError: number;
}

export type ClavelDeltaTopologyStatus =
  | "closed-loop-configuration-refused"
  | "claim-1-topology-withheld"
  | "claim-2-paired-bars-withheld"
  | "claim-8-base-tool-motor-withheld"
  | "claimed-topology-visible";

export type ClavelDeltaClosedLoopStatus =
  | "normalized-closed-chain-solved"
  | "normalized-closed-chain-near-boundary"
  | "normalized-closed-chain-unreachable";

export interface ClavelDeltaRobotTopologyState {
  readonly controls: ClavelDeltaRobotControls;
  readonly legs: readonly [ClavelDeltaLeg, ClavelDeltaLeg, ClavelDeltaLeg];
  /** Platform center in normalized display space only. */
  readonly platformCenter: ClavelDeltaVec3;
  /** Source-described platform attitude is held fixed in this paired-bar form. */
  readonly platformNormal: ClavelDeltaVec3;
  readonly platformAttitudeDeviation: number;
  readonly toolAxisRotationRad: number;
  readonly toolAxisVisible: boolean;
  readonly topologyVisible: boolean;
  readonly pairedBarsVisible: boolean;
  readonly status: ClavelDeltaTopologyStatus;
  readonly claimProbeStates: ClavelDeltaClaimStates;
  readonly activeClaim: 1 | 2 | 8;
  /** Declared normalized lower-bar length used by all three closed loops. */
  readonly normalizedBarLength: number;
  /** Largest rigid-link closure error among the six displayed lower bars. */
  readonly closureResidual: number;
  readonly closureStatus: ClavelDeltaClosedLoopStatus;
  readonly configurationRefusal: {
    readonly refused: boolean;
    readonly reason: string | null;
  };
  readonly pairedBarInvariant:
    | "rigid paired lower links share a fixed length and displacement vector"
    | "claim-2 paired bars withheld"
    | "normalized closed-chain configuration unavailable";
  readonly positionLaw: string;
  readonly topologyOwner: typeof CLAVEL_DELTA_ROBOT_TOPOLOGY_OWNER;
  readonly runtimeSource: typeof CLAVEL_DELTA_ROBOT_RUNTIME_SOURCE;
  readonly frankenSimBoundary: typeof CLAVEL_DELTA_ROBOT_FRANKENSIM_BOUNDARY;
  readonly refusal: {
    readonly refused: true;
    readonly reason: string;
  };
}

const BASE_RADIUS_NORMALIZED = 1.2;
const BASE_HEIGHT_NORMALIZED = 0.82;
const CONTROL_ARM_LENGTH_NORMALIZED = 0.68;
const PLATFORM_RADIUS_NORMALIZED = 0.31;
const PAIR_SEPARATION_NORMALIZED = 0.14;
const DISPLAY_ARM_RANGE_RAD = 0.62;
const HOME_PLATFORM_HEIGHT_NORMALIZED = -0.82;
/**
 * A declared display construction, not a recovered patent dimension. Its
 * value closes the symmetric home pose at the declared display platform
 * height below.
 */
const LOWER_BAR_LENGTH_NORMALIZED = Math.hypot(
  BASE_RADIUS_NORMALIZED - CONTROL_ARM_LENGTH_NORMALIZED - PLATFORM_RADIUS_NORMALIZED,
  BASE_HEIGHT_NORMALIZED - HOME_PLATFORM_HEIGHT_NORMALIZED,
);
const CLOSURE_EPSILON = 1e-10;
const HOME_PLATFORM_CENTER: ClavelDeltaVec3 = [0, HOME_PLATFORM_HEIGHT_NORMALIZED, 0];

const SOURCE_BOUNDARY_REASON =
  "US 4,976,582 gives a parallel-linkage topology, named parts, qualitative advantages, and alternative joint/actuator arrangements, but no calibrated dimensions, mass, payload, stiffness, backlash, actuator torque, speed, power, controller gains, motion law, sensor calibration, or measurement result. The generic FrankenSim fs-mbd articulated-tree contract does not solve the holonomic closed-loop constraints required here, so no WASM step is asserted. This shared kernel reports normalized construction geometry only and refuses SI position, velocity, acceleration, force, energy, power, precision, workspace, and performance prediction.";

function finite(value: number | undefined, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

function signedUnit(value: number | undefined, fallback: number): number {
  return clamp(finite(value, fallback), -1, 1);
}

function binary(value: number | undefined, fallback: number): number {
  return signedUnit(value, fallback) >= 0.5 ? 1 : 0;
}

function add(a: ClavelDeltaVec3, b: ClavelDeltaVec3): ClavelDeltaVec3 {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

function subtract(a: ClavelDeltaVec3, b: ClavelDeltaVec3): ClavelDeltaVec3 {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function scale(vector: ClavelDeltaVec3, amount: number): ClavelDeltaVec3 {
  return [vector[0] * amount, vector[1] * amount, vector[2] * amount];
}

function length(vector: ClavelDeltaVec3): number {
  return Math.hypot(vector[0], vector[1], vector[2]);
}

function dot(a: ClavelDeltaVec3, b: ClavelDeltaVec3): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function cross(a: ClavelDeltaVec3, b: ClavelDeltaVec3): ClavelDeltaVec3 {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
}

function radial(index: number): ClavelDeltaVec3 {
  const angle = -Math.PI / 2 + (index * 2 * Math.PI) / 3;
  return [Math.cos(angle), 0, Math.sin(angle)];
}

function tangent(index: number): ClavelDeltaVec3 {
  const angle = -Math.PI / 2 + (index * 2 * Math.PI) / 3;
  return [-Math.sin(angle), 0, Math.cos(angle)];
}

export function readClavelDeltaRobotControls(
  params: ClavelDeltaRobotParams = {},
): ClavelDeltaRobotControls {
  const p = params as Record<string, number | undefined>;
  return {
    armOneInput: signedUnit(
      p.armOneInput ?? p.arm1 ?? p.arm1Input ?? p.input1,
      CLAVEL_DELTA_ROBOT_DEFAULT_CONTROLS.armOneInput,
    ),
    armTwoInput: signedUnit(
      p.armTwoInput ?? p.arm2 ?? p.arm2Input ?? p.input2,
      CLAVEL_DELTA_ROBOT_DEFAULT_CONTROLS.armTwoInput,
    ),
    armThreeInput: signedUnit(
      p.armThreeInput ?? p.arm3 ?? p.arm3Input ?? p.input3,
      CLAVEL_DELTA_ROBOT_DEFAULT_CONTROLS.armThreeInput,
    ),
    toolAxisInput: signedUnit(
      p.toolAxisInput ?? p.toolAxis ?? p.toolInput ?? p.axis10,
      CLAVEL_DELTA_ROBOT_DEFAULT_CONTROLS.toolAxisInput,
    ),
    claim1TopologyEnabled: binary(
      p.claim1TopologyEnabled ?? p.claim1 ?? p.topologyEnabled,
      CLAVEL_DELTA_ROBOT_DEFAULT_CONTROLS.claim1TopologyEnabled,
    ),
    claim2PairedBarsEnabled: binary(
      p.claim2PairedBarsEnabled ?? p.claim2 ?? p.pairedBarsEnabled,
      CLAVEL_DELTA_ROBOT_DEFAULT_CONTROLS.claim2PairedBarsEnabled,
    ),
    claim8BaseMotorEnabled: binary(
      p.claim8BaseMotorEnabled ?? p.claim8 ?? p.baseMotorEnabled ?? p.toolMotorEnabled,
      CLAVEL_DELTA_ROBOT_DEFAULT_CONTROLS.claim8BaseMotorEnabled,
    ),
  };
}

export function readClavelDeltaRobotClaimStates(
  params: ClavelDeltaRobotParams = {},
): ClavelDeltaClaimStates {
  const controls = readClavelDeltaRobotControls(params);
  return {
    1: controls.claim1TopologyEnabled === 1,
    2: controls.claim1TopologyEnabled === 1 && controls.claim2PairedBarsEnabled === 1,
    8: controls.claim1TopologyEnabled === 1 && controls.claim8BaseMotorEnabled === 1,
  };
}

interface ClavelDeltaArmFrame {
  readonly index: 0 | 1 | 2;
  readonly radial: ClavelDeltaVec3;
  readonly tangent: ClavelDeltaVec3;
  readonly basePivot: ClavelDeltaVec3;
  readonly controlArmEnd: ClavelDeltaVec3;
}

interface ClavelDeltaClosedLoopSolution {
  readonly platformCenter: ClavelDeltaVec3;
  readonly valid: boolean;
  readonly status: ClavelDeltaClosedLoopStatus;
  readonly reason: string | null;
}

function buildArmFrame(input: number, index: 0 | 1 | 2): ClavelDeltaArmFrame {
  const r = radial(index);
  const swing = input * DISPLAY_ARM_RANGE_RAD;
  const basePivot: ClavelDeltaVec3 = add(scale(r, BASE_RADIUS_NORMALIZED), [
    0,
    BASE_HEIGHT_NORMALIZED,
    0,
  ]);
  const armDirection: ClavelDeltaVec3 = [
    -r[0] * Math.cos(swing),
    -Math.sin(swing),
    -r[2] * Math.cos(swing),
  ];

  return {
    index,
    radial: r,
    tangent: tangent(index),
    basePivot,
    controlArmEnd: add(basePivot, scale(armDirection, CONTROL_ARM_LENGTH_NORMALIZED)),
  };
}

/**
 * Solves the declared display configuration as the intersection of the three
 * equal-radius spheres centered at the arm endpoints after each fixed-platform
 * anchor offset is removed. This is a rigid normalized closed chain, unlike a
 * pose interpolation that would visibly telescope the linking bars.
 */
function solveNormalizedClosedChain(
  centers: readonly [ClavelDeltaVec3, ClavelDeltaVec3, ClavelDeltaVec3],
): ClavelDeltaClosedLoopSolution {
  const [first, second, third] = centers;
  const firstToSecond = subtract(second, first);
  const firstToThird = subtract(third, first);
  const firstSecondDistance = length(firstToSecond);
  if (firstSecondDistance <= CLOSURE_EPSILON) {
    return {
      platformCenter: HOME_PLATFORM_CENTER,
      valid: false,
      status: "normalized-closed-chain-unreachable",
      reason:
        "The declared normalized actuator centers are degenerate; no closed-chain platform pose is asserted.",
    };
  }

  const xAxis = scale(firstToSecond, 1 / firstSecondDistance);
  const thirdProjection = dot(xAxis, firstToThird);
  const yVector = subtract(firstToThird, scale(xAxis, thirdProjection));
  const yDistance = length(yVector);
  if (yDistance <= CLOSURE_EPSILON) {
    return {
      platformCenter: HOME_PLATFORM_CENTER,
      valid: false,
      status: "normalized-closed-chain-unreachable",
      reason:
        "The declared normalized actuator centers are collinear; no closed-chain platform pose is asserted.",
    };
  }

  const yAxis = scale(yVector, 1 / yDistance);
  const normal = cross(xAxis, yAxis);
  const x = firstSecondDistance / 2;
  const y =
    (thirdProjection * thirdProjection + yDistance * yDistance - 2 * thirdProjection * x) /
    (2 * yDistance);
  const heightSquared = LOWER_BAR_LENGTH_NORMALIZED ** 2 - x * x - y * y;
  if (heightSquared < -CLOSURE_EPSILON) {
    return {
      platformCenter: HOME_PLATFORM_CENTER,
      valid: false,
      status: "normalized-closed-chain-unreachable",
      reason:
        "The requested normalized inputs have no rigid closed-chain intersection for the declared display bars.",
    };
  }

  const basePoint = add(add(first, scale(xAxis, x)), scale(yAxis, y));
  const height = Math.sqrt(Math.max(0, heightSquared));
  const firstBranch = add(basePoint, scale(normal, height));
  const secondBranch = subtract(basePoint, scale(normal, height));

  return {
    platformCenter: firstBranch[1] <= secondBranch[1] ? firstBranch : secondBranch,
    valid: true,
    status:
      heightSquared <= CLOSURE_EPSILON
        ? "normalized-closed-chain-near-boundary"
        : "normalized-closed-chain-solved",
    reason: null,
  };
}

function buildLeg(frame: ClavelDeltaArmFrame, platformCenter: ClavelDeltaVec3): ClavelDeltaLeg {
  const upperPairCenter = frame.controlArmEnd;
  const lowerPairCenter = add(platformCenter, scale(frame.radial, PLATFORM_RADIUS_NORMALIZED));
  const pairOffset = scale(frame.tangent, PAIR_SEPARATION_NORMALIZED / 2);
  const upperJointA = add(upperPairCenter, pairOffset);
  const lowerJointA = add(lowerPairCenter, pairOffset);
  const upperJointB = subtract(upperPairCenter, pairOffset);
  const lowerJointB = subtract(lowerPairCenter, pairOffset);
  const translationA = subtract(lowerJointA, upperJointA);
  const translationB = subtract(lowerJointB, upperJointB);
  const pairedBarLength = length(translationA);

  return {
    index: frame.index,
    basePivot: frame.basePivot,
    controlArmEnd: frame.controlArmEnd,
    upperPairCenter,
    lowerPairCenter,
    upperJointA,
    lowerJointA,
    upperJointB,
    lowerJointB,
    pairedBarLength,
    pairedBarLengthError: Math.max(
      Math.abs(pairedBarLength - LOWER_BAR_LENGTH_NORMALIZED),
      Math.abs(length(translationB) - LOWER_BAR_LENGTH_NORMALIZED),
    ),
    pairedBarVectorError: length(subtract(translationA, translationB)),
  };
}

/**
 * One deterministic normalized topology used by every Clavel visual surface.
 *
 * The grant does not provide a dimensioned production machine, so the lengths
 * below are expressly normalized exhibit geometry. Unlike a pose interpolation,
 * the three lower-link pairs are solved as a closed chain: all six displayed
 * bars retain one declared length while each pair retains one displacement
 * vector. This demonstrates the claimed spatial-parallelogram architecture
 * without asserting a measured machine workspace or performance result.
 */
export function stepClavelDeltaRobotTopology(
  params: ClavelDeltaRobotParams = {},
): ClavelDeltaRobotTopologyState {
  const controls = readClavelDeltaRobotControls(params);
  const inputs = [controls.armOneInput, controls.armTwoInput, controls.armThreeInput] as const;
  const armFrames = [
    buildArmFrame(inputs[0], 0),
    buildArmFrame(inputs[1], 1),
    buildArmFrame(inputs[2], 2),
  ] as const;
  const closure = solveNormalizedClosedChain([
    subtract(armFrames[0].controlArmEnd, scale(armFrames[0].radial, PLATFORM_RADIUS_NORMALIZED)),
    subtract(armFrames[1].controlArmEnd, scale(armFrames[1].radial, PLATFORM_RADIUS_NORMALIZED)),
    subtract(armFrames[2].controlArmEnd, scale(armFrames[2].radial, PLATFORM_RADIUS_NORMALIZED)),
  ]);
  const platformCenter = closure.platformCenter;
  const legs = [
    buildLeg(armFrames[0], platformCenter),
    buildLeg(armFrames[1], platformCenter),
    buildLeg(armFrames[2], platformCenter),
  ] as const;
  const closureResidual = Math.max(...legs.map((leg) => leg.pairedBarLengthError));

  const claimProbeStates = readClavelDeltaRobotClaimStates(controls);
  const topologyVisible = closure.valid && claimProbeStates[1];
  const pairedBarsVisible = topologyVisible && claimProbeStates[2];
  const toolAxisVisible = topologyVisible && claimProbeStates[8];
  const status: ClavelDeltaTopologyStatus = !closure.valid
    ? "closed-loop-configuration-refused"
    : !topologyVisible
      ? "claim-1-topology-withheld"
      : !pairedBarsVisible
        ? "claim-2-paired-bars-withheld"
        : !toolAxisVisible
          ? "claim-8-base-tool-motor-withheld"
          : "claimed-topology-visible";
  const activeClaim: 1 | 2 | 8 =
    !closure.valid || !topologyVisible ? 1 : !pairedBarsVisible ? 2 : 8;

  return {
    controls,
    legs,
    platformCenter,
    platformNormal: [0, 1, 0],
    platformAttitudeDeviation: 0,
    toolAxisRotationRad: controls.toolAxisInput * Math.PI,
    toolAxisVisible,
    topologyVisible,
    pairedBarsVisible,
    status,
    claimProbeStates,
    activeClaim,
    normalizedBarLength: LOWER_BAR_LENGTH_NORMALIZED,
    closureResidual,
    closureStatus: closure.status,
    configurationRefusal: { refused: !closure.valid, reason: closure.reason },
    pairedBarInvariant: !closure.valid
      ? "normalized closed-chain configuration unavailable"
      : pairedBarsVisible
        ? "rigid paired lower links share a fixed length and displacement vector"
        : "claim-2 paired bars withheld",
    positionLaw:
      "||p* + a_i* - e_i*|| = L* for all three legs; normalized closed-chain exhibit construction only",
    topologyOwner: CLAVEL_DELTA_ROBOT_TOPOLOGY_OWNER,
    runtimeSource: CLAVEL_DELTA_ROBOT_RUNTIME_SOURCE,
    frankenSimBoundary: CLAVEL_DELTA_ROBOT_FRANKENSIM_BOUNDARY,
    refusal: { refused: true, reason: SOURCE_BOUNDARY_REASON },
  };
}
