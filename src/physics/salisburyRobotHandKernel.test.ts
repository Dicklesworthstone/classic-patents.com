import { describe, expect, test } from "bun:test";
import {
  readSalisburyRobotHandControls,
  SALISBURY_FRANKENSIM_CONTACT_OWNER,
  SALISBURY_FRANKENSIM_REVOLUTE_OWNER,
  SALISBURY_FRANKENSIM_TOPOLOGY_OWNER,
  SALISBURY_HAND_DEFAULT_CONTROLS,
  stepSalisburyRobotHandSi,
} from "./salisburyRobotHandKernel";

describe("US 4,921,293 source-bounded tendon torque kernel", () => {
  test("evaluates the three equations printed beside Figure 3 in SI units", () => {
    const telemetry = stepSalisburyRobotHandSi({
      tensionT1N: 20,
      tensionT2N: 15,
      tensionT3N: 5,
      tensionT4N: 10,
      radiusScaleMm: 10,
      firstIdlerFixed: true,
    });

    expect(telemetry.pulleyRadiiM[0]).toBeCloseTo(0.012, 12);
    expect(telemetry.pulleyRadiiM[1]).toBeCloseTo(0.01, 12);
    expect(telemetry.pulleyRadiiM[2]).toBeCloseTo(0.014, 12);
    expect(telemetry.jointTorquesNm[0]).toBeCloseTo(-0.16, 12);
    expect(telemetry.jointTorquesNm[1]).toBeCloseTo(0.24, 12);
    expect(telemetry.jointTorquesNm[2]).toBeCloseTo(0.1, 12);
    expect(telemetry.refused).toBe(false);
    expect(telemetry.sourceLawApplicable).toBe(true);
    expect(telemetry.activeJointCoordinates).toBe(9);
    expect(telemetry.activeCableEndCount).toBe(12);
    expect(telemetry.provenance).toBe("TS_SOURCE_LAW");
  });

  test("scales every computed torque linearly with the declared pulley scale", () => {
    const base = stepSalisburyRobotHandSi(SALISBURY_HAND_DEFAULT_CONTROLS);
    const doubled = stepSalisburyRobotHandSi({
      ...SALISBURY_HAND_DEFAULT_CONTROLS,
      radiusScaleMm: SALISBURY_HAND_DEFAULT_CONTROLS.radiusScaleMm * 2,
    });

    doubled.jointTorquesNm.forEach((torque, index) => {
      expect(torque).toBeCloseTo(base.jointTorquesNm[index] * 2, 12);
    });
  });

  test("identifies the four pull patterns described by Claim 1", () => {
    const evaluate = (tensions: [number, number, number, number]) =>
      stepSalisburyRobotHandSi({
        tensionT1N: tensions[0],
        tensionT2N: tensions[1],
        tensionT3N: tensions[2],
        tensionT4N: tensions[3],
        radiusScaleMm: 10,
        firstIdlerFixed: true,
      }).pullPattern;

    expect(evaluate([10, 18, 6, 10])).toBe("T2/T3 opposed: third-joint command");
    expect(evaluate([18, 10, 10, 6])).toBe("T1/T4 opposed: second-joint command");
    expect(evaluate([8, 16, 16, 8])).toBe("T2/T3 paired: first-joint command");
    expect(evaluate([16, 8, 8, 16])).toBe("T1/T4 paired: opposite first-joint command");
  });

  test("refuses negative tension and non-positive radius inputs instead of fabricating output", () => {
    const negativeTension = stepSalisburyRobotHandSi({
      ...SALISBURY_HAND_DEFAULT_CONTROLS,
      tensionT3N: -1,
    });
    expect(negativeTension.refused).toBe(true);
    expect(negativeTension.refusalReason).toContain("T3");
    expect(negativeTension.jointTorquesNm).toEqual([0, 0, 0]);

    const zeroRadius = stepSalisburyRobotHandSi({
      ...SALISBURY_HAND_DEFAULT_CONTROLS,
      radiusScaleMm: 0,
    });
    expect(zeroRadius.refused).toBe(true);
    expect(zeroRadius.refusalReason).toContain("greater than zero");
  });

  test("keeps the Claim 2 idler probe separate from the printed torque law", () => {
    const fixed = stepSalisburyRobotHandSi(SALISBURY_HAND_DEFAULT_CONTROLS);
    const free = stepSalisburyRobotHandSi({
      ...SALISBURY_HAND_DEFAULT_CONTROLS,
      firstIdlerFixed: false,
    });

    expect(fixed.claim2IdlerProbe).toBe(true);
    expect(free.claim2IdlerProbe).toBe(false);
    expect(free.jointTorquesNm).toEqual(fixed.jointTorquesNm);
  });

  test("withholds Claim 1 topology without erasing the visitor's raw tension settings", () => {
    const controls = {
      ...SALISBURY_HAND_DEFAULT_CONTROLS,
      claim1RoutingPresent: false,
    };
    const withheld = stepSalisburyRobotHandSi(controls);
    expect(withheld.tendonTensionsN).toEqual([18, 22, 10, 14]);
    expect(withheld.claim1RoutingProbe).toBe(false);
    expect(withheld.claim2IdlerProbe).toBe(false);
    expect(withheld.sourceLawApplicable).toBe(false);
    expect(withheld.activeJointCoordinates).toBe(0);
    expect(withheld.activeCableEndCount).toBe(0);
    expect(withheld.jointTorquesNm).toEqual([0, 0, 0]);
    expect(withheld.displayJointAnglesDeg).toEqual([0, 0, 0]);
    expect(withheld.pullPattern).toBe("Claim 1 routing withheld");
  });

  test("names the generic law owners and the explicitly unparameterized contact candidate", () => {
    const telemetry = stepSalisburyRobotHandSi(SALISBURY_HAND_DEFAULT_CONTROLS);
    expect(telemetry.owners).toEqual({
      topology: SALISBURY_FRANKENSIM_TOPOLOGY_OWNER,
      revolute: SALISBURY_FRANKENSIM_REVOLUTE_OWNER,
      contactCandidate: SALISBURY_FRANKENSIM_CONTACT_OWNER,
    });
  });

  test("always exposes the historical dynamics boundary", () => {
    const telemetry = stepSalisburyRobotHandSi(SALISBURY_HAND_DEFAULT_CONTROLS);
    expect(telemetry.historicalDynamicsAvailable).toBe(false);
    expect(telemetry.historicalDynamicsRefusal).toContain("no historic pulley dimensions");
    expect(telemetry.historicalDynamicsRefusal).toContain("force closure");
  });

  test("reads direct controls without undocumented legacy aliases", () => {
    expect(readSalisburyRobotHandControls({})).toEqual(SALISBURY_HAND_DEFAULT_CONTROLS);
    expect(
      readSalisburyRobotHandControls({ tensionT1N: 7, radiusScaleMm: 12, firstIdlerFixed: false }),
    ).toEqual({
      ...SALISBURY_HAND_DEFAULT_CONTROLS,
      tensionT1N: 7,
      radiusScaleMm: 12,
      firstIdlerFixed: false,
    });
    expect(readSalisburyRobotHandControls({ firstIdlerFixed: 0 }).firstIdlerFixed).toBe(false);
    expect(readSalisburyRobotHandControls({ firstIdlerFixed: 1 }).firstIdlerFixed).toBe(true);
    expect(readSalisburyRobotHandControls({ claim1RoutingEnabled: 0 }).claim1RoutingPresent).toBe(
      false,
    );
  });
});
