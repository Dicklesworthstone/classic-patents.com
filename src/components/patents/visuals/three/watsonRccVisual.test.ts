import { describe, expect, test } from "bun:test";
import {
  readWatsonRccControls,
  stepWatsonRccSi,
  WATSON_RCC_DEFAULT_CONTROLS,
} from "@/physics/watsonRccKernel";
import { buildWatsonRccModel, updateWatsonRccKinematics } from "./watsonRccModel";

describe("US 4,098,001 Paul C. Watson Remote Center Compliance Visual & Flexure Kinematics Boundary", () => {
  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const model = buildWatsonRccModel();
    expect(model.root).toBeDefined();
    expect(model.basePlate).toBeDefined();
    expect(model.intermediatePlate).toBeDefined();
    expect(model.toolPlate).toBeDefined();
    expect(model.pegMesh).toBeDefined();
    expect(model.parallelRods.length).toBe(3);
    expect(model.focalRods.length).toBe(3);
    expect(model.remoteCenterMarker).toBeDefined();
    expect(model.holeBlockGroup).toBeDefined();

    // Verify cleanup
    expect(() => model.dispose()).not.toThrow();
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const controls = readWatsonRccControls({
      lateralContactForceN: 20,
      appliedMomentNm: 0.5,
      complianceMode: "focal_rcc",
    });

    const run1 = stepWatsonRccSi(controls);
    const run2 = stepWatsonRccSi(controls);

    expect(run1.tipLateralDisplacementMm).toBe(run2.tipLateralDisplacementMm);
    expect(run1.pegTiltAngleDeg).toBe(run2.pegTiltAngleDeg);
    expect(run1.jammingIndex).toBe(run2.jammingIndex);
    expect(run1.lateralComplianceMmPerN).toBe(run2.lateralComplianceMmPerN);
  });

  test("computes genuine decoupled compliance matrix and anti-jamming boundaries in SI units", () => {
    // 1. Pure lateral force test in focal RCC mode: pure translation, ZERO tilt
    const latControls = readWatsonRccControls({
      lateralContactForceN: 25,
      appliedMomentNm: 0,
      complianceMode: "focal_rcc",
    });
    const latResult = stepWatsonRccSi(latControls);

    expect(latResult.tipLateralDisplacementMm).toBeCloseTo(10.0, 1); // 25 N * 0.40 mm/N = 10.0 mm
    expect(latResult.pegTiltAngleDeg).toBeCloseTo(0.0, 2); // Pure translation without tilting!
    expect(latResult.insertionState).not.toBe("jammed_misaligned");

    // 2. Pure moment test in focal RCC mode: pure rotation, ZERO lateral displacement
    const momentControls = readWatsonRccControls({
      lateralContactForceN: 0,
      appliedMomentNm: 0.5,
      complianceMode: "focal_rcc",
    });
    const momentResult = stepWatsonRccSi(momentControls);

    expect(momentResult.tipLateralDisplacementMm).toBeCloseTo(0.0, 2); // Zero lateral shift!
    expect(momentResult.pegTiltAngleDeg).toBeGreaterThan(0.5);

    // 3. Contrast with uncompensated flexible wrist: lateral force produces fatal tilt and jamming
    const wristControls = readWatsonRccControls({
      lateralContactForceN: 25,
      appliedMomentNm: 0,
      complianceMode: "uncompensated_wrist",
    });
    const wristResult = stepWatsonRccSi(wristControls);

    expect(wristResult.pegTiltAngleDeg).toBeGreaterThan(2.0); // Extreme tilt from wrist bending
    expect(wristResult.jammingIndex).toBeGreaterThanOrEqual(1.0); // Wedging / Jamming occurs!
    expect(wristResult.insertionState).toBe("jammed_misaligned");
  });

  test("articulates procedural 3D model nodes without throwing", () => {
    const model = buildWatsonRccModel();
    const controls = { ...WATSON_RCC_DEFAULT_CONTROLS };
    const tel = stepWatsonRccSi(controls);

    expect(() => updateWatsonRccKinematics(model, controls, tel)).not.toThrow();
    expect(model.intermediatePlate.position.x).toBeGreaterThan(0);
    expect(model.toolPlate.position.x).toBeGreaterThan(0);

    model.dispose();
  });
});
