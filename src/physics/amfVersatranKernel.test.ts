import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  AMF_VERSATRAN_DEFAULT_CONTROLS,
  AMF_VERSATRAN_MOTION_CHANNELS,
  readAmfVersatranControls,
  signedAmfVersatranPhaseDifference,
  stepAmfVersatranTopology,
  wrapAmfVersatranPhase,
} from "./amfVersatranKernel";

const ROOT = process.cwd();

describe("US 3,212,649 AMF Versatran source-bounded six-motion topology", () => {
  test("keeps exactly the six Claim 1 motions distinct", () => {
    expect(AMF_VERSATRAN_MOTION_CHANNELS.map((motion) => motion.id)).toEqual([
      "column-rotation",
      "carriage-lift",
      "arm-travel",
      "wrist-rotation",
      "wrist-swing",
      "gripper-operation",
    ]);
    expect(AMF_VERSATRAN_MOTION_CHANNELS.map((motion) => motion.label)).toEqual([
      "Column rotation about a vertical axis",
      "Carriage lift along the column",
      "Arm travel along a horizontal axis",
      "Wrist rotation about the arm/horizontal axis",
      "Wrist swing about a central vertical axis",
      "Gripper operation",
    ]);
    expect(AMF_VERSATRAN_MOTION_CHANNELS.map((motion) => motion.control)).toEqual([
      "columnRotation",
      "carriageLift",
      "armTravel",
      "wristRotation",
      "wristSwing",
      "gripperOperation",
    ]);
  });

  test("maps the three basic motions to a normalized record / feedback comparison", () => {
    const state = stepAmfVersatranTopology({
      ...AMF_VERSATRAN_DEFAULT_CONTROLS,
      armTravel: 0.2,
      carriageLift: 0.7,
      columnRotation: -0.4,
    });

    expect(state.programMode).toBe("manual-teach-and-record");
    expect(state.trackingState).toBe("manual-teach-and-record");
    expect(state.comparisonChannels.map((channel) => channel.recordedSignalPhase)).toEqual([
      0.3, 0.7, 0.2,
    ]);
    expect(state.comparisonChannels.map((channel) => channel.feedbackSignalPhase)).toEqual([
      0.3, 0.7, 0.2,
    ]);
    expect(state.comparisonChannels.map((channel) => channel.normalizedPhaseError)).toEqual([
      0, 0, 0,
    ]);
    expect(state.disclosedMotions).toHaveLength(6);
    expect(state.activeClaim).toBe(1);
  });

  test("makes playback comparison inspectable without inventing a physical error", () => {
    const state = stepAmfVersatranTopology({
      ...AMF_VERSATRAN_DEFAULT_CONTROLS,
      teachReplayMode: 1,
      resolverPhaseOffset: 0.2,
      gripperOperation: 0.2,
    });

    expect(state.programMode).toBe("automatic-recorded-signal-playback");
    expect(state.trackingState).toBe("playback-with-illustrative-comparison-offset");
    expect(state.comparisonChannels.map((channel) => channel.normalizedPhaseError)).toEqual([
      0.2, 0.2, 0.2,
    ]);
    expect(state.maximumNormalizedPhaseError).toBeCloseTo(0.2, 12);
    expect(state.phaseComparisonLaw).toContain("wrap");
    expect(state.activeClaim).toBe(8);

    const gripperClaim = stepAmfVersatranTopology({
      teachReplayMode: 1,
      gripperOperation: 0.8,
    });
    expect(gripperClaim.activeClaim).toBe(12);
  });

  test("wraps display phase boundaries deterministically", () => {
    expect(wrapAmfVersatranPhase(-0.15)).toBeCloseTo(0.85, 12);
    expect(wrapAmfVersatranPhase(1.15)).toBeCloseTo(0.15, 12);
    expect(signedAmfVersatranPhaseDifference(0.05, 0.95)).toBeCloseTo(0.1, 12);
    expect(signedAmfVersatranPhaseDifference(0.95, 0.05)).toBeCloseTo(-0.1, 12);
    expect(signedAmfVersatranPhaseDifference(0.5, 0)).toBe(0.5);
  });

  test("clamps public controls and keeps the refusal quantitative boundary explicit", () => {
    expect(
      readAmfVersatranControls({
        columnRotation: 4,
        carriageLift: -2,
        armTravel: Number.NaN,
        wristRotation: -4,
        wristSwing: 9,
        gripperOperation: 4,
        teachReplayMode: 0.49,
        resolverPhaseOffset: -3,
      }),
    ).toEqual({
      ...AMF_VERSATRAN_DEFAULT_CONTROLS,
      columnRotation: 1,
      carriageLift: 0,
      wristRotation: -1,
      wristSwing: 1,
      gripperOperation: 1,
      resolverPhaseOffset: -1,
    });

    const state = stepAmfVersatranTopology({});
    expect(state.refusal.refused).toBe(true);
    expect(state.refusal.reason).toContain("cylinder bore or stroke");
    expect(state.refusal.reason).toContain("payload");
    expect(state.refusal.reason).toContain("SI position, velocity, force");
    expect(state.positionLaw).toContain("normalized");
    expect(state.displayPose.normalizedArmSpan).toBeGreaterThan(0);
  });

  test("does not revive a generic three-axis wrist or fabricated SI controls", () => {
    const source = readFileSync(join(ROOT, "src/physics/amfVersatranKernel.ts"), "utf8");

    expect(source).not.toContain("wristRoll");
    expect(source).not.toContain("wristPitch");
    expect(source).not.toContain("wristYaw");
    expect(source).not.toContain("hydraulicPressureMpa");
    expect(source).not.toContain("verticalElevationMm");
    expect(source).not.toContain("horizontalReachMm");
  });
});
