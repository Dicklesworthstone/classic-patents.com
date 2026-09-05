/**
 * Source-bounded SI kernel for US 4,921,293.
 *
 * The grant prints a static map from four cable tensions and three pulley radii
 * to three joint torques. It does not print link dimensions, mass, inertia,
 * damping, motor ratings, friction coefficients, contact stiffness, or a time
 * response. This kernel evaluates the printed law and refuses to manufacture
 * the missing historical-performance model.
 */

export interface SalisburyRobotHandControls {
  tensionT1N: number;
  tensionT2N: number;
  tensionT3N: number;
  tensionT4N: number;
  /**
   * Visitor-declared study scale, not a dimension recovered from the patent.
   * Figure 3 shows R3 > R1 > R2, so the study uses R1=1.2s, R2=s, and R3=1.4s.
   */
  radiusScaleMm: number;
  /** Claim 2 study switch: whether the first idler is held in position. */
  firstIdlerFixed: boolean;
  /** Internal claim-comparison predicate; normal visitor controls leave this true. */
  claim1RoutingPresent?: boolean;
}

export type SalisburyPullPattern =
  | "T2/T3 opposed: third-joint command"
  | "T1/T4 opposed: second-joint command"
  | "T2/T3 paired: first-joint command"
  | "T1/T4 paired: opposite first-joint command"
  | "Claim 1 routing withheld"
  | "mixed cable loading";

export interface SalisburyRobotHandTelemetry {
  /** One digit's four admitted tensions; the full hand has three such cable groups. */
  tendonTensionsN: [number, number, number, number];
  pulleyRadiiM: [number, number, number];
  jointTorquesNm: [number, number, number];
  /** A signed, normalized diagram pose. It is not a historic dynamic prediction. */
  displayJointAnglesDeg: [number, number, number];
  pullPattern: SalisburyPullPattern;
  firstIdlerFixed: boolean;
  claim1RoutingProbe: boolean;
  claim2IdlerProbe: boolean;
  sourceLawApplicable: boolean;
  activeJointCoordinates: 0 | 9;
  activeCableEndCount: 0 | 12;
  owners: {
    topology: typeof SALISBURY_FRANKENSIM_TOPOLOGY_OWNER;
    revolute: typeof SALISBURY_FRANKENSIM_REVOLUTE_OWNER;
    contactCandidate: typeof SALISBURY_FRANKENSIM_CONTACT_OWNER;
  };
  refused: boolean;
  refusalReason?: string;
  historicalDynamicsAvailable: false;
  historicalDynamicsRefusal: string;
  provenance: "TS_SOURCE_LAW" | "WASM_SOURCE_LAW";
}

export const SALISBURY_HAND_DEFAULT_CONTROLS: SalisburyRobotHandControls = {
  tensionT1N: 18,
  tensionT2N: 22,
  tensionT3N: 10,
  tensionT4N: 14,
  radiusScaleMm: 10,
  firstIdlerFixed: true,
  claim1RoutingPresent: true,
};

export const SALISBURY_FRANKENSIM_TOPOLOGY_OWNER =
  "fs-mbd::salisbury::step_salisbury_hand" as const;
export const SALISBURY_FRANKENSIM_REVOLUTE_OWNER =
  "fs-mbd::articulated::JointModel::revolute" as const;
export const SALISBURY_FRANKENSIM_CONTACT_OWNER = "fs-contact::normal_patch" as const;

const HISTORICAL_DYNAMICS_REFUSAL =
  "US 4,921,293 prints the tendon-to-joint torque equations but no historic pulley dimensions, link geometry, mass, inertia, damping, motor rating, friction coefficient, or contact modulus. Dynamic pose, grasp force, force closure, speed, and stability are therefore unavailable.";

const isValidTension = (value: number) => Number.isFinite(value) && value >= 0;

function inferPullPattern(t1: number, t2: number, t3: number, t4: number): SalisburyPullPattern {
  const d14 = Math.abs(t1 - t4);
  const d23 = Math.abs(t2 - t3);
  const mean14 = (t1 + t4) / 2;
  const mean23 = (t2 + t3) / 2;
  const tolerance = Math.max(0.25, Math.max(t1, t2, t3, t4) * 0.03);

  if (d23 > tolerance && d14 <= tolerance) return "T2/T3 opposed: third-joint command";
  if (d14 > tolerance && d23 <= tolerance) return "T1/T4 opposed: second-joint command";
  if (d14 <= tolerance && d23 <= tolerance && mean23 > mean14 + tolerance) {
    return "T2/T3 paired: first-joint command";
  }
  if (d14 <= tolerance && d23 <= tolerance && mean14 > mean23 + tolerance) {
    return "T1/T4 paired: opposite first-joint command";
  }
  return "mixed cable loading";
}

function displayAngle(torqueNm: number, limitDeg: number): number {
  // A clearly labelled diagram normalization; there are no source dynamics to integrate.
  return Math.tanh(torqueNm / 0.25) * limitDeg;
}

export function stepSalisburyRobotHandSi(
  controls: SalisburyRobotHandControls,
  _dt = 1 / 60,
): SalisburyRobotHandTelemetry {
  const { tensionT1N: t1, tensionT2N: t2, tensionT3N: t3, tensionT4N: t4 } = controls;
  // Figure 3 prints the law for one representative digit. The visual mirrors
  // that digit-level study across all three connected chains; it does not
  // collapse the physical hand's twelve separately routed cable ends to four.
  const tensions: [number, number, number, number] = [t1, t2, t3, t4];
  const invalidTensionIndex = tensions.findIndex((value) => !isValidTension(value));
  const claim1RoutingPresent = controls.claim1RoutingPresent !== false;
  const activeJointCoordinates = claim1RoutingPresent ? 9 : 0;
  const activeCableEndCount = claim1RoutingPresent ? 12 : 0;
  const owners = {
    topology: SALISBURY_FRANKENSIM_TOPOLOGY_OWNER,
    revolute: SALISBURY_FRANKENSIM_REVOLUTE_OWNER,
    contactCandidate: SALISBURY_FRANKENSIM_CONTACT_OWNER,
  } as const;

  if (
    invalidTensionIndex >= 0 ||
    !Number.isFinite(controls.radiusScaleMm) ||
    controls.radiusScaleMm <= 0
  ) {
    const refusalReason =
      invalidTensionIndex >= 0
        ? `T${invalidTensionIndex + 1} must be a finite, non-negative cable tension in newtons.`
        : "The visitor-declared pulley-radius scale must be a finite value greater than zero millimetres.";
    return {
      tendonTensionsN: tensions,
      pulleyRadiiM: [0, 0, 0],
      jointTorquesNm: [0, 0, 0],
      displayJointAnglesDeg: [0, 0, 0],
      pullPattern: "mixed cable loading",
      firstIdlerFixed: controls.firstIdlerFixed,
      claim1RoutingProbe: false,
      claim2IdlerProbe: false,
      sourceLawApplicable: false,
      activeJointCoordinates,
      activeCableEndCount,
      owners,
      refused: true,
      refusalReason,
      historicalDynamicsAvailable: false,
      historicalDynamicsRefusal: HISTORICAL_DYNAMICS_REFUSAL,
      provenance: "TS_SOURCE_LAW",
    };
  }

  const r2 = controls.radiusScaleMm / 1000;
  const r1 = r2 * 1.2;
  const r3 = r2 * 1.4;

  if (!claim1RoutingPresent) {
    return {
      tendonTensionsN: tensions,
      pulleyRadiiM: [r1, r2, r3],
      jointTorquesNm: [0, 0, 0],
      displayJointAnglesDeg: [0, 0, 0],
      pullPattern: "Claim 1 routing withheld",
      firstIdlerFixed: controls.firstIdlerFixed,
      claim1RoutingProbe: false,
      claim2IdlerProbe: false,
      sourceLawApplicable: false,
      activeJointCoordinates,
      activeCableEndCount,
      owners,
      refused: false,
      historicalDynamicsAvailable: false,
      historicalDynamicsRefusal: HISTORICAL_DYNAMICS_REFUSAL,
      provenance: "TS_SOURCE_LAW",
    };
  }

  // Equations printed in the preferred-embodiment discussion for Figure 3.
  const torque1Nm = -t1 * r1 + t2 * r2 + t3 * r2 - t4 * r1;
  const torque2Nm = t1 * r3 + t2 * r2 - t3 * r2 - t4 * r3;
  const torque3Nm = t2 * r2 - t3 * r2;

  return {
    tendonTensionsN: tensions,
    pulleyRadiiM: [r1, r2, r3],
    jointTorquesNm: [torque1Nm, torque2Nm, torque3Nm],
    displayJointAnglesDeg: [
      displayAngle(torque1Nm, 28),
      displayAngle(torque2Nm, 62),
      displayAngle(torque3Nm, 68),
    ],
    pullPattern: inferPullPattern(t1, t2, t3, t4),
    firstIdlerFixed: controls.firstIdlerFixed,
    claim1RoutingProbe: true,
    claim2IdlerProbe: controls.firstIdlerFixed,
    sourceLawApplicable: true,
    activeJointCoordinates,
    activeCableEndCount,
    owners,
    refused: false,
    historicalDynamicsAvailable: false,
    historicalDynamicsRefusal: HISTORICAL_DYNAMICS_REFUSAL,
    provenance: "TS_SOURCE_LAW",
  };
}

export function readSalisburyRobotHandControls(
  params: Record<string, number | boolean | undefined> = {},
): SalisburyRobotHandControls {
  const p = params as Record<string, number | boolean | undefined>;
  const t1 = p.tensionT1N ?? p.t1 ?? p.tension1 ?? p.T1;
  const t2 = p.tensionT2N ?? p.t2 ?? p.tension2 ?? p.T2;
  const t3 = p.tensionT3N ?? p.t3 ?? p.tension3 ?? p.T3;
  const t4 = p.tensionT4N ?? p.t4 ?? p.tension4 ?? p.T4;
  const rScale = p.radiusScaleMm ?? p.radiusScale ?? p.rScale ?? p.r2Scale;
  const idler = p.firstIdlerFixed ?? p.idlerFixed ?? p.claim2Idler;
  const routing = p.claim1RoutingEnabled ?? p.claim1RoutingPresent ?? p.claim1;

  return {
    tensionT1N: typeof t1 === "number" ? t1 : SALISBURY_HAND_DEFAULT_CONTROLS.tensionT1N,
    tensionT2N: typeof t2 === "number" ? t2 : SALISBURY_HAND_DEFAULT_CONTROLS.tensionT2N,
    tensionT3N: typeof t3 === "number" ? t3 : SALISBURY_HAND_DEFAULT_CONTROLS.tensionT3N,
    tensionT4N: typeof t4 === "number" ? t4 : SALISBURY_HAND_DEFAULT_CONTROLS.tensionT4N,
    radiusScaleMm:
      typeof rScale === "number" ? rScale : SALISBURY_HAND_DEFAULT_CONTROLS.radiusScaleMm,
    firstIdlerFixed:
      typeof idler === "boolean"
        ? idler
        : typeof idler === "number"
          ? idler >= 0.5
          : SALISBURY_HAND_DEFAULT_CONTROLS.firstIdlerFixed,
    claim1RoutingPresent:
      typeof routing === "boolean"
        ? routing
        : typeof routing === "number"
          ? routing >= 0.5
          : SALISBURY_HAND_DEFAULT_CONTROLS.claim1RoutingPresent,
  };
}
