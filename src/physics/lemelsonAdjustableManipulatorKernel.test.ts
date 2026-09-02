import { describe, expect, it } from "bun:test";
import {
  LEMELSON_DEFAULT_CONTROLS,
  readLemelsonControls,
  stepLemelsonManipulatorTopology,
} from "./lemelsonAdjustableManipulatorKernel";

describe("US 3,260,375 Lemelson Adjustable Manipulator Topology Kernel", () => {
  it("sanitizes out-of-bounds controls deterministically to default clamped ranges", () => {
    const raw = {
      carriagePosition: 999,
      columnElevation: -50,
      columnAzimuth: 100,
      wristPivot: -99,
      jawClosure: 4.5,
      cyclePhase: 99,
    };
    const controls = readLemelsonControls(raw);
    expect(controls.carriagePosition).toBe(1);
    expect(controls.columnElevation).toBe(0);
    expect(controls.columnAzimuth).toBe(1);
    expect(controls.wristPivot).toBe(-1);
    expect(controls.jawClosure).toBe(1);
    expect(controls.cyclePhase).toBe(5);
    expect(controls.claim1SelectedSwitchesEnabled).toBe(1);
    expect(controls.claim8BistableSwitchEnabled).toBe(1);
    expect(controls.claim15ServoHandoffEnabled).toBe(1);
  });

  it("calculates forward kinematic display poses within safe normalized bounds", () => {
    const state = stepLemelsonManipulatorTopology(LEMELSON_DEFAULT_CONTROLS);
    expect(state.displayPose.azimuthRad).toBeCloseTo(0.25 * Math.PI, 4);
    expect(state.displayPose.azimuthDeg).toBeCloseTo(45, 1);
    expect(state.displayPose.pivotRad).toBeCloseTo(-0.2 * (Math.PI / 2), 4);
    expect(state.displayPose.pivotDeg).toBeCloseTo(-18, 1);
    expect(state.displayPose.gripperState).toBe("gripping");
    expect(Number.isFinite(state.displayPose.toolTipX)).toBe(true);
    expect(Number.isFinite(state.displayPose.toolTipY)).toBe(true);
    expect(Number.isFinite(state.displayPose.toolTipZ)).toBe(true);
  });

  it("trips limit switch when manipulator azimuth aligns with adjustable stop", () => {
    const state = stepLemelsonManipulatorTopology({
      columnAzimuth: 0.75,
      stop2Azimuth: 0.75,
      cyclePhase: 2,
    });
    expect(state.sequencer.stop2Tripped).toBe(true);
    expect(state.sequencer.trippedLimitSwitches.length).toBeGreaterThan(0);
    expect(state.activeClaim).toBe(8);
    expect(state.activeClaimStatus).toBe("represented");
  });

  it("routes through sequential cycle phases accurately", () => {
    const p0 = stepLemelsonManipulatorTopology({ cyclePhase: 0 });
    expect(p0.sequencer.phaseName).toBe("Carriage Longitudinal Travel");
    expect(p0.sequencer.activeMotor).toBe("carriage");
    expect(p0.activeClaim).toBe(15);
    expect(p0.activeClaimStatus).toBe("represented");

    const p3 = stepLemelsonManipulatorTopology({ cyclePhase: 3 });
    expect(p3.sequencer.phaseName).toBe("Wrist Bevel Joint Pivot");
    expect(p3.sequencer.activeMotor).toBe("pivot");
    expect(p3.activeClaim).toBe(9);

    const p4 = stepLemelsonManipulatorTopology({ cyclePhase: 4 });
    expect(p4.sequencer.phaseName).toBe("Workpiece Gripper Actuation");
    expect(p4.sequencer.activeMotor).toBe("jaw");
    expect(p4.activeClaim).toBe(14);
  });

  it("withholds only the selected-switch events when Claim 1 is inverted", () => {
    const represented = stepLemelsonManipulatorTopology({
      cyclePhase: 1,
      columnElevation: 0.15,
      stop1Elevation: 0.15,
    });
    const withheld = stepLemelsonManipulatorTopology({
      cyclePhase: 1,
      columnElevation: 0.15,
      stop1Elevation: 0.15,
      claim1SelectedSwitchesEnabled: 0,
    });

    expect(represented.sequencer.stop1Tripped).toBe(true);
    expect(withheld.sequencer.stop1Tripped).toBe(false);
    expect(withheld.activeClaim).toBe(1);
    expect(withheld.activeClaimStatus).toBe("withheld");
    expect(withheld.displayPose).toEqual(represented.displayPose);
  });

  it("marks Claim 8 withheld without inventing rotary positioning outcomes", () => {
    const state = stepLemelsonManipulatorTopology({
      cyclePhase: 2,
      columnAzimuth: 0.75,
      stop2Azimuth: 0.75,
      claim8BistableSwitchEnabled: 0,
    });

    expect(state.activeClaim).toBe(8);
    expect(state.activeClaimStatus).toBe("withheld");
    expect(state.sequencer.stop2Tripped).toBe(false);
    expect(state.displayPose.azimuthDeg).toBeCloseTo(135, 8);
  });

  it("makes the Claim 15 handoff omission explicit while preserving the carriage pose", () => {
    const state = stepLemelsonManipulatorTopology({
      cyclePhase: 0,
      carriagePosition: 0.7,
      claim15ServoHandoffEnabled: 0,
    });

    expect(state.activeClaim).toBe(15);
    expect(state.activeClaimStatus).toBe("withheld");
    expect(state.sequencer.activeMotor).toBe("idle");
    expect(state.sequencer.nextScheduledAction).toContain("Claim 15");
    expect(state.displayPose.carriageNormalizedX).toBe(0.7);
  });

  it("maintains strict physical refusal for unquantified dynamic motor parameters", () => {
    const state = stepLemelsonManipulatorTopology(LEMELSON_DEFAULT_CONTROLS);
    expect(state.refusal.refused).toBe(true);
    expect(state.refusal.reason).toContain(
      "US 3,260,375 provides kinematic, limit-stop, and relay topology",
    );
  });
});
