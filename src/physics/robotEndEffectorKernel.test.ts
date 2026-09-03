import { describe, expect, test } from "bun:test";
import {
  GEAR_RATIO,
  MAX_RATED_GRIP_FORCE_N,
  MAX_TRAVEL_SPEED_MM_S,
  ROBOT_END_EFFECTOR_DEFAULTS,
  ROBOT_END_EFFECTOR_FRANKENSIM_CONTACT_OWNER,
  ROBOT_END_EFFECTOR_FRANKENSIM_HELICAL_OWNER,
  ROBOT_END_EFFECTOR_FRANKENSIM_PRISMATIC_OWNER,
  ROBOT_END_EFFECTOR_FRANKENSIM_REVOLUTE_OWNER,
  ROBOT_END_EFFECTOR_TYPICAL_JAW_OPENING_M,
  readRobotEndEffectorControls,
  SCREW_LEAD_M,
  stepRobotEndEffector,
  stepRobotEndEffectorSi,
} from "./robotEndEffectorKernel";

describe("US 4,765,668 source-bounded robot end-effector kernel", () => {
  test("clamps scenario readers to values actually bounded by the source or normalized view", () => {
    const controls = readRobotEndEffectorControls({
      motorRpm: 1200,
      motorTorqueNm: 22,
      jawSpanMm: 300,
      sideBJawSpanMm: -10,
      connectorRollDeg: 540,
      transverseOffsetNormalized: -4,
    });
    expect(controls).toEqual({
      motorRpm: 260,
      motorTorqueNm: 10,
      jawSpanMm: 152.4,
      sideBJawSpanMm: 0,
      connectorRollDeg: 180,
      transverseOffsetNormalized: -1,
    });
  });

  test("mirrors the opposed fs-mbd helical constraint and preserves the exact midpoint", () => {
    const state = stepRobotEndEffector({ jawOpeningFraction: 1 });
    expect(state.jawOpeningM).toBeCloseTo(ROBOT_END_EFFECTOR_TYPICAL_JAW_OPENING_M, 12);
    expect(state.perHandOffsetM).toBeCloseTo(state.jawOpeningM / 2, 12);
    expect(state.screwRevolutions * SCREW_LEAD_M * 2).toBeCloseTo(state.jawOpeningM, 12);
    expect(state.screwAngleRad).toBeCloseTo(state.screwRevolutions * 2 * Math.PI, 12);
    expect(state.symmetricMidpointM).toBe(0);
    expect(state.owners.helical).toBe(ROBOT_END_EFFECTOR_FRANKENSIM_HELICAL_OWNER);
  });

  test("maps the printed gear ratio and eight pegs without inventing a servo", () => {
    const state = stepRobotEndEffector({ jawOpeningFraction: 0.73 });
    expect(state.motorRevolutions).toBeCloseTo(state.screwRevolutions * GEAR_RATIO, 12);
    expect(state.encoderCountModulo).toBeGreaterThanOrEqual(0);
    expect(state.encoderCountModulo).toBeLessThan(8);
  });

  test("retains printed prototype ratings as reported facts and refuses fabricated performance", () => {
    const controls = { ...ROBOT_END_EFFECTOR_DEFAULTS, motorTorqueNm: 10 };
    const tel = stepRobotEndEffectorSi(controls);
    expect(tel.sourceReportedMaxGripForceN).toBe(MAX_RATED_GRIP_FORCE_N);
    expect(tel.sourceReportedMaxTravelMmS).toBe(MAX_TRAVEL_SPEED_MM_S);
    expect(tel.sourceReportedRepeatabilityMm).toBe(0.05);
    expect(tel.requestedMotorTorqueNm).toBe(10);
    expect(tel.sourceBoundary.isRefused).toBe(true);
    expect(tel.sourceBoundary.note).toContain(ROBOT_END_EFFECTOR_FRANKENSIM_CONTACT_OWNER);
    expect("clampingForceN" in tel).toBe(false);
    expect("mechanicalPowerW" in tel).toBe(false);
    expect("backDriveHoldingTorqueNm" in tel).toBe(false);
    expect("stroke50mmTimeSec" in tel).toBe(false);
  });

  test("keeps connector coordinates source-bounded and clamps the normalized transverse stage", () => {
    const state = stepRobotEndEffector({
      frameRotationDeg: 270,
      transverseOffsetFraction: 3,
    });
    expect(state.frameRotationRad).toBeCloseTo(Math.PI, 12);
    expect(state.transverseOffsetNormalized).toBe(1);
    expect(state.owners.roll).toBe(ROBOT_END_EFFECTOR_FRANKENSIM_REVOLUTE_OWNER);
    expect(state.owners.transverse).toBe(ROBOT_END_EFFECTOR_FRANKENSIM_PRISMATIC_OWNER);
  });

  test("uses explicit topology and retention predicates for claim comparison and finger release", () => {
    expect(stepRobotEndEffector({}).claim1TopologyPresent).toBe(true);
    expect(stepRobotEndEffector({ claim1TopologyEnabled: 0 }).claim1TopologyPresent).toBe(false);
    expect(stepRobotEndEffector({ fingerChangeFraction: 0 }).fingerRetainedFraction).toBe(1);
    expect(stepRobotEndEffector({ fingerChangeFraction: 1 }).fingerRetainedFraction).toBe(0);
  });
});
