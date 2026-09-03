import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import * as THREE from "three";
import {
  readWatsonRccControls,
  stepWatsonRccSi,
  WATSON_RCC_DEFAULT_CONTROLS,
} from "@/physics/watsonRccKernel";
import { buildWatsonRccModel, updateWatsonRccKinematics } from "./watsonRccModel";

describe("US 4,098,001 Paul C. Watson Remote Center Compliance Visual & Flexure Kinematics Boundary", () => {
  test("keeps the explicit dispatcher on the source-bounded canonical studio", () => {
    const dispatcher = readFileSync(
      join(process.cwd(), "src/components/patents/visuals/index.tsx"),
      "utf8",
    );
    expect(dispatcher).toContain("<WatsonRemoteCenterCompliance3D />");
    expect(dispatcher).not.toContain("<WatsonRcc3D />");
  });

  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const model = buildWatsonRccModel();
    expect(model.root).toBeDefined();
    expect(model.basePlate).toBeDefined();
    expect(model.intermediatePlate).toBeDefined();
    expect(model.remoteCenterPivot).toBeDefined();
    expect(model.toolPlate).toBeDefined();
    expect(model.pegMesh).toBeDefined();
    expect(model.parallelRods.length).toBe(3);
    expect(model.focalRods.length).toBe(3);
    expect(model.remoteCenterMarker).toBeDefined();
    expect(model.pegTipAnchor).toBeDefined();
    expect(model.holeBlockGroup).toBeDefined();
    expect(model.toolPlate.parent).toBe(model.remoteCenterPivot);
    expect(model.remoteCenterMarker.parent).toBe(model.remoteCenterPivot);

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

  test("keeps every alternate-model flexure and bellows endpoint coincident at control extremes", () => {
    const model = buildWatsonRccModel();
    const scenarios = [
      { lateralContactForceN: 0, appliedMomentNm: -5 },
      { lateralContactForceN: 80, appliedMomentNm: 0 },
      { lateralContactForceN: 80, appliedMomentNm: 5 },
    ];

    const expectRodEndpoints = (
      rod: THREE.Mesh,
      startOwner: THREE.Object3D,
      startKey: string,
      endOwner: THREE.Object3D,
      endKey: string,
    ) => {
      model.root.updateMatrixWorld(true);
      const actualStart = new THREE.Vector3(0, -0.5, 0).applyMatrix4(rod.matrixWorld);
      const actualEnd = new THREE.Vector3(0, 0.5, 0).applyMatrix4(rod.matrixWorld);
      const expectedStart = startOwner.localToWorld(
        (rod.userData[startKey] as THREE.Vector3).clone(),
      );
      const expectedEnd = endOwner.localToWorld((rod.userData[endKey] as THREE.Vector3).clone());
      expect(actualStart.distanceTo(expectedStart)).toBeLessThan(1e-8);
      expect(actualEnd.distanceTo(expectedEnd)).toBeLessThan(1e-8);
    };

    for (const scenario of scenarios) {
      const controls = readWatsonRccControls({
        ...WATSON_RCC_DEFAULT_CONTROLS,
        ...scenario,
      });
      const tel = stepWatsonRccSi(controls);
      updateWatsonRccKinematics(model, controls, tel);

      for (const rod of model.parallelRods) {
        expectRodEndpoints(
          rod,
          model.basePlate,
          "baseAnchor",
          model.intermediatePlate,
          "intermediateAnchor",
        );
      }
      for (const rod of model.focalRods) {
        expectRodEndpoints(
          rod,
          model.intermediatePlate,
          "intermediateAnchor",
          model.toolPlate,
          "toolAnchor",
        );
      }
      expectRodEndpoints(
        model.bellowsMesh,
        model.basePlate,
        "baseAnchor",
        model.toolPlate,
        "toolAnchor",
      );
      expect(model.intermediatePlate.position.x).toBeGreaterThanOrEqual(0);
      expect(model.toolPlate.position.x).toBeGreaterThanOrEqual(0);
    }

    model.dispose();
  });

  test("rotates the tool assembly about the displayed kernel-derived remote center", () => {
    const model = buildWatsonRccModel();
    try {
      for (const pegLengthM of [0.05, 0.15, 0.25]) {
        for (const appliedMomentNm of [-3, -0.5, 0.5, 3]) {
          const controls = readWatsonRccControls({
            ...WATSON_RCC_DEFAULT_CONTROLS,
            lateralContactForceN: 0,
            appliedMomentNm,
            pegLengthM,
            complianceMode: "focal_rcc",
          });
          const telemetry = stepWatsonRccSi(controls);
          updateWatsonRccKinematics(model, controls, telemetry);
          model.root.updateMatrixWorld(true);

          const pivot = model.remoteCenterPivot.getWorldPosition(new THREE.Vector3());
          const marker = model.remoteCenterMarker.getWorldPosition(new THREE.Vector3());
          const plate = model.toolPlate.getWorldPosition(new THREE.Vector3());
          const tip = model.pegTipAnchor.getWorldPosition(new THREE.Vector3());

          expect(marker.distanceTo(pivot)).toBeLessThan(1e-10);
          expect(tip.distanceTo(pivot)).toBeLessThan(1e-10);
          expect(plate.distanceTo(pivot)).toBeCloseTo(telemetry.remoteCenterDistanceM, 10);
          expect(tip.x).toBeCloseTo(telemetry.tipLateralDisplacementMm / 1000, 10);
          expect(tip.z).toBeCloseTo(0, 10);
        }
      }
    } finally {
      model.dispose();
    }
  });

  test("keeps the rendered peg tip on the reported lateral displacement in every compliance mode", () => {
    const model = buildWatsonRccModel();
    try {
      for (const complianceMode of ["focal_rcc", "uncompensated_wrist", "tension_mode"] as const) {
        const controls = readWatsonRccControls({
          lateralContactForceN: 35,
          appliedMomentNm: 1.2,
          pegLengthM: 0.21,
          complianceMode,
        });
        const telemetry = stepWatsonRccSi(controls);
        updateWatsonRccKinematics(model, controls, telemetry);
        model.root.updateMatrixWorld(true);

        const pivot = model.remoteCenterPivot.getWorldPosition(new THREE.Vector3());
        const marker = model.remoteCenterMarker.getWorldPosition(new THREE.Vector3());
        const plate = model.toolPlate.getWorldPosition(new THREE.Vector3());
        const tip = model.pegTipAnchor.getWorldPosition(new THREE.Vector3());

        expect(marker.distanceTo(pivot)).toBeLessThan(1e-10);
        expect(plate.distanceTo(pivot)).toBeCloseTo(telemetry.remoteCenterDistanceM, 10);
        expect(plate.distanceTo(tip)).toBeCloseTo(controls.pegLengthM, 10);
        expect(tip.x).toBeCloseTo(telemetry.tipLateralDisplacementMm / 1000, 10);
      }
    } finally {
      model.dispose();
    }
  });
});
